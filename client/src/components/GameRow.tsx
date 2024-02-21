import React from "react";
import { Game } from "../model";
import { getParticipantNames } from "../utils/game";
import styled from "styled-components";
import { PRIMARY } from "../style/colors";
import { DateTime } from "luxon";
import { BarChartOutlined, EnterOutlined } from "@ant-design/icons";
import { useLocation } from "wouter";

const Container = styled.div`
  width: 100%;
  margin: 1rem 0;
  border: 1px solid ${PRIMARY};
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const Vs = styled.div`
  font-size: 2rem;
`;
const ParticipantColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const DateContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: bold;
  font-size: 0.8rem;
`;

const IconWrapper = styled.div`
  width: 2rem;
`;
export const GameRow = ({
  game,
  disabled = false,
}: {
  game: Game;
  disabled?: boolean;
}) => {
  const [, setLocation] = useLocation();
  const formattedDate = game.endedAt
    ? DateTime.fromISO(game.endedAt).toLocaleString(DateTime.DATE_SHORT)
    : null;
  const { homeName, awayName } = getParticipantNames(game);

  const onGameClick = () => {
    if (disabled) {
      return;
    }
    if (game.endedAt) {
      setLocation(`/compare/${game.homeId}/${game.awayId}`);
    } else {
      setLocation(`/new-game/${game._id}`);
    }
  };
  return (
    <>
      {formattedDate && <DateContainer>{formattedDate}</DateContainer>}
      {!formattedDate && <DateContainer>Game in progress!</DateContainer>}
      <Container onClick={onGameClick}>
        <ParticipantColumn>
          <div>{homeName}</div>
          <div>
            <b>{game?.score?.home}</b>
          </div>
        </ParticipantColumn>
        <Vs>VS</Vs>
        <ParticipantColumn>
          <div>{awayName}</div>
          <div>
            <b> {game?.score?.away}</b>
          </div>
        </ParticipantColumn>
        <IconWrapper>
          {formattedDate && !disabled && <BarChartOutlined />}
          {!formattedDate && !disabled && <EnterOutlined />}
        </IconWrapper>
      </Container>
    </>
  );
};
