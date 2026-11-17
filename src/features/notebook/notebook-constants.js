// Constants of the notebook feature (paging, zoom, fullscreen, input).

/** Page templates in reading order. Add, remove or reorder pages here. */
const PAGE_TEMPLATE_FILES = Object.freeze([
    'cover.html',
    'overview.html',
    'projects.html',
    'skills.html',
    'experience.html',
]);

export const PAGE_TEMPLATE_URLS = Object.freeze(
    PAGE_TEMPLATE_FILES.map(file => new URL(`./view/pages/${file}`, import.meta.url)),
);

export const NotebookConfig = Object.freeze({
    FLIP_DURATION_MS: 700,
    ZOOM_INITIAL: 1,
    ZOOM_MIN: 0.8,
    ZOOM_MAX: 1.5,
    ZOOM_STEP: 0.1,
    SWIPE_THRESHOLD_PX: 50,
    /** Mouse drag: movement needed before a press becomes a drag. */
    DRAG_START_PX: 6,
    /** Mouse drag: share of the page height that folds the page completely. */
    DRAG_FULL_FOLD_RATIO: 0.6,
    /** Mouse drag: fold progress (0..1) past which releasing turns the page. */
    DRAG_COMMIT_PROGRESS: 0.3,
});

export const NotebookElementId = Object.freeze({
    NOTEBOOK: 'notebook',
    CURRENT_PAGE: 'current-page',
    TOTAL_PAGES: 'total-pages',
    BTN_FIRST: 'btn-first',
    BTN_PREVIOUS: 'btn-prev',
    BTN_NEXT: 'btn-next',
    BTN_LAST: 'btn-last',
    BTN_ZOOM_IN: 'btn-zoom-in',
    BTN_ZOOM_OUT: 'btn-zoom-out',
    BTN_FULLSCREEN: 'btn-fullscreen',
});

export const NotebookCssClass = Object.freeze({
    FLIPPED: 'flipped',
    PAGE_DRAGGING: 'dragging',
    NOTEBOOK_DRAGGING: 'is-dragging',
    PAGE_NUMBER: 'page-number',
});

export const NotebookSelector = Object.freeze({
    PAGE: '.page',
    PAGE_CONTENT: '.page-content',
    INTERACTIVE: 'a, button, input, select, textarea',
    ICON: 'i',
});

export const NotebookIcon = Object.freeze({
    FULLSCREEN_ENTER: 'fa-expand',
    FULLSCREEN_EXIT: 'fa-compress',
});

/** CSS transform that applies the zoom level to the notebook. */
export const zoomTransform = zoomLevel => `scale(${zoomLevel})`;

export const NotebookCssVariable = Object.freeze({
    /** Fold progress of a page, 0 (flat) to 1 (turned). */
    FOLD: '--fold',
    /** Duration of the page-turn animation. */
    FLIP_DURATION: '--flip-duration',
});

export const flipDurationCss = milliseconds => `${milliseconds}ms`;

/** Pointer types that can drag a page. Touch keeps the swipe gesture and content scrolling. */
export const DRAG_POINTER_TYPES = Object.freeze(['mouse', 'pen']);

export const PRIMARY_MOUSE_BUTTON = 0;
