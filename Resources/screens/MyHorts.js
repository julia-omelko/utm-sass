var MyHorts_window = function() {

	var CreateMyHortWindow = require('ui/handheld/CreateMyHort');

	var myHortsWindow = Titanium.UI.createWindow({
		layout : 'vertical',
		title : 'MyHorts',
		backgroundColor : utm.backgroundColor,
		backButtonTitle : L('button_back'),
		barColor : utm.barColor
	});

	var createButton = Ti.UI.createButton({
		title : 'Create a New MyHort',
		top : 10
	});
	myHortsWindow.add(createButton);

	createButton.addEventListener('click', function() {
		utm.createMyHortWindow = new CreateMyHortWindow(myHortsWindow);
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
	myHortsWindow.add(tableView);

	myHortsWindow.addEventListener("focus", function() {
		log('Focus');
		setActivityIndicator('Getting your MyHorts...');
		loadMyHorts();
	});

	var edit = Titanium.UI.createButton({
		title : 'Delete'
	});

	edit.addEventListener('click', function() {
		myHortsWindow.setRightNavButton(cancel);
		tableView.editing = true;
	});

	var cancel = Titanium.UI.createButton({
		title : L('cancel'),
		style : Titanium.UI.iPhone.SystemButtonStyle.DONE
	});
	cancel.addEventListener('click', function() {
		myHortsWindow.setRightNavButton(edit);
		tableView.editing = false;
	});

	myHortsWindow.setRightNavButton(edit);

	function loadMyHorts() {
		getMyHortsReq.open("GET", utm.serviceUrl + "MyHort?$orderby=FriendlyName");
		getMyHortsReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		getMyHortsReq.send();
	}

	var getMyHortsReq = Ti.Network.createHTTPClient({
		validatesSecureCertificate : utm.validatesSecureCertificate,
		onerror : function(e) {
			handleError(e, this.status, this.responseText);
		},
		onload : function(e) {
			var json = this.responseData;
			var response = JSON.parse(json);
			setActivityIndicator('');
			Titanium.Analytics.featureEvent('user.viewed_myHorts');
			if (this.status == 200) {

				log("MyHort data returned " + response.length + '  myHorts returned');
				populateTable(response);

			}
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
				height : 55,
				hasChild : true,
				myHortData : myHortData[i]
			});

			var hView = Ti.UI.createView({
				layout : 'composite',
				backgroundColor : '#fff',
				objName : 'hView'
			});

			var myHortName = Ti.UI.createLabel({
				backgroundColor : '#fff',
				color : '#000',
				font : {
					fontSize : 14,
					fontWeight : 'bold'
				},
				objName : 'myHortName',
				text : myHortData[i].FriendlyName,
				touchEnabled : true,
				//top : 5,
				left : 2,
				width : utm.SCREEN_WIDTH - 100,
				height : 15,
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
		utm.myHortDetailWindow = new utm.MyHortDetailWindow(myHortData);
		utm.myHortDetailWindow.title = 'MyHort Info';
		utm.navGroup.open(utm.myHortDetailWindow);
	});

	tableView.addEventListener('delete', function(e) {
		var s = e.section;
		confirmDeleteMyHort(e.rowData.myHortData.MyHortId, false)
	});

	function confirmDeleteMyHort(myHortId) {
		var dialog = Ti.UI.createAlertDialog({
			cancel : 1,
			buttonNames : ['Delete', L('cancel')],
			message : 'Delete this MyHort will delete all your information in this MyHort - do you want to continue? ',
			title : 'Confirm Delete',
			myHortId : myHortId
		});
		dialog.addEventListener('click', function(e) {
			if (e.index === 0) {
				deleteMyHort(myHortId);
			}
		});
		dialog.show();
	}

	// ##################### DELETE MyHort #####################
	function deleteMyHort(myHortId) {
		log('Deleting MyHort ' + myHortId);
		setActivityIndicator('Deleting...');
		deleteMyHortDetailReq.open("GET", utm.serviceUrl + "MyHort/DeleteUsersMyHort?myhortId=" + myHortId);
		deleteMyHortDetailReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		deleteMyHortDetailReq.setRequestHeader('Authorization-Token', utm.AuthToken);

		deleteMyHortDetailReq.send();
	}

	var deleteMyHortDetailReq = Ti.Network.createHTTPClient({
		validatesSecureCertificate : utm.validatesSecureCertificate,
		onload : function() {
			setActivityIndicator('');
			//loadMyHorts();
		},
		onerror : function() {
			log('error');
		}
	});

	myHortsWindow.addEventListener('blur', function() {
		myHortsWindow.setRightNavButton(edit);
		tableView.editing = false;
	});

	Ti.App.addEventListener('app:loadMyHorts', function() {
		loadMyHorts();
	});

	return myHortsWindow;

}
module.exports = MyHorts_window;
