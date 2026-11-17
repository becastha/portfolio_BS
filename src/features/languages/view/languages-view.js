// Languages View: renders one row per spoken language.

import { Tag } from '../../../shared/constants/html.js';
import { StringKey } from '../../../shared/localization/string-keys.js';
import { byId, createElement } from '../../../shared/ui/dom.js';
import { bindLoadable } from '../../../shared/ui/loadable-view.js';
import { LANGUAGES_CONTAINER_ID, LanguagesCssClass } from '../languages-constants.js';

export class LanguagesView {
    #viewModel;

    /** @param {import('../viewmodel/languages-viewmodel.js').LanguagesViewModel} viewModel */
    constructor(viewModel) {
        this.#viewModel = viewModel;
    }

    start() {
        bindLoadable(
            byId(LANGUAGES_CONTAINER_ID),
            this.#viewModel,
            languages => languages.map(renderLanguageItem),
            StringKey.LANGUAGES_ERROR,
        );
    }
}

function renderLanguageItem(language) {
    return createElement(Tag.DIV, {
        className: LanguagesCssClass.ITEM,
        children: [
            createElement(Tag.SPAN, { className: LanguagesCssClass.NAME, text: language.name }),
            createElement(Tag.SPAN, { className: LanguagesCssClass.PROFICIENCY, text: language.proficiency }),
        ],
    });
}
