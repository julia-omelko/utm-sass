/**
 * CommonJS UnlockCode
 * @version      1.0
 * @author       Willem Peters
 */

/*
 * Public Member Functions
 * (id)     - initWithTitle:withCodeLength:andDelegate:
 * (void)     - setCodeLength:
 * (void)     - setKeyboardType:
 * (void)     - clearCode
 *
 * Properties
 * int     codeLength
 * UILabel *     securityLabel
 * UIImageView *     bgImgView
 * NSArray *     boxes
 * UIKeyboardType     keyboardType
 * BOOL     autoDone
 * float     boxFontSize
 * UIColor *     boxTextColor
 * id < ALUnlockCodeViewControllerDelegate >     delegate
*/

// "Constants"
//exports.STYLE_HINT = 'hint';

// Private vars & layouts
var txtColor = '#ffffff',
    winDefault = { backgroundColor: utm.backgroundColor };

/**
 * Load the module
 * @param {Object} app The core app module
 */
exports.loadWindow = function(params) {
    Ti.API.info('UnlockScreen module: version 1.0');

    if(!params.configLockScreen) { params.configLockScreen = {}; }
    if(!params.messageBox) { params.messageBox = {}; }
    if(!params.passwordBox) { params.passwordBox = {}; }
    if(!params.timeOutBox) { params.timeOutBox = {}; }

    win = Ti.UI.createWindow(params.mainWindow || winDefault);

    var layout = new exports.layout(params);

    win.add(layout);
    win.open({
        modal: true,
        fullscreen: false,
        tabBarHidden: true,
        navBarHidden: true,
    });

    win.addEventListener('androidback',function(e){	
		var activity = Titanium.Android.currentActivity;
    	activity.finish();
    });

    return win;
};

/**
 * Layout
 * @param {Array} data
 */
