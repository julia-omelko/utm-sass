var GroupsWin = function(_tabGroup) {
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Groups', true);
	
	var scrollView = Ti.UI.createScrollView({
		scrollType : 'vertical',
		showVerticalScrollIndicator : true,
		showHorizontalScrollIndicator : false,
		height: Ti.Platform.displayCaps.platformHeight
	});
	self.add(scrollView);

	var editButton = Ti.UI.createLabel({
		text: 'edit',
		font: {fontFamily: utm.fontFamily},
		color: 'white'
	});
	editButton.addEventListener('click', function(e){
		tableView.setEditing(!tableView.getEditing());
		editButton.setText((tableView.getEditing() ? 'done' : 'edit'));
	});
	self.setLeftNavButton(editButton);
	
	var newButton = Ti.UI.createImageView({
		image: '/images/icons/add.png',
		height: 22,
		width: 22
	});
	newButton.addEventListener('click',function(e){
		var CreateGroupWin = require('/ui/common/CreateGroup');
		var createGroupWin = new CreateGroupWin(_tabGroup);
		createGroupWin.addEventListener('close',function(e){
			self.showAi();
			loadMyHorts();
		});
		_tabGroup.getActiveTab().open(createGroupWin);
		
	});
	self.setRightNavButton(newButton);

	var tableView = Titanium.UI.createTableView({
		editable: false,
		moveable: false,
		allowsSelectionDuringEditing: true,
		height: utm.viewableArea,
		top: 0
	});
	self.add(tableView);

	tableView.addEventListener('click',function(e){
		if (e.rowData.groupData.IsOwner) {
			var GroupDetail = require('/ui/common/OwnerGroupDetail');
		} else {
			var GroupDetail = require('/ui/common/MemberGroupDetail');
		}
		var groupDetailWin = new GroupDetail(_tabGroup,e.rowData.groupData);
		groupDetailWin.addEventListener('close',function(e){
			self.showAi();
			loadMyHorts();
		});
		_tabGroup.getActiveTab().open(groupDetailWin);
	});


	function loadMyHorts() {
		var getMyHortsReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function(e) {
				if (this.status === 200) {
					var response = eval('(' + this.responseText + ')');
					if (response !== null) {
						populateTable(response);
					}
				} else {
					utm.handleHttpError({}, this.status, this.responseText);
				}
				getMyHortsReq = null;
			},
			onerror : function(e) {
				utm.handleHttpError(e, this.status, this.responseText);
				getMyHortsReq = null;
			},
			timeout : utm.netTimeout
		});
		getMyHortsReq.open("GET", utm.serviceUrl + "MyHort?$orderby=FriendlyName");
		getMyHortsReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		getMyHortsReq.send();
	};
	
	var GroupTableRow = require('/ui/common/baseui/GroupViewRow');
	function populateTable(myHortData) {
		var tableData = [];
		for (var i=0; i<myHortData.length; i++) {
			var row = new GroupTableRow(myHortData[i]);
			tableData.push(row);
		}

		tableView.setData(tableData);
		self.hideAi();
	}

	tableView.addEventListener('delete', function(e) {
		if (!e.rowData.groupData.IsOwner) {
			confirmLeaveMyHort(e.rowData.groupData.MyHortId, false);
		} else {
			confirmDeleteMyHort(e.rowData.groupData.MyHortId, false);
		}

	});
	
	function confirmLeaveMyHort(_myHortId) {
		var dialog = Ti.UI.createAlertDialog({
			cancel : 1,
			buttonNames : ['Yes', L('cancel')],
			message : 'You are about to leave this group - do you want to continue? ',
			title : 'Confirm'
		});
		dialog.addEventListener('click', function(e) {
			if (e.index === 0) {
				leaveMyHort(_myHortId);
			} else {
				loadMyHorts();
			}
		});
		dialog.show();
	}
	
	function leaveMyHort(_myHortId) {	
		var leaveMyHortHttp = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				leaveMyHortHttp = null;
			},
			onerror : function(e) {
				utm.handleHttpError(e, this.status, this.responseText);
				leaveMyHortHttp = null;
			},
			timeout:utm.netTimeout
		});
		
		leaveMyHortHttp.open("POST", utm.serviceUrl + "MyHort/LeaveMyHort?myHortId=" + _myHortId);
		leaveMyHortHttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		leaveMyHortHttp.setRequestHeader('Authorization-Token', utm.AuthToken);
		leaveMyHortHttp.send();
	}

	function confirmDeleteMyHort(_myHortId) {
		var dialog = Ti.UI.createAlertDialog({
			cancel : 1,
			buttonNames : ['Yes', L('cancel')],
			message : 'You are about to delete this group - do you want to continue?',
			title : 'Confirm'
		});
		dialog.addEventListener('click', function(e) {
			if (e.index === 0) {
				deleteMyHort(_myHortId);
			} else {
				loadMyHorts();
			}
		});
		dialog.show();
	}

	function deleteMyHort(_myHortId) {
		var deleteMyHortDetailReq = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function() {
				deleteMyHortDetailReq = null;
			},
			onerror : function() {
				utm.handleHttpError(e, this.status, this.responseText);
				deleteMyHortDetailReq = null;
			},
			timeout:utm.netTimeout
		});
		deleteMyHortDetailReq.open("GET", utm.serviceUrl + "MyHort/DeleteUsersMyHort?myhortId=" + _myHortId);
		deleteMyHortDetailReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		deleteMyHortDetailReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		deleteMyHortDetailReq.send();
	}




	loadMyHorts();


	return self;
};
module.exports = GroupsWin;

