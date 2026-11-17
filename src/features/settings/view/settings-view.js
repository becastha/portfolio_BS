// Settings View: the settings panel, the theme and font classes on <body>, and the text scale on <html>.
// A page may offer only some of the settings; controls that are not on the page are skipped.

import { SharedCssClass } from '../../../shared/constants/css.js';
import { DomEvent } from '../../../shared/constants/html.js';
import { byId } from '../../../shared/ui/dom.js';
import {
    FONT_BODY_CLASS,
    PERCENT_SUFFIX,
    SettingsElementId,
    SettingsSelector,
    TEXT_SCALE_VARIABLE,
    THEME_BODY_CLASS,
} from '../settings-constants.js';

export class SettingsView {
    #viewModel;
    #toggle = byId(SettingsElementId.TOGGLE);
    #panel = byId(SettingsElementId.PANEL);
    #close = byId(SettingsElementId.CLOSE);
    #textSmaller = byId(SettingsElementId.TEXT_SMALLER);
    #textLarger = byId(SettingsElementId.TEXT_LARGER);
    #textSizeValue = byId(SettingsElementId.TEXT_SIZE_VALUE);
    #themeButtons = [...document.querySelectorAll(SettingsSelector.THEME_BUTTON)];
    #fontButtons = [...document.querySelectorAll(SettingsSelector.FONT_BUTTON)];

    /** @param {import('../viewmodel/settings-viewmodel.js').SettingsViewModel} viewModel */
    constructor(viewModel) {
        this.#viewModel = viewModel;
    }

    start() {
        const viewModel = this.#viewModel;

        this.#toggle.addEventListener(DomEvent.CLICK, event => {
            event.stopPropagation();
            viewModel.togglePanel();
        });
        this.#close.addEventListener(DomEvent.CLICK, () => viewModel.closePanel());
        document.addEventListener(DomEvent.CLICK, event => {
            if (!this.#panel.contains(event.target)) viewModel.closePanel();
        });

        this.#themeButtons.forEach(button => {
            button.addEventListener(DomEvent.CLICK, () => viewModel.selectTheme(button.dataset.theme));
        });
        this.#fontButtons.forEach(button => {
            button.addEventListener(DomEvent.CLICK, () => viewModel.selectFont(button.dataset.font));
        });

        this.#textSmaller?.addEventListener(DomEvent.CLICK, () => viewModel.decreaseTextSize());
        this.#textLarger?.addEventListener(DomEvent.CLICK, () => viewModel.increaseTextSize());

        viewModel.state.subscribe(state => this.#render(state));
    }

    #render({ theme, font, textScale, canIncreaseText, canDecreaseText, isPanelOpen }) {
        this.#panel.classList.toggle(SharedCssClass.ACTIVE, isPanelOpen);

        document.documentElement.style.setProperty(TEXT_SCALE_VARIABLE, textScale);
        if (this.#textSizeValue) this.#textSizeValue.textContent = `${Math.round(textScale * 100)}${PERCENT_SUFFIX}`;
        if (this.#textSmaller) this.#textSmaller.disabled = !canDecreaseText;
        if (this.#textLarger) this.#textLarger.disabled = !canIncreaseText;

        applyBodyClass(THEME_BODY_CLASS, theme);
        applyBodyClass(FONT_BODY_CLASS, font);

        this.#themeButtons.forEach(button => {
            button.classList.toggle(SharedCssClass.ACTIVE, button.dataset.theme === theme);
        });
        this.#fontButtons.forEach(button => {
            button.classList.toggle(SharedCssClass.ACTIVE, button.dataset.font === font);
        });
    }
}

/** Removes every class of the option table from <body>, then adds the selected one (if it has a class). */
function applyBodyClass(classByOption, selected) {
    const classes = Object.values(classByOption).filter(Boolean);
    document.body.classList.remove(...classes);
    if (classByOption[selected]) document.body.classList.add(classByOption[selected]);
}
