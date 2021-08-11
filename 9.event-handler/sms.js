const twilio = require('twilio');
const accountSid = process.env.TWILLLO_SID ; // Your Account SID from www.twilio.com/console
const authToken = process.env.AUTH_TOKEN ;

const client = new twilio(accountSid, authToken);
client.messages
  .create({
    body: 'Hello from Node',
    to: '+972523688114', // Text this number
    from: '+18185729816', // From a valid Twilio number
  })
  .then((message) => console.log(message.sid));