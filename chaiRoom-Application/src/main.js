// KPR Script file
var THEME = require('themes/sample/theme');
var SCREEN = require('mobile/screen');
var CONTROL = require('mobile/control');
var MODEL = require('mobile/model');
var SCROLLER = require('mobile/scroller');
var TOOL = require('mobile/tool');
var KEYBOARD = require('mobile/keyboard');
var DIALOG = require('mobile/dialog');

deviceURL = "";
user_id = "";
N = 12
//All Icon Images
var chairIcon = './assets/chair-blue.png';
var searchIcon = './assets/search.png';
var mapIcon = './assets/map.png'
var logo_h = 'assets/logo-h.png';
var logo_v = 'assets/logo-v.png';

//Search Button Styles
var searchButtonTexture =  new Texture(searchIcon, 1);
var searchButtonSkin = new Skin({ texture: searchButtonTexture, width: 38, height: 40, states: 1, });

//Application Related 
var applicationIconTexture = new Texture(logo_v, 1) ;
var applicationIconSkin = new Skin({ texture: applicationIconTexture, width: 80, height: 80, aspect: 'fit', });
var tabTexture = new Texture('assets/tabs.png', 1) ;
var tabSkin = new CONTROL.Skin(tabTexture, THEME.tabDisabledEffect, THEME.tabEnabledEffect, THEME.tabSelectedEffect);

//All skins
var headerSkin = new Skin({ fill: '#aeacac',});
var separatorSkin = new Skin({ fill: '#30A8BE',});
var cafeInfoSkin = new Skin({ fill: '#30A8BE',});
var footerSkin = new Skin({ fill: ['#30A8BE','white'],});
var footerStyle = new Style({font: "14px Helvetica Neue", color:"#ffffff", horizontal: 'center', vertical: 'middle',});

var headerText = new Style({font: "18px Helvetica Neue bold", color:"#ffffff", horizontal: 'center', vertical: 'middle',});
var buttonText = new Style({font: "22px Helvetica Neue bold", color:"#ffffff", horizontal: 'center', vertical: 'middle',});
var reserveButton = new Style({font: "25px Helvetica Neue bold", color:"#ffffff", horizontal: 'center', vertical: 'middle',});
var clockStyle = new Style({font: "25px Helvetica Neue bold", color:"#ffffff", horizontal: 'right', vertical: 'middle',});
var listText = new Style({font: "22px Helvetica Neue", color:"#30A8BE",});
var cafeInfoTextStyle = new Style({font: "20px Helvetica Neue", color:"black", horizontal: 'center', vertical: 'middle',});
var cafeInfoLabelStyle = new Style({font: "22px Helvetica Neue bold", color:"#30A8BE", vertical: 'middle',});

