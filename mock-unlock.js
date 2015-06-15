var hyperlock = require('auth0-hyperlock-client');
var config = require('./config');

hyperlock.action({
    url: config.DOORLOCK_URL,
    token: config.USER_TOKEN,
    device_id: config.DEVICE_ID,
    data: { action: 'unlock' }
}, function (err) {
    console.log("Sent!", err);
    process.exit(0);
});
