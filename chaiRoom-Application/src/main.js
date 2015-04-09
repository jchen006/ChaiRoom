// KPR Script file
var THEME = require('themes/sample/theme');
var SCREEN = require('mobile/screen');
var CONTROL = require('mobile/control');
var MODEL = require('mobile/model');
var SCROLLER = require('mobile/scroller');
var TOOL = require('mobile/tool');
var KEYBOARD = require('mobile/keyboard');

deviceURL = "";
// ##assets##
var chairIcon = './assets/chair.png';
var searchIcon = './assets/search.png';

// ##Styles##

var searchButtonTexture =  new Texture(searchIcon, 1);
var searchButtonSkin = new Skin({ texture: searchButtonTexture, width: 38, height: 40, states: 1, });

var applicationIconTexture = new Texture('assets/icon.png', 1) ;
var applicationIconSkin = new Skin({ texture: applicationIconTexture, width: 80, height: 80, aspect: 'fit', });
var tabTexture = new Texture('assets/tabs.png', 1) ;
var tabSkin = new CONTROL.Skin(tabTexture, THEME.tabDisabledEffect, THEME.tabEnabledEffect, THEME.tabSelectedEffect);

var headerSkin = new Skin({ fill: '#7C7C7C',});
var separatorSkin = new Skin({ fill: 'silver',});
var itemNameStyle = new Style({ color:'white', font: 'bold', horizontal: 'null', vertical: 'null', lines: 1, });
var buttonText = new Style({font: "20px Helvetica Neue bold", color:"#ffffff", horizontal: 'center', vertical: 'middle',});
var listText = new Style({font: "20px Helvetica Neue Light", color:"#ffffff",});

var filterButtonStyle = new Style({  font: 'bold',color:'white' , horizontal: 'center', vertical: 'middle',});
var backgroundSkin = new Skin({ fill: '#30A8BE',});
var listSkin = new Skin({ fill: ['#30A8BE', '#acd473'], });
var nameInputSkin = new Skin({ fill:"white",borders: {color: 'black', left:2, right:2, top:2, bottom:2 }, stroke: 'gray',});
var fieldStyle = new Style({ color: 'black', font: '20px', horizontal: 'left' });
var fieldHintStyle = new Style({ color: 'gray', font: '18px', horizontal: 'left', vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5, });

