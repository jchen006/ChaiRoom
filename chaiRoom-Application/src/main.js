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
// ##assets##
var chairIcon = './assets/chair.png';
var searchIcon = './assets/search.png';
var mapImage = './assets/map.png'

// ##Styles##

var searchButtonTexture =  new Texture(searchIcon, 1);
var searchButtonSkin = new Skin({ texture: searchButtonTexture, width: 38, height: 40, states: 1, });

var applicationIconTexture = new Texture('assets/icon.png', 1) ;
var applicationIconSkin = new Skin({ texture: applicationIconTexture, width: 80, height: 80, aspect: 'fit', });
var tabTexture = new Texture('assets/tabs.png', 1) ;
var tabSkin = new CONTROL.Skin(tabTexture, THEME.tabDisabledEffect, THEME.tabEnabledEffect, THEME.tabSelectedEffect);

var headerSkin = new Skin({ fill: '#7C7C7C',});
var separatorSkin = new Skin({ fill: 'silver',});
var cafeInfoSkin = new Skin({ fill: '#30A8BE',});

var itemNameStyle = new Style({ color:'white', font: 'bold', horizontal: 'null', vertical: 'null', lines: 1, });
var buttonText = new Style({font: "20px Helvetica Neue bold", color:"#ffffff", horizontal: 'center', vertical: 'middle',});
var listText = new Style({font: "20px Helvetica Neue Light", color:"#ffffff",});
var cafeInfoTitleStyle = new Style({font: "25px Oswald DemiBold", color:"black", horizontal: 'center', vertical: 'middle',});
var cafeInfoTextStyle = new Style({font: "18px Helvetica Neue Light", color:"black", horizontal: 'center', vertical: 'middle',});
var cafeInfoLabelStyle = new Style({font: "20px Helvetica Neue bold", color:"#30A8BE", vertical: 'middle',});

var filterButtonStyle = new Style({  font: 'bold',color:'white' , horizontal: 'center', vertical: 'middle',});
var backgroundSkin = new Skin({ fill: '#30A8BE',});
var listSkin = new Skin({ fill: ['#30A8BE', '#acd473'], });
var nameInputSkin = new Skin({ fill:"white",borders: {color: 'black', left:2, right:2, top:2, bottom:2 }, stroke: '#30A8BE',});
var fieldStyle = new Style({ color: 'black', font: '20px', horizontal: 'left' });
var fieldHintStyle = new Style({ color: 'gray', font: '18px', horizontal: 'left', vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5, });

