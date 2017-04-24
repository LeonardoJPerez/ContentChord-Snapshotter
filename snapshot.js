const fs = require('fs');
const Phantom = require('phantom');
const async = require('asyncawait/async');
const await = require('asyncawait/await');

const options = {
    windowSize: {
        width: 1300,
        height: 2500
    }
};

const _phInstanceFactory = async(() => {
    const p = await(Phantom.create());
    return p;
});

module.exports = (url, cb) => {
    return _phInstanceFactory()
        .then((instance) => {
            return instance.createPage()
                .then(page => {
                    return page
                        .open(url)
                        .then(status => {
                            console.log('Request Status: ' + status);
                            return page.evaluate(function () {
                                document.body.bgColor = 'white';
                            }).then(() => {
                                return page.property('viewportSize', options.windowSize);
                            });
                        })
                        .then(arg => {
                            return page
                                .renderBase64()
                                //.render(name)
                                .then(data => {
                                    return cb(null, data);
                                });
                        });
                }).catch(error => {
                    cb(error, null);
                    instance.exit();
                });
        });
};