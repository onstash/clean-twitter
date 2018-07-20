import { hideDOMElement } from "./hide-element";
import { observeElement } from "./observe-element";

export const hidePromotedTweets = () => {
    const selector = "[data-promoted='true']"; // Promoted tweets
    observeElement({
        selector,
        options: { disconnect: false },
        callback: elements => {
            hideDOMElement(elements, selector);
        },
    });
};

export const loadNewTweets = () => {
    const selector = ".new-tweets-bar.js-new-tweets-bar"; // 'See <n> new tweets',
    observeElement({
        selector,
        options: { disconnect: false, overrideSkip: true },
        callback: elements => {
            if (document.body.getBoundingClientRect().top >= -20) {
                elements[0].click();
            }
        },
    });
};
