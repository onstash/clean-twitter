import { hideDOMElement } from "./hide-element";
import { observeElement } from "./observe-element";

export const hideFeedProfile = () => {
    const selector = ".dashboard.dashboard-left"; // Profile info on the left
    observeElement({
        selector,
        callback: elements => {
            hideDOMElement(elements, selector);
        },
    });
};
