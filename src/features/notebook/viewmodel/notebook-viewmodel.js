// Notebook ViewModel: exposes the notebook state to the view and the commands the view can call.

import { Observable } from '../../../shared/mvvm/observable.js';
import { NotebookConfig } from '../notebook-constants.js';

export class NotebookViewModel {
    #model;
    #loadPageTemplates;
    #displayedPage = 0;
    #flipListeners = new Set();

    /**
     * @param {import('../model/notebook-model.js').NotebookModel} model
     * @param {() => Promise<string[]>} loadPageTemplates
     */
    constructor(model, loadPageTemplates) {
        this.#model = model;
        this.#loadPageTemplates = loadPageTemplates;
        this.state = new Observable(this.#snapshot());
    }

    loadPageTemplates() {
        return this.#loadPageTemplates();
    }

    /** Called by the view once it knows how many pages it mounted. */
    setPageCount(count) {
        this.#model.totalPages = count;
        this.#publish();
    }

    /** Registers a listener called whenever a single page is flipped (used to play the flip sound). */
    onPageFlipped(listener) {
        this.#flipListeners.add(listener);
    }

    flipNext() {
        if (!this.#model.canGoNext()) return;
        this.#flipTo(this.#model.currentPage + 1);
    }

    flipPrevious() {
        if (!this.#model.canGoPrevious()) return;
        this.#flipTo(this.#model.currentPage - 1);
    }

    goToFirst() {
        this.#jumpTo(0);
    }

    goToLast() {
        this.#jumpTo(this.#model.lastPage);
    }

    zoomIn() {
        if (!this.#model.canZoomIn()) return;
        this.#model.zoomLevel += NotebookConfig.ZOOM_STEP;
        this.#publish();
    }

    zoomOut() {
        if (!this.#model.canZoomOut()) return;
        this.#model.zoomLevel -= NotebookConfig.ZOOM_STEP;
        this.#publish();
    }

    /** Animated single-page flip: the page turns now, the page counter follows when the animation ends. */
    #flipTo(page) {
        this.#model.isAnimating = true;
        this.#model.currentPage = page;
        this.#publish();
        this.#flipListeners.forEach(listener => listener());

        setTimeout(() => {
            this.#model.isAnimating = false;
            this.#displayedPage = this.#model.currentPage;
            this.#publish();
        }, NotebookConfig.FLIP_DURATION_MS);
    }

    #jumpTo(page) {
        this.#model.isAnimating = false;
        this.#model.currentPage = page;
        this.#displayedPage = page;
        this.#publish();
    }

    #publish() {
        this.state.set(this.#snapshot());
    }

    #snapshot() {
        const { currentPage, totalPages, zoomLevel, lastPage } = this.#model;
        return Object.freeze({
            /** Pages before this index are flipped. */
            currentPage,
            /** 1-based number shown in the page counter. */
            pageNumber: this.#displayedPage + 1,
            totalPages,
            zoomLevel,
            isAtFirstPage: this.#displayedPage === 0,
            isAtLastPage: this.#displayedPage === lastPage,
            canFlipNext: this.#model.canGoNext(),
            canFlipPrevious: this.#model.canGoPrevious(),
        });
    }
}
