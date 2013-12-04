function myHortMyInfoView(_myHortInfo, utm, _isOwner, _win) {
	
	var InputField = require('ui/common/baseui/InputField');
	var Facebook = require('facebook');
	var social = require("lib/social");
	utm.facebookToken = '';
	var twitter = social.create({
		site : 'Twitter', // <-- this example is for Twitter. I'll expand this to other sites in the future.
		consumerKey : utm.twitterConsumerKey, // <--- you'll want to replace this
		consumerSecret : utm.twitterConsumerSecret // <--- and this with your own keys!
		,utmSpace:utm
	});
	var twitterEnabledForUser = false;
	var facebookEnabledForUser = false;
	Facebook.appid = utm.facebookAppId;
	Facebook.permissions = ['publish_stream', 'read_stream'];
	utm.MyHortDetails = false;
		
	var self = Ti.UI.createView({
		contentWidth: Ti.UI.FILL,
		contentHeight: Ti.UI.SIZE,
		layout:'vertical',
		visible: false
	});

	var titleLbl = Ti.UI.createLabel({
		text : 'Your Contact Information',
		top : 10,
		color : utm.color_org,
		height : Ti.UI.SIZE,
		font : {
			fontWeight : 'bold',
			fontSize : '16dp'
		}
	});
	self.add(titleLbl);

//----------Email--------------------
	var email = new InputField(utm,'Email', 80, _myHortInfo.Email, '210dp', Ti.UI.KEYBOARD_EMAIL);
	self.add(email);
	email.addEventListener("change", checkIfFormIsDirty);
	
		
	//----------Mobile # --------------------
	var mobile = new InputField(utm,'Mobile', 80, _myHortInfo.Mobile, '210dp', Ti.UI.KEYBOARD_NUMBERS_PUNCTUATION  );
	self.add(mobile);
	mobile.addEventListener("change", checkIfFormIsDirty);


	//----------Twitter On off Switch--------------------
	var twitterGroup = Ti.UI.createView({
		layout : 'horizontal',
		width : '100%',
		top : 3,
		left : 8,
		height : '50dp'
	});
	self.add(twitterGroup);
	
	var twitterLabel = Ti.UI.createLabel({
		text : 'Twitter',
		font : {
			fontSize : '14dp',
			fontWeight : 'bold'
		},
		width : '80dp',
		color : '#000',
		textAlign : 'left'
	});
	twitterGroup.add(twitterLabel);

	var twitterSwitch = Ti.UI.createSwitch({
		value : ((_myHortInfo.TwitterToken != '' && _myHortInfo.TwitterToken != null) ? true : false),
		enabled : true
	});
	twitterGroup.add(twitterSwitch);
	

	twitterSwitch.addEventListener('change', function(e) {
		if (e.value) {
			if (!twitter.isAuthorized()) {
				authTwitter();
			}
			twitterEnabledForUser = true;
		} else {
			//twitter.deauthorize(); NOTE this deauthrizes for ALL MYHORTS - dont want to do that uless its the only myhort with twitter set.

			var dialog = Ti.UI.createAlertDialog({
				cancel : 1,
				buttonNames : ['Deauthorize',  L('cancel')],
				message : 'You are about to Deauthorize the YouThisMe application for this MyHort ',
				title : 'Confirm Deauthorize'
			});
			dialog.addEventListener('click', function(e) {
				if (e.index === 0) {
					utm.TwitterToken = '';
					utm.TwitterTokenSecret = '';
					twitter.deauthorize();
				/*} else if (e.index === 1) {
					twitter.deauthorize();*/
				} else if (e.index === 2) {
					Ti.API.info('The cancel button was clicked');
				}
			});
			dialog.show();

		}
		checkIfFormIsDirty();
	});


	//----------Facebook--------------------
	var faceBookGroup = Ti.UI.createView({
		layout : 'horizontal',
		width : '100%',
		top : 3,
		left : 8,
		height : '50dp',
		visible : true
	});
	self.add(faceBookGroup);

	var faceBookLabel = Ti.UI.createLabel({
		text : 'Facebook',
		font : {
			fontSize : '14dp',
			fontWeight : 'bold'
		},
		width : '80dp',
		color : '#000',
		textAlign : 'left'
	});
	faceBookGroup.add(faceBookLabel);

	var facebookSwitch = Ti.UI.createSwitch({
		value : ((_myHortInfo.FaceBook != '' & _myHortInfo.FaceBook != null) ? true : false),
		enabled : true
	});
	faceBookGroup.add(facebookSwitch);

	facebookSwitch.addEventListener('change', function(e) {
		if (e.value) {
			Facebook.setForceDialogAuth(true);
			Facebook.authorize();
			facebookEnabledForUser = true;
		} else {
			var dialog = Ti.UI.createAlertDialog({
				cancel : 1,
				buttonNames : ['Deauthorize', L('cancel')],
				message : 'You are about Deauthorize the YouThisMe application for this MyHort ',
				title : 'Deauthorize Options'
			});
			dialog.addEventListener('click', function(e) {
				if (e.index === 0) {
					Facebook.logout();
					//Facebook.setForceDialogAuth(false);
				/*} else if (e.index === 1) {
					Facebook.logout();
					//Facebook.setForceDialogAuth(false);
					*/
				} else if (e.index === 2) {
					Ti.API.info('The cancel button was clicked');
				}
			});
			dialog.show();
		}
		checkIfFormIsDirty();
	});

	Facebook.addEventListener('login', function(e) {
		if (e.success) {
			utm.facebookToken = Facebook.getAccessToken();
		} else if (e.error) {
			utm.facebookToken == '';
			//alert(e.error);
			utm.log(e.error);
		} else if (e.cancelled) {
			// alert("Canceled");
		}
	});
	
	//----------Sign UTM Messaged--------------------
	var signMessagesGroup = Ti.UI.createView({
		layout : 'horizontal',
		width : '100%',
		top : 3,
		left : 8,
		height : '50dp',
		visible : true
	});
	self.add(signMessagesGroup);

	var signMessagesLabel = Ti.UI.createLabel({
		text : 'Sign Messages',
		font : {
			fontSize : '14dp',
			fontWeight : 'bold'
		},
		color : '#000',
		width : '80dp',
		textAlign : 'left'
	});
	signMessagesGroup.add(signMessagesLabel);

	var signMessagesSwitch = Ti.UI.createSwitch({
		value : (utm.myHortDetails.IsOwner ? utm.myHortDetails.PrimaryUser.AddNicknameToUtms : utm.myHortDetails.MyInformation.AddNicknameToUtms),
		enabled : true
	});
	signMessagesGroup.add(signMessagesSwitch);
	signMessagesSwitch.addEventListener("change", checkIfFormIsDirty);

//----------Pre/Post Key Word # --------------------
// Business rule is that only owner of MyHort can  set a prefix or postfix
// Keep isOwner check after environment check is removed
	if(_isOwner){
	
		var keyWordPreGroup = Ti.UI.createView({
			layout : 'horizontal',
			width : '100%',
			top : 3,
			left : 8,
			height : '60dp',
			visible : true
		});
		self.add(keyWordPreGroup);
		
		var keyWordPreLabel = Ti.UI.createLabel({
			text : 'Key Word Before Message',
			font : {
				fontSize : '14dp',
				fontWeight : 'bold'
			},
			width : '80dp',
			color : '#000',
			textAlign : 'left'
		});
		keyWordPreGroup.add(keyWordPreLabel);
		
		var keyWordPre = Ti.UI.createTextField({
			value: utm.myHortDetails.myHort.Prefix,
			maxLength:16,
			width:'220dp',
			left:keyWordPreLabel+8,
			color:utm.textFieldColor,	
			height:'40dp',
			borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
			borderRadius :5,
			suppressChangeEvent: false,
			clear: function() { if( this.value != '' ) { 
									this.suppressChangeEvent = true;
									this.value = ''; 
									checkIfFormIsDirty();
								} 
							  }
		});
		keyWordPreGroup.add(keyWordPre);
		
		keyWordPre.addEventListener('change', function(){ 	
			if(!keyWordPre.suppressChangeEvent) {
				keyWordPost.clear();
			} else {
				keyWordPre.suppressChangeEvent = false;
			}
			
			checkIfFormIsDirty();		
		});
		
		var orLabel = Ti.UI.createLabel({
			text : ' - OR - ',
			font : {
				fontSize : '14dp',
				fontWeight : 'bold'
			},
			width : '80dp',
			color : '#000',
			textAlign : 'left'
		});
		self.add(orLabel);
		
		var keyWordPostGroup = Ti.UI.createView({
			layout : 'horizontal',
			width : '100%',
			top : 3,
			left : 8,
			height : '60dp',
			visible : true
		});
		self.add(keyWordPostGroup);
		
		var keyWordPostLabel = Ti.UI.createLabel({
			text : 'Key Word After Message',
			font : {
				fontSize : '14dp',
				fontWeight : 'bold'
			},
			width : '80dp',
			color : '#000',
			textAlign : 'left'
		});
		keyWordPostGroup.add(keyWordPostLabel);
		
		var keyWordPost = Ti.UI.createTextField({
			value: utm.myHortDetails.myHort.Postfix,
			maxLength:16,
			width:'220dp',
			left:keyWordPostLabel+8,
			color:utm.textFieldColor,	
			height:'40dp',
			borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
			borderRadius :5,
			suppressChangeEvent: false,
			clear: function() { if( this.value != '' ) { 
									this.suppressChangeEvent = true;
									this.value = ''; 
									checkIfFormIsDirty();
								} 
							  }
		});
		keyWordPostGroup.add(keyWordPost);
		
		keyWordPost.addEventListener('change', function(){ 
			if(!keyWordPost.suppressChangeEvent) {
				keyWordPre.clear();	
			} else {
				keyWordPost.suppressChangeEvent = false;
			}
			
			checkIfFormIsDirty();
	
		 });
	}

	var saveButton = Ti.UI.createButton({
		title : 'Save',
		top : 3,
		height:'40dp',
		width:'100dp',
		enabled: false
	});
	saveButton.addEventListener('click', function() {
		if(checkAtLeastOneTypeOfMessageSet()){
			updateMyHortData();
			utm.navController.close(utm.myHortDetailWindow);
		}
	});
	self.add(saveButton);
			
			
	//----------Delete MyHort Button --------------------		
	var deleteButton = Ti.UI.createButton({
		title : _isOwner ? 'Delete' : 'Leave this MyHort',
		top : 20,
		height:'40dp',
		width: Ti.UI.SIZE,
		//backgroundColor:'red',
		enabled: true
	});
	
	deleteButton.addEventListener('click', function() {
		if (_isOwner) {
			var dialog = Ti.UI.createAlertDialog({
				cancel : 1,
				buttonNames : ['Yes', L('cancel')],
				message : 'Delete this MyHort will delete all your information in this MyHort - do you want to continue? ',
				title : 'Confirm Delete',
				myHortId : _myHortInfo.MyHortId
			});
			dialog.addEventListener('click', function(e) {
				if (e.index === 0) {
					deleteMyHort(e.source.myHortId);
				} 
			});
			dialog.show();
		} else {
			var dialog = Ti.UI.createAlertDialog({
				cancel : 1,
				buttonNames : ['Yes', L('cancel')],
				message : 'You are about to leave this MyHort - do you want to continue?',
				title : 'Confirm',
				myHortId : _myHortInfo.MyHortId
			});
			dialog.addEventListener('click', function(e) {
				if (e.index === 0) {
					leaveMyHort(e.source.myHortId);
				} 
			});
			dialog.show();
		}
	});
	self.add(deleteButton);	


	function isEmpty(value){
  		return (value == null || value.length === 0);
	}
	
	function checkAtLeastOneTypeOfMessageSet(){
		
		if(email.getValue() != '') return true;
		if(mobile.getValue() != '') return true;
		if(facebookSwitch.getValue()) return true;
		if(twitterSwitch.getValue()) return true; 
				
		alert('You must choose at least one of the message type to send to contacts in this MyHort');		
		return false;	
	}


	function checkIfFormIsDirty( ) {
		var isDirty = false;
		var currentDetails = utm.myHortDetails;
		var data = {};
		var formData = {};
		
		if(currentDetails == undefined) return;	
		
		formData.twitter = twitterSwitch.getValue();
		formData.facebook = facebookSwitch.getValue();
		formData.email = email.getValue();
		formData.mobile = mobile.getValue();
		formData.signMessage = signMessagesSwitch.getValue();
		
		if( _isOwner ) {
			data.twitter = !isEmpty(currentDetails.PrimaryUser.TwitterToken);
			data.facebook = !isEmpty(currentDetails.PrimaryUser.FaceBook);
			data.email = currentDetails.PrimaryUser.Email;
			(currentDetails.PrimaryUser.Mobile == null) ? data.mobile = "" : data.mobile = currentDetails.PrimaryUser.Mobile;
			data.signMessage = currentDetails.PrimaryUser.AddNicknameToUtms;
			(currentDetails.myHort.Prefix == null) ? data.prefix = "" : data.prefix = currentDetails.myHort.Prefix;
			(currentDetails.myHort.Postfix == null) ? data.postfix = "" : data.postfix = currentDetails.myHort.Postfix;

			formData.prefix = keyWordPre.value;
			formData.postfix = keyWordPost.value;
		}	
		else {
			data.twitter = !isEmpty(currentDetails.MyInformation.TwitterToken);
			data.facebook = !isEmpty(currentDetails.MyInformation.FaceBook);
			data.email = currentDetails.MyInformation.Email;
			(currentDetails.MyInformation.Mobile == null) ? data.mobile = "" : data.mobile = currentDetails.MyInformation.Mobile;
			data.signMessage = currentDetails.MyInformation.AddNicknameToUtms;
			
		}
		
		if (JSON.stringify(data) !== JSON.stringify(formData)) { isDirty = true; }
		saveButton.enabled = isDirty;
		
		return isDirty;
	}
	
	function updateMyHortData() {
		saveButton.enabled = false;
		utm.setActivityIndicator(_win , 'Update MyHort...');

		utm.curMyHortDetails.Email = email.getValue();
		utm.curMyHortDetails.Mobile = mobile.getValue();
	
	    utm.curMyHortDetails.AddNicknameToUtms = signMessagesSwitch.getValue(); 	

		if (twitterSwitch.getValue()) {
			if (!twitter.isAuthorized()) {
				authTwitter();
			}
			twitterEnabledForUser = true;
			utm.curMyHortDetails.TwitterToken = utm.TwitterToken;
			utm.curMyHortDetails.TwitterSecret = utm.TwitterTokenSecret;


		} else {
			if (twitterEnabledForUser) {
				utm.curMyHortDetails.TwitterToken = '';
				utm.curMyHortDetails.TwitterSecret = '';
			}
		}

		if (facebookSwitch.getValue()) {
			utm.curMyHortDetails.FaceBook = Facebook.getAccessToken();
		} else {
			utm.curMyHortDetails.FaceBook = '';
		}

		if (utm.myHortDetails.IsOwner) {
			utm.myHortDetails.PrimaryUser = utm.curMyHortDetails;
			utm.myHortDetails.MyInformation = '';

			utm.myHortDetails.myHort.Prefix=keyWordPre.value;
			utm.myHortDetails.myHort.Postfix=keyWordPost.value;
			
		} else {
			utm.myHortDetails.MyInformation = utm.curMyHortDetails;
			utm.myHortDetails.PrimaryUser = '';
		}

		updateMyHortDetailReq.open("POST", utm.serviceUrl + "MyHort/UpdateMyHortDetails");
		updateMyHortDetailReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		updateMyHortDetailReq.setRequestHeader('Authorization-Token', utm.AuthToken);

		updateMyHortDetailReq.send(JSON.stringify(utm.myHortDetails));
	}
	
	var updateMyHortDetailReq = Ti.Network.createHTTPClient({
		validatesSecureCertificate : utm.validatesSecureCertificate,
		onload : function() {
			
			//saveButton.enabled = true;
			utm.setActivityIndicator(_win , '');

			var json = this.responseData;
			if (this.status == 200) {
				utm.setActivityIndicator(_win , 'Update Complete');
				Ti.App.fireEvent("app:showMyHortWindow", {});
				utm.setActivityIndicator(_win , '');
				//updateOwnerMemberDetails();
				//loadMyHortDetail();
			
			} else if (this.status == 400) {
				utm.recordError('error');
			} else {
				utm.recordError(utm.myHortDetails.MyHort);
			}

		},
		onerror : function(e) {
			utm.setActivityIndicator(_win , '');
			if (this.status != undefined && this.status === 404) {
				alert('MyHort Update Failed');
				Ti.App.fireEvent('app:refreshMyHorts', {
					showProgress : false
				});
			} else {
				utm.handleError(e, this.status, this.responseText);
			}
			//saveButton.enabled = true;
			utm.setActivityIndicator(_win , '');
		},
		timeout : utm.netTimeout
	});
	
	function updateOwnerMemberDetails(){
		for (x=0;x< _myHortInfo.Members.length;x++){
			if (_myHortInfo.Members[x].MemberType == 'Primary'){
				_myHortInfo.Members[x].HasEmail = email.getValue() !='';
				_myHortInfo.Members[x].HasMobile = mobile.getValue() !='';
				_myHortInfo.Members[x].HasTwitter = twitterSwitch.getValue();
				_myHortInfo.Members[x].HasFaceBook = facebookSwitch.getValue();
				break;
			}
		}
		if( isOwner ) {
			_myHortInfo.Prefix = keyWordPre.value;
			_myHortInfo.Postfix = keyWordPost.value;
		}
	}
	
	function deleteMyHort(myHortId) {
		utm.log('Deleting MyHort ' + myHortId);
		utm.setActivityIndicator(_win , 'Deleting...');
		var deleteMyHortDetailReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				utm.setActivityIndicator(_win , '');
				deleteMyHortDetailReq = null;
				updateMyHortData();
				utm.navController.close(utm.myHortDetailWindow);
			},
			onerror : function() {
				utm.setActivityIndicator(_win , '');
				deleteMyHortDetailReq = null;
				utm.navController.close(utm.myHortDetailWindow);
			}
		});
		
		deleteMyHortDetailReq.open("GET", utm.serviceUrl + "MyHort/DeleteUsersMyHort?myhortId=" + myHortId);
		deleteMyHortDetailReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		deleteMyHortDetailReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		deleteMyHortDetailReq.send();
	}

	
	function leaveMyHort(myHortId) {
		utm.log('Leaving MyHort ' + myHortId);
		utm.setActivityIndicator(_win , 'Leaving MyHort...');
		var leaveMyHortDetailReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				utm.setActivityIndicator(_win , '');
				leaveMyHortDetailReq = null;
				updateMyHortData();
				utm.navController.close(utm.myHortDetailWindow);
			},
			onerror : function(e) {
				utm.setActivityIndicator(_win , '');
				leaveMyHortDetailReq = null;
				utm.navController.close(utm.myHortDetailWindow);
			}
		});
		leaveMyHortDetailReq.open("POST", utm.serviceUrl + "MyHort/LeaveMyHort?myHortId=" + myHortId);
		leaveMyHortDetailReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		leaveMyHortDetailReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		leaveMyHortDetailReq.send();
	}
	
	return self;
}

module.exports = myHortMyInfoView;
