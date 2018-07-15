function hideDOMElement(componentsToHide, selector) {
    const hidingCSSTypes = {
        ".moments.js-moments-tab": "display: none !important;",
        "moments js-moments-tab": "display: none !important;"
    };
    // const cssToHideComponent = "display: none !important;";
    const defaultCSSToHideComponent = "visibility: hidden !important;";
    console.log({selector, componentsToHide});
    for (const componentToHide of componentsToHide) {
        if (componentToHide !== null) {
            const newStyle = hidingCSSTypes[selector] || defaultCSSToHideComponent;
            console.log({existingStyle: componentToHide.style, newStyle, isEqual: componentToHide.style === newStyle });
            componentToHide.style = newStyle;
        }
    }
}

const selectors = [
    ".module.wtf-module.js-wtf-module", // 'Who to follow'
    ".module.Footer", // Footer under 'Who to follow',
    ".module.Trends.trends", // Trends
    ".dashboard.dashboard-left", // Profile info on the left,
    ".moments.js-moments-tab", // Moments navigation tab,
];

function cleanupTwitterInterface() {
    for (const selector of selectors) {
        waitForElement(selector)
            .then(function(elements) {
                console.log({ message: "Elements added", elements });
                hideDOMElement(elements, selector);
            });
    }

    waitForElement(".promoted-tweet", { disconnect: false }, hideDOMElement);

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
                // <span class="Icon Icon--heart Icon--large"></span><span class="text">Likes</span>
                const spanText = document.createElement("span");
                spanText.setAttribute("class", "text");
                spanText.innerText = "Likes";

                likesTabComponentLink.appendChild(spanIcon);
                likesTabComponentLink.appendChild(spanText);

                console.log({ globalActionsNavBar, likesTabComponent, likesTabComponentLink });
                likesTabComponent.appendChild(likesTabComponentLink);
                console.log({ globalActionsNavBar, likesTabComponent, likesTabComponentLink });
                globalActionsNavBar.appendChild(
                    // '<li><a role="button" data-nav="favorites" href="/i/likes" class="js-nav js-tooltip js-dynamic-tooltip" id="__like_button_tab" data-placement="bottom"><span class="Icon Icon--heart Icon--large"></span><span class="text">Likes</span></a></li>'
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
                console.log("Fetching new tweets");
                elements[0].click();
            } else {
                console.log("Not fetching new tweets");
            }
        }
    );
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log({ source: "chrome.runtime.onMessage.addListener", request, sender, sendResponse });
    if (request.message === "Twitter URL has changed") {
        cleanupTwitterInterface();
    }
});

const isUserLoggedIn = document.querySelectorAll(".logged-out").length === 0;

function waitForElement(selector, options, callback) {
  const rejectIfAlreadyPresent = (options || {}).rejectIfAlreadyPresent || false;
  let disconnect = (options || {}).disconnect;
  disconnect = disconnect === undefined ? true : disconnect;
  console.log({ selector, options, disconnect, callback });
  return new Promise(function(resolve, reject) {
    const elements = document.querySelectorAll(selector);
    const areElementsValid = elements !== null && elements !== undefined && elements.length && elements.length > 0;

    if (areElementsValid && rejectIfAlreadyPresent) {
        console.log({ selector, options, elements, count: elements.length, areElementsValid });
        reject(elements);
        return;
    }

    const observer = new MutationObserver(function(mutations, observer) {
      const matchingNodes = [];
      mutations.forEach(function(mutation) {
        const nodes = Array.from(mutation.addedNodes);
        for(const node of nodes) {
          if(node.matches && node.matches(selector)) {
            console.log({ matchingNodes });
            matchingNodes.push(node);  
            console.log({ matchingNodes });
          }
        };
        if (matchingNodes.length) {
            if (disconnect) {
                console.log("Disconnecting MutationObserver for " + selector);
                observer.disconnect();
            } else {
                console.log("Not disconnecting MutationObserver for " + selector);
            }
            callback !== undefined && callback(matchingNodes, selector);
            resolve(matchingNodes);
            return;
        }
      });
      // if (matchingNodes.length === 0) {
      //   observer.disconnect();
      //   reject([]);
      //   return;
      // }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
  });
}

if (isUserLoggedIn) {
    cleanupTwitterInterface();
}

".tweet-context > .Icon--retweeted"
".tweet-context > .Icon--heartBadge"