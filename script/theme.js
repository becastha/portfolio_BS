// ============= THEME SWITCHER =============

const Theme = {
    
    // Apply theme
    applyTheme: function(theme) {
        console.log('Applying theme:', theme);
        
        // Remove all theme classes
        document.body.classList.remove('dark-theme', 'sepia-theme');
        
        // Apply new theme if not default
        if (theme !== 'default') {
            document.body.classList.add(`${theme}-theme`);
        }
        
        // Save to localStorage
        localStorage.setItem('theme', theme);
        
        // Update button states
        const themeButtons = document.querySelectorAll('.theme-btn');
        themeButtons.forEach(btn => {
            if (btn.dataset.theme === theme) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    },
    
    // Load saved theme
    loadSavedTheme: function() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.applyTheme(savedTheme);
        }
    },
    
    // Initialize theme switcher
    init: function() {
        const themeButtons = document.querySelectorAll('.theme-btn');
        
        themeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.dataset.theme;
                this.applyTheme(theme);
            });
        });
        
        // Load saved theme
        this.loadSavedTheme();
        
        console.log('Theme switcher initialized');
    }
};

// Make it globally available
window.Theme = Theme;