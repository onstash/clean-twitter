chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {hostEquals: "twitter.com"},
            })],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

const twitterUrlRegex = /^https?:\/\/twitter.com\/*/;

chrome.tabs.onUpdated.addListener(function(tabID, changeInfo, tab) {
    if (changeInfo.hasOwnProperty("url")) {
        const regex = changeInfo.url.match(twitterUrlRegex);
        if (regex !== null) {
            chrome.tabs.sendMessage(tabID, { message: "Twitter URL has changed", url: changeInfo.url });
        }
    }
});
