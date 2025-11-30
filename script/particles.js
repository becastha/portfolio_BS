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
            
            // Create star field background
            this.createStarField();
            
            // Create multiple shooting stars
            this.createShootingStar(0xffffff, -80, 60, 1.8);   // White fast
            this.createShootingStar(0xaaccff, -60, 30, 1.5);   // Blue medium
            this.createShootingStar(0xffffaa, -90, 0, 2.0);    // Yellow fast
            this.createShootingStar(0xffccaa, -50, -20, 1.3);  // Orange slow
            this.createShootingStar(0xccffff, -70, -40, 1.6);  // Cyan medium
            
            // Start animation
            this.animate();
            
            // Handle window resize
            window.addEventListener('resize', () => this.handleResize());
            
            console.log('Three.js realistic shooting stars initialized');
        } catch (error) {
            console.error('Three.js error:', error);
        }
    },
    
    // Create background star field
    createStarField: function() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 300;
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);
        
        for (let i = 0; i < starCount; i++) {
            // Random positions
            positions[i * 3] = (Math.random() - 0.5) * 200;      // x
            positions[i * 3 + 1] = (Math.random() - 0.5) * 200;  // y
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100;  // z
            
            // Slight color variation (white to pale blue)
            const colorVariation = 0.8 + Math.random() * 0.2;
            colors[i * 3] = colorVariation;                       // r
            colors[i * 3 + 1] = colorVariation;                   // g
            colors[i * 3 + 2] = 0.9 + Math.random() * 0.1;       // b (slightly blue)
            
            // Random sizes
            sizes[i] = Math.random() * 2 + 0.5;
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const starMaterial = new THREE.PointsMaterial({
            size: 1.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        
        this.starField = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.starField);
    },
    
    // Create a shooting star
    createShootingStar: function(color, startX, startY, speed) {
        const group = new THREE.Group();
        
        // Create the bright head of the shooting star
        const headGeometry = new THREE.SphereGeometry(0.3, 8, 8);
        const headMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 1
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        
        // Add glow around the head
        const glowGeometry = new THREE.SphereGeometry(0.6, 8, 8);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        
        group.add(head);
        group.add(glow);
        
        // Create the glowing tail
        const trailGeometry = new THREE.BufferGeometry();
        const trailPoints = 40;
        const trailPositions = new Float32Array(trailPoints * 3);
        const trailOpacities = new Float32Array(trailPoints);
        
        for (let i = 0; i < trailPoints; i++) {
            trailPositions[i * 3] = -i * 0.5;      // x (behind the head)
            trailPositions[i * 3 + 1] = i * 0.05;  // y (slight curve)
            trailPositions[i * 3 + 2] = 0;         // z
            
            // Fade out towards the tail
            trailOpacities[i] = 1 - (i / trailPoints);
        }
        
        trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
        
        const trailMaterial = new THREE.LineBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.8,
            linewidth: 3,
            blending: THREE.AdditiveBlending
        });
        
        const trail = new THREE.Line(trailGeometry, trailMaterial);
        group.add(trail);
        
        // Add sparkle particles along the trail
        const sparkleGeometry = new THREE.BufferGeometry();
        const sparkleCount = 20;
        const sparklePositions = new Float32Array(sparkleCount * 3);
        const sparkleSizes = new Float32Array(sparkleCount);
        
        for (let i = 0; i < sparkleCount; i++) {
            sparklePositions[i * 3] = -Math.random() * 15;           // x (behind)
            sparklePositions[i * 3 + 1] = (Math.random() - 0.5) * 2; // y (spread)
            sparklePositions[i * 3 + 2] = (Math.random() - 0.5) * 2; // z (spread)
            sparkleSizes[i] = Math.random() * 3 + 1;
        }
        
        sparkleGeometry.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));
        sparkleGeometry.setAttribute('size', new THREE.BufferAttribute(sparkleSizes, 1));
        
        const sparkleMaterial = new THREE.PointsMaterial({
            color: color,
            size: 2,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        
        const sparkles = new THREE.Points(sparkleGeometry, sparkleMaterial);
        group.add(sparkles);
        
        // Position the shooting star group
        group.position.set(startX, startY, Math.random() * 20 - 10);
        
        // Store animation data
        group.userData = {
            color: color,
            speed: speed,
            velocity: {
                x: speed,
                y: -speed * 0.3  // Downward diagonal motion
            },
            startX: startX,
            startY: startY,
            head: head,
            glow: glow,
            trail: trail,
            sparkles: sparkles,
            lifespan: Math.random() * 2 + 3,  // 3-5 seconds
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
        const deltaTime = 0.016; // ~60fps
        
        // Animate shooting stars
        this.shootingStars.forEach((star, index) => {
            // Move the star
            star.position.x += star.userData.velocity.x;
            star.position.y += star.userData.velocity.y;
            
            // Age the star
            star.userData.age += deltaTime;
            
            // Reset position when off screen or too old
            if (star.position.x > 100 || star.position.y < -80 || star.userData.age > star.userData.lifespan) {
                star.position.x = -80 - Math.random() * 40;
                star.position.y = 60 + Math.random() * 40;
                star.position.z = Math.random() * 20 - 10;
                star.userData.age = 0;
                star.userData.lifespan = Math.random() * 2 + 3;
            }
            
            // Twinkle effect on the head
            if (star.userData.head) {
                const twinkle = Math.sin(time * 10 + star.userData.twinkle) * 0.3 + 0.7;
                star.userData.head.material.opacity = twinkle;
                star.userData.glow.material.opacity = twinkle * 0.3;
            }
            
            // Update trail with smooth curve
            if (star.userData.trail) {
                const positions = star.userData.trail.geometry.attributes.position.array;
                for (let i = 0; i < positions.length; i += 3) {
                    const idx = i / 3;
                    positions[i] = -idx * 0.5;                           // x (straight back)
                    positions[i + 1] = idx * 0.05 + Math.sin(time * 2 + idx * 0.1) * 0.3;  // y (wavy)
                    positions[i + 2] = Math.sin(time * 3 + idx * 0.2) * 0.2;  // z (slight wave)
                }
                star.userData.trail.geometry.attributes.position.needsUpdate = true;
                
                // Fade trail based on age
                const fadeFactor = 1 - (star.userData.age / star.userData.lifespan);
                star.userData.trail.material.opacity = 0.8 * fadeFactor;
            }
            
            // Animate sparkles
            if (star.userData.sparkles) {
                const sparklePositions = star.userData.sparkles.geometry.attributes.position.array;
                for (let i = 0; i < sparklePositions.length; i += 3) {
                    const idx = i / 3;
                    const offset = time * 2 + idx * 0.5;
                    
                    sparklePositions[i] = -Math.random() * 15;                        // x (random along trail)
                    sparklePositions[i + 1] = Math.sin(offset) * 1.5;                 // y (wave)
                    sparklePositions[i + 2] = Math.cos(offset) * 1.5;                 // z (circular)
                }
                star.userData.sparkles.geometry.attributes.position.needsUpdate = true;
                
                // Pulse sparkles opacity
                star.userData.sparkles.material.opacity = 0.4 + Math.sin(time * 5) * 0.3;
            }
        });
        
        // Twinkle background stars
        if (this.starField) {
            const positions = this.starField.geometry.attributes.position.array;
            const sizes = this.starField.geometry.attributes.size.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                const idx = i / 3;
                // Subtle z-axis movement for depth
                positions[i + 2] = Math.sin(time * 0.5 + idx * 0.1) * 50;
                
                // Twinkle size
                const baseSizes = 0.5 + (idx % 3) * 0.5;
                sizes[idx] = baseSizes + Math.sin(time * 3 + idx) * 0.3;
            }
            
            this.starField.geometry.attributes.position.needsUpdate = true;
            this.starField.geometry.attributes.size.needsUpdate = true;
            
            // Slowly rotate the star field
            this.starField.rotation.z += 0.0001;
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