// Font Awesome icon helper. Icon names live in the constants of the feature that uses them.

import { Tag } from '../constants/html.js';
import { createElement } from './dom.js';

export const IconStyle = Object.freeze({
    SOLID: 'fas',
    BRAND: 'fab',
});

export function iconClass(style, name) {
    return `${style} ${name}`;
}

export function createIcon(style, name) {
    return createElement(Tag.ICON, { className: iconClass(style, name) });
}
