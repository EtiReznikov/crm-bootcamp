const express = require('express');
const Chat = require("../models/chat.model");
const router = express.Router();
const util = require('util'); /**use to implement console.dir in CLI */
const { copyFileSync } = require('fs');

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

/**
 * Delete a specific academy
 * @param {objectId} id - workiz rule id
 * @return {Notifications}
 * Endpoint : DELETE http://localhost:<port>/academy/<id>
 */
router.delete("/delete/:id", async (req, res) => {
    try {
        const messageID = req.params.id;
        const resp = await Chat.findById(messageID);
        resp.Delete();
        resp.save()

        res.status(200).json(resp);
    }

    catch (err) {
        res.status(400).json(err.message);
        console.error(err);
    }
});


/**
 * Enable a specific academy item
 * @param {objectId} id - workiz academy id
 * Endpoint : GET http://localhost:<port>/academy/restore/<id>
 */
router.put("/restore/:id", async (req, res) => {
    try {
        const messageID = req.params.id;
        const resp = await Chat.findById(messageID);
        resp.UnDelete();
        resp.save();
        console.log(`UnDeleted Academy ID: [${messageID}]`)
        res.status(200).json(resp);
    }
    catch (err) {
        res.status(400).json(err);
        console.error(err);

    }
});

router.get("/getByRoom", async (req, res) => {
    try {
        const name = req.query.name;
        const resp = await Academy.findOne({ name: name });
        res.status(200).json(resp);
        //res.status(200).json(“ok”);
    }
    catch (err) {
        res.status(400).json(err);
        winston.error(err);
    }
});

async function getMessageByRoom(room) {
    const resp = await Chat.find({ room: room });
    let msgs = []
    for (document of resp) {
        msgs.push({ msg: document.msgData, isFromCrm: document.isFromCrm })
    }
    return msgs;
}

/**
 * Get a specific rule
 * @param {objectId} id - workiz rule id
 * @return {Notifications}
 * Endpoint : GET http://localhost:<port>/rules/<id>
 */
router.get("/:id", async (req, res) => {
    try {
        const messageID = req.params.id;
        const resp = await Chat.findById(messageID);

        res.status(200).json(resp);
    }
    catch (err) {
        res.status(400).json(err);
        console.error(err);

    }
});


/**
 * Update a specific rule
 * @param {string} academy.name
 * @param {Array<Project>} academy.projects
 * @param {boolean} rule.deleted
 * @return {Notification}
 * Endpoint : PUT http://localhost:<port>/academy/<id>
 */
router.put("/:id", async (req, res) => {
    try {
        const messageID = req.params.id;
        const message = req.body;
        const resp = await Academy.updateOne({ _id: messageID }, { $set: message });
        res.status(200).json(resp);
    }
    catch (err) {
        res.status(400).json(err.message);
        console.error(err);

    }
});




module.exports = { router: router, addToDB: addToDB, getMessageByRoom: getMessageByRoom };