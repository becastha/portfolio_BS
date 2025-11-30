// ============= NAVIGATION =============

const Navigation = {
    
    // Update page display
    updateDisplay: function() {
        const state = window.NotebookState;
        const currentPageEl = document.getElementById('current-page');
        const totalPagesEl = document.getElementById('total-pages');
        
        if (currentPageEl) {
            currentPageEl.textContent = state.currentPage + 1;
        }
        
        if (totalPagesEl) {
            totalPagesEl.textContent = state.totalPages;
        }
        
        this.updateButtons();
    },
    
    // Update button states
    updateButtons: function() {
        const state = window.NotebookState;
        
        const btnFirst = document.getElementById('btn-first');
        const btnPrev = document.getElementById('btn-prev');
        const btnNext = document.getElementById('btn-next');
        const btnLast = document.getElementById('btn-last');
        
        if (btnFirst) btnFirst.disabled = state.currentPage === 0;
        if (btnPrev) btnPrev.disabled = state.currentPage === 0;
        if (btnNext) btnNext.disabled = state.currentPage === state.totalPages - 1;
        if (btnLast) btnLast.disabled = state.currentPage === state.totalPages - 1;
    },
    
    // Initialize navigation controls
    init: function() {
        const btnFirst = document.getElementById('btn-first');
        const btnPrev = document.getElementById('btn-prev');
        const btnNext = document.getElementById('btn-next');
        const btnLast = document.getElementById('btn-last');
        
        if (btnFirst) {
            btnFirst.addEventListener('click', () => {
                if (window.PageFlip) window.PageFlip.goToFirst();
            });
        }
        
        if (btnPrev) {
            btnPrev.addEventListener('click', () => {
                if (window.PageFlip) window.PageFlip.flipPrevious();
            });
        }
        
        if (btnNext) {
            btnNext.addEventListener('click', () => {
                if (window.PageFlip) window.PageFlip.flipNext();
            });
        }
        
        if (btnLast) {
            btnLast.addEventListener('click', () => {
                if (window.PageFlip) window.PageFlip.goToLast();
            });
        }
        
        this.updateDisplay();
        console.log('Navigation initialized');
    }
};

// Make it globally available
window.Navigation = Navigation;