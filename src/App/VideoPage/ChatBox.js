import React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import {Box, Typography, Button, TextField, Grid} from "@mui/material";

import socketIOClient from "socket.io-client";

var socket;
var users;

export const ChatBox = (props) => {

  users = props.users;

  useEffect(() => {
    if (props.socket != undefined) {
      socket = props.socket;
  
      socket.on('chatMSGClient', function(msg) {
        messages.push(msg);
        const tempMessageCopy = [...messages];
        setMessages(tempMessageCopy);
      });

    }    
  }, [props.socket])

  const [focused, setFocused] = React.useState(false);
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);

  const chatTextField = React.createRef();

  const [messages, setMessages] = useState([
  ]);

  const [message, setMessage] = useState("");

  const onMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const onSendClick = (event) => {
    // create a new message
    if (message) {
      const newMessage = {
        contents: message,
        senderId: props.userId,
      };
      setMessage("")
      // Sends the message to the backend socket server
      // Messages sent by the current user are sent to the backend first, then returned to the current user 
      sendMessage(newMessage);
    }

    if (focused === false) {
      console.log(chatTextField);
      chatTextField.current.focus();
    }

  };

  const onKeyPress = (event) => {
    if (event.key === 'Enter' && focused) {
      onSendClick();
    }
  };

  return (
    <Column>
      <MessageColumn>
          <Messages messages={messages} users={users}>
            Messages go here!
          </Messages>
      </MessageColumn>
      <Row>
        <TextField onKeyPress={onKeyPress} onFocus={onFocus} onBlur={onBlur} style={{flexGrow: 1}} size="small" value={message} onChange={onMessageChange} variant="outlined" inputRef={chatTextField}/>
        <Button variant="contained" size="small" onClick={onSendClick}>Send</Button>
      </Row>
    </Column>
  );
};

const Messages = ({ messages, users}) => {
  return (
    <GrowBox>
      {messages.map((message) => (
        <Message
          message={message}
          users={users}
        ></Message>
      ))}
    </GrowBox>
  );
};
const GrowBox = styled.div`
  flex-grow: 1;
`;

const Message = ({ message, users}) => {
  const userName = users[message.senderId];
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

const MessageColumn = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #e8e6e6;
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 16px;
`;

const Row = styled.div`
  display: flex;
  gap: 8px;
`;
const StyledInput = styled.input`
  flex-grow: 1;
  border: none;
`;

function sendMessage(message) {
  socket.emit("chatMSG", message);
}