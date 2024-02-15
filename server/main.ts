import { app, router } from './router.ts'

// probably I would some fs library to import all controllers through a loop in controllers folder
import './controllers/players.ts'
import './controllers/teams.ts'
import './controllers/games.ts'

app.set(router)
app.listen(8080)
