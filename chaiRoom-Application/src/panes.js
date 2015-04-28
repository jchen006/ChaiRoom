// map tab
var mapPane = SCREEN.EmptyBody.template(function($) { return {left:0,right:0,top:0,bottom:0,contents: [
	Picture($,{left:0,right:0,top:0,bottom:0, url:mapIcon,aspect:'fit'})
	]}})
// myChairs tab
var myChairsPane = SCREEN.EmptyBody.template(function($) { return {skin: backgroundSkin,left:0,right:0,top:0,bottom:0,contents: [
	Label($, { left:0,right:0,skin: backgroundSkin, string: "Under Construction!",style: buttonText}),
	]}})

// layouts
var Body = SCREEN.EmptyBody.template(function($) { 
	return { skin: backgroundSkin}});
var id = function(name){
	return name.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '').toLowerCase();
}

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

/* Main Screen Template*/
var MainScreen = SCREEN.EmptyScreen.template(function($) { return { 
	contents: [
	$.tabs[$.selection].Pane($.tabs[$.selection], { anchor: 'BODY', }),
	SCREEN.TabFooter($, {style: footerStyle, skin: footerSkin,anchor: 'FOOTER', }),
	$.tabs[$.selection].Header($.tabs[$.selection], { anchor: 'HEADER', }),
	]
}});

exports.mapPane = mapPane;
exports.myChairsPane = myChairsPane;
exports.HomePane = HomePane;
exports.MainScreen = MainScreen;