// Constants of the cursor-effects feature: ripples under the moving pointer, the pointer crumbling
// to dust when it rests, fire when it moves fast, a puff of gas on a left click, and a cloud calling
// for help on a right click. Writing near the pointer also burns away and comes back.

export const CursorCssClass = Object.freeze({
    CANVAS: 'cursor-effects',
    /** Set on <html> while the pointer has crumbled away; hides the real cursor. */
    CURSOR_GONE: 'cursor-dusted',
});

export const CANVAS_TAG = 'canvas';
export const CANVAS_CONTEXT = '2d';
export const MOUSE_POINTER = 'mouse';
export const PRIMARY_BUTTON = 0;
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
export const NORMAL_BLEND = 'source-over';

export const PointerEvent = Object.freeze({
    MOVE: 'pointermove',
    DOWN: 'pointerdown',
    LEAVE: 'pointerleave',
    CONTEXT_MENU: 'contextmenu',
});

export const ParticleKind = Object.freeze({
    RIPPLE: 'ripple',
    DUST: 'dust',
    FLAME: 'flame',
    GAS: 'gas',
    CLOUD: 'cloud',
});

/** At most this many particles alive at once; new ones are dropped beyond it. */
export const PARTICLE_LIMIT = 420;

/** 1. Water ripples left behind the moving pointer. */
export const Ripple = Object.freeze({
    MIN_INTERVAL_MS: 70,
    MIN_DISTANCE_PX: 16,
    LIFE_MS: 900,
    START_RADIUS: 3,
    END_RADIUS: 42,
    /** A second, smaller ring follows the first. */
    INNER_RING_SCALE: 0.55,
    LINE_WIDTH: 1.6,
    LIGHT: [235, 246, 255],
    DEEP: [40, 95, 150],
    LIGHT_ALPHA: 0.7,
    DEEP_ALPHA: 0.35,
});

/** 2. The pointer crumbles to dust when it rests in one place. */
export const Dust = Object.freeze({
    IDLE_MS: 2500,
    GRAINS: 90,
    LIFE_MIN_MS: 900,
    LIFE_RANGE_MS: 900,
    SIZE_MIN: 1,
    SIZE_RANGE: 1.4,
    /** px per frame: first scatter, steady fall, and a light breeze to the right. */
    SCATTER: 0.5,
    GRAVITY: 0.035,
    BREEZE: 0.012,
    /** Share of grains taken from the cursor's white edge rather than its dark body. */
    EDGE_SHARE: 0.3,
    BODY: [22, 18, 14],
    EDGE: [250, 248, 240],
    /** Outline of an arrow cursor, in px from its tip. */
    CURSOR_OUTLINE: Object.freeze([
        [0, 0],
        [0, 16],
        [4, 12.5],
        [7, 19],
        [9.5, 18],
        [6.5, 11.5],
        [12, 11.5],
    ]),
});

/** 3. Fire when the pointer moves fast. */
export const Fire = Object.freeze({
    /** Pointer speed, in px per millisecond, above which it catches fire. */
    SPEED: 1.7,
    FLAMES_PER_SPEED: 4,
    FLAMES_MAX: 14,
    LIFE_MIN_MS: 650,
    LIFE_RANGE_MS: 550,
    RADIUS_MIN: 10,
    RADIUS_RANGE: 12,
    RISE_MIN: 0.6,
    RISE_RANGE: 1.1,
    SWAY: 0.5,
    SPREAD_PX: 6,
    /** Colour through a flame's life: white-hot, yellow, orange, red, smoke. */
    COLOURS: Object.freeze([
        [0, [255, 246, 190], 1],
        [0.3, [255, 170, 40], 0.95],
        [0.65, [230, 60, 20], 0.8],
        [1, [70, 55, 50], 0],
    ]),
});

/** 4. A puff of gas on a left click. */
export const Gas = Object.freeze({
    PUFFS: 18,
    LIFE_MIN_MS: 900,
    LIFE_RANGE_MS: 700,
    START_RADIUS: 8,
    END_RADIUS_MIN: 30,
    END_RADIUS_RANGE: 26,
    SPEED_MIN: 0.5,
    SPEED_RANGE: 1.6,
    /** The puff bursts down and behind, then floats up. */
    BURST_ANGLE: Math.PI * 0.62,
    BURST_SPREAD: Math.PI * 0.55,
    DRAG: 0.965,
    LIFT: 0.012,
    ALPHA: 0.72,
    COLOURS: Object.freeze([
        [96, 128, 44],
        [124, 118, 52],
        [74, 104, 40],
    ]),
});

/** 5. A cloud with a random cry on a right click. The cries are the cursor.cries list in the localization file. */
export const HelpCloud = Object.freeze({
    LIFE_MS: 2000,
    /** px per frame the cloud floats upwards. */
    RISE: 0.3,
    /** The cloud appears this far above the pointer. */
    OFFSET_Y: -40,
    PADDING_X: 20,
    HEIGHT: 40,
    BUMPS: 10,
    BUMP_RADIUS: 15,
    OUTLINE_WIDTH: 2.5,
    /** Share of its life spent fading in, and the point after which it fades out. */
    FADE_IN: 0.1,
    FADE_OUT_FROM: 0.7,
    FILL: [255, 255, 255],
    OUTLINE: [43, 23, 7],
    TEXT: [160, 28, 18],
    FONT_WEIGHT: 'bold',
    FONT_SIZE_PX: 17,
    TEXT_ALIGN: 'center',
    TEXT_BASELINE: 'middle',
});

/** 6. Writing near the pointer burns, falls as ash, and comes back. */
export const Burn = Object.freeze({
    /** A word burns when the pointer comes this close to it. */
    REACH_PX: 14,
    /** Points checked around the pointer, and how far out. */
    RING_POINTS: 5,
    RING_RADIUS_PX: 12,
    SCAN_INTERVAL_MS: 60,
    /** At most this many words burning or burnt at once. */
    MAX_WORDS: 40,
    /** How long a word burns; must match text-burn in cursor-effects.css. */
    BURN_MS: 900,
    /** The word comes back this long after it caught fire. */
    REVIVE_AFTER_MS: 3000,
    /** How long coming back takes; must match text-revive in cursor-effects.css. */
    REVIVE_MS: 700,
    FLAMES: 4,
    ASH_GRAINS: 10,
    /** One more grain of ash for every this many px of the word's width. */
    PX_PER_EXTRA_GRAIN: 6,
    ASH_COLOURS: Object.freeze([
        [58, 48, 42],
        [112, 100, 90],
        [226, 96, 34],
    ]),
    CLASS_BURNING: 'text-burning',
    CLASS_BURNT: 'text-burnt',
    CLASS_REVIVING: 'text-reviving',
    /** What separates one word from the next. */
    WORD_BREAK: /\s/,
    /** Writing that never burns: controls, links (so they stay usable), and words already alight. */
    FIREPROOF_SELECTOR: 'a, button, input, .settings-panel, .text-burning, .text-burnt, .text-reviving',
});

/** A right click on these keeps the browser's own menu (to open or copy a link). */
export const NATIVE_MENU_SELECTOR = 'a';

export const rgba = ([red, green, blue], alpha) => `rgba(${red}, ${green}, ${blue}, ${alpha})`;
