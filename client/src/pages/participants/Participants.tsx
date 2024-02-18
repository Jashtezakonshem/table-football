import React, { useCallback, useEffect, useMemo, useState } from "react";
import { PageContainer } from "../../components/PageContainer";
import { createTeam, getParticipants } from "../../api";
import {
  Button,
  Drawer,
  Tabs,
  Radio,
  RadioChangeEvent,
  Input,
  AutoComplete,
  Tag,
} from "antd";
import styled from "styled-components";
import { useLocation } from "wouter";
import { Player, Team } from "../../model";
import { PlusOutlined } from "@ant-design/icons";

const TeamRow = styled.div`
  margin-top: 12px;
  > :first-child {
    font-weight: bold;
  }
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`;

const PlayerRow = styled.div`
  margin-top: 12px;
  > :first-child {
    font-weight: bold;
  }
  > div {
    flex: 1;
    text-align: center;
  }
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`;

const PlayersCol = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const NewParticipantFab = styled(Button)`
  width: 3rem !important;
  height: 3rem;
  border-radius: 50%;
  position: fixed;
  bottom: 2rem;
  right: 2rem;
`;

const NewParticipantDrawer = styled(Drawer)`
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

const NewButton = styled(Button)`
  margin-top: 1.5rem;
`;

const PlayerAutoComplete = styled(AutoComplete)`
  margin-top: 1rem;
  width: 100%;
`;

const FormInput = styled(Input)`
  margin-top: 1rem;
`;

const Chip = styled(Tag)`
  display: inline;
  margin-right: 1rem;
`;

const ChipWrapper = styled.div`
  margin-top: 1rem;
`;
export const Participants = () => {
  const [open, setOpen] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [newTeamPlayers, setNewTeamPlayers] = useState<Player[]>([]);
  const [search, setSearch] = useState("");
  const [newParticipantType, setNewParticipantType] = useState<
    "team" | "player"
  >("player");
  const [, setLocation] = useLocation();
  useEffect(() => {
    const fetchData = async () => {
      const { teams, players } = await getParticipants();
      setTeams(teams);
      setPlayers(players);
    };
    fetchData();
  }, []);

  const onNewParticipantTypeChange = (e: RadioChangeEvent) => {
    setNewParticipantType(e.target.value);
  };

  const onClose = () => {
    setOpen(false);
  };

  // no need to use useMemo since it's not a heavy computation but it's just to show you I know about it
  // in this case everytime I select a player I remove it from the list of available players
  const playersOption = useMemo(() => {
    return players
      .filter((player) => {
        return !newTeamPlayers.some((p) => p._id === player._id);
      })
      .map((player) => ({ value: player._id, label: player.nickName }));
  }, [players, newTeamPlayers]);

  const filterPlayers = useCallback(
    (
      inputValue: string,
      option: { label: string; value: string } | undefined,
    ) => {
      const needle = inputValue.toUpperCase();
      return option?.label.toUpperCase().indexOf(needle) !== -1;
    },
    [setSearch],
  );

  const removePlayer = (playerId: string) => {
    const newPlayers = newTeamPlayers.filter(
      (player) => player._id !== playerId,
    );
    setNewTeamPlayers(newPlayers);
  };

  const onAddTeamClick = async () => {
    const playerIds = newTeamPlayers.map((player) => player._id);
    createTeam({
      name: "Vecchi",
      playerIds,
    });
  };

  const addTeamDisable = newTeamPlayers.length !== 2;

  return (
    <PageContainer>
      <Tabs defaultActiveKey="players" centered>
        <Tabs.TabPane tab="Players" key="players">
          {players.map((player) => (
            <PlayerRow key={player._id}>
              <div>{player.nickName}</div>
              <div>{player.firstName}</div>
              <div>{player.lastName}</div>
            </PlayerRow>
          ))}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Teams" key="teams">
          {teams.map((team) => (
            <TeamRow key={team._id}>
              <div className="bold">{team.name}</div>
              <PlayersCol>
                {team.players.map((player) => (
                  <div key={player._id}>{player.nickName}</div>
                ))}
              </PlayersCol>
            </TeamRow>
          ))}
        </Tabs.TabPane>
      </Tabs>
      <NewParticipantFab
        onClick={() => setOpen(true)}
        type="primary"
        icon={<PlusOutlined />}
      />
      <NewParticipantDrawer
        placement="bottom"
        title={"Add new participant"}
        onClose={onClose}
        open={open}
      >
        <Radio.Group
          onChange={onNewParticipantTypeChange}
          value={newParticipantType}
        >
          <Radio value={"player"}>Player</Radio>
          <Radio value={"team"}>Team</Radio>
        </Radio.Group>
        {newParticipantType === "team" && (
          <FormContainer>
            <FormInput placeholder="Team name" />
            <PlayerAutoComplete
              disabled={newTeamPlayers.length === 2}
              options={playersOption}
              value={search}
              placeholder="Select players"
              // @ts-expect-error filter typescript firm is stupid
              filterOption={filterPlayers}
              onChange={(value) => setSearch(value as string)}
              onSelect={(value) => {
                const player = players.find((p) => p._id === value);
                setSearch("");
                if (player) {
                  setNewTeamPlayers([...newTeamPlayers, player]);
                }
              }}
            />
            {newTeamPlayers.length > 0 && (
              <ChipWrapper>
                {newTeamPlayers.map((player) => (
                  <Chip
                    key={player._id}
                    onClose={() => removePlayer(player._id)}
                    closable
                  >
                    {player.nickName}
                  </Chip>
                ))}
              </ChipWrapper>
            )}
            <NewButton
              onClick={onAddTeamClick}
              disabled={addTeamDisable}
              type="primary"
            >
              Add team
            </NewButton>
          </FormContainer>
        )}
        {newParticipantType === "player" && (
          <FormContainer>
            <FormInput placeholder="Nick name" />
            <FormInput placeholder="First name" />
            <FormInput placeholder="Last name" />
            <NewButton type="primary">Add player</NewButton>
          </FormContainer>
        )}
      </NewParticipantDrawer>
    </PageContainer>
  );
};
