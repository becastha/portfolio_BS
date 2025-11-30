// ============= KEYBOARD NAVIGATION =============

const Keyboard = {
    
    // Handle keyboard events
    handleKeyPress: function(e) {
        const pageFlip = window.PageFlip;
        if (!pageFlip) return;
        
        switch(e.key) {
            case 'ArrowRight':
            case ' ':
                e.preventDefault();
                pageFlip.flipNext();
                break;
                
            case 'ArrowLeft':
                e.preventDefault();
                pageFlip.flipPrevious();
                break;
                
            case 'Home':
                e.preventDefault();
                pageFlip.goToFirst();
                break;
                
            case 'End':
                e.preventDefault();
                pageFlip.goToLast();
                break;
        }
    },
    
    // Initialize keyboard controls
    init: function() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        console.log('Keyboard navigation initialized');
    }
};

// Make it globally available
window.Keyboard = Keyboard;