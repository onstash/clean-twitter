const noOp = () => {};
const defaultOptions = { overrideSkip: false, disconnect: true };

const checkIfDOMElementsAreValid = elements => {
    return (
        elements !== null && elements !== undefined &&
        elements.length && elements.length > 0
    );
};

export const observeElement = ({ selector, options = defaultOptions, callback = noOp }) => {
    const elements = document.querySelectorAll(selector);
    if (checkIfDOMElementsAreValid(elements)) {
        return;
    }
    const { disconnect = true, overrideSkip = false } = options;
    let skipIfAlreadyPresent = false;

    const observer = new MutationObserver((mutations, observer) => {
        const matchingNodes = [];
        mutations.forEach((mutation) => {
            const nodes = Array.from(mutation.addedNodes);
            for(const node of nodes) {
            if(node.matches && node.matches(selector)) {
                matchingNodes.push(node);  
            }
            };
            if (matchingNodes.length) {
                if (disconnect) {
                    observer.disconnect();
                }
                window.requestAnimationFrame(() => {
                    if (overrideSkip) {
                        callback(matchingNodes, selector);
                    } else if (!skipIfAlreadyPresent) {
                        skipIfAlreadyPresent = true;
                        callback(matchingNodes);
                    }
                });
            }
        });
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
};
