import {
  Database,
  MongoClient,
} from "https://deno.land/x/mongo@v0.32.0/mod.ts";

const uri =
  "mongodb+srv://oltioff:Technis91@cluster0.vnrfdfv.mongodb.net?authMechanism=SCRAM-SHA-1";

export default {
  db: {} as Database,
  init: async function () {
    console.log("Connecting to MongoDB Atlas...");
    try {
      const client = new MongoClient();
      await client.connect(uri);
      console.log("Connected to MongoDB Atlas!");
      this.db = client.database("table-footble");
      return this.db;
    } catch (error) {
      console.error("Error connecting to MongoDB Atlas:", error);
      throw error;
    }
  },
};
