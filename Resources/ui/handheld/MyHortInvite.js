function inviteMyHortWindow(myHortInfo, utm) {
	var CheckBoxField = require('ui/common/baseui/CheckBox');
	var needsAuth = false;
	var supportsAuthAPI = (Ti.version >= '2.1.3');
	var primaryMemberNickName = '';

	function init() {
		var primaryMember = getPrimaryMember(myHortInfo.Members);
		primaryMemberNickName = primaryMember.NickName;
	}

	init();

	if (Titanium.Platform.name == 'iPhone OS') {
		needsAuth = isiOS6Plus();
	}
	
	if(utm.iPhone || utm.iPad ){	

		var myHortInviteWindow = Ti.UI.createWindow({
			backgroundColor:utm.backgroundColor
			,barColor:utm.barColor,
			layout : 'vertical',
			backButtonTitle:'MyHort Info'
		});

	}else	if(utm.Android){
		
		//create the base screen and hid the Android navbar
		var myHortInviteWindow = Titanium.UI.createWindow({
		    layout : 'vertical',
		 	backgroundColor : utm.backgroundColor,
		    navBarHidden:true
		});
		
		//create a navbar for Android
		var my_navbar = Ti.UI.createLabel({
		    height : 50,
		    width : '100%',
		    backgroundColor : utm.androidBarColor,
		    color : utm.backgroundColor,
		    text:'',
		    top:0
		});
 
 		//add the navbar to the screen
		myHortInviteWindow.add(my_navbar);
	}
	
	
	var scrollingView = Ti.UI.createScrollView({
		showVerticalScrollIndicator : true,
		showHorizontalScrollIndicator : false
	});
	myHortInviteWindow.add(scrollingView);

	var view = Ti.UI.createView({
		height :1500,
		layout : 'vertical'
	});

	scrollingView.add(view);

	var titleLbl = Ti.UI.createLabel({
		text : 'Invite users to ' + myHortInfo.FriendlyName + ' Group',
		top : 10,
		color : utm.color_org,
		height : 60,
		font : {
			fontWeight : 'bold',
			fontSize : '16dp'
		}
	});
	view.add(titleLbl);

	var inviteMessageLabel = Ti.UI.createLabel({
		text : 'Invite message for e-mail',
		top : 10,
		left : 5,
		color:utm.textColor,
		font : {
			fontWeight : 'bold',
			fontSize : '14dp'			
		}
	});
	view.add(inviteMessageLabel);

	var inviteMessageField = Ti.UI.createTextArea({
		borderWidth : 2,
		borderColor : '#bbb',
		borderRadius : 5,
		color : utm.textFieldColor,
		textAlign : 'left',
		top : 5,
		font: {fontSize:'16dp'},
		height : 'auto',
		width : utm.SCREEN_WIDTH - 10,
		height : utm.SCREEN_HEIGHT - (utm.SCREEN_HEIGHT / 1.2),
		value : 'You have been invited to join the MyHort ' + myHortInfo.FriendlyName + ' which is owned by ' + primaryMemberNickName + '. Please use the provided link to accept.'
	});
	view.add(inviteMessageField);

	var emailBox = Ti.UI.createView({
		layout : 'horizontal',
		height : '50dp',
		left : 5
	});
	view.add(emailBox);

	var emailLabel = Ti.UI.createLabel({
		text : 'Email address to send invites to',
		top : 25,
		color:utm.textColor,
		font : {
			fontWeight : 'bold',
			fontSize : '14dp'
		}
	});
	emailBox.add(emailLabel);

	//############ Choose Contacts Buttons ################
	var chooseButton = Ti.UI.createButton({
		//title : 'Choose',
		backgroundImage : '/images/iosContacts.jpeg',
		width : '43dp',
		height : '43dp',
		enabled : true,
		top : 5,
		left : 10
	});
	emailBox.add(chooseButton);

	//utm.log(Ti.Contacts)
	//utm.log(Ti.Contacts.contactsAuthorization );

	var values = {
		cancel : function() {
			info.text = 'Cancelled';
		}
	};
	chooseButton.addEventListener('click', function() {
		Ti.Contacts.requestAuthorization(requestPermission);
	});

	var getContacts = function() {
		var parms = {
			animated : true,
			fields : ['email'],
			selectedProperty : function(e) {
				if (emailsField.value.length > 0) {
					emailsField.value = emailsField.value + ',' + e.value;
				} else {
					emailsField.value = e.value;
				}
				inviteButton.enabled = true;
			}
		};
		Titanium.Contacts.showContacts(parms);
	};
	var addressBookDisallowed = function() {
		alert('Address book access is not allowed');
	};

	//############ Enter Emails Text Area ################
	var emailsField = Ti.UI.createTextArea({
		borderWidth : 2,
		borderColor : '#bbb',
		borderRadius : 5,
		color : utm.textFieldColor,
		textAlign : 'left',
		top : 5,
		height : 'auto',
		width : utm.SCREEN_WIDTH - 10,
		height : '50dp',
		font: {fontSize:'16dp'},
		keyboardType:Ti.UI.KEYBOARD_EMAIL,
		autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
		autocorrect: false
	});
	view.add(emailsField);

	emailsField.addEventListener('change', function() {
		if (emailsField.value.length > 0) {
			inviteButton.enabled = true;
		} else {
			inviteButton.enabled = false;
		}
	});

	//############ Choose Type ################
	var typeBox = Ti.UI.createView({
		layout : 'horizontal',
		height : '30dp',
		left : 5,
		top : 10
	});
	var typeLabel = Ti.UI.createLabel({
		text : 'Invisible to Others',
		color:utm.textColor,
		font : {
			fontWeight : 'bold',
			fontSize : '14dp'
		},
		width : '150dp'
	});
	typeBox.add(typeLabel);

	if(utm.iPhone || utm.iPad){
		var typeCheckBox = new CheckBoxField(true);
	};
	
	if(utm.Android){
		var typeCheckBox = Ti.UI.createSwitch({
	  	style: Ti.UI.Android.SWITCH_STYLE_CHECKBOX,
	  	value:true,
	  	width: '40dp'
		});
	};
	
	typeBox.add(typeCheckBox);
	view.add(typeBox);
	

	//############ Buttons ################
	var buttonView = Ti.UI.createView({
		layout : 'horizontal',
		width : '100%',
		top : 5,
		left : 5
	});
	view.add(buttonView);

	var inviteButton = Ti.UI.createButton({
		title : 'Send',
		enabled : false
	});
	buttonView.add(inviteButton);

	inviteButton.addEventListener('click', function() {
		inviteMyHort();
	});
	var closeButton = Ti.UI.createButton({
		title : L('cancel'),
		left : 10
	});
	closeButton.addEventListener('click', function() {
		myHortInviteWindow.close();
	});
	buttonView.add(closeButton);

	// ##################### CREATE MyHort #####################
	function inviteMyHort() {
		inviteButton.enabled=false;
		var invalidEmail = validateEmails(emailsField.value);
		if(invalidEmail !=''){
			alert(invalidEmail + ' is not a valid email - please update and try again.');
			return;
		}
		
		utm.setActivityIndicator('Inviting New MyHort Members...');
		inviteMyHortReq.open("POST", utm.serviceUrl + "MyHort/Invite");
		inviteMyHortReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		inviteMyHortReq.setRequestHeader('Authorization-Token', utm.AuthToken);

		if(utm.iPhone || utm.iPad){
			if(typeCheckBox.isChecked())
				var memberType = 'Invisible';
			else 
				var memberType = 'Secondary';
		}

		if(utm.Android){
			if(typeCheckBox.value)
				var memberType = 'Invisible';
			else 
				var memberType = 'Secondary';
		}
			
		var myHortInviteModel = {
			MyHortInfo : myHortInfo,
			UsersToInvite : emailsField.value,
			InviteMessage : inviteMessageField.value,
			FromNickName : primaryMemberNickName,
			MemberType : memberType,
			InviteCode : 'autogen'
		};

		inviteMyHortReq.send(JSON.stringify(myHortInviteModel));
	}

	function validateEmails(_emails) {
		var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;   
		var emailList = _emails.split(',');
		
		for(i=0;i<emailList.length; i++ ){
			
			 if(reg.test(emailList[i]) == false) {
			 	return emailList[i];
			 }			
		}
		return '';
	}

	function getPrimaryMember(_members) {
		for ( ii = 0; ii < _members.length; ii++) {
			if (_members[ii].MemberType === 'Primary') {
				return _members[ii];
			}
		}
	}

	var inviteMyHortReq = Ti.Network.createHTTPClient({
		validatesSecureCertificate : utm.validatesSecureCertificate,
		onload : function() {
			utm.setActivityIndicator('');
			utm.navController.close(myHortInviteWindow);
		},
		onerror : function(e) {
			inviteButton.enabled=true;
			utm.handleError(e, this.status, this.responseText);
		}
	});

	var requestPermission = function(e) {
		var privs = Ti.Contacts.contactsAuthorization;
		if (privs === Ti.Contacts.AUTHORIZATION_AUTHORIZED) {
			//alert('here');
			getContacts();
			//	performAddressBookFunction();
		} else {
			utm.log(privs);
			addressBookDisallowed();
			// if (privs===Ti.Contacts.AUTHORIZATION_RESTRICTED){
			// /b1.visible = false;
			// b1.enabled = false;
			// infoLabel.visible = true;
			// infoLabel.text ='Contact authorization restricted. User can not grant permission. '
			// }
			// else if (privs===Ti.Contacts.AUTHORIZATION_DENIED){
			// b1.visible = false;
			// b1.enabled = false;
			// infoLabel.visible = true;
			// infoLabel.text ='Contact authorization denied. User has disallowed contacts use.'
			// }
			// else if (privs===Ti.Contacts.AUTHORIZATION_UNKNOWN){
			// infoLabel.text ='Contact authorization unknown. Request permission from user.'
			// infoLabel.visible = true;
			// b1.visible = true;
			// b1.enabled = true;
			// }
			// else {
			// infoLabel.text = 'Got unknown value for Ti.Contacts.contactsAuthorization';
			// infoLabel.visible = true;
			// b1.visible = false;
			// b1.enabled = false;
			//}
		}

	};
	function isiOS6Plus() {
		// add iphone specific tests
		if (Titanium.Platform.name == 'iPhone OS') {
			var version = Titanium.Platform.version.split(".");
			var major = parseInt(version[0], 10);

			// can only test this support on a 3.2+ device
			if (major >= 6) {
				return true;
			}
		}
		return false;

	}

	return myHortInviteWindow;

}

module.exports = inviteMyHortWindow;
