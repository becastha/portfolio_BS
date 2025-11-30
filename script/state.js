// ============= GLOBAL STATE =============

const NotebookState = {
    currentPage: 0,
    totalPages: 0,
    pages: [],
    soundEnabled: false,
    zoomLevel: 1,
    isAnimating: false,
    
    init: function() {
        this.pages = Array.from(document.querySelectorAll('#notebook .page'));
        this.totalPages = this.pages.length;
        
        // Set initial z-index for all pages
        this.pages.forEach((page, index) => {
            page.style.zIndex = this.totalPages - index;
        });
        
        console.log(`Notebook initialized with ${this.totalPages} pages`);
    },
    
    canGoNext: function() {
        return this.currentPage < this.totalPages - 1 && !this.isAnimating;
    },
    
    canGoPrevious: function() {
        return this.currentPage > 0 && !this.isAnimating;
    },
    
    lock: function() {
        this.isAnimating = true;
    },
    
    unlock: function() {
        this.isAnimating = false;
    }
};

window.NotebookState = NotebookState;