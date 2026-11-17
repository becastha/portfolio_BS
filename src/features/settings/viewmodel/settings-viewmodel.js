// Settings ViewModel: selected theme and font, and whether the panel is open.

import { Observable } from '../../../shared/mvvm/observable.js';
import { FONT_BODY_CLASS, THEME_BODY_CLASS } from '../settings-constants.js';

export class SettingsViewModel {
    #repository;

    /** @param {typeof import('../model/settings-repository.js').settingsRepository} repository */
    constructor(repository) {
        this.#repository = repository;
        this.state = new Observable({
            theme: repository.loadTheme(),
            font: repository.loadFont(),
            isPanelOpen: false,
        });
    }

    selectTheme(theme) {
        if (!Object.hasOwn(THEME_BODY_CLASS, theme)) return;
        this.#repository.saveTheme(theme);
        this.#update({ theme });
    }

    selectFont(font) {
        if (!Object.hasOwn(FONT_BODY_CLASS, font)) return;
        this.#repository.saveFont(font);
        this.#update({ font });
    }

    togglePanel() {
        this.#update({ isPanelOpen: !this.state.value.isPanelOpen });
    }

    closePanel() {
        if (this.state.value.isPanelOpen) this.#update({ isPanelOpen: false });
    }

    #update(change) {
        this.state.set({ ...this.state.value, ...change });
    }
}
