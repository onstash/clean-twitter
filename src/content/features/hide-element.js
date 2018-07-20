const displayNone = "display: none !important";
const hidingCSSTypes = {
    ".moments.js-moments-tab": displayNone,
    "[data-promoted='true']": displayNone,
};
const defaultCSSToHideComponent = "visibility: hidden !important";

export const hideDOMElement = (componentsToHide, selector) => {
    for (const componentToHide of componentsToHide) {
        if (componentToHide !== null) {
            const visibilityStyle = hidingCSSTypes[selector] || defaultCSSToHideComponent;
            componentToHide.style = visibilityStyle;
        }
    }
};
