var config = require('./config');
var servo = require('./servo');
var wifi = require('./wifi');
var bluetooth = require('./bluetooth');
var hyperlock = require('auth0-hyperlock-client');

var servoInit = servo.init(config.servo);

bluetooth.init();

bluetooth.on("wifi-configure", function(data){
  config.NETWORK = data;
});

bluetooth.on("wifi-release", function(data){
  // wifi.disconnect();
});

bluetooth.on("wifi-connect", function(data){
  wifi.connect(config.NETWORK).then(networkready, networkerror);
});

bluetooth.on("hyperlock-pair", function(data){

});

function networkready(data) {
  var client = hyperlock.create_lock_client({
    url: config.DOORLOCK_URL,
    token: config.DEVICE_TOKEN
  });

  client.on('message', function (m) {
    if (m.action === 'lock') {
      servo.lock().then(function() {
        console.log("Locked");
      }, function(error) {
        console.log("Cannot lock", err);
      });
    }
    if (m.action === 'unlock') {
      servo.unlock().then(function() {
        console.log("Unlocked");
      }, function(error) {
        console.log("Cannot unlock", err);
      });
    }
  });

  client.on('error', function(err) {
    console.log("Hyperlock crashed", err);
    process.exit(1);
  })
}

function networkerror(err) {
  console.log("Cannot connect to Wifi", err);
  process.exit(1);
}
