// Puts a shooting star on the tip of every SVG line while it is being drawn, and throws sparks
// where a line ends (where it meets the lines around it) and where two stars come close.
// Everything is painted on one canvas laid over the page; the loop only runs while lines are drawing.

const Stars = Object.freeze({
    /** CSS animation that draws a line (see manuscript.css). */
    DRAW_ANIMATION: 'draw-line',
    CANVAS_TAG: 'canvas',
    CANVAS_CLASS: 'drawing-stars',
    CONTEXT: '2d',
    ARIA_HIDDEN_ATTRIBUTE: 'aria-hidden',
    TRUE: 'true',
    ANIMATION_START: 'animationstart',
    ANIMATION_END: 'animationend',
    ANIMATION_CANCEL: 'animationcancel',

    /** Positions remembered per star; they form its tail. */
    TAIL_POINTS: 14,
    TAIL_WIDTH: 2.2,
    HEAD_RADIUS: 2.4,
    GLOW_RADIUS: 13,

    /** Two stars closer than this (px) throw sparks, at most once per cooldown. */
    MEET_DISTANCE: 18,
    MEET_COOLDOWN_MS: 350,

    SPARK_COUNT: 9,
    SPARK_LIFE_MS: 480,
    SPARK_SPEED: 2.6,
    SPARK_GRAVITY: 0.07,
    SPARK_LENGTH: 3.2,
    SPARK_WIDTH: 1.3,
    /** At most this many sparks alive at once. */
    SPARK_LIMIT: 220,
});

/** Colours: a white-hot core, a warm glow, embers. The trailing number is the opacity. */
const core = alpha => `rgba(255, 253, 240, ${alpha})`;
const glow = alpha => `rgba(255, 233, 160, ${alpha})`;
const ember = alpha => `rgba(255, 214, 120, ${alpha})`;

/**
 * Starts following the lines drawn under root.
 * @param {Document} root
 */
