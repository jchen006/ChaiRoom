// KPR Script file
var MODEL = require("mobile/model");
var CONTROL = require("mobile/control");
var TOOL = require('mobile/tool');
var THEME = require('themes/sample/theme');

var MINUTES_BEFORE_EXPIRED = 2; // CHANGE ME TO 0 FOR TESTING -- I SOULD BE 20
// assets
var openSeatIcon = '../assets/empty-chair.png';
var reservedSeatIcon = '../assets/blue-chair-grey-person.png';
var occupiedSeatIcon = '../assets/blue-chair-person.png';

var floorIcon = '../assets/chair-button.png'

var northsideFloor = '../assets/northside_floor.png'

var roundTableIcon = '../assets/circle_table.png'
var recTableIcon = '../assets/square_table.png'
var lcdIcon = '../assets/lcd.png'


var chairDetailIcon = '../assets/chair-detail.png'
var backIcon = '../assets/blue-arrow.png'

var chairIcon = function(state,orientation){
	return '../assets/chair' + state + '-' + orientation +'.png'
}
var chairIconFlip = function(state,orientation){
	return '../assets/chair' + state + '-f.png'
}

var OPEN = 'Open'
var OCCUPIED = 'Occupied'
var RESERVED = 'Reserved'

// Styles
var countStyle = new Style({ font:"25px Helvetica bold", color:"#30A8BE", horizontal:"right", vertical:"middle" });
var listStyle = new Style({ font:"25px Helvetica Light", color:"#30A8BE", horizontal:"middle", vertical:"middle" });

var titleStyle = new Style({ font:"bold 30px", color:"#30A8BE", horizontal:"center", vertical:"middle" });
var centerStyle = new Style({ color:"#f2f5f1",horizontal:"center", vertical:"middle" });

