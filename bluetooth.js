var tessel = require('tessel');
var adv = require('bleadvertise');

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
	});

	ble.on('disconnect', function(connection) {
		console.log('Disconnect:', connection);
		console.log('Advertising again');
		ble.startAdvertising();
	});

	ble.on('remoteWrite', function(connection, index, valueWritten) {
		if (index === 5) {
			console.log('Remote Write:', valueWritten.toString('ascii'));
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
});