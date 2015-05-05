// KPR Script file
exports.pins = {
    chairs: {type: "I2C", address: 0x48}
};

exports.configure = function () {
	this.chairs.init();
}

exports.close = function() {
    this.chairs.close();
}

exports.read = function () {
    var data = this.chairs.readWordDataSMB(0);
	var value = ((data & 0xFF) << 4) | ((data >> 8) >> 4);
	if (value & 0x800) {
	    value -= 1;
	    value = ~value & 0xFFF;
        value = -value;
    }

    value *= 0.0625;

    return {chairs:value, cafeName:"Cafe Milano"};
}
