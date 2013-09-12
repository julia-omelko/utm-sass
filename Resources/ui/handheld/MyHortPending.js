function createMyHortWindow(myHortId,utm) {

	var Header = require('ui/common/Header');

	var myHortPendingWindow = new Header(utm, 'Your Pending Invitations', L('button_back'));
	myHortPendingWindow.left='5dp';
	myHortPendingWindow.right='5dp';
	

	var tableView = Titanium.UI.createTableView({
		top:utm.iPhone || utm.iPad?'20%':'10dp',
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
		
		var getMyHortsPending = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function(e) {
				var response = eval('('+this.responseText+')');
				utm.setActivityIndicator('');
				Titanium.Analytics.featureEvent('user.viewed_myHortPending');
				if (this.status == 200) {
					utm.log("MyHort data returned " + response.length + '  pending returned');
					populateTable(response);
				}
				getMyHortsPending=null;
			},
			onerror : function(e) {
				utm.handleError(e, this.status, this.responseText);
				getMyHortsPending=null;
			},
			timeout : utm.netTimeout
		});
		
		getMyHortsPending.open("GET", utm.serviceUrl + "MyHort/Pending?myHortId=" + myHortId + '&orderby=EmailAddress');
		getMyHortsPending.setRequestHeader('Authorization-Token', utm.AuthToken);
		getMyHortsPending.send();
	}

	

	function populateTable(myHortPendingData) {
		tableView.setData([]);
		var tableData = [];
		for (var i = 0; i < myHortPendingData.length; i++) {
			var row = Ti.UI.createTableViewRow({
				className : 'row',
				row : clickName = 'row',
				objName : 'row',
				touchEnabled : false,
				height : '55dp',
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
					fontSize : '14dp',
					fontWeight : 'bold'
				},
				objName : 'myHortName',
				text : myHortPendingData[i].EmailAddress,
				touchEnabled : false,
				//top : 5,
				left : '2dp',
				width : '200dp',
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
				top : '5dp',
				left : '205dp',
				font:{
					fontSize : '16dp'
				},
				ellipsize : false
			});
			hView.add(memberType);

			//IsValid
			if (!myHortPendingData[i].IsValid) {
				var expiredLbl = Ti.UI.createLabel({
					color : '#000',
					text : 'Expired',
					top : '30dp',
					font:{
						fontSize : '16dp'
					},
					left : '205dp'
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
