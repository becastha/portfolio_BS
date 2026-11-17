// HTML tag, attribute and DOM event names used from JavaScript. One home for all of them.

export const Tag = Object.freeze({
    ANCHOR: 'a',
    BR: 'br',
    CANVAS: 'canvas',
    DIV: 'div',
    H1: 'h1',
    H3: 'h3',
    ICON: 'i',
    P: 'p',
    SPAN: 'span',
    STRONG: 'strong',
    TEMPLATE: 'template',
});

export const Attr = Object.freeze({
    ARIA_HIDDEN: 'aria-hidden',
    HREF: 'href',
    REL: 'rel',
    TARGET: 'target',
    TITLE: 'title',
});

/** Attribute values. */
export const AttrValue = Object.freeze({ TRUE: 'true' });

export const LinkTarget = Object.freeze({ NEW_TAB: '_blank' });
export const LinkRel = Object.freeze({ EXTERNAL: 'noopener noreferrer' });

export const DomEvent = Object.freeze({
    ANIMATION_END: 'animationend',
    CLICK: 'click',
    DOM_CONTENT_LOADED: 'DOMContentLoaded',
    FULLSCREEN_CHANGE: 'fullscreenchange',
    KEY_DOWN: 'keydown',
    POINTER_CANCEL: 'pointercancel',
    POINTER_DOWN: 'pointerdown',
    POINTER_MOVE: 'pointermove',
    POINTER_UP: 'pointerup',
    RESIZE: 'resize',
    TOUCH_END: 'touchend',
    TOUCH_START: 'touchstart',
});

export const ReadyState = Object.freeze({ LOADING: 'loading' });

export const Key = Object.freeze({
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
    END: 'End',
    HOME: 'Home',
    SPACE: ' ',
});
