var config = require('./config');
var tessel = require('tessel');
var adv = require('bleadvertise');

exports.init = initBluetooth;
exports.on = observeEvents;

var observers = {
	"wifi-configure":[],
	"wifi-release":[],
	"wifi-connect":[],
	"device-pair":[]
}

function observeEvents(event, callback) {
	observers[event].push(callback);
}

function log(message) {
  var slice = Array.prototype.slice;
  console.log.apply(console, ['[bluetooth] ' + (arguments[0] || ''), slice.call(arguments, 1)]);
}

function throwEvent(event, data) {
	log(event, data);
	if (observers[event] === undefined) return;
	observers[event].forEach(function(callback){
		callback(data);
	});
}

function initBluetooth() {

	var blePort = tessel.port[config.bluetooth.PORT];
	ble = require('ble-ble113a').use(blePort, function(err) {

			var service = adv.serialize({
				completeName: config.bluetooth.NAME
			});

			log('Service:', service);

			ble.on('startAdvertising', function() {
				log('Start advertising.');
			});

			ble.on('stopAdvertising', function() {
				log('Stop advertising.');
			});

			ble.on('connect', function(connection) {

				log('Connect:', connection);

				// ble.startEncryption(connection, function(err) {

				// 	log('Encryption:', err);

				// 	ble.enterPasskey('123123', function(err) {

				// 		log('passkey', err);

				// 		ble.getBonds(function(err, bonds) {
			 //              if (err) {
			 //                return callback && callback(err);
			 //              }
			 //              else {
			 //                log("Got these bonds: ", bonds);
			 //              }
			 //            });
				// 	})

				// });

			});

			ble.on('disconnect', function(connection) {
				log('Disconnect:', connection);
				ble.startAdvertising();
			});

			var buffer = {};

			ble.on('remoteWrite', function(connection, index, valueWritten) {

				var message = valueWritten.toString('utf8');
				log('Remote Write: ', message);
				log('Index:', index);

				if (message === "#") {
					buffer["connection" + connection] = "";
				} else if (message === "$") {
					obj = JSON.parse(buffer["connection" + connection]);

					log("received object", obj);

					throwEvent(obj.command, obj.data);

					buffer["connection" + connection] = "";
				} else {
					buffer["connection" + connection] += message;
				}


			});

			ble.on('remoteReadRequest', function(connection, index) {
				log('Remote Read Request:', connection, index);
			});

			ble.on('remoteNotification', function(connection, index) {
				log('Remote Notification:', connection, index);
			});

			ble.on('remoteIndication', function(connection) {
				log('Remote Indication:', connection);
			});

			ble.on('remoteUpdateStop', function(connection) {
				log('Remote Update Stop:', connection);
			});

			ble.on('indicated', function(connection) {
				log('Indicated:', connection);
			});

			ble.setAdvertisingData(service, function(err) {
				if (err) {
					return log(err);
				}
				ble.startAdvertising();
			});

		// });

	});
}
