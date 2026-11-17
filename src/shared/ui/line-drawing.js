// Draws lines as if inked by hand: SVG line art stroke by stroke, the borders of boxes side by
// side, and the rules under rows. Timing and looks live in CSS (see manuscript.css); this file
// only prepares the elements and tells CSS when each one comes into view.

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

const LineDrawing = Object.freeze({
    /** SVGs whose shapes are drawn on. */
    DRAWING_SELECTOR: 'svg.ink-drawing',
    USE_SELECTOR: 'use',
    SHAPE_SELECTOR: 'path, rect, line, circle, ellipse, polyline, polygon',
    /** Class given to every SVG shape that is drawn on. */
    LINE_CLASS: 'draw-line',
    /** Position of a line in its drawing order, read by CSS to delay its turn. */
    INDEX_VARIABLE: '--draw-index',
    HREF_ATTRIBUTE: 'href',
    VIEW_BOX_ATTRIBUTE: 'viewBox',
    /** Normalises every shape to length 1, so one dash pattern draws any of them. */
    PATH_LENGTH_ATTRIBUTE: 'pathLength',
    PATH_LENGTH: '1',
    /** Shapes marked data-ink-static (or inside such a group) are left alone, not drawn on. */
    STATIC_SELECTOR: '[data-ink-static]',
    /** data-ink-order="own": the drawing numbers its lines from zero instead of queueing behind the others. */
    OWN_ORDER: 'own',

    /** Boxes whose border is drawn: data-ink-box="top right bottom left" lists the sides, in drawing order. */
    BOX_SELECTOR: '[data-ink-box]',
    SIDE_SEPARATOR: ' ',
    FRAME_CLASS: 'ink-frame',
    /** Second, inner line of a doubled side (data-ink-double="left right"). */
    INNER_LINE_CLASS: 'ink-frame-inner',
    SIDE_CLASS_PREFIX: 'ink-side-',
    ARIA_HIDDEN_ATTRIBUTE: 'aria-hidden',
    TRUE: 'true',

    /** Class given to rows whose bottom rule is drawn. */
    RULE_CLASS: 'ink-rule',
    /** Set once an element has come into view; CSS starts its drawing then. */
    VISIBLE_CLASS: 'ink-visible',
});

const SvgTag = Object.freeze({ SVG: 'svg', LINE: 'line' });

/** End points of each side of a box, as [x1, y1, x2, y2], going round clockwise from the top left. */
const SIDE_POINTS = Object.freeze({
    top: ['0', '0', '100%', '0'],
    right: ['100%', '0', '100%', '100%'],
    bottom: ['100%', '100%', '0', '100%'],
    left: ['0', '0', '0', '100%'],
});
const LINE_ATTRIBUTES = Object.freeze(['x1', 'y1', 'x2', 'y2']);

/**
 * Prepares every SVG line drawing under root. Shapes are drawn in document order.
 * @param {ParentNode} root
 */
export function animateLineDrawings(root) {
    let sharedIndex = 0;
    root.querySelectorAll(LineDrawing.DRAWING_SELECTOR).forEach(drawing => {
        expandSymbols(drawing);
        const ownOrder = drawing.dataset.inkOrder === LineDrawing.OWN_ORDER;
        let ownIndex = 0;
        drawing.querySelectorAll(LineDrawing.SHAPE_SELECTOR).forEach(shape => {
            if (shape.closest(LineDrawing.STATIC_SELECTOR)) return;
            prepareLine(shape, ownOrder ? ownIndex++ : sharedIndex++);
        });
    });
}

/**
 * Gives every box under root that asks for it a border made of lines, drawn side by side
 * once the box comes into view.
 * @param {ParentNode} root
 */
export function frameInkBoxes(root) {
    root.querySelectorAll(LineDrawing.BOX_SELECTOR).forEach(box => {
        const doubled = (box.dataset.inkDouble ?? '').split(LineDrawing.SIDE_SEPARATOR);
        const frame = document.createElementNS(SVG_NAMESPACE, SvgTag.SVG);
        frame.classList.add(LineDrawing.FRAME_CLASS);
        frame.setAttribute(LineDrawing.ARIA_HIDDEN_ATTRIBUTE, LineDrawing.TRUE);

        let index = 0;
        box.dataset.inkBox
            .split(LineDrawing.SIDE_SEPARATOR)
            .filter(side => SIDE_POINTS[side])
            .forEach(side => {
                frame.append(createSide(side, index++));
                if (doubled.includes(side)) {
                    const inner = createSide(side, index++);
                    inner.classList.add(LineDrawing.INNER_LINE_CLASS);
                    frame.append(inner);
                }
            });
        box.append(frame);
        drawWhenVisible(box);
    });
}

/**
 * Draws a rule under every element matching the selector, now and whenever one is added later
 * (the content features render their rows after the page has started).
 * @param {Element} root
 * @param {string} selector
 */
export function ruleRows(root, selector) {
    const mark = row => {
        row.classList.add(LineDrawing.RULE_CLASS);
        drawWhenVisible(row);
    };
    root.querySelectorAll(selector).forEach(mark);
    new MutationObserver(mutations => {
        mutations.forEach(mutation =>
            mutation.addedNodes.forEach(node => {
                if (!(node instanceof Element)) return;
                if (node.matches(selector)) mark(node);
                node.querySelectorAll(selector).forEach(mark);
            }),
        );
    }).observe(root, { childList: true, subtree: true });
}

/** Elements that come into view together are numbered, so their lines are drawn one after another. */
const visibility = new IntersectionObserver(entries => {
    let index = 0;
    entries
        .filter(entry => entry.isIntersecting)
        .forEach(entry => {
            const element = entry.target;
            if (element.classList.contains(LineDrawing.RULE_CLASS)) {
                element.style.setProperty(LineDrawing.INDEX_VARIABLE, index++);
            }
            element.classList.add(LineDrawing.VISIBLE_CLASS);
            visibility.unobserve(element);
        });
});

function drawWhenVisible(element) {
    visibility.observe(element);
}

function prepareLine(shape, index) {
    shape.setAttribute(LineDrawing.PATH_LENGTH_ATTRIBUTE, LineDrawing.PATH_LENGTH);
    shape.style.setProperty(LineDrawing.INDEX_VARIABLE, index);
    shape.classList.add(LineDrawing.LINE_CLASS);
}

function createSide(side, index) {
    const line = document.createElementNS(SVG_NAMESPACE, SvgTag.LINE);
    LINE_ATTRIBUTES.forEach((attribute, position) => line.setAttribute(attribute, SIDE_POINTS[side][position]));
    line.classList.add(`${LineDrawing.SIDE_CLASS_PREFIX}${side}`);
    prepareLine(line, index);
    return line;
}

/** Replaces each <use> with a copy of the symbol's shapes, so they can be animated one by one. */
function expandSymbols(drawing) {
    drawing.querySelectorAll(LineDrawing.USE_SELECTOR).forEach(use => {
        const symbol = document.querySelector(use.getAttribute(LineDrawing.HREF_ATTRIBUTE));
        if (!symbol) return;
        const viewBox = symbol.getAttribute(LineDrawing.VIEW_BOX_ATTRIBUTE);
        if (viewBox) drawing.setAttribute(LineDrawing.VIEW_BOX_ATTRIBUTE, viewBox);
        use.replaceWith(...[...symbol.children].map(shape => shape.cloneNode(true)));
    });
}
