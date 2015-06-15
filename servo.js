var tessel = require('tessel');
var servolib = require('servo-pca9685');
var Promise = require('q').Promise;

// Config
var config = null;
var servo;
var servoNumber;
var loaded = null;

var load = function() {
  loaded = new Promise(function(resolve, reject) {
    servo.on('ready', function () {
      console.log("Ready");
      servo.configure(servoNumber, 0.05, 0.14, function () {
        console.log("Configured");
        resolve(true);  
      });
    });
    servo.on('error', function (err) {
      console.log("there was an error");
      reject(err);
    });
  });
}

var read = function() {
  return loaded.then(function() {
    return new Promise(function(resolve, reject) {
      servo.read(servoNumber, function(err, reading) {
        if (err) {
          return reject(err);
        }
        console.log("Current position", reading);
        return resolve(reading);
      })
    });
  });
};

function move(degrees, forward) {
  return read().then(function(reading) {
    var movement = degrees * 0.57 / 90;
    if (!forward) {
      movement = reading - movement;
    }
    if (movement < 0) {
      movement = 0;
    }
    if (movement > 1) {
      movement = 1;
    }
    console.log("About to move", movement, degrees, forward);
    return new Promise(function(resolve, reject) {
      servo.move(servoNumber, movement, function(err) {
        if (err) {
          return reject(err);
        }
        return resolve(true);
      });
    });
  });  
}

function init(configuration) {
  config = configuration;
  servo = servolib.use(tessel.port[config.SERVO_PORT]);
  servoNumber = config.SERVO_NUMBER;
  load();
  return loaded.then(function() {
    return new Promise(function(resolve, reject) {
      servo.move(servoNumber, 0, function(err) {
        if (err) {
          return reject(err);
        }
        console.log("Moved to start position");
        return resolve(true);
      });
    });
    
  })
}

exports.move = move;
exports.init = init;