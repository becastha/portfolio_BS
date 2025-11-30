// ============= CONTROLS (Zoom, Fullscreen, Sound) =============

const Controls = {
    
    // Zoom in
    zoomIn: function() {
        const state = window.NotebookState;
        if (state.zoomLevel < 1.5) {
            state.zoomLevel += 0.1;
            this.applyZoom();
        }
    },
    
    // Zoom out
    zoomOut: function() {
        const state = window.NotebookState;
        if (state.zoomLevel > 0.8) {
            state.zoomLevel -= 0.1;
            this.applyZoom();
        }
    },
    
    // Apply zoom
    applyZoom: function() {
        const state = window.NotebookState;
        const notebook = document.getElementById('notebook');
        if (notebook) {
            notebook.style.transform = `scale(${state.zoomLevel})`;
        }
    },
    
    // Toggle fullscreen
    toggleFullscreen: function() {
        const btnFullscreen = document.getElementById('btn-fullscreen');
        
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            if (btnFullscreen) {
                btnFullscreen.innerHTML = '<i class="fas fa-compress"></i>';
            }
        } else {
            document.exitFullscreen();
            if (btnFullscreen) {
                btnFullscreen.innerHTML = '<i class="fas fa-expand"></i>';
            }
        }
    },
    
    // Toggle sound
    toggleSound: function() {
        const btnSound = document.getElementById('btn-sound');
        
        if (window.Sound) {
            window.Sound.toggle();
            
            // Update button appearance
            if (window.Sound.enabled) {
                btnSound.classList.remove('muted');
                btnSound.innerHTML = '<i class="fas fa-volume-up"></i>';
            } else {
                btnSound.classList.add('muted');
                btnSound.innerHTML = '<i class="fas fa-volume-mute"></i>';
            }
        }
    },
    
    // Initialize controls
    init: function() {
        const btnZoomIn = document.getElementById('btn-zoom-in');
        const btnZoomOut = document.getElementById('btn-zoom-out');
        const btnFullscreen = document.getElementById('btn-fullscreen');
        const btnSound = document.getElementById('btn-sound');
        
        if (btnZoomIn) {
            btnZoomIn.addEventListener('click', () => this.zoomIn());
        }
        
        if (btnZoomOut) {
            btnZoomOut.addEventListener('click', () => this.zoomOut());
        }
        
        if (btnFullscreen) {
            btnFullscreen.addEventListener('click', () => this.toggleFullscreen());
        }
        
        if (btnSound) {
            btnSound.addEventListener('click', () => this.toggleSound());
            // Initialize button to show muted state (sound disabled by default)
            if (window.Sound && !window.Sound.enabled) {
                btnSound.classList.add('muted');
                btnSound.innerHTML = '<i class="fas fa-volume-mute"></i>';
            }
        }
        
        console.log('Controls initialized');
    }
};

// Make it globally available
window.Controls = Controls;