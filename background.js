// chrome.browserAction.onClicked.addListener(function(tab) {
//     chrome.tabs.create({ url: chrome.runtime.getURL('manage.html') });
// });

chrome.contextMenus.create({
    id: "mycontextmenu",
    title: "Product list manager",
    contexts: ["all"],
  });

  chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "mycontextmenu") {
        // Mở tab mới chứa trang manage.html khi mục được chọn
        chrome.tabs.create({ url: chrome.runtime.getURL('manage.html') });
    }
});