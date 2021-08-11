const express = require('express');
require('dotenv').config();
let cors = require('cors');
const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

var redis = require("redis");
var publisher = redis.createClient();



const routes = require('./routes')
app.use('/api/v1', routes)

app.post('/sendEmails', async (req, result) => {
    req.body.type = "EMAIL"
    publisher.publish("messages", JSON.stringify(req.body), function () {
        result.send("sent emails");
    });
});

app.post('/sendSms', async (req, result) => {
    req.body.type = "SMS"
    publisher.publish("messages", JSON.stringify(req.body), function () {
        result.send("sent sms");
    });
});

app.listen(3030, () => {
    console.log(`Server running at http: //localhost:${3030}/`);
});


