// Skills View: renders one row per programming language, with its frameworks and years of experience.

import { Tag } from '../../../shared/constants/html.js';
import { localization } from '../../../shared/localization/localization.js';
import { StringKey } from '../../../shared/localization/string-keys.js';
import { byId, createElement } from '../../../shared/ui/dom.js';
import { bindLoadable } from '../../../shared/ui/loadable-view.js';
import { SKILLS_CONTAINER_ID, SkillsCssClass, YEARS_PLACEHOLDER } from '../skills-constants.js';

export class SkillsView {
    #viewModel;

    /** @param {import('../viewmodel/skills-viewmodel.js').SkillsViewModel} viewModel */
    constructor(viewModel) {
        this.#viewModel = viewModel;
    }

    start() {
        bindLoadable(
            byId(SKILLS_CONTAINER_ID),
            this.#viewModel,
            skills => skills.map(renderSkillItem),
            StringKey.SKILLS_ERROR,
        );
    }
}

function renderSkillItem(skill) {
    return createElement(Tag.DIV, {
        className: SkillsCssClass.ITEM,
        children: [
            createElement(Tag.SPAN, { className: SkillsCssClass.NAME, text: skill.name }),
            createElement(Tag.SPAN, { className: SkillsCssClass.FRAMEWORKS, text: skill.frameworks }),
            createElement(Tag.SPAN, { className: SkillsCssClass.YEARS, text: yearsText(skill.years) }),
        ],
    });
}

function yearsText(years) {
    if (years === null) return '';
    const key = years === 1 ? StringKey.SKILLS_YEARS_ONE : StringKey.SKILLS_YEARS_OTHER;
    return localization.t(key, { [YEARS_PLACEHOLDER]: years });
}
