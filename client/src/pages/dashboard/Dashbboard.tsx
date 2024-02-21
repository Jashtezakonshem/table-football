import React, { useCallback, useEffect, useMemo, useState } from "react";
import { PageContainer } from "../../components";
import { createGame, getParticipants, getStatistics } from "../../api";
import styled from "styled-components";
import ActionButton from "./components/ActionButton";
import { useLocation } from "wouter";
import { AutoComplete, Button, Drawer, Table } from "antd";
import { Player, Statistic, Team } from "../../model";

const Title = styled.h1`
  font-size: 2em;
  text-align: center;
  color: #0b4621;
`;

const StatisticsContainer = styled.div`
  flex: 1;
`;
const ActionsContainer = styled.div`
  padding: 36px;
  height: 25vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 36px;
`;

const GameDrawer = styled(Drawer)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const FormContainer = styled.div`
  width: 90vw;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;

const ParticipantAutocomplete = styled(AutoComplete)`
  margin-top: 1rem;
  width: 100%;
`;

const NewButton = styled(Button)`
  margin-top: 1rem;
`;

const StatisticsTable = styled(Table)`
  overflow: scroll;
`;

const statisticsColumns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Games played",
    dataIndex: "gamesPlayed",
    key: "gamesPlayed",
  },
  {
    title: "Games won",
    dataIndex: "gamesWon",
    key: "gamesWon",
  },
  {
    title: "Games lost",
    dataIndex: "gamesLost",
    key: "gamesLost",
  },
  {
    title: "Win ratio",
    dataIndex: "winRatio",
    key: "winRatio",
    render: (value: number) => `${(value * 100).toFixed(2)}%`,
  },
  {
    title: "GF",
    dataIndex: "gf",
    key: "gf",
  },
  {
    title: "GA",
    dataIndex: "ga",
    key: "ga",
  },
  {
    title: "GD",
    dataIndex: "gd",
    key: "gd",
  },
];
export const Dashboard = () => {
  const [, setLocation] = useLocation();
  const [open, setOpen] = useState(false);
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [homeParticipant, setHomeParticipant] = useState("");
  const [awayParticipant, setAwayParticipant] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const statistics = await getStatistics();
        const { teams, players } = await getParticipants();
        setTeams(teams);
        setPlayers(players);
        setStatistics(statistics);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);

  const participants = [...teams, ...players].map((participant) => {
    return {
      label: "name" in participant ? participant.name : participant.nickName,
      value: participant._id,
    };
  });

  // this is just for show off that I can use useCallback / memo etc
  // in this case it doesn't make any sense to use it
  const onActionClick = useCallback(
    (path: string) => {
      setLocation(path);
    },
    [setLocation],
  );

  const onClose = () => {
    setOpen(false);
  };

  const showDrawer = () => {
    setOpen(true);
  };

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

  const newGame = async () => {
    const homeId = participants.find((p) => p.label === homeParticipant)?.value;
    const awayId = participants.find((p) => p.label === awayParticipant)?.value;
    try {
      const { data: game } = await createGame({ homeId, awayId });
      setLocation(`/new-game/${game._id}`);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <PageContainer>
      <Title>Table Football manager</Title>
      <StatisticsContainer>
        <StatisticsTable
          rowKey={"name"}
          dataSource={statistics}
          columns={statisticsColumns}
          pagination={false}
        />
        ;
      </StatisticsContainer>
      <ActionsContainer>
        <ActionButton
          onClick={showDrawer}
          icon="PlusOutlined"
          title="New game"
        />
        <ActionButton
          onClick={() => onActionClick("/participants")}
          icon="UserOutlined"
          title="Participants"
        />
        <ActionButton
          onClick={() => onActionClick("/register-game")}
          icon="BookOutlined"
          title="Register"
        />
        <ActionButton
          icon="UnorderedListOutlined"
          title="History"
          disabled={true}
          reason={"Not implemented"}
        />
      </ActionsContainer>
      <GameDrawer
        placement="bottom"
        title={"New Game"}
        onClose={onClose}
        open={open}
      >
        {open && (
          <FormContainer>
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
            <NewButton onClick={newGame} type="primary">
              create
            </NewButton>
          </FormContainer>
        )}
      </GameDrawer>
    </PageContainer>
  );
};
