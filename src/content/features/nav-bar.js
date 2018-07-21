import { hideDOMElement } from "./hide-element";
import { observeElement } from "./observe-element";

const LIKE_TAB_SELECTOR = "#__like_button_tab";

export const hideMomentsTab = () => {
    const selector = ".moments.js-moments-tab"; // Moments navigation tab
    observeElement({
        selector,
        callback: elements => {
            hideDOMElement(elements, selector);
        },
    });
};

export const addLikesTabToNavBar = () => {
    if (document.querySelector(LIKE_TAB_SELECTOR) === null) {
        observeElement({
            selector: "#global-actions",
            options: { skipIfAlreadyPresent: true },
            callback: _addLikesTabToNavBar,
        });
    }
};

const _addLikesTabToNavBar = globalActionsNavBars => {
    const globalActionsNavBar = globalActionsNavBars[0];
    const likesTabComponent = document.createElement("li");
    const likesTabComponentLink = document.createElement("a");
    likesTabComponentLink.setAttribute("href", "/i/likes");
    likesTabComponentLink.setAttribute("role", "button");
    likesTabComponentLink.setAttribute("data-nav", "favorites");
    likesTabComponentLink.setAttribute(
        "class",
        "js-nav js-tooltip js-dynamic-tooltip"
    );
    likesTabComponentLink.setAttribute("id", "__like_button_tab");
    likesTabComponentLink.setAttribute("data-placement", "bottom");
    likesTabComponent.setAttribute("style", "cursor: pointer;");

    const spanIcon = document.createElement("span");
    spanIcon.setAttribute("class", "Icon Icon--heart Icon--large");
    const spanText = document.createElement("span");
    spanText.setAttribute("class", "text");
    spanText.innerText = "Likes";

    likesTabComponentLink.appendChild(spanIcon);
    likesTabComponentLink.appendChild(spanText);

    likesTabComponent.appendChild(likesTabComponentLink);
    globalActionsNavBar.appendChild(likesTabComponent);
};
