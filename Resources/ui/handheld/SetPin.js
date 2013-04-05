var SetPin_window = function(utm) {
	var keychain = require("com.0x82.key.chain");	
	var leftPadTextFld = (utm.SCREEN_WIDTH-200)/5;
	var currentPin = keychain.getPasswordForService('utm', 'lockscreen');
	
	var win = Titanium.UI.createWindow({
		layout : 'vertical',
		title : 'Set Unlock Code',
		backButtonTitle : L('button_back'),
		backgroundColor : utm.backgroundColor,
		barColor : utm.barColor,
	});
	
	var pinLabel = Ti.UI.createLabel({
		top:5,
		left:3,
		text : 'Enter Unlock Code used to unlock the screen',
		width:'100%',
		textAlign:'left',
		font : {
			fontSize : 14,
			fontWeight : 'bold'
		}		
	});
	
	win.add(pinLabel);
	
	var aBox = Ti.UI.createView({
		top:5,
		layout:'horizontal', 
	 	height:52,
		width:Titanium.UI.FILL		
	})
	win.add(aBox);
	

	
	//######### ROW ONE ######### 
	var v1 = Ti.UI.createTextField({
		width:50,
		passwordMask:true,
		color:utm.textFieldColor,		
		width:50,
		left:leftPadTextFld,
		height:50,
		keyboardType:Ti.UI.KEYBOARD_DECIMAL_PAD,
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		borderRadius :5,
		maxLength:1	,
		textAlign:'center'
	});
	aBox.add(v1);	
	var v2 = Ti.UI.createTextField({
		width:50,
		passwordMask:true,
		color:utm.textFieldColor,		
		width:50,
		left:leftPadTextFld,
		height:50,
		keyboardType:Ti.UI.KEYBOARD_DECIMAL_PAD,
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		borderRadius :5,
		maxLength:1,
		textAlign:'center'			
	});
	aBox.add(v2);
	var v3 = Ti.UI.createTextField({
		width:50,
		passwordMask:true,
		color:utm.textFieldColor,		
		width:50,
		left:leftPadTextFld,
		height:50,
		keyboardType:Ti.UI.KEYBOARD_DECIMAL_PAD,
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		borderRadius :5,
		maxLength:1,
		textAlign:'center'			
	});
	aBox.add(v3);	
	var v4 = Ti.UI.createTextField({
		width:50,
		passwordMask:true,
		color:utm.textFieldColor,		
		width:50,
		left:leftPadTextFld,
		height:50,
		keyboardType:Ti.UI.KEYBOARD_DECIMAL_PAD,
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		borderRadius :5,
		maxLength:1,
		textAlign:'center'			
	});
	aBox.add(v4);
	
	//######### ROW TWO ######### 
	var pinConfirmLabel = Ti.UI.createLabel({
		text : 'Confirm your Unlock Code',
		textAlign:'left',
		left:3,
		width:'100%',
		font : {
			fontSize : 14,
			fontWeight : 'bold'
		}		
	});	
	win.add(pinConfirmLabel);
		
	var bBox = Ti.UI.createView({
		top:5,
		layout:'horizontal', 
	 	height:52,
		width:Titanium.UI.FILL		
	})
	win.add(bBox);	

	var v5 = Ti.UI.createTextField({
		width:50,
		passwordMask:true,
		color:utm.textFieldColor,		
		width:50,
		left:leftPadTextFld,
		height:50,
		keyboardType:Ti.UI.KEYBOARD_DECIMAL_PAD,
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		borderRadius :5,
		maxLength:1	,
		textAlign:'center'
	});
	bBox.add(v5);	
	var v6 = Ti.UI.createTextField({
		width:50,
		passwordMask:true,
		color:utm.textFieldColor,		
		width:50,
		left:leftPadTextFld,
		height:50,
		keyboardType:Ti.UI.KEYBOARD_DECIMAL_PAD,
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		borderRadius :5,
		maxLength:1,
		textAlign:'center'			
	});
	bBox.add(v6);
	var v7 = Ti.UI.createTextField({
		width:50,
		passwordMask:true,
		color:utm.textFieldColor,		
		width:50,
		left:leftPadTextFld,
		height:50,
		keyboardType:Ti.UI.KEYBOARD_DECIMAL_PAD,
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		borderRadius :5,
		maxLength:1,
		textAlign:'center'			
	});
	bBox.add(v7);	
	var v8 = Ti.UI.createTextField({
		width:50,
		passwordMask:true,
		color:utm.textFieldColor,		
		width:50,
		left:leftPadTextFld,
		height:50,
		keyboardType:Ti.UI.KEYBOARD_DECIMAL_PAD,
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		borderRadius :5,
		maxLength:1,
		textAlign:'center'			
	});
	bBox.add(v8);
	
	v1.addEventListener('focus', function(){ 
		if(v1.getValue().length >0) v1.setValue(''); 
		v1.addEventListener('change',valChanged);
		checkToDisableSaveButton();
	});
	v2.addEventListener('focus', function(){
		 if(v2.getValue().length >0) v2.setValue(''); 
		 v2.addEventListener('change',valChanged);
		 checkToDisableSaveButton();
	});
	v3.addEventListener('focus', function(){
		 if(v3.getValue().length >0) v3.setValue(''); 
		 v3.addEventListener('change',valChanged);
		 checkToDisableSaveButton();
	});
	v4.addEventListener('focus', function(){
		if(v4.getValue().length >0)  v4.setValue(''); 
		 v4.addEventListener('change',valChanged);
		 checkToDisableSaveButton();
	});
	v5.addEventListener('focus', function(){
		 if(v5.getValue().length >0) v5.setValue(''); 
		 v5.addEventListener('change',valChanged);
		 checkToDisableSaveButton();
	});
	v6.addEventListener('focus', function(){
		 if(v6.getValue().length >0) v6.setValue(''); 
		 v6.addEventListener('change',valChanged);
		 checkToDisableSaveButton();
	});
	v7.addEventListener('focus', function(){
		 if(v7.getValue().length >0) v7.setValue(''); 
		 v7.addEventListener('change',valChanged);
		 checkToDisableSaveButton();
	});
	v8.addEventListener('focus', function(){
		 if(v8.getValue().length >0) v8.setValue(''); 
		 v8.addEventListener('change',valChanged);
		 checkToDisableSaveButton();
	});
	
	var saveButton = Ti.UI.createButton({
		title : L('ok_button'),
		width : 200,
		enabled : false
	});
	win.add(saveButton);

	var clearButton = Ti.UI.createButton({
		title : 'Clear',
	});

	clearButton.addEventListener('click', function(e) {
		keychain.deletePasswordForService('utm', 'lockscreen');
		currentPin=null;
	});
	
	if( currentPin != null)
	{
		win.setRightNavButton(clearButton);
	}
	
	saveButton.addEventListener('click', function() {
		var newPass = getPinNumberValue();
		//TODO look into can we HASH the PW?
		//newPass = Ti.Utils.sha256(newPass);
		
		keychain.setPasswordForService(newPass,'utm', 'lockscreen');
		//Confirm its set in the KeyChain
		var pass = keychain.getPasswordForService('utm', 'lockscreen');
		if(newPass !==pass){
			alert('PIN failed to save to your KeyChain');
			return;
		}	
		utm.navController.close(utm.setPinWindow)
	});
	
	function valChanged(src){		
		//Move the focus to the next fld and at end blur to close keypad
		//+remove event listener
		if(src.source === v1){
			v1.removeEventListener('change',valChanged);
			v2.focus();
		}else if(src.source === v2){
			v2.removeEventListener('change',valChanged);
			v3.focus();
		}else if(src.source === v3){
			v3.removeEventListener('change',valChanged);
			v4.focus();
		}else if(src.source === v4){
			v4.removeEventListener('change',valChanged);
			v5.focus();
		}else if(src.source === v5){
			v5.removeEventListener('change',valChanged);
			v6.focus();
		}else if(src.source === v6){
			v6.removeEventListener('change',valChanged);
			v7.focus();
		}else if(src.source === v7){
			v7.removeEventListener('change',valChanged);
			v8.focus();
		}else if(src.source === v8){
			v8.removeEventListener('change',valChanged);
			v8.blur();
			if(getPinNumberValue() !== getPinConfirmNumberValue()){
				pinConfirmLabel.text ='Confirm Unlock Code - do not match';
				pinConfirmLabel.color = utm.textErrorColor;
			}else{
				pinConfirmLabel.text ='Confirm your Unlock Code';
				pinConfirmLabel.color = utm.textColor;	
			}
		}
		
		checkToDisableSaveButton();
	}
	
	function checkToDisableSaveButton(){		
		var enableSave=true;	
		if( v1.getValue()==='' ) enableSave=false;
		if( v2.getValue()==='' ) enableSave=false;
		if( v3.getValue()==='' ) enableSave=false;
		if( v4.getValue()==='' ) enableSave=false;
		if( v5.getValue()==='' ) enableSave=false;
		if( v6.getValue()==='' ) enableSave=false;
		if( v7.getValue()==='' ) enableSave=false;
		if( v8.getValue()==='' ) enableSave=false;
		
		//Check that the PIN and PIN Confirm match
		if(enableSave){
			if(getPinNumberValue() !== getPinConfirmNumberValue()){
				enableSave=false;
			}
		}
		saveButton.enabled=enableSave;
	}
	

	function getPinNumberValue(){
		return v1.getValue() +''+v2.getValue()+''+v3.getValue()+''+v4.getValue();
	}
	function getPinConfirmNumberValue(){
		return v5.getValue() +''+v6.getValue()+''+v7.getValue()+''+v8.getValue();
	}
	
	win.addEventListener('focus', function(){ v1.focus(); })

	return win;

}
module.exports = SetPin_window;

