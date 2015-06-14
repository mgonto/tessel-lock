var tessel = require('tessel');
var servolib = require('servo-pca9685');
var Constants = require('./constants');
var Promise = require('promise');

// Config
var servo = servolib.use(tessel.port[Constants.SERVO_PORT]);
var servoNumber = Constants.SERVO_NUMBER;


var loaded = new Promise(function(resolve, reject) {
  servo.on('ready', function () {
    servo.configure(servoNumber, 0.05, 0.14, function () {
      resolve();  
    });
  });
  servo.on('error', function (err) {
    reject(err);
  });
});

var read = function() {
  return loaded.then(function() {
    return new Promise(function(resolve, reject) {
      servo.read(servoNumber, function(err, reading) {
        if (err) {
          return reject(err);
        }
        return resolve(reading);
      })
    });
  });
};

function move(degrees, forward) {
  return read().then(function(reading) {
    var movement = degrees * Constants.NINETY_DEG / 90;
    if (!forward) {
      movement = reading - movement;
    }
    return new Promise(function(resolve, reject) {
      servo.move(servoNumber, movement, function(err) {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  });  
}

function init() {
  return loaded.then(function() {
    return new Promise(function(resolve, reject) {
      servo.move(servoNumber, movement, function(err) {
        if (err) {
          return reject(err);
        }
        return resolve();
      })
    });
    
  })
}

exports.move = move;
exports.init = init;