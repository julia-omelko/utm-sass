var MemberGroupDetailWin = function(_tabGroup,_groupData) {
	
	var _myHortDetails = {};
	for (var i=0; i<_groupData.Members.length; i++) {
		if (_groupData.Members[i].UserId === utm.User.UserProfile.UserId) {
			_memberData = _groupData.Members[i];
			break;
		}
	}
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Group Detail', true);

	var BackButton = require('ui/common/baseui/BackButton');
	var backButton = new BackButton(self);
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
	
	
	
	var mode = 'members';
	var tabBar = Titanium.UI.createView({
		layout : 'horizontal',
		width : '100%',
		height : 27*utm.sizeMultiplier,
		top: utm.viewableTop
	});
	self.add(tabBar);
	var membersButton = Ti.UI.createLabel({
		text: 'members',
		width: Math.round(Ti.Platform.displayCaps.platformWidth * 0.5),
		height: Ti.UI.FILL,
		backgroundColor: 'white',
		borderColor: '#D4D4D4',
		borderWidth: 1,
		font: {fontFamily: utm.fontFamily, fontSize: utm.fontSize},
		color: utm.textColor,
	    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
	});
	tabBar.add(membersButton);
	var settingsButton = Ti.UI.createLabel({
		text: 'settings',
		width: Math.round(Ti.Platform.displayCaps.platformWidth * 0.5),
		height: Ti.UI.FILL,
		backgroundColor: utm.backgroundColor,
		borderColor: '#D4D4D4',
		borderWidth: 1,
		font: {fontFamily: utm.fontFamily, fontSize: utm.fontSize},
		color: utm.secondaryTextColor,
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
	});
	tabBar.add(settingsButton);
	
	membersButton.addEventListener('click', function(e){
		membersButton.setBackgroundColor('white');
		membersButton.setColor(utm.textColor);
		settingsButton.setBackgroundColor(utm.backgroundColor);
		settingsButton.setColor(utm.secondaryTextColor);
		self.remove(settingsView);
		self.add(tableView);
	});
	settingsButton.addEventListener('click', function(e){
		settingsButton.setBackgroundColor('white');
		settingsButton.setColor(utm.textColor);
		membersButton.setBackgroundColor(utm.backgroundColor);
		membersButton.setColor(utm.secondaryTextColor);
		self.remove(tableView);
		self.add(settingsView);
	});
	
	var tableView = Ti.UI.createTableView({
		height: utm.viewableArea - ((27*utm.sizeMultiplier)+((40*2*utm.sizeMultiplier)+30)),
		top: utm.viewableTop + (27*utm.sizeMultiplier),
		allowsSelection:false
	});
	self.add(tableView);
	
	var settingsView = Ti.UI.createScrollView({
		height: utm.viewableArea - ((27*utm.sizeMultiplier)+((40*2*utm.sizeMultiplier)+30)),
		top: utm.viewableTop + (27*utm.sizeMultiplier),
		layout: 'vertical'
	});
	
	var focused = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: 2,
		backgroundColor: utm.barColor,
		bottom: 0
	});
	
	var emailLabel = Ti.UI.createLabel({
		text: 'Email',
		font: {fontFamily: utm.fontFamily, fontSize: '18dp'},
		color: utm.barColor,
		wordWrap: false,
		ellipsize: true,
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE,
		left: 25,
		top: 10
	});
	settingsView.add(emailLabel);
	
	var emailField = Ti.UI.createTextField({
		value: '',
		color: utm.textFieldColor,		
		width: (Ti.Platform.displayCaps.platformWidth-50),
		height: (utm.Android ? Ti.UI.SIZE : 30),
		left: 25,
		autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
		autocorrect: false,
		keyboardType: Ti.UI.KEYBOARD_DEFAULT,
		returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
		top: 10,
		borderColor: '#D4D4D4',
		borderRadius: 2,
		borderWidth: 1,
		backgroundColor: 'white',
		paddingLeft: 7,
		font: {fontFamily: utm.fontFamily, fontSize: '16dp'}
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
		font: {fontFamily: utm.fontFamily, fontSize: '18dp'},
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
		height: (utm.Android ? Ti.UI.SIZE : 30),
		left: 25,
		autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
		autocorrect: false,
		keyboardType: Ti.UI.KEYBOARD_DEFAULT,
		returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
		top: 10,
		borderColor: '#D4D4D4',
		borderRadius: 2,
		borderWidth: 1,
		backgroundColor: 'white',
		paddingLeft: 7,
		font: {fontFamily: utm.fontFamily, fontSize: '16dp'}
	});
	mobileField.addEventListener('focus', function() {
		mobileField.add(focused);
	});
	mobileField.addEventListener('blur', function() { 
		mobileField.remove(focused);
	});
	settingsView.add(mobileField);
	
	var tableDataSettings = [];
	var tableViewSettings = Ti.UI.createTableView({
		top: 10,
		height: Ti.UI.SIZE,
		scrollable: false
	});
	settingsView.add(tableViewSettings);
	
	var postSection = Ti.UI.createTableViewSection({ headerTitle: 'Post to my' });
	
	var twitterRow = Ti.UI.createTableViewRow({
		height: 40*utm.sizeMultiplier,
		hasChild: false,
		selectedBackgroundColor: 'white'
	});
	var twitterIcon = Ti.UI.createImageView({
		image: '/images/icons/twitter.png',
		height: 30*utm.sizeMultiplier,
		width: 30*utm.sizeMultiplier,
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
		height: 40*utm.sizeMultiplier,
		hasChild: false,
		selectedBackgroundColor: 'white'
	});
	var fbIcon = Ti.UI.createImageView({
		image: '/images/icons/facebook.png',
		height: 30*utm.sizeMultiplier,
		width: 30*utm.sizeMultiplier,
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
		height: 40*utm.sizeMultiplier,
		hasChild: false,
		selectedBackgroundColor: 'white'
	});
	var signLabel = Ti.UI.createLabel({
		text: 'Sign message',
		width: Ti.UI.SIZE,
		left: 25,
		font: {fontFamily: utm.fontFamily, fontSize: utm.fontSize},
		color: utm.secondaryTextColor
	});
	var signSwitch = Ti.UI.createSwitch({
		right: 25,
		value: false
	});
	signRow.add(signLabel);
	signRow.add(signSwitch);
	additionalSection.add(signRow);
	
	tableDataSettings.push(postSection);
	tableDataSettings.push(additionalSection);
	tableViewSettings.setData(tableDataSettings);
	
	
	
	function displayMemberData(_members) {
		_members.sort(sort_by('NickName', true, function(a){return a.toUpperCase();}));
		var aAlpha = [];
		var aMember = [];
		var letter = '';
		for (var i=0; i<_members.length; i++) {
			var letter2 = _members[i].NickName.charAt(0).toUpperCase();
			if (letter !== letter2) {
				aAlpha[aAlpha.length] = letter2;
				letter = letter2;
			}
		}
		for (var i=0; i<aAlpha.length; i++) {
			aMember[i] = [];
			for (var j=0; j<_members.length; j++) {
				var letter = _members[j].NickName.charAt(0).toUpperCase();
				if (aAlpha[i] === letter) {
					aMember[i][aMember[i].length] = _members[j];
				}
			}
		}
		var MemberViewSection = require('/ui/common/baseui/MemberViewSection');
		var tableData = [];
		for (var i=0; i<aAlpha.length; i++) {
			tableData[i] = new  MemberViewSection(aAlpha[i],aMember[i]);
		}
		for (var i=0; i<tableData.length; i++) {
			for (var j=0; j<tableData[i].rows.length; j++) {
				tableData[i].rows[j].setHasChild(false);
			}
		}
		tableView.setData(tableData);
		self.hideAi();
	}
	
	var sort_by = function(field, reverse, primer) {
	   var key = primer ? function(x) {return primer(x[field]);} : function(x) {return x[field];};
	   reverse = [-1, 1][+!!reverse];
	   return function (a, b) {
	       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
	   }; 
	};

	var populateSettings = function(_memberData) {
		emailField.setValue(_memberData.Email);
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
	};


	function loadMyHortDetail() {
		var getMyHortDetailReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				var response = eval('(' + this.responseText + ')');
				_myHortDetails = response;
				if (this.status === 200) {
					_memberData = _myHortDetails.MyInformation;
					populateSettings(_memberData);
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
		getMyHortDetailReq.open("GET", utm.serviceUrl + "MyHort/GetMyHortDetails?myHortId=" + _groupData.MyHortId);
		getMyHortDetailReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		getMyHortDetailReq.send();
	}
	
	displayMemberData(_groupData.Members);
	loadMyHortDetail();
	
	var StandardButton = require('/ui/common/baseui/StandardButton');
	var leaveButton = new StandardButton({title:'Leave group',bottom:(40*utm.sizeMultiplier)+20,type:'secondary'});
	leaveButton.addEventListener('click',function(e){
		confirmLeaveMyHort();
	});
	self.add(leaveButton);
	
	var saveButton = new StandardButton({title:'Save'});
	saveButton.addEventListener('click', function() {
		updateMyHortData();
	});	
	self.add(saveButton);
	
	
	
	function confirmLeaveMyHort() {
		var dialog = Ti.UI.createAlertDialog({
			cancel: 1,
			buttonNames: ['Yes', L('cancel')],
			message: 'This will remove you from this group.  Do you want to continue?',
			title: 'Leave group'
		});
		dialog.addEventListener('click', function(e) {
			if (e.index === 0) {
				leaveMyHort();
			}
		});
		dialog.show();
	};
	
	
	function leaveMyHort() {
		var leaveMyHortReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				var json = this.responseData;
				if (this.status === 200) {
					self.close();
				} else {
					utm.handleHttpError({}, this.status, this.responseText);
				}
				leaveMyHortReq = null;
			},
			onerror : function(e) {
				utm.handleHttpError(e, this.status, this.responseText);
				leaveMyHortReq = null;
			},
			timeout : utm.netTimeout
		});
		
		leaveMyHortReq.open("POST", utm.serviceUrl + "MyHort/LeaveMyHort?myHortId=" + _groupData.MyHortId);
		leaveMyHortReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		leaveMyHortReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		leaveMyHortReq.send();
	}
	
	function updateMyHortData() {
		var _userSettings = {
			NickName: _memberData.NickName,
			Email: emailField.getValue(),
			Mobile: mobileField.getValue(),
			AddNicknameToUtms: signSwitch.getValue(),
			MemberType: _memberData.MemberType,
			TwitterToken: '',
			TwitterSecret: '',
			FaceBook: '',
			Id: _memberData.Id,
			UserId: utm.User.UserProfile.UserId,
			MyHortId: _groupData.MyHortId
		};

		if (twitterSwitch.getValue()) {
			if (!twitter.isAuthorized()) {
				_userSettings.TwitterToken = '';
				_userSettings.TwitterSecret = '';
			} else {
				_userSettings.TwitterToken = utm.TwitterToken;
				_userSettings.TwitterSecret = utm.TwitterTokenSecret;
			}
		}
		if (fbSwitch.getValue()) {
			_userSettings.FaceBook = Facebook.getAccessToken();
		}
		_myHortDetails.MyInformation =  _userSettings;
		
		var updateMyHortDetailReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				var json = this.responseData;
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
		
		updateMyHortDetailReq.open("POST", utm.serviceUrl + "MyHort/UpdateMyHortDetails");
		updateMyHortDetailReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		updateMyHortDetailReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		updateMyHortDetailReq.send(JSON.stringify(_myHortDetails));
	}
	
	
	
	
	return self;
};

module.exports = MemberGroupDetailWin;

