
var CheckButton = function(_name){
	var name = _name;
	var isChecked=false;
	var isEnabled=true;
		
	var checkButton = Ti.UI.createButton({		
			height:'48dp', width:'30dp', left:5,right:5,
			backgroundImage:'/images/'+name+'.png',		
			backgroundDisabledImage:'/images/'+name+'_disabled.png'	
		});		
		
		checkButton.addEventListener('click',function(e) {
		  if(checkButton.backgroundImage== '/images/'+name+'.png') {
		  	isChecked=true;
		    checkButton.backgroundImage = '/images/'+name+'_selected.png';
		  } else {
		  	isChecked=false;
		    checkButton.backgroundImage = '/images/'+name+'.png';
		  }
		});
	
	checkButton.setEnabled = function(_enable){
		isEnabled=_enable;
		checkButton.enabled=_enable;
		if(_enable){
			checkButton.backgroundImage = '/images/'+name+'.png';
		}else{
			checkButton.backgroundImage = '/images/'+name+'disabled.png';
		};
	};
	
	checkButton.setChecked= function(_checked){
		//if(! isEnabled) return; //do nothing
		isChecked=_checked;
		if(!_checked){
			checkButton.backgroundImage = '/images/'+name+'.png';
		}else{
			checkButton.backgroundImage = '/images/'+name+'_selected.png';
		};
	};
	
	checkButton.isEnabled = function(){
		return isEnabled;
	};
	checkButton.isChecked = function(){
		return isChecked;
	};
		
	return checkButton;
};
module.exports = CheckButton;