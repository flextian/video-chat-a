import styled from "styled-components";
import React, { useEffect, useState, useRef } from "react";
import { ChatBox } from "./VideoPage/ChatBox";
import Peer from "peerjs"; 
import socketIOClient from "socket.io-client";
import {v4 as uuidV4} from 'uuid';
import { useSearchParams } from 'react-router-dom';

export const HomePage = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [socket, setSocket] = useState(undefined);

  // our user id
  const [userId, setUserId] = useState(uuidV4());

  // the room id we are in right now
  const [roomId, setRoomId] = useState("");
  
  // map of other users names
  const [users, setUsers] = useState({[userId]: "You"});

  const [remoteStreams, setRemoteStreams] = useState({});


  const addVideoStream = (remoteStream, peerId) => {
    const remoteStreamsCopy = remoteStreams;
    remoteStreamsCopy[peerId] = remoteStream;
    setRemoteStreams(Object.assign({}, remoteStreamsCopy));
  }

  // add our own video stream to the screen
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({video: true, audio: true })
    .then((stream) => {
        // add your own video to the list of videos
        addVideoStream(stream, userId);
    })
    .catch((e) => {
        alert('Error accessing camera and microphone');
        console.log('Error getting user media', e);
    });
  }, []);

  useEffect(() => {

    const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
    const isProduction = API_ENDPOINT === "https://video-chat-a-gt.herokuapp.com";
    console.log("Web socket api endpoint: ", API_ENDPOINT);
    let curSocket = socketIOClient(API_ENDPOINT, {secure: isProduction});
    setSocket(curSocket);

    let ourUserId = userId;
    console.log("our user id: ", ourUserId);

    // tell other users about our existence
    curSocket.emit("join-room", {roomId: searchParams.get("room"), userId: ourUserId})
    curSocket.emit("user-update", {id: ourUserId, name: searchParams.get("name")});

    curSocket.on("user-update-received", (userUpdate) => {
      const usersCopy = users;
      usersCopy[userUpdate.id] = userUpdate.name;
      setUsers(Object.assign({}, usersCopy));
      console.log('LIST OF ALL USERNAMES', usersCopy);
      console.log("received a user joining!");
    });

    let peer;
    // TODO: figure out why isProduction boolean is not correct
    if (isProduction) {
      console.log("connecting to prod peerjs");
      peer = new Peer(ourUserId, {
          host: "web-video-chat-peer-server-v2.herokuapp.com",
          port: 443,
          secure: true,
          'iceServers': [
              {url: 'stun:stun.l.google.com:19302'},
              {url: 'turn:numb.viagenie.ca:3478', credential: 'muazkh', username: 'web...@live.com'},
              {url: 'turn:numb.viagenie.ca', credential: 'muazkh', username: 'web...@live.com'},
              {
                  url: 'turn:192.158.29.39:3478?transport=udp',
                  credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                  username: '28224511:1379330808'
              },
              {
                  url: 'turn:192.158.29.39:3478?transport=tcp',
                  credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                  username: '28224511:1379330808'
              }
          ]
      });
    } else {
      console.log("connecting to dev peerjs");
      peer = new Peer(ourUserId, {
          host: "web-video-chat-peer-server-v2.herokuapp.com",
          port: 80,
          secure: false,
          'iceServers': [
              {url: 'stun:stun.l.google.com:19302'},
              {url: 'turn:numb.viagenie.ca:3478', credential: 'muazkh', username: 'web...@live.com'},
              {url: 'turn:numb.viagenie.ca', credential: 'muazkh', username: 'web...@live.com'},
              {
                  url: 'turn:192.158.29.39:3478?transport=udp',
                  credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                  username: '28224511:1379330808'
              },
              {
                  url: 'turn:192.158.29.39:3478?transport=tcp',
                  credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                  username: '28224511:1379330808'
              }
          ]
      });
    }

    peer.on('open', (ourPeerId) => {
      curSocket.emit("emit-id-on-peer", ourPeerId);
      console.log("peer open!!!, peer id we are sending to everyone else is " + ourPeerId)
    });
    
    peer.on('error', function(err) {
      console.log("Error: ", err);
    });

    // getting call from someone else
    peer.on('call', (call) => {
    // send your own stream for the caller and add the caller stream to your page
    navigator.mediaDevices.getUserMedia({video: true, audio: true})
        .then((stream) => {
            // answer the call we got
            console.log('we are getting a call, we will answer with', stream);
            call.answer(stream);

            // now B gives us his video stream in this method
            call.on('stream', (remoteStream) => {
                // handle receiving video call from someone else
                console.log('stream from person who called me', remoteStream);
                // add the video stream to ui
                addVideoStream(remoteStream, call.peer);
            })
        })
        .catch((e) => {
            console.log('Error answering call', e);
        });
    });

    curSocket.on('emit-id-on-peer-client', function(incomingPeerId) {
      curSocket.emit("user-update", {id: ourUserId, name: searchParams.get("name")});
      console.log("got socket message from someone else!: ", incomingPeerId);
      callPeer(incomingPeerId);
    });

    // When you call someone else
    const callPeer = (id) => {
      navigator.mediaDevices.getUserMedia({video: true, audio: true})
          .then((stream) => {
  
              // attempt to call the other person with this stream
              let call = peer.call(id, stream);
              console.log("our video stream we are going to send to initiate the call: ", stream);
  
              // when other person accepts, our call we also get their video:
              call.on('stream', (remoteStream) => {
                console.log("The other person accepted our call, the stream is: ", remoteStream);
                addVideoStream(remoteStream, id);
              });

              
          })
          .catch((e) => {
              console.log('Error calling', e);
          });
    }

    // When a user disconnects from the servers
    curSocket.on("user-disconnected", (disconnectedId) => {
      removeVideoBox(disconnectedId);
    });

    return () => {
      console.log("CLEANING UP");
      curSocket.close();
      peer.disconnect();
    };

  }, [])

  return (
      <FullHeightBlueBox>
        <VideoBoxContainer>
            {
              Object.keys(remoteStreams).map((streamPeerId) => {
                const stream = remoteStreams[streamPeerId];
                const userName = users[streamPeerId];

                return (
                  <div id={streamPeerId + "video"}>
                    <Video remoteStream={stream} muted={streamPeerId == userId}/>
                    <p style={{color: "black", textAlign: "center"}}> 
                      {userName}
                    </p>
                  </div>
                )

              })
            }
        </VideoBoxContainer>
        <ChatBoxContainer>
            <ChatBox socket = { socket } users = { users } userId = {userId}/>
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
  display: grid;
  grid-template-columns: repeat(4, 25%);
  grid-auto-rows: 33%;
  background-color: #e8e6e6;
  margin: 16px;
  padding: 16px;
  overflow-y: auto;
`;


const Video = (props) => {
  const myVideoRef = useRef(undefined);

  useEffect(() => {
      if (myVideoRef.current) {
          myVideoRef.current.srcObject = props.remoteStream;
          myVideoRef.current.muted = props.muted ? true : false;
          myVideoRef.current.addEventListener("loadedmetadata", () => { // When all the metadata has been loaded
              myVideoRef.current.play(); // Play the video
          });
          myVideoRef.current.onloadedmetadata = (e) => {
              myVideoRef.current.play();
          };
      }
  }, [myVideoRef.current]);

  return (
      <video controls={false} playsInline width="100%" id={'client id'} ref={myVideoRef}/>
  );
  
}

const removeVideoBox = (disconnectedId) => {
  console.log(disconnectedId + " left!!")
  document.getElementById(disconnectedId + "video").remove()
}