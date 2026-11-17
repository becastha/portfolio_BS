// Settings View: the settings panel, and the theme and font classes on <body>.

import { SharedCssClass } from '../../../shared/constants/css.js';
import { DomEvent } from '../../../shared/constants/html.js';
import { byId } from '../../../shared/ui/dom.js';
import {
    FONT_BODY_CLASS,
    SettingsElementId,
    SettingsSelector,
    THEME_BODY_CLASS,
} from '../settings-constants.js';

export class SettingsView {
    #viewModel;
    #toggle = byId(SettingsElementId.TOGGLE);
    #panel = byId(SettingsElementId.PANEL);
    #close = byId(SettingsElementId.CLOSE);
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

        viewModel.state.subscribe(state => this.#render(state));
    }

    #render({ theme, font, isPanelOpen }) {
        this.#panel.classList.toggle(SharedCssClass.ACTIVE, isPanelOpen);

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