var filterButtonStyle = new Style({  font: 'bold',color:'white' , horizontal: 'center', vertical: 'middle',});
var alignRight = new Style({   horizontal: 'right', vertical: 'middle',});
var backgroundSkin = new Skin({ fill: 'white',});
var listSkin = new Skin({ fill: ['white', '#acd473'], });
var inputTextFieldSkin = new Skin({ fill:"#ffffff",borders: {color: 'black', left:2, right:2, top:2, bottom:2 }, stroke: '#30A8BE',});
var buttonSkin = new Skin({ fill:"#30A8BE",borders: {color: 'black', left:1, right:1, top:1, bottom:1 }, stroke: 'gray',});
var resTitleSkin = new Skin({ fill:"#30A8BE",borders: {color: 'black', left:2, right:2, top:2, bottom:2 }, stroke: 'black',});
var fieldStyle = new Style({ color: 'black', font: '20px Helvetica Neue', horizontal: 'left' });
var resTextStyle = new Style({ color: 'black', font: '22px Helvetica Neue', horizontal: 'center' });
var fieldHintStyle = new Style({ color: 'black', font: '18px Helvetica Neue', horizontal: 'left', vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5, });
// Reservations
ReservationData = []
var duplicateReservations = function(id){
	
	if(ReservationData.length == 0)return false
	for(var i in ReservationData){
		if(ReservationData[i].cafeId == id){
		return true
		}
		return false
	}
}
//Cafe Data 
CafesData =  {
	"northsidecafe":{
		name: "Northside Cafe", 
		address : "1878 Euclid Ave, Berkeley, CA 94709",
		hours: [
		"Mon-Fri 7:30 am - 7:00 pm",
		"Sat-Sun 9:00 am - 5:00 pm"],
		phone: "(510) 845-3663",
		totalSeats: "...",
		openSeats: "...",
		openSoonSeats: "...",
		map: "assets/northside.png",
		myChairs: 0,
	},
	"yaliscafe":{
		name: "Yali's Cafe", 
		address : "1920 Oxford St Berkeley, CA 94704",
		hours: [
		"Mon-Fri 7:00 am - 7:00 pm",
		"Sat-Sun 8:00 am - 5:00 pm"],
		phone: "(510) 843-2233",
		totalSeats: "...",
		openSeats: "...",
		openSoonSeats: "...",
		map: "assets/yali.png",
		myChairs: 0,
	},
	"caffestrada":{
		name: "Caffe Strada", 
		address : "2300 College Ave Berkeley, CA 94704",
		hours: [
		"Mon-Sun 6:00 am - 12:00 am"],
		phone: "(510) 843-5282",
		totalSeats: "...",
		openSeats: "...",
		openSoonSeats: "...",
		map: "assets/strada.png",
		myChairs: 0,
	},
	"cafebluedoor":{
		name: "Cafe Blue Door", 
		address : "2244 Bancroft WayBerkeley, CA 94704",
		hours: [
		"Mon-Thu 7:30 am - 10:00 pm",
		"Fri	 7:30 am - 9:00 pm",
		"Sat-Sun 9:00 am - 9:00 pm"],
		phone: "(510) 665-6000",
		totalSeats: "...",
		openSeats: "...",
		openSoonSeats: "...",
		map: "assets/bluedoor.png",
		myChairs: 0,
	},
	"cafemilano":{
		name: "Cafe Milano", 
		address : "2522 Bancroft Way Berkeley, CA 94704",
		hours: [
		"Mon-Thu 7:00 am - 12:00 am",
		"Fri	 7:00 am - 10:00 pm",
		"Sat-Sun 8:00 am - 10:00 pm"],
		phone: "(510) 644-3100",
		totalSeats: "...",
		openSeats: "...",
		openSoonSeats: "...",
		map: "assets/milano.png",
		myChairs: 0,
	},
	
}

var values = function(dic){ 
	return Object.keys(dic).map(function(key){
		return dic[key];
	})
};

//All Handlers
var cafeList = {};// stores cafe list variables for easy access 

/* Cafe Main page*/
Handler.bind("/main", 
	Object.create( MODEL.ScreenBehavior.prototype, {
		hasSelection: { value: 
			function(data, delta) {
				var tab = data.tabs[data.selection];
				var selection = tab.selection + delta;
				return (0 <= selection) && (selection < tab.items.length)
			},
		},
		getSelection: { value:
			function(data, delta) {
				var tab = data.tabs[data.selection];
				var selection = tab.selection + delta;
				return tab.items[selection];
			},
		},
		onDescribe: { value: 
			function(query, selection) {
				application.discover("chairoomSensors");
				return {
					Screen: MainScreen,
					selection: 0,
					skin: tabSkin,
					style: listText,
					tabs: [
					{
						Header: Header,
						Pane: HomePane,
						items: values(CafesData),
						more: false,
						scroll: {x: 0, y:0},
						selection: -1,
						variant: 2,
						title: "ChaiRoom",
					},
					{
						Header: Header,
						Pane: myChairsPane,
						items: null,
						more: false,
						scroll: {x: 0, y:0},
						selection: -1,
						variant: 1,
						title: "MyChairs",
					},
					{
						Header: Header,
						Pane: mapPane,
						items: null,
						more: false,
						scroll: {x: 0, y:0},
						selection: -1,
						variant: 0,
						title: "Map View",
					},
					]
				};
			},
		},
	}
	)
);