export function followDrawingLines(root) {
    const canvas = root.createElement(Stars.CANVAS_TAG);
    canvas.className = Stars.CANVAS_CLASS;
    canvas.setAttribute(Stars.ARIA_HIDDEN_ATTRIBUTE, Stars.TRUE);
    root.body.append(canvas);
    const context = canvas.getContext(Stars.CONTEXT);

    /** @type {Map<SVGGeometryElement, { length: number, tail: {x: number, y: number}[] }>} */
    const stars = new Map();
    let sparks = [];
    let lastMeeting = 0;
    let running = false;

    const isDrawnLine = event =>
        event.animationName === Stars.DRAW_ANIMATION && event.target instanceof SVGGeometryElement;

    root.addEventListener(Stars.ANIMATION_START, event => {
        if (!isDrawnLine(event)) return;
        stars.set(event.target, { length: event.target.getTotalLength(), tail: [] });
        if (!running) {
            running = true;
            requestAnimationFrame(frame);
        }
    });

    const finish = event => {
        if (!isDrawnLine(event)) return;
        const tip = stars.get(event.target)?.tail.at(-1);
        if (tip && isOnScreen(tip)) burst(tip);
        stars.delete(event.target);
    };
    root.addEventListener(Stars.ANIMATION_END, finish);
    root.addEventListener(Stars.ANIMATION_CANCEL, finish);

    function frame(now) {
        fitCanvas();
        context.clearRect(0, 0, canvas.width, canvas.height);

        stars.forEach((star, line) => advance(star, line));
        meetStars(now);
        stars.forEach(drawStar);
        drawSparks();

        if (stars.size > 0 || sparks.length > 0) {
            requestAnimationFrame(frame);
        } else {
            running = false;
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    /** Keeps the canvas the size of the viewport, in device pixels. */
    function fitCanvas() {
        const ratio = window.devicePixelRatio || 1;
        const width = Math.round(window.innerWidth * ratio);
        const height = Math.round(window.innerHeight * ratio);
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
        }
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    /** Moves a star to the tip of its line: the drawn share is what the dash animation has uncovered. */
    function advance(star, line) {
        const drawn = 1 - parseFloat(getComputedStyle(line).strokeDashoffset);
        if (!(drawn > 0)) return;
        const matrix = line.getScreenCTM();
        if (!matrix) return;
        const point = line.getPointAtLength(Math.min(drawn, 1) * star.length);
        star.tail.push({
            x: matrix.a * point.x + matrix.c * point.y + matrix.e,
            y: matrix.b * point.x + matrix.d * point.y + matrix.f,
        });
        if (star.tail.length > Stars.TAIL_POINTS) star.tail.shift();
    }

    function meetStars(now) {
        if (now - lastMeeting < Stars.MEET_COOLDOWN_MS) return;
        const tips = [...stars.values()].map(star => star.tail.at(-1)).filter(tip => tip && isOnScreen(tip));
        for (let i = 0; i < tips.length; i++) {
            for (let j = i + 1; j < tips.length; j++) {
                if (Math.hypot(tips[i].x - tips[j].x, tips[i].y - tips[j].y) < Stars.MEET_DISTANCE) {
                    burst({ x: (tips[i].x + tips[j].x) / 2, y: (tips[i].y + tips[j].y) / 2 });
                    lastMeeting = now;
                    return;
                }
            }
        }
    }

    function burst({ x, y }) {
        for (let i = 0; i < Stars.SPARK_COUNT && sparks.length < Stars.SPARK_LIMIT; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Stars.SPARK_SPEED * (0.4 + Math.random() * 0.8);
            sparks.push({
                x,
                y,
                dx: Math.cos(angle) * speed,
                dy: Math.sin(angle) * speed,
                born: performance.now(),
            });
        }
    }

    function drawStar({ tail }) {
        const tip = tail.at(-1);
        if (!tip || !isOnScreen(tip)) return;

        // Tail: fades and thins away from the head
        context.lineCap = 'round';
        for (let i = 1; i < tail.length; i++) {
            const strength = i / tail.length;
            context.strokeStyle = glow(strength * 0.8);
            context.lineWidth = Stars.TAIL_WIDTH * strength;
            context.beginPath();
            context.moveTo(tail[i - 1].x, tail[i - 1].y);
            context.lineTo(tail[i].x, tail[i].y);
            context.stroke();
        }

        // Head: a soft glow with a white-hot core
        const halo = context.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, Stars.GLOW_RADIUS);
        halo.addColorStop(0, glow(0.75));
        halo.addColorStop(1, glow(0));
        context.fillStyle = halo;
        context.beginPath();
        context.arc(tip.x, tip.y, Stars.GLOW_RADIUS, 0, Math.PI * 2);
        context.fill();

        context.fillStyle = core(1);
        context.beginPath();
        context.arc(tip.x, tip.y, Stars.HEAD_RADIUS, 0, Math.PI * 2);
        context.fill();
    }

    function drawSparks() {
        const now = performance.now();
        sparks = sparks.filter(spark => now - spark.born < Stars.SPARK_LIFE_MS);
        context.lineWidth = Stars.SPARK_WIDTH;
        sparks.forEach(spark => {
            spark.dy += Stars.SPARK_GRAVITY;
            spark.x += spark.dx;
            spark.y += spark.dy;
            context.strokeStyle = ember(1 - (now - spark.born) / Stars.SPARK_LIFE_MS);
            context.beginPath();
            context.moveTo(spark.x, spark.y);
            context.lineTo(spark.x - spark.dx * Stars.SPARK_LENGTH, spark.y - spark.dy * Stars.SPARK_LENGTH);
            context.stroke();
        });
    }
}

function isOnScreen({ x, y }) {
    return x >= 0 && y >= 0 && x <= window.innerWidth && y <= window.innerHeight;
}
