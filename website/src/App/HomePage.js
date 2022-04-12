import styled from "styled-components";
import React, { useEffect, useState, useRef } from "react";
import { ChatBox } from "./HomePage/ChatBox";
import { VideoBox } from "./HomePage/VideoBox";
import Peer from "peerjs"; 
import socketIOClient from "socket.io-client";
import {v4 as uuidV4} from 'uuid';

export const HomePage = () => {
  const [socket, setSocket] = useState(undefined);

  const [remoteStreams, setRemoteStreams] = useState({});
  const addVideoStream = (remoteStream, peerId) => {
    const remoteStreamsCopy = remoteStreams;
    remoteStreamsCopy[peerId] = remoteStream;
    setRemoteStreams(Object.assign({}, remoteStreamsCopy));
    console.log('remote streams copy', remoteStreamsCopy);
  }

  const [users, setUsers] = useState([
    { id: 2, name: "Eva"}
  ]);

  useEffect(() => {
      // add our own video stream to the screen
      navigator.mediaDevices.getUserMedia({video: true, audio: true })
      .then((stream) => {
          // add your own video to the list of videos
          addVideoStream(stream, 'ours', true);
      })
      .catch((e) => {
          alert('Error accessing camera and microphone');
          console.log('Error getting user media', e);
      });
  }, []);

  useEffect(() => {
    let curSocket = socketIOClient("http://localhost:8000", {secure: false});
    setSocket(curSocket);

    let ourUserId = uuidV4();

    console.log("our user id: ", ourUserId);

    // const peer = new Peer(ourUserId);
    const peer = new Peer(ourUserId, {
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


    peer.on('open', (ourPeerId) => {
      console.log("our peer id: ", ourPeerId);
      curSocket.emit("emit-id", ourPeerId);
    });
    
    peer.on('error', function(err) {
      console.log("Error: ", err);
    });

    // getting call from someone else
    peer.on('call', (call) => {
    // send your own stream for the caller and add the caller stream to your page
    navigator.mediaDevices.getUserMedia({video: true, audio: true})
        .then((stream) => {
            // answer the call we got from B
            console.log('our video stream we will respond with', stream);
            call.answer(stream);

            // now B gives us his video stream in this method
            call.on('stream', (remoteStream) => {
                // TODO: handle receiving video call from someone else
                console.log('stream from person who called me', remoteStream);

                // TODO: add the video stream to ui
                addVideoStream(remoteStream, call.peer);

                // let all other clients know about the data of this user
                // socket.emit("update", userData);
            })

        })
        .catch((e) => {
            console.log('Error answering call', e);
        });
    });

    curSocket.on('peer-idClient', function(incomingPeerId) {
      console.log("got socket message peer-idClient: ", incomingPeerId);
      console.log("our peer id: ", ourUserId);
      console.log("incoming peer id: ", incomingPeerId);

      if (incomingPeerId !== ourUserId) {
        console.log("received another id: ", incomingPeerId);
        callPeer(incomingPeerId);
      }
    });

    const callPeer = (id) => {
      navigator.mediaDevices.getUserMedia({video: true, audio: true})
          .then((stream) => {
              // console.log('our video stream we will send', stream);
  
              // attempt to call the other person with this stream
              let call = peer.call(id, stream);
  
              console.log("our video stream: ", stream);
  
              // when other person accepts, our call we also get their video:
              call.on('stream', (remoteStream) => {
                console.log("video stream of other person: ", remoteStream);
                  // TODO: this is the video of the new peer - display it?
                  // console.log('stream from person I called', remoteStream);
  
                  // TODO: uncomment and implement method
                  addVideoStream(remoteStream, id);
  
                  // let all other clients know about the data of this user
                  // socket.emit("update", userData);
              });

              
          })
          .catch((e) => {
              console.log('Error calling', e);
          });
    }
  }, [])

  return (
      <FullHeightBlueBox>
        <VideoBoxContainer>
            {
              Object.keys(remoteStreams).map((streamPeerId) => {
                const stream = remoteStreams[streamPeerId];
                return (
                  <Video remoteStream={stream} muted={false}/>
                )
              })
            }
        </VideoBoxContainer>
        <ChatBoxContainer>
            <ChatBox socket = { socket } users = { users } />
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
      <video controls={false} playsInline width="100%" height="240" id={'client id'} style={{width: '100%'}} ref={myVideoRef}/>
  );
}