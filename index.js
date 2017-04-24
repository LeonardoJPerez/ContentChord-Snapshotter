const ampqConnector = require('./amqpConnector');
const snapshot = require('./snapshot');
const uuidV4 = require('uuid/v4');
const fs = require('fs');
const s3Utils = require('./aws/s3Utils');
const async = require('asyncawait/async');
const await = require('asyncawait/await');

const mqOptions = {
    heartbeat: 60,
    //host: '40.84.28.20',
    host: 'localhost',
    port: 5672,
    // username: 'nbowman', password: 'password',
    reconnectTime: 1000,
    chunkSize: 2, // prefecth value
    channel: 'UrisToSnapshot' // Should be UrisToSnapshots
};

console.log('Connecting to ' + mqOptions.host);

const messageHandler = (msg) => {
    const getScreenshot = async((message) => {
        return snapshot(message.Uri, (err, buffer) => {
            if (err) {
                console.log(err);
                return false;
            }

            const imageFileName = `${uuidV4()}.png`;
            console.log(`Success capturing snapshot. Buffer size: ${buffer.length} [url: ${imageFileName} ]`);

            s3Utils.putObject(imageFileName, buffer);

            return true;
        });
    });


    const jsonMessage = JSON.parse(msg.content.toString());
    return getScreenshot(jsonMessage)
        .then((result) => result);
};

ampqConnector.start(mqOptions, messageHandler);