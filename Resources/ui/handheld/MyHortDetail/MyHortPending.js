function myHortPending(_myHortId, utm, _win) {

	var self = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: Ti.UI.SIZE,
		visible: false,
		layout: 'vertical',
		top: 0
	})

	var titleLbl = Ti.UI.createLabel({
		text : 'Pending Invites',
		top : 5,
		color : utm.color_org,
		height : Ti.UI.SIZE,
		font : {
			fontWeight : 'bold',
			fontSize : '16dp'
		}
	});
	self.add(titleLbl);

	var tableView = Titanium.UI.createTableView({
		top: 5,
		height: Ti.UI.FILL
	});
	self.add(tableView);
	


	function loadPending() {
		var getMyHortsPending = Ti.Network.createHTTPClient({
			validatesSecureCertificate : utm.validatesSecureCertificate,
			onload : function(e) {
				var response = eval('('+this.responseText+')');
				utm.setActivityIndicator(_win , '');
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
		utm.setActivityIndicator(_win , 'Getting your Pending Invitations...');
		getMyHortsPending.open("GET", utm.serviceUrl + "MyHort/Pending?myHortId=" + _myHortId + '&orderby=EmailAddress');
		getMyHortsPending.setRequestHeader('Authorization-Token', utm.AuthToken);
		getMyHortsPending.send();
	}

	

	function populateTable(myHortPendingData) {
		//tableView.setData([]);
		var tableData = [];
		for (var i = 0; i < myHortPendingData.length; i++) {
			var row = Ti.UI.createTableViewRow({
				className : 'row',
				row : clickName = 'row',
				objName : 'row',
				touchEnabled : false,
				height : '40dp',
				hasChild : false,
				myHortPendingData : myHortPendingData[i]
			});

			var hView = Ti.UI.createView({
				layout : 'composite',
				backgroundColor : '#fff',
				objName : 'hView',
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
				left: '15dp',
				width : '200dp',
				ellipsize : true,
				height: '40dp',
				verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER
				
			});
			hView.add(pendingEmail);

			//Member Type
			var memberType = Ti.UI.createLabel({
				backgroundColor : '#fff',
				color : '#000',
				objName : 'memberType',
				text : myHortPendingData[i].MemberType,
				touchEnabled : false,
				top : '0dp',
				left : '205dp',
				font:{
					fontSize : '16dp'
				},
				ellipsize : false,
				height: '20dp',
				verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER
			});
			hView.add(memberType);

			//IsValid
			if (!myHortPendingData[i].IsValid) {
				var expiredLbl = Ti.UI.createLabel({
					color : '#000',
					text : 'Expired',
					top : '20dp',
					font:{
						fontSize : '16dp'
					},
					left : '205dp',
					height: '20dp',
					verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER
				});
				hView.add(expiredLbl);
			}

			row.add(hView);
			tableData.push(row);
		}

		tableView.setData(tableData);
		
		//Reset table hight after data seams to fix issue
		//TEST #608 - Pendinging Invite List Blank sometime
		tableView.height=Ti.UI.FILL;
	}
	
	self.addEventListener('focus',function(e){
		loadPending();
	});
	
	return self;
}

module.exports = myHortPending;
