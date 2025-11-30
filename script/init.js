// ============= INITIALIZATION =============

async function loadPages() {
    const notebook = document.getElementById('notebook');
    if (!notebook) {
        console.error('Notebook element not found!');
        return;
    }
    
    console.log('Loading pages...');
    
    const pageCount = 5;
    
    for (let i = 1; i <= pageCount; i++) {
        try {
            const url = `./pages/page${i}.html`;
            console.log(`Fetching: ${url}`);
            const resp = await fetch(url);
            
            if (!resp.ok) {
                console.error(`HTTP error! status: ${resp.status} for ${url}`);
                continue;
            }
            
            const html = await resp.text();
            const temp = document.createElement('div');
            temp.innerHTML = html;
            const pageEl = temp.querySelector('.page');
            
            if (pageEl) {
                notebook.appendChild(pageEl);
                console.log(`Loaded page${i}.html`);
            }
        } catch (e) {
            console.error(`Failed to load page${i}.html:`, e);
        }
    }
    
    console.log(`Total pages loaded: ${notebook.querySelectorAll('.page').length}`);
}

async function initializeNotebook() {
    console.log('Initializing notebook portfolio...');
    
    // Load pages first
    await loadPages();
    
    // Initialize state
    if (window.NotebookState) {
        window.NotebookState.init();
    }
    
    // Initialize navigation
    if (window.Navigation) {
        window.Navigation.init();
    }
    
    // Initialize controls
    if (window.Controls) {
        window.Controls.init();
    }
    
    // Initialize settings
    if (window.Settings) {
        window.Settings.init();
    }
    
    // Initialize theme
    if (window.Theme) {
        window.Theme.init();
    }
    
    // Load data
    if (typeof initData === 'function') {
        initData();
    }
    
    // Initialize keyboard
    if (window.Keyboard) {
        window.Keyboard.init();
    }
    
    // Initialize touch
    if (window.Touch) {
        window.Touch.init();
    }
    
    // Initialize sound
    if (window.Sound) {
        window.Sound.init();
    }
    
    // Initialize particles
    if (window.Particles) {
        window.Particles.init();
    }
    
    console.log('Notebook portfolio initialized successfully!');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNotebook);
} else {
    initializeNotebook();
}