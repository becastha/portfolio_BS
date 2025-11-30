// ============= PAGE FLIP MECHANICS =============

const PageFlip = {
    
    // Flip to next page
    flipNext: function() {
        const state = window.NotebookState;
        
        if (!state.canGoNext()) {
            console.log('Cannot go next');
            return;
        }
        
        state.lock();
        
        // Flip the current page
        const currentPage = state.pages[state.currentPage];
        
        if (currentPage) {
            console.log(`Flipping page ${state.currentPage + 1}`);
            currentPage.classList.add('flipped');
        }
        
        state.currentPage += 1;
        
        // Play sound and update UI
        if (window.Sound && window.Sound.playFlip) {
            window.Sound.playFlip();
        }
        
        setTimeout(() => {
            state.unlock();
            if (window.Navigation && window.Navigation.updateDisplay) {
                window.Navigation.updateDisplay();
            }
        }, 600);
    },
    
    // Flip to previous page
    flipPrevious: function() {
        const state = window.NotebookState;
        
        if (!state.canGoPrevious()) {
            console.log('Cannot go previous');
            return;
        }
        
        state.lock();
        state.currentPage -= 1;
        
        // Unflip the current page
        const currentPage = state.pages[state.currentPage];
        
        if (currentPage) {
            console.log(`Unflipping page ${state.currentPage + 1}`);
            currentPage.classList.remove('flipped');
        }
        
        // Play sound and update UI
        if (window.Sound && window.Sound.playFlip) {
            window.Sound.playFlip();
        }
        
        setTimeout(() => {
            state.unlock();
            if (window.Navigation && window.Navigation.updateDisplay) {
                window.Navigation.updateDisplay();
            }
        }, 600);
    },
    
    // Go to first page
    goToFirst: function() {
        const state = window.NotebookState;
        state.lock();
        
        // Reset all pages
        state.pages.forEach(page => page.classList.remove('flipped'));
        
        state.currentPage = 0;
        state.unlock();
        
        if (window.Navigation && window.Navigation.updateDisplay) {
            window.Navigation.updateDisplay();
        }
    },
    
    // Go to last page
    goToLast: function() {
        const state = window.NotebookState;
        state.lock();
        
        // Flip all pages
        state.pages.forEach(page => page.classList.add('flipped'));
        
        state.currentPage = state.totalPages - 1;
        state.unlock();
        
        if (window.Navigation && window.Navigation.updateDisplay) {
            window.Navigation.updateDisplay();
        }
    }
};

// Make it globally available
window.PageFlip = PageFlip;