/* Cafe Information Page*/
Handler.bind("/cafe", Object.create(MODEL.ScreenBehavior.prototype, {
	hasSelection: { value: function(data, delta) {
		var selection = data.selection + delta;
		return (0 <= selection) && (selection < data.items.length)
	}},
	getSelection: { value: function(data, delta) {
		data.selection += delta;
		return data.items[data.selection];
	}},
	onDescribe: { value: function(query, selection) {
		return {
			Screen: CafeInfo,
			title: selection.name,
			name: selection.name, 
			address : selection.address,
			hours: selection.hours,
			phone: selection.phone,
			totalSeats: selection.totalSeats,
			openSeats: selection.openSeats,
			openSoonSeats: selection.openSoonSeats,
			map: selection.map,
		}
	}}
}));

Handler.bind("/reservation", Object.create(MODEL.ScreenBehavior.prototype, {
	onDescribe: { value: function(query) {
		return {
			Screen: ReservationScreen,
			title: query.title
		}
	}}
}));


Handler.bind("/failed", Object.create(MODEL.DialogBehavior.prototype, {
	onDescribe: { value: 
		function(query) {
			return {
				Dialog: DIALOG.Box,
				title: query.title,
				items: [
				{
					Item: DIALOG.Caption,
					string: query.msg
				},
				],
				ok: "OK",
			};
		},
	},
}));
Handler.bind("/success", Object.create(MODEL.DialogBehavior.prototype, {
	onDescribe: { value: 
		function(query) {
			return {
				Dialog: DIALOG.Box,
				title: query.title,
				action:"/home",
				items: [
				{
					Item: DIALOG.Caption,
					string: query.msg
				},
				],
				ok: "OK",
			};
		},
	},
}));



Handler.bind("/discover", Behavior({
	onInvoke: function(handler, message){
		deviceURL = JSON.parse(message.requestText).url;
		var guid= function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
		}
		user_id = guid(); 
		handler.invoke( new Message( "/data" ) );
		trace(deviceURL)
	}
}));

Handler.bind("/forget", Behavior({
	onInvoke: function(handler, message){
		deviceURL = "";
	}
}));


Handler.bind("/data", Behavior({
	onInvoke: function(handler, message){
		if (deviceURL != "") {
			handler.invoke(new Message(deviceURL + "data?user_id=" + user_id), Message.JSON);
		}
	},
	onComplete: function(handler,message,json){
		if(json == null) {return}
		CafesData["northsidecafe"].totalSeats = json.cafesData["northsidecafe"].totalSeats;
		CafesData["northsidecafe"].openSeats = json.cafesData["northsidecafe"].openSeats;
		
		CafesData["yaliscafe"].totalSeats = json.cafesData["yaliscafe"].totalSeats;
		CafesData["yaliscafe"].openSeats = json.cafesData["yaliscafe"].openSeats;
		
		CafesData["caffestrada"].totalSeats = json.cafesData["caffestrada"].totalSeats;
		CafesData["caffestrada"].openSeats = json.cafesData["caffestrada"].openSeats;
		
		CafesData["cafebluedoor"].totalSeats = json.cafesData["cafebluedoor"].totalSeats;
		CafesData["cafebluedoor"].openSeats = json.cafesData["cafebluedoor"].openSeats;
		
		CafesData["cafemilano"].totalSeats = json.cafesData["cafemilano"].totalSeats;
		CafesData["cafemilano"].openSeats = json.cafesData["cafemilano"].openSeats;
		
		var userReservations = json.reservations;
		if(LIST != null && (ReservationData.length != userReservations["valid"].length || userReservations["cancelled"].length > 0) ){
			trace("list ready")
			LIST.behavior.reload(LIST)
		}
		ReservationData = userReservations["valid"];
		
		var notifyAboutCancelledReservations = function(cancelled){
			for (var i in cancelled){
				var c = cancelled[i];
				var msg = "?title=Reservation Status&msg=Your " + c.numberOfSeats + " seats reservation at " + c.cafeName + " got expired! If you haven't arrived, you can make another reservation." 
				handler.invoke(new Message("/failed" + msg))
				if(LIST != null) LIST.behavior.reload(LIST)
			}
	}
	notifyAboutCancelledReservations(userReservations["cancelled"]);
	cafeList["northsidecafe"].openSeatsLabel.string = CafesData["northsidecafe"].openSeats;
	cafeList["yaliscafe"].openSeatsLabel.string = CafesData["yaliscafe"].openSeats;
	cafeList["caffestrada"].openSeatsLabel.string = CafesData["caffestrada"].openSeats;
	cafeList["cafebluedoor"].openSeatsLabel.string = CafesData["cafebluedoor"].openSeats;
	cafeList["cafemilano"].openSeatsLabel.string = CafesData["cafemilano"].openSeats;
	handler.invoke( new Message( "/delay?duration=300" ) );
}
}));
Handler.bind("/delay", Object.create(Behavior.prototype, {
	onInvoke: { value:
		function(handler, message) {
			var query = parseQuery( message.query );
			var duration = query.duration;
			handler.wait( duration )
		},
	},
	onComplete: { value: 
		function(handler, message) {
			handler.invoke( new Message( "/data" ) );
		},
	},
}));


