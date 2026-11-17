// Skyline View: mounts the skyline artwork behind the page and has it drawn.
// Purely decorative, so it has no ViewModel; a failed load simply leaves the background empty.

import { Attr, AttrValue, DomEvent, Tag } from '../../../shared/constants/html.js';
import { DevMessage, logger } from '../../../shared/logging/logger.js';
import { createElement, parseHtml } from '../../../shared/ui/dom.js';
import { animateLineDrawings } from '../../../shared/ui/line-drawing.js';
import {
    NO_ANIMATION,
    SKYLINE_INK_ANIMATION,
    SKYLINE_INK_SELECTOR,
    SKYLINE_INKED_CLASS,
    SKYLINE_LAYER_CLASS,
} from '../skyline-constants.js';

export class SkylineView {
    #loadArtwork;

    /** @param {() => Promise<string>} loadArtwork */
    constructor(loadArtwork) {
        this.#loadArtwork = loadArtwork;
    }

    async start() {
        try {
            const layer = createElement(Tag.DIV, {
                className: SKYLINE_LAYER_CLASS,
                attributes: { [Attr.ARIA_HIDDEN]: AttrValue.TRUE },
                children: [parseHtml(await this.#loadArtwork())],
            });
            document.body.prepend(layer);
            animateLineDrawings(layer);
            this.#markWhenInked(layer);
        } catch (error) {
            logger.warn(DevMessage.SKYLINE_FAILED, error);
        }
    }

    /** Tells the page when the ink has arrived everywhere (at once, if nothing is animated). */
    #markWhenInked(layer) {
        const inked = () => document.body.classList.add(SKYLINE_INKED_CLASS);
        const ink = layer.querySelector(SKYLINE_INK_SELECTOR);
        if (!ink || getComputedStyle(ink).animationName === NO_ANIMATION) {
            inked();
            return;
        }
        ink.addEventListener(DomEvent.ANIMATION_END, event => {
            if (event.animationName === SKYLINE_INK_ANIMATION) inked();
        });
    }
}
