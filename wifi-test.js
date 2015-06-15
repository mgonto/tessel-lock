var wifi = require('./wifi');

wifi.connect({
  network: 'FAIRMONT',
  security: 'unsecured'
}).then(function(data) {
  console.log("Success", data);
}, function(err) {
  console.log("Error", err);
});