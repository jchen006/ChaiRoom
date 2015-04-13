// KPR Script file
var MODEL = require("mobile/model");
// assets
var openSeatIcon = '../assets/open.png';
var reservedSeatIcon = '../assets/reserved.png';
var occupiedSeatIcon = '../assets/occupied.png';

// Styles
var labelStyle = new Style({ font:"bold 16px", color:"black", horizontal:"left", vertical:"middle" });
var titleStyle = new Style({ font:"bold 30px", color:"black", horizontal:"center", vertical:"middle" });
var centerStyle = new Style({ color:"black", horizontal:"center", vertical:"middle" });


// Handlers
Handler.bind("/seats", {
	onInvoke: function(handler, message) {
		var data = message.requestObject;
		newOpenSeats = data["chairs"];
		model.data.newOpenSeats = newOpenSeats;
		model.data.cafeName = data["cafeName"];
		var numberOfReservedSeats = model.data.reservedSeats;
		
		var totalSeats = model.data.totalSeats;
		var numberOfOccupiedSeats =  totalSeats - (newOpenSeats)
		var numberOfOpenSeats  =  (newOpenSeats - numberOfReservedSeats)
		if(numberOfOpenSeats < 0) return 0;
		model.data.openSeats = numberOfOpenSeats.toFixed(0);
		model.data.occupiedSeats = numberOfOccupiedSeats.toFixed(0);
		application.distribute("onModelChanged");
	}
});
Handler.bind("/reserve", Object.create(Behavior.prototype, {
	onInvoke: { value:
		function(handler, message) {
			var query = parseQuery( message.query );
			var numOfReservedSeats = query.numOfReservedSeats;
			model.data.reservedSeats = parseInt(model.data.reservedSeats) + parseInt(numOfReservedSeats);
		},
	}
}));
Handler.bind("/data", {
	onInvoke: function(handler, message) {
		var data = { totalSeats: model.data.totalSeats,openSeats: model.data.openSeats };
		message.responseText = JSON.stringify( data );
		message.status = 200;
	}
});
// layouts
var MainScreen = Container.template(function($) { return {
	left:0, right:0, top:0, bottom:0,
	skin: new Skin({ fill: "white" }),
	contents: [
	Column($,{ style: titleStyle, top:5,
		contents: [
		this.cafeName = Label($, { style: titleStyle},),
		this.total = Label($, {top:5,  style:labelStyle },),
		Line($,{ style: titleStyle, 
			contents: [
			Picture($,{height:70,width:70,url:openSeatIcon,style: centerStyle,aspect: 'fit'}),
			this.available= Label($, { top:35,  style:labelStyle, },),
			]}),
		Line($,{left:0, style: titleStyle, top:25,
			contents: [
			Picture($,{height:60,width:60,url:reservedSeatIcon,style: centerStyle,aspect: 'fit'}),
			this.reserved= Label($, {top:20,   style:labelStyle },),
			Picture($,{height:60,width:60,url:occupiedSeatIcon,style: centerStyle,aspect: 'fit'}),
			this.occupied= Label($, {top:20,  style:labelStyle, },),
			]
		})
		]})
	],
	behavior: Object.create(Behavior.prototype, {
		onModelChanged: { value: function(container) {
			container.available.string  =  "Open : "  + model.data.openSeats ;
			container.reserved.string  = "Reserved : " + model.data.reservedSeats ;
			container.occupied.string  = "Occupied : " + model.data.occupiedSeats ;
			var total = parseInt(model.data.occupiedSeats) + parseInt(model.data.reservedSeats) + parseInt(model.data.openSeats) ;
			container.total.string  = "Total Seats: " + String(total);
			container.cafeName.string  = model.data.cafeName;
		}},
	}),
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
			openSeats: 30,
			reservedSeats: 0,
			totalSeats: 30,
			name:"",
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