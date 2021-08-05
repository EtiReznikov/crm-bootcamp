const twilio = require('twilio');
const accountSid = 'AC727e28de1b91ade4f01af968fcc8106c'; // Your Account SID from www.twilio.com/console
const authToken = '197fb7b976e96b3c361c8ebe07a96409'

const client = new twilio(accountSid, authToken);
client.messages
  .create({
    body: 'Hello from Node',
    to: '+972523688114', // Text this number
    from: '+18185729816', // From a valid Twilio number
  })
  .then((message) => console.log(message.sid));