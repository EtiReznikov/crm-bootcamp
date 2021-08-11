const express = require('express');
const Chat = require("../../models/chat.model");
const router = express.Router();
const util = require('util'); /**use to implement console.dir in CLI */


//add to db by axios request
router.post("/add", async (req, res) => {
    try {
        const response = addToDB(req.body)
        res.status(201).json(response);
    }
    catch (err) {
        res.status(400).json(err);
        console.error(err);
    }
});

//add to DB
async function addToDB(data) {

    const {
        room,
        isFromCrm,
        msgData,
    } = data;

    const messageInstance = new Chat({
        room,
        isFromCrm,
        msgData,
    });

    try {
        const resp = await messageInstance.save();
        return resp
    }
    catch (err) {
        console.log(err)
        return err;
    }
}

// get all Messages of room
async function getMessageByRoom(room) {
    const resp = await Chat.find({ room: room });
    let msgs = []
    for (document of resp) {
        msgs.push({
            msg: document.msgData, isFromCrm: document.isFromCrm, time: new Date(document.createdAt).toLocaleString("he-IL")
        })
    }
    return msgs;
}

router.get("/getMessagesByRoom", async (req, res) => {
    try {
        const response = await getMessageByRoom(req.headers.roomid)
        res.send(JSON.stringify(response));
    }
    catch (err) {
        res.status(400).json(err);
        console.error(err);
    }
});


router.get("/getAllRooms", async (req, res) => {
    try {
        const response = await getAllRooms();
        res.send(JSON.stringify([...response]));
    }
    catch (err) {
        res.status(400).json(err);
        console.error(err);
    }
});


// get all rooms
async function getAllRooms() {
    const resp = await Chat.find({});
    let rooms = new Set();
    for (document of resp) {
        rooms.add(document.room)
    }
    return rooms;
}

module.exports = { router: router, addToDB: addToDB, getMessageByRoom: getMessageByRoom, getAllRooms: getAllRooms };