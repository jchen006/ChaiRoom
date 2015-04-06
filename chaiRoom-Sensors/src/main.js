// KPR Script file
var MODEL = require("mobile/model");
var labelStyle = new Style({ font:"bold 25px", color:"black", horizontal:"left", vertical:"middle" });
var titleStyle = new Style({ font:"bold 35px", color:"black", horizontal:"center", vertical:"middle" });

Handler.bind("/seats", {
	onInvoke: function(handler, message) {
		var newOpenSeats = message.requestObject;
		var numberOfReservedSeats = model.data.reservedSeats;
		var totalSeats = model.data.totalSeats;
		var numberOfOccupiedSeats =  totalSeats - (newOpenSeats)
		var numberOfAvailableSeats  =  (newOpenSeats - numberOfReservedSeats)
		model.data.newOpenSeats = newOpenSeats;
		model.mainScreen.available.string  =  "Open Seats: "  + numberOfAvailableSeats.toFixed(0) ;
		model.mainScreen.reserved.string  = "Reserved Seats: " + numberOfReservedSeats.toFixed(0) ;
		model.mainScreen.occupied.string  = "Occupied Seats: " + numberOfOccupiedSeats.toFixed(0) ;
	}
});
// layouts
var MainScreen = Container.template(function($) { return {
	left:0, right:0, top:0, bottom:0,
	skin: new Skin({ fill: "white" }),
	contents: [
	Label($, { left:10, right:10, top:10, style: titleStyle,string:"Seats" },),
	this.available= Label($, { left:10, right:10, top:60, style:labelStyle,string: "Open Seats: ..." },),
	this.reserved= Label($, { left:10, right:10, top:125, style:labelStyle,string:"Reserved Seats: ..." },),
	this.occupied= Label($, { left:10, right:10, top:150, style:labelStyle,string:"Occupied Seats: ..." },),
	]
}});

// model
var ApplicationBehavior = function(application, data, context) {
	MODEL.ApplicationBehavior.call(this, application, data, context);
}

ApplicationBehavior.prototype =  Object.create(MODEL.ApplicationBehavior.prototype, {
	onComplete: { value: function(application, message) {
		if (0 != message.error) {
			application.skin = new Skin({ fill: "#f78e0f" });
			var style = new Style({ font:"bold 36px", color:"white", horizontal:"center", vertical:"middle" });
			application.add(new Label({ left:0, right:0, top:0, bottom:0, style: style, string:"Error " + message.error }));
			return;
		}
        this.mainScreen = new MainScreen(this.data);
        application.add(this.mainScreen);
    }},
    onLaunch: { value: function(application) {
    	application.shared = true;
    	var data = this.data = {
    		availableSeats: 0,
    		reservedSeats: 4,
    		totalSeats: 30,
    	};
    	var message = new MessageWithObject("pins:configure", {
    		chairs: {
    			require: "seat_sensor",
    			pins: {
    				chairs: { pin: 62 }
    			}
    		},
    	});
    	message.setRequestHeader("referrer", "xkpr://" + application.id);
    	application.invoke(message,Message.JSON);
    	application.invoke(new MessageWithObject("pins:/chairs/read?repeat=on&callback=/seats&interval=250"));
    }},
    onQuit: function(application) {
    	application.shared = false;
    }
});

var model = application.behavior = new ApplicationBehavior(application);