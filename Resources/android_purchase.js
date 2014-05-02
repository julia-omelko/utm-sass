/*jslint white:true plusplus:true nomen:true vars:true sloppy:true undef:false*/

utm.InAppProducts = require('com.logicallabs.inappproducts');

// This call (or any other) may fail on Android if the module hasn't finished
// its initialization routine yet -- always wait for the stateChange event!!!
Ti.API.info('Module ready? ' + 
	(utm.InAppProducts.getSupportStatus() !== utm.InAppProducts.SUPPORT_STATUS_ERROR));

// Note: These product IDs must match the product IDs you configure on
// iTunes Connect and Android Developer Console!
var productIDs = ["com.youthisme.unlimited"];
var productObjects, currentProduct, purchaseObjects, currentPurchase;

var ANDROID = Ti.Platform.osname === "android";





var alertError = function(e) {
	alert("Error: " + e.message);
};

function downloadStateToString(state) {
	Ti.API.info('Translating download state code ' + state);
	switch (state) {
		case utm.InAppProducts.DOWNLOAD_STATE_WAITING:
			return 'WAITING';
		case utm.InAppProducts.DOWNLOAD_STATE_ACTIVE:
			return 'ACTIVE';
		case utm.InAppProducts.DOWNLOAD_STATE_PAUSED:
			return 'PAUSED';
		case utm.InAppProducts.DOWNLOAD_STATE_FINISHED:
			return 'FINISHED';
		case utm.InAppProducts.DOWNLOAD_STATE_FAILED:
			return 'FAILED';
		case utm.InAppProducts.DOWNLOAD_STATE_CANCELED:
			return 'CANCELED';
		default:
			return "UNKNOWN";
	}
}






var addEventListeners = function() {
	/*ti.buttons.supportStatus.addEventListener('click', function(e) {
		var message;
		switch(utm.InAppProducts.getSupportStatus()) {
			case utm.InAppProducts.SUPPORT_STATUS_NONE:
				message = "Billing is not supported.";
				break;
			case utm.InAppProducts.SUPPORT_STATUS_ONE_TIME:
				message = "Billing of one-time items is supported.";
				break;
			case utm.InAppProducts.SUPPORT_STATUS_SUBSCRIPTION:
				message = "Billing of subscription items is supported.";
				break;
			case utm.InAppProducts.SUPPORT_STATUS_ALL:
				message = "Billing of all item types is supported.";
				break;
			case utm.InAppProducts.SUPPORT_STATUS_ERROR:
				message = "An error occurred while querying support status.";
				break;
		}
		alert(message);
	});
	*/
	/*
	ti.buttons.getProducts.addEventListener('click', function(e) {
		if (utm.InAppProducts.getProducts({ SKUs: productIDs })) {
			Ti.API.info('getProducts request started successfully.');
		} else {
			alert('Error: could not start getProducts request!');
		}
	});
	*/
			

			

	/*
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
	*/



	/*
	 * module events
	 */

	utm.InAppProducts.addEventListener('stateChange', function(e) {
		alert(utm.InAppProducts.state);
		Ti.API.info('Received stateChange event with state ' + e.state);
		switch(utm.InAppProducts.state) {
			case utm.InAppProducts.STATE_NOT_READY:
				alert('utm.InAppProducts module is not ready!');
				if (e.errorCode) {
					Ti.API.info('Initialization error code: ' + e.errorCode);
				}
				if (e.errorMessage) {
					Ti.API.info('Initialization error msg: ' + e.errorMessage);
				}
				break;
			case utm.InAppProducts.STATE_READY:
				alert('utm.InAppProducts module is ready!');
				break;
			case utm.InAppProducts.STATE_NOT_SUPPORTED:
				alert('Simulator not supported! ' + 
					'Please run this test on an actual device!');
				break;
			default:
				alert('utm.InAppProducts module is in invalid state!');
		}
	});
	
	utm.InAppProducts.addEventListener('receivedProducts', function(e) {
		//alert(123);
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

	utm.InAppProducts.addEventListener('purchaseUpdate', function(e) {
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
				case utm.InAppProducts.PURCHASE_STATE_PURCHASED:
					// This is a possible state on both iOS and Android
					updatePurchaseWindow(e.purchase);
					ti.tab.open(ti.windows.purchase);
					alert('Purchased ' + e.purchase.SKU);
					break;
				case utm.InAppProducts.PURCHASE_STATE_CANCELED:
					// Android only
					alert('Purchase canceled.');
					break;
				case utm.InAppProducts.PURCHASE_STATE_REFUNDED:
					// Android only
					break;
				case utm.InAppProducts.PURCHASE_STATE_PURCHASING:
					// iOS only
					break;
				case utm.InAppProducts.PURCHASE_STATE_FAILED:
					// iOS only
					alert('Purchase failed.');
					break;
				case utm.InAppProducts.PURCHASE_STATE_RESTORED:
					// iOS only
					break;
			}
			
			if (utm.InAppProducts.autoCompletePurchases === false) {
				// This is for iOS only; autoCompletePurchases is constant
				// true on Android as there is no need/ability to separately
				// complete purchases; they are essentially always
				// auto-completed.
				switch (e.purchase.state) {
					case utm.InAppProducts.PURCHASE_STATE_PURCHASED:
					case utm.InAppProducts.PURCHASE_STATE_FAILED:
					case utm.InAppProducts.PURCHASE_STATE_RESTORED:
						if (e.purchase.downloads.length) {
							// Hosted content must be downloaded before the
							// purchase is completed!
							Ti.API.info('Purchase has hosted content!');
							e.purchase.downloads.forEach(function(download) {
								printDownloadInfo(download);
							});
							utm.InAppProducts.startDownloads(e.purchase.downloads);
						} else {
							Ti.API.info('Completing purchase...');
							e.purchase.complete();
						}
						break;
				}
			}
		}
	});


	
	utm.InAppProducts.addEventListener('receivedPurchases', function(e) {
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
	
	utm.InAppProducts.addEventListener('purchaseConsumed', function(e) {
		if (e.errorCode) {
			alert('Consuming purchase failed with code: ' + e.errorCode);
		} else {
			alert('Purchase of ' + e.purchase.SKU + ' succeeded.'); 
		}
	});
};

/*
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
*/

purchaseStateToString = function(state) {
	switch (state) {
		case utm.InAppProducts.PURCHASE_STATE_PURCHASED:
			return 'purchased';
		case utm.InAppProducts.PURCHASE_STATE_CANCELED:
			// Android only
			return 'canceled';
		case utm.InAppProducts.PURCHASE_STATE_REFUNDED:
			// Android only
			return 'refunded';
		case utm.InAppProducts.PURCHASE_STATE_PURCHASING:
			// iOS only
			return "purchasing";
		case utm.InAppProducts.PURCHASE_STATE_FAILED:
			// iOS only
			return "failed";
		case utm.InAppProducts.PURCHASE_STATE_RESTORED:
			// iOS only
			return "restored";
		default:
			return 'unknown';
	}
};











addEventListeners();

