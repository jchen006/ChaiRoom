// KPR Script file

var THEME = require ("themes/flat/theme");
var CONTROL = require ("mobile/control");
var PinsSimulators = require ("PinsSimulators");

exports.pins = {
	seats: {type: "I2C", address: 0x48}
};

exports.configure = function() {
	this.pinsSimulator = shell.delegate("addSimulatorPart", {
		header : { 
			label : "Seats", 
			name : "Seat Sensor", 
			iconVariant : PinsSimulators.SENSOR_MODULE
		},
		axes : [
			new PinsSimulators.AnalogInputAxisDescription(
				{
					valueLabel : "seat",
					valueID : "seats",
					defaultControl : PinsSimulators.SLIDER,
					minValue : 0,
					maxValue : 30,
					value : 0
				}
			),
		]
	});
};

exports.close = function() {
	shell.delegate("removeSimulatorPart", this.pinsSimulator);
};

exports.read = function() {
	var axes = this.pinsSimulator.delegate("getValue");
	trace("Seats: " + axes.seats);
	return axes.seats;				
};
