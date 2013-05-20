function inputField(utm,_label, _labelWidth,  _val, _valWidth, _keyboardType,_returnKeyType,_required,_fldType){

	var hView = Ti.UI.createView({
		height:'50dp'
		});
	
	if(_required){
		var req = Ti.UI.createLabel({
			text: '*'	
			,top:'12dp'
			,left:'2dp'	
			,font:{fontFamily:'Arial',fontWeight:'bold',fontSize:'14dp'}
			,width:'5dp'
		});
		hView.add(req);		
	}
	
	var lbl = Ti.UI.createLabel({
		text: _label	
		,top:16
		,left:8	
		,font:{fontWeight:'bold',fontSize:'14dp'}
		,width:_labelWidth
	});
	hView.add(lbl);
	
	var fld = Ti.UI.createTextField({
		left:_labelWidth+8,
		color:utm.textFieldColor,	
		passwordMask:_fldType === 'password'?true:false,	
		width:_valWidth,
		height:'40dp',
     	autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
		autocorrect: false,
		keyboardType: _keyboardType ?_keyboardType: Ti.UI.KEYBOARD_DEFAULT,
		returnKeyType:_returnKeyType ? _returnKeyType:Ti.UI.KEYBOARD_DEFAULT,
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		borderRadius :5
	});
	hView.add(fld);
	
	var fldMessageLabel = Ti.UI.createLabel({
		height:0
		, top:55
		, left:_labelWidth+8
		, color:utm.textErrorColor 
		, visible:false
		,font:{fontWeight:'bold',fontSize:'12dp'}
	});
	hView.add(fldMessageLabel);
	
	
	hView.setValue = function(val){
		fld.value=val;
	}
	hView.getValue = function(val){
		return fld.value;
	}
	
	hView.setMessage=function(val){
		if(val!=''){
			hView.height=70;
			fldMessageLabel.height=15;
			fldMessageLabel.visible=true;
			fldMessageLabel.text=val;
		//	fld.borderColor ='#EF8181';
		}else{
			hView.height=50;
			fldMessageLabel.height=0;
			fldMessageLabel.visible=false;
			fldMessageLabel.text='';
		//	fld.borderColor ='transparent';
		}
	}
	
	if(_keyboardType === Ti.UI.KEYBOARD_EMAIL){
		fld.addEventListener('blur', function(e){
		    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;   
		 	
		 	if(fld.value.length===0){
		 			hView.setMessage('');
		 		return;
		 	}
		 	
		   if(reg.test(fld.value) == true) {	
		      //  fld.borderColor ='transparent';
		      	hView.setMessage('');
		    } else {
		       // fld.borderColor ='#EF8181';
		         hView.setMessage('Invalid Email Address Format');

		    }		
		});
	}
	
	hView.addEventListenerEvent = function(eventType,callBack){
		fld.addEventListener(eventType,callBack);
	}
	
	return hView;
}
module.exports = inputField;