// Constants of the skyline feature (the Kathmandu skyline drawn behind the page).

export const SKYLINE_ARTWORK_URL = new URL('./view/assets/kathmandu-skyline.svg', import.meta.url);

/** Wrapper the artwork is mounted in. */
export const SKYLINE_LAYER_CLASS = 'skyline-layer';

/** Set on <body> once the skyline is fully inked; skyline.css then lightens writing that crosses it. */
export const SKYLINE_INKED_CLASS = 'skyline-inked';

/** The filled illustration inside the artwork, and the animation that uncovers it. */
export const SKYLINE_INK_SELECTOR = '.skyline-ink';
export const SKYLINE_INK_ANIMATION = 'ink-wipe';

export const NO_ANIMATION = 'none';
