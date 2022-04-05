import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { ChatBox } from "./HomePage/ChatBox";
import { VideoBox } from "./HomePage/VideoBox";
import Peer from "peerjs"; 
import socketIOClient from "socket.io-client";


export const HomePage = () => {
  const [socket, setSocket] = useState(undefined);

  useEffect(() => {
    setSocket(socketIOClient("http://localhost:8000", {secure: false}));

    const peer = new Peer();

    peer.on('open', (peerId) => {
      console.log(peerId);
    });
    
    peer.on('error', function(err) {
      console.log("Error: ", err);
    });

  }, [])

  return (
      <FullHeightBlueBox>
        <VideoBoxContainer>
            <VideoBox />
        </VideoBoxContainer>
        <ChatBoxContainer>
            <ChatBox socket = { socket } />
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