const express = require("express");
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


io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('chatMSG', (msg) => {
        console.log("From " + msg.senderId + ": " + msg.contents);
        io.emit('chatMSGClient', msg);
    });

    socket.on('emit-id', (msg) => {
        console.log('id emitted', msg);
        socket.broadcast.emit('peer-idClient', msg);
    });
});

server.listen(8000, function () {
    console.log("Listening on 8 000");
});