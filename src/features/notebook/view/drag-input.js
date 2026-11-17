// Mouse drag input for the notebook: hold a page and drag up to fold it over (next page),
// or drag down to fold the previous page back. Releasing past the commit point turns the page;
// otherwise it falls back.

import { DomEvent } from '../../../shared/constants/html.js';
import { byId } from '../../../shared/ui/dom.js';
import {
    DRAG_POINTER_TYPES,
    NotebookConfig,
    NotebookCssClass,
    NotebookCssVariable,
    NotebookElementId,
    NotebookSelector,
    PRIMARY_MOUSE_BUTTON,
} from '../notebook-constants.js';

const clamp01 = value => Math.min(Math.max(value, 0), 1);

/** @param {import('../viewmodel/notebook-viewmodel.js').NotebookViewModel} viewModel */
export function bindDragInput(viewModel) {
    const notebook = byId(NotebookElementId.NOTEBOOK);
    /** @type {{ startY: number, pointerId: number, page: HTMLElement|null, forward: boolean, progress: number }|null} */
    let drag = null;
    let suppressClick = false;

    notebook.addEventListener(DomEvent.POINTER_DOWN, event => {
        if (drag) return; // one drag at a time
        if (!DRAG_POINTER_TYPES.includes(event.pointerType) || event.button !== PRIMARY_MOUSE_BUTTON) return;
        if (event.target.closest(NotebookSelector.INTERACTIVE) || isOnScrollbar(event)) return;
        drag = { startY: event.clientY, pointerId: event.pointerId, page: null, forward: true, progress: 0 };
    });

    notebook.addEventListener(DomEvent.POINTER_MOVE, event => {
        if (!drag || event.pointerId !== drag.pointerId) return;
        const dragged = drag.startY - event.clientY; // positive = upwards

        if (!drag.page) {
            if (Math.abs(dragged) < NotebookConfig.DRAG_START_PX) return;
            if (!beginDrag(dragged > 0)) {
                drag = null;
                return;
            }
        }

        const pageHeight = drag.page.getBoundingClientRect().height;
        const travel = clamp01(Math.abs(dragged) / (pageHeight * NotebookConfig.DRAG_FULL_FOLD_RATIO));
        const sameDirection = dragged > 0 === drag.forward;
        // Forward: the page folds up as the pointer rises. Backward: the turned page unfolds as it falls.
        const folded = sameDirection ? travel : 0;
        drag.progress = drag.forward ? folded : 1 - folded;
        drag.page.style.setProperty(NotebookCssVariable.FOLD, drag.progress);
    });

    const endDrag = event => {
        if (!drag || event.pointerId !== drag.pointerId) return;
        const { page, forward, progress } = drag;
        drag = null;
        if (!page) return;

        notebook.classList.remove(NotebookCssClass.NOTEBOOK_DRAGGING);
        page.classList.remove(NotebookCssClass.PAGE_DRAGGING);
        page.style.removeProperty(NotebookCssVariable.FOLD);
        suppressClick = true;
        setTimeout(() => (suppressClick = false));

        // Removing the inline fold lets the page animate from where it was dropped
        // to its new state (turned) or back to its old one.
        const cancelled = event.type === DomEvent.POINTER_CANCEL;
        if (forward && !cancelled && progress >= NotebookConfig.DRAG_COMMIT_PROGRESS) {
            viewModel.flipNext();
        } else if (!forward && !cancelled && progress <= 1 - NotebookConfig.DRAG_COMMIT_PROGRESS) {
            viewModel.flipPrevious();
        }
    };
    notebook.addEventListener(DomEvent.POINTER_UP, endDrag);
    notebook.addEventListener(DomEvent.POINTER_CANCEL, endDrag);

    // A drag that ends over a link must not also click it.
    notebook.addEventListener(
        DomEvent.CLICK,
        event => {
            if (!suppressClick) return;
            event.preventDefault();
            event.stopPropagation();
        },
        true,
    );

    /** Picks the page to fold for the drag direction. Returns false when no page can turn that way. */
    function beginDrag(forward) {
        const { currentPage, canFlipNext, canFlipPrevious } = viewModel.state.value;
        if (forward ? !canFlipNext : !canFlipPrevious) return false;

        const pages = notebook.querySelectorAll(NotebookSelector.PAGE);
        drag.forward = forward;
        drag.page = pages[forward ? currentPage : currentPage - 1];
        drag.page.classList.add(NotebookCssClass.PAGE_DRAGGING);
        notebook.classList.add(NotebookCssClass.NOTEBOOK_DRAGGING);
        notebook.setPointerCapture(drag.pointerId);
        window.getSelection()?.removeAllRanges();
        return true;
    }
}

/** True when the press landed on the scrollbar of a page's scrolling content. */
function isOnScrollbar(event) {
    const content = event.target.closest(NotebookSelector.PAGE_CONTENT);
    if (!content) return false;
    return event.clientX > content.getBoundingClientRect().left + content.clientWidth;
}
