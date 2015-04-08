// KPR Script file
var THEME = require('themes/sample/theme');
var SCREEN = require('mobile/screen');
var CONTROL = require('mobile/control');
var MODEL = require('mobile/model');
var SCROLLER = require('mobile/scroller');
var TOOL = require('mobile/tool');

var applicationIconTexture = new Texture('assets/icon.png', 1) ;
var applicationIconSkin = new Skin({ texture: applicationIconTexture, width: 80, height: 80, aspect: 'fit', });
var blackSkin = new Skin({ fill: '#7C7C7C',});

var whiteSkin = new Skin({ fill: '#30A8BE',});



Handler.bind("/main", Object.create(MODEL.ScreenBehavior.prototype, {
	hasSelection: { value: function(data, delta) {
				var selection = data.selection + delta;
				return (0 <= selection) && (selection < data.items.length)
			}},
			getSelection: { value: function(data, delta) {
				data.selection += delta;
				return data.items[data.selection];
			}},
			onDescribe: { value: function(query, selection) {
				var title = "ChaiRoom";
				return {
					Screen: MainScreen,
					title: title,
					items: null,
					more: false,
					path: model.root,
					scroll: {
						x: 0,
						y: 0
					},
					selection: -1,
				}
			}}
}));

var Header = SCREEN.EmptyHeader.template(function($) { return { skin: blackSkin, contents: [
	TOOL.BackButton($, { }),
	TOOL.HeaderTitle($, { style: THEME.plainHeaderTitleStyle, }),
], }});
var MainScreen = SCREEN.EmptyScreen.template(function($) { return { contents: [
	SCREEN.EmptyBody($, { skin: whiteSkin, anchor: 'BODY', contents: [
		SCROLLER.VerticalScroller($, { contents: [
			Column($, { left: 0, right: 0, top: 0, anchor: 'LIST', }),
			SCROLLER.VerticalScrollbar($, { }),
			SCROLLER.TopScrollerShadow($, { }),
			SCROLLER.BottomScrollerShadow($, { }),
		], }),
	], }),
	Header($, { anchor: 'HEADER', }),
], }});

var model = application.behavior = new MODEL.ApplicationBehavior(application);