// KPR Script file
var MODEL = require("mobile/model");
var MINUTES_BEFORE_EXPIRED = 1; // CHANGE ME TO 0 FOR TESTING -- I SOULD BE 20
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
// params
// user_id, cafeId, numOfReservedSeats
Handler.bind("/reserve", Object.create(Behavior.prototype, {
	onInvoke: { value:
		function(handler, message) {
			var query = parseQuery( message.query );
			var numOfReservedSeats = query.numOfReservedSeats;
			model.data.reservedSeats = parseInt(model.data.reservedSeats) + parseInt(numOfReservedSeats);
			var user_id = query.user_id;
			var id = query.cafeId;
			var name = query.cafeName;
			var new_reservation = {cafeId: id,cafeName:name, time:new Date(),numberOfSeats: numOfReservedSeats, active: true};
			var reservationModel = model.data.reservationModel;
			if(!(user_id in reservationModel)){
				reservationModel[user_id] = [];
			}
			reservationModel[user_id].push(new_reservation);
			model.data.reservationModel[user_id] = reservationModel[user_id];
			trace(query.cafeName)
		},
	}
}));
var checkExpiredReservations = function(r){
			var now = new Date();
			var cancelled = []
			var valid = []
			for(var i in r){
				var reservation= r[i]
				if(reservation.active){
					var reservationTime = reservation.time;
					var diff = parseInt(now.getTime()) - parseInt(reservationTime.getTime());
					var minutes = Math.round(parseInt(diff)/60000);
					if(minutes >= MINUTES_BEFORE_EXPIRED){
						trace("reservation cancelled")
						cancelled.push(reservation)
						cancelReservation(reservation)
					}else{
						valid.push(reservation)
					}
				}
			}
			return {"cancelled":cancelled, "valid":valid };
	}
var cancelReservation = function(reservation){
	reservation.active = false;
	model.data.reservedSeats = parseInt(model.data.reservedSeats) - parseInt(reservation.numberOfSeats) ;
}
// params
// user_id
Handler.bind("/data", {
	onInvoke: function(handler, message) {
		var query = parseQuery( message.query );
		var user_id = query.user_id
		var userReservations = {"cancelled":[], "valid":[] };
		if(model.data.reservationModel.hasOwnProperty(user_id)){
			userReservations =  checkExpiredReservations(model.data.reservationModel[user_id])
		}
		var data = {reservations: userReservations, totalSeats: model.data.totalSeats,openSeats: model.data.openSeats };
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
			reservationModel:{},
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