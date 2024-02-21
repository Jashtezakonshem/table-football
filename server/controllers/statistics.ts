import { router } from '../router.ts'
import db from '../db.ts'
import { ObjectId } from 'https://deno.land/x/web_bson@v0.3.0/mod.js'
import { Game } from './games.ts'
import { Team } from './teams.ts'
import { Player } from './players.ts'
import { defaultHeaders } from '../utils/constants.ts'
import { pathParse } from 'https://deno.land/x/denorest@v3.1/mod.ts'

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
  return res.reply = JSON.stringify(statistics)
})

router.get('/teams/:id/statistics', async (req, res) => {
  const teamsCollection = db.collection<Team>('teams')
  const path = pathParse(req)
  const id = path.params.id
  const team = await teamsCollection.findOne({ _id: new ObjectId(id) })
  if (!team) {
    res.status = 404
    res.reply = JSON.stringify({ error: 'Team not found' })
    return
  }
  const gamesCollection = db.collection<Game>('games')
  const gamesPlayedByTeam = await gamesCollection.find({
    $or: [
      { homeId: new ObjectId(id) },
      { awayId: new ObjectId(id) },
    ],
  })
  const statistics = computeStatistics(gamesPlayedByTeam, [team])
  return res.reply = JSON.stringify(statistics)
})

router.get('/players/:id/statistics', async (req, res) => {
  const playersCollection = db.collection<Player>('players')
  const path = pathParse(req)
  const id = path.params.id
  const player = await playersCollection.findOne({ _id: new ObjectId(id) })
  if (!player) {
    res.status = 404
    res.reply = JSON.stringify({ error: 'Player not found' })
    return
  }
  const gamesCollection = db.collection<Game>('games')
  const gamesPlayedByPlayer = await gamesCollection.find({
    $or: [
      { homeId: new ObjectId(id) },
      { awayId: new ObjectId(id) },
    ],
  })
  const statistics = computeStatistics(gamesPlayedByPlayer, [player])
  return res.reply = JSON.stringify(statistics[id] ? statistics[id] : {})
})

router.get('/players/:id/compare/:id2', async (req, res) => {
  const playersCollection = db.collection<Player>('players')
  const path = pathParse(req)
  const id = path.params.id
  const id2 = path.params.id2
  const player1 = await playersCollection.findOne({ _id: new ObjectId(id) })
  const player2 = await playersCollection.findOne({ _id: new ObjectId(id2) })
  if (!player1 || !player2) {
    res.status = 404
    res.reply = JSON.stringify({ error: 'Player not found' })
    return
  }
  const gamesCollection = db.collection<Game>('games')
  const gamesPlayedByBoth = await gamesCollection.find({
    $or: [
      { homeId: new ObjectId(id), awayId: new ObjectId(id2) },
      { homeId: new ObjectId(id2), awayId: new ObjectId(id) },
    ],
  })
  const statistics = computeStatistics(gamesPlayedByBoth, [player1, player2])
  return res.reply = JSON.stringify(Object.values(statistics))
})

router.get('/teams/:id/compare/:id2', async (req, res) => {
  const teamsCollection = db.collection<Team>('teams')
  const path = pathParse(req)
  const id = path.params.id
  const id2 = path.params.id2
  const team1 = await teamsCollection.findOne({ _id: new ObjectId(id) })
  const team2 = await teamsCollection.findOne({ _id: new ObjectId(id2) })
  if (!team1 || !team2) {
    res.status = 404
    res.reply = JSON.stringify({ error: 'Team not found' })
    return
  }
  const gamesCollection = db.collection<Game>('games')
  const gamesPlayedByBoth = await gamesCollection.find({
    $or: [
      { homeId: new ObjectId(id), awayId: new ObjectId(id2) },
      { homeId: new ObjectId(id2), awayId: new ObjectId(id) },
    ],
  })
  const statistics = computeStatistics(gamesPlayedByBoth, [team1, team2])
  return res.reply = JSON.stringify(Object.values(statistics))
})
