// Swipe input for the notebook: swipe left for the next page, right for the previous one.

import { DomEvent } from '../../../shared/constants/html.js';
import { NotebookConfig } from '../notebook-constants.js';

/** @param {import('../viewmodel/notebook-viewmodel.js').NotebookViewModel} viewModel */
export function bindTouchInput(viewModel) {
    let startX = 0;

    document.addEventListener(DomEvent.TOUCH_START, event => {
        startX = event.changedTouches[0].screenX;
    });

    document.addEventListener(DomEvent.TOUCH_END, event => {
        const endX = event.changedTouches[0].screenX;
        if (endX < startX - NotebookConfig.SWIPE_THRESHOLD_PX) viewModel.flipNext();
        if (endX > startX + NotebookConfig.SWIPE_THRESHOLD_PX) viewModel.flipPrevious();
    });
}
