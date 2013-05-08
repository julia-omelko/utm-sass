function createMyHortWindow(myHortId,utm) {

	var myHortPendingWindow = Ti.UI.createWindow({
		backgroundColor : '#fff',
		layout : 'vertical',
		left : 5,
		right : 5
	});

	var titleLbl = Ti.UI.createLabel({
		text : 'Your Pending Invitations',
		top : 60,
		font:{fontWeight:'bold',fontSize:16},
		color: utm.Android ? utm.androidBarColor : utm.color_org 
	})
	myHortPendingWindow.add(titleLbl);

	var tableView = Titanium.UI.createTableView({
		top : 10,
		height : '60%'
	});
	myHortPendingWindow.add(tableView);
	
	//############ Buttons ################
	var buttonView = Ti.UI.createView();
	myHortPendingWindow.add(buttonView);
	var closeButton = Ti.UI.createButton({
		title : 'Done'
	});
	closeButton.addEventListener('click', function() {
		myHortPendingWindow.close();
	});
	buttonView.add(closeButton);

	

	//Load list on focus event
	myHortPendingWindow.addEventListener("focus", function() {
		utm.setActivityIndicator('Getting your Pending Invitations...');
		loadPending();
	});

	function loadPending() {
		getMyHortsPending.open("GET", utm.serviceUrl + "MyHort/Pending?myHortId=" + myHortId + '&orderby=EmailAddress');
		getMyHortsPending.setRequestHeader('Authorization-Token', utm.AuthToken);
		getMyHortsPending.send();
	}

	var getMyHortsPending = Ti.Network.createHTTPClient({
		validatesSecureCertificate : utm.validatesSecureCertificate,
		onerror : function(e) {
			utm.handleError(e, this.status, this.responseText);
		},
		onload : function(e) {
			var response = eval('('+this.responseText+')');
			utm.setActivityIndicator('');
			Titanium.Analytics.featureEvent('user.viewed_myHortPending');
			if (this.status == 200) {
				utm.log("MyHort data returned " + response.length + '  pending returned');
				populateTable(response);
			}
		},
		timeout : utm.netTimeout
	});

	function populateTable(myHortPendingData) {
		tableView.setData([]);
		var tableData = [];
		for (var i = 0; i < myHortPendingData.length; i++) {
			var row = Ti.UI.createTableViewRow({
				className : 'row',
				row : clickName = 'row',
				objName : 'row',
				touchEnabled : false,
				height : 55,
				hasChild : false,
				myHortPendingData : myHortPendingData[i]
			});

			var hView = Ti.UI.createView({
				layout : 'composite',
				backgroundColor : '#fff',
				objName : 'hView'
			});

			var pendingEmail = Ti.UI.createLabel({
				backgroundColor : '#fff',
				color : '#000',
				font : {
					fontSize : 14,
					fontWeight : 'bold'
				},
				objName : 'myHortName',
				text : myHortPendingData[i].EmailAddress,
				touchEnabled : false,
				//top : 5,
				left : 2,
				width : 200,
				height : 15,
				ellipsize : false
			});
			hView.add(pendingEmail);

			//Member Type
			var memberType = Ti.UI.createLabel({
				backgroundColor : '#fff',
				color : '#000',
				objName : 'memberType',
				text : myHortPendingData[i].MemberType,
				touchEnabled : false,
				top : 5,
				left : 205,
				height : 15,
				ellipsize : false
			});
			hView.add(memberType);

			//IsValid
			if (!myHortPendingData[i].IsValid) {
				var expiredLbl = Ti.UI.createLabel({
					text : 'Expired',
					bottom : 5,
					left : 205
				})
				hView.add(expiredLbl);
			}

			row.add(hView);
			tableData.push(row);
		}

		tableView.setData(tableData);

	}

	return myHortPendingWindow;

}

module.exports = createMyHortWindow;
