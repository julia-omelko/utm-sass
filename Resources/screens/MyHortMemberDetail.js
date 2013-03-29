function myHortDetail_window(_myHortMember, utm) {

	var CheckBoxField = require('ui/common/baseui/CheckBox');

	var win = Ti.UI.createWindow({
		layout : 'vertical',
		backgroundColor : utm.backgroundColor,
		barColor : utm.barColor,
		title : 'Member Info'
	});

	var scrollingView = Ti.UI.createScrollView({
		showVerticalScrollIndicator : true,
		showHorizontalScrollIndicator : false
	});
	win.add(scrollingView);

	var view = Ti.UI.createView({
		height : 2000,
		layout : 'vertical'
	});

	scrollingView.add(view);
	
	//-----------------NickName  ----------------------
	var nickNameView = Ti.UI.createView({
		layout : 'horizontal',
		height : 30,
		left : 5,
		top : 10
	});
	view.add(nickNameView);

	var nickNamelbl = Ti.UI.createLabel({
		text : 'Nickname ',
		font : {
			fontSize : 14,
			fontWeight : 'bold'
		},
		height : 'auto',
		top : 2,
		textAlign : 'left'
	});
	nickNameView.add(nickNamelbl);

	var nickNameTextField = Ti.UI.createTextField({
		value : _myHortMember.NickName,
		color : utm.textFieldColor,
		width : utm.SCREEN_WIDTH - 20,
		left : 10,
		height : 40,
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		borderRadius : 5
	});
	view.add(nickNameTextField);

	//############ Choose Type ################
	var typeBox = Ti.UI.createView({
		layout : 'horizontal',
		height : 30,
		left : 5,
		top : 30,
		visible: 	_myHortMember.MemberType == 'Primary'?false:true		
	});
	var typeLabel = Ti.UI.createLabel({
		text : 'Invisible to Others',
		font : {
			fontWeight : 'bold',
			fontSize : 14
		},
		width : 150
	});
	typeBox.add(typeLabel);

	var typeCheckBox = new CheckBoxField(_myHortMember.MemberType === 'Invisible');
	typeBox.add(typeCheckBox);
	view.add(typeBox);


	//############ Save Button ################
	var saveButton = Ti.UI.createButton({
		title : 'Save',
		top : 30,
		enabled : true
	});
	saveButton.addEventListener('click', function() {
		updateMyHortMemberData();
	});
	view.add(saveButton);

	function updateMyHortMemberData() {
		saveButton.enabled = false;
		utm.setActivityIndicator('Updating...');

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
				utm.setActivityIndicator('Update Complete');
				Ti.App.fireEvent("app:showMyHortWindow", {});
				utm.setActivityIndicator('');

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
			utm.setActivityIndicator('');
		},
		onerror : function(e) {
			utm.setActivityIndicator('');
			if (this.status != undefined && this.status === 404) {
				alert('MyHort Update Failed');
				Ti.App.fireEvent('app:refreshMyHorts', {
					showProgress : false
				});
			} else {
				utm.handleError(e, this.status, this.responseText);
			}
			saveButton.enabled = true;
			utm.setActivityIndicator('');
		},
		timeout : utm.netTimeout
	});

	//Reload the myhort with the changes
	function loadMyHortDetail(MyHortId) {
		//utm.setActivityIndicator('Getting your MyHort Details...');
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

			} else if (this.status == 400) {
				utm.recordError('Error')
			} else {
				utm.recordError('Error')
			}

		},
		onerror : function(e) {
			utm.setActivityIndicator('');
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
