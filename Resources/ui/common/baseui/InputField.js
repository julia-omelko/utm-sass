function inputField(utm,_label, _labelWidth,  _val, _valWidth, _keyboardType,_returnKeyType,_required,_fldType,_maxLenth){

	var mainView = Ti.UI.createView({
		layout:'vertical',
		height:'50dp',
		left:5	
	});
	
	var hView = Ti.UI.createView({
		height:'50dp',
		layout:'horizontal'
	});
	mainView.add(hView);
	
	var req = Ti.UI.createLabel({
		text: _required ? '*' :' '	
		,top:'12dp'	
		,font:{fontFamily:'Arial',fontWeight:'bold',fontSize:'14dp'}
		,width:'5dp'
	});
	hView.add(req);		
	
	
	var lbl = Ti.UI.createLabel({
		text: _label	
		,top:16
		,left:2	
		,font:{fontWeight:'bold',fontSize:'14dp'}
		,width:_labelWidth
		,color : '#000'
	});
	hView.add(lbl);
	
	var fld = Ti.UI.createTextField({
		color:utm.textFieldColor,	
		passwordMask:_fldType === 'password'?true:false,	
		width:_valWidth,
		height:'40dp',
     	autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
		autocorrect: false,
		keyboardType: _keyboardType ?_keyboardType: Ti.UI.KEYBOARD_DEFAULT,
		returnKeyType:_returnKeyType ? _returnKeyType:Ti.UI.KEYBOARD_DEFAULT,
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		borderRadius :5,
		_hasFocus: false,
		maxLength:_maxLenth
	});
	
	fld.addEventListener('focus', function() {
		fld._hasFocus = true;
	})
	
	fld.addEventListener('blur', function() {
		fld._hasFocus = false;
	});
	
	hView.add(fld);
	
	var messageView = Ti.UI.createView({
		height:'0dp',
		layout:'horizontal',
		width:'100%',
		right:'10dp'
		
	});
	mainView.add(messageView);
	
	var fldMessageLabel = Ti.UI.createLabel({
		height:0
		, width:'100%'
		, left:lbl.x + lbl.width
		, color:utm.textErrorColor 
		, visible:false
		,textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT
		,font:{fontWeight:'bold',fontSize:'12dp'}
	});
	messageView.add(fldMessageLabel);
	
	
	mainView.setValue = function(val){
		fld.value=val;
	}
	mainView.getValue = function(val){
		return fld.value;
	}
	
	mainView.setMessage=function(val){
		if(val!=''){
			mainView.height='70dp';
			fldMessageLabel.height='15dp';
			fldMessageLabel.visible=true;
			fldMessageLabel.text=val;
		//	fld.borderColor ='#EF8181';
		}else{
			mainView.height='50dp';
			fldMessageLabel.height='0dp';
			fldMessageLabel.visible=false;
			fldMessageLabel.text='';
		//	fld.borderColor ='transparent';
		}
		messageView.height=fldMessageLabel.height;
	}
	
	if(_keyboardType === Ti.UI.KEYBOARD_EMAIL){
		fld.addEventListener('blur', function(e){
		    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;   
		 	
		 	if(fld.value.length===0){
		 			mainView.setMessage('');
		 		return;
		 	}
		 	
		   if(reg.test(fld.value) == true) {	
		      //  fld.borderColor ='transparent';
		      	mainView.setMessage('');
		    } else {
		       // fld.borderColor ='#EF8181';
		         mainView.setMessage('Invalid Email Address Format');

		    }		
		});
	}
	
	mainView.addEventListenerEvent = function(eventType,callBack){
		fld.addEventListener(eventType,callBack);
	}
	
	return mainView;
}
module.exports = inputField;