// background.js
// Author:
// Author URI: https://
// Author Github URI: https://www.github.com/
// Project Repository URI: https://github.com/
// Description: Handles all the browser level activities (e.g. tab management, etc.)
// License: MIT
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "addProduct") {
        const product = message.productInfo;
        chrome.storage.local.get(['products'], function(result) {
            const products = result.products || [];
            products.push(product);
            chrome.storage.local.set({ products });
        });
    }
});

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     if (request.action === "openManagePage") {
//       chrome.tabs.create({ url: chrome.runtime.getURL('manage.html') });
//     }
// });

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({ url: chrome.runtime.getURL('manage.html') });
});

