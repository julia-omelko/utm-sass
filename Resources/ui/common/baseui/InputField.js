function inputField(_label, _labelWidth,  _val, _valWidth, _keyboardType,_returnKeyType){

	var hView = Ti.UI.createView({
		layout:'horizontal'
		,width:'100%'
		,top:3
		,left:3
		,bottom:3
		,height:50
		});

	var lbl = Ti.UI.createLabel({
		text: _label		
		,font:{fontFamily:'Arial',fontWeight:'bold',fontSize:14}
		,width:_labelWidth
	});
	
	var fld = Ti.UI.createTextField({

		color:utm.textFieldColor,		
		width:_valWidth,
		height:40,
     	autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
		autocorrect: false,
		keyboardType: _keyboardType ?_keyboardType:'',
		returnKeyType:_returnKeyType ? _returnKeyType:'',
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		borderRadius :5
	});
	
	hView.add(lbl);
	hView.add(fld);
	
	hView.setValue = function(val){
		fld.value=val;
	}
	hView.getValue = function(val){
		return fld.value;
	}
	
	if(_keyboardType === Ti.UI.KEYBOARD_EMAIL){
		fld.addEventListener('change', function(e){
		    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;    

		 	
		   if(reg.test(fld.value) == true) {	
		        fld.borderColor ='transparent';
		    } else {
		        fld.borderColor ='#EF8181';
		    }		
		});
	}
	
	
	return hView;
}
module.exports = inputField;