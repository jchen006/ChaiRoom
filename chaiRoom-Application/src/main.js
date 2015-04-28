// KPR Script file
var THEME = require('themes/sample/theme');
var SCREEN = require('mobile/screen');
var CONTROL = require('mobile/control');
var MODEL = require('mobile/model');
var SCROLLER = require('mobile/scroller');
var TOOL = require('mobile/tool');
var KEYBOARD = require('mobile/keyboard');
var DIALOG = require('mobile/dialog');

//Expots
var cafe_info_screen = require('./cafe_info_screen')
var CAFEDATA = require('./cafe_data')

deviceURL = "";
user_id = "";

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
var footerSkin = new Skin({ fill: ['#30A8BE','white'],});
var footerStyle = new Style({font: "14px Helvetica bold", color:"#ffffff", horizontal: 'center', vertical: 'middle',});

var itemNameStyle = new Style({ color:'white', font: 'bold', horizontal: 'null', vertical: 'null', lines: 1, });
var buttonText = new Style({font: "21px Helvetica bold", color:"#ffffff", horizontal: 'center', vertical: 'middle',});
var listText = new Style({font: "22px Helvetica Neue bold", color:"#30A8BE",});

var filterButtonStyle = new Style({  font: 'bold',color:'white' , horizontal: 'center', vertical: 'middle',});
var backgroundSkin = new Skin({ fill: 'white',});
var listSkin = new Skin({ fill: ['white', '#acd473'], });
var inputTextFieldSkin = new Skin({ fill:"#edecec",borders: {color: 'black', left:0, right:0, top:0, bottom:0 }, stroke: '#30A8BE',});
var fieldStyle = new Style({ color: 'black', font: '20px', horizontal: 'left' });
var fieldHintStyle = new Style({ color: 'black', font: '18px', horizontal: 'left', vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5, });



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
						items: values(CAFEDATA.CafesData),
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
			Screen: cafe_info_screen.CafeInfo,
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
		CAFEDATA.CafesData["northsidecafe"].totalSeats = json.totalSeats;
		CAFEDATA.CafesData["northsidecafe"].openSeats = json.openSeats;
		var userReservations = json.reservations;
		CAFEDATA.CafesData["northsidecafe"].reservations = userReservations["valid"];
		var notifyAboutCancelledReservations = function(cancelled){
			for (var i in cancelled){
				var c = cancelled[i];
				var msg = "?title=Reservation Status&msg=Your " + c.numberOfSeats + " seats reservation at " + c.cafeName + " got expired! If you haven't arrived, you can make another reservation." 
				handler.invoke(new Message("/failed" + msg))
			}
		}
		notifyAboutCancelledReservations(userReservations["cancelled"]);
		cafeList["northsidecafe"].openSeatsLabel.string = CAFEDATA.CafesData["northsidecafe"].openSeats;
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
				Label($, { width: 65,height: 36,skin: new Skin({ fill: '#30A8BE',}), string: "Filter",style: buttonText}),
				], }),
			Container ($, { 
				name:"nameField",width: 220, height: 40,left:10, skin: inputTextFieldSkin, contents: [
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
var myChairsPane = SCREEN.EmptyBody.template(function($) { return {skin: backgroundSkin,left:0,right:0,top:0,bottom:0,contents: [
	Label($, { left:0,right:0,skin: backgroundSkin, string: "Under Construction!",style: buttonText}),
	]}})
	


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
	$.tabs[$.selection].Header($.tabs[$.selection], { anchor: 'HEADER', }),
	]
}});


/* Application Model*/
model = application.behavior = new MODEL.ApplicationBehavior(application);