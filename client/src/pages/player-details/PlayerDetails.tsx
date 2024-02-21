import React, { useEffect, useState } from "react";
import { Game, Player, Statistic } from "../../model";
import { getPlayerById, getPlayerGames, getPlayerStatistics } from "../../api";
import { useParams } from "wouter";
import { GoBackButton, PageContainer, Statistics } from "../../components";

export const PlayerDetails = () => {
  const params = useParams();
  const [player, setPlayer] = useState<Player>();
  const [statistics, setStatistics] = useState<Statistic>();
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { id } = params;
        const { data: player } = await getPlayerById(id);
        const { data: playerStatistics } = await getPlayerStatistics(id);
        const { data: gamesPlayed } = await getPlayerGames(id);
        setPlayer(player);
        setStatistics(playerStatistics);
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
      <h1>{player?.nickName}</h1>
      <div>
        firstName: <b>{player?.firstName}</b>
      </div>
      <div>
        lastName: <b>{player?.lastName}</b>
      </div>
      <Statistics statistics={statistics} games={games} />
    </PageContainer>
  );
};
