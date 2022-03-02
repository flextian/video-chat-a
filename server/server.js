const express = require("express");
const app = express();
const cors = require("cors");
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('chatMSG', (msg) => {
        socket.broadcast.emit(msg.contents);
    });

});

server.listen(8000, function () {
    console.log("Listening on 8 000");
});