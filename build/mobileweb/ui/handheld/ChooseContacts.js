var ChooseContacts_window =function() {

	var chooseContactsView = Titanium.UI.createView({
	   borderRadius:10,
	   width:'auto',
	   height:'auto',
	   layout:'vertical'
	});	

	var chooseContactsLabel = Ti.UI.createLabel({
			text:'Select Recipient(s)',
			top:6,
			width:'auto',
			height:30,
			textAlign:'center'
	});
	chooseContactsView.add(chooseContactsLabel);		
	
	
	
	var chooseMyhortButton = Ti.UI.createButton({
		title:'Write Your Message',
		top:34,
		width:'auto',
		height:30
	});	
	chooseContactsView.add(chooseMyhortButton);
	
	chooseMyhortButton.addEventListener('click',function()
	{		
		Ti.App.fireEvent("app:contactsChoosen", {
		        myHortId: 'todo'
		    });	
		
	});
	
	
	Ti.App.addEventListener('app:myHortChoosen',function(e){
	//************* get Contacts*************
		log('call server and get contact list'+e.myHortId);
		var getMessagesReq = Ti.Network.createHTTPClient({
				 // function called when the response data is available
		     onload : function(e) {
		         Ti.API.info("Received text: " + this.responseText);
		        var json = this.responseData;
				var response = JSON.parse(json);
				//Received text: [{"UserId":1004,"MyHortId":1003,"MemberType":"Primary","NickName":"Ant","HasMobile":true,"HasEmail":true,"HasFaceBook":false,"HasTwitter":false}]
				
				if(this.status ==200){					
					log("data returned:"+response);
					var data = [];
					
					for (var i=0;i<response.length;i++)
					{
						var row = Ti.UI.createTableViewRow();
						
						var l = Ti.UI.createLabel({
							left:5,
							font:{fontSize:20, fontWeight:'bold'},
							color:'#000',
							text:response[i].NickName
						});
						row.add(l);
						data[i] = row;
					}
					
					// create table view
					var tableview = Titanium.UI.createTableView({
						data:data,
						style: Titanium.UI.iPhone.TableViewStyle.GROUPED
					});
					
					chooseContactsView.add(tableview);	
					
					
				}else if(this.status == 400){				
					log("Error:"+this.responseText);				
				}else{
					log("error");				
				}		
		     },
		     // function called when an error occurs, including a timeout
		     onerror : function(e) {
		         Ti.API.debug(e.error);
		         alert('error');
		     }
				
			
		});	
		getMessagesReq.open("GET",utm.serviceUrl+"Members?myHortId=1003");
		getMessagesReq.setRequestHeader('Authorization-Token', utm.User.UserProfile.AuthToken);	
		getMessagesReq.send();
		
		//*************** end  *************	
		
		
	});

		
			
	
	
	
	
	/*
	
	var chooseMyhortButton = Ti.UI.createButton({
		title:'Choose',
		top:34,
		width:120,
		height:30
	});	
	chooseContactsView.add(chooseMyhortButton);
	
	chooseMyhortButton.addEventListener('click',function()
	{		
		Ti.App.fireEvent("app:myHortChoosen", {
		        myHortId: 'todo'
		    });	
		
	});
	*/
	
	
	
		
	function log(message){		
		Ti.API.info(message);		
	}
	
	
	return chooseContactsView;
	
	
}
module.exports = ChooseContacts_window;
