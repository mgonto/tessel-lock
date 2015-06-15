var tessel = require('tessel');
var servolib = require('servo-pca9685');
require('dotenv').load();
var config = require('config').servo;

var requiredSettings = ['PORT', 'POSITION', 'PWM_MIN', 'PWM_MAX',
    'UNLOCKED_POSITION', 'LOCKED_POSITION'];
requiredSettings.forEach(function (s) {
    if (!config[s]) {
        throw 'Missing setting in .env file: ' + s;
    }
});

var servo = servolib.use(tessel.port[config.PORT]);
var servo1 = config.POSITION;

servo.on('ready', function () {
    // Keep REPL alive
    setInterval(function () {}, 1000);
    servo.configure(servo1, config.PWM_MIN, config.PWM_MAX, function (err) {
        if (err) throw err;
        process.on('stdin', function (message) {
            var trimmed = message.trim();
            if (trimmed === 'lock') {
                servo.move(servo1, parseFloat(config.LOCKED_POSITION));
                console.log('Locking.');
            } else if (trimmed === 'unlock') {
                servo.move(servo1, parseFloat(config.UNLOCKED_POSITION));
                console.log('Unlocking.');
            } else {
                console.error('Unrecognized command: ' + trimmed);
            }
        });
    });
});
