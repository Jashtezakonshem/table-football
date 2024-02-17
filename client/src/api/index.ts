import axios from "axios";

export const getStatistics = async () => {
  const { data } = await axios.get("/statistics");
  return data;
};
