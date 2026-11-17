// Experience View: renders one card per workplace.

import { Attr, LinkRel, LinkTarget, Tag } from '../../../shared/constants/html.js';
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
            ...(experience.location
                ? [createElement(Tag.SPAN, { className: ExperienceCssClass.LOCATION, text: experience.location })]
                : []),
            createElement(Tag.H3, { children: [renderOfficeName(experience)] }),
            createLabelledLine(localization.t(StringKey.EXPERIENCE_ROLE), experience.role),
            ...(experience.environment
                ? [createLabelledLine(localization.t(StringKey.EXPERIENCE_ENVIRONMENT), experience.environment)]
                : []),
            ...(experience.teamSize
                ? [createLabelledLine(localization.t(StringKey.EXPERIENCE_TEAM), experience.teamSize)]
                : []),
            ...(experience.responsibilities.length > 0
                ? [
                      createElement(Tag.UL, {
                          className: ExperienceCssClass.RESPONSIBILITIES,
                          children: experience.responsibilities.map(text => createElement(Tag.LI, { text })),
                      }),
                  ]
                : []),
        ],
    });
}

/** The company name, linked to its website when the data has one. */
function renderOfficeName(experience) {
    if (!experience.url) return experience.officeName;
    return createElement(Tag.ANCHOR, {
        text: experience.officeName,
        attributes: {
            [Attr.HREF]: experience.url,
            [Attr.TARGET]: LinkTarget.NEW_TAB,
            [Attr.REL]: LinkRel.EXTERNAL,
        },
    });
}
