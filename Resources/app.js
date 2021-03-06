//utm is the js namespace for this app
utm = {};
utm.iPhone = false;
utm.iPad = false;
utm.Android = false;
utm.setEnvModePrefix = function (env){
	utm.envModePrefix = env;
	if (env === 'dev' || env === 'test') {
		utm.serviceUrl = 'https://' + env + '.youthisme.com/api/v1/';
		utm.webUrl = 'https://' + env + '.youthisme.com';
	} else if(env === 'prod') {
		utm.serviceUrl = 'https://prod.youthisme.com/api/v1/';
		utm.webUrl ='https://prod.youthisme.com';
	}	
};

getPlatformSize();
if (Ti.Platform.model === 'Simulator' || Ti.Platform.model ===  'google_sdk' || Ti.Platform.model ===  'sdk') { 
	utm.setEnvModePrefix("dev");
	utm.validatesSecureCertificate = false;
} else {
	utm.setEnvModePrefix("prod");
	utm.validatesSecureCertificate = true;
}	
utm.netTimeout = 18000;
utm.screenLockTime = 5000;

utm.color_org = '#F29737';
utm.barColor = '#22ACF5';
utm.androidBarColor = '#22ACF5';
utm.backgroundColor = '#F2F2F2';
utm.textColor = '#000000';
utm.secondaryTextColor = '#646473';
utm.textFieldColor='#000000';
utm.textErrorColor='#800000';
utm.buttonColor = '#F27100';
utm.androidTitleFontWeight = 'bold';
utm.androidLabelFontSize = 25;
if (utm.Android) {
	utm.fontFamily = 'Titillium-Light';
} else {
	utm.fontFamily = 'Titillium';
}
utm.fontSize = '14dp';

utm.androidProducts = [];


//Note 2 diff controllers based on platform folders
var NavigationController = require('NavigationController');
utm.navController = new NavigationController();

utm.twitterConsumerKey = ""; //'8qiy2PJv3MpVyzuhfNXkOw';
utm.twitterConsumerSecret = ""; //'Qq0rth4MHGB70nh20nSzov2zz6GbVxuVndCh2IxkRWI';
utm.facebookAppId = '494625050591800';

utm.showSplashScreenOnPause = true;
utm.screenWillLock = true;
utm.loggedIn = false;
utm.isInPinLock = false;
utm.appPauseTime = new Date();
utm.activityActive = 0;
utm.androidTimeout = (5*60*1000); // 5 minutes
utm.timer = '';
utm.keepAlive = true;  //only applies to iOS, used on create Titanium.Network.HTTPClient enableKeepAlive property


var unpinLockScreen = require('/lib/com.qbset.unlockscreen');

/*if (Ti.Platform.model === 'Simulator' || Ti.Platform.model ===  'google_sdk' || Ti.Platform.model ===  'sdk') {
    utm.setEnvModePrefix("dev");
    utm.validatesSecureCertificate = false;
} else {
   // utm.setEnvModePrefix("dev");
    utm.setEnvModePrefix("prod");
    utm.validatesSecureCertificate = true;
}*/



//Property values for securely
/*utm.securelySecretKey = "GRXV9J7237$Y";
var securely = require('bencoding.securely');
var SecureProperties = securely.createProperties({
    secret:utm.securelySecretKey,
    identifier:"pinCode",
    accessGroup:"com.utm",
    securityLevel:securely.PROPERTY_SECURE_LEVEL_MED,
    encryptFieldNames:false
});
*/


//utm.installId = SecureProperties.getString("installId");
//utm.currentPin = SecureProperties.getString("pin");


/*if (Ti.Platform.model === 'Simulator' || Ti.Platform.model ===  'google_sdk' || Ti.Platform.model ===  'sdk') {
    utm.environment = SecureProperties.getString("environment","test");    //utm.validatesSecureCertificate = false;
} else {
    utm.environment = SecureProperties.getString("environment","prod");
}
utm.setEnvModePrefix(utm.environment);
*/

