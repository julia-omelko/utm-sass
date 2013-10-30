
exports.getPasswordForService = function(_app,_name) {		
	return Ti.App.Properties.getString(_name,null);
};


exports.deletePasswordForService = function(_app,_name) {		
	Ti.App.Properties.setString(_name,null);
	return null;
};

exports.setPasswordForService = function(_pass,_app,_name) {
	Ti.App.Properties.setString(_name,_pass);
	return null;
};
