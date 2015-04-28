var cafeInfoSkin = new Skin({ fill: '#30A8BE',});
var cafeInfoTitleStyle = new Style({font: "25px Oswald DemiBold", color:"black", horizontal: 'center', vertical: 'middle',});
var cafeInfoTextStyle = new Style({font: "18px Helvetica Neue Light", color:"black", horizontal: 'center', vertical: 'middle',});
var cafeInfoLabelStyle = new Style({font: "20px Helvetica Neue bold", color:"#30A8BE", vertical: 'middle',});

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
					Container($, { width: 200, height: 36, skin: new Skin({fill:"#f5f3f3"}),active: true, 
						behavior: Object.create(CONTROL.ButtonBehavior.prototype, {
							onTap: { value: function(container) {
								trace("clicked")
							}},
						}), 
						contents: [
						Label($, { width: 200,height: 36,skin: cafeInfoSkin, string: "I'm leaving soon!",style: buttonText}),
						],
					}),
			Picture($,{left:0,right:0,top:3, url: $.map}),
			Label($,{left:5,right:0, style: cafeInfoTextStyle,string:$.address}),
			
			Line($,{left:0,right:0,top:3, 
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
					name:"nameField",width: 150, height: 40,left:5, skin: inputTextFieldSkin, 
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
				Container($, {  height: 36,left:15, width:140, skin: inputTextFieldSkin, active: true, 
					behavior: Object.create(CONTROL.ButtonBehavior.prototype, {
						onTap: { value: function(container) {
							if(this.data.numOfReservedSeats.length== 0){
								var msg = "?msg= Number of reserved seats field is blank&title=failed"
								container.invoke(new Message("/failed" + msg));
							}else if(isNaN(this.data.numOfReservedSeats)){
								var msg = "?msg=" + this.data.numOfReservedSeats + " is NOT a number&title=Failed"
								container.invoke(new Message("/failed" + msg));
							}else if(isNaN(this.data.openSeats)){
								var msg = "?msg= Service can't reach the cafe at the moment...Try later&title=Failed"
								container.invoke(new Message("/failed" + msg));
							}else if( parseInt(this.data.numOfReservedSeats) > parseInt(this.data.openSeats)){
								var msg = "?msg= We only have " + this.data.openSeats + " open seats&title=Failed"
								container.invoke(new Message("/failed" + msg));
							}else{
								var msg = "?msg=Gotcha! Your " + this.data.numOfReservedSeats + " seats will be reserved for the next 20 minutes!&title=Success"
								container.invoke(new Message("/success" + msg));
								var params = "?user_id=" +user_id + "&numOfReservedSeats=" + this.data.numOfReservedSeats + "&cafeId="+ id(this.data.name) + "&cafeName=" + this.data.name.replace(/[_\s]/g, '%20');
								application.invoke(new Message(deviceURL +"reserve" + params), Message.JSON);
							}
						}},
					}),
					contents: [
					Label($, { width: 140,height: 36,skin: cafeInfoSkin, string: "Reserve",style: buttonText}),
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

exports.CafeInfo = CafeInfo