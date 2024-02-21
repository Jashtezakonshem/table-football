import { router } from '../router.ts'
import {
  bodyParse,
  pathParse,
  Req,
  Res,
} from 'https://deno.land/x/denorest@v3.1/mod.ts'
import db from '../db.ts'
import { ObjectId } from 'https://deno.land/x/web_bson@v0.3.0/mod.js'
import { datetime } from 'https://deno.land/x/ptera/mod.ts'
import {
  getPlayersOngoingGames,
  isGamePlayedBySamePlayerType,
} from '../utils/games.validation.ts'
import _ from 'npm:lodash@4.17.21'
import { Team } from './teams.ts'
import { Player } from './players.ts'

export type PlayerType = 'single' | 'double'

export type Score = {
  home: number
  away: number
}
export type Game = {
  _id: ObjectId
  playerType: PlayerType
  homeId: ObjectId
  awayId: ObjectId
  homeParticipant?: Player | Team
  awayParticipant?: Player | Team
  endedAt?: string // using ISO 8601 date string
  score?: Score
}

export type GamePayload = {
  homeId: string
  awayId: string
  endedAt?: string
  score?: Score
}

const GAME_TOTAL_SCORE = 10

router.get('/games', async (_req: Req, res: Res) => {
  const games = db.collection<Game>('games')
  const allGames = await games.find()
  res.reply = JSON.stringify(allGames)
})

const getGamesByTeamIdOrPlayerId = async (req: Req, res: Res) => {
  const games = db.collection<Game>('games')
  const path = pathParse(req)
  const id = path.params.id
  const allGames = await games.find({
    $or: [{ homeId: new ObjectId(id) }, { awayId: new ObjectId(id) }],
  })
  // every game has the same player type
  const playerType = allGames[0]?.playerType
  const collectionName = playerType === 'single' ? 'players' : 'teams'
  const participantsCollection = db.collection<Player>(collectionName)
  // for each game I need to find the player or team
  const playerIds = _.uniq(
    allGames.map((game) => [
      game.homeId,
      game.awayId,
    ]).flat(),
  )
  const allParticipants = await participantsCollection.find({
    _id: { $in: playerIds },
  })
  const gamesWithParticipants = allGames.map((game) => {
    const homeParticipant = allParticipants.find((player) =>
      player._id.equals(game.homeId)
    )
    const awayParticipant = allParticipants.find((player) =>
      player._id.equals(game.awayId)
    )
    return {
      ...game,
      homeParticipant: homeParticipant,
      awayParticipant: awayParticipant,
    }
  })
  res.reply = JSON.stringify(gamesWithParticipants)
}

router.get('/players/:id/games', getGamesByTeamIdOrPlayerId)

router.get('/teams/:id/games', getGamesByTeamIdOrPlayerId)

router.post('/games', async (req: Req, res: Res) => {
  const body = await bodyParse(req)
  const gamePayload: GamePayload = body.field
  const { homeId, awayId, endedAt, score } = gamePayload
  if (!homeId || !awayId) {
    res.status = 400
    res.reply = JSON.stringify({ error: 'Invalid payload' })
    return
  }
  if (homeId === awayId) {
    res.status = 400
    res.reply = JSON.stringify({ error: 'Home and away players are the same' })
    return
  }
  const playersOngoingGames = await getPlayersOngoingGames(homeId, awayId)
  const playersHaveOngoingGame = playersOngoingGames.length > 0
  if (playersHaveOngoingGame) {
    res.status = 400
    res.reply = JSON.stringify({
      error: 'One or more Players have ongoing game',
    })
    return
  }

  const gamePlayedBySamePlayerType = await isGamePlayedBySamePlayerType(
    homeId,
    awayId,
  )
  if (!gamePlayedBySamePlayerType) {
    res.status = 400
    res.reply = JSON.stringify({
      error: 'Game must be played by the same player type',
    })
    return
  }
  if (gamePlayedBySamePlayerType === 'double') {
    const teams = await Promise.all([
      db.collection<Team>('teams').findOne({ _id: new ObjectId(homeId) }),
      db.collection<Team>('teams').findOne({ _id: new ObjectId(awayId) }),
    ])
    const playerIds = teams.map((team) => team?.playerIds).flat()
    const playerIdsAsStrings = playerIds.map((id) => id.toString())
    const uniquePlayerIds = _.uniq(playerIdsAsStrings)
    if (uniquePlayerIds.length !== 4) {
      res.status = 400
      res.reply = JSON.stringify({
        error: 'A player can only play in one team at a time',
      })
      return
    }
  }
  const isValidEnd = datetime(endedAt).isValid()
  const homeScore = gamePayload.score?.home ?? 0
  const awayScore = gamePayload.score?.away ?? 0
  const isValidScore = homeScore + awayScore === GAME_TOTAL_SCORE
  // if the user creates a game with an endedAt date, then the score must be present
  // otherwise is a new game and the score is not required
  if (endedAt && isValidEnd && !isValidScore) {
    res.status = 400
    res.reply = JSON.stringify({
      error: 'Invalid score: the sum of the goal must be 10',
    })
    return
  }
  const games = db.collection<Game>('games')
  const { insertedId } = await games.insertOne({
    _id: new ObjectId(),
    homeId: new ObjectId(homeId),
    awayId: new ObjectId(awayId),
    playerType: gamePlayedBySamePlayerType,
    score,
  })
  const game = await games.findOne({ _id: new ObjectId(insertedId) })
  res.status = 201
  res.reply = JSON.stringify(game)
})

