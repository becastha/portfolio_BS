// Burns the writing near the pointer: the word catches fire, chars, falls away as ash, and
// comes back a few seconds later. Words are wrapped in a <span> only while they burn, so the
// page's text is left untouched the rest of the time.

import { Tag } from '../../../shared/constants/html.js';
import { Burn } from '../cursor-effects-constants.js';
import { between, createFlame, createGrain, pick } from './particles.js';

export class TextBurner {
    #emit;
    #burning = new Set();
    #lastScan = 0;

    /** @param {(particle: object) => void} emit adds a particle to the effects canvas */
    constructor(emit) {
        this.#emit = emit;
    }

    /** Sets fire to the words within reach of the point (the pointer's position in the window). */
    scan(point) {
        const now = performance.now();
        if (now - this.#lastScan < Burn.SCAN_INTERVAL_MS) return;
        this.#lastScan = now;

        samplePoints(point).forEach(([x, y]) => {
            if (this.#burning.size >= Burn.MAX_WORDS) return;
            const range = wordAt(x, y);
            if (!range) return;
            const rect = range.getBoundingClientRect();
            if (distanceToRect(point, rect) <= Burn.REACH_PX) this.#ignite(range, rect);
        });
    }

    #ignite(range, rect) {
        const word = document.createElement(Tag.SPAN);
        word.className = Burn.CLASS_BURNING;
        range.surroundContents(word);
        this.#burning.add(word);

        const scatter = (count, create) => {
            for (let i = 0; i < count; i++) {
                this.#emit(create(rect.left + Math.random() * rect.width, rect.top + Math.random() * rect.height));
            }
        };
        scatter(Burn.FLAMES, (x, y) => createFlame(x, y));

        // Burnt out: the word is gone (it keeps its place in the line) and its ash drifts down
        setTimeout(() => {
            word.className = Burn.CLASS_BURNT;
            scatter(Burn.ASH_GRAINS + Math.round(rect.width / Burn.PX_PER_EXTRA_GRAIN), (x, y) =>
                createGrain(x, y, pick(Burn.ASH_COLOURS)),
            );
        }, Burn.BURN_MS);

        // Back to life, then unwrapped so the text is exactly as it was
        setTimeout(() => {
            word.className = Burn.CLASS_REVIVING;
        }, Burn.REVIVE_AFTER_MS);
        setTimeout(() => {
            const parent = word.parentNode;
            word.replaceWith(...word.childNodes);
            parent?.normalize();
            this.#burning.delete(word);
        }, Burn.REVIVE_AFTER_MS + Burn.REVIVE_MS);
    }
}

/** The point itself and a ring of points around it. */
function samplePoints({ x, y }) {
    const ring = Array.from({ length: Burn.RING_POINTS }, (_, i) => {
        const angle = (i / Burn.RING_POINTS) * Math.PI * 2 + between(0, 0.5);
        return [x + Math.cos(angle) * Burn.RING_RADIUS_PX, y + Math.sin(angle) * Burn.RING_RADIUS_PX];
    });
    return [[x, y], ...ring];
}

/** A range around the word of text at the point, or null when there is none that may burn. */
function wordAt(x, y) {
    const caret = caretAt(x, y);
    if (!caret || caret.node.nodeType !== Node.TEXT_NODE) return null;
    const { node, offset } = caret;
    if (!node.parentElement || node.parentElement.closest(Burn.FIREPROOF_SELECTOR)) return null;

    const text = node.data;
    let start = Math.min(offset, text.length);
    let end = start;
    while (start > 0 && !Burn.WORD_BREAK.test(text[start - 1])) start--;
    while (end < text.length && !Burn.WORD_BREAK.test(text[end])) end++;
    if (end === start) return null;

    const range = document.createRange();
    range.setStart(node, start);
    range.setEnd(node, end);
    return range;
}

/** The text position under a point, whichever way this browser offers it. */
function caretAt(x, y) {
    if (document.caretPositionFromPoint) {
        const position = document.caretPositionFromPoint(x, y);
        return position && { node: position.offsetNode, offset: position.offset };
    }
    const range = document.caretRangeFromPoint?.(x, y);
    return range && { node: range.startContainer, offset: range.startOffset };
}

function distanceToRect({ x, y }, rect) {
    const dx = Math.max(rect.left - x, 0, x - rect.right);
    const dy = Math.max(rect.top - y, 0, y - rect.bottom);
    return Math.hypot(dx, dy);
}
