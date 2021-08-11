

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser').json();


var redis = require("redis");
var publisher = redis.createClient();


router.post('/multipleEvents', bodyParser, (req, res) => {

    publisher.publish("events", JSON.stringify(req.body.events), function () {
        res.send("sent to elastic");
    });
})

module.exports = router;
