import React, { useCallback, useEffect } from "react";
import { PageContainer } from "../../components/PageContainer";
import { getStatistics } from "../../api";
import styled from "styled-components";
import ActionButton from "./components/ActionButton";
import { useLocation } from "wouter";

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
export const Dashboard = () => {
  const [, setLocation] = useLocation();
  useEffect(() => {
    const fetchData = async () => {
      const statistics = await getStatistics();
      console.log(statistics);
    };
    fetchData();
  }, []);

  // totally unnecessary but since I defined Action Button as memo I don't want
  // the component to rerender on every click
  // this is just for show off that I can use useCallback / memo etc
  const onActionClick = useCallback(
    (path: string) => {
      setLocation(path);
    },
    [setLocation],
  );

  return (
    <PageContainer>
      <Title>Table Football manager</Title>
      <StatisticsContainer></StatisticsContainer>
      <ActionsContainer>
        <ActionButton
          onClick={() => onActionClick("/new-game")}
          icon="PlusOutlined"
          title="New game"
        />
        <ActionButton
          onClick={() => onActionClick("/register-game")}
          icon="BookOutlined"
          title="Register"
        />
        <ActionButton
          onClick={() => onActionClick("/participants")}
          icon="UserOutlined"
          title="Participants"
        />
        <ActionButton
          onClick={() => onActionClick("/games")}
          icon="UnorderedListOutlined"
          title="History"
        />
      </ActionsContainer>
    </PageContainer>
  );
};
