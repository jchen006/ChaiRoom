// KPR Script file
var THEME = require('themes/sample/theme');
var SCREEN = require('mobile/screen');
var CONTROL = require('mobile/control');
var MODEL = require('mobile/model');
var SCROLLER = require('mobile/scroller');
var TOOL = require('mobile/tool');

//Applications
var applicationIconTexture = new Texture('assets/icon.png', 1) ;
var applicationIconSkin = new Skin({ texture: applicationIconTexture, width: 80, height: 80, aspect: 'fit', });

//Tabs
var tabTexture = (screenScale == 2) ? new Texture('assets/tabs.png', 1) : (screenScale == 1.5) ? new Texture('assets/tabs.png', 1) : new Texture('assets/tabs.png', 1);
var tabSkin = new CONTROL.Skin(tabTexture, THEME.tabDisabledEffect, THEME.tabEnabledEffect, THEME.tabSelectedEffect);

//Skins
var blackSkin = new Skin({ fill: '#30A8BE',});
var whiteSkin = new Skin({ fill: '#30A8BE',});

var Body = SCREEN.EmptyBody.template(function($) { return { skin: blackSkin, }});
Handler.bind("/main", Object.create(MODEL.ScreenBehavior.prototype, {
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
				tabs: [
					{ 
					Header: Header,
					Pane: HomePane,
					items: null,
					more: false,
					scroll: {x: 0, y:0},
					selection: -1,
					variant: 2,
					title: "Home",
					},
					{
					Header: Header,
					Pane: myChairsPane,
					items: null,
					more: false,
					scroll: {x: 0, y:0},
					selection: -1,
					variant: 1,
					title: "myChairs",
					},
					{
					Header: Header,
					Pane: MapPane,
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
}));

var Header = SCREEN.EmptyHeader.template(function($) { return { skin: blackSkin, contents: [
	TOOL.BackButton($, { }),
	TOOL.HeaderTitle($, { style: THEME.plainHeaderTitleStyle, }),
], }});

var MainScreen = SCREEN.EmptyScreen.template(function($) { return { contents: [
	$.tabs[$.selection].Pane($.tabs[$.selection], { anchor: 'BODY', }),
	SCREEN.TabFooter($, { anchor: 'FOOTER', }),
	$.tabs[$.selection].Header($.tabs[$.selection], { anchor: 'HEADER', }),
], }});

var HomePane = Body.template(function($) { 
	trace("Home Pane");
	return { contents: [
	SCROLLER.VerticalScroller($, { contents: [
		Column($, { left: 0, right: 0, top: 0, anchor: 'LIST' }),
		SCROLLER.VerticalScrollbar($, { }),
	], }),
], }});

var myChairsPane = Body.template(function($) { 
	trace("myChairs Pane");
	return { contents: [
	SCROLLER.VerticalScroller($, { contents: [
		Column($, { left: 0, right: 0, top: 0, anchor: 'LIST' }),
		SCROLLER.VerticalScrollbar($, { }),
	], }),
], }});

var MapPane = Body.template(function($) { 
	trace("Map Pane");
	return { contents: [
	SCROLLER.VerticalScroller($, { contents: [
		Column($, { left: 0, right: 0, top: 0, anchor: 'LIST' }),
		SCROLLER.VerticalScrollbar($, { }),
	], }),
], }});


var HomeScreen = SCREEN.EmptyScreen.template(function($) { return { contents: [
	Body($, { anchor: 'BODY', contents: [
		Media($, { left: 0, right: 0, top: 0, bottom: 0,  url: $.url, }),
	], }),
	Header($, { anchor: 'HEADER', }),
], }});

//Handlers
Handler.bind("/home", Object.create(MODEL.ScreenBehavior.prototype, {
	onDescribe: { value: 
//@line 191
		function(query, selection) {
			return {
					Screen: PhotoScreen,
					scroll: {x: 0, y:0},
					selection: -1,
					title: selection.title,
					url: selection.url
				};
		},
	},
}));

Handler.bind("/myChairs", Object.create(MODEL.ScreenBehavior.prototype, {
	onDescribe: { value: 
		function(query, selection) {
			return {
					Screen: VideoScreen,
					scroll: {x: 0, y:0},
					selection: -1,
					title: selection.title,
					url: selection.url
				};
		},
	},
}));

Handler.bind("/map_view", Object.create(MODEL.ScreenBehavior.prototype, {
	onDescribe: { value: 
		function(query, selection) {
			return {
					Screen: VideoScreen,
					scroll: {x: 0, y:0},
					selection: -1,
					title: selection.title,
					url: selection.url
				};
		},
	},
}));

application.behavior = new MODEL.ApplicationBehavior(application);