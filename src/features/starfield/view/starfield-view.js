// Starfield View: a purely decorative Three.js background (twinkling stars and shooting stars).
// It has no data and no user interaction, so it needs no Model or ViewModel.
// THREE is the global provided by the three.js script tag in index.html.

import { DomEvent, Tag } from '../../../shared/constants/html.js';
import { DevMessage, logger } from '../../../shared/logging/logger.js';
import { byId } from '../../../shared/ui/dom.js';
import {
    Camera,
    CANVAS_CONTEXT_2D,
    CLEAR_COLOR,
    DotTexture,
    FRAME_SECONDS,
    POSITION_ATTRIBUTE,
    SHOOTING_STARS,
    ShootingStar as Star,
    StarField,
    STARFIELD_CONTAINER_ID,
} from '../starfield-constants.js';

const centered = range => (Math.random() - 0.5) * range;
const randomLifespan = () => Math.random() * Star.LIFESPAN_RANGE + Star.LIFESPAN_MIN;
const randomDepth = () => Math.random() * Star.DEPTH_RANGE - Star.DEPTH_RANGE / 2;

export class StarfieldView {
    #scene;
    #camera;
    #renderer;
    #starField;
    #shootingStars = [];

    start() {
        const container = byId(STARFIELD_CONTAINER_ID);
        if (!window.THREE || !container) return;

        try {
            this.#scene = new THREE.Scene();
            this.#camera = new THREE.PerspectiveCamera(
                Camera.FOV,
                window.innerWidth / window.innerHeight,
                Camera.NEAR,
                Camera.FAR,
            );
            this.#camera.position.z = Camera.Z;

            this.#renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            this.#renderer.setSize(window.innerWidth, window.innerHeight);
            this.#renderer.setClearColor(CLEAR_COLOR, 0);
            this.#renderer.setPixelRatio(window.devicePixelRatio);
            container.appendChild(this.#renderer.domElement);

            this.#createStarField();
            SHOOTING_STARS.forEach(star => this.#createShootingStar(star));

            window.addEventListener(DomEvent.RESIZE, () => this.#handleResize());
            this.#animate();
        } catch (error) {
            logger.error(DevMessage.STARFIELD_FAILED, error);
        }
    }

    #createStarField() {
        const positions = new Float32Array(StarField.COUNT * 3);
        for (let i = 0; i < StarField.COUNT; i++) {
            positions[i * 3] = centered(StarField.SPREAD_XY);
            positions[i * 3 + 1] = centered(StarField.SPREAD_XY);
            positions[i * 3 + 2] = centered(StarField.SPREAD_Z);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(POSITION_ATTRIBUTE, new THREE.BufferAttribute(positions, 3));

        this.#starField = new THREE.Points(geometry, this.#dotMaterial(StarField.COLOR, StarField.SIZE, StarField.OPACITY));
        this.#scene.add(this.#starField);
    }

    #dotMaterial(color, size, opacity) {
        return new THREE.PointsMaterial({
            color,
            size,
            opacity,
            transparent: true,
            sizeAttenuation: true,
            map: createDotTexture(),
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
    }

    #createShootingStar({ color, startX, startY, speed }) {
        const group = new THREE.Group();

        const head = new THREE.Mesh(
            new THREE.SphereGeometry(Star.HEAD_RADIUS, Star.SPHERE_SEGMENTS, Star.SPHERE_SEGMENTS),
            new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1 }),
        );
        group.add(head);

        const glow = new THREE.Mesh(
            new THREE.SphereGeometry(Star.GLOW_RADIUS, Star.SPHERE_SEGMENTS, Star.SPHERE_SEGMENTS),
            new THREE.MeshBasicMaterial({
                color,
                transparent: true,
                opacity: Star.GLOW_OPACITY,
                blending: THREE.AdditiveBlending,
            }),
        );
        group.add(glow);

        const trailPositions = new Float32Array(Star.TRAIL_POINTS * 3);
        for (let i = 0; i < Star.TRAIL_POINTS; i++) {
            trailPositions[i * 3] = -i * Star.TRAIL_SPACING;
            trailPositions[i * 3 + 1] = i * Star.TRAIL_SLOPE;
            trailPositions[i * 3 + 2] = 0;
        }
        const trailGeometry = new THREE.BufferGeometry();
        trailGeometry.setAttribute(POSITION_ATTRIBUTE, new THREE.BufferAttribute(trailPositions, 3));
        const trail = new THREE.Line(
            trailGeometry,
            new THREE.LineBasicMaterial({
                color,
                transparent: true,
                opacity: Star.TRAIL_OPACITY,
                linewidth: Star.TRAIL_LINE_WIDTH,
                blending: THREE.AdditiveBlending,
            }),
        );
        group.add(trail);

        const sparklePositions = new Float32Array(Star.SPARKLE_COUNT * 3);
        for (let i = 0; i < Star.SPARKLE_COUNT; i++) {
            sparklePositions[i * 3] = -Math.random() * Star.SPARKLE_LENGTH;
            sparklePositions[i * 3 + 1] = centered(Star.SPARKLE_SPREAD);
            sparklePositions[i * 3 + 2] = centered(Star.SPARKLE_SPREAD);
        }
        const sparkleGeometry = new THREE.BufferGeometry();
        sparkleGeometry.setAttribute(POSITION_ATTRIBUTE, new THREE.BufferAttribute(sparklePositions, 3));
        const sparkles = new THREE.Points(
            sparkleGeometry,
            this.#dotMaterial(color, Star.SPARKLE_SIZE, Star.SPARKLE_OPACITY),
        );
        group.add(sparkles);

        group.position.set(startX, startY, randomDepth());
        group.userData = {
            velocity: { x: speed, y: -speed * Star.FALL_RATIO },
            head,
            glow,
            trail,
            sparkles,
            lifespan: randomLifespan(),
            age: 0,
            twinkle: Math.random() * Math.PI * 2,
        };

        this.#scene.add(group);
        this.#shootingStars.push(group);
    }

