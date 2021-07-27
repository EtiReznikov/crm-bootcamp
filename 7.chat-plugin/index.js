const express = require('express');
var cors = require('cors')
const app = express();
app.use(cors());
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(__dirname + '/public'));

app.get('/leadChat', (req, res) => {
    res.sendFile(__dirname + '/leadChat.html');
});
app.get('/crmChat', (req, res) => {
    res.sendFile(__dirname + '/crmChat.html');
});

app.get('/allConnections', (req, res) => {
    let result = [];
    io.sockets.adapter.rooms.forEach((value, key) => {
        console.log(value, key)
        if (JSON.stringify(key).substring(1, 5) === 'room')
            result.push({
                key: key, value: Array.from(value)
            });
    })
    res.send(result)
})

app.get('/crmSocketId', (req, res) => {
    io.sockets.adapter.rooms.forEach((value, key) => {
        if (JSON.stringify(key) === '"crm"') {
            res.send(Array.from(value))
        }
    })
})

io.on('connection', (socket) => {
    socket.on('create', function (room) {
        socket.emit("server message", {
            room: room,
            from: "crm",
            msgValue: "Hi! what is your name?",
        });
        socket.join(room);
        io.sockets.to('crm').emit('new room', room);
    });

    socket.on('chat message', msg => {
        io.sockets.in(msg.room).emit('chat message', msg);
    });

    socket.on('server message', msg => {
        io.sockets.in(msg.room).emit('server message', msg);
    });

    socket.on('welcome msg', msg => {
        io.sockets.in(msg.room).emit('server message', 'Hi');
    });

    socket.on('typing', msg => {
        io.emit('typing', msg);
    });
});

server.listen(9034, () => {
    console.log('listening on *:9034');
});