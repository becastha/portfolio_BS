// Cursor effects View: paints playful effects around the mouse pointer on one canvas over the page.
//   1. moving      -> water ripples
//   2. resting     -> the cursor crumbles to dust (and comes back when it moves)
//   3. moving fast -> fire
//   4. left click  -> a puff of gas
//   5. right click -> a cloud calling for help
//   6. near writing -> the words burn to ash and come back (text-burner.js)
// Purely decorative, so it has no Model or ViewModel. The loop runs only while something is on screen.

import { Attr, AttrValue } from '../../../shared/constants/html.js';
import { localization } from '../../../shared/localization/localization.js';
import { StringKey } from '../../../shared/localization/string-keys.js';
import {
    CANVAS_CONTEXT,
    CANVAS_TAG,
    CursorCssClass,
    Dust,
    Fire,
    Gas,
    HelpCloud,
    MOUSE_POINTER,
    NATIVE_MENU_SELECTOR,
    NORMAL_BLEND,
    PARTICLE_LIMIT,
    ParticleKind,
    PointerEvent,
    PRIMARY_BUTTON,
    REDUCED_MOTION_QUERY,
    rgba,
    Ripple,
} from '../cursor-effects-constants.js';
import { between, createFlame, createGrain, pick } from './particles.js';
import { TextBurner } from './text-burner.js';


export class CursorEffectsView {
    #canvas = document.createElement(CANVAS_TAG);
    #context = this.#canvas.getContext(CANVAS_CONTEXT);
    #particles = [];
    #running = false;
    #last = null; // last pointer sample: { x, y, time }
    #lastRipple = { x: 0, y: 0, time: 0 };
    #idleTimer = 0;
    #lastCry = '';
    #textBurner = new TextBurner(particle => this.#add(particle));

