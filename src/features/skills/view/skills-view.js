// Skills View: renders one row per skill with its level indicator.

import { Tag } from '../../../shared/constants/html.js';
import { StringKey } from '../../../shared/localization/string-keys.js';
import { byId, createElement } from '../../../shared/ui/dom.js';
import { bindLoadable } from '../../../shared/ui/loadable-view.js';
import { SKILLS_CONTAINER_ID, SkillsCssClass } from '../skills-constants.js';

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
            createElement(Tag.SPAN, { className: `${SkillsCssClass.LEVEL} ${skill.level}` }),
        ],
    });
}
