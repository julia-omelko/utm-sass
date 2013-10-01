var MyHorts_window = function(utm) {

	var CreateMyHortWindow = require('ui/handheld/CreateMyHort');
	var Header = require('ui/common/Header');

	var win = new Header(utm, 'MyHorts', L('button_back'));

	var deleteButton = Titanium.UI.createButton({
		title : 'Delete'
	});

	if (utm.iPhone || utm.iPad) {
		win.setRightNavButton(deleteButton);
	}

	var createButton = Ti.UI.createButton({
		title : 'Create a New MyHort',
		top : 5
	});
	win.add(createButton);

	createButton.addEventListener('click', function() {
		utm.createMyHortWindow = new CreateMyHortWindow(utm);

		utm.createMyHortWindow.open({
			modal : true,
			modalTransitionStyle : Ti.UI.iPhone.MODAL_TRANSITION_STYLE_PARTIAL_CURL,
			modalStyle : Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET,
			navBarHidden : true
		});
	});

	var tableView = Titanium.UI.createTableView({
		left : 2,
		editable : true,
		allowsSelectionDuringEditing : true
	});
	win.add(tableView);

	win.addEventListener("focus", function() {
		loadMyHorts();
	});

	deleteButton.addEventListener('click', function() {
		if (utm.iPhone || utm.iPad) {
			win.setRightNavButton(cancel);
			tableView.editing = true;
		}		
	});

	var cancel = Titanium.UI.createButton({
		title : 'Done',
		style : Titanium.UI.iPhone.SystemButtonStyle.DONE
	});
	cancel.addEventListener('click', function() {
		if (utm.iPhone || utm.iPad) {
			win.setRightNavButton(deleteButton);
		}
		tableView.editing = false;
	});
	if (utm.iPhone || utm.iPad) {
		win.setRightNavButton(deleteButton);
	}

	function loadMyHorts() {
		getMyHortsReq.open("GET", utm.serviceUrl + "MyHort?$orderby=FriendlyName");
		getMyHortsReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		utm.setActivityIndicator(win , 'Getting your MyHorts...');
		getMyHortsReq.send();
	}

	var getMyHortsReq = Ti.Network.createHTTPClient({
		validatesSecureCertificate : utm.validatesSecureCertificate,
		onerror : function(e) {
			utm.setActivityIndicator(win , '');
			utm.handleError(e, this.status, this.responseText);
		},
		onload : function(e) {
			var response = eval('(' + this.responseText + ')');
			Titanium.Analytics.featureEvent('user.viewed_myHorts');
			if (this.status == 200) {

				utm.log("MyHort data returned " + response.length + '  myHorts returned');
				populateTable(response);
				utm.User.MyHorts = response;
			}
			utm.setActivityIndicator(win , '');
		},
		timeout : utm.netTimeout
	});

	function populateTable(myHortData) {
		tableView.setData([]);
		var tableData = [];
		for (var i = 0; i < myHortData.length; i++) {
			var row = Ti.UI.createTableViewRow({
				className : 'row',
				row : clickName = 'row',
				objName : 'row',
				touchEnabled : true,
				height : '55dp',
				hasChild : true,
				myHortData : myHortData[i]
			});

			var hView = Ti.UI.createView({
				layout : 'composite',
				backgroundColor : '#fff',
				objName : 'hView'
			});

			var icon = Ti.UI.createImageView({
				image : myHortData[i].IsOwner ? '/images/ownerIcon.png' : '/images/memberIcon.png',
				width : 20,
				height : 20,
				left : 3,
				top : 15
			});
			hView.add(icon);

			var myHortName = Ti.UI.createLabel({
				backgroundColor : '#fff',
				color : '#000',
				font : {
					fontSize : '14dp',
					fontWeight : 'bold'
				},
				objName : 'myHortName',
				text : myHortData[i].FriendlyName,
				touchEnabled : true,
				//top : 5,
				left : 27,
				width : utm.SCREEN_WIDTH - 100,
				//height : 15,
				ellipsize : true
			});
			hView.add(myHortName);
			row.add(hView);
			tableData.push(row);
		}

		tableView.setData(tableData);

	}

	//Add Click to Details for drilldown
	tableView.addEventListener('click', function(e) {
		var myHortData = e.rowData.myHortData;
		utm.MyHortDetailWindow = require('screens/MyHortDetail');
		utm.myHortDetailWindow = new utm.MyHortDetailWindow(myHortData, utm, myHortData.IsOwner);
		utm.myHortDetailWindow.title = myHortData.FriendlyName;
		utm.navController.open(utm.myHortDetailWindow);

	});

	tableView.addEventListener('delete', function(e) {
		var s = e.section;

		if (!e.rowData.myHortData.IsOwner) {
			populateTable(utm.User.MyHorts);
			alert('You can only delete MyHorts that you own.');
			return;
		}

		confirmDeleteMyHort(e.rowData.myHortData.MyHortId, false)
	});

	function confirmDeleteMyHort(myHortId) {
		var dialog = Ti.UI.createAlertDialog({
			cancel : 1,
			buttonNames : ['Yes', L('cancel')],
			message : 'Delete this MyHort will delete all your information in this MyHort - do you want to continue? ',
			title : 'Confirm Delete',
			myHortId : myHortId
		});
		dialog.addEventListener('click', function(e) {
			if (e.index === 0) {
				deleteMyHort(myHortId);
			} else {
				populateTable(utm.User.MyHorts);
			}
		});
		dialog.show();
	}

	// ##################### DELETE MyHort #####################
	function deleteMyHort(myHortId) {
		utm.log('Deleting MyHort ' + myHortId);
		utm.setActivityIndicator(win , 'Deleting...');
		deleteMyHortDetailReq.open("GET", utm.serviceUrl + "MyHort/DeleteUsersMyHort?myhortId=" + myHortId);
		deleteMyHortDetailReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		deleteMyHortDetailReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		removeFromUsersList(myHortId);
		deleteMyHortDetailReq.send();
	}

	var deleteMyHortDetailReq = Ti.Network.createHTTPClient({
		validatesSecureCertificate : utm.validatesSecureCertificate,
		onload : function() {
			utm.setActivityIndicator(win , '');

			//loadMyHorts();
		},
		onerror : function() {
			utm.setActivityIndicator(win , '');
			utm.log('error');
		}
	});

	function removeFromUsersList(myHortId) {
		for ( i = 0; i < utm.User.MyHorts.length; i++) {
			var mh = utm.User.MyHorts[i];
			if (mh.MyHortId = myHortId) {
				utm.User.MyHorts.splice(i, 1);
				break;
			}
		}
	}


	win.addEventListener('blur', function() {
		if (utm.iPhone || utm.iPad) {
			win.setRightNavButton(deleteButton);
		}
		tableView.editing = false;
	});

	Ti.App.addEventListener('app:loadMyHorts', function() {
		loadMyHorts();
	});

	//Added to clear out the myhort list in case someone re-logs in as another user
	Ti.App.addEventListener('app:loginSuccess', function() {
		tableView.setData([]);
	});
	
	//setTimeout(function() { win.show() }, 200);
	
	win.addEventListener("blur", function() {
		utm.setActivityIndicator(win , '');
	});

	return win;

}
module.exports = MyHorts_window;
