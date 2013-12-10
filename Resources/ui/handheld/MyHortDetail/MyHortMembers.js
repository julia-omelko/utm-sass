function myHortMembers(_myHortData, utm, _isOwner, _win) {
	
	var self = Ti.UI.createView({
		backgroundColor : utm.backgroundColor,
		layout : 'vertical',
		height: '100%',
		width: '100%',
		visible: true,
		top:0
	});

	var titleLbl = Ti.UI.createLabel({
		text : 'Current Members',
		top : 5,
		color : utm.color_org,
		height : Ti.UI.SIZE,
		font : {
			fontWeight : 'bold',
			fontSize : '16dp'
		}
	});
	self.add(titleLbl);


	if (_isOwner) {
		// edit and done buttons
		var editButton = Titanium.UI.createButton({
			title : 'Edit'
		});
		editButton.addEventListener('click', function() {
			if (utm.iPhone || utm.iPad) {
				_win.setRightNavButton(doneButton);
				tableView.editing = true;
			}		
		});
		var doneButton = Titanium.UI.createButton({
			title : 'Done',
			style : Titanium.UI.iPhone.SystemButtonStyle.DONE
		});
		doneButton.addEventListener('click', function() {
			if (utm.iPhone || utm.iPad) {
				_win.setRightNavButton(editButton);
			}
			tableView.editing = false;
		});
	}

	var colHeader = Ti.UI.createView({
		layout: 'horizontal',
		height: '20dp',
		top: 5,
		left: 15
	});
	var nickNameLbl = Ti.UI.createLabel({
		text : 'Nickname',
		font : {
			fontWeight : 'bold',
			fontSize : '16dp'
		},
		color : utm.color_org,
		width: '110dp',
		height: Ti.UI.SIZE
	})
	colHeader.add(nickNameLbl);
	var memberTypeLbl = Ti.UI.createLabel({
		text : 'Visible',
		font : {
			fontWeight : 'bold',
			fontSize : '16dp'
		},
		color : utm.color_org,
		//left:'30dp',
		height: Ti.UI.SIZE,
		width: '75dp'
	})
	colHeader.add(memberTypeLbl);
	var acceptsLbl = Ti.UI.createLabel({
		text : 'Methods',
		font : {
			fontWeight : 'bold',
			fontSize : '16dp'
		},
		color : utm.color_org,
		//left:'50dp'
	})
	colHeader.add(acceptsLbl);
	self.add(colHeader);

	var tableView = Titanium.UI.createTableView({
		height : Ti.UI.SIZE
	});
	tableView.addEventListener('delete', function(e) {
		var deleteUserFromMyHortHttp = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				for (var i=0;i<_myHortData.Members.length;i++) {
					if (_myHortData.Members[i].Id === e.row.myHortMembersRowData.Id) {
						_myHortData.Members.splice(i,1);
						break;
					}
				}
				deleteUserFromMyHortHttp = null;
			},
			onerror : function(err) {
				utm.log(err);
				deleteUserFromMyHortHttp = null;
			}
		});
		if (_isOwner) {
			deleteUserFromMyHortHttp.open("POST", utm.serviceUrl + "MyHort/DeleteUserFromMyHort?myhortMemberId=" + e.row.myHortMembersRowData.Id);
		} else {
			deleteUserFromMyHortHttp.open("POST", utm.serviceUrl + "MyHort/LeaveMyHort?myHortId=" + _myHortData.MyHortId);
		}
		
		deleteUserFromMyHortHttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		deleteUserFromMyHortHttp.setRequestHeader('Authorization-Token', utm.AuthToken);
		deleteUserFromMyHortHttp.send();
	});
	self.add(tableView);


	if (!_isOwner) {
		var removeButton = Ti.UI.createButton({
			title : 'Leave MyHort',
			top : '30dp',
			enabled : true
		});
		removeButton.addEventListener('click', function() {
			var deleteUserFromMyHortHttp = Ti.Network.createHTTPClient({
				validatesSecureCertificate : utm.validatesSecureCertificate,
				onload : function() {
					deleteUserFromMyHortHttp = null;
					_win.close();
				},
				onerror : function(err) {
					utm.log(err);
					deleteUserFromMyHortHttp = null;
					_win.close();
				}
			});
			
			deleteUserFromMyHortHttp.open("POST", utm.serviceUrl + "MyHort/LeaveMyHort?myHortId=" + _myHortData.MyHortId);
			deleteUserFromMyHortHttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
			deleteUserFromMyHortHttp.setRequestHeader('Authorization-Token', utm.AuthToken);
			deleteUserFromMyHortHttp.send();
		});
		self.add(removeButton);
	}







	function loadMembers() {
		populateTable(_myHortData.Members);
	}

	function populateTable(myHortMembersData) {
		tableView.setData([]);
		var tableData = [];
		for (var i = 0; i < myHortMembersData.length; i++) {
			if( _isOwner || myHortMembersData[i].MemberType !=='Invisible'  || utm.User.UserProfile.UserId === myHortMembersData[i].UserId){
				if ((!_isOwner && utm.User.UserProfile.UserId === myHortMembersData[i].UserId) || (_isOwner && utm.User.UserProfile.UserId !== myHortMembersData[i].UserId)) {
					var isEditable = true;
				} else {
					var isEditable = false;
				}
				var row = Ti.UI.createTableViewRow({
					className : 'row',
					row : clickName = 'row',
					objName : 'row',
					touchEnabled : false,
					height : '40dp',
					hasChild : false,
					myHortMembersRowData : myHortMembersData[i],
					editable: isEditable
				});
	
				var hView = Ti.UI.createView({
					backgroundColor : '#fff',
					objName : 'hView'
				});
	
				var nickName = Ti.UI.createLabel({
					backgroundColor : '#fff',
					color : '#000',
					font : {
						fontSize : '14dp',
						fontWeight : 'bold'
					},
					objName : 'myHortName',
					text : myHortMembersData[i].NickName,
					touchEnabled : false,
					//top : 5,
					left : '15dp',
					width : '110dp',
					height : Ti.UI.FILL,//'20dp',
					ellipsize : false
				});
				hView.add(nickName);
	
				//Member Type
				var memberType = Ti.UI.createLabel({
					backgroundColor : '#fff',
					color : '#000',
					objName : 'memberType',
					touchEnabled : false,
					left : '125dp',
					height : Ti.UI.FILL,
					font : {
						fontSize : '14dp'
					},
					ellipsize : false
				});
				hView.add(memberType);
				
				if(myHortMembersData[i].MemberType==='Invisible'){
					memberType.text = 'No'
				}else{
					memberType.text = 'Yes'
				}
				
	
				var iconView = Ti.UI.createView({
					layout:'horizontal'
					,left: '200dp'//utm.SCREEN_WIDTH - 100	,
				});			
				hView.add(iconView);
				
				if(myHortMembersData[i].HasMobile){
					var phoneIcon = Ti.UI.createImageView({
						image:  '/images/phone_black.png',
						width: myHortMembersData[i].HasMobile?'14dp':0,
						top: '8dp',
						height: '24dp',
						right: myHortMembersData[i].HasMobile?3:0,
						visible: myHortMembersData[i].HasMobile
					});
					iconView.add(phoneIcon);
				//myHortMembersData[i].HasMobile	
				}
				
				var emailIcon = Ti.UI.createImageView({
						image :  '/images/email_black.png',
						width : myHortMembersData[i].HasEmail?'24dp':0,
						top: '12dp',
						height : '16dp',
						right:myHortMembersData[i].HasEmail?3:0,
						visible:myHortMembersData[i].HasEmail
				});
				iconView.add(emailIcon);
				
				var twitterIcon = Ti.UI.createImageView({
						image :  '/images/twitter_black.png',
						width : myHortMembersData[i].HasTwitter?'24dp':0,
						top: '8dp',
						height : '24dp',
						right:myHortMembersData[i].HasTwitter?3:0,
						visible:myHortMembersData[i].HasTwitter
				});
				iconView.add(twitterIcon);
				
				var facebookIcon = Ti.UI.createImageView({
						image :  '/images/facebook_black.png',
						width : myHortMembersData[i].HasFaceBook?'24dp':0,
						top: '8dp',
						height : '24dp',
						right:myHortMembersData[i].HasFaceBook?3:0,
						visible:myHortMembersData[i].HasFaceBook
				});
				iconView.add(facebookIcon);
	
				row.add(hView);
				tableData.push(row);
			}
		}
		
		tableView.setData(tableData);
		tableView.setHeight(Ti.UI.SIZE);

	}
	
	if(_isOwner){
		//Add Click to Details for drilldown
		tableView.addEventListener('click', function(e) {
			utm.MemberDetailsWindow = require('screens/MyHortMemberDetail');
			utm.memberDetailsWindow = new utm.MemberDetailsWindow(e.rowData.myHortMembersRowData,utm);
			if (utm.Android) {
				utm.memberDetailsWindow.addEventListener('close',function(e){
					// ##################### Call out to get myHort detail #####################
					var getMyHortDetailReq = Ti.Network.createHTTPClient({
						validatesSecureCertificate : utm.validatesSecureCertificate,
						onload : function() {
							if (this.status == 200) {
								//Ti.API.info(JSON.stringify(_myHortData));
								//Ti.API.info(this.responseText);
								utm.myHortDetails = eval('(' + this.responseText + ')').myHort;
								_myHortData = utm.myHortDetails;
								loadMembers();
							}
						},
						onerror : function(e) {
							Ti.API.info(e);
							utm.setActivityIndicator(_win , '');
						},
						timeout : utm.netTimeout
					});
					var theUrl = utm.serviceUrl + "MyHort/GetMyHortDetails?myHortId=" + _myHortData.MyHortId;
					Ti.API.info(JSON.stringify(theUrl));
					getMyHortDetailReq.open("GET",theUrl);
					getMyHortDetailReq.setRequestHeader('Authorization-Token', utm.AuthToken);
					getMyHortDetailReq.send();
	
				});
			}
			utm.navController.open(utm.memberDetailsWindow);
		});
	}

	//This event handler resets the member detail after its been updated in MyHortMemberDetail	
	Ti.App.addEventListener('app:myHortMemberDetailReload', function(e){
		for (i=0;i< _myHortData.Members.length;i++){
			if(_myHortData.Members[i].Id === e.Id){
				Ti.API.info(e);
				_myHortData.Members[i].NickName=e.NickName;
				break;
			}	
		}
		loadMembers();
	});
	
	if (_isOwner) {
		self.addEventListener('focus',function(e) {
			if (utm.iPhone || utm.iPad) {
				_win.setRightNavButton(editButton);
			}
		});
		self.addEventListener('blur', function() {
			if (utm.iPhone || utm.iPad) {
				_win.setRightNavButton(null);
			}
			tableView.editing = false;
		});
	}
	
	loadMembers();
	
	
	if (_isOwner && _myHortData.Members.length === 1) {
		var inviteButton = Ti.UI.createButton({
			title: 'Invite your 1st Member Now!',
			//width: '50%',
			top:5,
			height: Ti.UI.SIZE
		});
		inviteButton.addEventListener('click',function(e){
			_win.fireEvent('invite');
		});
		self.add(inviteButton);
	}
	
	
	return self;

}

module.exports = myHortMembers;
