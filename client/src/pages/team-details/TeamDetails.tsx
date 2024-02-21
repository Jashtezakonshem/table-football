import React, { useEffect, useState } from "react";
import { Game, Player, Statistic, Team } from "../../model";
import {
  getPlayerById,
  getPlayerGames,
  getPlayerStatistics,
  getTeamById,
  getTeamGames,
  getTeamStatistics,
} from "../../api";
import { useParams } from "wouter";
import { GoBackButton, PageContainer, Statistics } from "../../components";

export const TeamDetails = () => {
  const params = useParams();
  const [team, setTeam] = useState<Team>();
  const [statistics, setStatistics] = useState<Statistic>();
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { id } = params;
        const { data: team } = await getTeamById(id);
        const { data: teamStatistics } = await getTeamStatistics(id);
        const { data: gamesPlayed } = await getTeamGames(id);
        setTeam(team);
        setStatistics(teamStatistics);
        setGames(gamesPlayed);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);

  return (
    <PageContainer>
      <GoBackButton path={"/participants"} />
      <h1>{team?.name}</h1>
      <div>
        players:
        <b>{team?.players?.map((p) => <div key={p._id}>{p.nickName}</div>)}</b>
      </div>
      <Statistics statistics={statistics} games={games} />
    </PageContainer>
  );
};
