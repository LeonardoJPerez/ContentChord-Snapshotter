const fs = require('fs');
const webshot = require('./node_modules/node-webshot-master/lib/webshot');

const options = {
    defaultWhiteBackground: true,
    renderDelay: 5000,
    windowSize: {
        width: 1300,
        height: 2500
    }
};

webshot('https://www.walmart.com/ip/FurReal-Friends-JJ-My-Jumpin-Pug-Pet/42208804', 'wm.png', options, (err) => {
    // screenshot now saved to google.png
    if (err) {
        console.log(err);
    }
});
