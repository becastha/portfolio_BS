// Builders for the particles the cursor effects share (a flame, a grain of dust or ash).

import { Dust, Fire, ParticleKind } from '../cursor-effects-constants.js';

export const between = (min, range) => min + Math.random() * range;
export const pick = list => list[Math.floor(Math.random() * list.length)];

export function createFlame(x, y) {
    return {
        kind: ParticleKind.FLAME,
        x,
        y,
        vx: between(-Fire.SWAY, Fire.SWAY * 2),
        vy: -between(Fire.RISE_MIN, Fire.RISE_RANGE),
        radius: between(Fire.RADIUS_MIN, Fire.RADIUS_RANGE),
        life: between(Fire.LIFE_MIN_MS, Fire.LIFE_RANGE_MS),
    };
}

export function createGrain(x, y, colour) {
    return {
        kind: ParticleKind.DUST,
        x,
        y,
        vx: between(-Dust.SCATTER, Dust.SCATTER * 2),
        vy: between(-Dust.SCATTER, Dust.SCATTER * 2),
        size: between(Dust.SIZE_MIN, Dust.SIZE_RANGE),
        colour,
        life: between(Dust.LIFE_MIN_MS, Dust.LIFE_RANGE_MS),
    };
}
