var PrimaryGroupDetailWin = function(_tabGroup) {
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Account Settings', true);

	var backButton = Ti.UI.createLabel({
		text: 'Back',
		font: {fontFamily: utm.fontFamily},
		color: 'white'
	});
	backButton.addEventListener('click',function(e){
		self.close();
	});
	self.setLeftNavButton(backButton);
	

	
	
	
	
	
	
	var Facebook = require('facebook');
	var social = require("lib/social");
	var twitter = social.create({
		site: 'Twitter', // <-- this example is for Twitter. I'll expand this to other sites in the future.
		consumerKey: utm.twitterConsumerKey, // <--- you'll want to replace this
		consumerSecret: utm.twitterConsumerSecret, // <--- and this with your own keys!
		utmSpace: utm
	});
	Facebook.appid = utm.facebookAppId;
	Facebook.permissions = ['publish_stream', 'read_stream'];
	
	
	
	
	
	
	var settingsView = Ti.UI.createScrollView ({
		height: utm.viewableArea - 60,
		top: 0,
		showVerticalScrollIndicator:true,
		contentHeight:'auto',
		layout: 'vertical'
	});
	self.add(settingsView);
	
	var focused = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: 2,
		backgroundColor: utm.barColor,
		bottom: 0
	});
	
	
	
	var emailLabel = Ti.UI.createLabel({
		text: 'Email',
		font: {fontFamily: utm.fontFamily, fontSize: 18},
		color: utm.barColor,
		wordWrap: false,
		ellipsize: true,
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE,
		left: 25,
		top: 25
	});
	settingsView.add(emailLabel);
	
	var emailField = Ti.UI.createTextField({
		value: '',
		color: utm.textFieldColor,		
		width: (Ti.Platform.displayCaps.platformWidth-50),
		height: 30,
		left: 25,
		autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
		autocorrect: false,
		keyboardType: Ti.UI.KEYBOARD_DEFAULT,
		returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
		top: 5,
		borderColor: '#D4D4D4',
		borderRadius: 2,
		borderWidth: 1,
		backgroundColor: 'white',
		paddingLeft: 7,
		font: {fontFamily: utm.fontFamily, fontSize: 16}
	});
	emailField.addEventListener('focus', function() {
		emailField.add(focused);
	});
	emailField.addEventListener('blur', function() { 
		emailField.remove(focused);
	});
	settingsView.add(emailField);
	
	var mobileLabel = Ti.UI.createLabel({
		text: 'Mobile',
		font: {fontFamily: utm.fontFamily, fontSize: 18},
		color: utm.barColor,
		wordWrap: false,
		ellipsize: true,
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE,
		left: 25,
		top: 10
	});
	settingsView.add(mobileLabel);
	
	var mobileField = Ti.UI.createTextField({
		value: '',
		color: utm.textFieldColor,		
		width: (Ti.Platform.displayCaps.platformWidth-50),
		height: 30,
		left: 25,
		autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
		autocorrect: false,
		keyboardType: Ti.UI.KEYBOARD_DEFAULT,
		returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
		top: 5,
		borderColor: '#D4D4D4',
		borderRadius: 2,
		borderWidth: 1,
		backgroundColor: 'white',
		paddingLeft: 7,
		font: {fontFamily: utm.fontFamily, fontSize: 16}
	});
	mobileField.addEventListener('focus', function() {
		nicknameField.add(focused);
	});
	mobileField.addEventListener('blur', function() { 
		nicknameField.remove(focused);
	});
	settingsView.add(mobileField);
	
	var nicknameLabel = Ti.UI.createLabel({
		text: 'Nickname',
		font: {fontFamily: utm.fontFamily, fontSize: 18},
		color: utm.barColor,
		wordWrap: false,
		ellipsize: true,
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE,
		left: 25,
		top: 10
	});
	settingsView.add(nicknameLabel);
	
	var nicknameField = Ti.UI.createTextField({
		value: '',
		color: utm.textFieldColor,		
		width: (Ti.Platform.displayCaps.platformWidth-50),
		height: 30,
		left: 25,
		autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
		autocorrect: false,
		keyboardType: Ti.UI.KEYBOARD_DEFAULT,
		returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
		top: 5,
		borderColor: '#D4D4D4',
		borderRadius: 2,
		borderWidth: 1,
		backgroundColor: 'white',
		paddingLeft: 7,
		font: {fontFamily: utm.fontFamily, fontSize: 16}
	});
	nicknameField.addEventListener('focus', function() {
		nicknameField.add(focused);
	});
	nicknameField.addEventListener('blur', function() { 
		nicknameField.remove(focused);
	});
	settingsView.add(nicknameField);
	
	var tableDataSettings = [];
	var tableViewSettings = Ti.UI.createTableView({
		top: 10,
		height: Ti.UI.SIZE,
		scrollable: false
	});
	settingsView.add(tableViewSettings);
	
	var postSection = Ti.UI.createTableViewSection({ headerTitle: 'Post to my' });
	
	var twitterRow = Ti.UI.createTableViewRow({
		height: (utm.Android ? '100dp' : 40),
		hasChild: false,
		selectedBackgroundColor: 'white'
	});
	var twitterIcon = Ti.UI.createImageView({
		image: '/images/icons/twitter.png',
		height: 30,
		width: 30,
		left: 25
	});
	var twitterSwitch = Ti.UI.createSwitch({
		right: 25,
		value: false
	});
	twitterRow.add(twitterIcon);
	twitterRow.add(twitterSwitch);
	postSection.add(twitterRow);
	
	twitterSwitch.addEventListener('change', function(e) {
		if (e.value) {
			if (!twitter.isAuthorized()) {
				twitter.authorize();
			}
			twitterEnabledForUser = true;
		}
	});
	
	
	var fbRow = Ti.UI.createTableViewRow({
		height: (utm.Android ? '100dp' : 40),
		hasChild: false,
		selectedBackgroundColor: 'white'
	});
	var fbIcon = Ti.UI.createImageView({
		image: '/images/icons/facebook.png',
		height: 30,
		width: 30,
		left: 25
	});
	var fbSwitch = Ti.UI.createSwitch({
		right: 25,
		value: false
	});
	fbRow.add(fbIcon);
	fbRow.add(fbSwitch);
	postSection.add(fbRow);
	
	fbSwitch.addEventListener('change', function(e) {
		if (e.value) {
			Facebook.setForceDialogAuth(true);
			Facebook.authorize();
			facebookEnabledForUser = true;
		}
	});

	Facebook.addEventListener('login', function(e) {
		if (e.success) {
			utm.facebookToken = Facebook.getAccessToken();
		} else if (e.error) {
			utm.facebookToken == '';
			fbSwitch.setValue(false);
		} else if (e.cancelled) {
			utm.facebookToken == '';
			fbSwitch.setValue(false);
		}
	});
	
	
	
	
	
	var additionalSection = Ti.UI.createTableViewSection({ headerTitle: 'Additional' });
	
	var signRow = Ti.UI.createTableViewRow({
		height: (utm.Android ? '100dp' : 40),
		hasChild: false,
		selectedBackgroundColor: 'white'
	});
	var signLabel = Ti.UI.createLabel({
		text: 'Sign message',
		width: Ti.UI.SIZE,
		left: 25,
		font: {fontFamily: utm.fontFamily}
	});
	var signSwitch = Ti.UI.createSwitch({
		right: 25,
		value: false
	});
	signRow.add(signLabel);
	signRow.add(signSwitch);
	additionalSection.add(signRow);
	
	var deleteRow = Ti.UI.createTableViewRow({
		height: (utm.Android ? '100dp' : 40),
		hasChild: false,
		selectedBackgroundColor: 'white'
	});
	var deleteLabel = Ti.UI.createLabel({
		text: 'Delete message when read',
		width: Ti.UI.SIZE,
		left: 25,
		height: Ti.UI.FILL,
		font: {fontFamily: utm.fontFamily}
	});
	var deleteSwitch = Ti.UI.createSwitch({
		value: false,
		right: 25
	});
	deleteRow.add(deleteLabel);
	deleteRow.add(deleteSwitch);
	additionalSection.add(deleteRow);
	
	tableDataSettings.push(postSection);
	tableDataSettings.push(additionalSection);
	tableViewSettings.setData(tableDataSettings);
	


	var populateSettings = function(_primaryData) {
		var _memberData = _primaryData.PrimaryUser;

		emailField.setValue(_memberData.Email);
		nicknameField.setValue(_memberData.NickName);
		mobileField.setValue(_memberData.Mobile);
		if (_memberData.TwitterToken !== '' && _memberData.TwitterToken != null) {
			twitterSwitch.setValue(true);
		}
		if (_memberData.FaceBook !== '' && _memberData.FaceBook != null) {
			fbSwitch.setValue(true);
		}
		if (_memberData.AddNicknameToUtms) {
			signSwitch.setValue(true);
		}
		self.hideAi();
	};


	function loadMyHortDetail() {
		var getMyHortDetailReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				var response = eval('(' + this.responseText + ')');
				_myHortDetails = response;

				if (this.status === 200) {
					populateSettings(response);
				} else {
					utm.handleHttpError({}, this.status, this.responseText);
				}
				getMyHortDetailReq = null;
			},
			onerror : function(e) {
				if (this.status != undefined && this.status === 404) {
					alert('The group you are looking for does not exist.');
				} else {
					utm.handleHttpError(e, this.status, this.responseText);
				}
				getMyHortDetailReq = null;
			},
			timeout : utm.netTimeout
		});
		getMyHortDetailReq.open("GET", utm.serviceUrl + "MyHort/GetMyHortDetails?myHortId=" + utm.User.UserProfile.PrimaryMyHort);
		getMyHortDetailReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		getMyHortDetailReq.send();
	}
	
	loadMyHortDetail();
	
	
	var saveButton = Ti.UI.createButton({
		title: 'Save',
		bottom: 10,
		width: (Ti.Platform.displayCaps.platformWidth-50),
		height: 40,
		borderRadius: 20,
		font:{fontFamily: utm.fontFamily, fontSize:'14dp'},
		backgroundColor: utm.buttonColor,
		color: 'white',
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN
	});	
	saveButton.addEventListener('click', function() {
		updateMyHortData();
	});	
	self.add(saveButton);
	

	function updateMyHortData() {
		var _userSettings = {
			UserId: utm.User.UserProfile.UserId,
			MyHortId: utm.User.UserProfile.PrimaryMyHort,
			MemberType: 'Primary',
			NickName: nicknameField.getValue(),
			Email: emailField.getValue(),
			TwitterToken: '',
			TwitterSecret: '',
			FaceBook: '',
			Mobile: mobileField.getValue(),
			AddNickNameToUtms: signSwitch.getValue()
		};
		
		if (twitterSwitch.getValue()) {
			if (!twitter.isAuthorized()) {
				_userSettings.TwitterToken = utm.TwitterToken;
				_userSettings.TwitterSecret = utm.TwitterTokenSecret;
			} else {
				_userSettings.TwitterToken = utm.TwitterToken;
				_userSettings.TwitterSecret = utm.TwitterTokenSecret;
			}
		}
		if (fbSwitch.getValue()) {
			_userSettings.FaceBook = Facebook.getAccessToken();
		}
		Ti.API.info(_userSettings);
		
		var updateMyHortDetailReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				var json = this.responseData;
				Ti.API.info(json);
				if (this.status === 200) {
					self.close();
				} else {
					utm.handleHttpError({}, this.status, this.responseText);
				}
				updateMyHortDetailReq = null;
			},
			onerror : function(e) {
				utm.handleHttpError(e, this.status, this.responseText);
				updateMyHortDetailReq = null;
			},
			timeout : utm.netTimeout
		});
		
		updateMyHortDetailReq.open("POST", utm.serviceUrl + "MyHort/UpdatePrimaryContactInfo");
		updateMyHortDetailReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		updateMyHortDetailReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		updateMyHortDetailReq.send(JSON.stringify(_userSettings));
	}
	
	
	return self;
};

module.exports = PrimaryGroupDetailWin;