(function() {
    var osname = Ti.Platform.osname,
        version = Ti.Platform.version,
        height = Ti.Platform.displayCaps.platformHeight,
        width = Ti.Platform.displayCaps.platformWidth;



        if (utm.installId == Ti.App.installId && utm.currentPin != null) {
            utm.pinIsNull = false;
            var showLoginPinLockScreen = require('/lib/showPinLockScreen');
            showLoginPinLockScreen(utm.currentPin);
            var d = new Date();
            var n = d.getTime();
            utm.User = Ti.App.Properties.getObject('userData');
            openTabGroup();
        } else {
            utm.pinIsNull = true;
            var Login = require('ui/common/Login');
            var loginView = new Login();
            utm.navController.open(loginView);
            Ti.UI.iOS.setAppBadge(0);
        }

})();






utm.keyboardHeight = 0;


(function() {
	var osname = Ti.Platform.osname,
		version = Ti.Platform.version,
		height = Ti.Platform.displayCaps.platformHeight,
		width = Ti.Platform.displayCaps.platformWidth;
	
	var Login = require('ui/common/Login');
	var loginView = new Login();
	utm.navController.open(loginView);

})();

// handle login
Ti.App.addEventListener('app:loginSuccess', handleLoginSuccess);
function handleLoginSuccess(event) {
	var msg = 'Login Success';
	utm.loggedIn = true;
	var d = new Date();
	var n = d.getTime();
	utm.activityActive = n;
	
	if (utm.User) {
		utm.User.MyHorts =[];
	}
	
	utm.User = event.userData;
	utm.AuthToken = event.userData.UserProfile.AuthToken;
	utm.twitterConsumerKey = event.userData.TwitterInfo.TwitterConsumerKey;
	utm.twitterConsumerSecret = event.userData.TwitterInfo.TwitterConsumerSecret;
	
	Ti.API.info(JSON.stringify(event.userData));
	if (utm.Android) {
		utm.products = event.userData.AndroidInAppProducts;
	} else {
		utm.products = event.userData.AppleInAppProductsFull;
	}
	
	
	utm.User.MyHorts = event.userData.MyHorts;

	utm.enableSendMessageButton=true;
	
	isSubscriptionValid(utm.User.UserProfile.SubscriptionEnds);
	if (utm.iPhone || utm.iPad ) {
		Ti.App.fireEvent('App:startTransactionListener');
	} else {
		if (utm.androidProducts.length) {
			//alert('existing: ' + utm.androidProducts.length);
		} else {
			//Ti.API.info(JSON.stringify(utm.products));
			Ti.include('android_purchase.js');
		}
	}
	openTabGroup();
}

// check if the user's subscription is up to date
function isSubscriptionValid(subscriptionEnds) {
	if (subscriptionEnds !== null) {
		var d = subscriptionEnds;
		var theYear = d.split('-')[0];
		var theMonth = d.split('-')[1];
		var theDay = d.split('-')[2].split('T')[0];
		var theHour = d.split('-')[2].split('T')[1].split(':')[0];
		var theMinute = d.split(':')[1];
		var theSecond = d.split(':')[2].split('.')[0];
		var theMilli = d.split('.')[1];
		var expiresUtmDT = new Date(theYear, theMonth-1, theDay, theHour, theMinute, theSecond, theMilli);
		var deviceDT = new Date();
		var deviceUtmDT = new Date(deviceDT.getFullYear(), deviceDT.getMonth(), deviceDT.getDate(), deviceDT.getHours(), deviceDT.getMinutes(), 0, 0);
		
		if (expiresUtmDT < deviceUtmDT && utm.User.UserProfile.HasSubscription) {
			// expired subscription
			utm.User.UserProfile.SubscriptionEnds = null;
			utm.User.UserProfile.MessagesRemaining = 0;
			return false;
		} else {
			// valid subscription
			return true;
		}
	} else {
		// no subscription
		return false;
	}
}

function openTabGroup() {
	var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
	utm.tabGroup = new ApplicationTabGroup();
	utm.tabGroup.open();
}

function formatDateTimeNoUTC(dateSent){
    var sent =  utm.moment(dateSent);
    var hours = sent.fromNow();
    var now = utm.moment();

   diff = now.diff(sent, 'days'); // 1

    if(diff > 0){
        return sent.format("M/D/YY");
        Ti.API.info('M/D/YY');
    }else{
        var sToSubtract = 0;
         Ti.API.info('subtract 30');

        if(now.milliseconds() << sent.milliseconds())
        {
            var sToSubtract = 30;
            Ti.API.info('XXXX');
        }

        return  formattedDateSent = sent.subtract(sToSubtract, 'seconds').fromNow();
    }
}

