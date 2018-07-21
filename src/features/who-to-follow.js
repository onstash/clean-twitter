import { hideDOMElement } from "../utils/hide-element";
import { observeElement } from "../utils/observe-element";

export const hideWhoToFollow = () => {
    const selectors = [
        ".module.wtf-module.js-wtf-module", // 'Who to follow',
        ".module.Footer", // Footer under 'Who to follow'
    ];
    for (const selector of selectors) {
        observeElement({
            selector,
            callback: elements => {
                hideDOMElement(elements, selector);
            },
        });
    }
};
