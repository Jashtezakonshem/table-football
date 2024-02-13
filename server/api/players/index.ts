import { Req, Res } from "https://deno.land/x/denorest@v4.2/mod.ts";
import { Database } from "https://deno.land/x/mongo@v0.32.0/mod.ts";

export const getPlayers = (db: Database) => async (_req: Req, res: Res) => {
  try {
    const players = db.collection("players");
    const allPlayers = await players.find().toArray();
    console.log("allPlayers", allPlayers);
    res.status = 200;
    res.headers = {
      "Content-Type": "application/json",
    };
    res.reply = JSON.stringify(allPlayers);
  } catch (error) {
    res.status = 500;
    res.reply = JSON.stringify({ error: error.message });
  }
};
