const hideDOMElementsCSSProps = {
    "display": "none !important",
    "visibility": "hidden !important"
};
const hidingCSSTypes = {
    ".moments.js-moments-tab": "display",
    "[data-promoted='true']": "display",
};
const selectors = [
    ".module.wtf-module.js-wtf-module", // 'Who to follow'
    ".module.Footer", // Footer under 'Who to follow',
    ".module.Trends.trends", // Trends
    ".dashboard.dashboard-left", // Profile info on the left,
    ".moments.js-moments-tab", // Moments navigation tab,
];

function hideDOMElement(componentsToHide, selector) {
    const defaultCSSToHideComponent = "visibility";
    for (const componentToHide of componentsToHide) {
        if (componentToHide !== null) {
            const visibilityProp = hidingCSSTypes[selector] || defaultCSSToHideComponent;
            componentToHide.setProperty(visibilityProp, hideDOMElementsCSSProps[visibilityProp]);
        }
    }
}

function cleanupTwitterInterface() {
    for (const selector of selectors) {
        waitForElement(selector)
            .then(function(elements) {
                hideDOMElement(elements, selector);
            });
    }

    waitForElement("[data-promoted='true']", { disconnect: false }, hideDOMElement);

    if (document.querySelector("#__like_button_tab") === null) {
        waitForElement("#global-actions", { rejectIfAlreadyPresent: true })
            .then(function(globalActionsNavBars) {
                const globalActionsNavBar = globalActionsNavBars[0];
                const likesTabComponent = document.createElement("li");
                const likesTabComponentLink = document.createElement("a");
                likesTabComponentLink.setAttribute("href", "/i/likes");
                likesTabComponentLink.setAttribute("role", "button");
                likesTabComponentLink.setAttribute("data-nav", "favorites");
                likesTabComponentLink.setAttribute("class", "js-nav js-tooltip js-dynamic-tooltip");
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
                globalActionsNavBar.appendChild(
                    likesTabComponent
                );
            })
            .catch(function (error) {
                console.error({ error });
            });
    }

    waitForElement(
        ".new-tweets-bar.js-new-tweets-bar",
        { disconnect: false },
        function (elements) {
            if (document.body.getBoundingClientRect().top >= -20) {
                elements[0].click();
            }
        }
    );
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message === "Twitter URL has changed") {
        cleanupTwitterInterface();
    }
});

const isUserLoggedIn = document.querySelectorAll(".logged-out").length === 0;

function waitForElement(selector, options, callback) {
  let rejectIfAlreadyPresent = (options || {}).rejectIfAlreadyPresent;
  rejectIfAlreadyPresent = rejectIfAlreadyPresent === undefined ? false : rejectIfAlreadyPresent;
  let disconnect = (options || {}).disconnect;
  disconnect = disconnect === undefined ? true : disconnect;
  return new Promise(function(resolve, reject) {
    const elements = document.querySelectorAll(selector);
    const areElementsValid = elements !== null && elements !== undefined && elements.length && elements.length > 0;

    if (areElementsValid && rejectIfAlreadyPresent) {
        reject(elements);
        return;
    }

    const observer = new MutationObserver(function(mutations, observer) {
      const matchingNodes = [];
      mutations.forEach(function(mutation) {
        const nodes = Array.from(mutation.addedNodes);
        for(const node of nodes) {
          if(node.matches && node.matches(selector)) {
            matchingNodes.push(node);  
          }
        };
        if (matchingNodes.length) {
            if (disconnect) {
                observer.disconnect();
            } else {
            }
            window.requestAnimationFrame(function () {
                callback !== undefined && callback(matchingNodes, selector);
            });
            resolve(matchingNodes);
            return;
        }
      });
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
  });
}

if (isUserLoggedIn) {
    cleanupTwitterInterface();
}
