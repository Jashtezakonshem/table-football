import { router } from '../router.ts'
import {
  bodyParse,
  pathParse,
  Req,
  Res,
} from 'https://deno.land/x/denorest@v3.1/mod.ts'
import db from '../db.ts'
import { ObjectId } from 'https://deno.land/x/web_bson@v0.3.0/mod.js'
import {
  getNameValidity,
  getPlayerIdsValidity,
} from '../utils/teams.validation.ts'
import _ from 'npm:lodash@4.17.21'
import { defaultHeaders } from '../utils/constants.ts'

export type Team = {
  _id: ObjectId
  name: string
  playerIds: ObjectId[]
}

export type TeamPayload = {
  name: string
  playerIds: string[]
}

router.get('/teams', async (_req: Req, res: Res) => {
  const teams = db.collection<Team>('teams')
  const playersCollection = db.collection('players')
  const allTeams = await teams.find()
  const playerIds = _.uniq(allTeams.map((team) => team.playerIds).flat())
  const allPlayers = await playersCollection.find({
    _id: { $in: playerIds },
  })
  const teamWithPlayers = allTeams.map((team) => {
    const players = allPlayers.filter((player) =>
      team.playerIds.some((id) => id.equals(player._id))
    )
    return { ...team, players }
  })
  res.headers = defaultHeaders
  res.reply = JSON.stringify(teamWithPlayers)
})

router.post('/teams', async (req: Req, res: Res) => {
  const body = await bodyParse(req)
  const teamPayload: TeamPayload = body.field
  const { name, playerIds } = teamPayload
  const isNameValid = await getNameValidity(name)
  const arePlayerIdsValid = await getPlayerIdsValidity(playerIds)
  if (!isNameValid || !arePlayerIdsValid) {
    console.log('Invalid team payload')
    res.status = 400
    res.headers = defaultHeaders
    let error = ''
    if (!name) {
      error = 'Team name is required'
    } else if (!isNameValid) {
      error = 'Team name already taken'
    } else {
      error = 'Invalid players'
    }
    res.reply = JSON.stringify({ error })
    return
  }
  const teams = db.collection<Team>('teams')
  const { insertedId } = await teams.insertOne({
    _id: new ObjectId(),
    name,
    playerIds: playerIds.map((id) => new ObjectId(id)),
  })
  const team = await teams.findOne({ _id: new ObjectId(insertedId) })
  res.headers = defaultHeaders
  res.reply = JSON.stringify(team)
})
