const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const port = process.env.PORT || 4001;
const app = express();
const server = http.createServer(app);


const io = require("socket.io")(4002, {
  cors: {
    origin: [
      "http://localhost:3000"
    ],
  },
});
let Mailgun = require('mailgun-js');
const redisAdapter = require('socket.io-redis');
var redis = require("redis");
var subscriber = redis.createClient();
require('dotenv').config();

const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9200' })



io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

subscriber.on("message", function (channel, body) {
  body = JSON.parse(body);
  if (body.type === "EMAIL") {
    let subject = body.subject;
    let content = body.content
    let emailsArr = []
    for (let email of body.confirmEmails) {
      emailsArr.push(email)
    }
    sendEmail(emailsArr, subject, content);
  }
  else if (body.type === "SMS") {
    let content = body.content
    let smsArr = []
    for (let sms of body.confirmSms) {
      smsArr.push(sms)
    }
    sendSms(smsArr, content);
  }

});


async function sendEmail(usersList, subject, message) {
  let mailGun = new Mailgun({
    apiKey: process.env.MAILGUN_KEY,
    domain: process.env.MAILGUN_ADMIN
  });

  for (user of usersList) {
    const data = {
      from: 'eti.reznikov@workiz.com',
      to: user.email,
      subject: subject,
      text: message
    }
    try {
      await mailGun.messages().send(data);
      io.emit("emailStatus", user.id, true);
    } catch (err) {
      console.log(err);
      io.emit("emailStatus", user.id, false);
    }
  }
}

async function sendSms(usersList, content) {
  const twilio = require('twilio');
  const accountSid = process.env.TWILLLO_SID;

  const authToken = process.env.AUTH_TOKEN;
  const twilioClient = new twilio(accountSid, authToken);
  for (user of usersList) {
    await twilioClient.messages
      .create({
        body: content,
        to: '+972' + user.phoneNumber, // Text this number
        from: '+12312254892', // From a valid Twilio number
      })
      .then((message) => { io.emit("emailStatus", user.id, true) })
      .catch((error) => {
        console.log(error);
        io.emit("emailStatus", user.id, false)
      })
  }

}

subscriber.subscribe("messages");

server.listen(port, function () {
  console.log(`listening on *:'${port}'`);
});

