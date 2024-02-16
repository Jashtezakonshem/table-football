import { app, router } from './router.ts'

// in a real scenario probably I would some fs library to import all controllers through a loop in controllers folder
import './controllers/players.ts'
import './controllers/teams.ts'
import './controllers/games.ts'
import './controllers/statistics.ts'

app.set(router)
app.listen(8080)
