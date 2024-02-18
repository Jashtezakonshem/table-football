import { ObjectId } from 'https://deno.land/x/web_bson@v0.3.0/mod.js'
import db from '../db.ts'
import { Player } from '../controllers/players.ts'
import _ from 'npm:lodash@4.17.21'
import { Team } from '../controllers/teams.ts'

export const getNameValidity = async (name: string): Promise<boolean> => {
  if (!name) {
    return false
  }
  const team = await db.collection<Team>('teams').findOne({ name })
  return !team
}
export const getPlayerIdsValidity = async (
  playerIds: string[],
): Promise<boolean> => {
  // third condition is to check that I'm not adding the same player twice
  if (
    !Array.isArray(playerIds) ||
    playerIds?.length === 0 ||
    _.uniq(playerIds).length !== playerIds.length
  ) {
    return false
  }
  const areValidObjectIds = playerIds.every((id) => ObjectId.isValid(id))
  if (!areValidObjectIds) {
    return false
  }
  const players = db.collection<Player>('players')
  const foundPlayers = await players.find({
    _id: { $in: playerIds.map((id) => new ObjectId(id)) },
  })
  return foundPlayers.length === playerIds.length
}