utm.moment = require('lib/moment-timezone-with-data-2010-2020');
var zoneNY = utm.moment.tz.zone("America/New_York");
function formatDateTimeUTC(dateSent){

    var currentUTCTime = utm.moment.utc();
    if(utm.correctTime){
        var utcDate = utm.moment.utc(dateSent);
    }else{
        var utcDate = utm.moment(dateSent);
    }


    //Correct by a minute IF the server time is ahead of time
    if(currentUTCTime < utcDate ){
        Ti.API.info('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
       Ti.API.info('currentUTCTime='+currentUTCTime);
       Ti.API.info('utcDate='+utcDate);
      var diffTime = currentUTCTime.diff(utcDate,'minutes');
       Ti.API.info('CORRECTED 1  diff = ' + diffTime);
       //Ti.API.info('CORRECTED 1  diffMin = ' + utm.moment(diffTime.duration().asMinutes()));

        utcDate=currentUTCTime;
        utcDate.add(1,'minute');
    }

    var sent = utcDate.local(); // Get the local version of that date


    var hours = sent.fromNow();
    var now = utm.moment();

    diff = now.diff(sent, 'days'); // 1

    if (diff > 0) {
        return sent.format("M/D/YY  h:mm a");
    } else {
        var sToSubtract = 0;
        if (now.milliseconds() << sent.milliseconds()) {
            var sToSubtract = 30;
        }
        return  formattedDateSent = sent.subtract(sToSubtract,'seconds').fromNow();
    }
}



//var UtmTwitterClient = require('/lib/UtmTwitter');
//utm.UtmTwitterClient = new UtmTwitterClient();

//var Twitter = require('/lib/UtmTwitter').Twitter;
    
var Twitter = require('lib/twitter').Twitter;

utm.UtmTwitterClient = Twitter({
  consumerKey: '05jZb3GCulM8STHQ5j8S8A',
  consumerSecret: 'xPFvoYfGSbk2M8HHkKJ66hUqJKxqPBo5cKmPLzBTIQ',
  accessTokenKey: '22675285-BAC9RcctRLWY50ytSQbJqdPg7EKU7koWPRMvkTc', 
  accessTokenSecret: 'qulNchLS0VI006S068SCLogoh15yXrlnYvyFfgwVvIo'
});




utm.UtmTwitterClient.authorize(); // Pops up a modal WebView
Ti.API.info('OOOOOOO 1');

	
	
	
utm.UtmTwitterClient.addEventListener('login', function(e) {
Ti.API.info('OOOOOOO 2');
  if (e.success) {
    // Your app code goes here... you'll likely want to save the access tokens passed in the event.
    Ti.API.info('OOOOOOO 3 Success');
    Ti.API.info('OOOOOOO 3 e.accessTokenKey'+e.accessTokenKey);
    Ti.API.info('OOOOOOO 3 e.accessTokenSecret'+e.accessTokenSecret);
    
    Ti.App.Properties.setString('twitterAccessTokenKey', e.accessTokenKey);
    Ti.App.Properties.setString('twitterAccessTokenSecret', e.accessTokenSecret);
    
    
    // Here's an example API call:
   /* client.request("1/statuses/home_timeline.json", {count: 100}, 'GET', function(e) {
      if (e.success) {
        var data = JSON.parse(e.result.text);
      } else {
      	Ti.API.info('OOOOOOO 4 error'+e.error);
        alert(e.error);
      }
    });
    */
    
    
  } else {
  	Ti.API.info('OOOOOOO 5 error'+e.error);
    alert(e.error);
  }
});




	



Ti.App.addEventListener('app:logout', callLogoutService);
function showLoginScreenLockView() {
	showLoginView();
}
function showLoginView() {
	if (utm.loggedIn) {
		utm.tabGroup.close();
		callLogoutService();
		utm.loggedIn = false;
	}	
	utm.User = null;
}

function callLogoutService(){
	var logoutReq = Ti.Network.createHTTPClient({
		validatesSecureCertificate:utm.validatesSecureCertificate, 
		timeout:utm.netTimeout,
		onload : function() {
			var response = eval('('+this.responseText+')');
			utm.loggedIn = false;
			logoutReq = null;
		},
		onerror : function(e) {
			utm.handleHttpError(e, this.status, this.responseText);
			logoutReq = null;
		},
		timeout:utm.netTimeout,
		enableKeepAlive : utm.keepAlive
	});

	logoutReq.open("POST", utm.serviceUrl + "Logout");
	logoutReq.setRequestHeader('Authorization-Token', utm.AuthToken);
	logoutReq.send();
	
}

// Note: this does not work in the simulator
var SplashView = require('ui/common/Splash');
var splashView = new SplashView();
Ti.App.addEventListener('pause', function(e){
	if (!utm.loggedIn || !utm.screenWillLock) {
		return;
	}
	if (utm.loggedIn) {
		utm.appPauseTime = new Date();
		splashView.open();
	}
});

Ti.App.addEventListener("resumed", function(e){
	if (!utm.loggedIn || !utm.screenWillLock) {
		return;
	}
	splashView.close();
	
	var curDate = new Date();
	var curMil = curDate.valueOf() ;
	var pauseMil = utm.appPauseTime.valueOf();
	var diff = curMil - pauseMil;
	/*if (diff > utm.screenLockTime) {
		var currentPin = SecureProperties.getString("pin");
		if (currentPin == null || currentPin == "") {
			showLoginScreenLockView();
		}else{
			showPinLockScreen(currentPin);
		}
	}	*/	
});

function showPinLockScreen(_pass) {
	if(_pass == null || utm.isInPinLock) {
		return;	
	}
	utm.isInPinLock = true;
	unlockWindow = unpinLockScreen.loadWindow({
		// main properties for the module
		configLockScreen: { // main properties for the module
			passCode: _pass, // set the passcode (string)
			attempts: 0, // zero for infinite attempts and no timeout (int)
			timeOut: 5000, // time out in miliseconds after amount of incorrect attempts. Only when attempts is bigger then zero (int)
			timeOutMultiplier: 2, // after each set of attempts the time out is multiplied with this property (int)
			vibrateOnIncorrect: true, // vibrate phone on incorrect passcode input (bool)				
		},
		// properties for the messageBox
		messageBox: {
			text: 'Enter Unlock Code',
			textCorrect: 'Unlock Code Accepted',
			textIncorrect: 'Wrong Unlock Code',
			textColorCorrect: '#ffffff',
			textColorIncorrect: '#ffffff',
			vibrateOnIncorrect: true,
			borderColor: '#ffffff',
			backgroundColor: '#F66F00'				
			},
		correct: function() {  	
			var d = new Date();
			var n = d.getTime();
			utm.activityActive = n;
			utm.isInPinLock = false;			      	
	    }
	});	
}

// this event fires when a user clicks to compose or reply to a message.
Ti.App.addEventListener('app:getSubscriptionInfo', function (e){
	var subscriptionInfoReq = Ti.Network.createHTTPClient({
		validatesSecureCertificate:utm.validatesSecureCertificate, 
		timeout:utm.netTimeout,
		enableKeepAlive : utm.keepAlive,
		onload : function() {
			var response = eval('('+this.responseText+')');
			if (this.status == 200) {		
				utm.User.UserProfile.MessagesRemaining = response.MessagesRemaining;
				utm.User.UserProfile.SubscriptionEnds = response.SubscriptionEnds;
				utm.User.UserProfile.HasSubscription = response.HasSubscription;
				if (utm.User.UserProfile.HasSubscription === false) {
					utm.User.UserProfile.SubscriptionEnds = null;
				}
				
				if (!isSubscriptionValid(utm.User.UserProfile.SubscriptionEnds) && utm.User.UserProfile.MessagesRemaining < 1) { 
					// user must subscribe
					SubscribeInfoWin = require('/ui/common/Subscribe');
					subscribeInfoWin = new SubscribeInfoWin(utm.tabGroup);
					utm.tabGroup.getActiveTab().open(subscribeInfoWin);
					alert('You have no more messages available.');
				} else {
					//Subscription is ok so fire the callback
					Ti.App.fireEvent(e.callBack);
				}
			} else {
				utm.handleHttpError({}, this.status, this.responseText);
			}
			subscriptionInfoReq = null;
		},
		onerror : function(e) {		
			utm.handleHttpError(e, this.status, this.responseText);
			subscriptionInfoReq = null;
		}
	});
	
	subscriptionInfoReq.open("GET", utm.serviceUrl + "SubscriptionInfo");
	subscriptionInfoReq.setRequestHeader('Authorization-Token', utm.AuthToken);
	subscriptionInfoReq.send();
});


utm.handleHttpError = function (e,status,responseText) {	
	var err = JSON.parse(responseText);
	var message = 'Error Unknown';
	
	if (status == 403) {
		message = 'Your session is no longer valid. Please log back in.';		
		utm.tabGroup.close();
		showLoginView();	
	} else if (err  != 'undefined' & err !=null ) {
		message = err.Message;	
 	} else if (e.error != 'undefined' & e.error.indexOf('timed out') > 0) {
		message = 'Your connection may be slow. Please try again.';	
 	} else if (e.error != undefined || err.Message != undefined) {
		message = 'Error:';
		message += e.error != undefined ? e.error : err.Message;
		if ( message.indexOf("ASIHTTPRequestErrorDomain Code=1") !== 0 ) {
			message = "Your network has had an error. Please try again.";	
		}
 	}
 	alert(message);
 	
};

utm.getDateTimeFormat =function (dateSent){

    if(utm.correctTime){
        return formatDateTimeUTC(dateSent);
        Ti.API.info('formatDateTimeUTC');
    }else{
        return formatDateTimeNoUTC(dateSent);
        Ti.API.info('formatDateTimeNoUTC');
    }
};



// if on iPad and screen orientation changed, get new layout dimensions, set values and fire orientdisplay event to adjust GUI elements
// (iphone and Android are locked into portait mode in tiapp.xml)
Ti.Gesture.addEventListener('orientationchange',function(e) {
	if (Ti.Platform.osname == 'ipad') {
		getPlatformSize();
		utm.keyboardHeight = Titanium.UI.PORTRAIT ? 264 : 352;
		Ti.App.fireEvent('orientdisplay');
	}
});

function getPlatformSize() {
	if (Ti.Platform.osname == 'iphone') {
		utm.iPhone = true;
		utm.viewableTop = 0;
		utm.viewableArea = Ti.Platform.displayCaps.platformHeight - 114;
		utm.viewableTabHeight = 0;
		utm.keyboardHeight = 0;
		utm.sizeMultiplier = 1;
	} else if (Ti.Platform.osname == 'ipad') {
		utm.iPad = true;
		utm.viewableTop = 0;
		utm.viewableArea = Ti.Platform.displayCaps.platformHeight - 114;
		utm.viewableTabHeight = 0;
		utm.keyboardHeight = 0;
		utm.sizeMultiplier = 1;
	} else if (Ti.Platform.osname == 'android') {
		utm.Android = true;
		utm.viewableArea = Ti.Platform.displayCaps.platformHeight;
		utm.sizeMultiplier = Math.round(Ti.Platform.displayCaps.platformWidth/32)/10;
		//utm.sizeMultiplier = Math.round(Ti.Platform.displayCaps.platformWidth/320);
		utm.viewableTop = 40*utm.sizeMultiplier;
		utm.viewableTabHeight = 0;
		utm.keyboardHeight = 0;
		if (Ti.App.Properties.getString('viewableTabHeight','') !== '') {
			utm.viewableTabHeight = Ti.App.Properties.getString('viewableTabHeight','');
		} else if (Ti.Platform.displayCaps.density === 'normal') {
			utm.viewableTabHeight = 64;
		} else if (Ti.Platform.displayCaps.density === 'low') {
			utm.viewableTabHeight = 48;
		} else {
			utm.viewableTabHeight = 96;
		}
		Ti.API.info(Ti.Platform.displayCaps.density);
	};
};

/*
utm.timeoutCompare = function(_n) {
	var d = new Date();
	var n = d.getTime();

	if (utm.activityActive === _n) {
		Ti.App.fireEvent('resumed');
	} else if (n-utm.activityActive >= utm.androidTimeout/2) {
		Ti.App.fireEvent('resumed'); 
	} else {
		//monitorGuid();
	}
};
	
utm.monitorGuid = function() {
	if (utm.timer !== '') {
		clearTimeout(utm.timer);
	}
	var d = new Date();
	var n = d.getTime();
	utm.activityActive = n;
	utm.timer = setTimeout(function(n) {
	    utm.timeoutCompare();
	}, utm.androidTimeout);
};
*/