exports.layout = function(params) {
    var timeOutSeconds = params.configLockScreen.timeOut/1000;
    var timeOutMilliseconds = params.configLockScreen.timeOut;
    var timeOutMultiplier = params.configLockScreen.timeOutMultiplier || 0;
    var attempts = 0;
    var platformWidth = Ti.Platform.displayCaps.platformWidth;
    var gapWidth = params.passwordBox.gapWidth || 20;

    var messageBoxDefault = {
        text: 'Enter unlock code',
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        top: 30,
        color: utm.barColor,
        font: {
            fontFamily: utm.fontFamily,
            fontWeight: 'bold',
            fontSize: '25dp'
        },
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
    };

    var passwordDefault = {
        color: '#000000',
        top: 15,
        width: Math.round(Ti.Platform.displayCaps.platformWidth/6),
        height: Math.round(Ti.Platform.displayCaps.platformWidth/6),
        passwordMask: true,
        font: {
            fontFamily: utm.fontFamily,
            fontWeight: 'bold',
            fontSize: 25
        },
        textAlign: 'center',
        touchEnabled: true,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: utm.barColor,
        keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD,
        borderStyle: ((Ti.Platform.osname === 'android') ? null : Ti.UI.INPUT_BORDERSTYLE_ROUNDED)
    };

    var passwordHiddenBoxDefault = {
        color: 'white',
        height: 20,
        width: platformWidth,
        top: ((Ti.Platform.osname === 'android') ? -100 : 0),
        left: 0,
        passwordMask: true,
        font: { fontSize: 20 },
        visible: ((Ti.Platform.osname === 'android') ? true : false),
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD,
        returnKeyType: Ti.UI.RETURNKEY_DEFAULT
    };
    if (Ti.Platform.osname === 'android') {
        passwordHiddenBoxDefault.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
    }

    var timeOutBoxDefault = {
        text: timeOutSeconds,
        height: params.timeOutBox.height || 65,
        width: params.timeOutBox.width || platformWidth-20,
        top: params.timeOutBox.top || 185,
        left: params.timeOutBox.left || 10,
        color: params.timeOutBox.color || '#ffffff',
        font: params.timeOutBox.font || {
            fontFamily: utm.fontFamily,
            fontWeight: 'bold',
            fontSize: 25
        },
        visible: false,
        textAlign: params.timeOutBox.textAlign || 'center'
    };

    if(utm.Android){
        var wrapper = Ti.UI.createScrollView({
        scrollType: 'vertical',
        layout: 'vertical'
        });
    }
    if(utm.iPhone || utm.iPad ){
        var wrapper = Ti.UI.createScrollView({
	        showVerticalScrollIndicator : true,
	        showHorizontalScrollIndicator : false,
	        layout: 'vertical'
        });
    }

	var utmLogo = Ti.UI.createImageView({
		image:'/images/ytm_Narrow.png',
		width:'275dp',
		height:'71dp',
		top: 55
	});
	
	
    var messageBox = Ti.UI.createLabel(messageBoxDefault),
        password1 = Ti.UI.createTextField(passwordDefault),
        password2 = Ti.UI.createTextField(passwordDefault),
        password3 = Ti.UI.createTextField(passwordDefault),
        password4 = Ti.UI.createTextField(passwordDefault),
        passwordHiddenBox = Ti.UI.createTextField(passwordHiddenBoxDefault),
        timeOutBox = Ti.UI.createLabel(timeOutBoxDefault);

    password1.left = (platformWidth/2)-(gapWidth/2+gapWidth)-2*passwordDefault.width;
    password2.left = (platformWidth/2)-(gapWidth/2)-passwordDefault.width;
    password3.left = (platformWidth/2)+(gapWidth/2);
    password4.left = (platformWidth/2)+(gapWidth/2+gapWidth)+passwordDefault.width;

    wrapper.add(utmLogo);
    wrapper.add(messageBox);
    
    var passwordView = Ti.UI.createView({
    	height: Ti.UI.SIZE,
    	weight: Ti.UI.SIZE
    });
    wrapper.add(passwordView);
    
    passwordView.add(passwordHiddenBox);
    passwordView.add(password1);
    passwordView.add(password2);
    passwordView.add(password3);
    passwordView.add(password4);
    passwordView.add(timeOutBox);

    // get password code from hidden field
    passwordHiddenBox.addEventListener('change',function(e) {
        if(e.value.length <= 0) {
            password1.value = '';
            password2.value = '';
            password3.value = '';
            password4.value = '';
        } else if (e.value.length == 1) {
            password1.value = '*';
            password2.value = '';
            password3.value = '';
            password4.value = '';
        } else if (e.value.length == 2) {
            password1.value = '*';
            password2.value = '*';
            password3.value = '';
            password4.value = '';
        } else if (e.value.length == 3) {
            password1.value = '*';
            password2.value = '*';
            password3.value = '*';
            password4.value = '';
        } else if (e.value.length == 4) {
            password1.value = '*';
            password2.value = '*';
            password3.value = '*';
            password4.value = '*';

            if (params.configLockScreen.passCode.length !== 4) {
                e.value = Ti.Utils.sha256(e.value);
            }

            //password code check
            if(params.configLockScreen.passCode === e.value) {
                if (typeof params.correct == 'function') {
                    params.correct();
                }

                messageBox.color = params.messageBox.textColorCorrect || '#ffffff';
                messageBox.text = params.messageBox.textCorrect || 'Unlock Code Accepted';

                password1.value = '';
                password2.value = '';
                password3.value = '';
                password4.value = '';
                passwordHiddenBox.value = '';

                timeOutSeconds = params.configLockScreen.timeOut/1000;
                timeOutMilliseconds = params.configLockScreen.timeOut;
                timeOutBox.text = timeOutSeconds;

                Ti.API.info('UnlockScreen module: input is correct');

                win.close();
                //win = null;
            } else {
                if (typeof params.incorrect == 'function') {
                    params.incorrect();
                }

                messageBox.color = utm.color_org;
                messageBox.text = params.messageBox.textIncorrect || 'Wrong Unlock Code';

                // vibrate on incorrect password
                if(params.configLockScreen.vibrateOnIncorrect === true) { Ti.Media.vibrate(); }

                password1.value = '';
                password2.value = '';
                password3.value = '';
                password4.value = '';

                // disable input after amount of attempts
                if(params.configLockScreen.attempts > 0) {
                    attempts = attempts+1;

                    if(attempts == params.configLockScreen.attempts) {
                        win.touchEnabled = false;

                        password1.editable = false;
                        password2.editable = false;
                        password3.editable = false;
                        password4.editable = false;

                        passwordHiddenBox.editable = false;
                        passwordHiddenBox.blur();

                        timeOutBox.visible = true;

                        var i = timeOutSeconds;
                        var timerCountDown = setInterval(countDown, 1000);

                        function countDown() {
                            // need to clear interval
                            if(i <= 0) {
                                clearInterval(timerCountDown);
                                timeOutBox.text = timeOutSeconds;
                            } else {
                                timeOutBox.text = i-1;
                                i--;
                            }
                        }

                        setTimeout(function() {
                            attempts = 0;
                            if(timeOutMultiplier != 0) {
                                timeOutSeconds = timeOutSeconds * timeOutMultiplier;
                                timeOutMilliseconds = timeOutMilliseconds * timeOutMultiplier;
                            }

                            win.touchEnabled = true;

                            password1.editable = true;
                            password2.editable = true;
                            password3.editable = true;
                            password4.editable = true;

                            passwordHiddenBox.editable = true;
                            passwordHiddenBox.focus();

                            timeOutBox.visible = false;

                            messageBox.text = params.messageBox.text || 'Enter your passcode';
                            messageBox.color = params.messageBox.color || '#ffffff';
                        }, timeOutMilliseconds);
                    } else {
                        passwordHiddenBox.value = '';
                        passwordHiddenBox.focus();
                    }
                } else {
                    passwordHiddenBox.value = '';
                    passwordHiddenBox.focus();
                }

                Ti.API.info('UnlockScreen module: input is incorrect');
            }
        }
    });

    // set focus on passwordHiddenBox field
    win.addEventListener('focus', function() {
        passwordHiddenBox.focus();
    });
    win.addEventListener('click', function() {
        passwordHiddenBox.focus();
    });
    password1.addEventListener('click', function() {
        passwordHiddenBox.focus();
    });
    if (Ti.Platform.osname === 'android') {
        win.addEventListener('open', function() {
            passwordHiddenBox.focus();
        });
    }

    return wrapper;
};