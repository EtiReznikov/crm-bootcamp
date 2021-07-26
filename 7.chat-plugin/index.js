const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/serverSide', (req, res) => {
    res.sendFile(__dirname + '/serverSide.html');
});
io.on('connection', (socket) => {

    socket.on('create', function (room) {
        socket.join(room);
        io.sockets.to('crm').emit('new room', room);
        console.log(io.sockets.adapter.rooms.get(room))
    });

    socket.on('chat message', msg => {

        console.log(msg.room)
        io.sockets.in(msg.room).emit('chat message', msg);
    });

    socket.on('server message', msg => {
        console.log(msg.room)
        io.sockets.in(msg.room).emit('server message', msg);
    });

    socket.on('typing', msg => {
        io.emit('typing', msg);
    });
});

server.listen(9034, () => {
    console.log('listening on *:9034');
});