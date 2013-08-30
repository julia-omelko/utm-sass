function checkBox(_isChecked){
	var isChecked=false;
	var self = Ti.UI.createView({
        backgroundColor:'white', 
        width:utm.Android?33:22,
        height:utm.Android?33:22
    });
 
    var check_box = Ti.UI.createView({
        backgroundImage:'/images/checkbox.png',
        width:utm.Android?33:22,
        height:utm.Android?33:22
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
 	}
 	self.isChecked=function(){
 		return isChecked;
 	}
	
	if(_isChecked){
		self.setChecked(true);
	}
	
	
    return self;
 }
 module.exports=checkBox;;