const ampqConnector = require('./amqpConnector');
const snapshot = require('./snapshot');
const uuidV4 = require('uuid/v4');
const fs = require('fs');
const s3Utils = require('./aws/s3Utils');

const mqOptions = {
    heartbeat: 60,
    //host: '40.84.28.20',
    host: 'localhost',
    port: 5672,
    prefetch: 10,
    // username: 'nbowman', password: 'password',
    reconnectTime: 1000,
    chunkSize: 2,
    channel: 'UrisToProcess', // Should be UrisToSnapshots

};

console.log('Connecting to ' + mqOptions.host);

const messageHandler = (msg) => {
    const jsonMessage = JSON.parse(msg.content.toString());
    console.log('Processing URL: ' + jsonMessage.Uri);

    snapshot(jsonMessage.Uri, uuidV4(), (err, fileName) => {
        console.log(err || "Success capturing snapshot. file: " + fileName);

        //s3Utils.putObject(fileName);

        console.log(data);

        return err;
    });
};

ampqConnector.start(mqOptions, messageHandler);
