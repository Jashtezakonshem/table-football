import React, { useEffect, useState } from "react";
import { PageContainer, GoBackButton } from "../../components";
import { Score } from "./components/Score";
import {
  endGame,
  getGameById,
  getParticipants,
  updateGameScore,
} from "../../api";
import { useLocation, useParams } from "wouter";
import { Game, Score as ScoreType } from "../../model";
import { getParticipantNames } from "../../utils/game";
import { Button } from "antd";
import styled from "styled-components";

const EndGameButton = styled(Button)`
  position: absolute;
  height: 2rem;
  top: calc(50% - 1rem);
  background-color: white;
  width: 30vw;
  left: calc(50% - 15vw);
  color: black;
  justify-content: center;
  align-items: center;
  display: flex;
`;
export const NewGame = () => {
  const params = useParams();
  const [, setLocation] = useLocation();

  const [game, setGame] = useState<Game>();
  const [score, setScore] = useState<ScoreType>({ home: 0, away: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const { id } = params;
      const game = await getGameById(id);
      setGame(game);
      if (game.score) {
        setScore(game.score);
      }
    };
    fetchData();
  }, []);
  const updateScore = (isHome: boolean, value: number) => {
    const newScore = isHome ? score.home + value : score.away + value;
    const totalScore = score.home + score.away;
    if (newScore < 0 || (totalScore === 10 && value > 0)) {
      return;
    }
    const updatedScore = { ...score, [isHome ? "home" : "away"]: newScore };
    setScore(updatedScore);
    // in this case I'm not using the response from the server
    // I'm optimisticly updating the score so I won't freeze ui with some loading etc
    updateGameScore(game!._id, updatedScore);
  };

  const onEndGameClick = async () => {
    await endGame(game!._id);
    setLocation("/");
  };

  const { homeName, awayName } = getParticipantNames(game);

  const endGameVisible = score.home + score.away === 10;

  return (
    <PageContainer>
      <GoBackButton path={"/"} />
      <Score
        participantName={homeName}
        isHome={true}
        updateScore={updateScore}
        score={score}
      />
      {endGameVisible && (
        <EndGameButton onClick={onEndGameClick} type="primary" size="large">
          End Game
        </EndGameButton>
      )}
      <Score
        participantName={awayName}
        isHome={false}
        updateScore={updateScore}
        score={score}
      />
    </PageContainer>
  );
};
