var hyperlock = require('auth0-hyperlock-client');
var config = require('./config');

hyperlock.send({
    url: config.DOORLOCK_URL,
    token: config.DEVICE_TOKEN,
    data: { action: 'lock' }                    
}, function (err) {
    console.log("Sent!", err);
});

