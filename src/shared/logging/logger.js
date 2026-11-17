// Developer-only logging. Nothing in this file is shown to the user.

/** Developer-only text: console messages, never rendered in the page. */
export const DevMessage = Object.freeze({
    AUDIO_UNAVAILABLE: 'Web Audio API is unavailable; flip sound disabled',
    HTTP_ERROR: 'Request failed',
    LOAD_FAILED: 'Failed to load data',
    LOCALE_LOAD_FAILED: 'Failed to load localization strings',
    PAGE_TEMPLATE_FAILED: 'Failed to load page template',
    SKYLINE_FAILED: 'Skyline artwork could not be loaded; the page is shown without it',
    STARFIELD_FAILED: 'Starfield background could not start',
    STORAGE_UNAVAILABLE: 'localStorage is unavailable; settings will not persist',
});

export const logger = Object.freeze({
    warn: (message, detail) => console.warn(message, detail ?? ''),
    error: (message, detail) => console.error(message, detail ?? ''),
});
