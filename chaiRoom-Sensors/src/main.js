// KPR Script file
var MODEL = require("mobile/model");
var CONTROL = require("mobile/control");
var TOOL = require('mobile/tool');
var THEME = require('themes/sample/theme');

var MINUTES_BEFORE_EXPIRED = 1; // CHANGE ME TO 0 FOR TESTING -- I SOULD BE 20
// assets
var openSeatIcon = '../assets/open.png';
var reservedSeatIcon = '../assets/reserved.png';
var occupiedSeatIcon = '../assets/occupied.png';
var floorIcon = '../assets/floor2.png'
var northsideFloor = '../assets/northside_floor.png'
var roundTableIcon = '../assets/round-table.png'
var recTableIcon = '../assets/rec-table.png'
var chairOccupiedIcon = '../assets/chair-red.png'
var chairOpenIcon = '../assets/chair-green.png'
var chairReservedIcon = '../assets/chair-gray.png'
var chairDetailIcon = '../assets/chair-detail.png'
var backIcon = '../assets/back.png'

var chairIcon = function(state,orientation){
	return '../assets/chair' + state + '-' + orientation +'.png'
}
var chairVIcon = function(state,orientation){
	return '../assets/chair' + state + '-v.png'
}
var chairHIcon = function(state,orientation){
	return '../assets/chair' + state + '-h.png'
}

var OPEN = 'Open'
var OCCUPIED = 'Occupied'
var RESERVED = 'Reserved'

// Styles
var labelStyle = new Style({ font:"bold 16px", color:"black", horizontal:"left", vertical:"middle" });
var titleStyle = new Style({ font:"bold 30px", color:"black", horizontal:"center", vertical:"middle" });
var centerStyle = new Style({ color:"black", horizontal:"center", vertical:"middle" });
var openStyle = new Style({ font:"bold 30px DS-Digital",color:"green", horizontal:"center", vertical:"middle" });
var occupiedStyle = new Style({font:"bold 30px DS-Digital", color:"red", horizontal:"center", vertical:"middle" });
var reservedStyle = new Style({ font:"bold 30px DS-Digital",color:"gray", horizontal:"center", vertical:"middle" });


