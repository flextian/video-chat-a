import React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

var socket;

// const messages = [
//   { contents: "Hi", senderId: 13 },
//   { contents: "My name is Eva", senderId: 2 },
// ];
const users = [
  { id: 13, name: "Kurtoo" },
  { id: 2, name: "Eva" },
];
const currentUser = { userId: 2 };

export const ChatBox = () => {

  useEffect(() => {
    console.log("CONNECTING SOCKET")
    socket = socketIOClient("http://localhost:8000", {secure: false})

    socket.on('chatMSGClient', function(msg) {
      messages.push(msg);
      const tempMessageCopy = [...messages];
      setMessages(tempMessageCopy);
    });
    
  },[])

  const [x, setX] = useState("");

  const [messages, setMessages] = useState([
    { contents: "Hi", senderId: 13 },
    { contents: "My name is Eva", senderId: 2 },
  ]);

  const onSendClick = (event) => {
    console.log("clicked!");
    // create a new message
    const newMessage = {
      contents: x,
      senderId: 2,
    };

    // update messages
    // clear text box
    setX("")

    sendMessage(newMessage); // Sends the message to the backend socket server
  };

  return (
    <Column>
      <Messages messages={messages} users={users} currentUser={currentUser}>
        Messages go here!
      </Messages>
      <Row>
        <StyledInput
          value={x}
          onChange={(event) => setX(event.target.value)}
        ></StyledInput>
        <StyledButton onClick={onSendClick}>send</StyledButton>
      </Row>
    </Column>
  );
};

const Messages = ({ messages, users, currentUser }) => {
  return (
    <GrowBox>
      {messages.map((message) => (
        <Message
          message={message}
          users={users}
          currentUser={currentUser}
        ></Message>
      ))}
    </GrowBox>
  );
};
const GrowBox = styled.div`
  flex-grow: 1;
`;

const Message = ({ message, users, currentUser }) => {
  const user = users.find((user) => user.id === message.senderId);
  const userName = user.name;
  return (
    <div>
      {userName}: {message.contents}
    </div>
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

function sendMessage(message) {
  socket.emit("chatMSG", message);
}