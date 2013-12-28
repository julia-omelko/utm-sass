function myHortDetail_window(_myHortMember, utm) {

	var CheckBoxField = require('ui/common/baseui/CheckBox');

	if(utm.iPhone || utm.iPad ){
		var win = Ti.UI.createWindow({
			layout : 'vertical',
			backgroundColor : utm.backgroundColor,
			barColor : utm.barColor,
			title : 'Member Info'
		});
	}else if(utm.Android){
		
		//create the base screen and hid the Android navbar
		var win = Titanium.UI.createWindow({
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
		    text:'Member Info',
		    font:{fontSize:utm.androidTitleFontSize,fontWeight:utm.androidTitleFontWeight},
		    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		    top:0
		});
 
 		//add the navbar to the screen
		win.add(my_navbar);
	}		

	var scrollingView = Ti.UI.createScrollView({
		showVerticalScrollIndicator : true,
		showHorizontalScrollIndicator : false
	});
	win.add(scrollingView);

	var view = Ti.UI.createView({
		height : '2000dp',
		layout : 'vertical'
	});

	scrollingView.add(view);
	
	//-----------------NickName  ----------------------
	var nickNameView = Ti.UI.createView({
		layout : 'horizontal',
		height : '30dp',
		left : '5dp',
		top : '10dp'
	});
	view.add(nickNameView);

	var nickNamelbl = Ti.UI.createLabel({
		text : 'Nickname ',
		font : {
			fontSize : '14dp',
			fontWeight : 'bold'
		},
		height : 'auto',
		top : '2dp',
		textAlign : 'left',
		color : '#000'
	});
	nickNameView.add(nickNamelbl);

	var nickNameTextField = Ti.UI.createTextField({
		value : _myHortMember.NickName,
		color : utm.textFieldColor,
		width : utm.SCREEN_WIDTH - 20,
		left : '10dp',
		height : '40dp',
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		borderRadius : 5
	});
	view.add(nickNameTextField);

	//############ Choose Type ################
	var typeBox = Ti.UI.createView({
		layout : 'horizontal',
		height : '30dp',
		left : '5dp',
		top : '30dp',
		visible: 	_myHortMember.MemberType == 'Primary'?false:true		
	});
	var typeLabel = Ti.UI.createLabel({
		text : 'Invisible to Others',
		font : {
			fontWeight : 'bold',
			fontSize : '14dp'
		},
		color : '#000',
		width : '150dp'
	});
	typeBox.add(typeLabel);

	var typeCheckBox = new CheckBoxField(_myHortMember.MemberType === 'Invisible');
	typeBox.add(typeCheckBox);
	view.add(typeBox);


	//############ Save Button ################
	var saveButton = Ti.UI.createButton({
		title : 'Save',
		top : '30dp',
		enabled : true
	});
	saveButton.addEventListener('click', function() {
		updateMyHortMemberData();
	});
	view.add(saveButton);
	

	if (utm.Android  && utm.User.UserProfile.UserId !== _myHortMember.UserId) {
		var removeButton = Ti.UI.createButton({
			title : 'Remove',
			top : '30dp',
			enabled : true
		});
		removeButton.addEventListener('click', function() {
			var dialog = Ti.UI.createAlertDialog({
				cancel : 1,
				buttonNames : [L('yes'), L('cancel')],
				message : 'Are you sure you want to remove this member?',
				title : L('Remove Member')
			});
			dialog.addEventListener('click', function(e) {
				if (e.index === e.source.cancel) {
					Ti.API.info('The cancel button was clicked');
				} else {					
					var deleteUserFromMyHortHttp = Ti.Network.createHTTPClient({
						validatesSecureCertificate : utm.validatesSecureCertificate,
						onload : function() {
							deleteUserFromMyHortHttp = null;
							win.close();
						},
						onerror : function(err) {
							utm.log(err);
							deleteUserFromMyHortHttp = null;
							win.close();
						}
					});
					
					deleteUserFromMyHortHttp.open("POST", utm.serviceUrl + "MyHort/DeleteUserFromMyHort?myhortMemberId=" + _myHortMember.Id);
					deleteUserFromMyHortHttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
					deleteUserFromMyHortHttp.setRequestHeader('Authorization-Token', utm.AuthToken);
					deleteUserFromMyHortHttp.send();
				}
			});
			dialog.show();
		});
		view.add(removeButton);
	}
	
	

	function updateMyHortMemberData() {
		saveButton.enabled = false;
		utm.setActivityIndicator(view , 'Updating...');

		_myHortMember.NickName = nickNameTextField.value;
		
		if(_myHortMember.MemberType != 'Primary'){
			if (typeCheckBox.isChecked()) {
				_myHortMember.MemberType = 'Invisible';
			} else {
				_myHortMember.MemberType = 'Secondary';
			}
		}
		

		updateMemberDetailReq.open("POST", utm.serviceUrl + "MyHort/UpdateMyHortMember");
		updateMemberDetailReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		updateMemberDetailReq.setRequestHeader('Authorization-Token', utm.AuthToken);

		updateMemberDetailReq.send(JSON.stringify(_myHortMember));
	}

	// ##################### Call out to Update myHortMemberDetail #####################
	var updateMemberDetailReq = Ti.Network.createHTTPClient({
		validatesSecureCertificate : utm.validatesSecureCertificate,
		onload : function() {

			var json = this.responseData;
			if (this.status == 200) {
				utm.setActivityIndicator(view , 'Update Complete');
				Ti.App.fireEvent("app:showMyHortWindow", {});
				utm.setActivityIndicator(view , '');

				loadMyHortDetail(_myHortMember.MyHortId);

				Ti.App.fireEvent('app:myHortMemberDetailReload', _myHortMember);
				utm.navController.close(utm.memberDetailsWindow);

				//TODO handle errors better
			} else if (this.status == 400) {
				utm.recordError('error')
			} else {
				utm.recordError(utm.myHortDetails.MyHort)
			}
			saveButton.enabled = true;
			utm.setActivityIndicator(view , '');
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
			saveButton.enabled = true;
			utm.setActivityIndicator(view , '');
		},
		timeout : utm.netTimeout
	});

	//Reload the myhort with the changes
	function loadMyHortDetail(MyHortId) {
		//utm.setActivityIndicator(view , 'Getting your MyHort Details...');
		getMyHortDetailReq.open("GET", utm.serviceUrl + "MyHort/GetMyHortDetails?myHortId=" + MyHortId);
		getMyHortDetailReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		getMyHortDetailReq.send();
	}

	// ##################### Call out to get myHort detail #####################
	var getMyHortDetailReq = Ti.Network.createHTTPClient({
		validatesSecureCertificate : utm.validatesSecureCertificate,
		onload : function() {

			win.visible = true;
			var response = eval('(' + this.responseText + ')');

			if (this.status == 200) {
				utm.myHortDetails = response;
				Ti.API.info(utm.myHortDetails)

			} else if (this.status == 400) {
				utm.recordError('Error')
			} else {
				utm.recordError('Error')
			}

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

	return win;
};

module.exports = myHortDetail_window;
