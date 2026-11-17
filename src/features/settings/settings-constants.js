// Constants of the settings feature (theme, font, text size, settings panel).

/** Theme ids (the data-theme values in index.html) and the body class each one applies. */
export const THEME_BODY_CLASS = Object.freeze({
    default: null,
    dark: 'dark-theme',
    rocketbook: 'rocketbook-theme',
});

/** Font ids (the data-font values in index.html) and the body class each one applies. */
export const FONT_BODY_CLASS = Object.freeze({
    serif: 'serif-font',
    sans: 'sans-font',
    mono: 'mono-font',
});

/** Text sizes from smallest to largest: the id that is saved, and how much it scales the page's text. */
export const TEXT_SIZES = Object.freeze([
    Object.freeze({ id: 'small', scale: 0.9 }),
    Object.freeze({ id: 'normal', scale: 1 }),
    Object.freeze({ id: 'large', scale: 1.15 }),
    Object.freeze({ id: 'larger', scale: 1.3 }),
    Object.freeze({ id: 'largest', scale: 1.45 }),
]);

/** CSS variable on <html> that carries the text scale; the page's stylesheet multiplies its base size by it. */
export const TEXT_SCALE_VARIABLE = '--text-scale';

export const PERCENT_SUFFIX = '%';

export const SettingsDefault = Object.freeze({
    THEME: 'default',
    FONT: 'serif',
    TEXT_SIZE: 'normal',
});

export const SettingsStorageKey = Object.freeze({
    THEME: 'theme',
    FONT: 'font',
    TEXT_SIZE: 'textSize',
});

export const SettingsElementId = Object.freeze({
    TOGGLE: 'settings-toggle',
    PANEL: 'settings-panel',
    CLOSE: 'close-settings',
    TEXT_SMALLER: 'text-size-decrease',
    TEXT_LARGER: 'text-size-increase',
    TEXT_SIZE_VALUE: 'text-size-value',
});

export const SettingsSelector = Object.freeze({
    THEME_BUTTON: '.theme-btn',
    FONT_BUTTON: '.font-btn',
});
