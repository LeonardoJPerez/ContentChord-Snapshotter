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
    chunkSize: 2,
    channel: 'UrisToProcess',  // Should be UrisToSnapshots

};

console.log('Connecting to ' + mqOptions.host);

const messageHandler = (msg) => {
    console.log('Processing URL ' + msg.content.toString());

    const jsonMessage = JSON.parse(msg.content.toString());    
    snapshot(jsonMessage.Uri, uuidV4(), (err, fileName) => {
        console.log(err || "Success capturing snapshot. file: " + fileName);
        
        return err;
    });
};

ampqConnector.start(mqOptions, messageHandler);