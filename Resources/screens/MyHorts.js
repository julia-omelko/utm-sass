var MyHorts_window = function(utm) {

	var CreateMyHortWindow = require('ui/handheld/CreateMyHort');

	if(utm.iPhone || utm.iPad ){
		var myHortsWindow = Titanium.UI.createWindow({
			layout : 'vertical',
			title : 'MyHorts',
			backgroundColor : utm.backgroundColor,
			backButtonTitle : L('button_back'),
			barColor : utm.barColor
		});
	}
	if(utm.Android){
		//create the base screen and hide the Android navbar
		var myHortsWindow = Titanium.UI.createWindow({
		    layout : 'vertical',
		 	backgroundColor : utm.backgroundColor,
		    navBarHidden:true
	    });

 		//create a navbar for Android
		var my_navbar = Ti.UI.createLabel({
		    height : 50,
		    width : '100%',
		    backgroundColor : utm.androidBarColor,
		    text:'MyHorts',
		    color : utm.backgroundColor,
		    font:{fontSize:utm.androidTitleFontSize,fontWeight:utm.androidTitleFontWeight},
		    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		    top:0
		});
 
 		//add the navbar to the screen
		myHortsWindow.add(my_navbar);
		
		//add activityIndicator to window
		myHortsWindow.add(utm.activityIndicator)
		
	}
	
	var createButton = Ti.UI.createButton({
		title : 'Create a New MyHort',
		top :5
	});
	myHortsWindow.add(createButton);

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
	myHortsWindow.add(tableView);

	myHortsWindow.addEventListener("focus", function() {
		utm.setActivityIndicator('Getting your MyHorts...');
		loadMyHorts();
	});

	var edit = Titanium.UI.createButton({
		title : 'Delete'
	});

	edit.addEventListener('click', function() {
		if(utm.iPhone || utm.iPad ){
			myHortsWindow.setRightNavButton(cancel);
		}	
		tableView.editing = true;
	});

	var cancel = Titanium.UI.createButton({
		title : 'Done',
		style : Titanium.UI.iPhone.SystemButtonStyle.DONE
	});
	cancel.addEventListener('click', function() {
		if(utm.iPhone || utm.iPad ){
			myHortsWindow.setRightNavButton(edit);
		}	
		tableView.editing = false;
	});
	if(utm.iPhone || utm.iPad ){
		myHortsWindow.setRightNavButton(edit);
	}
	
	function loadMyHorts() {
		getMyHortsReq.open("GET", utm.serviceUrl + "MyHort?$orderby=FriendlyName");
		getMyHortsReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		getMyHortsReq.send();
	}

	var getMyHortsReq = Ti.Network.createHTTPClient({
		validatesSecureCertificate : utm.validatesSecureCertificate,
		onerror : function(e) {
			utm.handleError(e, this.status, this.responseText);
		},
		onload : function(e) {
			var response = eval('('+this.responseText+')');
			utm.setActivityIndicator('');
			Titanium.Analytics.featureEvent('user.viewed_myHorts');
			if (this.status == 200) {

				utm.log("MyHort data returned " + response.length + '  myHorts returned');
				populateTable(response);
				utm.User.MyHorts=response;
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
			
			Ti.API.info(myHortData[i].isOwner);
			
			var icon = Ti.UI.createImageView({
					image : myHortData[i].IsOwner ? '/images/ownerIcon.png' : '/images/memberIcon.png',
					width : 20,
					height : 20,
					left:3,
					top:15
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
		utm.myHortDetailWindow = new utm.MyHortDetailWindow(myHortData,utm,myHortData.IsOwner);
		utm.myHortDetailWindow.title = myHortData.FriendlyName;
		utm.navController.open(utm.myHortDetailWindow);

	});

	tableView.addEventListener('delete', function(e) {
		var s = e.section;
		
		if(!e.rowData.myHortData.IsOwner){
			populateTable(utm.User.MyHorts);
			alert('You can only delete MyHorts that you own.');
			return;
		}
		
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
			}else{
				populateTable(utm.User.MyHorts);
			}
		});
		dialog.show();
	}

	// ##################### DELETE MyHort #####################
	function deleteMyHort(myHortId) {
		utm.log('Deleting MyHort ' + myHortId);
		utm.setActivityIndicator('Deleting...');
		deleteMyHortDetailReq.open("GET", utm.serviceUrl + "MyHort/DeleteUsersMyHort?myhortId=" + myHortId);
		deleteMyHortDetailReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		deleteMyHortDetailReq.setRequestHeader('Authorization-Token', utm.AuthToken);
		removeFromUsersList(myHortId);
		deleteMyHortDetailReq.send();
	}

	var deleteMyHortDetailReq = Ti.Network.createHTTPClient({
		validatesSecureCertificate : utm.validatesSecureCertificate,
		onload : function() {
			utm.setActivityIndicator('');
						
			//loadMyHorts();
		},
		onerror : function() {
			utm.setActivityIndicator('');
			utm.log('error');
		}
	});
	
	function removeFromUsersList(myHortId){
		for(i=0; i< utm.User.MyHorts.length; i++ ){
			var mh = utm.User.MyHorts[i];
			if(mh.MyHortId= myHortId){
				utm.User.MyHorts.splice(i,1);
				break;
			}
		}
	}
	

	myHortsWindow.addEventListener('blur', function() {
		if(utm.iPhone || utm.iPad){
			myHortsWindow.setRightNavButton(edit);
		}
		tableView.editing = false;
	});

	Ti.App.addEventListener('app:loadMyHorts', function() {
		loadMyHorts();
	});
	
	//Added to clear out the myhort list in case someone re-logs in as another user
	Ti.App.addEventListener('app:loginSuccess', function(){
		tableView.setData([]);		
	});

	return myHortsWindow;

}
module.exports = MyHorts_window;