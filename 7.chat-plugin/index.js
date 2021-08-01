const express = require('express');
let cors = require('cors')
const app = express();
app.use(cors());
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const DB = require('./views/controllers/chat');
const { router } = require('./views/controllers/chat');

const mustacheExpress = require('mustache-express');
app.engine('html', mustacheExpress());

app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static('views'));

const services = require('./services');
services.InitMongoDB();

app.use(express.static(__dirname + '/public'));

app.get('/leadChat', (req, res) => {
    res.render('leadChat.html');
});
app.get('/crmChat', (req, res) => {
    res.render('crmChat.html');
});


app.get('/allConnections', (req, res) => {
    let result = [];
    io.sockets.adapter.rooms.forEach((value, key) => {
        if (JSON.stringify(key).substring(1, 5) === 'room')
            result.push({
                key: key, value: Array.from(value)
            });
    })
    res.send(result)
})

const newMessage = (msg, allMsgs, crmMessage, userFirstMessage) => {
    _room = msg.room;
    const time = new Date().toLocaleString("he-IL")
    allMsgs.push({ msg: msg.msgValue, isFromCrm: crmMessage, time: time })
    if (crmMessage)
        io.sockets.in(msg.room).emit('server message', msg, allMsgs);
    else
        io.sockets.in(msg.room).emit('chat message', msg, allMsgs);
    DB.addToDB({
        room: msg.room,
        isFromCrm: crmMessage,
        msgData: msg.msgValue
    });
}

io.on('connection', (socket) => {
    let _room = socket.id;
    let FromLead;
    socket.on('create', async function (room, isFromLead, isFirstConnect) {
        _room = room;
        FromLead = isFromLead;
        let allMsgs = await DB.getMessageByRoom(room);
        let msg = {
            room: room,
            from: "crm",
            msgValue: "Hi! to get link to our website press 1, to chat with us press anything else",
        }
        if (isFromLead && isFirstConnect) {
            const time = new Date().toLocaleString("he-IL")
            allMsgs.push({ msg: msg.msgValue, isFromCrm: true, time: time })
            socket.emit("server message", msg, allMsgs);
            DB.addToDB({
                room: room,
                isFromCrm: true,
                msgData: msg.msgValue
            });
        }
        else {
            socket.emit("server message", null, allMsgs);
        }
        socket.join(room);
        io.sockets.to('crm').emit('new room', room);
    });

    socket.on('disconnect', function () {
        if (FromLead) {
            io.sockets.to('crm').emit('disconnected', _room);
        }
    });

    socket.on('addLeadOrUserReq', function (room, isNewLead) {
        io.sockets.in(room).emit('getLeadData', room, isNewLead);
    });

    socket.on('chat message', (msg, allMsgs) => {
        console.log(msg.userFirstMessage)
        newMessage(msg, allMsgs, false);
        if (msg.userFirstMessage && msg.msgValue === '1') {
            serverMsg = {
                room: msg.room,
                from: "crm",
                msgValue: "https://www.crossfitrel.com",
            }
            newMessage(serverMsg, allMsgs, true);
        }

    });

    socket.on('server message', (msg, allMsgs) => {
        newMessage(msg, allMsgs, true);
    });

    socket.on('addLead', (leadData) => {
        io.emit('leadData', leadData);
    })
    socket.on('typing', msg => {
        io.emit('typing', msg);
    });
});


app.use('/add', DB.router);
app.get('/getMessagesByRoom', DB.router);
app.get('/getAllRooms', DB.router);

server.listen(9034, () => {
    console.log('listening on *:9034');
});