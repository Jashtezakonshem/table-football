import React, { useCallback, useEffect, useMemo, useState } from "react";
import { GoBackButton, PageContainer } from "../../components";
import { createPlayer, createTeam, getParticipants } from "../../api";
import {
  Button,
  Drawer,
  Tabs,
  Radio,
  RadioChangeEvent,
  Input,
  AutoComplete,
  Tag,
  InputRef,
} from "antd";
import styled from "styled-components";
import { useLocation } from "wouter";
import { Player, Team } from "../../model";
import { ArrowRightOutlined, PlusOutlined } from "@ant-design/icons";

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
  border: 1px solid blueviolet;
  border-radius: 4px;
  padding: 0.5rem 0;
`;

const PlayerRow = styled.div`
  margin-top: 1rem;
  > :first-child {
    font-weight: bold;
  }
  > div {
    flex: 1;
  }
  > :last-child {
    flex: 1;
    display: flex;
    justify-content: center;
  }
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  border: 1px solid blueviolet;
  border-radius: 4px;
  padding: 0.5rem 0;
`;

const PlayersCol = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const TabWrapper = styled.div`
  padding: 0.5rem;
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
  // using ref is a smart way to avoid using state for input values since it won't trigger a rerender
  const nameRef = React.createRef<InputRef>();
  const nickNameRef = React.createRef<InputRef>();
  const firstNameRef = React.createRef<InputRef>();
  const lastNameRef = React.createRef<InputRef>();
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
    [],
  );

  const removePlayer = (playerId: string) => {
    const newPlayers = newTeamPlayers.filter(
      (player) => player._id !== playerId,
    );
    setNewTeamPlayers(newPlayers);
  };

  const onAddTeamClick = async () => {
    const playerIds = newTeamPlayers.map((player) => player._id);
    const name = nameRef.current?.input?.value || "";
    const createdTeam = await createTeam({
      name,
      playerIds,
    });
    console.log(createdTeam);
    const updatedTeams = [...teams, createdTeam];
    setTeams(updatedTeams);
    onClose();
  };

  const onAddPlayerClick = async () => {
    const nickName = nickNameRef.current?.input?.value || "";
    const firstName = firstNameRef.current?.input?.value || "";
    const lastName = lastNameRef.current?.input?.value || "";
    try {
      const createdPlayer = await createPlayer({
        nickName,
        firstName,
        lastName,
      });
      const updatedPlayers = [...players, createdPlayer];
      setPlayers(updatedPlayers);
      // unlucky name but it's already defined
      onClose();
    } catch (e) {
      console.log(e);
    }
  };

  const goToPlayerDetails = (id: string) => {
    setLocation(`/players/${id}`);
  };

  const goToTeamDetails = (id: string) => {
    setLocation(`/teams/${id}`);
  };

  const addTeamDisable = newTeamPlayers.length !== 2;

  return (
    <PageContainer>
      <GoBackButton path={"/"} />
      <Tabs defaultActiveKey="players" centered>
        <Tabs.TabPane tab="Players" key="players">
          <TabWrapper>
            {players.map((player) => (
              <PlayerRow
                onClick={() => goToPlayerDetails(player._id)}
                key={player._id}
              >
                <div>{player.nickName}</div>
                <div>{player.firstName}</div>
                <div>{player.lastName}</div>
                <ArrowRightOutlined />
              </PlayerRow>
            ))}
          </TabWrapper>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Teams" key="teams">
          <TabWrapper>
            {teams.map((team) => (
              <TeamRow onClick={() => goToTeamDetails(team._id)} key={team._id}>
                <div className="bold">{team.name}</div>
                <PlayersCol>
                  {team.players.map((player) => (
                    <div key={player._id}>{player.nickName}</div>
                  ))}
                </PlayersCol>
                <ArrowRightOutlined />
              </TeamRow>
            ))}
          </TabWrapper>
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
        {newParticipantType === "team" && open && (
          <FormContainer>
            <FormInput placeholder="Team name" ref={nameRef} />
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
        {/* using open as render condition so when I add a new player or team this will rerender causing the input to clear*/}
        {newParticipantType === "player" && open && (
          <FormContainer>
            <FormInput placeholder="Nick name" ref={nickNameRef} />
            <FormInput placeholder="First name" ref={firstNameRef} />
            <FormInput placeholder="Last name" ref={lastNameRef} />
            <NewButton onClick={onAddPlayerClick} type="primary">
              Add player
            </NewButton>
          </FormContainer>
        )}
      </NewParticipantDrawer>
    </PageContainer>
  );
};
