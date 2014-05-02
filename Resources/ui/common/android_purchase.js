/*jslint white:true plusplus:true nomen:true vars:true sloppy:true undef:false*/

var InAppProducts = require('com.logicallabs.inappproducts');

// This call (or any other) may fail on Android if the module hasn't finished
// its initialization routine yet -- always wait for the stateChange event!!!
Ti.API.info('Module ready? ' + 
	(InAppProducts.getSupportStatus() !== InAppProducts.SUPPORT_STATUS_ERROR));

// Note: These product IDs must match the product IDs you configure on
// iTunes Connect and Android Developer Console!
var productIDs =
	[
		"com.youthisme.unlimited"];
var productObjects, currentProduct, purchaseObjects, currentPurchase;

var ANDROID = Ti.Platform.osname === "android";

var buildPurchasesTable, purchaseStateToString, buildProductsTable,
updateProductWindow, updatePurchaseWindow;

function scale(dimension) {
	return Math.round(dimension * Ti.Platform.displayCaps.platformWidth / 320);
}

var cfg = {
	windows : {
		main : {
			title : "In-App Products Test",
			layout : "vertical",
			backgroundColor : "gray",
			fullScreen: false,
			exitOnClose: true,
			tabBarHidden : true,
			orientationModes: [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT]
		},
		products : {
			title : "Products",
			backgroundColor : "gray",
			tabBarHidden : true,
			orientationModes: [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT]
		},
		product : {
			title : "product",
			backgroundColor : "gray",
			tabBarHidden : true,
			layout : "vertical",
			orientationModes: [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT]
		},
		purchases : {
			title : "Purchases",
			backgroundColor : "gray",
			tabBarHidden : true,
			orientationModes: [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT]
		},
		purchase : {
			title : "Purchase",
			backgroundColor : "gray",
			tabBarHidden : true,
			layout : "vertical",
			orientationModes: [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT]
		}
	},
	table : {
		width : "100%",
		height : "100%",
		backgroundColor: 'transparent'
	},
	labels : {
		property : {
			font : {
				fontSize : scale(12)
			},
			color: "white",
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			top: scale(20)
		}
	},
	buttons : {
		standard : {
			font : {
				fontSize : scale(14)
			},
			width: scale(200),
			height: scale(40),
			top: scale(20),
			color: 'white',
			//backgroundImage: (ANDROID) ? 'button.png' : 'images/button.png',
			backgroundLeftCap: 7,
			backgroundSelectedColor: '#8C92AC'	
		}
	},
	tablerows: {
		color: 'white',
		font: {
			fontSize : scale(12)
		}
	}
};

var ti = {
	tabgroup : Ti.UI.createTabGroup(),
	windows : {
		main : Ti.UI.createWindow(cfg.windows.main),
		products : Ti.UI.createWindow(cfg.windows.products),
		product : Ti.UI.createWindow(cfg.windows.product),
		purchases : Ti.UI.createWindow(cfg.windows.purchases),
		purchase : Ti.UI.createWindow(cfg.windows.purchase)
	},
	tables : {
		//products : Ti.UI.createTableView(cfg.table),
		//purchases : Ti.UI.createTableView(cfg.table)
	},
	labels : {
		productTitle : Ti.UI.createLabel(cfg.labels.property),
		productProductID : Ti.UI.createLabel(cfg.labels.property),
		productDescription : Ti.UI.createLabel(cfg.labels.property),
		productPrice : Ti.UI.createLabel(cfg.labels.property),
		purchaseState : Ti.UI.createLabel(cfg.labels.property),
		purchaseDate : Ti.UI.createLabel(cfg.labels.property),
		purchaseID : Ti.UI.createLabel(cfg.labels.property),
		purchaseQuantity : Ti.UI.createLabel(cfg.labels.property),
		purchaseProductID : Ti.UI.createLabel(cfg.labels.property),
		purchasePurchaseToken : Ti.UI.createLabel(cfg.labels.property),
		purchaseApplicationPayload : Ti.UI.createLabel(cfg.labels.property)
	},
	buttons : {
		supportStatus : Ti.UI.createButton(cfg.buttons.standard),
		getProducts : Ti.UI.createButton(cfg.buttons.standard),
		cancelProductRequest : Ti.UI.createButton(cfg.buttons.standard),
		getPurchases : Ti.UI.createButton(cfg.buttons.standard),
		purchase : Ti.UI.createButton(cfg.buttons.standard),
		consume : Ti.UI.createButton(cfg.buttons.standard),
		originalPurchase : Ti.UI.createButton(cfg.buttons.standard)
	}
};