// ##Handlers##
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

	"cafestrada":{
		name: "Cafe Strada", 
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
}
var values = function(dic){ 
	return Object.keys(dic).map(function(key){
		return dic[key];
	})
};
var cafeList = {};// stores cafe list variables for easy access 
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
						title: "MapView",
					},
					]
				};
			},
		},
	}
	)
);

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
Handler.bind("/faild", Object.create(MODEL.DialogBehavior.prototype, {
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
                    action:"/back",
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
		if(json == null) return
		CafesData["northsidecafe"].totalSeats = json.totalSeats;
		CafesData["northsidecafe"].openSeats = json.openSeats;
		var userReservations = json.reservations;
		CafesData["northsidecafe"].reservations = userReservations["valid"];
		var notifyAboutCancelledReservations = function(cancelled){
			for (var i in cancelled){
				var c = cancelled[i];
				var msg = "?title=Reservation Status&msg=Your " + c.numberOfSeats + " seats reservation at " + c.cafeName + " got expired!" 
				handler.invoke(new Message("/faild" + msg))
			}
		}
		notifyAboutCancelledReservations(userReservations["cancelled"]);
		cafeList["northsidecafe"].openSeatsLabel.string = CafesData["northsidecafe"].openSeats;
		handler.invoke( new Message( "/delay?duration=700" ) );
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
		Line($, { left: 10, right: 2, height: 60, 
			contents: [
			Text($, { left: 0, right: 0, 
				blocks: [
				{ style: listText, string: $.name, },
				], }),
			this.openSeatsLabel = Label($,{right:20,style: listText, string :$.openSeats}),
			Picture($, {  right:20, top:5, url:chairIcon, }),
			], }),
		Line($, { left: 0, right: 0, height: 1, skin: separatorSkin, }),
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
			Container($, {  height: 40,left:10, skin: nameInputSkin, height: 36,active: true, behavior: 
				Object.create(CONTROL.ButtonBehavior.prototype, {
					onTap: { value: function(container) {
						trace("clicked")
					}},
				})
				, contents: [
				Label($, { width: 60,height: 34,skin: backgroundSkin, string: "Filter",style: buttonText}),
				], }),
			Container ($, { 
				name:"nameField",width: 220, height: 40,left:10, skin: nameInputSkin, contents: [
				Scroller($, { 
					left: 4, right: 4, top:0, bottom: 4, active: true,name:"scroller",
					behavior: Object.create(CONTROL.FieldScrollerBehavior.prototype), clip: true, contents: [
					Label($, { width: 60,height: 40,left: 40, top: 0, bottom: 0, skin: THEME.fieldLabelSkin, style: fieldStyle, 
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
						left:40, right:0, top:0, bottom:0, style:fieldHintStyle, string:"Search by cafe name..", name:"hint"
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
	Picture($,{left:0,right:0,top:0,bottom:0, url:mapImage,aspect:'fit'})
	]}})
// myChairs tab
var myChairsPane = SCREEN.EmptyBody.template(function($) { return {skin: backgroundSkin,left:0,right:0,top:0,bottom:0,contents: [
	Label($, { left:0,right:0,skin: backgroundSkin, string: "Under Construction!",style: buttonText}),
	]}})
//
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
					Container($, { width: 250, height: 40, skin: new Skin({fill:"#f5f3f3"}),active: true, 
						behavior: Object.create(CONTROL.ButtonBehavior.prototype, {
							onTap: { value: function(container) {
								trace("clicked")
							}},
						}), 
						contents: [
						Label($, { width: 250,height: 32,skin: backgroundSkin, string: "I'm leaving soon!",style: buttonText}),
						],
					}),
			Picture($,{left:0,right:0,top:0, url: $.map}),
			Label($,{left:5,right:0, style: cafeInfoTextStyle,string:$.address}),
			
			Line($,{left:0,right:0,top:5, 
				contents:[
				Picture($,{height:50,width:50,left:5, url: './assets/phone-blue.png'}),
				Label($,{left:10, style: cafeInfoTextStyle,string:$.phone}),
				],
			}),
			Line($, { top:5,width:300, height: 1, skin: cafeInfoSkin, }),
			
			Line($,{top:5,left:0,right:0,  
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
				Column($,{left:0,right:0, top:5,bottom:0, 
					contents:[
					Label($,{left:10, style: cafeInfoLabelStyle,string: "Open Seats: " + $.openSeats}),
					Label($,{left:10, style: cafeInfoLabelStyle,string: "Total Seats: " + $.totalSeats}),
					Label($,{left:10, style: cafeInfoLabelStyle,string: "Seats Available Soon: " + $.openSoonSeats}),
					]
				})
				]
			}),
			Line($,{left:0,right:0, top:0,bottom:0,top:5, 
				contents:[
				Container ($, { 
					name:"nameField",width: 150, height: 40,left:5, skin: nameInputSkin, 
					contents: [
					Scroller($, { 
						left: 4, right: 4, top: 4, bottom: 4, active: true,name:"scroller",
						behavior: Object.create(CONTROL.FieldScrollerBehavior.prototype), clip: true, contents: [
						this.field= Label($, { width: 60,height: 40,left: 0, top: 0, bottom: 0,  skin: THEME.fieldLabelSkin, style: fieldStyle, 
							editable: true,active: true, name:"fieldText",
							behavior: Object.create( CONTROL.FieldLabelBehavior.prototype, {
								onEdited: { value: function(label){
									this.data.numOfReservedSeats = label.string;
									label.container.hint.visible = ( this.data.numOfReservedSeats.length == 0 );	
								}},
								
							}),
						}),
						Label($, {
							left:4, right:4, top:4, bottom:4, style:fieldHintStyle, string:"Enter # of Seats", name:"hint"
						})
						]
					})
					]
				}),
				Container($, {  height: 36,left:15, width:140, skin: nameInputSkin, active: true, 
					behavior: Object.create(CONTROL.ButtonBehavior.prototype, {
						onTap: { value: function(container) {
							if(this.data.numOfReservedSeats.length== 0){
								var msg = "?msg= Number of reserved seats field is blank&title=Faild"
								container.invoke(new Message("/faild" + msg));
							}else if(isNaN(this.data.openSeats)){
								var msg = "?msg= Service can't reach the cafe at the moment...Try later&title=Faild"
								container.invoke(new Message("/faild" + msg));
							}else if( parseInt(this.data.numOfReservedSeats) > parseInt(this.data.openSeats)){
								var msg = "?msg= We only have " + this.data.openSeats + " open seats&title=Faild"
								container.invoke(new Message("/faild" + msg));
							}else{
								var msg = "?msg=Gotcha! Your " + this.data.numOfReservedSeats + " seats will be reserved for the next 20 minutes!&title=Success"
								container.invoke(new Message("/success" + msg));
								var params = "?user_id=" +user_id + "&numOfReservedSeats=" + this.data.numOfReservedSeats + "&cafeId="+ id(this.data.name) + "&cafeName=" + this.data.name.replace(/[_\s]/g, '%20');
								application.invoke(new Message(deviceURL +"reserve" + params), Message.JSON);
							}
						}},
					}),
					contents: [
					Label($, { width: 140,height: 36,skin: backgroundSkin, string: "Reserve",style: buttonText}),
					],
				})
				]
			}),
]
}),
]
}),
]
}),
Header($, { anchor: 'HEADER', }),
]
}});	

// Header
var Header = SCREEN.EmptyHeader.template(function($) { return { skin: headerSkin, 
	contents: [
	TOOL.BackButton($, { }),
	TOOL.HeaderTitle($, { style: THEME.plainHeaderTitleStyle, }),
	], }});

//main screen
var MainScreen = SCREEN.EmptyScreen.template(function($) { return { 
	contents: [
	$.tabs[$.selection].Pane($.tabs[$.selection], { anchor: 'BODY', }),
	SCREEN.TabFooter($, { anchor: 'FOOTER', }),
	$.tabs[$.selection].Header($.tabs[$.selection], { anchor: 'HEADER', }),
	]
}});


// model

model = application.behavior = new MODEL.ApplicationBehavior(application);