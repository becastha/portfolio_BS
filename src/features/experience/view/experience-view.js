// Experience View: renders one card per workplace.

import { Tag } from '../../../shared/constants/html.js';
import { localization } from '../../../shared/localization/localization.js';
import { StringKey } from '../../../shared/localization/string-keys.js';
import { byId, createElement, createLabelledLine } from '../../../shared/ui/dom.js';
import { bindLoadable } from '../../../shared/ui/loadable-view.js';
import { EXPERIENCE_CONTAINER_ID, ExperienceCssClass } from '../experience-constants.js';

export class ExperienceView {
    #viewModel;

    /** @param {import('../viewmodel/experience-viewmodel.js').ExperienceViewModel} viewModel */
    constructor(viewModel) {
        this.#viewModel = viewModel;
    }

    start() {
        bindLoadable(
            byId(EXPERIENCE_CONTAINER_ID),
            this.#viewModel,
            experiences => experiences.map(renderExperienceCard),
            StringKey.EXPERIENCE_ERROR,
        );
    }
}

function renderExperienceCard(experience) {
    return createElement(Tag.DIV, {
        className: ExperienceCssClass.CARD,
        children: [
            createElement(Tag.SPAN, { className: ExperienceCssClass.YEAR, text: experience.year }),
            createElement(Tag.H3, { text: experience.officeName }),
            createLabelledLine(localization.t(StringKey.EXPERIENCE_ROLE), experience.role),
            createLabelledLine(localization.t(StringKey.EXPERIENCE_ENVIRONMENT), experience.environment),
            createLabelledLine(localization.t(StringKey.EXPERIENCE_TEAM), experience.teamSize),
        ],
    });
}