var openStyle = new Style({ font:"bold 30px",color:"white", horizontal:"center", vertical:"middle" });
var occupiedStyle = new Style({font:"bold 30px", color:"white", horizontal:"center", vertical:"middle" });
var reservedStyle = new Style({ font:"bold 30px",color:"white", horizontal:"center", vertical:"middle" });
var separatorSkin = new Skin({ fill: '#30A8BE',});
var withBoarder = new Skin({ fill:"#ffffff",borders: {color: 'black', left:2, right:2, top:2, bottom:2 }, stroke: '#30A8BE',});
// Handlers
var getId = function(name){
	return name.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '').toLowerCase();
}
var changeCancelledChairStatus = function(id,n, currStatus, newStatus, newStyle, newReservationName){
	trace("changing status of: " + n + "chairs \n")
	var cafe = model.data[id].chairs
	var chairs = []
	for (var table in cafe){
		if(cafe.hasOwnProperty(table)){
			for(var chair in cafe[table]){
				if (cafe[table][chair].status == currStatus && n > 0){
					cafe[table][chair].status = newStatus
					cafe[table][chair].style = newStyle
					cafe[table][chair].reservationName = newReservationName
					n--
					chairs.push(cafe[table][chair])
				}
			}
		}
	}
	return chairs
}
var changeChairStatus = function(id,n, currStatus, newStatus, newStyle, newReservationName){
	trace("changing status of: " + n + " chairs \n")
	var cafe = model.data[id].chairs
	var chairs = []
	var openChairs = {"best": [], "good": []}
	for (var table in cafe){
		var temp = []
		if(cafe.hasOwnProperty(table)){
			
			for(var chair in cafe[table]){
				
				if (cafe[table][chair].status == currStatus ){
					temp.push(cafe[table][chair])
				}
				if (temp.length > n || temp.length == 4){
					Array.prototype.push.apply(openChairs["best"],temp)
				}else{
					Array.prototype.push.apply(openChairs["good"],temp)
				}
			}
		}
		
	}
	//trace(openChairs["best"].length)
	for(var i in openChairs["best"]){
		if(n > 0){
			var chair = openChairs["best"][i]
			cafe[chair.table][chair.name].status = newStatus
			cafe[chair.table][chair.name].style = newStyle
			cafe[chair.table][chair.name].reservationName = newReservationName
			chairs.push(cafe[chair.table][chair.name])
			n --
		}
		
	}
	for(var i in openChairs["good"]){
		if(n > 0){
			var chair = openChairs["good"][i]
			cafe[chair.table][chair.name].status = newStatus
			cafe[chair.table][chair.name].style = newStyle
			cafe[chair.table][chair.name].reservationName = newReservationName
			chairs.push(cafe[chair.table][chair.name])
			n --
		}
		
	}
	return chairs
}
Handler.bind("/northside", {
	onInvoke: function(handler, message) {
		var data = message.requestObject;
		newOpenSeats = data["chairs"].toFixed(0);
		var id = getId(data["cafeName"])
		var northside = model.data[id]
		var numberOfReservedSeats = northside.reservedSeats;
		var totalSeats = northside.totalSeats;
		var currNumberOfOpenSeats = parseInt(northside.openSeats) + parseInt(northside.reservedSeats)
		var newOccupiedSeats =  totalSeats - (newOpenSeats)
		var numberOfOpenSeats  =  (newOpenSeats - numberOfReservedSeats)
		
		if(numberOfOpenSeats < 0 || newOpenSeats == currNumberOfOpenSeats) return 0;
		northside.newOpenSeats = newOpenSeats;
		northside.cafeName = data["cafeName"];
		northside.openSeats = numberOfOpenSeats.toFixed(0);
		// occupied new seats
		var currOccupiedSeats = northside.occupiedSeats
		if(currOccupiedSeats < newOccupiedSeats)
			changeChairStatus(id,newOccupiedSeats - currOccupiedSeats, OPEN,OCCUPIED, occupiedStyle,"")
		else{
			changeChairStatus(id, currOccupiedSeats - newOccupiedSeats,OCCUPIED, OPEN, openStyle,"")
		}
		northside.occupiedSeats = newOccupiedSeats.toFixed(0); 
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
			var nameOfReservation = query.nameOfReservation
			var numOfReservedSeats = query.numOfReservedSeats;
			var targetCafe = model.data[id]
			var reservedChairs = changeChairStatus(id,numOfReservedSeats,OPEN, RESERVED,reservedStyle,"By: " + nameOfReservation)
			if (parseInt(numOfReservedSeats) < 0 ) {return}
			targetCafe.openSeats = parseInt(targetCafe.openSeats) - parseInt(numOfReservedSeats)
			targetCafe.reservedSeats = parseInt(targetCafe.reservedSeats) + parseInt(numOfReservedSeats);
			
			var new_reservation = {name: nameOfReservation,cafeId: id,cafeName:name, time:new Date(),numberOfSeats: numOfReservedSeats, seats: reservedChairs, active: true};
			var reservationModel = model.data.reservationModel;
			if(!(user_id in reservationModel)){
				reservationModel[user_id] = [];
			}
			//trace(new_reservation)
			reservationModel[user_id].push(new_reservation);
			model.data.reservationModel[user_id] = reservationModel[user_id];
			application.distribute("onModelChanged");
		},
	}
}));
Handler.bind("/cancel", Object.create(Behavior.prototype, {
	onInvoke: { value:
		function(handler, message) {
			trace("cancelling")
			var query = parseQuery( message.query );
			var user_id = query.user_id;
			var id = query.cafeId;
			var nameOfReservation = query.nameOfReservation
			var trgetCafe = model.data[id]
			var reservationModel = model.data.reservationModel;
			var reservations =reservationModel[user_id]
			for(var i in reservations){
				if(reservations[i].cafeId === id && reservations[i].name === nameOfReservation && reservations[i].active){
					cancelReservation(reservations[i])
				}
			}
		},
	}
}));
var getKeys = function(obj){
	var keys = [];
	for(var key in obj){
		keys.push(key);
	}
	return keys;
}
Handler.bind("/locateSeats", Object.create(Behavior.prototype, {
	onInvoke: { value:
		function(handler, message) {
			trace("LocateSeats")
			var query = parseQuery( message.query );
			this.data = query
			var user_id = query.user_id;
			var id = query.cafeId;
			var n = query.n
			var targetCafe = model.data[id]
			if (n == 0) return
				var nameOfReservation = query.nameOfReservation
			var reservationModel = model.data.reservationModel;
			var reservations =reservationModel[user_id]
			var seats 
			var cafe = targetCafe.chairs
			for(var i in reservations){
				if(reservations[i].cafeId === id && reservations[i].name === nameOfReservation && reservations[i].active){
					seats = reservations[i].seats
						for(var i in seats){
							var seat = seats[i]
							var chair = cafe[seat.table][seat.name]
							var status = chair.status === OPEN? RESERVED : OPEN
							chair.status = status
						}
						application.distribute("onModelChanged");
						handler.wait( 500 )
				}
			}
			
		},
		
	},
	onComplete: { value: 
		function(handler,message,json,data) {
			trace("onComplete locating seats")
			trace(this.data.n)
			var user_id = this.data.user_id;
			var id = this.data.cafeId;
			var nameOfReservation = this.data.nameOfReservation
			var n = parseInt(this.data.n)
			var params = "?user_id=" +user_id +"&nameOfReservation="+ nameOfReservation  + "&cafeId="+ id + "&n=" + --n ;
			handler.invoke(new Message("/locateSeats" + params));
			
		},
	},
})
);


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
				reservation.remainTime = MINUTES_BEFORE_EXPIRED - minutes
				valid.push(reservation)
			}
		}
	}
	return {"cancelled":cancelled, "valid":valid };
}
var cancelReservation = function(reservation){
	var cancelledSeats = changeCancelledChairStatus(reservation.cafeId,reservation.numberOfSeats,RESERVED, OPEN,openStyle,"")
	if (reservation.active == false) {return}
	reservation.active = false;
	var targetCafe = model.data[reservation.cafeId]
	targetCafe.reservedSeats = parseInt(targetCafe.reservedSeats) - parseInt(reservation.numberOfSeats) ;
	application.distribute("onModelChanged");
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
		var data = {reservations: userReservations, cafesData: model.data };
		message.responseText = JSON.stringify( data );
		message.status = 200;
	}
});
Handler.bind("/myReservations", {
	onInvoke: function(handler, message) {
		var query = parseQuery( message.query );
		var user_id = query.user_id
		var userReservations = {"cancelled":[], "valid":[] };
		if(model.data.reservationModel.hasOwnProperty(user_id)){
			userReservations =  checkExpiredReservations(model.data.reservationModel[user_id])
		}
		var data = userReservations["valid"]
		message.responseText = JSON.stringify( data );
		message.status = 200;
	}
});
// layouts
var iconSize = 45
var CafeScreen = Container.template(function($) { return {
	left:0, right:0, top:0, bottom:0,
	skin: new Skin({ fill: "white" }),
	contents: [
	Column($,{ left:0,right:0,bottom:0, top:0,  
		contents: [
		Line($,{  left:0,right:0, top:5,style: centerStyle,bottom:0,
			contents: [
			Picture($,{height:40,width:40,left:5, url: floorIcon,aspect: 'fit', active: true, behavior: 
				Object.create(CONTROL.ButtonBehavior.prototype, {
					onTap: { value: function(container) {
						trace("clicked")
						application.add(this.data.floor)
						application.distribute("onModelChanged");
						
					}},
				})
			}),
			this.cafeName = Label($, {left:30, style: titleStyle},),
			]}),
		Line($,{  left:0,right:0, top:5,style: centerStyle,bottom:0,
			contents: [
			Picture($,{left:0,bottom:5, height:iconSize,width:iconSize, url:openSeatIcon,style: centerStyle, aspect: 'fit'}),
			Label($, {left:20,bottom:5,  style: listStyle,string :"Open Seats: " },),
			this.available= Label($, {left:40,bottom:5,  style: countStyle, },),
			]}),
		Line($, { left: 10, right: 10, height: 1.5, skin: separatorSkin, }),
		Line($,{left:0,right:0, style: centerStyle, top:5,
			contents: [
			Picture($,{left:0,bottom:5,height: iconSize,width: iconSize,url:occupiedSeatIcon,style: centerStyle,aspect: 'fit'}),
			Label($, {left:20,bottom:5, style: listStyle,string :"Occupied Seats: " },),
			this.occupied= Label($, {left:5,bottom:5,  style: countStyle, },),
			]
		}),
		Line($, { left: 10, right: 10, height: 1.5, skin: separatorSkin, }),
		Line($,{left:0,right:0,  top:5,bottom:0,
			contents: [
			Picture($,{left:0,bottom:5,height: iconSize,width: iconSize,url:reservedSeatIcon,style: centerStyle,aspect: 'fit'}),
			Label($, {left:20,bottom:5,  style: listStyle,string :"Reserved Seats: " },),
			this.reserved= Label($, { left:10,bottom:5, style: countStyle },),
			]
		}),
		Line($, { left: 10, right: 10, height: 1.5, skin: separatorSkin, }),
		Line($,{left:0,right:0, style: centerStyle, top:5,
			contents: [
			Picture($,{height:30,width:30,left:5, url: '../assets/home.png',aspect: 'fit', active: true, behavior: 
				Object.create(CONTROL.ButtonBehavior.prototype, {
					onTap: { value: function(container) {
						trace("clicked")
						application.remove(application.last)
						
					}},
				})
				}),
			Label($, {left:80, style: listStyle,string :"Total Seats: " },),
			this.total = Label($, {left:10,  style: countStyle },),
			]})
		]})
],
behavior: Object.create(Behavior.prototype, {
		onCreate: { value: function(container, data) {
			this.data = data
			
		}},
	onModelChanged: { value: function(container) {
		var targetCafe = model.data[$.cafeId]
		container.available.string  =   String(targetCafe.openSeats) ;
		container.reserved.string  =  String(targetCafe.reservedSeats) ;
		container.occupied.string  =   String(targetCafe.occupiedSeats) ;
		var total = parseInt(targetCafe.occupiedSeats) + parseInt(targetCafe.reservedSeats) + parseInt(targetCafe.openSeats) ;
		container.total.string  =  String(total);
		container.cafeName.string  = targetCafe.cafeName;
	}},
}),
}});
var CafeFloor =  Container.template(function($) { return {
	left:0, right:0, top:0, bottom:0,
	skin: new Skin({ fill: "white" }),
	contents: [
	Line($,{left:0,right:0,top:5,
		contents: [
		Picture ($,{left:0,top:5,bottom:10,height:40,width:40,url: backIcon , active: true, behavior: 
			Object.create(CONTROL.ButtonBehavior.prototype, {
				onTap: { value: function(container) {
					application.remove(application.last)
					
				}},})
		}),
		Label($, {left:10, style: titleStyle,string: $.cafeName},),
		]})
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
	height:85,width:85,right:$.right,top:$.top,
	name :$.name,
	skin: new Skin({ fill: "white" }),
	contents: [
	Picture ($,{height:65,width:65, url: roundTableIcon }),
	Picture ($,{name: "chair1",left:0,height:30,width:15,url: chairIcon(OPEN,'v') , active: true, behavior: 
		Object.create(CONTROL.ButtonBehavior.prototype, {
			onTap: { value: function(container) {
				
				var tableName = container.container.name
				var table = this.data.targetCafe.chairs[tableName]
				var chair = table.chair1
				application.add(new ChairDetail({style: chair.style,status: chair.status, reservationName: chair.reservationName}))
				
			}},})
	}),
	Picture ($,{name: "chair2",right:0,height:30,width:15,url: chairIcon(OPEN,'v') , active: true, behavior: 
		Object.create(CONTROL.ButtonBehavior.prototype, {
			onTap: { value: function(container) {
				
				var tableName = container.container.name
				var table = this.data.targetCafe.chairs[tableName]
				var chair = table.chair2
				application.add(new ChairDetail({style: chair.style,status: chair.status, reservationName: chair.reservationName}))
				
			}},})
	}),
	Picture ($,{name: "chair3",top:0,height:15,width:30,url: chairIcon(OPEN,'h') , active: true, behavior: 
		Object.create(CONTROL.ButtonBehavior.prototype, {
			onTap: { value: function(container) {
				
				var tableName = container.container.name
				var table = this.data.targetCafe.chairs[tableName]
				var chair = table.chair3
				application.add(new ChairDetail({style: chair.style,status: chair.status, reservationName: chair.reservationName}))
				
			}},})}),
	Picture ($,{name: "chair4",bottom:0,height:15,width:30,url: chairIcon(OPEN,'h') , active: true, behavior: 
		Object.create(CONTROL.ButtonBehavior.prototype, {
			onTap: { value: function(container) {
				
				var tableName = container.container.name
				var table = this.data.targetCafe.chairs[tableName]
				var chair = table.chair4
				application.add(new ChairDetail({style: chair.style,status: chair.status, reservationName: chair.reservationName}))
			}},})})
	
	],
	behavior: Object.create(Behavior.prototype, {
		onCreate: { value: function(container, data) {
			this.data = data;
			this.data.targetCafe =  model.data[this.data.cafeId]
			if(!this.data.targetCafe.chairs.hasOwnProperty(container.name)){
				this.data.targetCafe.chairs[container.name] = {chair1:{name:"chair1",table:container.name,status: OPEN,orientation:'v', style: openStyle,reservationName:''},
				chair2:{name:"chair2",table:container.name,status: OPEN,orientation:'v', style: openStyle,reservationName:''},
				chair3:{name:"chair3",table:container.name,status: OPEN,orientation:'h', style: openStyle,reservationName:''},
				chair4:{name:"chair4",table:container.name,status: OPEN,orientation:'h', style: openStyle,reservationName:''}}
			}
		}},
		onModelChanged: { value: function(container) {
			trace(container.name + " has changed \n")
			var chair1 = container.first.next
			var chair2 = chair1.next
			var chair3 = chair2.next
			var chair4 = chair3.next
			
			var tableName = container.name
			var table = this.data.targetCafe.chairs[tableName]
			
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
	height:62,width:75,right:$.right,top:$.top,
	name :$.name,
	skin: new Skin({ fill: "white" }),
	contents: [
	Picture ($,{height:85,width:75,url: recTableIcon }),
	Picture ($,{name: "chair1",top:0,left:2,height:15,width:25,url: chairIcon(OPEN,'h') , active: true, behavior: 
		Object.create(CONTROL.ButtonBehavior.prototype, {
			onTap: { value: function(container) {
				
				var tableName = container.container.name
				var table = this.data.targetCafe.chairs[tableName]
				var chair = table.chair1
				application.add(new ChairDetail({style: chair.style,status: chair.status, reservationName: chair.reservationName}))
				
			}},})
	}),
	Picture ($,{name: "chair2",top:0,right:2,height:15,width:25,url: chairIcon(OPEN,'h') , active: true, behavior: 
		Object.create(CONTROL.ButtonBehavior.prototype, {
			onTap: { value: function(container) {
				
				var tableName = container.container.name
				var table = this.data.targetCafe.chairs[tableName]
				var chair = table.chair2
				application.add(new ChairDetail({style: chair.style,status: chair.status, reservationName: chair.reservationName}))
				
			}},})
	}),
	Picture ($,{name: "chair3",bottom:0,left:2,height:15,width:25,url: chairIcon(OPEN,'h') , active: true, behavior: 
		Object.create(CONTROL.ButtonBehavior.prototype, {
			onTap: { value: function(container) {
				
				var tableName = container.container.name
				var table = this.data.targetCafe.chairs[tableName]
				var chair = table.chair3
				application.add(new ChairDetail({style: chair.style,status: chair.status, reservationName: chair.reservationName}))
				
			}},})}),
	Picture ($,{name: "chair4",bottom:0,right:2,height:15,width:25,url: chairIcon(OPEN,'h') , active: true, behavior: 
		Object.create(CONTROL.ButtonBehavior.prototype, {
			onTap: { value: function(container) {
				
				var tableName = container.container.name
				var table = this.data.targetCafe.chairs[tableName]
				var chair = table.chair4
				application.add(new ChairDetail({style: chair.style,status: chair.status, reservationName: chair.reservationName}))
			}},})})
	
	],
	behavior: Object.create(Behavior.prototype, {
		onCreate: { value: function(container, data) {
			this.data = data;
			this.data.targetCafe =  model.data[this.data.cafeId]
			if(!this.data.targetCafe.chairs.hasOwnProperty(container.name)){
				this.data.targetCafe.chairs[container.name] = {chair1:{name:"chair1",table:container.name,status: OPEN,orientation:'h', style: openStyle,reservationName:''},
				chair2:{name:"chair2",table:container.name,status: OPEN,orientation:'h', style: openStyle,reservationName:''},
				chair3:{name:"chair3",table:container.name,status: OPEN,orientation:'h', style: openStyle,reservationName:''},
				chair4:{name:"chair4",table:container.name,status: OPEN,orientation:'h', style: openStyle,reservationName:''}}
			}
		}},
		onModelChanged: { value: function(container) {
			trace(container.name + " has changed \n")
			var chair1 = container.first.next
			var chair2 = chair1.next
			var chair3 = chair2.next
			var chair4 = chair3.next
			
			var tableName = container.name
			var table = this.data.targetCafe.chairs[tableName]
			
			chair1URL = chairIcon(table.chair1.status,table.chair1.orientation)
			chair2URL = chairIcon(table.chair2.status,table.chair2.orientation)
			chair3URL = chairIcon(table.chair3.status,table.chair3.orientation)
			chair4URL = chairIcon(table.chair4.status,table.chair4.orientation)
			var isUrlEqual = function(url,uri){
				return mergeURI(application.url , url) === uri
			}
			if(!isUrlEqual(chair1URL,chair1.url)){
				trace("chair 1 changed status to " + table.chair1.status +  "\n")
				chair1.url = chair1URL
			}
			if(!isUrlEqual(chair2URL,chair2.url)){
				trace("chair 2 changed status to " + table.chair2.status +  "\n")
				chair2.url = chair2URL
			}
			if(!isUrlEqual(chair3URL,chair3.url)){
				trace("chair 3 changed status to " + table.chair3.status +  "\n")
				chair3.url = chair3URL
			}
			if(!isUrlEqual(chair4URL,chair4.url)){
				trace("chair 4 changed status to " + table.chair4.status +  "\n")
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
	Picture ($,{left:95,bottom:50,width:200,height:200,url: lcdIcon }),
	Picture ($,{width:130,height:130,left:0,bottom:20,url: chairIconFlip($.status) }),
	Column($,{style: centerStyle,width:100,height:100,top:60,left:145,
		contents:[
		Label($,{style: $.style , string:$.status}),
		Label($, {top:0,style: centerStyle, string:$.reservationName}),
		
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

var MainScreen = Container.template(function($) { return {
	left:0, right:0, top:0, bottom:0,
	skin: new Skin({ fill: "white" }),
	contents: [
		Column($,{ left:0,right:0,bottom:0, top:0,  
			contents: [
			Line($,{  left:10,right:10, top:5,style: centerStyle,skin: withBoarder,
				contents: [
					Picture($,{height:100,width:150, url: '../assets/northside_logo.png',aspect: 'fit', 
					active: true, skin: withBoarder, behavior: 
						Object.create(CONTROL.ButtonBehavior.prototype, {
							onTap: { value: function(container) {
								trace("clicked")
								application.add(model.northsideCafe)
								application.distribute("onModelChanged");
								
							}},
						})
					}),
					Column($, { height:100, width: 1, skin: withBoarder, }),
					Picture($,{left:5,height:100,width:140, url: '../assets/yaliscafe_logo.png',aspect: 'fit', active: true, behavior: 
						Object.create(CONTROL.ButtonBehavior.prototype, {
							onTap: { value: function(container) {
								trace("clicked")
								application.add(model.yalisCafe)
								application.distribute("onModelChanged");
								
							}},
						})
					}),
					
				]}),
		
			],

}),
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
		var mainScreen  = new MainScreen()
		application.add(mainScreen);
		// Northside
		var cafeid = "northsidecafe"

		this.northsideCafeFloor = new CafeFloor({cafeName: "Northside Cafe"});
		var table1 = new RoundTable({right:20,top:45,cafeId: cafeid, name:"table1"})
		
		this.northsideCafeFloor.add(table1)
		this.northsideCafeFloor.add(new RoundTable({right:20,top:140,cafeId: cafeid, name:"table2"}))
		this.northsideCafeFloor.add(new RoundTable({right:130,top:150,cafeId: cafeid, name:"table3"}))
		
		this.northsideCafeFloor.add(new RecTable({right:240,top:70,cafeId: cafeid, name:"table4"}))
		this.northsideCafeFloor.add(new RecTable({right:240,top:140,cafeId: cafeid, name:"table5"}))
		this.data[cafeid].floor = this.northsideCafeFloor
		this.northsideCafe = new CafeScreen(this.data[cafeid]);
		
		//Yali's Cafe
		cafeid = "yaliscafe"
	
		this.yaliscafeFloor = new CafeFloor({cafeName: "Yali's Cafe"});
			
		this.yaliscafeFloor.add(new RoundTable({right:20,top:25,cafeId: cafeid, name:"table1"}))
		this.yaliscafeFloor.add(new RoundTable({right:80,top:140,cafeId: cafeid, name:"table2"}))
		this.yaliscafeFloor.add(new RoundTable({right:210,top:150,cafeId: cafeid, name:"table3"}))
		this.yaliscafeFloor.add(new RecTable({right:230,top:70,cafeId: cafeid, name:"table4"}))
		this.data[cafeid].floor = this.yaliscafeFloor
		this.yalisCafe = new CafeScreen(this.data[cafeid]);
		
		application.distribute("onModelChanged");
		//
	}},
	onLaunch: { value: function(application) {
		application.shared = true;
		var data = this.data = {
			"northsidecafe":{
				cafeId: "northsidecafe",
				openSeats: 0,
				reservedSeats: 0,
				occupiedSeats:0,
				
				totalSeats: 20,
				cafeName:"NORTHSIDE CAFE",
				chairs:{}
			},
			"yaliscafe":{
				cafeId: "yaliscafe",
				openSeats: 0,
				reservedSeats: 0,
				occupiedSeats:0,
				//reservationModel:{},
				totalSeats: 16,
				cafeName:"Yali's Cafe",
				chairs:{}
			},
			reservationModel:{},
		};
		var message = new MessageWithObject("pins:configure", {
			northside: {
				require: "northside_sensors",
				pins: {
					chairs: { pin: 62 }
				}
			},
			yaliscafe: {
				require: "yaliscafe_sensors",
				pins: {
					chairs: { pin: 62 }
				}
			},
		});
		message.setRequestHeader("referrer", "xkpr://" + application.id);
		application.invoke(message,Message.JSON);
		application.invoke(new MessageWithObject("pins:/northside/read?repeat=on&callback=/northside&interval=250"));
		application.invoke(new MessageWithObject("pins:/yaliscafe/read?repeat=on&callback=/northside&interval=250"));
	}},
	onQuit: function(application) {
		application.shared = false;
	}
});

var model = application.behavior = new ApplicationBehavior(application);