    start() {
        if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

        this.#canvas.className = CursorCssClass.CANVAS;
        this.#canvas.setAttribute(Attr.ARIA_HIDDEN, AttrValue.TRUE);
        document.body.append(this.#canvas);

        window.addEventListener(PointerEvent.MOVE, event => this.#onMove(event));
        window.addEventListener(PointerEvent.DOWN, event => this.#onDown(event));
        window.addEventListener(PointerEvent.CONTEXT_MENU, event => this.#onContextMenu(event));
        document.documentElement.addEventListener(PointerEvent.LEAVE, () => this.#onLeave());
    }

    // ----- pointer -----

    #onMove(event) {
        if (event.pointerType !== MOUSE_POINTER) return;
        const now = performance.now();
        const point = { x: event.clientX, y: event.clientY, time: now };
        this.#bringCursorBack();
        this.#restartIdleTimer(point);
        this.#textBurner.scan(point);

        if (this.#last) {
            const distance = Math.hypot(point.x - this.#last.x, point.y - this.#last.y);
            const speed = distance / Math.max(now - this.#last.time, 1);
            if (speed > Fire.SPEED) {
                this.#burn(this.#last, point, speed);
            } else {
                this.#ripple(point);
            }
        }
        this.#last = point;
    }

    #onDown(event) {
        if (event.pointerType !== MOUSE_POINTER || event.button !== PRIMARY_BUTTON) return;
        this.#puff({ x: event.clientX, y: event.clientY });
    }

    #onContextMenu(event) {
        if (event.target.closest?.(NATIVE_MENU_SELECTOR)) return;
        event.preventDefault();
        this.#callForHelp({ x: event.clientX, y: event.clientY });
    }

    #onLeave() {
        clearTimeout(this.#idleTimer);
        this.#last = null;
    }

    #restartIdleTimer(point) {
        clearTimeout(this.#idleTimer);
        this.#idleTimer = setTimeout(() => this.#crumble(point), Dust.IDLE_MS);
    }

    #bringCursorBack() {
        document.documentElement.classList.remove(CursorCssClass.CURSOR_GONE);
    }

    // ----- the four effects -----

    #ripple(point) {
        const moved = Math.hypot(point.x - this.#lastRipple.x, point.y - this.#lastRipple.y);
        if (point.time - this.#lastRipple.time < Ripple.MIN_INTERVAL_MS || moved < Ripple.MIN_DISTANCE_PX) return;
        this.#lastRipple = point;
        this.#add({ kind: ParticleKind.RIPPLE, x: point.x, y: point.y, life: Ripple.LIFE_MS });
    }

    #crumble(point) {
        document.documentElement.classList.add(CursorCssClass.CURSOR_GONE);
        for (let i = 0; i < Dust.GRAINS; i++) {
            const [dx, dy] = randomPointInCursor();
            const colour = Math.random() < Dust.EDGE_SHARE ? Dust.EDGE : Dust.BODY;
            this.#add(createGrain(point.x + dx, point.y + dy, colour));
        }
    }

    #burn(from, to, speed) {
        const flames = Math.min(Math.round(speed * Fire.FLAMES_PER_SPEED), Fire.FLAMES_MAX);
        for (let i = 0; i < flames; i++) {
            const along = Math.random();
            this.#add(
                createFlame(
                    from.x + (to.x - from.x) * along + between(-Fire.SPREAD_PX, Fire.SPREAD_PX * 2),
                    from.y + (to.y - from.y) * along + between(-Fire.SPREAD_PX, Fire.SPREAD_PX * 2),
                ),
            );
        }
    }

    #puff(point) {
        for (let i = 0; i < Gas.PUFFS; i++) {
            const angle = Gas.BURST_ANGLE + between(-Gas.BURST_SPREAD / 2, Gas.BURST_SPREAD);
            const speed = between(Gas.SPEED_MIN, Gas.SPEED_RANGE);
            this.#add({
                kind: ParticleKind.GAS,
                x: point.x,
                y: point.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                endRadius: between(Gas.END_RADIUS_MIN, Gas.END_RADIUS_RANGE),
                colour: pick(Gas.COLOURS),
                life: between(Gas.LIFE_MIN_MS, Gas.LIFE_RANGE_MS),
            });
        }
    }

    #callForHelp(point) {
        this.#add({
            kind: ParticleKind.CLOUD,
            x: point.x,
            y: point.y + HelpCloud.OFFSET_Y,
            text: this.#nextCry(),
            font: `${HelpCloud.FONT_WEIGHT} ${HelpCloud.FONT_SIZE_PX}px ${getComputedStyle(document.body).fontFamily}`,
            life: HelpCloud.LIFE_MS,
        });
    }

    /** A random line for the cloud, never the same one twice in a row. */
    #nextCry() {
        const cries = localization.list(StringKey.CURSOR_CRIES);
        if (cries.length === 0) return '';
        const others = cries.length > 1 ? cries.filter(cry => cry !== this.#lastCry) : cries;
        this.#lastCry = pick(others);
        return this.#lastCry;
    }

    // ----- loop -----

    #add(particle) {
        if (this.#particles.length >= PARTICLE_LIMIT) return;
        particle.born = performance.now();
        this.#particles.push(particle);
        if (!this.#running) {
            this.#running = true;
            requestAnimationFrame(now => this.#frame(now));
        }
    }

    #frame(now) {
        this.#fitCanvas();
        const context = this.#context;
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);

        this.#particles = this.#particles.filter(particle => now - particle.born < particle.life);
        this.#particles.forEach(particle => {
            const age = Math.max((now - particle.born) / particle.life, 0);
            PAINTERS[particle.kind](context, particle, age);
        });
        context.globalCompositeOperation = NORMAL_BLEND;

        if (this.#particles.length > 0) {
            requestAnimationFrame(next => this.#frame(next));
        } else {
            this.#running = false;
        }
    }

    /** Keeps the canvas the size of the window, in device pixels. */
    #fitCanvas() {
        const ratio = window.devicePixelRatio || 1;
        const width = Math.round(window.innerWidth * ratio);
        const height = Math.round(window.innerHeight * ratio);
        if (this.#canvas.width !== width || this.#canvas.height !== height) {
            this.#canvas.width = width;
            this.#canvas.height = height;
        }
        this.#context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
}

/** How each kind of particle moves and is drawn. age runs from 0 (born) to 1 (gone). */
const PAINTERS = {
    [ParticleKind.RIPPLE](context, ripple, age) {
        const eased = 1 - (1 - age) ** 2;
        const radius = Ripple.START_RADIUS + (Ripple.END_RADIUS - Ripple.START_RADIUS) * eased;
        context.globalCompositeOperation = NORMAL_BLEND;
        context.lineWidth = Ripple.LINE_WIDTH;
        [1, Ripple.INNER_RING_SCALE].forEach(scale => {
            context.strokeStyle = rgba(Ripple.DEEP, (1 - age) * Ripple.DEEP_ALPHA);
            circle(context, ripple.x, ripple.y + 1, radius * scale);
            context.stroke();
            context.strokeStyle = rgba(Ripple.LIGHT, (1 - age) * Ripple.LIGHT_ALPHA);
            circle(context, ripple.x, ripple.y, radius * scale);
            context.stroke();
        });
    },

    [ParticleKind.DUST](context, grain, age) {
        grain.vy += Dust.GRAVITY;
        grain.vx += Dust.BREEZE;
        grain.x += grain.vx;
        grain.y += grain.vy;
        context.globalCompositeOperation = NORMAL_BLEND;
        context.fillStyle = rgba(grain.colour, 1 - age);
        context.fillRect(grain.x, grain.y, grain.size, grain.size);
    },

    [ParticleKind.FLAME](context, flame, age) {
        flame.x += flame.vx;
        flame.y += flame.vy;
        const radius = flame.radius * (1 - age * 0.75);
        const [colour, alpha] = flameColour(age);
        const glow = context.createRadialGradient(flame.x, flame.y, 0, flame.x, flame.y, radius);
        glow.addColorStop(0, rgba(colour, alpha));
        glow.addColorStop(0.5, rgba(colour, alpha * 0.7));
        glow.addColorStop(1, rgba(colour, 0));
        context.globalCompositeOperation = NORMAL_BLEND;
        context.fillStyle = glow;
        circle(context, flame.x, flame.y, radius);
        context.fill();
    },

    [ParticleKind.GAS](context, puff, age) {
        puff.vx *= Gas.DRAG;
        puff.vy = puff.vy * Gas.DRAG - Gas.LIFT;
        puff.x += puff.vx;
        puff.y += puff.vy;
        const radius = Gas.START_RADIUS + (puff.endRadius - Gas.START_RADIUS) * (1 - (1 - age) ** 2);
        const cloud = context.createRadialGradient(puff.x, puff.y, 0, puff.x, puff.y, radius);
        cloud.addColorStop(0, rgba(puff.colour, (1 - age) * Gas.ALPHA));
        cloud.addColorStop(1, rgba(puff.colour, 0));
        context.globalCompositeOperation = NORMAL_BLEND;
        context.fillStyle = cloud;
        circle(context, puff.x, puff.y, radius);
        context.fill();
    },
};

