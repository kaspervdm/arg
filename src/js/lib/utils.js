//Checks if the device is a mobile (without taking into account orientation or size)
export function isMobileDevice() {
    return getComputedStyle(document.documentElement).getPropertyValue("--is-mobile-device").trim() === "true";
}

//Fix for ios InApp browsers that do not return a correct innerWidth on page load
export function getViewportWidth() {
    return isMobileDevice() ? document.documentElement.clientWidth : window.innerWidth;
}

//Fix for ios InApp browsers that do not return a correct innerHeight on page load
export function getViewportHeight() {
    return isMobileDevice() ? document.documentElement.clientHeight : window.innerHeight;
}

//Get position of element relative to top of page
export function getOffset(el) {
    const de = document.documentElement;
    const box = el.getBoundingClientRect();
    const top = box.top + window.pageYOffset - de.clientTop;
    const left = box.left + window.pageXOffset - de.clientLeft;
    return { top: top, left: left };
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export function debounce(func, wait, immediate) {
    let timeout;
    return function () {
        const context = this,
            args = arguments;
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

export function getBreakpoint(name) {
    return getComputedStyle(document.documentElement)
        .getPropertyValue("--breakpoint-" + name)
        .trim();
}

export function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) /* or $(window).height() */ &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
    );
}
