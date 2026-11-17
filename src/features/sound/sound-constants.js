// Constants of the sound feature (page-flip sound and its toggle button).

export const SOUND_BUTTON_ID = 'btn-sound';

export const SoundCssClass = Object.freeze({ MUTED: 'muted' });

export const SoundSelector = Object.freeze({ ICON: 'i' });

export const SoundIcon = Object.freeze({
    ON: 'fa-volume-up',
    OFF: 'fa-volume-mute',
});

const OSCILLATOR_TYPE = 'sine';

/** The flip sound: two sine sweeps (main tone and a harmony) under a fading master gain. */
export const FlipSound = Object.freeze({
    MASTER: Object.freeze({ startGain: 0.4, endGain: 0.01, duration: 0.15 }),
    VOICES: Object.freeze([
        Object.freeze({
            type: OSCILLATOR_TYPE,
            startFrequency: 600,
            endFrequency: 200,
            attack: 0.02,
            peakGain: 0.25,
            endGain: 0.05,
            duration: 0.15,
        }),
        Object.freeze({
            type: OSCILLATOR_TYPE,
            startFrequency: 900,
            endFrequency: 400,
            attack: 0.01,
            peakGain: 0.15,
            endGain: 0.02,
            duration: 0.12,
        }),
    ]),
});
