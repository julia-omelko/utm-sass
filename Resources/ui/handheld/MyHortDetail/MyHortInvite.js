function inviteMyHortView(_myHortInfo, utm, _win) {
	
	var CheckBoxField = require('ui/common/baseui/CheckBox');
	var needsAuth = false;
	var supportsAuthAPI = (Ti.version >= '2.1.3');
	var primaryMemberNickName = '';
	var primaryMember = getPrimaryMember(_myHortInfo.Members);
	var primaryMemberNickName = primaryMember.NickName;

	if (Titanium.Platform.name == 'iPhone OS') {
		needsAuth = isiOS6Plus();
	}
	
	
	var self = Ti.UI.createView({
		contentWidth: Ti.UI.FILL,
		contentHeight: Ti.UI.SIZE,
		layout:'vertical',
		visible: false
	});

	var titleLbl = Ti.UI.createLabel({
		text : 'Invite Users',// to ' + _myHortInfo.FriendlyName + ' Group',
		top : 5,
		color : utm.color_org,
		height : Ti.UI.SIZE,
		font : {
			fontWeight : 'bold',
			fontSize : '16dp'
		}
	});
	self.add(titleLbl);

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
	self.add(inviteMessageLabel);

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
		value : 'You have been invited to join the MyHort ' + _myHortInfo.FriendlyName + ' which is owned by ' + primaryMemberNickName + '. Please use the provided link to accept.'
	});
	self.add(inviteMessageField);

	var emailBox = Ti.UI.createView({
		layout : 'horizontal',
		height : '50dp',
		left : 5
	});
	self.add(emailBox);

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
		
		if(utm.iPhone || utm.iPad ){
				Titanium.Contacts.showContacts(parms);
		}else{
			Titanium.Contacts.showContacts({
		        selectedPerson: function(e) {
		        	
		        		if(e.person.email == undefined) {
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
                		
                		if(emailChoices.length==0){
                			alert('No emails found for selected contact.');
                			return;
                		}
                
	            		var optionsDialogOpts = {
					    options:emailChoices,
					    destructive:1,
					    cancel:2,
					    title:'Please select an email!'
					};
					 
					var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);						 
					dialog.show();
					 
					// DIALOG EVENT CLICK
					dialog.addEventListener('click',function(e){
						if(emailsField.value===''){
							emailsField.value =  emailChoices[e.index];
						}else{
							emailsField.value = emailsField.value + ',' + emailChoices[e.index];
						}
					});
	            }

	        });
		}
	
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
		autocorrect: false,
		//suppressReturn: true
	});
	self.add(emailsField);
	
	emailsField.addEventListener('return', function() {
		if (emailsField.getValue().substring(emailsField.getValue().length-1) !== ',') {
			emailsField.setValue(emailsField.getValue()+',');
			emailsField.setSelection(emailsField.getValue().length,emailsField.getValue().length);
		} else {
			emailsField.setValue(emailsField.getValue().substring(0,emailsField.getValue().length-1));
			emailsField.blur();
		}
	});
	
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
	self.add(typeBox);
	

	var inviteButton = Ti.UI.createButton({
		title : 'Send',
		top : 5,
		enabled : false
	});
	self.add(inviteButton);

	inviteButton.addEventListener('click', function() {
		inviteMyHort();
	});


	// ##################### CREATE MyHort #####################
	function inviteMyHort() {
		inviteButton.enabled=false;
		var invalidEmail = validateEmails(emailsField.value);
		if(invalidEmail !=''){
			alert(invalidEmail + ' is not a valid email - please update and try again.');
			return;
		}
		
		utm.setActivityIndicator(_win , 'Inviting New MyHort Members...');
		
		var inviteMyHortReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				utm.setActivityIndicator(_win , '');
				inviteMyHortReq=null;
				emailsField.setValue('');
				alert('Your invitation has been sent.');
			},
			onerror : function(e) {
				utm.setActivityIndicator(_win , '');
				inviteButton.enabled=true;
				utm.handleError(e, this.status, this.responseText);
				inviteMyHortReq=null;
			}
		});
		
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
		
		//RE #585 - MyHort invitation email keyboard
		//RE #607 - Comma at end of invite email causes error
		//Cleanup the email list, remove trailing spaces and IF a last comma remove it
		var emailInviteList=emailsField.getValue();
		emailInviteList=emailInviteList.trim();
		emailInviteList = emailInviteList.replace(/,$/,""); 
		emailInviteList=emailInviteList.trim();
		emailInviteList = emailInviteList.replace(/,$/,""); //just incase 2nd comma
		emailInviteList=emailInviteList.trim(); //just incase another space
			
		var myHortInviteModel = {
			MyHortInfo : _myHortInfo,
			UsersToInvite : emailInviteList,
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
			
			 if(emailList[i].trim() !='' && reg.test(emailList[i].trim()) == false) {
			 	return emailList[i].trim();
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

	return self;

}

module.exports = inviteMyHortView;
