// Projects View: renders one card per project.

import { Tag } from '../../../shared/constants/html.js';
import { localization } from '../../../shared/localization/localization.js';
import { StringKey } from '../../../shared/localization/string-keys.js';
import { byId, createElement, createLabelledLine } from '../../../shared/ui/dom.js';
import { bindLoadable } from '../../../shared/ui/loadable-view.js';
import { PROJECTS_CONTAINER_ID, ProjectsCssClass } from '../projects-constants.js';

export class ProjectsView {
    #viewModel;

    /** @param {import('../viewmodel/projects-viewmodel.js').ProjectsViewModel} viewModel */
    constructor(viewModel) {
        this.#viewModel = viewModel;
    }

    start() {
        bindLoadable(
            byId(PROJECTS_CONTAINER_ID),
            this.#viewModel,
            projects => projects.map(renderProjectCard),
            StringKey.PROJECTS_ERROR,
        );
    }
}

function renderProjectCard(project) {
    return createElement(Tag.DIV, {
        className: ProjectsCssClass.CARD,
        children: [
            createElement(Tag.SPAN, { className: ProjectsCssClass.YEAR, text: project.year }),
            createElement(Tag.H3, { text: project.title }),
            createLabelledLine(localization.t(StringKey.PROJECTS_ROLE), project.role),
            createLabelledLine(localization.t(StringKey.PROJECTS_TECH), project.technologies),
            createLabelledLine(localization.t(StringKey.PROJECTS_TEAM), project.teamSize),
            createElement(Tag.P, { text: project.description }),
        ],
    });
}
