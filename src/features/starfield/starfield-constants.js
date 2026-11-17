// Constants of the starfield feature (the animated Three.js background).

export const STARFIELD_CONTAINER_ID = 'particles-bg';

export const CANVAS_CONTEXT_2D = '2d';
export const POSITION_ATTRIBUTE = 'position';

export const Camera = Object.freeze({ FOV: 75, NEAR: 0.1, FAR: 1000, Z: 50 });

export const CLEAR_COLOR = 0x000000;

/** Soft round dot used for stars and sparkles (so points are not drawn as squares). */
export const DotTexture = Object.freeze({
    SIZE: 32,
    GRADIENT_STOPS: Object.freeze([
        Object.freeze([0, 'rgba(255,255,255,1)']),
        Object.freeze([0.2, 'rgba(255,255,255,1)']),
        Object.freeze([0.4, 'rgba(255,255,255,0.5)']),
        Object.freeze([1, 'rgba(255,255,255,0)']),
    ]),
});

export const StarField = Object.freeze({
    COUNT: 400,
    SPREAD_XY: 200,
    SPREAD_Z: 100,
    COLOR: 0xffffff,
    SIZE: 0.8,
    OPACITY: 0.8,
    DRIFT_SPEED: 0.3,
    DRIFT_PHASE: 0.05,
    DRIFT_AMOUNT: 0.02,
    ROTATION_STEP: 0.00005,
});

/** One entry per shooting star: colour, start position and speed (scene units per frame). */
export const SHOOTING_STARS = Object.freeze([
    Object.freeze({ color: 0xffffff, startX: -60, startY: 50, speed: 0.08 }),
    Object.freeze({ color: 0xaaddff, startX: -80, startY: 30, speed: 0.06 }),
    Object.freeze({ color: 0xffffaa, startX: -50, startY: 10, speed: 0.1 }),
    Object.freeze({ color: 0xffddaa, startX: -90, startY: -10, speed: 0.05 }),
    Object.freeze({ color: 0xccffff, startX: -70, startY: -30, speed: 0.07 }),
]);

export const ShootingStar = Object.freeze({
    HEAD_RADIUS: 0.4,
    GLOW_RADIUS: 0.8,
    SPHERE_SEGMENTS: 16,
    GLOW_OPACITY: 0.4,
    TRAIL_POINTS: 50,
    TRAIL_SPACING: 0.8,
    TRAIL_SLOPE: 0.1,
    TRAIL_OPACITY: 0.7,
    TRAIL_LINE_WIDTH: 2,
    TRAIL_FADE: 0.3,
    SPARKLE_COUNT: 30,
    SPARKLE_SIZE: 1.5,
    SPARKLE_OPACITY: 0.8,
    SPARKLE_LENGTH: 20,
    SPARKLE_SPREAD: 3,
    SPARKLE_SPACING: 0.7,
    FALL_RATIO: 0.4,
    DEPTH_RANGE: 20,
    LIFESPAN_MIN: 40,
    LIFESPAN_RANGE: 25,
    EXIT_X: 100,
    EXIT_Y: -100,
    RESPAWN_X: -80,
    RESPAWN_X_RANGE: 40,
    RESPAWN_Y: 60,
    RESPAWN_Y_RANGE: 40,
});

export const FRAME_SECONDS = 0.016;
