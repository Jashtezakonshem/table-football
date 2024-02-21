import { Progress } from "antd";
import { GameRow } from "./GameRow";
import React from "react";
import styled from "styled-components";
import { Game, Statistic as StatisticType } from "../model";

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

type StatisticProps = {
  statistics?: StatisticType;
  games: Game[];
};
export const Statistics = ({ statistics, games }: StatisticProps) => {
  const winRatioPercentage = (statistics?.winRatio ?? 0) * 100;
  const goalDifference = (statistics?.gf ?? 0) - (statistics?.ga ?? 0);
  const goalsPercentage =
    ((statistics?.gf ?? 0) / ((statistics?.ga ?? 0) + (statistics?.gf ?? 0))) *
    100;
  return (
    <>
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
    </>
  );
};
