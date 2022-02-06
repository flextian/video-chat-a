import React from "react";
import styled from "styled-components";

export const ChatBox = () => {
  return (
    <Column>
      <Messages>Messages go here!</Messages>
      <Row>
        <StyledInput></StyledInput>
        <StyledButton>send</StyledButton>
      </Row>
    </Column>
  );
};
const Column = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #e8e6e6;
  flex-grow: 1;
  margin: 16px;
  padding: 16px;
`;
const Messages = styled.div`
  flex-grow: 1;
`;
const Row = styled.div`
  display: flex;
  gap: 8px;
`;
const StyledInput = styled.input`
  flex-grow: 1;
  border: none;
`;
const StyledButton = styled.button`
  background-color: #2d476d;
  color: white;
  border-color: #2d476d;
  border-style: solid;
`;
