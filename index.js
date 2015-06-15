var config = require('./config');
var servo = require('./servo');
var wifi = require('./wifi');
var bluetooth = require('./bluetooth');
var hyperlock = require('auth0-hyperlock-client');

var servoInit = servo.init(config.servo);

function lock() {
  return servoInit.then(function() {
    return servo.move(120, true);
  });
}

function unlock() {
  return servoInit.then(function() {
    return servo.move(120, false);
  });
}

bluetooth.init();

bluetooth.on("wifi-configure", function(data){
  config.network = data;

  console.log("[instruction] wifi-configure: %j", config.network);
});

bluetooth.on("wifi-release", function(data){
  console.log("[instruction] wifi-release");
  wifi.disconnect();
});

bluetooth.on("wifi-connect", function(data){
  console.log("[instruction] wifi-connect");
  wifi.connect(config.network).then(networkready, networkerror);
});

bluetooth.on("device-pair", function(data){
  console.log("[instruction] device-pair");
  config.DEVICE_TOKEN = data.device_token
  pairDevice();

});

function networkready(){
  console.log("CONNECTED TO WIFI!!");
}

function pairDevice() {
  var client = hyperlock.create_lock_client({
    url: config.DOORLOCK_URL,
    token: config.DEVICE_TOKEN
  });

  client.on('message', function (m) {
    if (m.action === 'lock') {
      lock().then(function() {
        console.log("Locked");
      }, function(error) {
        console.log("Cannot lock", err);
      });
    }
    if (m.action === 'unlock') {
      unlock().then(function() {
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