var alertError = function(e) {
	alert("Error: " + e.message);
};

function downloadStateToString(state) {
	Ti.API.info('Translating download state code ' + state);
	switch (state) {
		case InAppProducts.DOWNLOAD_STATE_WAITING:
			return 'WAITING';
		case InAppProducts.DOWNLOAD_STATE_ACTIVE:
			return 'ACTIVE';
		case InAppProducts.DOWNLOAD_STATE_PAUSED:
			return 'PAUSED';
		case InAppProducts.DOWNLOAD_STATE_FINISHED:
			return 'FINISHED';
		case InAppProducts.DOWNLOAD_STATE_FAILED:
			return 'FAILED';
		case InAppProducts.DOWNLOAD_STATE_CANCELED:
			return 'CANCELED';
		default:
			return "UNKNOWN";
	}
}

function traverseDirectory(file, indent) {
	// This function is used to recursively print the contents of the
	// downloaded hosted content.
	
	if (indent === undefined) {
		Ti.API.info('Listing of directory ' + file.name);
		indent = '|-';
	} else {
		Ti.API.info(indent + file.name);
		indent = '|  ' + indent;
	}
	
	if (file.isDirectory()) {
		file.getDirectoryListing().forEach(function(fileName) {
			traverseDirectory(Ti.Filesystem.getFile(file.nativePath, fileName), indent);
		});
	}
}

function printDownloadInfo(download) {
	var file;
	
	Ti.API.info('SKU:' + download.purchase.SKU);
	Ti.API.info('Content ID: ' + download.contentID);
	Ti.API.info('Content length: ' + download.contentLength);
	Ti.API.info('Content version: ' + download.contentVersion);
	Ti.API.info('State: ' + downloadStateToString(download.state));
	Ti.API.info('Progress: ' + download.progress);
	Ti.API.info('Time remaining: ' + 
			(download.timeRemaining === InAppProducts.DOWNLOAD_TIME_UNKNOWN ?
				'unknown' : download.timeRemaining.toString()));
	
	if (download.errorCode) {
		Ti.API.info('Error code: ' + download.errorCode);
		Ti.API.info('Error message: ' + download.errorMessage);
	}
	
	if (download.state === InAppProducts.DOWNLOAD_STATE_FINISHED) {
		Ti.API.info('Content URL: ' + download.contentURL);
		if (download.contentURL) {
			file = Ti.Filesystem.getFile(download.contentURL);
			traverseDirectory(file);
		} else {
			Ti.API.info('Download finished but URL is empty.');
		}
	}
}

buildPurchasesTable = function(table, purchases) {
	function orderByTime(a, b) {
		var result = 0, timeA, timeB;
		
		if (a.originalPurchase) {
			timeA = a.originalPurchase.time;
		} else {
			timeA = a.time;
		}
		if (b.originalPurchase) {
			timeB = b.originalPurchase.time;
		} else {
			timeB = b.time;
		}
		if (timeA < timeB) {
			result = 1;
		} else if (timeA > timeB) {
			result = -1;
		}
		return result;
	}
	
	var i, data;
	
	data = [];

	purchases.sort(orderByTime).forEach(function(purchase) {
		var row = Ti.UI.createTableViewRow(cfg.tablerows);
		row.title = purchase.SKU + ' ' + purchase.time;
		data.push(row);
	});

	table.setData(data);

};

