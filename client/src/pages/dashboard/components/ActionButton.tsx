import React, { memo } from "react";
import { Button, Tooltip } from "antd";
import {
  UnorderedListOutlined,
  PlusOutlined,
  BookOutlined,
  UserOutlined,
} from "@ant-design/icons";
import styled from "styled-components";

type IconName =
  | "UnorderedListOutlined"
  | "PlusOutlined"
  | "BookOutlined"
  | "UserOutlined";
type ActionButtonProps = {
  icon: IconName;
  onClick?: () => void;
  title: string;
  disabled?: boolean;
  reason?: string;
};

const Container = styled(Button)`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.span`
  margin-top: 8px;
  font-size: 1.2em;
  font-weight: bold;
`;

const iconMap = {
  UnorderedListOutlined,
  PlusOutlined,
  BookOutlined,
  UserOutlined,
};

const ActionButton = ({
  icon,
  onClick,
  title,
  disabled,
  reason,
}: ActionButtonProps) => {
  const Icon = iconMap[icon];
  return (
    <Tooltip title={reason} trigger="click">
      <Container
        type={"primary"}
        onClick={onClick}
        style={{ backgroundColor: disabled ? "grey" : undefined }}
      >
        <Icon color={"#FFF"} />
        <Title>{title}</Title>
      </Container>
    </Tooltip>
  );
};

//in this case I'm using memo but the callback I pass is not a safe dependency
// since it's an anonymous function, it will be recreated every time the component is rendered
// this is only for show off purposes
export default memo(ActionButton);