router.get('/games/:id', async (req: Req, res: Res) => {
  const path = pathParse(req)
  const id = path.params.id
  const games = db.collection<Game>('games')
  const game = await games.findOne({ _id: new ObjectId(id) })
  if (!game) {
    res.status = 404
    res.reply = JSON.stringify({ error: 'Game not found' })
    return
  }
  const { homeId, awayId } = game
  const participantsCollection = game.playerType === 'single'
    ? 'players'
    : 'teams'
  const homeParticipant = await db.collection<Player | Team>(
    participantsCollection,
  ).findOne({
    _id: homeId,
  })
  const awayParticipant = await db.collection<Player | Team>(
    participantsCollection,
  ).findOne({
    _id: awayId,
  })
  res.reply = JSON.stringify({
    ...game,
    homeParticipant,
    awayParticipant,
  })
})

// Update score
router.put('/games/:id/score', async (req: Req, res: Res) => {
  const body = await bodyParse(req)
  const path = pathParse(req)
  const id = path.params.id
  const score: Score = body.field
  const games = db.collection<Game>('games')
  const game = await games.findOne({ _id: new ObjectId(id) })
  if (!game) {
    res.status = 404
    res.reply = JSON.stringify({ error: 'Game not found' })
    return
  }
  // in this case I'm updating the score so could be less than GAME_TOTAL_SCORE
  const isValidScore = score?.home + score?.away <= GAME_TOTAL_SCORE
  console.log(isValidScore, score?.home, score?.away, GAME_TOTAL_SCORE)
  if (!isValidScore) {
    res.status = 400
    res.reply = JSON.stringify({
      error: 'Invalid score: the sum of the goal must be 10 or less',
    })
    return
  }
  await games.updateOne(
    { _id: new ObjectId(id) },
    { $set: { score } },
  )
  const updatedGame = await games.findOne({ _id: new ObjectId(id) })
  res.reply = JSON.stringify(updatedGame)
})

//end game
router.put('/games/:id/end', async (req: Req, res: Res) => {
  const path = pathParse(req)
  const id = path.params.id
  const games = db.collection<Game>('games')
  const game = await games.findOne({ _id: new ObjectId(id) })
  if (!game) {
    res.status = 404
    res.reply = JSON.stringify({ error: 'Game not found' })
    return
  }
  if (game.endedAt) {
    res.status = 400
    res.reply = JSON.stringify({ error: 'Game already ended' })
    return
  }
  await games.updateOne(
    { _id: new ObjectId(id) },
    { $set: { endedAt: datetime().toISO() } },
  )
  const updatedGame = await games.findOne({ _id: new ObjectId(id) })
  res.reply = JSON.stringify(updatedGame)
})

router.get('/participants/:id/vs/:id2/games', async (req: Req, res: Res) => {
  const path = pathParse(req)
  const id = path.params.id
  const id2 = path.params.id2
  const gamesCollection = db.collection<Game>('games')
  const games = await gamesCollection.find({
    $or: [
      { homeId: new ObjectId(id), awayId: new ObjectId(id2) },
      { homeId: new ObjectId(id2), awayId: new ObjectId(id) },
    ],
  })
  const playerType = games[0]?.playerType
  const participantsCollection = db.collection<Player | Team>(
    playerType === 'single' ? 'players' : 'teams',
  )
  const firstParticipant = await participantsCollection.findOne({
    _id: new ObjectId(id),
  })
  const secondParticipant = await participantsCollection.findOne({
    _id: new ObjectId(id2),
  })
  const gamesWithParticipants = games.map((game) => {
    return {
      ...game,
      homeParticipant: game.homeId.equals(firstParticipant?._id)
        ? firstParticipant
        : secondParticipant,
      awayParticipant: game.awayId.equals(firstParticipant?._id)
        ? firstParticipant
        : secondParticipant,
    }
  })
  res.reply = JSON.stringify(gamesWithParticipants)
})
