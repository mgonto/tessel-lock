var config = require('./config');

var servo = require('./servo');
process.stdin.resume();
console.log("Initializing servo");
var servoInit = servo.init(config.servo);

function lock() {
  return servoInit.then(function() {
    return servo.move(120, true);
  });
}

lock();