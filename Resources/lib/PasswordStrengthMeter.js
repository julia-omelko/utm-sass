function passwordMeter() {
     // settings
	var password_settings = {
		minLength: 6,
		maxLength: 25,
		specialLength: 0,
		upperLength: 1,
		numberLength: 1,
		barWidth: 200,
		barColorWarning: '#4a79b5',
		barColorError: '#ff8432',
		specialChars: '!@#\\$%*()_+^&}{:;?.', //allowable special characters
		metRequirement: false,
		metRequirementColor:'#a2bd75',
		useMultipleColors: true
	}; 
	
	var meterMessageBox = Ti.UI.createView({
        backgroundColor: 'white',
        height: 0
    });
    
    var valMessage = Ti.UI.createLabel({
    		font : {
			fontSize : '15dp',
			color: 'black'
		},height: 0,
		color:'black',
		left: 5,
		right: 5
    });
    meterMessageBox.add(valMessage);

	//Public Function to call and trigger PW Meter Check Display
    meterMessageBox.checkPW = function(passwordVal){

		password_settings.metRequirement = false;
		
		if (passwordVal.length > 0) {
			var msgNstrength = getStrengthInfo(passwordVal);
			var msgNstrength_array = msgNstrength.split(";"), strengthPercent = 0,
			barWidth = password_settings.barWidth, backColor = password_settings.barColorWarning;
	
			//calculate the bar indicator length
			if (msgNstrength_array.length > 1) {
				strengthPercent = (msgNstrength_array[1] / password_settings.minLength) * barWidth;
			}
			
			//use multiple colors
			if (password_settings.useMultipleColors) {
				//first 33% is red
					if (parseInt(strengthPercent) >= 0 && parseInt(strengthPercent) <= (barWidth * .33)) {
						meterMessageBox.backgroundColor = password_settings.barColorError;
					}
					//33% to 66% is blue
					else if (parseInt(strengthPercent) >= (barWidth * .33) && parseInt(strengthPercent) <= (barWidth * .67)) {
						meterMessageBox.backgroundColor = password_settings.barColorWarning;
					}
				else {
					meterMessageBox.backgroundColor = password_settings.barColorWarning;
				}
			}

			//remove last "," character
			if (msgNstrength_array[0].lastIndexOf(",") !== -1) {
				valMessage.text= msgNstrength_array[0].substring(0, msgNstrength_array[0].length - 2);
			}else {
				valMessage.text =msgNstrength_array[0];
			}
			
			if (strengthPercent == barWidth) {
				password_settings.metRequirement = true;
				meterMessageBox.backgroundColor =password_settings.metRequirementColor;
			}
			
		}else { //PW length = 0 empty
			valMessage.text ='';
			meterMessageBox.height =0;
			valMessage.height=0;
			meterMessageBox.backgroundColor = "#8bad53";
		} 
	}
    
    function getStrengthInfo(passwordVal){
		var len = passwordVal.length;
		var pStrength = 0; //password strength
		var msg = "", inValidChars = ""; 
		var allowableSpecilaChars = new RegExp("[" + password_settings.specialChars + "]", "g")
		var nums = countRegExp(passwordVal, /\d/g), //numbers
		lowers = countRegExp(passwordVal, /[a-z]/g),
		uppers = countRegExp(passwordVal, /[A-Z]/g), //upper case
		specials = countRegExp(passwordVal, allowableSpecilaChars), //special characters
		spaces = countRegExp(passwordVal, /\s/g);
		//check for invalid characters
		inValidChars = passwordVal.replace(/[a-z]/gi, "") + inValidChars.replace(/\d/g, "");
		inValidChars = inValidChars.replace(/\d/g, "");
		inValidChars = inValidChars.replace(allowableSpecilaChars, "");
		
		if(specials ==1)
		{
			utm.log('TEST');
		}
		
		//check space
		if (spaces > 0) {
			return "No spaces!";
		}
		//invalid characters
		if (inValidChars !== '') {
			return "Invalid character: " + inValidChars;
		}
		//max length
		if (len > password_settings.maxLength) {
			return "Password too long!";
		}
		//GET NUMBER OF CHARACTERS left
		if ((specials + uppers + nums + lowers) < password_settings.minLength) {
			msg += password_settings.minLength - (specials + uppers + nums + lowers) + " more characters, ";
		}
		//at the "at least" at the front
		if (specials == 0 || uppers == 0 || nums == 0 || lowers == 0) {
			msg += "At least ";
		}
		//GET NUMBERS
		if (nums >= password_settings.numberLength) {
			nums = password_settings.numberLength;
		}
		else {
			msg += (password_settings.numberLength - nums) + " more number, ";
		}
		//special characters
		if (specials >= password_settings.specialLength) {
			specials = password_settings.specialLength
		}
		else {
			msg += (password_settings.specialLength - specials) + " more symbol, ";
		}
		//upper case letter
		if (uppers >= password_settings.upperLength) {
			uppers = password_settings.upperLength
		}
		else {
			msg += (password_settings.upperLength - uppers) + " Upper case characters, ";
		}
		//strength for length
		if ((len - (uppers + specials + nums)) >= (password_settings.minLength - password_settings.numberLength - password_settings.specialLength - password_settings.upperLength)) {
			pStrength += (password_settings.minLength - password_settings.numberLength - password_settings.specialLength - password_settings.upperLength);
		}
		else {
			pStrength += (len - (uppers + specials + nums));
		}
		//password strength
		pStrength += uppers + specials + nums;
		//detect missing lower case character
		if (lowers === 0) {
			if (pStrength > 1) {
				pStrength -= 1; //Reduce 1
			}
			msg += "1 lower case character, ";
		}
		//strong password
		if (pStrength == password_settings.minLength && lowers > 0) {
			msg = "Strong password!";
		}
		
		if(msg.length ==0) {
			meterMessageBox.height =0;
			valMessage.height=0;
		} else {
			meterMessageBox.height='40dp';
			valMessage.height='40dp';
		}
		
		return msg + ';' + pStrength;
	}
	
	  function countRegExp(passwordVal, regx) {
		var match = passwordVal.match(regx);
		return match ? match.length : 0;
	} 
	
	return meterMessageBox;
} 
 module.exports=passwordMeter;