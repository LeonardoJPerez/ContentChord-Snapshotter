const fs = require('fs');
const webshot = require('./webshot');

module.exports = (url, id, cb) => {
    const options = {
        defaultWhiteBackground: true,
        renderDelay: 5000,
        windowSize: {
            width: 1300,
            height: 2500
        }
    };

    webshot(url, `${id}.png`, options, (err) => {
        cb(err);
    });
};