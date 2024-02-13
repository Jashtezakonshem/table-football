import { config } from 'https://deno.land/x/dotenv/mod.ts'
import { MongoClient } from 'https://deno.land/x/atlas_sdk@v1.1.2/mod.ts'
const { API_KEY, APP_ID } = config()

const BASE_URL =
  `https://eu-central-1.aws.data.mongodb-api.com/app/${APP_ID}/endpoint/data/v1`
const DATA_SOURCE = 'cluster0'
const DATABASE = 'table-football'

const client = new MongoClient({
  endpoint: BASE_URL,
  dataSource: DATA_SOURCE, // e.g. "Cluster0"
  auth: {
    apiKey: API_KEY,
  },
})
const db = client.database(DATABASE)

export default db
