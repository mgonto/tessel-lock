var wifi = require('wifi-cc3000');
var Promise = require('q').Promise;


function connect(options){

  var timeouts = 0;
  return new Promise(function(reject, resolve) {
    console.log("Trying to connect");
    wifi.connect({
      security: options.security,
      ssid: options.ssid,
      password: options.pass,
      timeout: 30 // in seconds
    });

    wifi.on('connect', function(data){
      if (!data.ssid) {
        console.log("Connected, no DHCP yet. Let's wait");
      } else {
        console.log("Connected", data);
        resolve(data);
      }

    });

    wifi.on('disconnect', function(data){
      console.log("Disconnected", data);
    });

    wifi.on('error', function(err){
      console.log("Error :(", err);
      reject(err);
    });


    var timeouts

    wifi.on('timeout', function(err) {
      console.log("timeout emitted");
      timeouts++;
      if (timeouts > 2) {
        console.log("Doing powercycle");
        resolve(powerCycle());
      } else {
        console.log("Trying to connect");
        resolve(connect(options));
      }
    });

  });

}

// reset the wifi chip progammatically
function powerCycle() {
  return new Promise(function(resolve, reject) {
    console.log("Doing powercycle");
    wifi.reset(function(){
      setTimeout(function(){
        if (!wifi.isConnected()) {
          reject(new Error('Not connected'));
        } else {
          resolve(true);
        }
        }, 20 * 1000);
    });
  });
}

// disconnect the wifi chip progammatically
function disconnect(options){

  return new Promise(function(reject, resolve) {
    console.log("Trying to disconnect");
    wifi.disconnect(function(err){
      if (err) {
        reject(new Error(err));
      } else {
        resolve(true);
      }
    });
  });

}

function isConnected() {
  return wifi.isConnected();
}
function isBusy() {
  return wifi.isBusy();
}

exports.powerCycle = powerCycle;
exports.connect = connect;
exports.disconnect = disconnect;
exports.isConnected = isConnected;
exports.isBusy = isBusy;