// Handlers
var changeChairStatus = function(n, currStatus, newStatus, newStyle){
trace("changing status of: " + n + "chairs \n")
	var cafe = model.data.chairs
	var chairs = []
	for (var table in cafe){
		if(cafe.hasOwnProperty(table)){
			for(var chair in cafe[table]){
				if (cafe[table][chair].status == currStatus && n > 0){
				trace(newStatus + chair+ " from " + table + " s: " + cafe[table][chair].status + "\n")
					cafe[table][chair].status = newStatus
					cafe[table][chair].style = newStyle
					n--
					chairs.push(cafe[table][chair])
				}
			}
		}
	}
	return chairs
}
Handler.bind("/seats", {
	onInvoke: function(handler, message) {
		var data = message.requestObject;
		newOpenSeats = data["chairs"].toFixed(0);
		var numberOfReservedSeats = model.data.reservedSeats;
		var totalSeats = model.data.totalSeats;
		var currNumberOfOpenSeats = parseInt(model.data.openSeats) + parseInt(model.data.reservedSeats)
		var newOccupiedSeats =  totalSeats - (newOpenSeats)
		var numberOfOpenSeats  =  (newOpenSeats - numberOfReservedSeats)
		
		if(numberOfOpenSeats < 0 || newOpenSeats == currNumberOfOpenSeats) return 0;
		model.data.newOpenSeats = newOpenSeats;
		model.data.cafeName = data["cafeName"];
		model.data.openSeats = numberOfOpenSeats.toFixed(0);
		// occupied new seats
		var currOccupiedSeats = model.data.occupiedSeats
		if(currOccupiedSeats < newOccupiedSeats)
			changeChairStatus(newOccupiedSeats - currOccupiedSeats, OPEN,OCCUPIED, occupiedStyle)
		else{
			changeChairStatus( currOccupiedSeats - newOccupiedSeats,OCCUPIED, OPEN, openStyle)
		}
		model.data.occupiedSeats = newOccupiedSeats.toFixed(0); 
		application.distribute("onModelChanged");
	}
});
// params
// user_id, cafeId, numOfReservedSeats
Handler.bind("/reserve", Object.create(Behavior.prototype, {
	onInvoke: { value:
		function(handler, message) {
			trace("reserving")
			var query = parseQuery( message.query );
			var user_id = query.user_id;
			var id = query.cafeId;
			var name = query.cafeName;
			var numOfReservedSeats = query.numOfReservedSeats;
			var reservedChairs = changeChairStatus(numOfReservedSeats,OPEN, RESERVED,reservedStyle)
			for(var i in reservedChairs){
				reservedChairs[i].reservationName = user_id
			}
			model.data.openSeats = parseInt(model.data.openSeats) - parseInt(numOfReservedSeats)
			model.data.reservedSeats = parseInt(model.data.reservedSeats) + parseInt(numOfReservedSeats);
			
			var new_reservation = {cafeId: id,cafeName:name, time:new Date(),numberOfSeats: numOfReservedSeats, seats: reservedChairs, active: true};
			var reservationModel = model.data.reservationModel;
			if(!(user_id in reservationModel)){
				reservationModel[user_id] = [];
			}
			reservationModel[user_id].push(new_reservation);
			model.data.reservationModel[user_id] = reservationModel[user_id];
			application.distribute("onModelChanged");
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
	var cancelledSeats = changeChairStatus(reservation.numberOfSeats,RESERVED, OPEN,openStyle)
	for(var i in cancelledSeats){
		cancelledSeats[i].reservationName = ""
	}
	application.distribute("onModelChanged");
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
		Line($,{left:0, style: titleStyle, top:20,
			contents: [
			Picture($,{height:60,width:60,url:reservedSeatIcon,style: centerStyle,aspect: 'fit'}),
			this.reserved= Label($, {top:20,   style:labelStyle },),
			Picture($,{height:60,width:60,url:occupiedSeatIcon,style: centerStyle,aspect: 'fit'}),
			this.occupied= Label($, {top:20,  style:labelStyle, },),
			]
		}),
		Picture($,{height:40,width:40, url: floorIcon,right:5,aspect: 'fit', active: true, behavior: 
	Object.create(CONTROL.ButtonBehavior.prototype, {
		onTap: { value: function(container) {
			trace("clicked")
			
			
			application.add(model.cafeFloor)
			application.distribute("onModelChanged");
			
		}},})
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
var CafeFloor =  Container.template(function($) { return {
	left:0, right:0, top:0, bottom:0,
	skin: new Skin({ fill: "white" }),
	contents: [
	Picture ($,{left:2, right:2, top:2, bottom:2,url: northsideFloor }),
	Picture ($,{bottom:0,right:0,height:40,width:40,url: backIcon , active: true, behavior: 
				Object.create(CONTROL.ButtonBehavior.prototype, {
				onTap: { value: function(container) {
				application.remove(application.last)
					
			}},})
		}),
	]
	}})
var Table =  Container.template(function($) { return {
	left:0, right:0, top:0, bottom:0,
	contents: [
	Picture ($,{height:$.h,width:$.w,url: $.icon })
	]
	}})
var Chair = Container.template(function($) { return {
	left:0, right:0, top:0, bottom:0,
	contents: [
	Picture ($,{height:15,width:30,url: $.icon })
	]
	}})

var RoundTable  = Container.template(function($) { return {
	height:70,width:70,right:$.right,top:$.top,
	name :$.name,
	skin: new Skin({ fill: "white" }),
	contents: [
		Picture ($,{height:40,width:40,url: roundTableIcon }),
		Picture ($,{name: "chair1",left:0,height:30,width:15,url: chairIcon(OPEN,'v') , active: true, behavior: 
			Object.create(CONTROL.ButtonBehavior.prototype, {
			onTap: { value: function(container) {
				
				var tableName = container.container.name
				var table = model.data.chairs[tableName]
				var chair = table.chair1
				application.add(new ChairDetail({style: chair.style,status: chair.status, reservationName: chair.reservationName}))
				
			}},})
		}),
		Picture ($,{name: "chair2",right:0,height:30,width:15,url: chairIcon(OPEN,'v') , active: true, behavior: 
			Object.create(CONTROL.ButtonBehavior.prototype, {
			onTap: { value: function(container) {
				
				var tableName = container.container.name
				var table = model.data.chairs[tableName]
				var chair = table.chair2
				application.add(new ChairDetail({style: chair.style,status: chair.status, reservationName: chair.reservationName}))
				
			}},})
			}),
		Picture ($,{name: "chair3",top:0,height:15,width:30,url: chairIcon(OPEN,'h') , active: true, behavior: 
			Object.create(CONTROL.ButtonBehavior.prototype, {
			onTap: { value: function(container) {
				
				var tableName = container.container.name
				var table = model.data.chairs[tableName]
				var chair = table.chair3
				application.add(new ChairDetail({style: chair.style,status: chair.status, reservationName: chair.reservationName}))
				
			}},})}),
		Picture ($,{name: "chair4",bottom:0,height:15,width:30,url: chairIcon(OPEN,'h') , active: true, behavior: 
			Object.create(CONTROL.ButtonBehavior.prototype, {
			onTap: { value: function(container) {
				
				var tableName = container.container.name
				var table = model.data.chairs[tableName]
				var chair = table.chair4
				application.add(new ChairDetail({style: chair.style,status: chair.status, reservationName: chair.reservationName}))
			}},})})
	
	],
	behavior: Object.create(Behavior.prototype, {
		onCreate: { value: function(container, data) {
			this.data = data;
			if(!model.data.chairs.hasOwnProperty(container.name)){
			model.data.chairs[container.name] = {chair1:{status: OPEN,orientation:'v', style: openStyle,reservationName:''},
												chair2:{status: OPEN,orientation:'v', style: openStyle,reservationName:''},
												chair3:{status: OPEN,orientation:'h', style: openStyle,reservationName:''},
												chair4:{status: OPEN,orientation:'h', style: openStyle,reservationName:''}}
												}
		}},
		onModelChanged: { value: function(container) {
			trace(container.name + " has changed \n")
			var chair1 = container.first.next
			var chair2 = chair1.next
			var chair3 = chair2.next
			var chair4 = chair3.next
			
			var tableName = container.name
			var table = model.data.chairs[tableName]
			
			chair1URL = chairIcon(table.chair1.status,table.chair1.orientation)
			chair2URL = chairIcon(table.chair2.status,table.chair2.orientation)
			chair3URL = chairIcon(table.chair3.status,table.chair3.orientation)
			chair4URL = chairIcon(table.chair4.status,table.chair4.orientation)
			var isUrlEqual = function(url,uri){
				return mergeURI(application.url , url) === uri
			}
			if(!isUrlEqual(chair1URL,chair1.url)){
			trace("chair 1 changed status" + "\n")
				chair1.url = chair1URL
				}
			if(!isUrlEqual(chair2URL,chair2.url)){
				trace("chair 2 changed status" + "\n")
				chair2.url = chair2URL
				}
			if(!isUrlEqual(chair3URL,chair3.url)){
			trace("chair 3 changed status" + "\n")
				chair3.url = chair3URL
				}
			if(!isUrlEqual(chair4URL,chair4.url)){
			trace("chair 4 changed status" + "\n")
				chair4.url = chair4URL
				}
		}},
		onDisplaying: { value: function(container) {
			application.distribute("onModelChanged");
		}},
		}),
	
	}})
	
var RecTable  = Container.template(function($) { return {
	height:55,width:60,right:$.right,top:$.top,
	name :$.name,
	skin: new Skin({ fill: "white" }),
	contents: [
		Picture ($,{height:40,width:60,url: recTableIcon }),
		Picture ($,{name: "chair1",top:0,left:2,height:15,width:25,url: chairIcon(OPEN,'h') , active: true, behavior: 
			Object.create(CONTROL.ButtonBehavior.prototype, {
			onTap: { value: function(container) {
				
				var tableName = container.container.name
				var table = model.data.chairs[tableName]
				var chair = table.chair1
				application.add(new ChairDetail({style: chair.style,status: chair.status, reservationName: chair.reservationName}))
				
			}},})
		}),
		Picture ($,{name: "chair2",top:0,right:2,height:15,width:25,url: chairIcon(OPEN,'h') , active: true, behavior: 
			Object.create(CONTROL.ButtonBehavior.prototype, {
			onTap: { value: function(container) {
				
				var tableName = container.container.name
				var table = model.data.chairs[tableName]
				var chair = table.chair2
				application.add(new ChairDetail({style: chair.style,status: chair.status, reservationName: chair.reservationName}))
				
			}},})
			}),
		Picture ($,{name: "chair3",bottom:0,left:2,height:15,width:25,url: chairIcon(OPEN,'h') , active: true, behavior: 
			Object.create(CONTROL.ButtonBehavior.prototype, {
			onTap: { value: function(container) {
				
				var tableName = container.container.name
				var table = model.data.chairs[tableName]
				var chair = table.chair3
				application.add(new ChairDetail({style: chair.style,status: chair.status, reservationName: chair.reservationName}))
				
			}},})}),
		Picture ($,{name: "chair4",bottom:0,right:2,height:15,width:25,url: chairIcon(OPEN,'h') , active: true, behavior: 
			Object.create(CONTROL.ButtonBehavior.prototype, {
			onTap: { value: function(container) {
				
				var tableName = container.container.name
				var table = model.data.chairs[tableName]
				var chair = table.chair4
				application.add(new ChairDetail({style: chair.style,status: chair.status, reservationName: chair.reservationName}))
			}},})})
	
	],
	behavior: Object.create(Behavior.prototype, {
		onCreate: { value: function(container, data) {
			this.data = data;
			if(!model.data.chairs.hasOwnProperty(container.name)){
				model.data.chairs[container.name] = {chair1:{status: OPEN,orientation:'h', style: openStyle,reservationName:''},
												chair2:{status: OPEN,orientation:'h', style: openStyle,reservationName:''},
												chair3:{status: OPEN,orientation:'h', style: openStyle,reservationName:''},
												chair4:{status: OPEN,orientation:'h', style: openStyle,reservationName:''}}
												}
		}},
		onModelChanged: { value: function(container) {
			trace(container.name + " has changed \n")
			var chair1 = container.first.next
			var chair2 = chair1.next
			var chair3 = chair2.next
			var chair4 = chair3.next
			
			var tableName = container.name
			var table = model.data.chairs[tableName]
			
			chair1URL = chairIcon(table.chair1.status,table.chair1.orientation)
			chair2URL = chairIcon(table.chair2.status,table.chair2.orientation)
			chair3URL = chairIcon(table.chair3.status,table.chair3.orientation)
			chair4URL = chairIcon(table.chair4.status,table.chair4.orientation)
			var isUrlEqual = function(url,uri){
				return mergeURI(application.url , url) === uri
			}
			if(!isUrlEqual(chair1URL,chair1.url)){
			trace("chair 1 changed status" + "\n")
				chair1.url = chair1URL
				}
			if(!isUrlEqual(chair2URL,chair2.url)){
				trace("chair 2 changed status" + "\n")
				chair2.url = chair2URL
				}
			if(!isUrlEqual(chair3URL,chair3.url)){
			trace("chair 3 changed status" + "\n")
				chair3.url = chair3URL
				}
			if(!isUrlEqual(chair4URL,chair4.url)){
			trace("chair 4 changed status" + "\n")
				chair4.url = chair4URL
				}
		}},
		onDisplaying: { value: function(container) {
			application.distribute("onModelChanged");
		}},
		}),
	
	}})
var ChairDetail  = Container.template(function($) { return {
	left:0,right:0,bottom:0,top:0,
	skin: new Skin({ fill: "white" }),
	contents: [
		Picture ($,{left:10,right:10,bottom:10,top:10,url: chairDetailIcon }),
		Column($,{style: centerStyle,width:100,height:100,top:40,left:135,
		contents:[
			Label($,{style: $.style , string:$.status}),
			Label($, {top:10,style: centerStyle, string:$.reservationName}),
			
		]
		}),
		Picture ($,{top:5,left:5,height:40,width:40,url: backIcon , active: true, behavior: 
				Object.create(CONTROL.ButtonBehavior.prototype, {
				onTap: { value: function(container) {
				application.remove(application.last)
					
			}},})
		}),
	]
	}})	

	

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
		
		this.cafeFloor = new CafeFloor();
		var table1 = new RoundTable({right:35,top:25, name:"table1"})
			
		this.cafeFloor.add(table1)
		this.cafeFloor.add(new RoundTable({right:35,top:110, name:"table2"}))
		this.cafeFloor.add(new RoundTable({right:130,top:150, name:"table3"}))
			
		this.cafeFloor.add(new RecTable({right:215,top:70, name:"table4"}))
		this.cafeFloor.add(new RecTable({right:215,top:150, name:"table5"}))
		application.distribute("onModelChanged");
		//
	}},
	onLaunch: { value: function(application) {
		application.shared = true;
		var data = this.data = {
			openSeats: 0,
			reservedSeats: 0,
			occupiedSeats:0,
			reservationModel:{},
			totalSeats: 20,
			cafeName:"Northside Cafe",
			chairs:{}
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