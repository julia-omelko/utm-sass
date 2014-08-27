var WhoWeAreWin = function() {
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Who We Are', '');

	var BackButton = require('ui/common/baseui/BackButton');
	var backButton = new BackButton(self);
	self.setLeftNavButton(backButton);
	
	var mainView = Ti.UI.createScrollView({
		height: '100%',
		width: '100%',
		backgroundColor: '#ED5C00',
		layout: 'vertical'
	});
	self.add(mainView);

	var aLabel = [];
	
	aLabel.push('Hey, who are you guys?');
	aLabel.push('We want to protect your privacy when you send text messages. We also want to make it safe for you to post to Twitter and Facebook without having your posts come into the wrong hands or be misunderstood.');
	aLabel.push('We do this by camouflaging your text messages in a way that conceals them from anyone other than your intended recipients.');
	aLabel.push('YouThisMe® is the safest way to protect your privacy when you text, email, Tweet and post to Facebook. And, it’s easy (and a lot of fun) to use.');
	
	aLabel.push('Why the strange name?');
	aLabel.push('Well, YouThisMe® can be read as "This is between You and Me."');
	aLabel.push('It’s not only the safest way to protect what you put out on the Internet; it also uses a unique method that makes the message you write look completely different to prying eyes. When you use YouThisMe®, your friends know ahead of time that you’re using this special method of communicating.');
	
	aLabel.push('OK, give me an example.');
	aLabel.push('Kate wants to warn her friend Cindy that something she said shouldn’t be mentioned to Hank. She’s worried about texting it, since Hank sometimes sees Cindy’s phone in plain sight. But, Kate really needs to tell her *now* not to tell Hank about what she said. Email might not work, and Kate’s worried about leaving voice mail.');
	
	aLabel.push('What to do?');
	aLabel.push('YouThisMe® comes to the rescue:');
	aLabel.push('Kate opens her YouThisMe® app on her smartphone and types her message to Cindy.');
	
	aLabel.push('But when Cindy looks at the message from Kate on her phone it reads;');
	
	aLabel.push('Kate’s message about the weather might appear as a text on Cindy’s smartphone, on Kate’s timeline on Twitter, or posted as her status on Facebook. Nothing is mentioned about Hank. Since Cindy and Kate have been using YouThisMe® to exchange messages, Cindy knows that the message from Cindy is a signal – hidden in plain sight – for her to open her YouThisMe® app and retrieve the real message.');
	aLabel.push('So, Kate’s message about Hank is "hidden" in some chatter about the weather. Even if Hank could read the message, Kate’s real message is never revealed, except to Cindy.');
	
	aLabel.push('Hmmm sounds interesting. But, am I limited to 160 characters in regular text messages or 140 characters on Twitter?');
	aLabel.push('NO! You can send thousands or millions of characters. You can even send pictures. Everything you send is changed to a short text message that conceals what you really sent.');

	for (var i=0; i<aLabel.length; i++) {
		var whoText = Ti.UI.createLabel({
			text: aLabel[i],
			left: 20*utm.sizeMultiplier,
			height: Ti.UI.SIZE,
			right: 20*utm.sizeMultiplier,
			top: 10,
			font: {fontSize: utm.fontSize, fontWeight: (([0,4,7,9,15].indexOf(i) >= 0) ? 'bold' : 'normal')},
			color: 'white'
		});
		mainView.add(whoText);
		
		if (i === 11) {
			var whoImage = Ti.UI.createImageView({
				top: 10,
				image: '/images/whatExample1.png',
				left: 20,
				right: 20
			});
			mainView.add(whoImage);
		} else if (i === 12) {
			var whoImage = Ti.UI.createImageView({
				top: 10,
				image: '/images/whatExample2.png',
				left: 20,
				right: 20
			});
			mainView.add(whoImage);
		}
		
	}

	
	
	return self;
};
module.exports = WhoWeAreWin;

