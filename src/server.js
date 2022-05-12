const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origins: "*:*",
        methods: ["GET", "POST"],
        allowedHeaders: ["content-type"],
        pingTimeout: 7000,
        pingInterval: 3000
    }
});

// add middlewares
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('join-room', (roomId) => {

        const room = roomId;
        socket.join(room);

        // When a chat message is sent, it will send it back to everyone
        socket.on('chatMSG', (msg) => {
            console.log("From " + msg.senderId + ": " + msg.contents);
            // Send the message to everyone, including the sender
            io.in(room).emit('chatMSGClient', msg);
        });
        
        // Activates when a user connects to the peer server
        socket.on('emit-id-on-peer', (msg) => {
            console.log('id emitted', msg);
            // Send to everyone except current person
            socket.to(room).emit('emit-id-on-peer-client', msg);
        });

        // Used to update the userIds
        socket.on('user-update', (userData) => {
            console.log('user update!', userData);
            // Sent to everyone except the current user
            socket.to(room).emit('user-update-received', userData);
        });

    });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, function () {
    console.log("Listening on 8 000");
});