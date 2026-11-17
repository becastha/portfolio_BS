// Education View: renders one entry per course of study.

import { Tag } from '../../../shared/constants/html.js';
import { StringKey } from '../../../shared/localization/string-keys.js';
import { byId, createElement } from '../../../shared/ui/dom.js';
import { bindLoadable } from '../../../shared/ui/loadable-view.js';
import { EDUCATION_CONTAINER_ID, EducationCssClass, SCHOOL_LOCATION_SEPARATOR } from '../education-constants.js';

export class EducationView {
    #viewModel;

    /** @param {import('../viewmodel/education-viewmodel.js').EducationViewModel} viewModel */
    constructor(viewModel) {
        this.#viewModel = viewModel;
    }

    start() {
        bindLoadable(
            byId(EDUCATION_CONTAINER_ID),
            this.#viewModel,
            entries => entries.map(renderEducationEntry),
            StringKey.EDUCATION_ERROR,
        );
    }
}

function renderEducationEntry(entry) {
    const place = [entry.school, entry.location].filter(Boolean).join(SCHOOL_LOCATION_SEPARATOR);
    return createElement(Tag.DIV, {
        className: EducationCssClass.ITEM,
        children: [
            createElement(Tag.SPAN, { className: EducationCssClass.PERIOD, text: entry.period }),
            createElement(Tag.H3, { className: EducationCssClass.TITLE, text: entry.title }),
            createElement(Tag.P, { className: EducationCssClass.SCHOOL, text: place }),
        ],
    });
}
