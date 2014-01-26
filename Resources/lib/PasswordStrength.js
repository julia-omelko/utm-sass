function passwordMeter() {
	var meterMessageBox = {};
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


	//Public Function to call and trigger PW Meter Check Display
    meterMessageBox.checkPW = function(passwordVal){
		return getStrengthInfo(passwordVal);
	};
    
    function getStrengthInfo(passwordVal){
		var len = passwordVal.length;
		var pStrength = 0; //password strength
		var msg = "", inValidChars = ""; 
		var aMsg = [];
		var allowableSpecilaChars = new RegExp("[" + password_settings.specialChars + "]", "g");
		var nums = countRegExp(passwordVal, /\d/g), //numbers
		lowers = countRegExp(passwordVal, /[a-z]/g),
		uppers = countRegExp(passwordVal, /[A-Z]/g), //upper case
		specials = countRegExp(passwordVal, allowableSpecilaChars), //special characters
		spaces = countRegExp(passwordVal, /\s/g);
		//check for invalid characters
		inValidChars = passwordVal.replace(/[a-z]/gi, "") + inValidChars.replace(/\d/g, "");
		inValidChars = inValidChars.replace(/\d/g, "");
		inValidChars = inValidChars.replace(allowableSpecilaChars, "");
		
		//check space
		if (spaces > 0) {
			aMsg.push('no spaces');
			//return "No spaces!";
		}
		//invalid characters
		if (inValidChars !== '') {
			aMsg.push('invalid characters: ' + inValidChars);
			//return "Invalid character: " + inValidChars;
		}
		//max length
		if (len > password_settings.maxLength) {
			aMsg.push('password is too long');
			//return "Password too long!";
		}
		//GET NUMBER OF CHARACTERS left
		if ((specials + uppers + nums + lowers) < password_settings.minLength) {
			aMsg.push(password_settings.minLength - (specials + uppers + nums + lowers) + ' more characters');
			//msg += password_settings.minLength - (specials + uppers + nums + lowers) + " more characters, ";
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
			aMsg.push('at least ' + (password_settings.numberLength - nums) + ' more number');
			//msg += (password_settings.numberLength - nums) + " more number, ";
		}
		//special characters
		if (specials >= password_settings.specialLength) {
			specials = password_settings.specialLength
		}
		else {
			aMsg.push('at least ' + (password_settings.specialLength - specials) + ' more symbol');
			//msg += (password_settings.specialLength - specials) + " more symbol, ";
		}
		//upper case letter
		if (uppers >= password_settings.upperLength) {
			uppers = password_settings.upperLength
		}
		else {
			aMsg.push('at least ' + (password_settings.upperLength - uppers) + ' more upper case character');
			//msg += (password_settings.upperLength - uppers) + " Upper case characters, ";
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
			aMsg.push('at least 1 lower case character');
			//msg += "1 lower case character, ";
		}
		//strong password
		//if (pStrength == password_settings.minLength && lowers > 0) {
		//	msg = "";
		//}
		
		if (aMsg.length === 0) {
			return '';
		} else {
			return 'Password requirements: ' + aMsg.join(', ');
		}
	}
	
	  function countRegExp(passwordVal, regx) {
		var match = passwordVal.match(regx);
		return match ? match.length : 0;
	} 
	
	return meterMessageBox;
} 
 module.exports=passwordMeter;