// ##Handlers##
Items =  [
{
	name: "Northside Cafe", 
	address : "1878 Euclid Ave, Berkeley, CA 94709",
	hours: [
	"Mon-Fri 7:30 am - 7:00 pm",
	"Sat-Sun 9:00 am - 5:00 pm"],
	phone: "(510) 845-3663",
	totalSeats: 30,
	openSeats: 0,
	map: "assets/northside.png",
	myChairs: 0,
},

{
	name: "Cafe Blue Door", 
	address : "2244 Bancroft WayBerkeley, CA 94704",
	hours: [
	"Mon-Thu 7:30 am - 10:00 pm",
	"Fri	 7:30 am - 9:00 pm",
	"Sat-Sun 9:00 am - 9:00 pm"],
	phone: "(510) 665-6000",
	totalSeats: 30,
	openSeats: 1,
	map: "assets/bluedoor.png",
	myChairs: 0,
},

{
	name: "Cafe Strada", 
	address : "2300 College Ave Berkeley, CA 94704",
	hours: [
	"Mon-Sun 6:00 am - 12:00 am"],
	phone: "(510) 843-5282",
	totalSeats: 30,
	openSeats: 9,
	map: "assets/strada.png",
	myChairs: 0,
},

{
	name: "Cafe Milano", 
	address : "2522 Bancroft Way Berkeley, CA 94704",
	hours: [
	"Mon-Thu 7:00 am - 12:00 am",
	"Fri	 7:00 am - 10:00 pm",
	"Sat-Sun 8:00 am - 10:00 pm"],
	phone: "(510) 644-3100",
	totalSeats: 30,
	openSeats: 4,
	map: "assets/milano.png",
	myChairs: 0,
},
{
	name: "Yali's Cafe", 
	address : "1920 Oxford St Berkeley, CA 94704",
	hours: [
	"Mon-Fri 7:00 am - 7:00 pm",
	"Sat-Sun 8:00 am - 5:00 pm"],
	phone: "(510) 843-2233",
	totalSeats: 30,
	openSeats: 8,
	map: "assets/yali.png",
	myChairs: 0,
},

]
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
				return {
					Screen: MainScreen,
					selection: 0,
					skin: tabSkin,
					style: listText,
					tabs: [
					{
						Header: Header,
						Pane: HomePane,
						items:Items,
						more: false,
						scroll: {x: 0, y:0},
						selection: -1,
						variant: 2,
						title: "ChaiRoom",
					},
					{
						Header: Header,
						Pane: HomePane,
						items: null,
						more: false,
						scroll: {x: 0, y:0},
						selection: -1,
						variant: 1,
						title: "MyChairs",
					},
					{
						Header: Header,
						Pane: HomePane,
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
Handler.bind("/discover", Behavior({
	onInvoke: function(handler, message){
		deviceURL = JSON.parse(message.requestText).url;
		handler.invoke( new Message( "/data" ) );
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
			handler.invoke(new Message(deviceURL + "data"), Message.JSON);
		}
	},
	onComplete: function(handler,message,json){
		
		application.distribute("onDataChange");
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

var CafeItemLine = Line.template(function($) { 
	return { left: 0, right: 0, active: true, skin: listSkin, 
		behavior: Object.create((CafeItemLine.behaviors[0]).prototype), contents: [
		Column($, { left: 0, right: 0, contents: [
			Line($, { left: 10, right: 2, height: 60, 
				contents: [
				Text($, { left: 0, right: 0, 
					blocks: [
					{ style: listText, string: $.name, },
					], }),
				Label($,{right:20,style: listText, string :$.openSeats}),
				Picture($, {  right:20, top:5, url:chairIcon, }),
				], }),
			Line($, { left: 0, right: 0, height: 1, skin: separatorSkin, }),
			], }),
		],
	}
});
CafeItemLine.behaviors = new Array(1);
CafeItemLine.behaviors[0] = SCREEN.ListItemBehavior.template({
	onTouchEnded: function(line, id, x, y, ticks) {
		this.onTouchCancelled(line, id, x, y, ticks);
		trace("touched")
	}
})

var HomePane = Body.template(function($) { return { contents: [
	Column($,{left: 0, right: 0, top: 0,bottom:0,
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
						left:40, right:0, top:0, bottom:0, style:fieldHintStyle, string:"Search by cafe name...", name:"hint"
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
Container($, {left: 0, right: 0, top: 0,bottom:0, contents: [
	Column($, { left: 0, right: 0, top: 0, anchor: 'LIST', behavior: Object.create((HomePane.behaviors[0]).prototype), }),

	], }),
	//SCROLLER.VerticalScroller($, { contents: [
		//Column($, { left: 0, right: 0, top: 20, anchor: 'LIST', behavior: Object.create((HomePane.behaviors[0]).prototype), }),
		//SCROLLER.VerticalScrollbar($, { }),
		//SCROLLER.TopScrollerShadow($, { }),
		//SCROLLER.BottomScrollerShadow($, { }),
	//], }),

]}),
], }});
HomePane.behaviors = new Array(1);
HomePane.behaviors[0] = SCREEN.ListBehavior.template({
	addItemLine: function(list, item) {
		list.add(new CafeItemLine(item));
	}
})
var Header = SCREEN.EmptyHeader.template(function($) { return { skin: headerSkin, 
	contents: [
	TOOL.BackButton($, { }),
	TOOL.HeaderTitle($, { style: THEME.plainHeaderTitleStyle, }),
	
	], }});

var MainScreen = SCREEN.EmptyScreen.template(function($) { return { 
	contents: [
	$.tabs[$.selection].Pane($.tabs[$.selection], { anchor: 'BODY', }),
	
	SCREEN.TabFooter($, { anchor: 'FOOTER', }),
	$.tabs[$.selection].Header($.tabs[$.selection], { anchor: 'HEADER', }),
	], }});


// model
model = application.behavior = new MODEL.ApplicationBehavior(application);