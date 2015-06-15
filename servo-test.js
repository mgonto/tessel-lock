var servo = require('./servo');
process.stdin.resume();
console.log("Initializing servo");
servo.init({
  SERVO_PORT: 'A',
  SERVO_NUMBER: 1
}).then(function() {
  console.log("Servo inited. Write commands now");
  console.log("How many degrees dude?");
  process.stdin.on('data', function (duty) {
    duty = parseInt(String(duty), 10);
    var forward = true
    if (duty < 0) {
      forward = false;
      duty = duty * -1;
    }
    console.log('Setting command position:', duty, forward);
    servo.move(duty, forward).then(function() {
      console.log("Moved OK");
    }, function(err) {
      console.log("Error moving", err);
    });
  });  
})
