import { hideWhoToFollow } from "./features/who-to-follow";
import { hideTrends } from "./features/trends";
import { hideFeedProfile } from "./features/feed-profile";
import { hideMomentsTab, addLikesTabToNavBar } from "./features/nav-bar";
import { hidePromotedTweets, loadNewTweets } from "./features/tweets";

const cleanupTwitterInterface = () => {
    hideWhoToFollow();
    hideTrends();
    hideFeedProfile();
    hideMomentsTab();
    addLikesTabToNavBar();
    hidePromotedTweets();
    loadNewTweets();
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "Twitter URL has changed") {
        cleanupTwitterInterface();
    }
});

document.querySelectorAll(".logged-out").length === 0 &&
    cleanupTwitterInterface();
