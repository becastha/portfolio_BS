// Localization service: every piece of text the user sees comes from locales/<locale>.json.
//
// Markup:  <span data-i18n="some.key"></span>          -> textContent
//          <button data-i18n-title="some.key"></button> -> title attribute
// Code:    localization.t(StringKey.SOMETHING)

import { Attr } from '../constants/html.js';
import { fetchJson } from '../data/http.js';
import { DevMessage, logger } from '../logging/logger.js';

const DEFAULT_LOCALE = 'en';
const localeUrl = locale => new URL(`./locales/${locale}.json`, import.meta.url);

const I18nSelector = Object.freeze({
    TEXT: '[data-i18n]',
    TITLE: '[data-i18n-title]',
});

class Localization {
    #strings = {};

    async load(locale = DEFAULT_LOCALE) {
        try {
            this.#strings = await fetchJson(localeUrl(locale));
        } catch (error) {
            logger.error(DevMessage.LOCALE_LOAD_FAILED, error);
        }
    }

    /** Returns the string for a key; falls back to the key itself so a missing string is visible. */
    t(key) {
        return this.#strings[key] ?? key;
    }

    /** Fills every element under root that declares a localization key. */
    apply(root) {
        root.querySelectorAll(I18nSelector.TEXT).forEach(element => {
            element.textContent = this.t(element.dataset.i18n);
        });
        root.querySelectorAll(I18nSelector.TITLE).forEach(element => {
            element.setAttribute(Attr.TITLE, this.t(element.dataset.i18nTitle));
        });
    }
}

export const localization = new Localization();
