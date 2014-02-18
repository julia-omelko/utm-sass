var InviteMembersWin = function(_tabGroup,_myHortInfo) {
	var _myHortId = utm.User.UserProfile.PrimaryMyHort;
	var primaryMemberNickName = '';
	var primaryMember = getPrimaryMember(_myHortInfo.myHort.Members);
	var primaryMemberNickName = primaryMember.NickName;
	
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Invite', false);

	var BackButton = require('ui/common/baseui/BackButton');
	var backButton = new BackButton(self);
	self.setLeftNavButton(backButton);
	
	var scrollingView = Ti.UI.createScrollView({
		width: '100%',
		height: utm.viewableArea,
		showVerticalScrollIndicator: true,
		contentHeight: 'auto',
		layout: 'vertical',
		top: utm.viewableTop
	});
	self.add(scrollingView);
	

	/*var messageHeader = Ti.UI.createLabel({
		text: 'Invite message:',
		top: 25,
		left: 25,
		font: {fontFamily: utm.fontFamily, fontSize: 18},
		color: utm.barColor		
	});
	scrollingView.add(messageHeader);
	
	var inviteMessageField = Ti.UI.createTextArea({
		value: 'You have been invited to join a group on UTM.',
		color: utm.textFieldColor,		
		width: Ti.Platform.displayCaps.platformWidth-50,
		height: Ti.UI.SIZE,
		keyboardType: Ti.UI.KEYBOARD_DEFAULT,
		returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
		top: 15,
		borderColor: '#D4D4D4',
		borderRadius: 2,
		borderWidth: 1,
		backgroundColor: 'white',
		paddingLeft: 7,
		font: {fontFamily: utm.fontFamily, fontSize: 16},
	});
	var messageFocued = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: 2,
		backgroundColor: utm.barColor,
		bottom: 0
	});
	inviteMessageField.addEventListener('focus', function() {
		inviteMessageField.add(messageFocued);
	});
	inviteMessageField.addEventListener('blur', function() { 
		inviteMessageField.remove(messageFocued);
	});
	var messageMinHeight = Ti.UI.createView({
		width: 1,
		height: 60,
		left: 0
	});
	inviteMessageField.add(messageMinHeight);
	scrollingView.add(inviteMessageField);*/

	var inviteHeader = Ti.UI.createLabel({
		text: 'Email to invite:',
		top: 25,
		left: 25,
		font: {fontFamily: utm.fontFamily, fontSize: '18dp'},
		color: utm.barColor		
	});
	scrollingView.add(inviteHeader);
	
	
	var emailView = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: Ti.UI.SIZE,
		top: 15
	});
	scrollingView.add(emailView);

	var emailField = Ti.UI.createTextField({
		left: 25,
		color: utm.textFieldColor,		
		width: Ti.Platform.displayCaps.platformWidth-((30*utm.sizeMultiplier)+50),
		height: (utm.Android ? Ti.UI.SIZE : 30),
		keyboardType: Ti.UI.KEYBOARD_EMAIL,
		returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
		borderColor: '#D4D4D4',
		borderRadius: 2,
		borderWidth: 1,
		backgroundColor: 'white',
		paddingLeft: 7,
		font: {fontFamily: utm.fontFamily, fontSize: '16dp'},
	});
	var emailFocued = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: 2,
		backgroundColor: utm.barColor,
		bottom: 0
	});
	emailField.addEventListener('focus', function() {
		emailField.add(emailFocued);
	});
	emailField.addEventListener('blur', function() { 
		emailField.remove(emailFocued);
	});
	emailView.add(emailField);

	var contactButton = Ti.UI.createView({
		height: 30*utm.sizeMultiplier,
		width: 30*utm.sizeMultiplier,
		right: 25,
		backgroundColor: utm.buttonColor,
		borderRadius: 6*utm.sizeMultiplier
	});
	var contactIcon = Ti.UI.createImageView({
		image: '/images/icons/contacts.png',
		height: 22*utm.sizeMultiplier,
		width: 22*utm.sizeMultiplier,
	});
	contactButton.add(contactIcon);
	emailView.add(contactButton);
	contactButton.addEventListener('click', function() {
		Ti.Contacts.requestAuthorization(requestPermission);
	});

	/*var invisibleView = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: Ti.UI.SIZE,
		top: 25
	});
	scrollingView.add(invisibleView);
	var inviteHeader = Ti.UI.createLabel({
		text: 'Invisible to others:',
		left: 25,
		font: {fontFamily: utm.fontFamily, fontSize: 18},
		color: utm.barColor		
	});
	invisibleView.add(inviteHeader);
	var invisibilitySwitch = Ti.UI.createSwitch({
		value: true,
		right: 25
	});
	invisibleView.add(invisibilitySwitch);*/



	var requestPermission = function(e) {
		if (Ti.Contacts.contactsAuthorization === Ti.Contacts.AUTHORIZATION_AUTHORIZED) {
			getContacts();
		} else {
			alert('Address book access is not allowed');
		}
	};
	
	 var getContacts = function() {
		var parms = {
			animated: true,
			fields: ['email'],
			selectedProperty: function(e) {
				if (emailField.value.length > 0) {
					emailField.value = emailField.value + ',' + e.value;
				} else {
					emailField.value = e.value;
				}
			}
		};
		
		if (utm.iPhone || utm.iPad ) {
			Ti.Contacts.showContacts(parms);
		} else {
			Titanium.Contacts.showContacts({
		        selectedPerson: function(e) {
	        		if (e.person.email == undefined) {
	        			alert('Problem getting contacts.');
	        			return;
	        		}
		        	var emails = e.person.email;
					var emailChoices =[];
					var emailTypes = ['home', 'work', 'other'];
					
					for (var emailIndex = 0, emailLen = emailTypes.length; emailIndex < emailLen; emailIndex++) {
					    if (e.person.email[emailTypes[emailIndex]] != undefined && e.person.email[emailTypes[emailIndex]].length > 0) {
					        emailChoices.push( e.person.email[emailTypes[emailIndex]][0]);
					    }                       
					}
                		
            		if (emailChoices.length==0) {
            			alert('No emails found for selected contact.');
            			return;
            		}
                
	            	var optionsDialogOpts = {
					    options:emailChoices,
					    destructive:1,
					    cancel:2,
					    title:'Please select an email.'
					};
					 
					var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);						 
					dialog.show();
					 
					// DIALOG EVENT CLICK
					dialog.addEventListener('click',function(e){
						if (emailField.value === '') {
							emailField.value =  emailChoices[e.index];
						}else{
							emailField.value = emailField.value + ',' + emailChoices[e.index];
						}
					});
	            }
	        });
		}
	};
	
	
	



	var sendBtn = Ti.UI.createButton({
		title: 'Send invite',
		top: 25,
		width: (Ti.Platform.displayCaps.platformWidth-50),
		height: 40*utm.sizeMultiplier,
		borderRadius: 20*utm.sizeMultiplier,
		font:{fontFamily: utm.fontFamily, fontSize:'14dp'},
		backgroundColor: utm.buttonColor,
		color: 'white',
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN
	});	
	sendBtn.addEventListener('click', function() {
		self.showAi();
		inviteMyHort();
	});	
	scrollingView.add(sendBtn);

	function inviteMyHort() {
		var invalidEmail = validateEmails(emailField.value);
		if (invalidEmail !== '') {
			alert(invalidEmail + ' is not a valid email.');
			self.hideAi();
			return;
		}
		
		/*if (invisibilitySwitch.getValue()) {
			var memberType = 'Invisible';
		} else { 
			var memberType = 'Secondary';
		}*/
		
		var emailInviteList = emailField.getValue();
		emailInviteList = emailInviteList.trim();
		emailInviteList = emailInviteList.replace(/,$/,""); 
		emailInviteList = emailInviteList.trim();
		emailInviteList = emailInviteList.replace(/,$/,""); //just incase 2nd comma
		emailInviteList = emailInviteList.trim(); //just incase another space
		
		
		var inviteMyHortReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload: function() {
				emailField.setValue('');
				self.hideAi();
				alert('Your invitation has been sent.');
				inviteMyHortReq = null;
			},
			onerror : function(e) {
				inviteMyHortReq = null;
			},
			timeout:utm.netTimeout
		});
		inviteMyHortReq.open("POST", utm.serviceUrl + "MyHort/Invite");
		inviteMyHortReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		inviteMyHortReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		var myHortInviteModel = {
			MyHortInfo: _myHortInfo.myHort,
			UsersToInvite: emailInviteList,
			//InviteMessage: inviteMessageField.getValue(),
			FromNickName: primaryMemberNickName,
			MemberType: 'Invisible',
			InviteCode: 'autogen'
		};
		inviteMyHortReq.send(JSON.stringify(myHortInviteModel));
	}

	function validateEmails(_emails) {
		var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;   
		var emailList = _emails.split(',');
		
		for (i=0; i<emailList.length; i++ ) {
			 if (emailList[i].trim() !== '' && reg.test(emailList[i].trim()) === false) {
			 	return emailList[i].trim();
			 }			
		}
		return '';
	}

	function getPrimaryMember(_members) {
		for (var ii=0; ii<_members.length; ii++) {
			if (_members[ii].MemberType === 'Primary') {
				return _members[ii];
			}
		}
	}



	return self;
};
module.exports = InviteMembersWin;

