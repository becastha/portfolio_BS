// ============= SOUND EFFECTS =============

const Sound = {
    enabled: false,
    audioContext: null,
    
    init: function() {
        try {
            // Initialize Web Audio API
            const audioContextClass = window.AudioContext || window.webkitAudioContext;
            if (audioContextClass) {
                this.audioContext = new audioContextClass();
            }
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    },
    
    // Play page flip sound with smooth animation
    playFlip: function() {
        if (!this.enabled || !this.audioContext) {
            return;
        }
        
        try {
            const ctx = this.audioContext;
            const now = ctx.currentTime;
            
            // Create two oscillators for a richer flip sound
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            const gain2 = ctx.createGain();
            const masterGain = ctx.createGain();
            
            // Connect oscillators
            osc1.connect(gain1);
            osc2.connect(gain2);
            gain1.connect(masterGain);
            gain2.connect(masterGain);
            masterGain.connect(ctx.destination);
            
            // First oscillator - main flip sound
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(600, now);
            osc1.frequency.exponentialRampToValueAtTime(200, now + 0.15);
            
            // Second oscillator - echo/harmony
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(900, now);
            osc2.frequency.exponentialRampToValueAtTime(400, now + 0.12);
            
            // Envelope - smooth fade in and out
            gain1.gain.setValueAtTime(0, now);
            gain1.gain.linearRampToValueAtTime(0.25, now + 0.02);
            gain1.gain.exponentialRampToValueAtTime(0.05, now + 0.15);
            
            gain2.gain.setValueAtTime(0, now);
            gain2.gain.linearRampToValueAtTime(0.15, now + 0.01);
            gain2.gain.exponentialRampToValueAtTime(0.02, now + 0.12);
            
            masterGain.gain.setValueAtTime(0.4, now);
            masterGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            
            osc1.start(now);
            osc2.start(now);
            osc1.stop(now + 0.15);
            osc2.stop(now + 0.12);
        } catch (e) {
            console.log('Sound playback failed:', e);
        }
    },
    
    // Toggle sound on/off
    toggle: function() {
        this.enabled = !this.enabled;
        if (window.NotebookState) {
            window.NotebookState.soundEnabled = this.enabled;
        }
        console.log('Sound ' + (this.enabled ? 'enabled' : 'disabled'));
    },
    
    // Set sound enabled state
    setEnabled: function(enabled) {
        this.enabled = enabled;
        if (window.NotebookState) {
            window.NotebookState.soundEnabled = enabled;
        }
    }
};

// Make it globally available
window.Sound = Sound;
