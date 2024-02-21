import React, { useEffect, useState } from "react";
import {
  getGamePlayedByTwoParticipants,
  getPlayersComparison,
  getTeamsComparison,
} from "../../api";
import { useParams } from "wouter";
import { Game, Statistic } from "../../model";
import { GameRow, GoBackButton, PageContainer } from "../../components";
import { Progress } from "antd";
import styled from "styled-components";

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
export const Comparison = () => {
  const params = useParams();
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { id, id2 } = params;
        const { data: games } = await getGamePlayedByTwoParticipants(id, id2);
        const playerType = games[0]?.playerType;
        let statistics;
        if (playerType === "single") {
          const { data } = await getPlayersComparison(id, id2);
          statistics = data;
        } else {
          const { data } = await getTeamsComparison(id, id2);
          statistics = data;
        }
        setStatistics(statistics);
        setGames(games);
      } catch (error) {
        // handle error
      }
    };
    fetchData();
  }, []);
  const participant1 = statistics?.[0]?.name;
  const participant2 = statistics?.[1]?.name;
  const winRatioPercentage = (statistics?.[0]?.winRatio ?? 0) * 100;
  const participant1Goals = statistics?.[0]?.gf ?? 0;
  const participant2Goals = statistics?.[1]?.gf ?? 0;
  const participant1Wins = statistics?.[0]?.gamesWon ?? 0;
  const participant2Wins = statistics?.[1]?.gamesWon ?? 0;
  return (
    <PageContainer>
      <GoBackButton path={"/participants"} />
      <h1>
        {participant1} vs {participant2}
      </h1>
      <StatisticsContainer>
        <b>Wins</b>
        {participant1} {participant1Wins} - {participant2} {participant2Wins}
        <Progress
          format={() => ""}
          percent={100}
          strokeColor={"Head to head"}
          success={{ percent: winRatioPercentage }}
        />
        <b>Goals</b>
        {participant1} {participant1Goals} - {participant2} {participant2Goals}
      </StatisticsContainer>
      <GamesWrapper>
        {games.map((game) => (
          <GameRow disabled={true} key={game._id} game={game} />
        ))}
      </GamesWrapper>
    </PageContainer>
  );
};
