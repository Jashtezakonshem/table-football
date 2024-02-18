import axios from "axios";

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
  const response = await axios.post("/teams", { name, playerIds });
};
