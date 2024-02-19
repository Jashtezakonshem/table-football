import axios from "axios";
import { Player } from "../model";

export const getStatistics = async () => {
  const { data } = await axios.get("/statistics");
  return data;
};

export const getParticipants = async () => {
  const { data: teams } = await axios.get("/teams");
  const { data: players } = await axios.get("/players");
  return { teams, players };
};

export const createTeam = async ({
  name,
  playerIds,
}: {
  name: string;
  playerIds: string[];
}) => {
  try {
    const { data } = await axios.post("/teams", { name, playerIds });
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const createPlayer = async (player: Omit<Player, "_id">) => {
  try {
    const { data } = await axios.post("/players", player);
    return data;
  } catch (e) {
    console.log(e);
  }
};
