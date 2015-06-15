var tessel = require('tessel');
var adv = require('bleadvertise');

exports.init = initBluetooth;
exports.on = observeEvents;

var observers = {
	"wifi-configure":[],
	"wifi-release":[],
	"wifi-connect":[],
	"hyperlock-pair":[]
}

function observeEvents(event, callback) {
	observers[event].push(callback);
}

function notify(event, data) {
	observers[event].forEach(function(callback){
		callback(data);
	});
}

function initBluetooth() {

	var blePort = tessel.port['B'];
	ble = require('ble-ble113a').use(blePort, function(err) {

			var service = adv.serialize({
				completeName: "HyperLock"
			});

			console.log('Service:', service);

			ble.on('startAdvertising', function() {
				console.log('Start advertising.');
			});

			ble.on('stopAdvertising', function() {
				console.log('Stop advertising.');
			});

			ble.on('connect', function(connection) {

				console.log('Connect:', connection);

				// ble.startEncryption(connection, function(err) {

				// 	console.log('Encryption:', err);

				// 	ble.enterPasskey('123123', function(err) {

				// 		console.log('passkey', err);

				// 		ble.getBonds(function(err, bonds) {
			 //              if (err) {
			 //                return callback && callback(err);
			 //              }
			 //              else {
			 //                console.log("Got these bonds: ", bonds);
			 //              }
			 //            });
				// 	})

				// });

			});

			ble.on('disconnect', function(connection) {
				console.log('Disconnect:', connection);
				ble.startAdvertising();
			});

			ble.on('remoteWrite', function(connection, index, valueWritten) {
				if (index === 5) {
					console.log('Remote Write:', valueWritten.toString('ascii'));

					var message = valueWritten.toString('utf8');

					obj = JSON.parse(message);

					handle(obj.command, obj.data);
				}
			});

			ble.on('remoteReadRequest', function(connection, index) {
				console.log('Remote Read Request:', connection, index);
			});

			ble.on('remoteNotification', function(connection, index) {
				console.log('Remote Notification:', connection, index);
			});

			ble.on('remoteIndication', function(connection) {
				console.log('Remote Indication:', connection);
			});

			ble.on('remoteUpdateStop', function(connection) {
				console.log('Remote Update Stop:', connection);
			});

			ble.on('indicated', function(connection) {
				console.log('Indicated:', connection);
			});

			ble.setAdvertisingData(service, function(err) {
				if (err) {
					return console.log(err);
				}
				ble.startAdvertising();
			});

		// });

	});
}