// layouts
var Body = SCREEN.EmptyBody.template(function($) { 
	return { skin: backgroundSkin}});
var id = function(name){
	return name.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '').toLowerCase();
}
var CafeItemLine = Line.template(function($) { 
	return {  name: id($.name),left: 0, right: 0, active: true, skin: listSkin, 
		behavior: Object.create((SCREEN.ListItemBehavior).prototype), contents: [
		Column($, { left: 0, right: 0, contents: [
			Line($, { left: 10, right: 2, height: 62,
				contents: [
				Text($, { left: 0, right: 0, 
					blocks: [
					{ style: listText, string: $.name, },
					], }),
				this.openSeatsLabel = Label($,{right:20,style: listText, string :$.openSeats}),
				Picture($, { width:35,height:40, right:20, top:5, url:chairIcon, }),
				], }),
			Line($, { left: 10, right: 10, height: 1.5, skin: separatorSkin, }),
			], }),
		],
	}
});

var HomePane = Body.template(function($) { return { contents: [
	Column($,{left: 0, right: 0, top: 0,bottom:0,
		active: true, behavior: 
		Object.create(CONTROL.ButtonBehavior.prototype, {
			onTap: { value: function(container) {
				KEYBOARD.hide();
				container.focus();
			}},
		}),
		contents:[
		Line($, {left: 0, right: 0, top: 0,skin: headerSkin,height: 50,
			contents:[
			Container($, {  height: 40,left:10, skin: inputTextFieldSkin, height: 36,active: true, behavior:
				Object.create(CONTROL.ButtonBehavior.prototype, {
					onTap: { value: function(container) {
						trace("clicked")
					}},
				})
				, contents: [
				Label($, { width: 65,height: 40,skin: buttonSkin, string: "Filter",style: buttonText}),
				], }),
			Container ($, { 
				name:"nameField",width: 220, height: 42,left:10, skin: inputTextFieldSkin, contents: [
				Scroller($, { 
					left: 4, right: 4, top:0, bottom: 4, active: true,name:"scroller",
					behavior: Object.create(CONTROL.FieldScrollerBehavior.prototype), clip: true, contents: [
					Label($, { width: 65,height: 40,left: 40, top: 0, bottom: 0, skin: THEME.fieldLabelSkin, style: fieldStyle,  
						editable: true, name:"fieldText",
						behavior: Object.create( CONTROL.FieldLabelBehavior.prototype, {
							onEdited: { value: function(label){
								var data = this.data;
								data.name = label.string;
								label.container.hint.visible = ( data.name.length == 0 );	
							}},
							
						}),
					}),
					Label($, {
						left:40, right:0, top:0, bottom:0, style: fieldHintStyle, string:"Search by cafe name..", name:"hint"
					})
					]
				})
				,
				Container($, { left: 5, top: 4, active: true, behavior: 
					Object.create(CONTROL.ButtonBehavior.prototype, {
						onTap: { value: function(button) {
							trace("search")
							KEYBOARD.hide();
							button.container.focus();
						}},
					}), 
					contents: [
					Content($, { skin: searchButtonSkin, }),
					], 
				})
				]
			}),
]
}),
SCROLLER.VerticalScroller($, { contents: [
	Column($, { left: 0, right: 0, top: 0, anchor: 'LIST', behavior: Object.create((HomePane.behaviors[0]).prototype), }),
	SCROLLER.VerticalScrollbar($, { }),
	], }),
]}),
], }});