    #animate() {
        requestAnimationFrame(() => this.#animate());
        const time = Date.now() * 0.001;

        this.#shootingStars.forEach((star, index) => this.#animateShootingStar(star, index, time));
        this.#animateStarField(time);
        this.#renderer.render(this.#scene, this.#camera);
    }

    #animateShootingStar(star, index, time) {
        const data = star.userData;

        star.position.x += data.velocity.x;
        star.position.y += data.velocity.y;
        data.age += FRAME_SECONDS;

        if (star.position.x > Star.EXIT_X || star.position.y < Star.EXIT_Y || data.age > data.lifespan) {
            star.position.x = Star.RESPAWN_X - Math.random() * Star.RESPAWN_X_RANGE;
            star.position.y = Star.RESPAWN_Y + Math.random() * Star.RESPAWN_Y_RANGE;
            star.position.z = randomDepth();
            data.age = 0;
            data.lifespan = randomLifespan();
        }

        // Twinkling head and pulsing glow
        const twinkle = Math.sin(time * 12 + data.twinkle) * 0.2 + 0.8;
        data.head.material.opacity = twinkle;
        data.glow.material.opacity = twinkle * Star.GLOW_OPACITY;
        const pulse = Math.sin(time * 8 + index) * 0.1 + 1;
        data.glow.scale.set(pulse, pulse, pulse);

        // Waving trail that fades over the star's lifetime
        const trail = data.trail.geometry.attributes.position;
        for (let i = 0; i < trail.array.length; i += 3) {
            const point = i / 3;
            trail.array[i] = -point * Star.TRAIL_SPACING;
            trail.array[i + 1] = point * Star.TRAIL_SLOPE + Math.sin(time * 3 + point * 0.15) * 0.5;
            trail.array[i + 2] = Math.cos(time * 2 + point * 0.1) * 0.3;
        }
        trail.needsUpdate = true;
        data.trail.material.opacity = Star.TRAIL_OPACITY * (1 - (data.age / data.lifespan) * Star.TRAIL_FADE);

        // Sparkles orbiting along the trail
        const sparkles = data.sparkles.geometry.attributes.position;
        for (let i = 0; i < sparkles.array.length; i += 3) {
            const point = i / 3;
            const offset = time * 3 + point * 0.8;
            sparkles.array[i] = -point * Star.SPARKLE_SPACING - Math.cos(offset);
            sparkles.array[i + 1] = Math.sin(offset) * 2;
            sparkles.array[i + 2] = Math.cos(offset + 1) * 2;
        }
        sparkles.needsUpdate = true;
        data.sparkles.material.opacity = 0.5 + Math.sin(time * 6 + index) * 0.3;
    }

    #animateStarField(time) {
        const positions = this.#starField.geometry.attributes.position;
        for (let i = 0; i < positions.array.length; i += 3) {
            positions.array[i + 2] +=
                Math.sin(time * StarField.DRIFT_SPEED + (i / 3) * StarField.DRIFT_PHASE) * StarField.DRIFT_AMOUNT;
        }
        positions.needsUpdate = true;
        this.#starField.rotation.z += StarField.ROTATION_STEP;
    }

    #handleResize() {
        this.#camera.aspect = window.innerWidth / window.innerHeight;
        this.#camera.updateProjectionMatrix();
        this.#renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

function createDotTexture() {
    const canvas = document.createElement(Tag.CANVAS);
    canvas.width = DotTexture.SIZE;
    canvas.height = DotTexture.SIZE;

    const context = canvas.getContext(CANVAS_CONTEXT_2D);
    const center = DotTexture.SIZE / 2;
    const gradient = context.createRadialGradient(center, center, 0, center, center, center);
    DotTexture.GRADIENT_STOPS.forEach(([offset, color]) => gradient.addColorStop(offset, color));
    context.fillStyle = gradient;
    context.fillRect(0, 0, DotTexture.SIZE, DotTexture.SIZE);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
}
