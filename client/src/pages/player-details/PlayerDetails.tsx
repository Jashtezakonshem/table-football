import React, { useEffect, useState } from "react";
import { Game, Player, Statistic } from "../../model";
import { getPlayerById, getPlayerGames, getPlayerStatistics } from "../../api";
import { useParams } from "wouter";
import { GameRow, GoBackButton, PageContainer } from "../../components";
import styled from "styled-components";
import { Progress } from "antd";

const StatisticsContainer = styled.div`
  display: flex;
  padding: 1rem;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
`;

const GamesWrapper = styled.div`
  padding: 1rem;
`;
export const PlayerDetails = () => {
  const params = useParams();
  const [player, setPlayer] = useState<Player>();
  const [statistics, setStatistics] = useState<Statistic>();
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { id } = params;
      const player = await getPlayerById(id);
      const playerStatistics = await getPlayerStatistics(id);
      const gamesPlayed = await getPlayerGames(id);
      setPlayer(player);
      setStatistics(playerStatistics);
      setGames(gamesPlayed);
    };
    fetchData();
  }, []);

  const winRatioPercentage = (statistics?.winRatio ?? 0) * 100;
  const goalDifference = (statistics?.gf ?? 0) - (statistics?.ga ?? 0);
  const goalsPercentage =
    ((statistics?.gf ?? 0) / ((statistics?.ga ?? 0) + (statistics?.gf ?? 0))) *
    100;
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
      <StatisticsContainer>
        Win Ratio: {winRatioPercentage.toFixed(2)}%
        <Progress
          format={() => "%"}
          percent={100}
          strokeColor={"red"}
          success={{ percent: winRatioPercentage }}
        />
        Goal difference: {goalDifference}
        <Progress
          format={() => "Goal"}
          percent={100}
          strokeColor={"red"}
          success={{ percent: goalsPercentage }}
        />
        <div>
          Games played : <b>{statistics?.gamesPlayed}</b>
        </div>
        <div>
          Games won : <b>{statistics?.gamesWon}</b>
        </div>
        <div>
          Games lost : <b>{statistics?.gamesLost}</b>
        </div>
        <div>
          Goals for : <b>{statistics?.gf}</b>
        </div>
        <div>
          Goals against : <b>{statistics?.ga}</b>
        </div>
        <div>
          Goals difference : <b>{statistics?.gd}</b>
        </div>
      </StatisticsContainer>
      <GamesWrapper>
        {games.map((game) => (
          <GameRow key={game._id} game={game} />
        ))}
      </GamesWrapper>
    </PageContainer>
  );
};