var addEventListeners = function() {
	ti.buttons.supportStatus.addEventListener('click', function(e) {
		var message;
		switch(InAppProducts.getSupportStatus()) {
			case InAppProducts.SUPPORT_STATUS_NONE:
				message = "Billing is not supported.";
				break;
			case InAppProducts.SUPPORT_STATUS_ONE_TIME:
				message = "Billing of one-time items is supported.";
				break;
			case InAppProducts.SUPPORT_STATUS_SUBSCRIPTION:
				message = "Billing of subscription items is supported.";
				break;
			case InAppProducts.SUPPORT_STATUS_ALL:
				message = "Billing of all item types is supported.";
				break;
			case InAppProducts.SUPPORT_STATUS_ERROR:
				message = "An error occurred while querying support status.";
				break;
		}
		alert(message);
	});

	ti.buttons.getProducts.addEventListener('click', function(e) {
		if (InAppProducts.getProducts({ SKUs: productIDs })) {
			Ti.API.info('getProducts request started successfully.');
		} else {
			alert('Error: could not start getProducts request!');
		}
	});
			
	ti.buttons.cancelProductRequest.addEventListener('click', function(e) {
		InAppProducts.cancelProductRequest();
		Ti.API.info('Canceled getProducts request.');
	});
			
	ti.buttons.getPurchases.addEventListener('click', function() {
		if (false === InAppProducts.getPurchases()) {
			alert('getPurchases operation failed to start!');
		}
	});

	ti.buttons.purchase.addEventListener('click', function() {
		var appPayload;
		
		appPayload = 'AppPayloadRandom#' + Math.round(Math.random() * 1000);
		Ti.API.info('Purchasing product ' +
			currentProduct.SKU + ' with app payload ' + appPayload);		
		currentProduct.purchase({
			quantity : 1,
			applicationPayload: appPayload
		});
	});

	ti.buttons.consume.addEventListener('click', function() {
		currentPurchase.consume();
	});

	ti.buttons.originalPurchase.addEventListener('click', function() {
		updatePurchaseWindow(currentPurchase.originalPurchase);
	});

	/*
	 * module events
	 */

	InAppProducts.addEventListener('stateChange', function(e) {
		alert(InAppProducts.state);
		Ti.API.info('Received stateChange event with state ' + e.state);
		switch(InAppProducts.state) {
			case InAppProducts.STATE_NOT_READY:
				alert('InAppProducts module is not ready!');
				if (e.errorCode) {
					Ti.API.info('Initialization error code: ' + e.errorCode);
				}
				if (e.errorMessage) {
					Ti.API.info('Initialization error msg: ' + e.errorMessage);
				}
				break;
			case InAppProducts.STATE_READY:
				alert('InAppProducts module is ready!');
				break;
			case InAppProducts.STATE_NOT_SUPPORTED:
				alert('Simulator not supported! ' + 
					'Please run this test on an actual device!');
				break;
			default:
				alert('InAppProducts module is in invalid state!');
		}
	});
	
	InAppProducts.addEventListener('receivedProducts', function(e) {
		if (e.errorCode) {
			alert('Error: getProducts call failed! Message: ' + e.errorMessage);
		} else {
			if(ti.tables.hasOwnProperty("products")) {
				ti.windows.products.remove(ti.tables.products);
			}
			Ti.API.info('getProducts succeeded!');
			
			productObjects = e.products;
			Ti.API.info('Product count: ' + productObjects.length);
			ti.tables.products = Ti.UI.createTableView(cfg.table);
			buildProductsTable(ti.tables.products, productObjects);
			if (!ANDROID) {
				Ti.API.info("Invalid IDs: " + JSON.stringify(e.invalid));
			}
			ti.windows.products.add(ti.tables.products);
			ti.tab.open(ti.windows.products);

			ti.tables.products.addEventListener('click', function(e) {
				updateProductWindow(productObjects[e.index]);
				ti.tab.open(ti.windows.product);
			});
		}
		
	});

	InAppProducts.addEventListener('purchaseUpdate', function(e) {
		Ti.API.info('Received purchaseUpdate event');
		if (e.errorCode) {
			// This only happens on Android. On iOS, there is no error
			// condition associated with the purchaseUpdate event, although
			// the purchase itself may be in PURCHASE_STATE_FAILED state.
			alert('Purchase attempt failed (code: ' + e.errorCode + ')');
		} else {
			Ti.API.info('Product: ' + e.purchase.SKU + ' state: ' +
							purchaseStateToString(e.purchase.state));
			switch (e.purchase.state) {
				case InAppProducts.PURCHASE_STATE_PURCHASED:
					// This is a possible state on both iOS and Android
					updatePurchaseWindow(e.purchase);
					ti.tab.open(ti.windows.purchase);
					alert('Purchased ' + e.purchase.SKU);
					break;
				case InAppProducts.PURCHASE_STATE_CANCELED:
					// Android only
					alert('Purchase canceled.');
					break;
				case InAppProducts.PURCHASE_STATE_REFUNDED:
					// Android only
					break;
				case InAppProducts.PURCHASE_STATE_PURCHASING:
					// iOS only
					break;
				case InAppProducts.PURCHASE_STATE_FAILED:
					// iOS only
					alert('Purchase failed.');
					break;
				case InAppProducts.PURCHASE_STATE_RESTORED:
					// iOS only
					break;
			}
			
			if (InAppProducts.autoCompletePurchases === false) {
				// This is for iOS only; autoCompletePurchases is constant
				// true on Android as there is no need/ability to separately
				// complete purchases; they are essentially always
				// auto-completed.
				switch (e.purchase.state) {
					case InAppProducts.PURCHASE_STATE_PURCHASED:
					case InAppProducts.PURCHASE_STATE_FAILED:
					case InAppProducts.PURCHASE_STATE_RESTORED:
						if (e.purchase.downloads.length) {
							// Hosted content must be downloaded before the
							// purchase is completed!
							Ti.API.info('Purchase has hosted content!');
							e.purchase.downloads.forEach(function(download) {
								printDownloadInfo(download);
							});
							InAppProducts.startDownloads(e.purchase.downloads);
						} else {
							Ti.API.info('Completing purchase...');
							e.purchase.complete();
						}
						break;
				}
			}
		}
	});

	InAppProducts.addEventListener('downloadUpdate', function(e) {
		Ti.API.info('Received downloadUpdate event.');
		Ti.API.info('Number of downloads: ' + e.downloads.length);
		e.downloads.forEach(function(download) {
			printDownloadInfo(download);
			if (download.state === InAppProducts.DOWNLOAD_STATE_FINISHED) {
				Ti.API.info('Download completed, completing purchase!');
				download.purchase.complete();
			}
		});
	});
	
	InAppProducts.addEventListener('receivedPurchases', function(e) {
		if(ti.tables.hasOwnProperty("purchases")) {
			ti.windows.purchases.remove(ti.tables.purchases);
		}
		var errorMsg;
		
		Ti.API.info('Received receivedPurchases event');
		
		if (e.errorCode !== undefined) {
			errorMsg = 'An error occurred (code: ' + e.errorCode +
							'/message: ' + e.errorMessage + ')'; 
			Ti.API.info(errorMsg);
			alert(errorMsg);
		}
		// We may have received partial information even in case of an error...
		Ti.API.info('Received ' + e.purchases.length + ' purchase records.');
		purchaseObjects = e.purchases;
		ti.tables.purchases = Ti.UI.createTableView(cfg.table);
		buildPurchasesTable(ti.tables.purchases, purchaseObjects);
		ti.windows.purchases.add(ti.tables.purchases);
		ti.tab.open(ti.windows.purchases);
		ti.tables.purchases.addEventListener('click', function(e) {
			updatePurchaseWindow(purchaseObjects[e.index]);
			ti.tab.open(ti.windows.purchase);
		});
	});
	
	InAppProducts.addEventListener('purchaseConsumed', function(e) {
		if (e.errorCode) {
			alert('Consuming purchase failed with code: ' + e.errorCode);
		} else {
			alert('Purchase of ' + e.purchase.SKU + ' succeeded.'); 
		}
	});
};

