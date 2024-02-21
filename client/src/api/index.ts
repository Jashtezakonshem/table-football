import axios from "axios";
import { Player, Score } from "../model";

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
  return await axios.post("/teams", { name, playerIds });
};

export const getTeamById = async (id?: string) => {
  return await axios.get(`/teams/${id}`);
};

export const getTeamStatistics = async (id?: string) => {
  return await axios.get(`/teams/${id}/statistics`);
};

export const getTeamGames = async (id?: string) => {
  return await axios.get(`/teams/${id}/games`);
};

export const createPlayer = async (player: Omit<Player, "_id">) => {
  return await axios.post("/players", player);
};

export const getPlayerById = async (id?: string) => {
  return await axios.get(`/players/${id}`);
};

export const getPlayerStatistics = async (id?: string) => {
  return await axios.get(`/players/${id}/statistics`);
};

export const getPlayerGames = async (id?: string) => {
  return await axios.get(`/players/${id}/games`);
};

type GamePayload = {
  homeId?: string;
  awayId?: string;
  endedAt?: string;
  score?: Score;
};
export const createGame = async ({
  homeId,
  awayId,
  score,
  endedAt,
}: GamePayload) => {
  return await axios.post("/games", { homeId, awayId, score, endedAt });
};

export const getGameById = async (id?: string) => {
  return await axios.get(`/games/${id}`);
};

export const updateGameScore = async (id: string, score: Score) => {
  return await axios.put(`/games/${id}/score`, score);
};

export const endGame = async (id: string) => {
  return await axios.put(`/games/${id}/end`);
};

export const getGamePlayedByTwoParticipants = async (
  id?: string,
  id2?: string,
) => {
  return await axios.get(`/participants/${id}/vs/${id2}/games`);
};

export const getPlayersComparison = async (id?: string, id2?: string) => {
  return await axios.get(`/players/${id}/compare/${id2}`);
};

export const getTeamsComparison = async (id?: string, id2?: string) => {
  return await axios.get(`/teams/${id}/compare/${id2}`);
};
