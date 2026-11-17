// Constants of the settings feature (theme, font, settings panel).

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

export const SettingsDefault = Object.freeze({
    THEME: 'default',
    FONT: 'serif',
});

export const SettingsStorageKey = Object.freeze({
    THEME: 'theme',
    FONT: 'font',
});

export const SettingsElementId = Object.freeze({
    TOGGLE: 'settings-toggle',
    PANEL: 'settings-panel',
    CLOSE: 'close-settings',
});

export const SettingsSelector = Object.freeze({
    THEME_BUTTON: '.theme-btn',
    FONT_BUTTON: '.font-btn',
});
