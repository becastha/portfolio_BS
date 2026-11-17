// Persists the user's theme and font in localStorage.

import { DevMessage, logger } from '../../../shared/logging/logger.js';
import { FONT_BODY_CLASS, SettingsDefault, SettingsStorageKey, THEME_BODY_CLASS } from '../settings-constants.js';

function read(key) {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        logger.warn(DevMessage.STORAGE_UNAVAILABLE, error);
        return null;
    }
}

function write(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        logger.warn(DevMessage.STORAGE_UNAVAILABLE, error);
    }
}

/** Returns the saved value if it is still a known option, otherwise the default. */
function readOption(key, options, fallback) {
    const saved = read(key);
    return saved !== null && Object.hasOwn(options, saved) ? saved : fallback;
}

export const settingsRepository = Object.freeze({
    loadTheme: () => readOption(SettingsStorageKey.THEME, THEME_BODY_CLASS, SettingsDefault.THEME),
    saveTheme: theme => write(SettingsStorageKey.THEME, theme),
    loadFont: () => readOption(SettingsStorageKey.FONT, FONT_BODY_CLASS, SettingsDefault.FONT),
    saveFont: font => write(SettingsStorageKey.FONT, font),
});
