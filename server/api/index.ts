import { Router, WebApp } from "https://deno.land/x/denorest@v4.2/mod.ts";
import { getPlayers } from "./players/index.ts";
import { Database } from "https://deno.land/x/mongo@v0.32.0/mod.ts";

export default (db: Database) => {
  const app = new WebApp();
  const router = new Router();

  router.get("/players", getPlayers(db));

  app.set(router);

  app.listen(8080);
};