function paintCloud(context, cloud, age) {
    cloud.y -= HelpCloud.RISE;
    const alpha =
        Math.min(age / HelpCloud.FADE_IN, 1) *
        (age > HelpCloud.FADE_OUT_FROM ? (1 - age) / (1 - HelpCloud.FADE_OUT_FROM) : 1);

    context.globalCompositeOperation = NORMAL_BLEND;
    context.font = cloud.font;
    const halfWidth = context.measureText(cloud.text).width / 2 + HelpCloud.PADDING_X;
    const halfHeight = HelpCloud.HEIGHT / 2;
    // Keep the whole cloud inside the window
    const reach = halfWidth + HelpCloud.BUMP_RADIUS;
    const x = Math.min(Math.max(cloud.x, reach), window.innerWidth - reach);
    const y = Math.max(cloud.y, halfHeight + HelpCloud.BUMP_RADIUS);

    // Puffs around an oval: outlined first, then filled, so only the outer edge keeps its line
    const puffs = Array.from({ length: HelpCloud.BUMPS }, (_, i) => {
        const angle = (i / HelpCloud.BUMPS) * Math.PI * 2;
        return [x + Math.cos(angle) * halfWidth, y + Math.sin(angle) * halfHeight];
    });
    context.lineWidth = HelpCloud.OUTLINE_WIDTH * 2;
    context.strokeStyle = rgba(HelpCloud.OUTLINE, alpha);
    puffs.forEach(([px, py]) => {
        circle(context, px, py, HelpCloud.BUMP_RADIUS);
        context.stroke();
    });
    context.fillStyle = rgba(HelpCloud.FILL, alpha);
    puffs.forEach(([px, py]) => {
        circle(context, px, py, HelpCloud.BUMP_RADIUS);
        context.fill();
    });
    context.beginPath();
    context.ellipse(x, y, halfWidth, halfHeight, 0, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = rgba(HelpCloud.TEXT, alpha);
    context.textAlign = HelpCloud.TEXT_ALIGN;
    context.textBaseline = HelpCloud.TEXT_BASELINE;
    context.fillText(cloud.text, x, y);
}

function circle(context, x, y, radius) {
    context.beginPath();
    context.arc(x, y, Math.max(radius, 0), 0, Math.PI * 2);
}

/** Blends between the flame's colour stops for its age. */
function flameColour(age) {
    const next = Fire.COLOURS.findIndex(([at]) => at >= age);
    if (next <= 0) return [Fire.COLOURS[0][1], Fire.COLOURS[0][2]];
    const [fromAt, from, fromAlpha] = Fire.COLOURS[next - 1];
    const [toAt, to, toAlpha] = Fire.COLOURS[next];
    const share = (age - fromAt) / (toAt - fromAt);
    return [from.map((value, i) => Math.round(value + (to[i] - value) * share)), fromAlpha + (toAlpha - fromAlpha) * share];
}

PAINTERS[ParticleKind.CLOUD] = paintCloud;

/** A random point inside the arrow cursor's outline, in px from its tip. */
function randomPointInCursor() {
    const outline = Dust.CURSOR_OUTLINE;
    const width = Math.max(...outline.map(([x]) => x));
    const height = Math.max(...outline.map(([, y]) => y));
    for (let attempt = 0; attempt < 20; attempt++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        if (isInside(x, y, outline)) return [x, y];
    }
    return [0, 0];
}

function isInside(x, y, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i];
        const [xj, yj] = polygon[j];
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
}
