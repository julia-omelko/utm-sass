var RulesOfUseWin = function() {
	
	var StandardWindow = require('ui/common/StandardWindow');
	var self = new StandardWindow('Rules of Use', '');

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

aLabel.push('RULES OF THE GAME');
aLabel.push('For YouThisMe® to work effectively and honestly, everyone needs to play by the same set of rules without intent to abuse, exploit, modify, coopt, appropriate or endanger other users, YouThisMe® systems and software, or the operators of YouThisMe®. These are all common-sense rules. All users must abide by them in good faith or risk having their accounts suspended or canceled.');
aLabel.push('· Impersonation: You may not impersonate others using the YouThisMe® service in a manner that does or is intended to mislead, confuse, or deceive others.');
aLabel.push('· Trademark: We reserve the right to reclaim user names on behalf of businesses or individuals that hold legal claim or trademark on those user names. Accounts using business names and/or logos to mislead others will be permanently suspended.');
aLabel.push('· Privacy: You may not publish or post other people’s private and confidential information, such as credit card numbers, street addresses or Social Security/National Identity numbers, without their express authorization and permission.');
aLabel.push('· Violence and Threats: You may not publish or post direct, specific threats of violence against others.');
aLabel.push('· Copyright: We will respond to clear and complete notices of alleged copyright infringement. Our copyright procedures are set forth in the Terms of Service.');
aLabel.push('· Unauthorized Export: Because YouThisMe® uses encryption technology that is or may be regulated for export by the United States government, you may not export, or otherwise transfer the service to or into Cuba, Iraq, North Korea, Sudan or Syria or a resident of those countries. You also may not export, or otherwise transfer the service to any person on the Specially Designated Nationals List (http://www.treasury.gov/resource-center/sanctions/SDN-List) or the Denied Persons List (http://www.bis.doc.gov/index.php/the-denied-persons-list). Similarly, you may not export, or otherwise transfer the service to any entity on the Export Administration Regulations ("EAR") Entity List (available at bit.ly/18gOCnP). You also may not, and you agree to not, knowingly export or transfer YouThisMe®’s service to anyone outside of the United States without first obtaining a proper license and satisfying all requirements of International Traffic in Arms Regulations and the Export Administration Act.');
aLabel.push('· Unlawful Use: You may not use our service for any unlawful purposes or in furtherance of illegal activities. It is your responsibility to comply with foreign laws and regulations on encryption import, export or use. International users agree to comply with all local laws regarding online conduct and acceptable content.');
aLabel.push('· Spam & Abuse: You may not use the YouThisMe® service for the purpose of spamming anyone. Any accounts engaging in the activities specified below are subject to permanent suspension.');
aLabel.push('· Creating serial accounts for disruptive or abusive purposes.');
aLabel.push('· Mass account creation or overlapping use cases may result in suspension of all related accounts.');
aLabel.push('· Creating accounts for the purpose of preventing others from using those account names.');
aLabel.push('· Creating accounts for the purpose of selling those accounts.');
aLabel.push('· Using YouThisMe®.com’s address book contact import to send repeat, mass invitations.');
aLabel.push('· Selling user names: You may not buy or sell YouThisMe® usernames.');
aLabel.push('· Malware/Phishing: You may not publish or link to malicious content intended to damage or disrupt another user’s browser or computer or to compromise a user’s privacy.');
aLabel.push('· Pornography: You may not use pornographic or obscene images.');
aLabel.push('YouThisMe® reserves the right to immediately terminate your account without further notice in the event that, in its sole judgment, you violate these Rules. These Rules are incorporated in their entirety in the Terms of Service agreement required for validated use of YouThisMe®.');

aLabel.push('TERMS OF SERVICE');
aLabel.push('These Terms of Service ("Terms") govern your access to and use of the services, including our websites, Mobile Apps, email notifications, web application, secret messaging system (the "Services" or “YouThisMe®”), and any information, text, graphics, photos or other materials you transmit using Services including text messages, digital media and email (collectively referred to as "Content"). Your access to and use of the Services are conditioned on your acceptance of and compliance with these Terms. When you subscribe to the Services and download the application, you are certifying to YouThisMe® that you are eligible to receive products exported from the United States, without any restrictions. By accessing or using the Services you agree to be bound by these Terms.');

aLabel.push('1. BASIC TERMS');
aLabel.push('You are responsible for your use of the Services, for any Content you transmit to others, and for any consequences thereof. The Content is stored in encrypted form on YouThisMe® central computing systems and is not capable of being decrypted without special information created at the time of use. The “innocent” messages (“UTMs,” i.e. messages that cloak your Content) are computer generated and may use randomly selected names, objects and places. UTMs are designed to appear like common sentences, exclamations, or observations. There is no claim to the veracity of the content of UTMs. You are responsible for any consequences of transmitting such UTMs to other parties. You may change the content of UTMs to clarify the nature of your communication to members of a communication group you’ve created (“MyHort®”). The actual content of UTMs, the modifications you make to UTMs, and their reception by MyHort® members, is completely your responsibility. UTMs may be viewed by the outside world since they will appear on SMS client software on cellular phones, mobile devices and other computing devices. Furthermore, UTMs can appear on Twitter®, on Facebook®, or on other postings of your choice on the Internet. Since the content of UTMs is meant to be commonplace and without significance, they can be viewed by others and presumably do not reflect actual intended content of communication. Any UTMs that reflect actual facts or states of affairs by you are entirely coincidental. Services are used by purchasing messages units or time periods for service (“Fees”) as purveyed on our website. Your use of Services will be terminated with no notice if Fees are not paid. You may use the Services only if you can form a binding contract with YouThisMe® and are not a person barred from receiving Services under the laws of the United States or other applicable jurisdiction. If you are accepting these Terms and using the Services on behalf of a company, organization, government, or other legal entity, you represent and warrant that you are authorized to do so. You may use the Services only in compliance with these Terms and all applicable local, state, national, and international laws, rules and regulations. The Services that YouThisMe® provides are always evolving and the form and nature of the Services that YouThisMe® provides may change from time to time without prior notice to you. In addition, YouThisMe® may stop (permanently or temporarily) providing the Services (or any features within the Services) to you or to users generally and may not be able to provide you with prior notice. We also retain the right to create limits on use and storage at our sole discretion at any time without prior notice to you.');

aLabel.push('2. PRIVACY');
aLabel.push('Any information that you provide to YouThisMe® is subject to the YouThisMe® Privacy Policy ( here), which governs our collection and use of your information. You understand that through your use of the Services you consent to the collection and use (as set forth in the Privacy Policy) of this information, including the transfer of this information to the United States and/or other countries for storage, processing and use by YouThisMe®. As part of providing you the Services, we may need to provide you with certain communications, such as service announcements and administrative messages. These communications are considered part of the Services and your YouThisMe® account, which you may not be able to opt-out from receiving.');

aLabel.push('3. PASSWORDS');
aLabel.push('You are responsible for safeguarding the password that you use to access the Services and for any activities or actions under your password. We encourage you to use "strong" passwords (passwords that use a combination of upper and lower case letters, numbers and symbols) with your account. YouThisMe® cannot and will not be liable for any loss or damage arising from your failure to comply with the above.');

aLabel.push('4. CONTENT ON THE SERVICES');
aLabel.push('All Content transmitted by you using the Services is the sole responsibility of the person who originated such Content. We may not monitor or control the Content posted via the Services and, we cannot take responsibility for such Content. Any use or reliance on any Content or materials posted via the Services or obtained by you through the Services is at your own risk. We do not endorse, support, represent or guarantee the completeness, truthfulness, accuracy, or reliability of any Content or communications posted via the Services or endorse any opinions expressed via the Services. You understand that by using the Services, you may be exposed to Content that might be offensive, harmful, inaccurate or otherwise inappropriate, or in some cases, messages that have been misaddressed. Under no circumstances will YouThisMe® be liable in any way for any Content, including, but not limited to, any errors or omissions in any Content, or any loss or damage of any kind incurred as a result of the use of any Content posted, emailed, transmitted or otherwise made available via the Services or broadcast elsewhere.');

aLabel.push('5. YOUR RIGHTS');
aLabel.push('You retain your rights to any Content you submit, transmit or display on or through the Services. YouThisMe® makes every attempt to insure the secrecy and privacy of your Content. YouThisMe® does not share your registration information or your Content with third parties. You are responsible for your use of the Services, for any Content you provide, and for any consequences thereof, including the use of your Content by other users in your chosen MyHorts®.');

aLabel.push('6. YOUR LICENSE TO USE THE SERVICES');
aLabel.push('YouThisMe®gives you a personal, worldwide, royalty-free, non-assignable and non-exclusive license to use the software that is provided to you by YouThisMe® as part of the Services in conjunction with Fees affixed by YouThisMe® for your use of Services. This license is for the sole purpose of enabling you to use and enjoy the benefit of the Services as provided by YouThisMe®, in the manner permitted by these Terms. If payments of Fees for Services are interrupted or terminated by any means, your rights to use Services can be terminated with no prior notice.');

aLabel.push('7. YouThisMe® RIGHTS');
aLabel.push('All right, title, and interest in and to the Services (excluding Content provided by users) are and will remain the exclusive property of YouThisMe® and its licensors. The Services are protected by copyright, trademark, and other laws of both the United States and foreign countries. Nothing in the Terms gives you a right to use the YouThisMe® name or any of the YouThisMe® trademarks, logos, domain names, and other distinctive brand features. Any feedback, comments, or suggestions you may provide regarding YouThisMe® or the Services is entirely voluntary and we will be free to use such feedback, comments or suggestions as we see fit and without any obligation to you.');

aLabel.push('8. RESTRICTIONS ON CONTENT & USE OF SERVICES');
aLabel.push('We reserve the right at all times (but will not have an obligation) to remove or refuse to distribute any Content on the Services, to suspend or terminate users, and to reclaim usernames without liability to you. We also reserve the right to access, read, preserve, and disclose any information as we reasonably believe is necessary to (i) satisfy any applicable law, regulation, legal process or governmental request; (ii) enforce the Terms, including investigation of potential violations hereof; (iii) detect, prevent, or otherwise address fraud, security or technical issues; (iv) respond to user support requests; or (v) protect the rights, property or safety of YouThisMe®, its users and the public. YouThisMe® does not disclose personally identifying information to third parties except in accordance with our Privacy Policy. You may not do any of the following while accessing or using the Services: access, tamper with, or use non-public areas of the YouThisMe® website or application, YouThisMe®’s computer systems, or the technical delivery systems of YouThisMe®’s internet providers; probe, scan, or test the vulnerability of any system or network or breach or circumvent any security or authentication measures; access or search or attempt to access or search the Services by any means (automated or otherwise); forge any TCP/IP packet header or any part of the header information in any email or posting, or in any way use the Services to send altered, deceptive or false source-identifying information; or interfere with, or disrupt, (or attempt to do so), the access of any user, host or network, including, without limitation, sending a virus, overloading, flooding, spamming, mail-bombing the Services, or by scripting the creation of Content in such a manner as to interfere with or create an undue burden on the Services.');

aLabel.push('9. COPYRIGHT POLICY');
aLabel.push('YouThisMe® respects the intellectual property rights of others and expects users of the Services to do the same. We will respond to notices of alleged copyright infringement that comply with applicable law and are properly provided to us. If you believe that your Content has been copied in a way that constitutes copyright infringement, please provide us with the following information: a physical or electronic signature of the copyright owner or a person authorized to act on their behalf; identification of the copyrighted work claimed to have been infringed; identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed or access to which is to be disabled, and information reasonably sufficient to permit us to locate the material; your contact information, including your address, telephone number, and an email address; a statement by you that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law; and a statement that the information in the notification is accurate, and, under penalty of perjury, that you are authorized to act on behalf of the copyright owner.');
aLabel.push('Send this information to UThisMe, LLC ');
aLabel.push('Attn: Legal Department One Hudson City Centre Hudson, New York 12534');
aLabel.push('Email: legal@youthisme.com');
aLabel.push('We reserve the right to remove Content alleged to be infringing without prior notice, at our sole discretion and without liability to you.');

aLabel.push('10. ENDING THESE TERMS');
aLabel.push('The Terms will continue to apply until terminated by either you or YouThisMe® as follows. You may end your legal agreement with YouThisMe® at any time for any reason by deactivating your account and discontinuing your use of the Services. Any further charges by you owed to us in conjunction with our Fees to you will be discontinued. However, you will not be refunded any prepaid Fees once you deactivate your account. You must specifically inform YouThisMe® when you stop using the Services. If you discontinue or cancel payment of Fees without prior notice, we will notify you that your account is past due and may be canceled due to non-payment. We may suspend or terminate your accounts or cease providing you with all or part of the Services at any time for any reason, including, but not limited to, if we reasonably believe that (i) you have violated these Terms or the YouThisMe®Rules; (ii) you create risk or possible legal exposure for us; or (iii) our provision of the Services to you is no longer commercially viable. We will make reasonable efforts to notify you by the email address associated with your account or the next time you attempt to access your account. In all such cases, the Terms shall terminate, including, without limitation, your license to use the Services, except that the following sections shall continue to apply: 4, 5, 7, 8, 10, 11, and 12.');
aLabel.push('Nothing in this section shall affect YouThisMe®’s rights to change, limit or stop the provision of the Services without prior notice, as provided above in section 1.');

aLabel.push('11. DISCLAIMERS AND LIMITATIONS OF LIABILITY');
aLabel.push('Please read this section carefully since it limits the liability of YouThisMe® and its parents, subsidiaries, affiliates, related companies, officers, directors, employees, agents, representatives, partners, and licensors (“UThisMe, LLC”). Each of the subsections below only applies up to the maximum extent permitted under applicable law. Some jurisdictions do not allow the disclaimer of implied warranties or the limitation of liability in contracts, and as a result the contents of this section may not apply to you. Nothing in this section is intended to limit any rights you may have which may not be lawfully limited.');

aLabel.push('A. The Services are Available "AS IS"');

aLabel.push('Your access to and use of the Services or any Content are at your own risk. You understand and agree that the Services are provided to you on an "AS IS" and "AS AVAILABLE" basis. Without limiting the foregoing, to the maximum extent permitted under applicable law, UThisMe, LLC EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. UThisMe, LLC makes no warranty and disclaims all responsibility and liability for: the completeness, accuracy, availability, timeliness, security or reliability of the Services or any Content; any harm to your computer system, loss of data, or other harm that results from your access to or use of the Services or any Content; the deletion of, or the failure to store or to transmit, any Content and other communications maintained by the Services; and whether the Services will meet your requirements or be available on an uninterrupted, secure, or error-free basis. No advice or information, whether oral or written, obtained from the UThisMe, LLC or through the Services, will create any warranty not expressly made herein.');

aLabel.push('B. Limitation of Liability');

aLabel.push('TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, UTHISME, LLC SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOOD-WILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (i) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICES; (ii) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICES, INCLUDING WITHOUT LIMITATION, ANY DEFAMATORY, OFFENSIVE OR ILLEGAL CONDUCT OF OTHER USERS OR THIRD PARTIES; (iii) ANY CONTENT OBTAINED FROM THE SERVICES; OR (iv) UNAUTHORIZED ACCESS, USE OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT. IN NO EVENT SHALL THE AGGREGATE LIABILITY OF THE UTHISME, LLC EXCEED THE GREATER OF ONE HUNDRED U.S. DOLLARS (U.S. $100.00) OR THE AMOUNT YOU PAID UTHISME, LLC, IF ANY, IN THE PAST SIX MONTHS FOR THE SERVICES GIVING RISE TO THE CLAIM. THE LIMITATIONS OF THIS SUBSECTION SHALL APPLY TO ANY THEORY OF LIABILITY, WHETHER BASED ON WARRANTY, CONTRACT, STATUTE, TORT (INCLUDING NEGLIGENCE) OR OTHERWISE, AND WHETHER OR NOT UTHISME, LLC HAS BEEN INFORMED OF THE POSSIBILITY OF ANY SUCH DAMAGE, AND EVEN IF A REMEDY SET FORTH HEREIN IS FOUND TO HAVE FAILED OF ITS ESSENTIAL PURPOSE.');

aLabel.push('12. GENERAL TERMS');
aLabel.push('A. Waiver and Severability');

aLabel.push('The failure of YouThisMe® to enforce any right or provision of these Terms will not be deemed a waiver of such right or provision. In the event that any provision of these Terms is held to be invalid or unenforceable, then that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions of these Terms will remain in full force and effect.');

aLabel.push('B. Controlling Law and Jurisdiction');

aLabel.push('These Terms and any action related thereto will be governed by the laws of the State of New York without regard to or application of its conflict of law provisions or your state or country of residence. All claims, legal proceedings or litigation arising in connection with the Services will be brought solely in the federal or state courts located in Columbia County, New York, United States, and you consent to the jurisdiction of and venue in such courts and waive any objection as to inconvenient forum. If you are a federal, state, or local government entity in the United States using the Services in your official capacity and legally unable to accept the controlling law, jurisdiction or venue clauses above, then those clauses do not apply to you. For such U.S. federal government entities, these Terms and any action related thereto will be governed by the laws of the United States of America (without reference to conflict of laws) and, in the absence of federal law and to the extent permitted under federal law, the laws of the State of New York (excluding choice of law).');

aLabel.push('C. Entire Agreement');

aLabel.push('These Terms, the YouThisMe® Rules and our Privacy Policy are the entire and exclusive agreement between YouThisMe® and you regarding the Services (excluding any services for which you have a separate agreement with YouThisMe® that is explicitly in addition or in place of these Terms), and these Terms supersede and replace any prior agreements between YouThisMe® and you regarding the Services. Other than members of the group of companies of which UThisMe, LLC is the parent, no other person or company will be third party beneficiaries to the Terms. We may revise these Terms from time to time, the most current version will always be at www.youthisme.com If the revision, in our sole discretion, is material we will notify you via an e-mail to the email associated with your account or when you log in to your account. By continuing to access or use the Services after those revisions become effective, you agree to be bound by the revised Terms.');



aLabel.push('Refunds and Cancelations');
aLabel.push('You may unsubscribe from your YouThisMe® service at any time (https://www.youthisme.com/MyHorts/Unsubscribe).');
aLabel.push('For certain purchases and plans you may be entitled to a partial refund of your pre-paid YouThisMe® monthly service subscription');
aLabel.push('NOTE: This refund policy applies only to users who have purchased a monthly subscription to YouThisMe® through this website and have incurred a monthly service charge for the canceled subscription. It does not apply to users who have purchased a subscription through Apple’s In App Purchases');
aLabel.push('If you wish to discontinue or cancel your subscription to YouThisMe® and you purchased the subscription from this website, please click here. Your monthly payment obligation will be terminated as requested. In addition you will be refunded for the remaining unused messages for the month of your termination at a certain refund rate. This refund rate is calculated as the monthly subscription cost divided by the number of messages allowed for that month. For example: if you have a monthly subscription of $3.99 for 100 messages and you terminate your service with 10 days left in that month, you will not be charged for any succeeding month, plus you will be refunded $.40 (10 messages at $.04/message).');

aLabel.push('Apple App Store Message bundles, subscriptions and In App Purchases');
aLabel.push('If you purchase any YouThisMe® message bundles or subscriptions through Apple’s App Store, all sales are final, as per Apple’s App Store policy. This applies to any In-App purchases (i.e. message upgrades) you might have made.');

aLabel.push('Roll-over Policy and YouThisMe® Subscriptions');
aLabel.push('If you purchase a monthly subscription to YouThisMe® services on our website (not Apple’s App Store), you are allowed up to a 25% rollover of unused messages if you use 75% or more of your monthly allotment. Otherwise, you lose any unused messages from one month to another. If you consistently find that you use under 75% of your messages per month, we recommend that you downgrade your plan to one that is more suitable for your use. Example: If your plan gives you 100 messages per month, and you only use 20 messages that month, the 80 unused messages will not rollover to the next month. However, if you use 75 messages that month, the next month you will have 125 messages. In the event you purchase a term subscription (i.e. $14.99, five month, 500 message plan) and are In the last month of the subscription, any unused messages cannot be rolled over to a new plan.');




	
	for (var i=0; i<aLabel.length; i++) {
		if ([0,19,21,23,25,27,29,31,33,35,37,43,46,48,50,52,53,55,57,59,61,66,68].indexOf(i) >= 0) {
			var privacyText = Ti.UI.createLabel({
				text: aLabel[i],
				left: 20*utm.sizeMultiplier,
				height: Ti.UI.SIZE,
				right: 20*utm.sizeMultiplier,
				top: 10,
				font: {fontSize: '18dp', fontWeight: 'bold'},
				color: 'white'
			});
		} else if ([2,3,4,5,6,7,8,9,15,16,17].indexOf(i) >= 0) {
			var privacyText = Ti.UI.createLabel({
				text: aLabel[i],
				left: 30*utm.sizeMultiplier,
				height: Ti.UI.SIZE,
				right: 20*utm.sizeMultiplier,
				top: 10,
				font: {fontSize: utm.fontSize},
				color: 'white'
			});
		} else if ([10,11,12,13,14].indexOf(i) >= 0) {
			var privacyText = Ti.UI.createLabel({
				text: aLabel[i],
				left: 40*utm.sizeMultiplier,
				height: Ti.UI.SIZE,
				right: 20*utm.sizeMultiplier,
				top: 10,
				font: {fontSize: utm.fontSize},
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
module.exports = RulesOfUseWin;

