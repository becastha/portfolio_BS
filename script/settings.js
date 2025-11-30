// ============= SETTINGS PANEL =============

const Settings = {
    
    // Toggle settings panel
    togglePanel: function() {
        const panel = document.getElementById('settings-panel');
        if (panel) {
            panel.classList.toggle('active');
        }
    },
    
    // Close settings panel
    closePanel: function() {
        const panel = document.getElementById('settings-panel');
        if (panel) {
            panel.classList.remove('active');
        }
    },
    
    // Initialize settings panel
    init: function() {
        const settingsToggle = document.getElementById('settings-toggle');
        const settingsPanel = document.getElementById('settings-panel');
        const closeSettings = document.getElementById('close-settings');
        
        if (settingsToggle) {
            settingsToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.togglePanel();
            });
        }
        
        if (closeSettings) {
            closeSettings.addEventListener('click', () => {
                this.closePanel();
            });
        }
        
        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (settingsPanel && 
                !settingsPanel.contains(e.target) && 
                e.target !== settingsToggle) {
                this.closePanel();
            }
        });
        
        // Font buttons
        const fontButtons = document.querySelectorAll('.font-btn');
        fontButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const font = btn.dataset.font;
                
                document.body.classList.remove('serif-font', 'sans-font', 'mono-font');
                document.body.classList.add(`${font}-font`);
                
                fontButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                localStorage.setItem('font', font);
            });
        });
        
        // Load saved font
        const savedFont = localStorage.getItem('font');
        if (savedFont) {
            document.body.classList.remove('serif-font');
            document.body.classList.add(`${savedFont}-font`);
            fontButtons.forEach(b => b.classList.remove('active'));
            const savedBtn = document.querySelector(`[data-font="${savedFont}"]`);
            if (savedBtn) savedBtn.classList.add('active');
        }
        
        console.log('Settings initialized');
    }
};

// Make it globally available
window.Settings = Settings;