buildProductsTable = function(table, products) {
	var i, data;
	
	data = [];

	products.forEach(function(product) {
		var row = Ti.UI.createTableViewRow(cfg.tablerows);
		row.title = product.SKU + '/' + product.title + '/' + product.description;
		data.push(row);
	});
	table.setData(data);
};

purchaseStateToString = function(state) {
	switch (state) {
		case InAppProducts.PURCHASE_STATE_PURCHASED:
			return 'purchased';
		case InAppProducts.PURCHASE_STATE_CANCELED:
			// Android only
			return 'canceled';
		case InAppProducts.PURCHASE_STATE_REFUNDED:
			// Android only
			return 'refunded';
		case InAppProducts.PURCHASE_STATE_PURCHASING:
			// iOS only
			return "purchasing";
		case InAppProducts.PURCHASE_STATE_FAILED:
			// iOS only
			return "failed";
		case InAppProducts.PURCHASE_STATE_RESTORED:
			// iOS only
			return "restored";
		default:
			return 'unknown';
	}
};

updatePurchaseWindow = function(purchase) {
	ti.labels.purchaseState.text = "state: " +
				purchaseStateToString(purchase.state);
	ti.labels.purchaseDate.text = "time: " + purchase.time;
	ti.labels.purchaseID.text = "order#: " + purchase.orderNumber;
	ti.labels.purchaseQuantity.text = "quantity: " + purchase.quantity;
	ti.labels.purchaseProductID.text = "SKU: " + purchase.SKU;

	ti.labels.purchaseApplicationPayload.text = 
			"applicationPayload: " + purchase.applicationPayload;
	// purchaseToken is Android only	
	ti.labels.purchasePurchaseToken.text =
			"purchaseToken: " + purchase.purchaseToken;

	currentPurchase = purchase;
	
	if (currentPurchase.originalPurchase) {
		Ti.API.info('Purchase has original purchase.');
		ti.buttons.originalPurchase.visible = true; 
	} else {
		Ti.API.info('Purchase does not have original purchase.');
		ti.buttons.originalPurchase.visible = false;
	}
};

