// Synthesises the page-flip sound with the Web Audio API.

import { DevMessage, logger } from '../../../shared/logging/logger.js';
import { FlipSound } from '../sound-constants.js';

export class FlipSoundPlayer {
    #context = null;

    play() {
        const context = this.#audioContext();
        if (!context) return;

        const now = context.currentTime;
        const master = context.createGain();
        master.gain.setValueAtTime(FlipSound.MASTER.startGain, now);
        master.gain.exponentialRampToValueAtTime(FlipSound.MASTER.endGain, now + FlipSound.MASTER.duration);
        master.connect(context.destination);

        FlipSound.VOICES.forEach(voice => {
            const oscillator = context.createOscillator();
            const gain = context.createGain();
            oscillator.connect(gain);
            gain.connect(master);

            oscillator.type = voice.type;
            oscillator.frequency.setValueAtTime(voice.startFrequency, now);
            oscillator.frequency.exponentialRampToValueAtTime(voice.endFrequency, now + voice.duration);

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(voice.peakGain, now + voice.attack);
            gain.gain.exponentialRampToValueAtTime(voice.endGain, now + voice.duration);

            oscillator.start(now);
            oscillator.stop(now + voice.duration);
        });
    }

    /** Created on first use, i.e. after a user gesture, so the browser allows it to play. */
    #audioContext() {
        if (!this.#context) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) {
                logger.warn(DevMessage.AUDIO_UNAVAILABLE);
                return null;
            }
            this.#context = new AudioContextClass();
        }
        return this.#context;
    }
}
