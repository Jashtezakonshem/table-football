import api from "./api/index.ts";
import { MongoClient } from "https://deno.land/x/mongo@v0.32.0/mod.ts";

const client = new MongoClient();
await client.connect(
  "mongodb+srv://oltioff:Technis91@cluster0.vnrfdfv.mongodb.net?authMechanism=SCRAM-SHA-1",
);
console.log("Connected to MongoDB Atlas!");

const db = client.database("table-football");
api(db);
