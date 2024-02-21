import { router } from '../router.ts'
import {
  bodyParse,
  pathParse,
  Req,
  Res,
} from 'https://deno.land/x/denorest@v3.1/mod.ts'
import db from '../db.ts'
import { ObjectId } from 'https://deno.land/x/web_bson@v0.3.0/mod.js'
import { defaultHeaders } from '../utils/constants.ts'

export type Player = {
  _id: ObjectId
  firstName: string
  lastName: string
  nickName: string
}

export type PlayerPayload = Omit<Player, '_id'>

/**
 * Get all players
 * @returns {Player[]} the list of players
 */
router.get('/players', async (_req: Req, res: Res) => {
  const players = db.collection<Player>('players')
  const allPlayers = await players.find()
  res.reply = JSON.stringify(allPlayers)
})

/**
 * Get a player by id
 * @param {string} id the player id
 * @returns {Player} the player
 */
router.get('/players/:id', async (req: Req, res: Res) => {
  const players = db.collection<Player>('players')
  const path = pathParse(req)
  const id = path.params.id
  const player = await players.findOne({ _id: new ObjectId(id) })
  res.reply = JSON.stringify(player)
})

/**
 * Create a player
 * @param {PlayerPayload} playerPayload the player payload
 * @returns {Player} the created player
 */
router.post('/players', async (req: Req, res: Res) => {
  const body = await bodyParse(req)
  const playerPayload: PlayerPayload = body.field
  const { firstName, lastName, nickName } = playerPayload
  if (!firstName || !lastName || !nickName) {
    res.status = 400
    res.reply = JSON.stringify({ error: 'Invalid payload' })
    return
  }
  const players = db.collection<Player>('players')
  const playersWithSameNickName = await players.find({ nickName })
  if (playersWithSameNickName.length > 0) {
    res.status = 400
    res.reply = JSON.stringify({ error: 'Nickname already taken' })
    return
  }
  const { insertedId } = await players.insertOne({
    _id: new ObjectId(),
    ...playerPayload,
  })
  const player = await players.findOne({ _id: new ObjectId(insertedId) })
  res.status = 201
  res.reply = JSON.stringify(player)
})
