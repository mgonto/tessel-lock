var async = require('async');
var noble = require('noble');
var logger = require('./logger');

var instructions = {
  'wifi-configure': {
    command: 'wifi-configure',
    data: {
      ssid: 'FAIRMONT',
      security: 'unsecured'
    }
  },
  'wifi-connect': {
    command: 'wifi-connect'
  },
  'wifi-disconnect': {
    command: 'wifi-disconnect'
  }
}

logger.info('HyperLock BLE Tester');

noble.on('stateChange', function(state) {
  logger.info('BLE state: %s', state);

  if (state === 'poweredOn') {
    logger.debug('Scanning for devices...');

    noble.startScanning();
  } else {
    noble.stopScanning();

    logger.debug('Scan stopped.');
  }
});

noble.on('discover', function(peripheral) {
  if (peripheral.advertisement.localName && peripheral.advertisement.localName.indexOf('HyperLock') >= 0) {
    logger.info('Found: %s (%s)', peripheral.advertisement.localName, peripheral.uuid);

    explore(peripheral);
  }
});

function explore(peripheral) {
  peripheral.connect(function(error) {
    peripheral.discoverServices([], function(error, services) {
      for (var serviceIndex = 0; serviceIndex < services.length; serviceIndex++) {
        var service = services[serviceIndex];
        if (service.uuid === 'd752c5fb13804cd5b0efcac7d72cff20') {

          // Get charecteristics.
          service.discoverCharacteristics([], function(error, characteristics) {
            for (var characteristicIndex = 0; characteristicIndex < characteristics.length; characteristicIndex++) {
              var characteristic = characteristics[characteristicIndex];
              var characteristic_uuid = characteristic.uuid;

              logger.info(' > [C]: %s', characteristic_uuid);

              send(characteristic, instructions['wifi-configure'], function () {
                logger.debug(' - WIFI configuration written from HyperLock complete.');
                send(characteristic, instructions['wifi-connect'], function () {
                  logger.debug(' - WIFI connection established from HyperLock complete.');
                  setTimeout(function() {
                    logger.info(' - Peripheral disconnect');
                    peripheral.disconnect();
                  }, 1000);
                });
              })
              return;
            }
          });
        }
      }
    });
  });
}

function send(characteristic, json, done) {
  characteristic.write(new Buffer('#'), true, function(err) {
    characteristic.write(new Buffer(JSON.stringify(json)), true, function(err) {
      characteristic.write(new Buffer('$'), true, function(err) {
        done();
      });
    });
  });
}
