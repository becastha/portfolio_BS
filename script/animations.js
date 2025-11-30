// ============= ANIMATIONS =============

const Animations = {
    
    // Typing effect for cover
    typeEffect: function() {
        const element = document.getElementById('typing-name');
        if (!element) return;
        
        const text = element.textContent;
        element.textContent = '';
        
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, 150);
    },
    
    // Initialize animations
    init: function() {
        // Start typing effect after a short delay
        setTimeout(() => {
            this.typeEffect();
        }, 500);
        
        console.log('Animations initialized');
    }
};

// Sound effects
const Sound = {
    
    // Play page flip sound
    playFlip: function() {
        const state = window.FlipbookState;
        if (!state || !state.soundEnabled) return;
        
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            console.log('Audio not supported');
        }
    },
    
    // Toggle sound
    toggleSound: function() {
        const state = window.FlipbookState;
        if (!state) return;
        
        state.soundEnabled = !state.soundEnabled;
        const icon = document.querySelector('#btn-sound i');
        if (icon) {
            icon.className = state.soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
        }
    },
    
    // Initialize sound control
    init: function() {
        const btnSound = document.getElementById('btn-sound');
        if (btnSound) {
            btnSound.addEventListener('click', () => this.toggleSound());
        }
        console.log('Sound initialized');
    }
};

// Make them globally available
window.Animations = Animations;
window.Sound = Sound;