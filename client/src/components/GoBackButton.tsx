import React from "react";
import { useLocation } from "wouter";
import { ArrowLeftOutlined } from "@ant-design/icons";
import styled from "styled-components";

const Left = styled(ArrowLeftOutlined)`
  position: fixed;
  top: 2rem;
  left: 2rem;
`;
export const GoBackButton = ({
  path,
  color = "#FFF",
}: {
  path: string;
  color?: string;
}) => {
  const [, setLocation] = useLocation();
  return <Left color={color} onClick={() => setLocation(path)} />;
};
