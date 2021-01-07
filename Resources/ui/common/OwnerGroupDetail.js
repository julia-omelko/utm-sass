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

	var updateDisplay = function() {
		self.fireEvent('reorientdisplay');
	};
	Ti.App.addEventListener('orientdisplay', updateDisplay);

	var BackButton = require('ui/common/baseui/BackButton');
	var backButton = new BackButton(self);
	self.setLeftNavButton(backButton);
	
	var addButton = Ti.UI.createImageView({
		image: '/images/icons/add.png',
		height: 25,
		width: 25
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
		height : 37*utm.sizeMultiplier,
		top: utm.viewableTop
	});
	self.add(tabBar);
	var membersButton = Ti.UI.createLabel({
		text: 'members',
		width: Math.round(Ti.Platform.displayCaps.platformWidth * 0.4999),
		height: Ti.UI.FILL,
		backgroundColor: 'white',
		borderColor: '#D4D4D4',
		borderWidth: 1,
		font: {fontFamily: utm.fontFamily, fontSize: utm.fontSize},
		color: utm.textColor,
	    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
	});
	
	self.addEventListener('reorientdisplay', function(evt) {
		membersButton.width = Math.round(Ti.Platform.displayCaps.platformWidth * 0.5);
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
	
	self.addEventListener('reorientdisplay', function(evt) {
		settingsButton.width = Math.round(Ti.Platform.displayCaps.platformWidth * 0.5);
	});
	
	membersButton.addEventListener('click', function(e){
		mode = 'members';
		membersButton.setBackgroundColor('white');
		membersButton.setColor(utm.textColor);
		settingsButton.setBackgroundColor(utm.backgroundColor);
		settingsButton.setColor(utm.secondaryTextColor);
		self.remove(settingsView);
		if (utm.Android) {
			self.add(membersView);
			saveButton.setTitle('Add Members');
		} else {
			self.add(tableView);
			self.add(buttonsView);
		}
	});
	settingsButton.addEventListener('click', function(e){
		mode = 'settings';
		settingsButton.setBackgroundColor('white');
		settingsButton.setColor(utm.textColor);
		membersButton.setBackgroundColor(utm.backgroundColor);
		membersButton.setColor(utm.secondaryTextColor);
		if (utm.Android) {
			self.remove(membersView);
		} else {
			self.remove(tableView);
			self.remove(buttonsView);
		}
		self.add(settingsView);
		saveButton.setTitle('Save');
	});
	
	
	
	
//	var Facebook = require('facebook');
	/*var social = require("lib/social");
	var twitter = social.create({
		site: 'Twitter', // <-- this example is for Twitter. I'll expand this to other sites in the future.
		consumerKey: utm.twitterConsumerKey, // <--- you'll want to replace this
		consumerSecret: utm.twitterConsumerSecret, // <--- and this with your own keys!
		utmSpace: utm
	});*/
	//Facebook.appid = utm.facebookAppId;
	//Facebook.permissions = ['publish_stream', 'read_stream'];
	
	
	
	
	var tableView = Ti.UI.createTableView({
		height: (utm.Android ? utm.viewableArea - ((45*utm.sizeMultiplier)*3) : utm.viewableArea - ((37*utm.sizeMultiplier)+((40*2*utm.sizeMultiplier)+30))),
		top: utm.viewableTop+(37*utm.sizeMultiplier)
	});
	
	if (utm.Android) {
		var membersView = Ti.UI.createScrollView ({
			height: Ti.UI.SIZE,
			top: utm.viewableTop+(37*utm.sizeMultiplier),
			showVerticalScrollIndicator:true,
			contentHeight:'auto',
			layout: 'vertical'
		});
		self.add(membersView);
		tableView.top = 0;
		membersView.add(tableView);
	} else self.add(tableView);
	
	self.addEventListener('reorientdisplay', function(evt) {
		tableView.height = utm.viewableArea - ((37*utm.sizeMultiplier)+((40*2*utm.sizeMultiplier)+30));
	});	
	
	tableView.addEventListener('click',function(e){
		if (e.source.memberData != null) {
			//if (e.source.memberData.InviteCode != null) {
			//	var OwnerGroupMemberDetail = require('/ui/common/OwnerGroupMemberPending');
			//} else {
			var OwnerGroupMemberDetail = require('/ui/common/OwnerGroupMemberDetail');
			//}
			var ownerGroupMemberDetail = new OwnerGroupMemberDetail(_tabGroup, e.source.memberData);
			ownerGroupMemberDetail.addEventListener('close',function(e){
				loadMyHortDetail();
			});
			_tabGroup.getActiveTab().open(ownerGroupMemberDetail);
		}	
	});
	
	var settingsView = Ti.UI.createScrollView ({
		height: (utm.Android ? Ti.UI.SIZE : utm.viewableArea - ((37*utm.sizeMultiplier)+((40*2*utm.sizeMultiplier)+30))),
		top: utm.viewableTop+(37*utm.sizeMultiplier),
		showVerticalScrollIndicator:true,
		contentHeight:'auto',
		layout: 'vertical'
	});
	
	self.addEventListener('reorientdisplay', function(evt) {
		settingsView.height = utm.viewableArea - ((37*utm.sizeMultiplier)+((40*2*utm.sizeMultiplier)+30));
	});
	
	var focused = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: 2,
		backgroundColor: utm.barColor,
		bottom: 0
	});
	
	var groupLabel = Ti.UI.createLabel({
		text: 'Group name',
		font: {fontFamily: utm.fontFamily, fontSize: '18dp'},
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
		height: (utm.Android ? Ti.UI.SIZE : 30),
		left: 25,
		autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
		autocorrect: false,
		keyboardType: Ti.UI.KEYBOARD_TYPE_DEFAULT,
		returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
		top: 5,
		borderColor: '#D4D4D4',
		borderRadius: 2,
		borderWidth: 1,
		backgroundColor: 'white',
		paddingLeft: 7,
		font: {fontFamily: utm.fontFamily, fontSize: '16dp'}
	});
	groupField.addEventListener('focus', function() {
		groupField.add(focused);
	});
	groupField.addEventListener('blur', function() { 
		groupField.remove(focused);
	});
	settingsView.add(groupField);
	
	self.addEventListener('reorientdisplay', function(evt) {
		groupField.width = (Ti.Platform.displayCaps.platformWidth-50);
	});
	
	var premessageLabel = Ti.UI.createLabel({
		text: 'Premessage',
		font: {fontFamily: utm.fontFamily, fontSize: '18dp'},
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
		height: (utm.Android ? Ti.UI.SIZE : 30),
		left: 25,
		autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
		autocorrect: false,
		maxLength: 16,
		keyboardType: Ti.UI.KEYBOARD_TYPE_DEFAULT,
		returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
		top: 5,
		borderColor: '#D4D4D4',
		borderRadius: 2,
		borderWidth: 1,
		backgroundColor: 'white',
		paddingLeft: 7,
		font: {fontFamily: utm.fontFamily, fontSize: '16dp'}
	});
	premessageField.addEventListener('focus', function() {
		premessageField.add(focused);
	});
	premessageField.addEventListener('blur', function() { 
		premessageField.remove(focused);
	});
	settingsView.add(premessageField);
	
	self.addEventListener('reorientdisplay', function(evt) {
		premessageField.width = (Ti.Platform.displayCaps.platformWidth-50);
	});	
	
	var postmessageLabel = Ti.UI.createLabel({
		text: 'Postmessage',
		font: {fontFamily: utm.fontFamily, fontSize: '18dp'},
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
		height: (utm.Android ? Ti.UI.SIZE : 30),
		left: 25,
		autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
		autocorrect: false,
		maxLength: 16,
		keyboardType: Ti.UI.KEYBOARD_TYPE_DEFAULT,
		returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
		top: 5,
		borderColor: '#D4D4D4',
		borderRadius: 2,
		borderWidth: 1,
		backgroundColor: 'white',
		paddingLeft: 7,
		font: {fontFamily: utm.fontFamily, fontSize: '16dp'}
	});
	postmessageField.addEventListener('focus', function() {
		postmessageField.add(focused);
	});
	postmessageField.addEventListener('blur', function() { 
		postmessageField.remove(focused);
	});
	settingsView.add(postmessageField);
	
	self.addEventListener('reorientdisplay', function(evt) {
		postmessageField.width = (Ti.Platform.displayCaps.platformWidth-50);
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
		keyboardType: Ti.UI.KEYBOARD_TYPE_DEFAULT,
		returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
		top: 5,
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
	
	self.addEventListener('reorientdisplay', function(evt) {
		emailField.width = (Ti.Platform.displayCaps.platformWidth-50);
	});	
	
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
		keyboardType: Ti.UI.KEYBOARD_TYPE_DEFAULT,
		returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
		top: 5,
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

	self.addEventListener('reorientdisplay', function(evt) {
		mobileField.width = (Ti.Platform.displayCaps.platformWidth-50);
	});	
	
	
	
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
		backgroundSelectedColor: 'white'
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
	
	
	/*var fbRow = Ti.UI.createTableViewRow({
		height: 40*utm.sizeMultiplier,
		hasChild: false,
		backgroundSelectedColor: 'white'
	});
	var fbIcon = Ti.UI.createImageView({
		image: '/images/icons/facebook.png',
		height: 30*utm.sizeMultiplier,
		width: 30*utm.sizeMultiplier,
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
	*/
	
	
	
	
	var additionalSection = Ti.UI.createTableViewSection({ headerTitle: 'Additional' });
	
	var signRow = Ti.UI.createTableViewRow({
		height: 40*utm.sizeMultiplier,
		hasChild: false,
		backgroundSelectedColor: 'white'
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
	
	var deleteRow = Ti.UI.createTableViewRow({
		height: 40*utm.sizeMultiplier,
		hasChild: false,
		backgroundSelectedColor: 'white'
	});
	var deleteLabel = Ti.UI.createLabel({
		text: 'Delete message when read',
		width: Ti.UI.SIZE,
		left: 25,
		height: Ti.UI.FILL,
		font: {fontFamily: utm.fontFamily, fontSize: utm.fontSize},
		color: utm.secondaryTextColor
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
//		nicknameField.setValue(_memberData.NickName);
		mobileField.setValue(_memberData.Mobile);
		if (_memberData.TwitterToken !== '' && _memberData.TwitterToken != null) {
			twitterSwitch.setValue(true);
		}
		//if (_memberData.FaceBook !== '' && _memberData.FaceBook != null) {
		//	fbSwitch.setValue(true);
		//}
		if (_memberData.AddNicknameToUtms) {
			signSwitch.setValue(true);
		}
		if (_memberData.DeleteOnRead !== null && _memberData.DeleteOnRead) {
			deleteSwitch.setValue(true);
		}
	};


	function loadMyHortDetail() {
		self.showAi();
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
					_groupData.Members = response.myHort.Members;
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
			timeout : utm.netTimeout,
			enableKeepAlive : utm.keepAlive
		});
		getMyHortDetailReq.open("GET", utm.serviceUrl + "MyHort/GetMyHortDetails?myHortId=" + _groupData.MyHortId);
		getMyHortDetailReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		getMyHortDetailReq.send();
	}
	
	loadMyHortDetail();
	
	
	var StandardButton = require('/ui/common/baseui/StandardButton');

	var newMessageButton = new StandardButton({
		title:'New Message',
		type:'secondary'
	});

	var deleteButton = new StandardButton({
		title:'Delete Group',
		type:'secondary'
	});
	deleteButton.addEventListener('click',function(e){
		confirmDeleteMyHort();
	});	
	
	
	if (utm.Android) {
		//Can't add button to window because Android keyboard makes window smaller, so add to view for Android
		membersView.add(newMessageButton);
		settingsView.add(deleteButton);
		deleteButton.top = 10;
		deleteButton.bottom = 10;  
	} else {
			var buttonsView = Ti.UI.createView({
				layout : 'horizontal',
				width : Ti.UI.SIZE,
				height : Ti.UI.SIZE,
				bottom: 50
			});
			self.add(buttonsView);
			
			var leftButtonView = Ti.UI.createView({
					width : Math.round(Ti.Platform.displayCaps.platformWidth * 0.5),
					height : Ti.UI.SIZE
			});
			buttonsView.add(leftButtonView);
			
			var rightButtonView = Ti.UI.createView({
					width : Math.round(Ti.Platform.displayCaps.platformWidth * 0.5),
					height : Ti.UI.SIZE
			});
			buttonsView.add(rightButtonView);				
			
			newMessageButton.width = (Ti.Platform.displayCaps.platformWidth *.5)-50;
			leftButtonView.add(newMessageButton);				
			
			deleteButton.width = (Ti.Platform.displayCaps.platformWidth *.5)-50;
			rightButtonView.add(deleteButton);		
	}
	
	self.addEventListener('reorientdisplay', function(evt) {
		leftButtonView.width = Math.round(Ti.Platform.displayCaps.platformWidth * 0.5);
		rightButtonView.width = Math.round(Ti.Platform.displayCaps.platformWidth * 0.5);
		newMessageButton.width = (Ti.Platform.displayCaps.platformWidth *.5)-50;
		deleteButton.width = (Ti.Platform.displayCaps.platformWidth *.5)-50;	
	});
	
	var goChooseMembers = function() {
		var MessageGroupMembersWin = require('/ui/common/MessageGroupMembers');
		var messageGroupMembersWin = new MessageGroupMembersWin(_tabGroup, _groupData);
		utm.winStack.push(messageGroupMembersWin);
		_tabGroup.getActiveTab().open(messageGroupMembersWin);
	};
	newMessageButton.addEventListener('click',function(e){
		goChooseMembers();
	});
	
	var saveButton = new StandardButton({title:(utm.Android ? 'Add Members' : 'Save')});
	saveButton.addEventListener('click', function() {
		if (mode === 'settings' || !utm.Android) {
			updateMyHortData();
		} else {
			var AddToGroupWin = require('/ui/common/AddMembersToGroup');
			var addToGroupWin = new AddToGroupWin(_tabGroup,_groupData);
			addToGroupWin.addEventListener('close',function(e){
				loadMyHortDetail();
			});
			_tabGroup.getActiveTab().open(addToGroupWin);
		}
	});	
	
	if (utm.Android) {
		//Can't add button to window because Android keyboard makes window smaller, so add to view for Android
		settingsView.add(saveButton);
		membersView.add(saveButton);
		saveButton.top = 5;
	} else {	  
		self.add(saveButton);
	}
	

	function updateMyHortData() {
		var _userSettings = {
//			NickName: nicknameField.getValue(),
			Email: emailField.getValue(),
			Mobile: mobileField.getValue(),
			AddNicknameToUtms: signSwitch.getValue(),
			DeleteOnRead: deleteSwitch.getValue(),
			TwitterToken: '',
			TwitterSecret: '',
			FaceBook: '',
			Id: _memberData.Id
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
		//if (fbSwitch.getValue()) {
		//	_userSettings.FaceBook = Facebook.getAccessToken();
		//}
		
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
			timeout : utm.netTimeout,
			enableKeepAlive : utm.keepAlive
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
			timeout : utm.netTimeout,
			enableKeepAlive : utm.keepAlive
		});
		
		deleteMyHortReq.open("GET", utm.serviceUrl + "MyHort/DeleteUsersMyHort?myhortId=" + _groupData.MyHortId);
		deleteMyHortReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		deleteMyHortReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		deleteMyHortReq.send();
	}
	
		// keyboard resizing
/*	if (utm.Android) {
		aHeight = [];
		self.addEventListener('postlayout',function(e){
			aHeight.push(self.rect.height);
			if (self.rect.height === (Math.max.apply(Math, aHeight))) {
				settingsView.setHeight(utm.viewableArea - (37*utm.sizeMultiplier) - ((40*2*utm.sizeMultiplier)+30));
			} else {
				settingsView.setHeight(utm.viewableArea - (37*utm.sizeMultiplier) - ((40*2*utm.sizeMultiplier)+30) - utm.keyboardHeight);
			}
		});
	} */

	self.addEventListener('close', function(e) {
		Ti.App.removeEventListener('orientdisplay', updateDisplay);
	});
	
	return self;
};

module.exports = MemberGroupDetailWin;

