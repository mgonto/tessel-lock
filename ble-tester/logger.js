var winston = require('winston');

var logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            timestamp: function() {
                var date = new Date();
                var hour = date.getHours();
                hour = (hour < 10 ? "0" : "") + hour;
                var min  = date.getMinutes();
                min = (min < 10 ? "0" : "") + min;
                var sec  = date.getSeconds();
                sec = (sec < 10 ? "0" : "") + sec;
                return hour + ":" + min + ":" + sec;
            },
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

module.exports = logger;