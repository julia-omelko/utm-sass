exports.TwitterOAuth = function(){
	//https://github.com/ebryn/twitter-titanium/blob/master/Resources/app.js
	Ti.API.info('TTTTT Twitter Created');
   var TwitterOAuth = require('twitter').Twitter;
    
    
    
    var twitterClient = TwitterOAuth({
      consumerKey: utm.twitterConsumerKey,
      consumerSecret: utm.twitterConsumerSecret,
      accessTokenKey: accessTokenKey, 
      accessTokenSecret: accessTokenSecret
    });
    
	
			
	return twitterClient;
};