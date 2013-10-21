function checkBox(_isChecked){
	var isChecked=false;
	var self = Ti.UI.createView({
        backgroundColor:'white', 
        width:utm.Android?'30dp':'22dp',
        height:utm.Android?'30dp':'22dp'
    });
 
    var check_box = Ti.UI.createView({
        backgroundImage:'/images/checkbox.png',
        width:utm.Android?'30dp':'22dp',
        height:utm.Android?'30dp':'22dp'
    });
 	self.add(check_box);
    self.addEventListener('click',function(){
 		isChecked= !isChecked;
      	toggleCheck();
    });
    
    function toggleCheck(){
    		if(isChecked){
    			check_box.setBackgroundImage('/images/checkbox-checked.png');
    		}else{
    			check_box.setBackgroundImage('/images/checkbox.png');
    		}
    }
 
 	self.setChecked=function(_isChecked){
 		isChecked=_isChecked;
 		toggleCheck();
 	};
 	
 	self.isChecked=function(){
 		return isChecked;
 	};
	
	if(_isChecked){
		self.setChecked(true);
	}
	
	
    return self;
 }
 module.exports=checkBox;;