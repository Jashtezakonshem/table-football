import axios from "axios";
import { Game, Player, Score, Statistic } from "../model";

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

export const getPlayerById = async (
  id?: string,
): Promise<Player | undefined> => {
  try {
    const { data } = await axios.get(`/players/${id}`);
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const getPlayerStatistics = async (
  id?: string,
): Promise<Statistic | undefined> => {
  try {
    const { data } = await axios.get(`/players/${id}/statistics`);
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const getPlayerGames = async (id?: string) => {
  try {
    const { data } = await axios.get(`/players/${id}/games`);
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const createGame = async (homeId?: string, awayId?: string) => {
  try {
    const { data } = await axios.post("/games", { homeId, awayId });
    console.log(data);
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const getGameById = async (id?: string) => {
  try {
    const { data } = await axios.get(`/games/${id}`);
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const updateGameScore = async (id: string, score: Score) => {
  try {
    const { data } = await axios.put(`/games/${id}/score`, score);
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const endGame = async (id: string) => {
  try {
    const { data } = await axios.put(`/games/${id}/end`);
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const getGamePlayedByTwoParticipants = async (
  id?: string,
  id2?: string,
): Promise<Game[]> => {
  try {
    const { data } = await axios.get(`/participants/${id}/vs/${id2}/games`);
    return data;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const getPlayersComparison = async (id?: string, id2?: string) => {
  try {
    const { data } = await axios.get(`/players/${id}/compare/${id2}`);
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const getTeamsComparison = async (id?: string, id2?: string) => {
  try {
    const { data } = await axios.get(`/teams/${id}/compare/${id2}`);
    return data;
  } catch (e) {
    console.log(e);
  }
};
