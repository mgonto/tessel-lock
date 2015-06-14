var servo = require('./servo');

console.log("Initing");
servo.init()
.then(function() {
  console.log("About to move 90deg");
  return servo.move(45, true);
})
.then(function() {
  console.log("About to move 90deg back");
  return servo.move(45, false);
}, function(err) {
  console.log("Errors", err);
});