HomePane.behaviors = new Array(1);
HomePane.behaviors[0] = SCREEN.ListBehavior.template({
	addItemLine: function(list, item) {
		item.action = "/cafe"
		var i = new CafeItemLine(item)
		list.add(i);
		var name = id(item.name)
		cafeList[name] = i;
		
	}
})
// map tab
var mapPane = SCREEN.EmptyBody.template(function($) { return {left:0,right:0,top:0,bottom:0,contents: [
	Picture($,{left:0,right:0,top:0,bottom:0, url:mapIcon,aspect:'fit'})
	]}})
// myChairs tab
var getLeftMinutes = function(reservationTime){	

	var now = new Date();
	var time  = new Date(reservationTime)
	trace(time + "Xxxx"+  reservationTime)
	var diff = parseInt(now.getTime()) - parseInt(time.getTime());
	var minutes = Math.round(parseInt(diff)/60000);
	trace(minutes)
	return String(minutes)
}
var ReservationItemLine = Line.template(function($) { 
	return {  name: id($.name),left: 0, right: 0, active: true, 
		behavior: Object.create((SCREEN.ListItemBehavior).prototype), 
		contents: [
		Column($, { top:5,left: 0, right: 0, contents: [
			Line($, { top:5,left: 0, right: 0, height: 62,skin: resTitleSkin,
				contents: [
					Label($,{left:5,style: reserveButton, string :$.cafeName}),
					Container($, { right:0,left:0 ,style: clockStyle,
						contents: [
							Picture($,{right:70,height:30,width:30,  url: './assets/clock-white.png',aspect:'fit'}),
							Label($,{right:10,style: clockStyle, string : new Date().getHours() + ":" +  new Date().getMinutes()}),
							]})
				], }),
			Line($, { top:5,left: 0, right: 0, 
				contents: [
				Picture($,{height:50,width:50,left:5, url: './assets/chair-button.png',aspect: 'fit', active: true, behavior: 
					Object.create(CONTROL.ButtonBehavior.prototype, {
						onTap: { value: function(container) {
							trace("show me my chairs")
							var params = "?user_id=" +user_id +"&nameOfReservation="+ ($.name).replace(/[_\s]/g, '%20') + "&cafeId="+ $.cafeId + "&n=" + N ;
							application.invoke(new Message(deviceURL +"locateSeats" + params), Message.JSON);
							
						}},
					}),}),
				Column($, { top:5,left: 20, right: 0, contents: [
					
					Line($, { top:5,left: 0, right: 0, 
						contents: [
						Picture($,{left:0,height:40,width:40, url: './assets/note.png',aspect:'fit'}),
						Label($,{left:20,style: resTextStyle, string : $.name}),
						], }),
					Line($, { top:5,left: 0, right: 0,
						contents: [
						Picture($,{left:0,height:40,width:40, url: './assets/chair-blue.png',aspect:'fit'}),
						Label($,{left:20,style: resTextStyle, string : $.numberOfSeats + " Reserved"}),
						], }),
					Line($, { top:5,left: 0, right: 0,
						contents: [
						Picture($,{left:0,height:40,width:40, url: './assets/clock-blue.png',aspect:'fit'}),
						Label($,{left:20,style: resTextStyle, string: $.remainTime +" Minutes left" }),
						], }),
					
					]}),
				]}),
Container($, {  height: 50, width:280,top:10, skin: inputTextFieldSkin, active: true, 
	behavior: Object.create(CONTROL.ButtonBehavior.prototype, {
		onTap: { value: function(container) {
			trace("cancel")
			var msg = "?msg= Your reservation has been cancelled &title=Success"
			container.invoke(new Message("/success" + msg));
			var params = "?user_id=" +user_id +"&nameOfReservation="+ ($.name).replace(/[_\s]/g, '%20') + "&cafeId="+ $.cafeId ;
			application.invoke(new Message(deviceURL +"cancel" + params), Message.JSON);
			var list = $.list
			list.behavior.reload(list)
			
		}},
	}),
	contents: [
	Label($, { width: 280,height: 50,skin: cafeInfoSkin, string: "Cancel Reservation",style: buttonText}),
	],
}),
Line($, { top:5,left: 10, right: 10, height: 1.5, skin: separatorSkin, }),
], }),
],
}
});

