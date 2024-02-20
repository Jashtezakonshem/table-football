import React from "react";
import styled from "styled-components";
import { PRIMARY, SECONDARY } from "../../../style/colors";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Score as ScoreType } from "../../../model";

type ScoreProps = {
  isHome: boolean;
  updateScore: (isHome: boolean, score: number) => void;
  score: ScoreType;
  participantName: string;
};

const Container = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const ScoreRow = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
`;

const Minus = styled(MinusOutlined)`
  color: white;
  font-size: 3rem;
`;

const Plus = styled(PlusOutlined)`
  color: white;
  font-size: 3rem;
`;

const Value = styled.div`
  color: white;
  font-size: 3rem;
`;

const Name = styled.div`
  color: white;
  font-size: 3rem;
  margin-bottom: 2rem;
  margin-top: 2rem;
`;

export const Score = ({
  isHome,
  updateScore,
  score,
  participantName,
}: ScoreProps) => {
  const backgroundColor = isHome ? PRIMARY : SECONDARY;
  const value = isHome ? score.home : score.away;
  return (
    <Container style={{ backgroundColor }}>
      <Name>{participantName}</Name>
      <ScoreRow>
        <Minus onClick={() => updateScore(isHome, -1)} />
        <Value>{value}</Value>
        <Plus onClick={() => updateScore(isHome, 1)} />
      </ScoreRow>
    </Container>
  );
};