updateProductWindow = function(product) {
	ti.labels.productTitle.text = "title: " + product.title;
	ti.labels.productProductID.text = "SKU: " + product.SKU;
	ti.labels.productDescription.text = "description: " + product.description;
	ti.labels.productPrice.text = "price: " + product.priceAsString;

	if (product.priceLocale) {
		ti.labels.productPrice.text += " locale: " + product.priceLocale;
	}
	
	currentProduct = product;
};

var buildMainWindow = function() {

	ti.buttons.supportStatus.title = "Check Billing Supported";
	ti.buttons.getProducts.title = "List Products";
	ti.buttons.cancelProductRequest.title = "Cancel Product Request";
	ti.buttons.getPurchases.title = "List Purchases";

	ti.windows.main.add(ti.buttons.supportStatus);
	ti.windows.main.add(ti.buttons.getProducts);
	ti.windows.main.add(ti.buttons.cancelProductRequest);
	ti.windows.main.add(ti.buttons.getPurchases);
	ti.windows.main.orientationModes = [Ti.UI.PORTRAIT];
};

var buildProductWindow = function() {

	ti.windows.product.add(ti.labels.productTitle);
	ti.windows.product.add(ti.labels.productProductID);
	ti.windows.product.add(ti.labels.productDescription);
	ti.windows.product.add(ti.labels.productPrice);

	ti.buttons.purchase.title = "Purchase Product";

	ti.windows.product.add(ti.buttons.purchase);

};

var buildPurchaseWindow = function() {
	ti.buttons.consume.title = "Consume Purchase";
	ti.buttons.originalPurchase.title = "Original Purchase";

	ti.windows.purchase.add(ti.labels.purchaseState);
	ti.windows.purchase.add(ti.labels.purchaseDate);
	ti.windows.purchase.add(ti.labels.purchaseID);
	ti.windows.purchase.add(ti.labels.purchaseQuantity);
	ti.windows.purchase.add(ti.labels.purchaseProductID);
	ti.windows.purchase.add(ti.labels.purchaseApplicationPayload);
	ti.windows.purchase.add(ti.labels.purchasePurchaseToken);
	
	if (ANDROID) {
		ti.windows.purchase.add(ti.buttons.consume);
	} else {
		ti.windows.purchase.add(ti.buttons.originalPurchase);
	}
};

var buildHierarchy = function() {

	buildMainWindow();
	buildProductWindow();
	buildPurchaseWindow();

	ti.tab = Ti.UI.createTab({
		window : ti.windows.main
	});

	ti.tabgroup.addTab(ti.tab);

};

var init = function() {
	Ti.API.info('Initializing app...');
	buildHierarchy();

	addEventListeners();

	ti.tabgroup.open();

	Ti.API.info('... initialization complete!');
};

init();