var myChairsPane = Body.template(function($) {
	return {skin: backgroundSkin,left:0,right:0,top:40,bottom:50,
		contents: [
		SCROLLER.VerticalScroller($, { contents: [
			this.list = Column($, { left: 0, right: 0, top: 0, anchor: 'LIST', behavior: Object.create((myChairsPane.behaviors[0]).prototype), }),
			SCROLLER.VerticalScrollbar($, { }),
			], }),
		]}})
LIST = null
myChairsPane.behaviors = new Array(1);
myChairsPane.behaviors[0] = SCREEN.ListBehavior.template({
	addItemLine: function(list, item) {
		trace("addItemLine")
		item.list = list
		list.add(new ReservationItemLine(item));
		
	},
	addEmptyLine: function(list) {
		list.add(new Label({top:20,string: "No Reservations", style: listText}));
	},
	createMessage: function(list, data) {
		return new Message(deviceURL +"myReservations" + "?user_id=" +user_id);
	},
	getItems: function(list, message, json) {
		return ReservationData;
	},
	load: function(list, more) {
		LIST = list
		SCREEN.ListBehavior.prototype.load.call( this, list, more );
		list.adjust();						
	}
})

/* Cafe Info Template*/
var CafeInfo = SCREEN.EmptyScreen.template(function($) { 
	return { 
		active:true,
		behavior: Object.create(Behavior.prototype, {
			onCreate: { value: function(container, data) {
				this.data = data;
			}}
		}),
		contents: [
		SCREEN.EmptyBody($, { skin: new Skin({fill:"#f5f3f3"}), anchor: 'BODY', 
			contents: [
			Scroller($, { 
				contents: [
				Column($,{left:0,right:0, top:0,bottom:0, 
					active: true, behavior: Object.create(CONTROL.ButtonBehavior.prototype, {
						onTap: { value: function(container) {
							KEYBOARD.hide();
							container.focus();
						}},
					}),
					contents:[
					
					Picture($,{left:0,right:0,top:0, url: $.map}),
					Label($,{left:5,right:0, style: cafeInfoTextStyle,string:$.address}),
					
					Line($,{left:0,right:0,top:10, 
						contents:[
						Picture($,{height:50,width:50,left:5, url: './assets/phone-blue.png'}),
						Label($,{left:10, style: cafeInfoTextStyle,string:$.phone}),
						],
					}),
					Line($, { top:5,width:300, height: 1, skin: cafeInfoSkin, }),
					
					Line($,{top:5,left:0,right:0,top:5,  
						contents:[
						Picture($,{height:50,width:50,left:5, url: './assets/clock-blue.png',aspect:'fit'}),
						Column($,{left:0,right:0, top:5,bottom:0, 
							contents:[
							Label($,{left:10, style: cafeInfoTextStyle,string:$.hours[0]}),
							Label($,{left:10, style: cafeInfoTextStyle,string:$.hours[1]}),
							],
						})
						],
					}),
					Line($, { top:5,width:300, height: 1, skin: cafeInfoSkin, }),
					
					Line($,{top:5,left:0,right:0,  
						contents:[
						Picture($,{height:50,width:50,left:5, url: './assets/chair-blue.png',aspect:'fit'}),
						Column($,{left:0,right:0, 
							contents:[
							Label($,{left:10,top:5, style: cafeInfoLabelStyle,string: "Open Seats: " + CafesData[id($.title)].openSeats}),
							Label($,{left:10,top:5, style: cafeInfoLabelStyle,string: "Total Seats: " + CafesData[id($.title)].totalSeats}),
							Label($,{left:10,top:5, style: cafeInfoLabelStyle,string: "Seats Available Soon: " + CafesData[id($.title)].openSoonSeats}),
							]
						})
						]
					}),
					Container($, {  height: 40, width:280,top:10, skin: inputTextFieldSkin, active: true, 
						behavior: Object.create(CONTROL.ButtonBehavior.prototype, {
							onTap: { value: function(container) {
								application.invoke( new Message( "/reservation?title=" + $.title) );
							}},
						}),
						contents: [
						Label($, { width: 280,height: 40,skin: cafeInfoSkin, string: "Reserve",style: buttonText}),
						],
					})
					]
				}),
]
}),
]
}),
Header($, { anchor: 'HEADER', }),
]
}});

