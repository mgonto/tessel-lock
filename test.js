var tessel = require('tessel'); // import tessel

// Toggle an LED every 200ms
(function blink (value) {
  tessel.led[1].write(value);
  setTimeout(blink, 200, !value);
})(true)