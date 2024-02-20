import { ObjectId } from 'https://deno.land/x/web_bson@v0.3.0/mod.js'
import db from '../db.ts'
import { Game, PlayerType } from '../controllers/games.ts'
import { Player } from '../controllers/players.ts'
import { Team } from '../controllers/teams.ts'

export const isGamePlayedBySamePlayerType = async (
  homeId: string,
  awayId: string,
): Promise<PlayerType | undefined> => {
  const playersCollection = db.collection<Player>('players')
  const teamsCollection = db.collection<Team>('teams')
  const foundPlayers = await playersCollection.find({
    _id: { $in: [new ObjectId(homeId), new ObjectId(awayId)] },
  })
  if (foundPlayers.length === 2) {
    return 'single'
  }
  const foundTeams = await teamsCollection.find({
    _id: { $in: [new ObjectId(homeId), new ObjectId(awayId)] },
  })
  if (foundTeams.length === 2) {
    return 'double'
  }
  return undefined
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
