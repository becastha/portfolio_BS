// Binds a LoadableViewModel to a container: renders the data when ready,
// or a localized message when loading failed.

import { SharedCssClass } from '../constants/css.js';
import { Tag } from '../constants/html.js';
import { localization } from '../localization/localization.js';
import { LoadStatus } from '../mvvm/loadable-viewmodel.js';
import { createElement, setChildren } from './dom.js';

/**
 * @param {HTMLElement|null} container
 * @param {import('../mvvm/loadable-viewmodel.js').LoadableViewModel} viewModel
 * @param {(data: any) => Node[]} renderData
 * @param {string} errorKey localization key of the failure message
 */
export function bindLoadable(container, viewModel, renderData, errorKey) {
    if (!container) return;
    viewModel.state.subscribe(({ status, data }) => {
        if (status === LoadStatus.READY) {
            setChildren(container, renderData(data));
        } else if (status === LoadStatus.FAILED) {
            setChildren(container, [
                createElement(Tag.P, { className: SharedCssClass.LOAD_ERROR, text: localization.t(errorKey) }),
            ]);
        }
    });
}
