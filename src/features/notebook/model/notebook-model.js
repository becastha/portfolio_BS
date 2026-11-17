// Notebook state and its rules. No DOM, no timers.

import { NotebookConfig } from '../notebook-constants.js';

export class NotebookModel {
    currentPage = 0;
    totalPages = 0;
    zoomLevel = NotebookConfig.ZOOM_INITIAL;
    isAnimating = false;

    get lastPage() {
        return Math.max(this.totalPages - 1, 0);
    }

    canGoNext() {
        return this.currentPage < this.totalPages - 1 && !this.isAnimating;
    }

    canGoPrevious() {
        return this.currentPage > 0 && !this.isAnimating;
    }

    canZoomIn() {
        return this.zoomLevel < NotebookConfig.ZOOM_MAX;
    }

    canZoomOut() {
        return this.zoomLevel > NotebookConfig.ZOOM_MIN;
    }
}
