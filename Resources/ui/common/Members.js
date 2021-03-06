var MembersWin = function(_tabGroup) {
	var myHortId = utm.User.UserProfile.PrimaryMyHort;
	var myHortData = {};
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Members', true);
	
	var updateDisplay = function() {
		self.fireEvent('reorientdisplay');
	};
	Ti.App.addEventListener('orientdisplay', updateDisplay);	
	
	var scrollView = Ti.UI.createScrollView({
		top: utm.viewableTop,
		scrollType : 'vertical',
		showVerticalScrollIndicator : true,
		showHorizontalScrollIndicator : false,
		height: utm.viewableArea
	});
	self.add(scrollView);
	
	self.addEventListener('reorientdisplay', function(evt) {
		scrollView.height = utm.viewableArea;
	});	

	var editButton = Ti.UI.createLabel({
		text: 'Edit',
		font: {fontFamily: utm.fontFamily},
		color: 'white'
	});
	editButton.addEventListener('click', function(e){
		tableView.setEditing(!tableView.getEditing());
		editButton.setText((tableView.getEditing() ? 'Done' : 'Edit'));
	});
	self.setLeftNavButton(editButton);
	
	var newButton = Ti.UI.createImageView({
		image: '/images/icons/add.png',
		height: 25,
		width: 25
	});
	newButton.addEventListener('click',function(e){
		var InviteWin = require('/ui/common/InviteMembers');
		var inviteWin = new InviteWin(_tabGroup,myHortData);
		inviteWin.addEventListener('close',function(e){
			loadMyHortDetail();
		});
		_tabGroup.getActiveTab().open(inviteWin);
	});
	self.setRightNavButton(newButton);





	var refreshing = false;
	if (utm.iPad || utm.iPhone) {
		var refreshControl = Ti.UI.createRefreshControl({
			tintColor: utm.color_org
		});
		refreshControl.addEventListener('refreshstart',function(e){
			refreshing = true;
			loadMyHortDetail();
		});
	}
	
	var tableView = Ti.UI.createTableView({
		top: utm.viewableTop,
		editable: false,
		allowsSelectionDuringEditing: true,
		height: utm.viewableArea - utm.viewableTabHeight,
		refreshControl: ((utm.iPad || utm.iPhone) ? refreshControl : null)
	});
	self.add(tableView);
	
	self.addEventListener('reorientdisplay', function(evt) {
		tableView.height = utm.viewableArea - utm.viewableTabHeight;
	});		
	
	tableView.addEventListener('click',function(e){
		if (e.source.memberData != null) {
			if (e.source.memberData.InviteCode != null) {
				var MemberDetailWin = require('/ui/common/MemberPending');
				var memberDetailWin = new MemberDetailWin(_tabGroup, e.source.memberData, myHortData.myHort);
			} else {
				var MemberDetailWin = require('/ui/common/MemberDetail');
			var memberDetailWin = new MemberDetailWin(_tabGroup, e.source.memberData);
			}
			memberDetailWin.addEventListener('close',function(e){
				loadMyHortDetail();
			});
			_tabGroup.getActiveTab().open(memberDetailWin);
		}
	});
	
	tableView.addEventListener('delete', function(e) {
		if (e.rowData.memberData.InviteCode != null) {
			deletePending(e.rowData.memberData);
		} else {
			deleteMember(e.rowData.memberData);
		}
	});
	
	
	if (utm.Android) {
		var StandardButton = require('/ui/common/baseui/StandardButton');
		var aNewButton = new StandardButton({title:'Invite member'});
		aNewButton.addEventListener('click',function(e){
			var InviteWin = require('/ui/common/InviteMembers');
			var inviteWin = new InviteWin(_tabGroup,myHortData);
			inviteWin.addEventListener('close',function(e){
				loadMyHortDetail();
			});
			_tabGroup.getActiveTab().open(inviteWin);
		});
		tableView.setHeight(utm.viewableArea-utm.viewableTabHeight-((40*utm.sizeMultiplier)+20));
		self.add(aNewButton);
	}
	
	
	
	
	
	
	function deleteMember(_memberData) {
		var deleteMemberReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				var json = this.responseData;
				if (this.status === 200) {
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
		
		deleteMemberReq.open("POST", utm.serviceUrl + "MyHort/DeleteUserFromMyHort?myhortMemberId=" + _memberData.Id);
		deleteMemberReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		deleteMemberReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		deleteMemberReq.send();
	}
	
	function deletePending(_memberData) {
		var deletePendingReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				var response = eval('(' + this.responseText + ')');
				if (this.status === 200) {
				} else {
					utm.handleHttpError({}, this.status, this.responseText);
				}
				deletePendingReq = null;
			},
			onerror : function(e) {
				utm.handleHttpError(e, this.status, this.responseText);
				deletePendingReq = null;
			},
			timeout : utm.netTimeout,
			enableKeepAlive : utm.keepAlive
		});
		deletePendingReq.open("DELETE", utm.serviceUrl + "MyHort/DeleteInvite/" + _memberData.Id);
		deletePendingReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		deletePendingReq.send();
	}


	function loadMyHortDetail() {
		if (refreshing === false) {
			self.showAi();
		}
		var getMyHortDetailReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				var response = eval('(' + this.responseText + ')');
				if (this.status === 200) {
					myHortData = response;
					if(response.myHort && response.myHort.Members){
						getPendingMembers(response.myHort.Members);
					}	
				} else {
					utm.handleHttpError({}, this.status, this.responseText);
				}
				getMyHortDetailReq = null;
			},
			onerror : function(e) {
				utm.handleHttpError(e, this.status, this.responseText);
				getMyHortDetailReq = null;
			},
			timeout : utm.netTimeout,
			enableKeepAlive : utm.keepAlive
		});
		getMyHortDetailReq.open("GET", utm.serviceUrl + "MyHort/GetMyHortDetails?myHortId=" + myHortId);
		getMyHortDetailReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		getMyHortDetailReq.send();
	}
	
	function displayMyHortData(_members) {
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
		if (utm.iPad || utm.iPhone) {
			refreshControl.endRefreshing();
		}
        refreshing = false;
	}
	
	var sort_by = function(field, reverse, primer) {
	   var key = primer ? function(x) {return primer(x[field]);} : function(x) {return x[field];};
	   reverse = [-1, 1][+!!reverse];
	   return function (a, b) {
	       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
	   }; 
	};
	
	function getPendingMembers(_members) {
		var getMyHortPendingReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				var response = eval('(' + this.responseText + ')');
				if (this.status === 200) {
					for (var i=0; i<response.length; i++) {
						response[i].NickName = response[i].EmailAddress.split('@')[0];
						response[i].Avatar = 0;
					}
					_members = _members.concat(response);
					displayMyHortData(_members);
					getMyHortPendingReq = null;
				} else {
					utm.handleHttpError({}, this.status, this.responseText);
					getMyHortPendingReq = null;
				}
			},
			onerror : function(e) {
				if (this.status != undefined && this.status === 404) {
					alert('The group you are looking for does not exist.');
				} else {
					utm.handleHttpError(e, this.status, this.responseText);
				}
			},
			timeout : utm.netTimeout,
			enableKeepAlive : utm.keepAlive
		});
		getMyHortPendingReq.open("GET", utm.serviceUrl + "MyHort/Pending?myHortId=" + myHortId);
		getMyHortPendingReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		getMyHortPendingReq.send();	
	}
	
	
	loadMyHortDetail();

	
	self.addEventListener('close', function(e) {
		Ti.App.removeEventListener('orientdisplay', updateDisplay);
	});	


	return self;
};
module.exports = MembersWin;

