// KPR Script file
var THEME = require('themes/sample/theme');
var SCREEN = require('mobile/screen');
var CONTROL = require('mobile/control');
var MODEL = require('mobile/model');
var SCROLLER = require('mobile/scroller');
var TOOL = require('mobile/tool');

var applicationIconTexture = new Texture('assets/icon.png', 1) ;
var applicationIconSkin = new Skin({ texture: applicationIconTexture, width: 80, height: 80, aspect: 'fit', });
var tabTexture = (screenScale == 2) ? new Texture('assets/tabs.png', 1) : (screenScale == 1.5) ? new Texture('assets/tabs.png', 1) : new Texture('assets/tabs.png', 1);
var tabSkin = new CONTROL.Skin(tabTexture, THEME.tabDisabledEffect, THEME.tabEnabledEffect, THEME.tabSelectedEffect);
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
								title: "Photos",
							},
							{
								Header: Header,
								Pane: HomePane,
								items: null,
								more: false,
								scroll: {x: 0, y:0},
								selection: -1,
								variant: 1,
								title: "Videos",
							},
							{
								Header: Header,
								Pane: HomePane,
								items: null,
								more: false,
								scroll: {x: 0, y:0},
								selection: -1,
								variant: 0,
								title: "Songs",
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

var HomePane = Body.template(function($) { return { contents: [
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

application.behavior = new MODEL.ApplicationBehavior(application);