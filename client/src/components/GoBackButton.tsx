import React from "react";
import { useLocation } from "wouter";
import { ArrowLeftOutlined } from "@ant-design/icons";
import styled from "styled-components";

const Left = styled(ArrowLeftOutlined)`
  position: fixed;
  top: 1rem;
  left: 2rem;
  color: ${(props) => props.color};
  z-index: 9999;
`;
export const GoBackButton = ({
  path,
  color = "#000",
}: {
  path: string;
  color?: string;
}) => {
  const [, setLocation] = useLocation();
  return (
    <Left color={color} onClick={() => setLocation(path, { replace: true })} />
  );
};
