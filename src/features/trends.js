import { hideDOMElement } from "../utils/hide-element";
import { observeElement } from "../utils/observe-element";

export const hideTrends = () => {
    const selector = ".module.Trends.trends"; // Trends
    observeElement({
        selector,
        callback: elements => {
            hideDOMElement(elements, selector);
        },
    });
};
