// ============= THREE.JS REALISTIC SHOOTING STARS =============

const Particles = {
    scene: null,
    camera: null,
    renderer: null,
    shootingStars: [],
    starField: null,
    
    // Initialize Three.js with realistic shooting stars
    init: function() {
        if (typeof THREE === 'undefined') {
            console.log('Three.js not loaded');
            return;
        }
        
        try {
            const container = document.getElementById('particles-bg');
            if (!container) {
                console.log('Particles container not found');
                return;
            }
            
            // Setup Three.js scene
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                0.1,
                1000
            );
            
            this.renderer = new THREE.WebGLRenderer({
                alpha: true,
                antialias: true
            });
            
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setClearColor(0x000000, 0);
            this.renderer.setPixelRatio(window.devicePixelRatio);
            container.appendChild(this.renderer.domElement);
            
            this.camera.position.z = 50;
            
            // Create star field background with TINY dots
            this.createStarField();
            
            // Create multiple shooting stars
            this.createShootingStar(0xffffff, -60, 50, 2.2);   // White fast
            this.createShootingStar(0xaaddff, -80, 30, 1.8);   // Blue medium
            this.createShootingStar(0xffffaa, -50, 10, 2.5);   // Yellow very fast
            this.createShootingStar(0xffddaa, -90, -10, 1.5);  // Orange slow
            this.createShootingStar(0xccffff, -70, -30, 2.0);  // Cyan fast
            
            // Start animation
            this.animate();
            
            // Handle window resize
            window.addEventListener('resize', () => this.handleResize());
            
            console.log('Three.js realistic shooting stars initialized');
        } catch (error) {
            console.error('Three.js error:', error);
        }
    },
    
    // Create background star field - FIXED to show tiny dots
    createStarField: function() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 400;
        const positions = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount; i++) {
            // Spread stars across the whole screen
            positions[i * 3] = (Math.random() - 0.5) * 200;      // x
            positions[i * 3 + 1] = (Math.random() - 0.5) * 200;  // y
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100;  // z
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        // FIXED: Use smaller size and proper point rendering
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.8,  // MUCH smaller!
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true,  // Points get smaller with distance
            map: this.createCircleTexture(),  // Use circular texture instead of squares
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        this.starField = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.starField);
    },
    
    // Create circular texture for stars (no more squares!)
    createCircleTexture: function() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.2, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.4, 'rgba(255,255,255,0.5)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 32, 32);
        
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    },
    
    // Create a shooting star
    createShootingStar: function(color, startX, startY, speed) {
        const group = new THREE.Group();
        
        // Create the bright head (glowing sphere)
        const headGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        const headMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 1
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        group.add(head);
        
        // Add outer glow
        const glowGeometry = new THREE.SphereGeometry(0.8, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        group.add(glow);
        
        // Create the glowing tail trail
        const trailGeometry = new THREE.BufferGeometry();
        const trailPoints = 50;
        const trailPositions = new Float32Array(trailPoints * 3);
        
        for (let i = 0; i < trailPoints; i++) {
            trailPositions[i * 3] = -i * 0.8;      // x (behind the head)
            trailPositions[i * 3 + 1] = i * 0.1;   // y (slight curve downward)
            trailPositions[i * 3 + 2] = 0;         // z
        }
        
        trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
        
        const trailMaterial = new THREE.LineBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.7,
            linewidth: 2,
            blending: THREE.AdditiveBlending
        });
        
        const trail = new THREE.Line(trailGeometry, trailMaterial);
        group.add(trail);
        
        // Add sparkle particles (using circle texture to avoid squares)
        const sparkleGeometry = new THREE.BufferGeometry();
        const sparkleCount = 30;
        const sparklePositions = new Float32Array(sparkleCount * 3);
        
        for (let i = 0; i < sparkleCount; i++) {
            sparklePositions[i * 3] = -Math.random() * 20;           // x (behind)
            sparklePositions[i * 3 + 1] = (Math.random() - 0.5) * 3; // y (spread)
            sparklePositions[i * 3 + 2] = (Math.random() - 0.5) * 3; // z (spread)
        }
        
        sparkleGeometry.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));
        
        const sparkleMaterial = new THREE.PointsMaterial({
            color: color,
            size: 1.5,  // Smaller sparkles
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true,
            map: this.createCircleTexture(),  // Use circle texture
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const sparkles = new THREE.Points(sparkleGeometry, sparkleMaterial);
        group.add(sparkles);
        
        // Position the shooting star
        group.position.set(startX, startY, Math.random() * 20 - 10);
        
        // Store animation data
        group.userData = {
            color: color,
            speed: speed,
            velocity: {
                x: speed,
                y: -speed * 0.4  // Downward diagonal
            },
            startX: startX,
            startY: startY,
            head: head,
            glow: glow,
            trail: trail,
            sparkles: sparkles,
            lifespan: Math.random() * 3 + 4,  // 4-7 seconds
            age: 0,
            twinkle: Math.random() * Math.PI * 2
        };
        
        this.scene.add(group);
        this.shootingStars.push(group);
    },
    
    // Animation loop
    animate: function() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        const deltaTime = 0.016;
        
        // Animate shooting stars
        this.shootingStars.forEach((star, index) => {
            // Move the star diagonally
            star.position.x += star.userData.velocity.x;
            star.position.y += star.userData.velocity.y;
            
            // Age tracking
            star.userData.age += deltaTime;
            
            // Reset when off screen or too old
            if (star.position.x > 100 || star.position.y < -100 || star.userData.age > star.userData.lifespan) {
                star.position.x = -80 - Math.random() * 40;
                star.position.y = 60 + Math.random() * 40;
                star.position.z = Math.random() * 20 - 10;
                star.userData.age = 0;
                star.userData.lifespan = Math.random() * 3 + 4;
            }
            
            // Twinkle the head
            if (star.userData.head) {
                const twinkle = Math.sin(time * 12 + star.userData.twinkle) * 0.2 + 0.8;
                star.userData.head.material.opacity = twinkle;
                star.userData.glow.material.opacity = twinkle * 0.4;
                
                // Pulse the glow
                const pulse = Math.sin(time * 8 + index) * 0.1 + 1;
                star.userData.glow.scale.set(pulse, pulse, pulse);
            }
            
            // Animate trail with smooth wave
            if (star.userData.trail) {
                const positions = star.userData.trail.geometry.attributes.position.array;
                for (let i = 0; i < positions.length; i += 3) {
                    const idx = i / 3;
                    positions[i] = -idx * 0.8;
                    positions[i + 1] = idx * 0.1 + Math.sin(time * 3 + idx * 0.15) * 0.5;
                    positions[i + 2] = Math.cos(time * 2 + idx * 0.1) * 0.3;
                }
                star.userData.trail.geometry.attributes.position.needsUpdate = true;
                
                // Fade trail over lifetime
                const fadeFactor = 1 - (star.userData.age / star.userData.lifespan * 0.3);
                star.userData.trail.material.opacity = 0.7 * fadeFactor;
            }
            
            // Animate sparkles orbiting along the trail
            if (star.userData.sparkles) {
                const sparklePositions = star.userData.sparkles.geometry.attributes.position.array;
                for (let i = 0; i < sparklePositions.length; i += 3) {
                    const idx = i / 3;
                    const offset = time * 3 + idx * 0.8;
                    const distance = idx * 0.7;
                    
                    sparklePositions[i] = -distance - Math.cos(offset) * 1;
                    sparklePositions[i + 1] = Math.sin(offset) * 2;
                    sparklePositions[i + 2] = Math.cos(offset + 1) * 2;
                }
                star.userData.sparkles.geometry.attributes.position.needsUpdate = true;
                
                // Pulse opacity
                star.userData.sparkles.material.opacity = 0.5 + Math.sin(time * 6 + index) * 0.3;
            }
        });
        
        // Gentle twinkle on background stars
        if (this.starField) {
            const positions = this.starField.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                const idx = i / 3;
                // Very subtle z movement for depth
                positions[i + 2] += Math.sin(time * 0.3 + idx * 0.05) * 0.02;
            }
            
            this.starField.geometry.attributes.position.needsUpdate = true;
            
            // Very slow rotation for dynamic feel
            this.starField.rotation.z += 0.00005;
        }
        
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    },
    
    // Handle window resize
    handleResize: function() {
        if (this.camera && this.renderer) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }
};

// Make it globally available
window.Particles = Particles;