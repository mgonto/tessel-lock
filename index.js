var config = require('./config');
var servo = require('./servo');

servo.init({
  PORT: config.SERVO_PORT,
  UID: config.SERVO_UID
})

console.log('dotenv', config, servo);
