var PrivacyWin = function() {
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Privacy Policy', '');

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
	aLabel.push('Statement of Privacy Policy');
	aLabel.push('Protecting your private information is our priority. This Statement of Privacy applies to the www.youthisme.com and UThisMe, LLC ("UTM") and governs data collection and usage. For the purposes of this Privacy Policy, unless otherwise noted, all references to UThisMe, LLC include www.youthisme.com and UTM. The UTM website is a Secret Messaging Service site. By using the UTM website, you consent to the data practices described in this statement.');
	
	aLabel.push('Collection of your Personal Information');
	aLabel.push('UTM may collect personally identifiable information, such as your name. If you purchase UTM’s products and services, we collect billing and credit card information. This information is used to complete the purchase transaction. We may gather additional personal or non-personal information in the future.');
	aLabel.push('Information about your computer hardware and software may be automatically collected by UTM. This information can include: your IP address, browser type, domain names, access times and referring website addresses. This information is used for the operation of the service, to maintain quality of the service, and to provide general statistics regarding use of the UTM website.');
	aLabel.push('UTM encourages you to review the privacy statements of websites you choose to link to from UTM so that you can understand how those websites collect, use and share your information. UTM is not responsible for the privacy statements or other content on websites outside of the UTM website.');
	
	aLabel.push('Use of your Personal Information');
	aLabel.push('UTM collects and uses your personal information to operate its website(s) and deliver the services you have requested.');
	aLabel.push('UTM may also use your personally identifiable information to inform you of other products or services available from UTM. UTM may also contact you via surveys to conduct research about your opinion of current services or of potential new services that may be offered.');
	aLabel.push('UTM does not sell, rent or lease its customer lists to third parties.');
	aLabel.push('UTM stores the original messages created by you to others only in encrypted form. UTM stores pictures sent by you to others only in encrypted form.');
	aLabel.push('UTM creates "quotidian" fake messages as surrogates of your original messages. Any degree of similarity of UTM’s quotidian messages which incorporate randomly generated names, places and dates to actual individuals who use the service is purely coincidental.');
	aLabel.push('UTM will disclose your personal information, without notice, only if required to do so by law or in the good faith belief that such action is necessary to: (a) satisfy any applicable law, regulation, legal process or governmental request; (b) enforce the Terms, including investigation of potential violations hereof; (c) detect, prevent, or otherwise address fraud, security or technical issues; (d) respond to user support requests; or (e) protect the rights, property or safety of YouThisMe®, its users and the public.');
	
	aLabel.push('Security of your Personal Information');
	aLabel.push('To secure your personal information from unauthorized access, use or disclosure, UTM uses the following:');
	aLabel.push('Panoptic Security for PCI compliance.\nCigital, Inc.for on-going security testing.\nAES256 encryption software that is FIPS 197 and NIST compliant.');
	aLabel.push('When personal information (such as a credit card number) is transmitted to other websites, it is protected through the use of encryption, such as the Secure Sockets Layer (SSL) protocol. Data sent via UTM mobile application is never stored on mobile device.');
	
	aLabel.push('Children Under Thirteen');
	aLabel.push('UTM does not knowingly collect personally identifiable information from children under the age of thirteen. If you are under the age of thirteen, you must ask your parent or guardian for permission to use this website.');
	
	aLabel.push('Disconnecting your UTM Account from Third Party Websites');
	aLabel.push('You will be able to connect your UTM account to third party accounts. BY CONNECTING YOUR UTM ACCOUNT TO YOUR THIRD PARTY ACCOUNT, YOU ACKNOWLEDGE AND AGREE THAT YOU ARE CONSENTING TO THE CONTINUOUS RELEASE OF INFORMATION ABOUT YOU TO OTHERS (IN ACCORDANCE WITH YOUR PRIVACY SETTINGS ON THOSE THIRD PARTY SITES). IF YOU DO NOT WANT INFORMATION ABOUT YOU, INCLUDING PERSONALLY IDENTIFYING INFORMATION, TO BE SHARED INTHIS MANNER, DO NOT USE THE THIS FEATURE. You may disconnect your account from a third party account at any time. Simply disassociate UTM with Twitter, Facebook.');
	
	aLabel.push('Opt-Out & Unsubscribe');
	aLabel.push('We respect your privacy and give you an opportunity to opt-out of receiving announcements of certain information. Users may opt-out of receiving any or all communications from UTM by contacting us here:');
	aLabel.push('- Web page: www.youthisme.com/unsubscribe\n- Email: unsubscribe@youthisme.com\n- Phone: 888-892-8068');
	
	aLabel.push('Changes to this Statement');
	aLabel.push('UTM will occasionally update this Statement of Privacy to reflect company and customer feedback. UTM encourages you to periodically review this Statement to be informed of how UTM is protecting your information.');
	
	aLabel.push('Contact Information');
	aLabel.push('UTM welcomes your questions or comments regarding this Statement of Privacy. If you believe that UTM has not adhered to this Statement, please contact UTM at:');
	aLabel.push('UThisMe, LLC\nOne Hudson City Centre\nHudson, New York 12534\nEmail Address:\nlegal@youthisme.com\nTelephone number:\n888-892-8068');
	
	
	
	for (var i=0; i<aLabel.length; i++) {
		if ([0,2,6,13,17,19,21,24,26].indexOf(i) >= 0) {
			var privacyText = Ti.UI.createLabel({
				text: aLabel[i],
				left: 20*utm.sizeMultiplier,
				height: Ti.UI.SIZE,
				right: 20*utm.sizeMultiplier,
				top: 10,
				font: {fontSize: '18dp', fontWeight: 'bold'},
				color: 'white'
			});
		} else {
			var privacyText = Ti.UI.createLabel({
				text: aLabel[i],
				left: 20*utm.sizeMultiplier,
				height: Ti.UI.SIZE,
				right: 20*utm.sizeMultiplier,
				top: 10,
				font: {fontSize: utm.fontSize},
				color: 'white'
			});
		}
		mainView.add(privacyText);
		

		
	}

	
	
	return self;
};
module.exports = PrivacyWin;

