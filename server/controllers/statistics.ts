import { router } from '../router.ts'
import db from '../db.ts'
import { ObjectId } from 'https://deno.land/x/web_bson@v0.3.0/mod.js'
import { Game } from './games.ts'
import { Team } from './teams.ts'
import { Player } from './players.ts'
import { defaultHeaders } from '../utils/constants.ts'

type Statistic = {
  name: string
  gamesPlayed: number
  gamesWon: number
  gamesLost: number
  winRatio: number
  gf: number
  ga: number
  gd: number
}

type StatisticMap = {
  [key: string]: Statistic
}

const INITIAL_EMPTY_STATISTIC = {
  gamesPlayed: 0,
  gamesWon: 0,
  gamesLost: 0,
  winRatio: 0,
  gf: 0,
  ga: 0,
  gd: 0,
}

const filterEndedGamesByParticipant = (game: Game, playerId: ObjectId) =>
  game.endedAt &&
  (new ObjectId(game.homeId).equals(playerId) ||
    new ObjectId(game.awayId).equals(playerId))

const computeStatistics = (
  games: Game[],
  participants: Player[] | Team[],
): StatisticMap => {
  return participants.reduce((acc: StatisticMap, participant) => {
    const name = 'name' in participant ? participant.name : participant.nickName
    const endedGamesPlayedByParticipant = games.filter((g) =>
      filterEndedGamesByParticipant(g, participant._id)
    )
    const statistics = endedGamesPlayedByParticipant.reduce(
      (acc: Statistic, game) => {
        const isParticipantHome = new ObjectId(game.homeId).equals(
          participant._id,
        )
        const isParticipantAway = new ObjectId(game.awayId).equals(
          participant._id,
        )
        const gameScore = game.score || { home: 0, away: 0 }
        // I need both of these since with 10 balls could be a draw
        const isParticipantWinner =
          (isParticipantHome && gameScore.home > gameScore.away) ||
          (isParticipantAway && gameScore.away > gameScore.home)
        const isParticipantLoser =
          (isParticipantHome && gameScore.home < gameScore.away) ||
          (isParticipantAway && gameScore.away < gameScore.home)
        acc.gamesPlayed += 1
        acc.gamesWon += isParticipantWinner ? 1 : 0
        acc.gamesLost += isParticipantLoser ? 1 : 0
        acc.winRatio = acc.gamesWon / acc.gamesPlayed
        acc.gf += isParticipantHome ? gameScore.home : gameScore.away
        acc.ga += isParticipantHome ? gameScore.away : gameScore.home
        acc.gd = acc.gf - acc.ga
        return acc
      },
      { ...INITIAL_EMPTY_STATISTIC, name },
    )
    return { ...acc, [participant._id.toString()]: statistics }
  }, {})
}
router.get('/statistics', async (_req, res) => {
  const gamesCollection = db.collection<Game>('games')
  const teamsCollection = db.collection<Team>('teams')
  const playersCollection = db.collection<Player>('players')
  const games = await gamesCollection.find()
  const teams = await teamsCollection.find()
  const players = await playersCollection.find()
  const playersStatistics: StatisticMap = computeStatistics(games, players)
  const teamsStatistics: StatisticMap = computeStatistics(games, teams)
  const allStatistics = {
    ...playersStatistics,
    ...teamsStatistics,
  }
  const statistics = Object.values(allStatistics).sort((a, b) =>
    b.winRatio - a.winRatio
  )
  res.headers = defaultHeaders
  return res.reply = JSON.stringify(statistics)
})
