// Shared DOM helpers. Views build elements through these instead of HTML strings,
// so data is always inserted as text.

import { Tag } from '../constants/html.js';

export function byId(id) {
    return document.getElementById(id);
}

/**
 * @param {string} tag
 * @param {{ className?: string, text?: string, attributes?: Record<string, string>, children?: (Node|string)[] }} [options]
 */
export function createElement(tag, { className, text, attributes, children } = {}) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    if (attributes) {
        Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
    }
    if (children) element.append(...children);
    return element;
}

export function setChildren(container, children) {
    container.replaceChildren(...children);
}

/** Parses an HTML fragment (a view template) into a DocumentFragment. */
export function parseHtml(html) {
    const template = document.createElement(Tag.TEMPLATE);
    template.innerHTML = html;
    return template.content;
}

/** "<strong>label</strong> value" paragraph used by the card views. */
export function createLabelledLine(label, value) {
    return createElement(Tag.P, {
        children: [createElement(Tag.STRONG, { text: label }), ` ${value}`],
    });
}
