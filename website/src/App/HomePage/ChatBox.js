import React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

// const messages = [
//   { contents: "Hi", senderId: 13 },
//   { contents: "My name is Eva", senderId: 2 },
// ];

var socket;

const users = [
  { id: 13, name: "Kurtoo" },
  { id: 2, name: "Eva" },
];
const currentUser = { userId: 2 };

export const ChatBox = (props) => {

  useEffect(() => {
    if (props.socket != undefined) {
      socket = props.socket;

      console.log("CONNECTING SOCKET");
      //socket = socketIOClient("http://localhost:8000", {secure: false})
  
      socket.on('chatMSGClient', function(msg) {
        messages.push(msg);
        const tempMessageCopy = [...messages];
        setMessages(tempMessageCopy);
      });

    }    
  }, [props.socket])

  const [messages, setMessages] = useState([
    { contents: "Hi", senderId: 13 },
    { contents: "My name is Eva", senderId: 2 },
  ]);

  const [message, setMessage] = useState("");

  const onMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const onSendClick = (event) => {
    console.log("clicked!");
    // create a new message
    const newMessage = {
      contents: message,
      senderId: currentUser.userId,
    };
    setMessage("")
    // Sends the message to the backend socket server
    // Messages sent by the current user are sent to the backend first, then returned to the current user 
    sendMessage(newMessage); 
  };

  return (
    <Column>
      <Messages messages={messages} users={users} currentUser={currentUser}>
        Messages go here!
      </Messages>
      <Row>
        <StyledInput value={message} onChange={onMessageChange}></StyledInput>
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
  console.log("From the send message function" + socket);
  socket.emit("chatMSG", message);
}