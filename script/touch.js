// ============= TOUCH/SWIPE SUPPORT =============

const Touch = {
    touchStartX: 0,
    touchEndX: 0,
    
    // Handle touch start
    handleTouchStart: function(e) {
        this.touchStartX = e.changedTouches[0].screenX;
    },
    
    // Handle touch end
    handleTouchEnd: function(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
    },
    
    // Handle swipe gesture
    handleSwipe: function() {
        const threshold = 50;
        const pageFlip = window.PageFlip;
        if (!pageFlip) return;
        
        // Swipe left - next page
        if (this.touchEndX < this.touchStartX - threshold) {
            pageFlip.flipNext();
        }
        
        // Swipe right - previous page
        if (this.touchEndX > this.touchStartX + threshold) {
            pageFlip.flipPrevious();
        }
    },
    
    // Initialize touch controls
    init: function() {
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        document.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        console.log('Touch controls initialized');
    }
};

// Make it globally available
window.Touch = Touch;