/* Reservation Template*/
var ReservationScreen = SCREEN.EmptyScreen.template(function($) { 
	return { 
		active:true,
		behavior: Object.create(Behavior.prototype, {
			onCreate: { value: function(container, data) {
				this.data = data;
			}}
		}),
		contents: [
		SCREEN.EmptyBody($, { skin: new Skin({fill:"#ffffff"}), anchor: 'BODY', 
			
			contents: [
			Scroller($, { 
				contents: [
				Column($,{left:0,right:0, top:0,bottom:0, 
					active: true, behavior: Object.create(CONTROL.ButtonBehavior.prototype, {
						onTap: { value: function(container) {
							KEYBOARD.hide();
							container.focus();
						}},
					}),
					contents:[
					Line($, {left:0,right:0,top:25,  
							contents:[
							Picture($,{height:60,width:60,left:5, url: './assets/chair-blue.png',aspect:'fit'}),
							Container ($, { 
								name:"nameField",width: 220, height: 50,left:5, skin: inputTextFieldSkin, 
								contents: [
								Scroller($, { 
									left: 4, right: 4, top: 4, bottom: 4, active: true,name:"scroller",
									behavior: Object.create(CONTROL.FieldScrollerBehavior.prototype), clip: true, contents: [
									this.field= Label($, { width: 60,height: 40,left: 0, top: 0, bottom: 0,  skin: THEME.fieldLabelSkin, style: fieldStyle, 
										editable: true,active: true, name:"numOfReservedSeats",
										behavior: Object.create( CONTROL.FieldLabelBehavior.prototype, {
											onEdited: { value: function(label){
												this.data.numOfReservedSeats = label.string;
												label.container.hint.visible = ( this.data.numOfReservedSeats.length == 0 );	
											}},
											
										}),
									}),
									Label($, {
										left:4, right:4, top:4, bottom:4, style:fieldHintStyle, string:"How many chairs...", name:"hint"
									})
									]
								})
								]
							})],
							}),
						new Separator(),
						Line($, {left:0,right:0,top:20,  
							contents:[
							Picture($,{height:60,width:60,left:5, url: './assets/note.png',aspect:'fit'}),
							Container ($, { 
								name:"nameField",width: 220, height: 50,left:5, skin: inputTextFieldSkin, 
								contents: [
								Scroller($, { 
									left: 4, right: 4, top: 4, bottom: 4, active: true,name:"scroller",
									behavior: Object.create(CONTROL.FieldScrollerBehavior.prototype), clip: true, contents: [
									this.field= Label($, { width: 60,height: 40,left: 0, top: 0, bottom: 0,  skin: THEME.fieldLabelSkin, style: fieldStyle, 
										editable: true,active: true, name:"nameOfReservation",
										behavior: Object.create( CONTROL.FieldLabelBehavior.prototype, {
											onEdited: { value: function(label){
												this.data.nameOfReservation = label.string;
												label.container.hint.visible = ( this.data.nameOfReservation.length == 0 );	
											}},
										}),
									}),
									Label($, {
										left:4, right:4, top:4, bottom:4, style:fieldHintStyle, string:"Name your reservation...", name:"hint"
									})
									]
								})
								]
							})
							],
						}),
new Separator(),
Container($, {  height: 50, width:280,top:40, skin: inputTextFieldSkin, active: true, 
	behavior: Object.create(CONTROL.ButtonBehavior.prototype, {
		onTap: { value: function(container) {
			
			if(this.data.numOfReservedSeats.length== 0){
				var msg = "?msg= Number of reserved seats field is blank&title=Failed"
				container.invoke(new Message("/failed" + msg));
			}else if(isNaN(this.data.numOfReservedSeats)){
				var msg = "?msg=" + this.data.numOfReservedSeats + " is NOT a number&title=Failed"
				container.invoke(new Message("/failed" + msg));
			}else if(isNaN(CafesData[id($.title)].openSeats)){
				var msg = "?msg= Service can't reach the cafe at the moment...Try later&title=Failed"
				container.invoke(new Message("/failed" + msg));
			}else if( parseInt(this.data.numOfReservedSeats) > parseInt(CafesData[id($.title)].openSeats)){
				var msg = "?msg= We only have " + CafesData[id($.title)].openSeats + " open seats&title=Failed"
				container.invoke(new Message("/failed" + msg));
			}else if(this.data.nameOfReservation.length== 0){
				var msg = "?msg= Name of reservation field is blank&title=Failed"
				container.invoke(new Message("/failed" + msg));
			}else if(duplicateReservations(id($.title))){
				var msg = "?msg= You already have made a reservation for this cafe &title=Failed"
				container.invoke(new Message("/failed" + msg));
			}else{
				var msg = "?msg=Gotcha! Your " + this.data.numOfReservedSeats + " seats will be reserved for the next 20 minutes!&title=Success"
				container.invoke(new Message("/success" + msg));
				var params = "?user_id=" +user_id + "&numOfReservedSeats=" + this.data.numOfReservedSeats +
										"&nameOfReservation="+ this.data.nameOfReservation+ "&cafeId="+ id(CafesData[id($.title)].name) +
								 "&cafeName=" + CafesData[id($.title)].name.replace(/[_\s]/g, '%20');
				application.invoke(new Message(deviceURL +"reserve" + params), Message.JSON);
			}
			
		}},
	}),
contents: [
Label($, { width: 280,height: 50,skin: cafeInfoSkin, string: "Reserve",style: reserveButton}),
],
})
]
}),]
}),]
}),
Header($, { anchor: 'HEADER', }),
]
}});
var getKeys = function(obj){
	var keys = [];
	for(var key in obj){
		keys.push(key);
	}
	return keys;
}		
var Separator = Line.template(function($) { 
	return { top:20,width:300, height: 1, skin: cafeInfoSkin, }})
