const ampqConnector = require('./amqpConnector');
const snapshot = require('./snapshot');
const uuidV4 = require('uuid/v4');

const mqOptions = {
    heartbeat: 60,
    //host: '40.84.28.20',
    host: 'localhost',
    port: 5672,
    prefetch: 10,
    // username: 'nbowman',
    // password: 'password',
    reconnectTime: 1000,
    chunkSize = 2
};

console.log('Connecting to ' + mqOptions.host);

const messageHandler = (msg) => {
    console.log('Processing URL ' + msg.content.toString());

    const jsonMessage = JSON.parse(msg.content.toString());
    const url = "https://www.walmart.com/ip/FurReal-Friends-JJ-My-Jumpin-Pug-Pet/42208804"; // Test purposes
    snapshot(jsonMessage.Uri, uuidV4(), (err) => console.log(err || "Success"));
};

const testMessageHandler = (msg) => {
    console.log('Processing URL ' + msg.content.toString());

    const url = "https://www.walmart.com/ip/FurReal-Friends-JJ-My-Jumpin-Pug-Pet/42208804"; // Test purposes
    snapshot(url, uuidV4(), (err) => console.log(err || "Success"));
};

ampqConnector.start(mqOptions, testMessageHandler);