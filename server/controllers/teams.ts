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
  const allTeams = await teams.find()
  res.headers = {
    'Content-Type': 'application/json',
  }
  res.reply = JSON.stringify(allTeams)
})

router.post('/teams', async (req: Req, res: Res) => {
  const body = await bodyParse(req)
  const teamPayload: TeamPayload = body.field
  const { name, playerIds } = teamPayload
  const isNameValid = await getNameValidity(name)
  const arePlayerIdsValid = await getPlayerIdsValidity(playerIds)
  if (!isNameValid || !arePlayerIdsValid) {
    res.status = 400
    res.headers = {
      'Content-Type': 'application/json',
    }
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
  res.headers = {
    'Content-Type': 'application/json',
  }
  res.reply = JSON.stringify(team)
})
