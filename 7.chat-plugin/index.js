const express = require('express');
let cors = require('cors')
const app = express();
app.use(cors());
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const DB = require('./controllers/chat');
const { router } = require('./controllers/chat');



const services = require('./services');
services.InitMongoDB();

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
        if (JSON.stringify(key).substring(1, 5) === 'room')
            result.push({
                key: key, value: Array.from(value)
            });
    })
    res.send(result)
})

// app.get('/crmSocketId', (req, res) => {
//     io.sockets.adapter.rooms.forEach((value, key) => {
//         if (JSON.stringify(key) === '"crm"') {
//             res.send(Array.from(value))
//         }
//     })
// })


io.on('connection', (socket) => {
    let _room = socket.id;
    let isFromLead;
    socket.on('create', async function (room, flag) {
        isFromLead = flag;
        _room = room;
        let allMsgs = await DB.getMessageByRoom(room);
        let msg = {
            room: room,
            from: "crm",
            msgValue: "Hi! would you like to ",
        }
        if (flag) {
            allMsgs.push({ msg: msg.msgValue, isFromCrm: true })
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

    socket.on('disconnect', function (reason) {
        if (isFromLead) {
            io.sockets.to('crm').emit('disconnected', _room);
        }


        // let crmRooms = io.sockets.adapter.rooms.get('crm')
        // console.log(crmRooms)
        // if (crmRooms){
        //     console.log(socket.id)
        //     console.log(crmRooms.has(socket.id))
        // }
        // io.sockets.to('crm').emit('disconnected', _room);
    });

    socket.on('addLeadReq', function (room) {
        io.sockets.in(room).emit('getLeadData', room);
    });

    socket.on('chat message', (msg, allMsgs) => {
        _room = msg.room;
        allMsgs.push({ msg: msg.msgValue, isFromCrm: false })
        io.sockets.in(msg.room).emit('chat message', msg, allMsgs);
        DB.addToDB({
            room: msg.room,
            isFromCrm: false,
            msgData: msg.msgValue
        });
    });

    socket.on('server message', (msg, allMsgs) => {
        _room = msg.room;
        allMsgs.push({ msg: msg.msgValue, isFromCrm: false })
        io.sockets.in(msg.room).emit('server message', msg, allMsgs);
        DB.addToDB({
            room: msg.room,
            isFromCrm: true,
            msgData: msg.msgValue
        });
    });

    socket.on('addLead', leadData => {
        io.emit('leadData', leadData);
    })
    socket.on('typing', msg => {
        io.emit('typing', msg);
    });
});


app.use('/add', DB.router);
app.use('/delete/:id', DB.router);
app.use('/restore/:id', DB.router);
app.use('/:id', DB.router);

server.listen(9034, () => {
    console.log('listening on *:9034');
});