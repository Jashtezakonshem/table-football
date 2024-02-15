import { ObjectId } from 'https://deno.land/x/web_bson@v0.3.0/mod.js'
import db from '../db.ts'
import { Game, PlayerType } from '../controllers/games.ts'
import { Player } from '../controllers/players.ts'
import { Team } from '../controllers/teams.ts'

export const isGamePlayedBySamePlayerType = async (
  homeId: string,
  awayId: string,
  playerType: PlayerType,
): Promise<boolean> => {
  const collectionName = playerType === 'single' ? 'players' : 'teams'
  const collection = db.collection<Player | Team>(collectionName)
  const foundMembers = await collection.find({
    _id: { $in: [new ObjectId(homeId), new ObjectId(awayId)] },
  })
  return foundMembers.length === 2
}

export const getPlayersOngoingGames = async (
  player1Id: string,
  player2Id: string,
) => {
  const games = db.collection<Game>('games')
  const ongoingGames = await games.find({
    $or: [
      {
        homeId: new ObjectId(player1Id),
        endedAt: { $exists: false },
      },
      {
        homeId: new ObjectId(player2Id),
        endedAt: { $exists: false },
      },
      {
        awayId: new ObjectId(player1Id),
        endedAt: { $exists: false },
      },
      {
        awayId: new ObjectId(player2Id),
        endedAt: { $exists: false },
      },
    ],
  })
  return ongoingGames
}
