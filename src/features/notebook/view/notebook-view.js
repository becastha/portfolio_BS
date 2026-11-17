// Notebook View: mounts the pages, renders the ViewModel state and forwards button clicks.

import { DomEvent, Tag } from '../../../shared/constants/html.js';
import { localization } from '../../../shared/localization/localization.js';
import { byId, createElement, parseHtml } from '../../../shared/ui/dom.js';
import {
    flipDurationCss,
    NotebookConfig,
    NotebookCssClass,
    NotebookCssVariable,
    NotebookElementId,
    NotebookIcon,
    NotebookSelector,
    zoomTransform,
} from '../notebook-constants.js';

export class NotebookView {
    #viewModel;
    #notebook = byId(NotebookElementId.NOTEBOOK);
    #currentPage = byId(NotebookElementId.CURRENT_PAGE);
    #totalPages = byId(NotebookElementId.TOTAL_PAGES);
    #btnFirst = byId(NotebookElementId.BTN_FIRST);
    #btnPrevious = byId(NotebookElementId.BTN_PREVIOUS);
    #btnNext = byId(NotebookElementId.BTN_NEXT);
    #btnLast = byId(NotebookElementId.BTN_LAST);
    #btnZoomIn = byId(NotebookElementId.BTN_ZOOM_IN);
    #btnZoomOut = byId(NotebookElementId.BTN_ZOOM_OUT);
    #btnFullscreen = byId(NotebookElementId.BTN_FULLSCREEN);
    #pages = [];

    /** @param {import('../viewmodel/notebook-viewmodel.js').NotebookViewModel} viewModel */
    constructor(viewModel) {
        this.#viewModel = viewModel;
    }

    /** Loads and mounts the pages, then binds state and commands. Resolves when the pages are in the DOM. */
    async start() {
        this.#notebook.style.setProperty(
            NotebookCssVariable.FLIP_DURATION,
            flipDurationCss(NotebookConfig.FLIP_DURATION_MS),
        );
        this.#mountPages(await this.#viewModel.loadPageTemplates());
        this.#viewModel.setPageCount(this.#pages.length);
        this.#bindCommands();
        this.#viewModel.state.subscribe(state => this.#render(state));
    }

    #mountPages(templates) {
        templates.forEach(html => {
            const page = parseHtml(html).querySelector(NotebookSelector.PAGE);
            if (page) this.#pages.push(page);
        });

        this.#pages.forEach((page, index) => {
            page.style.zIndex = this.#pages.length - index;
            page.querySelector(NotebookSelector.PAGE_CONTENT)?.append(
                createElement(Tag.DIV, { className: NotebookCssClass.PAGE_NUMBER, text: String(index + 1) }),
            );
            localization.apply(page);
            this.#notebook.append(page);
        });
    }

    #bindCommands() {
        const viewModel = this.#viewModel;
        this.#btnFirst.addEventListener(DomEvent.CLICK, () => viewModel.goToFirst());
        this.#btnPrevious.addEventListener(DomEvent.CLICK, () => viewModel.flipPrevious());
        this.#btnNext.addEventListener(DomEvent.CLICK, () => viewModel.flipNext());
        this.#btnLast.addEventListener(DomEvent.CLICK, () => viewModel.goToLast());
        this.#btnZoomIn.addEventListener(DomEvent.CLICK, () => viewModel.zoomIn());
        this.#btnZoomOut.addEventListener(DomEvent.CLICK, () => viewModel.zoomOut());

        // Fullscreen is browser state, not notebook state: the view owns it.
        this.#btnFullscreen.addEventListener(DomEvent.CLICK, () => this.#toggleFullscreen());
        document.addEventListener(DomEvent.FULLSCREEN_CHANGE, () => this.#renderFullscreenIcon());
    }

    #render(state) {
        this.#pages.forEach((page, index) => {
            page.classList.toggle(NotebookCssClass.FLIPPED, index < state.currentPage);
        });

        this.#currentPage.textContent = state.pageNumber;
        this.#totalPages.textContent = state.totalPages;

        this.#btnFirst.disabled = state.isAtFirstPage;
        this.#btnPrevious.disabled = state.isAtFirstPage;
        this.#btnNext.disabled = state.isAtLastPage;
        this.#btnLast.disabled = state.isAtLastPage;

        this.#notebook.style.transform = zoomTransform(state.zoomLevel);
    }

    #toggleFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen();
        }
    }

    #renderFullscreenIcon() {
        const icon = this.#btnFullscreen.querySelector(NotebookSelector.ICON);
        const isFullscreen = Boolean(document.fullscreenElement);
        icon.classList.toggle(NotebookIcon.FULLSCREEN_EXIT, isFullscreen);
        icon.classList.toggle(NotebookIcon.FULLSCREEN_ENTER, !isFullscreen);
    }
}
