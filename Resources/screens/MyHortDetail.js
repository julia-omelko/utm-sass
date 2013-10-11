function myHortDetail_window(_myHortData, utm, isOwner) {

	var InputField = require('ui/common/baseui/InputField');
	var MyHortMembersWindow = require('ui/handheld/MyHortMembers');
	var MyHortPendingWindow = require('ui/handheld/MyHortPending');
	var MyHortInviteWindow = require('ui/handheld/MyHortInvite');
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
	
	//####################   iOS Button Bar #################### 
	if (utm.iPhone || utm.iPad) {
		var win = Ti.UI.createWindow({
			layout : 'vertical',
			backgroundColor : utm.backgroundColor,
			barColor : utm.barColor,
			title:  _myHortData.FriendlyName
		});

		var view = Ti.UI.createScrollView({
			showVerticalScrollIndicator : true,
			showHorizontalScrollIndicator : false,
			contentWidth:'100%',
			contentHeight:'auto',
			layout:'vertical'
		});
		win.add(view);

		if (isOwner) {
			var buttons = [{
				title : 'Members',
				enabled : false
			}, {
				title : 'Invite',
				enabled : false
			}, {
				title : 'Pending Invites',
				enabled : false
			}];
		} else {
			var buttons = [];
		}

		//-----------------Top Buttons  ----------------------
		var topButtonBar = Titanium.UI.createButtonBar({
			labels : buttons,
			top : 3,
			backgroundColor : '#336699',
			style : Titanium.UI.iPhone.SystemButtonStyle.BAR//,
			//height : isOwner? 40: 0,
			//visible :isOwner
		});

		function enableButtonBar(_enable) {
			if(buttons == undefined) return;
			
			if (isOwner) {
				buttons[0].enabled = _enable;
				buttons[1].enabled = _enable;
				buttons[2].enabled = _enable;
			}
			topButtonBar.labels = buttons;
		}


		view.add(topButtonBar);
	}
	//#################### Android Tab Bar #################### 
	if (utm.Android) {
		//create the base screen and hide the Android navbar
		var win = Titanium.UI.createWindow({
			layout : 'vertical',
			backgroundColor : utm.backgroundColor,
			navBarHidden : true,
			title:  _myHortData.FriendlyName
		});

		//create a navbar for Android
		var my_navbar = Ti.UI.createLabel({
			height : 50,
			width : '100%',
			backgroundColor : utm.androidBarColor,
			text :  _myHortData.FriendlyName,
			color : utm.backgroundColor,
			font : {
				fontSize : utm.androidTitleFontSize,
				fontWeight : utm.androidTitleFontWeight
			},
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			top : 0
		});

		//add the navbar to the screen
		win.add(my_navbar);

		var scrollingView = Ti.UI.createScrollView({
			showVerticalScrollIndicator : true,
			showHorizontalScrollIndicator : false
		});

		win.add(scrollingView);

		var view = Ti.UI.createView({
			height : utm.SCREEN_HEIGHT * 1.25,
			layout : 'vertical'
		});

		scrollingView.add(view);

		var spacer = Math.round(Ti.Platform.displayCaps.platformWidth * 0.33);
		var btnWidth = spacer - 2;
		var btnHeight = 39;
		var leftPos = Math.round((Ti.Platform.displayCaps.platformWidth - btnWidth * 3) * 0.5);

		// TAB BAR aka Button Bar for Android
		var tabBar = Ti.UI.createView({
			width : '100%',
			height : 45,
			left : 0,
			bottom : 0,
			layout : 'horizontal'
		});
		view.add(tabBar);
		// TAB 1
		var tab1 = Ti.UI.createView({
			width : btnWidth,
			height : btnHeight,
			left : 0,
			top : 2,
			backgroundColor : '#336699',
			borderColor : '#000000',
			borderWidth : 1,
			borderRadius : 2
		});
		var tab1Label = Ti.UI.createLabel({
			text : 'Members',
			color : '#FFF'
		});
		tab1.add(tab1Label);
		tabBar.add(tab1);

		// TAB 2
		var tab2 = Ti.UI.createView({
			width : btnWidth,
			height : btnHeight,
			top : 2,
			backgroundColor : '#336699',
			borderColor : '#000000',
			borderWidth : 1
		});
		var tab2Label = Ti.UI.createLabel({
			text : 'Invite',
			color : '#FFF'
		});
		tab2.add(tab2Label);
		tabBar.add(tab2);

		// TAB 3
		var tab3 = Ti.UI.createView({
			width : btnWidth,
			height : btnHeight,
			top : 2,
			backgroundColor : '#336699',
			borderColor : '#000000',
			borderWidth : 1,
			borderRadius : 2
		});
		var tab3Label = Ti.UI.createLabel({
			text : 'Pending Invites',
			color : '#FFF'
		});
		tab3.add(tab3Label);
		tabBar.add(tab3);
		
		//add activityIndicator to view
		if (utm.iPhone || utm.iPad)
			view.add(utm.activityIndicator);
	}
	
	if(!utm.Android) {
		var backButton = Ti.UI.createButton({title: 'MyHorts'});
		
		backButton.addEventListener('click', function()
		{
			killNavigation();
		});
		
		win.leftNavButton = backButton;
	} else {
		win.addEventListener('android:back', function(e) {
		    e.cancelBubble = true;
			killNavigation();
		});
	}
	
	function killNavigation( ) {
		var dirty = checkIfFormIsDirty();
		
		if ( dirty ) {
			var alert = Titanium.UI.createAlertDialog({ title: 'Unsaved Data', message: 'You have unsaved changes.  Are you sure you want to leave this page?', buttonNames: ['Yes', 'No']});
			
			alert.addEventListener('click', function(e) {
				
				if ( e.index != 1 ) {
					utm.navController.close(utm.myHortDetailWindow);
				} 		
			});
			
			alert.show();
		} else {
			utm.navController.close(utm.myHortDetailWindow);
		}
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
		
		if( isOwner ) {
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
	
	function isEmpty(value){
  		return (value == null || value.length === 0);
	}

	//----------Email--------------------
	var email = new InputField(utm,'Email', 80, '', '210dp', Ti.UI.KEYBOARD_EMAIL);
	view.add(email);
	email.addEventListener("change", checkIfFormIsDirty);
	
		
	//----------Mobile # --------------------
	var mobile = new InputField(utm,'Mobile', 80, '', '210dp', Ti.UI.KEYBOARD_DECIMAL_PAD);
	view.add(mobile);
	mobile.addEventListener("change", checkIfFormIsDirty);


	//----------Twitter On off Switch--------------------
	var twitterGroup = Ti.UI.createView({
		layout : 'horizontal',
		width : '100%',
		top : 3,
		left : 8,
		height : '50dp'
	});
	view.add(twitterGroup);
	
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
		value : false,
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
	view.add(faceBookGroup);

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
		value : false,
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
	view.add(signMessagesGroup);

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
		value : false,
		enabled : true
	});
	signMessagesGroup.add(signMessagesSwitch);
	signMessagesSwitch.addEventListener("change", checkIfFormIsDirty);

//----------Pre/Post Key Word # --------------------
// Business rule is that only owner of MyHort can  set a prefix or postfix
// Keep isOwner check after environment check is removed
if(isOwner){

	var keyWordPreGroup = Ti.UI.createView({
		layout : 'horizontal',
		width : '100%',
		top : 3,
		left : 8,
		height : '60dp',
		visible : true
	});
	view.add(keyWordPreGroup);
	
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
	view.add(orLabel);
	
	var keyWordPostGroup = Ti.UI.createView({
		layout : 'horizontal',
		width : '100%',
		top : 3,
		left : 8,
		height : '60dp',
		visible : true
	});
	view.add(keyWordPostGroup);
	
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
	view.add(saveButton);
			
			
	//----------Delete MyHort Button (Android Only)--------------------		
	if (utm.Android) {
		var deleteButton = Ti.UI.createButton({
			title : 'Delete',
			top : 20,
			height:'40dp',
			width:'100dp',
			backgroundColor:'red',
			enabled: true
		});
		
		deleteButton.addEventListener('click', function() {

			var dialog = Ti.UI.createAlertDialog({
					cancel : 1,
					buttonNames : ['Yes', L('cancel')],
					message : 'Delete this MyHort will delete all your information in this MyHort - do you want to continue? ',
					title : 'Confirm Delete',
					myHortId : _myHortData.MyHortId
				});
				dialog.addEventListener('click', function(e) {
					if (e.index === 0) {
						deleteMyHort(e.source.myHortId);
					} 
				});
				dialog.show();
		});
		view.add(deleteButton);		
	}
	
	function deleteMyHort(myHortId) {
		utm.log('Deleting MyHort ' + myHortId);
		utm.setActivityIndicator(view , 'Deleting...');
		var deleteMyHortDetailReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				utm.setActivityIndicator(view , '');
				deleteMyHortDetailReq=null;
				updateMyHortData();
				utm.navController.close(utm.myHortDetailWindow,{animated:false});
			},
			onerror : function() {
				utm.setActivityIndicator(view , '');
				deleteMyHortDetailReq=null;
			}
		});
		
		deleteMyHortDetailReq.open("GET", utm.serviceUrl + "MyHort/DeleteUsersMyHort?myhortId=" + myHortId);
		deleteMyHortDetailReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		deleteMyHortDetailReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		deleteMyHortDetailReq.send();
	}

				
	function authTwitter() {
		twitter.authorize();
	}
		
	function checkAtLeastOneTypeOfMessageSet(){
		
		if(email.getValue() != '') return true;
		if(mobile.getValue() != '') return true;
		if(facebookSwitch.getValue()) return true;
		if(twitterSwitch.getValue()) return true; 
				
		alert('You must choose at least one of the message type to send to contacts in this MyHort');		
		return false;	
	}
	

	function updateMyHortData() {
		saveButton.enabled = false;
		utm.setActivityIndicator(view , 'Update MyHort...');

		utm.curMyHortDetails.Email = email.getValue();
		utm.curMyHortDetails.Mobile = mobile.getValue();
	
	    utm.curMyHortDetails.AddNicknameToUtms = signMessagesSwitch.getValue(); 	


		//TODO Handle Twitter diff myHortDetails.PrimaryUser.TwitterToken=;

		if (twitterSwitch.getValue()) {
			///if (!twitterEnabledForUser) {
			//original value has changed so now we need to enable twitter
			//authTwitter();
			if (!twitter.isAuthorized()) {
				authTwitter();
			}
			twitterEnabledForUser = true;
			utm.curMyHortDetails.TwitterToken = utm.TwitterToken;
			utm.curMyHortDetails.TwitterSecret = utm.TwitterTokenSecret;

			//}

		} else {
			if (twitterEnabledForUser) {
				//Original value has changes so we need to deactivate twitter
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

			// if(keyWordPre.value !=''){
				// utm.myHortDetails.myHort.Prefix=keyWordPre.value;
				// utm.myHortDetails.myHort.Postfix='';
			// }
			// if(keyWordPost.value  !=''){
				// utm.myHortDetails.myHort.Postfix=keyWordPost.value;
				// utm.myHortDetails.myHort.Prefix='';
			// }
			
		} else {
			utm.myHortDetails.MyInformation = utm.curMyHortDetails;
			utm.myHortDetails.PrimaryUser = '';
		}

		updateMyHortDetailReq.open("POST", utm.serviceUrl + "MyHort/UpdateMyHortDetails");
		updateMyHortDetailReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		updateMyHortDetailReq.setRequestHeader('Authorization-Token', utm.AuthToken);

		updateMyHortDetailReq.send(JSON.stringify(utm.myHortDetails));
	}

	// ##################### Call out to get myHort detail #####################
	var getMyHortDetailReq = Ti.Network.createHTTPClient({
		validatesSecureCertificate : utm.validatesSecureCertificate,
		onload : function() {
			utm.setActivityIndicator(view , '');
			win.visible = true;
			var response = eval('(' + this.responseText + ')');
			utm.myHortDetails = response;

			if (this.status == 200) {

				if (utm.myHortDetails.IsOwner) {
					utm.curMyHortDetails = utm.myHortDetails.PrimaryUser;
					if (utm.iPhone || utm.iPad) 
						topButtonBar.visable = true;

				} else {
					utm.curMyHortDetails = utm.myHortDetails.MyInformation;
					if (utm.iPhone || utm.iPad) 
						topButtonBar.visable = false;
				}

				//Now that we have date set all the values
				email.setValue(utm.curMyHortDetails.Email);
				mobile.setValue(utm.curMyHortDetails.Mobile);
				//	faceBook.setValue(utm.curMyHortDetails.FaceBook);

				if (utm.curMyHortDetails.TwitterToken != '' & utm.curMyHortDetails.TwitterToken != null) {
					twitterSwitch.setValue(true);
					twitterEnabledForUser = true;
				} else {
					twitterSwitch.setValue(false);
					twitterEnabledForUser = false;
				}

				if (utm.curMyHortDetails.FaceBook != '' & utm.curMyHortDetails.FaceBook != null) {
					facebookSwitch.setValue(true);
					facebookEnabledForUser = true;
				} else {
					facebookSwitch.setValue(false);
					facebookEnabledForUser = false;
				}
								
				if (utm.myHortDetails.IsOwner) {
					signMessagesSwitch.setValue(utm.myHortDetails.PrimaryUser.AddNicknameToUtms);

				} else {
					signMessagesSwitch.setValue(utm.myHortDetails.MyInformation.AddNicknameToUtms);
				}			
				if(isOwner){
					
					if(utm.myHortDetails.myHort.Prefix && utm.myHortDetails.myHort.Prefix !=''){
						keyWordPre.value = utm.myHortDetails.myHort.Prefix;
					}else{
						keyWordPost.value = utm.myHortDetails.myHort.Postfix;
					}
				}
				enableButtonBar(true);

			} else if (this.status == 400) {
				utm.recordError('Error');
			} else {
				utm.recordError('Error');
			}
			if (utm.iPhone || utm.iPad) 
				topButtonBar.enabled = true;
			utm.setActivityIndicator(view , '');
		},
		onerror : function(e) {
			utm.setActivityIndicator(view , '');
			if (this.status != undefined && this.status === 404) {
				alert('The myHort you are looking for does not exist.');
			} else {
				utm.handleError(e, this.status, this.responseText);
			}
		},
		timeout : utm.netTimeout
	});
	
	function updateOwnerMemberDetails(){

		//Ti.API.info(_myHortData);

		for (x=0;x< _myHortData.Members.length;x++){
			
			if (_myHortData.Members[x].MemberType == 'Primary'){
				_myHortData.Members[x].HasEmail = email.getValue() !='';
				_myHortData.Members[x].HasMobile = mobile.getValue() !='';
				_myHortData.Members[x].HasTwitter = twitterSwitch.getValue();
				_myHortData.Members[x].HasFaceBook = facebookSwitch.getValue();
				break;
			}
		}
		
		if( isOwner ) {
			_myHortData.Prefix = keyWordPre.value;
			_myHortData.Postfix = keyWordPost.value;
		}
	}
	
	// ##################### Call out to Update myHort  #####################
	var updateMyHortDetailReq = Ti.Network.createHTTPClient({
		validatesSecureCertificate : utm.validatesSecureCertificate,
		onload : function() {
			
			//saveButton.enabled = true;
			utm.setActivityIndicator(view , '');

			var json = this.responseData;
			if (this.status == 200) {
				utm.setActivityIndicator(view , 'Update Complete');
				Ti.App.fireEvent("app:showMyHortWindow", {});
				utm.setActivityIndicator(view , '');
				updateOwnerMemberDetails();
				//loadMyHortDetail();
			
			} else if (this.status == 400) {
				utm.recordError('error');
			} else {
				utm.recordError(utm.myHortDetails.MyHort);
			}

		},
		onerror : function(e) {
			utm.setActivityIndicator(view , '');
			if (this.status != undefined && this.status === 404) {
				alert('MyHort Update Failed');
				Ti.App.fireEvent('app:refreshMyHorts', {
					showProgress : false
				});
			} else {
				utm.handleError(e, this.status, this.responseText);
			}
			//saveButton.enabled = true;
			utm.setActivityIndicator(view , '');
		},
		timeout : utm.netTimeout
	});

	win.addEventListener("open", function() {
		loadMyHortDetail();
	});
	
	function loadMyHortDetail() {
		utm.setActivityIndicator(view , 'Getting your MyHort Details...');
		getMyHortDetailReq.open("GET", utm.serviceUrl + "MyHort/GetMyHortDetails?myHortId=" + _myHortData.MyHortId);
		getMyHortDetailReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		getMyHortDetailReq.send();
	}

	if (utm.iPhone || utm.iPad) {
		topButtonBar.addEventListener('click', function(e) {

			if (e.index === 0) {
				//Invite
				utm.myHortMembersWindow = new MyHortMembersWindow(_myHortData, utm, isOwner);
				utm.navController.open(utm.myHortMembersWindow);

			} else if (e.index === 1) {
				//Invite
				utm.myHortInviteWindow = new MyHortInviteWindow(_myHortData, utm);
				utm.navController.open(utm.myHortInviteWindow);

			} else if (e.index === 2) {
				//Show Pending
				utm.myHortPendingWindow = new MyHortPendingWindow(_myHortData.MyHortId, utm);
				utm.myHortPendingWindow.open({
					modal : true,
					modalTransitionStyle : Ti.UI.iPhone.MODAL_TRANSITION_STYLE_PARTIAL_CURL,
					modalStyle : Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET,
					navBarHidden : true
				});
			}

		});
	}
	if (utm.Android) {
		// Add event listeners for tabs
		tab1.addEventListener('click', function() {
			//Members
			utm.myHortMembersWindow = new MyHortMembersWindow(_myHortData, utm, isOwner);
			utm.navController.open(utm.myHortMembersWindow);
		});
		tab2.addEventListener('click', function() {
			//Invite
			if (isOwner){
				utm.myHortInviteWindow = new MyHortInviteWindow(_myHortData, utm);
				utm.navController.open(utm.myHortInviteWindow);
			}
		});
		tab3.addEventListener('click', function() {
			//Show Pending
			if (isOwner){
				utm.myHortPendingWindow = new MyHortPendingWindow(_myHortData.MyHortId, utm);
				utm.myHortPendingWindow.open({
					modal : true,
					navBarHidden : true
				});
			}
		});
	}

	function authFacebook() {
		Titanium.Facebook.forceDialogAuth = false;

		Titanium.Facebook.addEventListener('login', updateLoginStatus);
		Titanium.Facebook.addEventListener('logout', updateLoginStatus);

	}

	win.addEventListener("blur", function() {
		utm.setActivityIndicator(view , '');
	});


	return win;
};

module.exports = myHortDetail_window;