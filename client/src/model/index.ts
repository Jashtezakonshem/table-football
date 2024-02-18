export type PlayerType = "single" | "double";

export type Score = {
  home: number;
  away: number;
};
export type Game = {
  _id: string;
  playerType: PlayerType;
  homeId: string;
  awayId: string;
  endedAt?: string; // using ISO 8601 date string
  score?: Score;
};

export type Player = {
  _id: string;
  firstName: string;
  lastName: string;
  nickName: string;
};

export type Team = {
  _id: string;
  name: string;
  playerIds: string[];
  players: Player[];
};

type Statistic = {
  name: string;
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  winRatio: number;
  gf: number;
  ga: number;
  gd: number;
};
