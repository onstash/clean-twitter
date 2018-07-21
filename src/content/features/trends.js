import { hideDOMElement } from "./hide-element";
import { observeElement } from "./observe-element";

export const hideTrends = () => {
    const selector = ".module.Trends.trends"; // Trends
    observeElement({
        selector,
        callback: elements => {
            hideDOMElement(elements, selector);
        },
    });
};