var reservation_line = Line.template(function($) { 
	return {left:0,right:0,top:20,  
		contents:[
		Picture($,{height:60,width:60,left:5, url: $.url,aspect:'fit'}),
		Container ($, { 
			name:"nameField",width: 220, height: 50,left:5, skin: inputTextFieldSkin, 
			contents: [
			Scroller($, { 
				left: 4, right: 4, top: 4, bottom: 4, active: true,name:"scroller",
				behavior: Object.create(CONTROL.FieldScrollerBehavior.prototype), clip: true, contents: [
				this.field= Label($, { width: 60,height: 40,left: 0, top: 0, bottom: 0,  skin: THEME.fieldLabelSkin, style: fieldStyle, 
					editable: true,active: true, name:$.name,
					behavior: Object.create( CONTROL.FieldLabelBehavior.prototype, {
						onEdited: { value: function(label){
							var name = label.name
							
							this.data[name] = label.string;
							trace(this.data[name])
							label.container.hint.visible = ( this.data[name].length == 0 );	
						}},
						
					}),
				}),
				Label($, {
					left:4, right:4, top:4, bottom:4, style:fieldHintStyle, string:$.hint, name:"hint"
				})
				]
			})
			]
		})
		
		],
	}});


/* Header Template*/
var Header = SCREEN.EmptyHeader.template(function($) { return { skin: headerSkin, 
	contents: [
	TOOL.BackButton($, { }),
	TOOL.HeaderTitle($, { style: THEME.plainHeaderTitleStyle, }),
	], }});

/* Main Screen Template*/
var MainScreen = SCREEN.EmptyScreen.template(function($) { return { 
	contents: [
	$.tabs[$.selection].Pane($.tabs[$.selection], { anchor: 'BODY', }),
	SCREEN.TabFooter($, {style: footerStyle, skin: footerSkin,anchor: 'FOOTER', }),
	$.tabs[$.selection].Header($.tabs[$.selection], { style: buttonText, anchor: 'HEADER', }),
	]
}});


/* Application Model*/
model = application.behavior = new MODEL.ApplicationBehavior(application);