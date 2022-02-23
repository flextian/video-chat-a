import styled from "styled-components";
import React from "react";
import { ChatBox } from "./HomePage/ChatBox";
import { VideoBox } from "./HomePage/VideoBox";

export const HomePage = () => {
  return (
      <FullHeightBlueBox>
        <VideoBoxContainer>
            <VideoBox />
        </VideoBoxContainer>
        <ChatBoxContainer>
            <ChatBox />
        </ChatBoxContainer>
      </FullHeightBlueBox>
  );
};

const FullHeightBlueBox = styled.div`
  background-color: #2d476d;
  height: 100vh;
  display: flex;
`;
const ChatBoxContainer = styled.div`
  flex-basis: 30%;
  display: flex;
`;
const VideoBoxContainer = styled.div`
  flex-basis: 70%;
`;