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

	var backButton = Ti.UI.createLabel({
		text: 'back',
		font: {fontFamily: utm.fontFamily},
		color: 'white'
	});
	backButton.addEventListener('click',function(e){
		self.close();
	});
	self.setLeftNavButton(backButton);
	
	var addButton = Ti.UI.createImageView({
		image: '/images/icons/add.png',
		height: 22,
		width: 22
	});
	addButton.addEventListener('click',function(e){
		var AddToGroupWin = require('/ui/common/AddMembersToGroup');
		var addToGroupWin = new AddToGroupWin(_tabGroup,_groupData);
		addToGroupWin.addEventListener('close',function(e){
			loadMyHortDetail();
		});
		_tabGroup.getActiveTab().open(addToGroupWin);
	});
	self.setRightNavButton(addButton);
	
	var mode = 'members';
	var tabBar = Titanium.UI.createView({
		layout : 'horizontal',
		width : '100%',
		height : 27,
		top: 0
	});
	self.add(tabBar);
	var membersButton = Ti.UI.createLabel({
		text: 'members',
		width: Math.round(Ti.Platform.displayCaps.platformWidth * 0.5),
		height: Ti.UI.FILL,
		backgroundColor: 'white',
		borderColor: '#D4D4D4',
		borderWidth: 1,
		font: {fontFamily: utm.fontFamily},
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
		font: {fontFamily: utm.fontFamily},
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
	
	
	
	
	var tableView = Ti.UI.createTableView({
		height: utm.viewableArea - 137,
		top: 27
	});
	self.add(tableView);
	tableView.addEventListener('click',function(e){
		if (e.rowData.memberData.InviteCode != null) {
			var OwnerGroupMemberDetail = require('/ui/common/OwnerGroupMemberPending');
		} else {
			var OwnerGroupMemberDetail = require('/ui/common/OwnerGroupMemberDetail');
		}
		var ownerGroupMemberDetail = new OwnerGroupMemberDetail(_tabGroup, e.rowData.memberData);
		ownerGroupMemberDetail.addEventListener('close',function(e){
			loadMyHortDetail();
		});
		_tabGroup.getActiveTab().open(ownerGroupMemberDetail);	
	});
	
	var settingsView = Ti.UI.createScrollView ({
		height: utm.viewableArea - 137,
		top: 27,
		showVerticalScrollIndicator:true,
		contentHeight:'auto',
		layout: 'vertical'
	});
	
	var focused = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: 2,
		backgroundColor: utm.barColor,
		bottom: 0
	});
	
	var groupLabel = Ti.UI.createLabel({
		text: 'Group name',
		font: {fontFamily: utm.fontFamily, fontSize: 18},
		color: utm.barColor,
		wordWrap: false,
		ellipsize: true,
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE,
		left: 25,
		top: 10
	});
	settingsView.add(groupLabel);
	
	var groupField = Ti.UI.createTextField({
		value: _groupData.FriendlyName,
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
	groupField.addEventListener('focus', function() {
		groupField.add(focused);
	});
	groupField.addEventListener('blur', function() { 
		groupField.remove(focused);
	});
	settingsView.add(groupField);
	
	var premessageLabel = Ti.UI.createLabel({
		text: 'Premessage',
		font: {fontFamily: utm.fontFamily, fontSize: 18},
		color: utm.barColor,
		wordWrap: false,
		ellipsize: true,
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE,
		left: 25,
		top: 10
	});
	settingsView.add(premessageLabel);
	
	var premessageField = Ti.UI.createTextField({
		value: _groupData.Prefix,
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
	premessageField.addEventListener('focus', function() {
		premessageField.add(focused);
	});
	premessageField.addEventListener('blur', function() { 
		premessageField.remove(focused);
	});
	settingsView.add(premessageField);
	
	var postmessageLabel = Ti.UI.createLabel({
		text: 'Postmessage',
		font: {fontFamily: utm.fontFamily, fontSize: 18},
		color: utm.barColor,
		wordWrap: false,
		ellipsize: true,
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE,
		left: 25,
		top: 10
	});
	settingsView.add(postmessageLabel);
	
	var postmessageField = Ti.UI.createTextField({
		value: _groupData.Postfix,
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
	postmessageField.addEventListener('focus', function() {
		postmessageField.add(focused);
	});
	postmessageField.addEventListener('blur', function() { 
		postmessageField.remove(focused);
	});
	settingsView.add(postmessageField);
	
	var emailLabel = Ti.UI.createLabel({
		text: 'Email',
		font: {fontFamily: utm.fontFamily, fontSize: 18},
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
				authTwitter();
			}
			twitterEnabledForUser = true;
		} else {
			//var dialog = Ti.UI.createAlertDialog({
			//	cancel : 1,
			//	buttonNames : ['Deauthorize',  L('cancel')],
			//	message : 'You are about to deauthorize Twitter for this group ',
			//	title : 'Confirm deauthorize'
			//});
			//dialog.addEventListener('click', function(e) {
			//	if (e.index === 0) {
			//		utm.TwitterToken = '';
			//		utm.TwitterTokenSecret = '';
			//		twitter.deauthorize();
			//		twitterEnabledForUser = false;
			//	} else if (e.index === 2) {
			//		Ti.API.info('The cancel button was clicked');
			//	}
			//});
			//dialog.show();
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
		value: ((_groupData.FaceBook != null) ? true : false)
	});
	fbRow.add(fbIcon);
	fbRow.add(fbSwitch);
	postSection.add(fbRow);
	
	fbSwitch.addEventListener('change', function(e) {
		if (e.value) {
			Facebook.setForceDialogAuth(true);
			Facebook.authorize();
			facebookEnabledForUser = true;
		} else {
		//	var dialog = Ti.UI.createAlertDialog({
		//		cancel : 1,
		//		buttonNames : ['Deauthorize', L('cancel')],
		//		message : 'You are about deauthorize Facebook for this group ',
		//		title : 'Deauthorize Options'
		//	});
		//	dialog.addEventListener('click', function(e) {
		//		if (e.index === 0) {
		//			Facebook.logout();
		//		} else if (e.index === 2) {
		//			Ti.API.info('The cancel button was clicked');
		//		}
		//	});
		//	dialog.show();
		}
	});

	Facebook.addEventListener('login', function(e) {
		if (e.success) {
			utm.facebookToken = Facebook.getAccessToken();
		} else if (e.error) {
			utm.facebookToken == '';
		} else if (e.cancelled) {
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
	};


	function loadMyHortDetail() {
		var getMyHortDetailReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				var response = eval('(' + this.responseText + ')');
				_myHortDetails = response;

				if (this.status === 200) {
					if (response.IsOwner) {
						_memberData = response.PrimaryUser;
					} else {
						_memberData = response.MyInformation;
					}
					populateSettings(_memberData);
					displayMemberData(response.myHort.Members);
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
	
	loadMyHortDetail();
	
	var deleteButton = Ti.UI.createButton({
		title: 'Delete group',
		bottom: 60,
		width: (Ti.Platform.displayCaps.platformWidth-50),
		height: 40,
		borderRadius: 20,
		font:{fontFamily: utm.fontFamily, fontSize:'14dp'},
		backgroundColor: utm.barColor,
		color: 'white',
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN
	});
	deleteButton.addEventListener('click',function(e){
		confirmDeleteMyHort();
	});
	self.add(deleteButton);
	
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
			NickName: nicknameField.getValue(),
			Email: emailField.getValue(),
			Mobile: mobileField.getValue(),
			AddNicknameToUtms: signSwitch.getValue(),
			TwitterToken: '',
			TwitterSecret: '',
			FaceBook: '',
			Id: _memberData.Id
		};
		if (twitterSwitch.getValue()) {
			if (!twitter.isAuthorized()) {
				authTwitter();
			}
			_userSettings.TwitterToken = utm.TwitterToken;
			_userSettings.TwitterSecret = utm.TwitterTokenSecret;
		}
		if (fbSwitch.getValue()) {
			Facebook.authorize();
			_userSettings.FaceBook = Facebook.getAccessToken();
		}
		
		if (_myHortDetails.IsOwner) {
			_myHortDetails.PrimaryUser = _userSettings;
			_myHortDetails.MyInformation = '';

			_myHortDetails.myHort.Prefix = premessageField.getValue();
			_myHortDetails.myHort.Postfix = postmessageField.getValue();
			_myHortDetails.myHort.FriendlyName = groupField.getValue();
			
		} else {
			_myHortDetails.MyInformation = _userSettings;
			_myHortDetails.PrimaryUser = '';
		}
		delete _myHortDetails['MyInformation'];
		delete _myHortDetails.myHort['Members'];
		
		var updateMyHortDetailReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				var json = this.responseData;
				//alert(json);
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
	
	function confirmDeleteMyHort() {
		var dialog = Ti.UI.createAlertDialog({
			cancel: 1,
			buttonNames: ['Yes', L('cancel')],
			message: 'This will delete all information in this group.  Do you want to continue?',
			title: 'Confirm delete'
		});
		dialog.addEventListener('click', function(e) {
			if (e.index === 0) {
				deleteMyHort();
			}
		});
		dialog.show();
	};
	
	
	function deleteMyHort() {
		var deleteMyHortReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				var json = this.responseData;
				if (this.status === 200) {
					self.close();
				} else {
					utm.handleHttpError({}, this.status, this.responseText);
				}
				deleteMyHortReq = null;
			},
			onerror : function(e) {
				utm.handleHttpError(e, this.status, this.responseText);
				deleteMyHortReq = null;
			},
			timeout : utm.netTimeout
		});
		
		deleteMyHortReq.open("GET", utm.serviceUrl + "MyHort/DeleteUsersMyHort?myhortId=" + _groupData.MyHortId);
		deleteMyHortReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		deleteMyHortReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		deleteMyHortReq.send();
	}
	
	
	return self;
};

module.exports = MemberGroupDetailWin;
