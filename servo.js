var tessel = require('tessel');
var servolib = require('servo-pca9685');
var Promise = require('q').Promise;

// Config
var config = null;
var servo;
var servoUID;
var loaded = null;


exports.init = init;
exports.move = move;
exports.lock = lock;
exports.unlock = unlock;

function load() {
  loaded = new Promise(function(resolve, reject) {
    servo.on('ready', function () {
      console.log("Ready");
      servo.configure(servoUID, 0.05, 0.14, function () {
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

function read() {
  return loaded.then(function() {
    return new Promise(function(resolve, reject) {
      servo.read(servoUID, function(err, reading) {
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
      servo.move(servoUID, movement, function(err) {
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
  servo = servolib.use(tessel.port[config.PORT]);
  servoUID = config.UID;
  load();
  return loaded.then(function() {
    return new Promise(function(resolve, reject) {
      servo.move(servoUID, 0, function(err) {
        if (err) {
          return reject(err);
        }
        console.log("Moved to start position");
        return resolve(true);
      });
    });

  })
}