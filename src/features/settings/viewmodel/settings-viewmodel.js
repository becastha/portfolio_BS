// Settings ViewModel: selected theme, font and text size, and whether the panel is open.

import { Observable } from '../../../shared/mvvm/observable.js';
import { FONT_BODY_CLASS, TEXT_SIZES, THEME_BODY_CLASS } from '../settings-constants.js';

export class SettingsViewModel {
    #repository;
    #textSizeIndex;

    /** @param {typeof import('../model/settings-repository.js').settingsRepository} repository */
    constructor(repository) {
        this.#repository = repository;
        this.#textSizeIndex = TEXT_SIZES.findIndex(size => size.id === repository.loadTextSize());
        this.state = new Observable({
            theme: repository.loadTheme(),
            font: repository.loadFont(),
            ...this.#textSizeState(),
            isPanelOpen: false,
        });
    }

    increaseTextSize() {
        this.#stepTextSize(1);
    }

    decreaseTextSize() {
        this.#stepTextSize(-1);
    }

    #stepTextSize(step) {
        const index = this.#textSizeIndex + step;
        if (index < 0 || index >= TEXT_SIZES.length) return;
        this.#textSizeIndex = index;
        this.#repository.saveTextSize(TEXT_SIZES[index].id);
        this.#update(this.#textSizeState());
    }

    #textSizeState() {
        return {
            textScale: TEXT_SIZES[this.#textSizeIndex].scale,
            canIncreaseText: this.#textSizeIndex < TEXT_SIZES.length - 1,
            canDecreaseText: this.#textSizeIndex > 0,
        };
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
