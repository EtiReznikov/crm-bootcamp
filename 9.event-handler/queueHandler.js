
var redis = require("redis");
var subscriber = redis.createClient();
const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9200' })




subscriber.on("message", function (channel, message) {
    let events = JSON.parse(message);
    let eventsArr = []
    for (let event of events) {
        eventsArr.push(event)
    }

    client.bulk({
        body: eventsArr,
    }, function (err, resp, status) {
        if (resp)
            console.log(resp);
        else {
            console.log(err);
        }
    });
});

subscriber.subscribe("events");

