const fs = require('fs'),
    s3Utils = require('./aws/s3Utils'),
    uuid = require('uuid'),
    webshot = require('./node_modules/node-webshot-master/lib/webshot');

const options = {
    defaultWhiteBackground: true,
    renderDelay: 5000,
    windowSize: {
        width: 1300,
        height: 2500
    }
};

const fileName = uuid.v4() + '.png';
var s = webshot('https://www.walmart.com/ip/FurReal-Friends-JJ-My-Jumpin-Pug-Pet/42208804', fileName, options, (err, data) => {
    // screenshot now saved to google.png
    if (err) {
        console.log(err);
    }

    console.log(data);

    //s3Utils.putObject(fileName);
});

console.log(s);


