import React, { useCallback, useEffect, useState } from "react";
import { GoBackButton, PageContainer } from "../../components";
import styled from "styled-components";
import { AutoComplete, Button, Input } from "antd";
import { createGame, getParticipants, getStatistics } from "../../api";
import { Player, Team } from "../../model";
import { useLocation } from "wouter";
import { DateTime } from "luxon";

const ParticipantAutocomplete = styled(AutoComplete)`
  width: 100%;
  height: 3rem;
`;

const RegisterButton = styled(Button)`
  margin-top: 1rem;
  width: 100%;
`;

const Row = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  > :first-child {
    flex: 1;
  }
`;

const RegisterContainer = styled.div`
  padding: 1rem;
`;

const ScoreInput = styled(Input)`
  width: 20vw;
  margin-left: 1rem;
  height: 3rem;
`;
export const RegisterGame = () => {
  const [, setLocation] = useLocation();
  const [homeParticipant, setHomeParticipant] = useState("");
  const [awayParticipant, setAwayParticipant] = useState("");
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { teams, players } = await getParticipants();
        setTeams(teams);
        setPlayers(players);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);

  const filterParticipants = useCallback(
    (
      inputValue: string,
      option: { label: string; value: string } | undefined,
    ) => {
      const needle = inputValue.toUpperCase();
      return option?.label.toUpperCase().indexOf(needle) !== -1;
    },
    [],
  );

  const registerGame = async () => {
    const homeId = participants.find((p) => p.label === homeParticipant)?.value;
    const awayId = participants.find((p) => p.label === awayParticipant)?.value;
    const score = { home: homeScore, away: awayScore };
    const endedAt = DateTime.now().toISO();
    try {
      const { data: game } = await createGame({
        homeId,
        awayId,
        score,
        endedAt,
      });
      setLocation("/");
    } catch (e) {
      console.log(e);
    }
  };

  const participants = [...teams, ...players].map((participant) => {
    return {
      label: "name" in participant ? participant.name : participant.nickName,
      value: participant._id,
    };
  });
  return (
    <PageContainer>
      <GoBackButton path={"/"} />
      <h1>Register Game</h1>
      <RegisterContainer>
        <Row>
          <ParticipantAutocomplete
            options={participants}
            value={homeParticipant}
            placeholder="Home participant"
            // @ts-expect-error filter typescript firm is stupid
            filterOption={filterParticipants}
            onChange={(value) => setHomeParticipant(value as string)}
            onSelect={(value) => {
              const participant = participants.find((p) => p.value === value);
              setHomeParticipant(participant?.label || "");
            }}
          />
          <ScoreInput
            type="number"
            value={homeScore}
            onChange={(e) => setHomeScore(+e.target.value)}
          />
        </Row>
        <Row>
          <ParticipantAutocomplete
            options={participants}
            value={awayParticipant}
            placeholder="Away participant"
            // @ts-expect-error filter typescript firm is stupid
            filterOption={filterParticipants}
            onChange={(value) => setAwayParticipant(value as string)}
            onSelect={(value) => {
              const participant = participants.find((p) => p.value === value);
              setAwayParticipant(participant?.label || "");
            }}
          />
          <ScoreInput
            type="number"
            value={awayScore}
            onChange={(e) => setAwayScore(+e.target.value)}
          />
        </Row>
        <RegisterButton onClick={registerGame} type="primary">
          create
        </RegisterButton>
      </RegisterContainer>
    </PageContainer>
  );
};
