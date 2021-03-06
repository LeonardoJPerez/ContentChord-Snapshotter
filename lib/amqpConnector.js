const amqp = require('amqplib/callback_api');
const _ = require('lodash');

// if the connection is closed or fails to be established at all, we will
// reconnect
let _amqpConn = null;
let _config = null;

const buildHost = (config) => {
    if (config.username && config.password) {
        return `amqp://${_config.username}:${_config.password}@${_config.host}:${_config.port}/?heartbeat=${_config.heartbeat}`;
    } else {
        return '';
    }
}

const start = (config, processCb) => {
    if (!config) 
        throw "Configuration object missing.";
    _config = _.assign({}, config);

    amqp.connect(buildHost(_config), (err, conn) => {
        if (err) {
            console.error("[AMQP]", err.message);
            return setTimeout(start, 1000);
        }

        conn.on("error", (err) => {
            if (err.message !== "Connection closing") {
                console.error("[AMQP] conn error", err.message);
            }
        });

        conn.on("close", () => {
            console.error("[AMQP] reconnecting");
            return setTimeout(start, 1000);
        });

        console.log("[AMQP] connected");
        amqpConn = conn;

        whenConnected(processCb);
    });
}

const whenConnected = (processCb) => {
    // A worker that acks messages only if processed successfully.
    amqpConn.createChannel((err, ch) => {
        if (closeOnErr(err)) 
            return;
        
        ch.on("error", (err) => {
            console.error("[AMQP] channel error", err.message);
        });

        ch.on("close", () => {
            console.log("[AMQP] channel closed");
        });

        ch.prefetch(_config.chunkSize);

        var msgBlock = [];
        ch.assertQueue(_config.channel, {
            durable: true
        }, (err, _ok) => {
            if (closeOnErr(err)) 
                return;
            
            ch.consume(_config.channel, processMsg);
            console.log("Worker started");
        });

        const processMsg = (msg) => {
            console.log(`Consuming message [deliveryTag: ${msg.fields.deliveryTag}]...`);
            processCb(msg).then((result) => {
                if (result) {
                    console.log("Success. Acknowledging the message");
                    ch.ack(msg);

                    //ch.nack(msg, false, true);
                } else {
                    console.log("Error. Requeuing the message. \n" + result.err);
                    //ch.nack(msg, false, true);
                    ch.reject(msg, true);
                }
            }).catch(err => {
                try {
                    if (err) {
                        ch.reject(msg, true);
                        console.log("Error. Requeuing message block message. \n" + result.err);
                    }
                } catch (e) {
                    closeOnErr(e);
                }

            });
        };
    });
}

const closeOnErr = (err) => {
    if (!err) 
        return false;
    
    console.error("[AMQP] error", err);
    amqpConn.close();

    return true;
}

module.exports = {
    start
};
