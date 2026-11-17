// Overview View: renders the quote and the overview sections.

import { Tag } from '../../../shared/constants/html.js';
import { StringKey } from '../../../shared/localization/string-keys.js';
import { byId, createElement } from '../../../shared/ui/dom.js';
import { createIcon, IconStyle } from '../../../shared/ui/icons.js';
import { bindLoadable } from '../../../shared/ui/loadable-view.js';
import { OVERVIEW_CONTAINER_ID, OverviewCssClass } from '../overview-constants.js';

export class OverviewView {
    #viewModel;

    /** @param {import('../viewmodel/overview-viewmodel.js').OverviewViewModel} viewModel */
    constructor(viewModel) {
        this.#viewModel = viewModel;
    }

    start() {
        bindLoadable(byId(OVERVIEW_CONTAINER_ID), this.#viewModel, renderOverview, StringKey.OVERVIEW_ERROR);
    }
}

function renderOverview(overview) {
    return [renderQuote(overview.quote), ...overview.sections.map(renderSection)];
}

function renderQuote(quote) {
    // One line per entry, separated by line breaks.
    const lines = quote.lines.flatMap((line, index) => (index === 0 ? [line] : [createElement(Tag.BR), line]));
    return createElement(Tag.DIV, {
        className: OverviewCssClass.QUOTE,
        children: [
            createElement(Tag.P, { className: OverviewCssClass.QUOTE_TEXT, children: lines }),
            createElement(Tag.P, { className: OverviewCssClass.QUOTE_AUTHOR, text: quote.author }),
        ],
    });
}

function renderSection(section) {
    return createElement(Tag.DIV, {
        className: OverviewCssClass.SECTION,
        children: [
            createElement(Tag.H3, { children: [createIcon(IconStyle.SOLID, section.icon), ` ${section.title}`] }),
            createElement(Tag.P, { text: section.text }),
        ],
    });
}
