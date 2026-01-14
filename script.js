/**
 * Main JavaScript File
 * Handles Theme Toggling, Animations, and Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------------------------------
    // 1. Theme Toggling
    // ------------------------------------------------------------------
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }

    // ------------------------------------------------------------------
    // 2. Typing Effect for Hero Role
    // ------------------------------------------------------------------
    const roleElement = document.querySelector('.hero-role');
    if (roleElement) {
        // Clear initial text to start typing
        const roles = ["Web Developer", "Engineering Student", "UI/UX Enthusiast", "Creative Problem Solver"];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        // Wrap the role text in a span we can manipulate, preserving the static part if any
        // But the HTML structure is <h2 class="hero-role">Web Developer & Engineering Student</h2>
        // We will replace the entire content dynamically.
        roleElement.innerHTML = '<span class="typing-text"></span>';
        const typingSpan = roleElement.querySelector('.typing-text');

        function type() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                typingSpan.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                typingSpan.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                typeSpeed = 2000; // Pause at end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500; // Pause before new word
            }

            setTimeout(type, typeSpeed);
        }

        // Start typing
        type();
    }

    // ------------------------------------------------------------------
    // 3. Background Particles Generator
    // ------------------------------------------------------------------
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        heroSection.prepend(particlesContainer);

        const particleCount = 20;
        for (let i = 0; i < particleCount; i++) {
            createParticle(particlesContainer);
        }
    }

    function createParticle(container) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Random properties
        const size = Math.random() * 5 + 2 + 'px';
        const left = Math.random() * 100 + '%';
        const delay = Math.random() * 15 + 's';
        const duration = Math.random() * 10 + 10 + 's'; // 10-20s

        particle.style.width = size;
        particle.style.height = size;
        particle.style.left = left;
        particle.style.animationDelay = delay;
        particle.style.animationDuration = duration;

        container.appendChild(particle);
    }

    // ------------------------------------------------------------------
    // 4. Scroll Animations (Intersection Observer)
    // ------------------------------------------------------------------
    const fadeElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right');
    const appearOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);
    fadeElements.forEach(el => appearOnScroll.observe(el));

    // ------------------------------------------------------------------
    // 5. Mobile Navigation & Smooth Scroll
    // ------------------------------------------------------------------
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const mobileOverlay = document.querySelector('.mobile-menu-overlay');
    const closeBtn = document.querySelector('.close-menu-btn');

    function toggleMenu() {
        mobileOverlay.classList.toggle('active');
        document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : 'auto';
    }

    if (mobileBtn) mobileBtn.addEventListener('click', toggleMenu);
    if (closeBtn) closeBtn.addEventListener('click', toggleMenu);
    if (mobileOverlay) mobileOverlay.addEventListener('click', (e) => { if (e.target === mobileOverlay) toggleMenu(); });

    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ------------------------------------------------------------------
    // 6. Custom Cursor Logic
    // ------------------------------------------------------------------
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');
    const cursorGlow = document.querySelector('[data-cursor-glow]');

    // Only activate on non-touch devices
    if (cursorDot && cursorOutline && window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener("mousemove", function (e) {
            const posX = e.clientX;
            const posY = e.clientY;

            // Set Global CSS Variables for background interaction
            document.documentElement.style.setProperty('--x', `${posX}px`);
            document.documentElement.style.setProperty('--y', `${posY}px`);

            // Dot follows immediately
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Outline follows with slight delay (animation is handled by CSS transition usually, or manual lerp)
            // Here we use CSS transition on the element itself for the smooth lag
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });

            // Glow follows with more delay for fluid effect
            if (cursorGlow) {
                cursorGlow.animate({
                    left: `${posX}px`,
                    top: `${posY}px`
                }, { duration: 1000, fill: "forwards" }); // Slower duration for "floating" feel
            }
        });

        // Add hover effect for links and buttons
        const hoverables = document.querySelectorAll('a, button, .btn, .theme-toggle, .project-card, .service-card');

        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });

        // Click animation
        window.addEventListener('mousedown', () => document.body.classList.add('clicking'));
        window.addEventListener('mouseup', () => document.body.classList.remove('clicking'));
    }

    // ------------------------------------------------------------------
    // 7. Interactive Grid Background (Water Ripple Effect)
    // ------------------------------------------------------------------
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        // Configuration
        const spacing = 40; // Spacing between squares
        const baseSize = 4; // Size of squares
        const mouseRadius = 200; // Interaction radius
        const repulsionStrength = 10; // Strength of repulsion
        const springFactor = 0.1; // Speed of return to original position
        const friction = 0.90; // Damping

        let mouse = { x: -1000, y: -1000 };

        class Particle {
            constructor(x, y) {
                this.ox = x; // Original X
                this.oy = y; // Original Y
                this.x = x;
                this.y = y;
                this.vx = 0; // Velocity X
                this.vy = 0; // Velocity Y
                // Store randomize alpha instead of full color string
                this.alpha = Math.random() * 0.3 + 0.1;
            }

            update() {
                // Calculate distance from mouse
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Repulsion Force
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let force = (mouseRadius - distance) / mouseRadius;

                if (force < 0) force = 0;

                // If mouse is close, push away (inverted logic for "moving away")
                // Actually, to move AWAY from mouse:
                // Vector from Mouse to Particle is (this.x - mouse.x).
                // Existing dx is (mouse.x - this.x).
                // So if we subtract dx * force, we move towards.
                // If we subtract (forceDirectionX * force), we move away if vector is right.

                // Let's stick to simple physics:
                if (distance < mouseRadius) {
                    const angle = Math.atan2(dy, dx);
                    // Push away
                    this.vx -= Math.cos(angle) * force * 2;
                    this.vy -= Math.sin(angle) * force * 2;
                }

                // Spring back logic
                const dxHome = this.ox - this.x;
                const dyHome = this.oy - this.y;

                this.vx += dxHome * springFactor;
                this.vy += dyHome * springFactor;

                // Apply Friction
                this.vx *= friction;
                this.vy *= friction;

                // Update Position
                this.x += this.vx;
                this.y += this.vy;
            }

            draw(isDark) {
                if (isDark) {
                    // Dark Mode: Glowing Blue/Indigo dots (Subtle)
                    ctx.fillStyle = `rgba(99, 102, 241, ${this.alpha * 0.5})`;
                } else {
                    // Light Mode: Grey/Slate dots
                    ctx.fillStyle = `rgba(148, 163, 184, ${this.alpha})`;
                }
                ctx.fillRect(this.x, this.y, baseSize, baseSize);
            }
        }

        function init() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            particles = [];

            for (let x = 0; x < width; x += spacing) {
                for (let y = 0; y < height; y += spacing) {
                    particles.push(new Particle(x, y));
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            // Check theme
            const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

            particles.forEach(p => {
                p.update();
                p.draw(isDark);
            });
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', init);
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        // Touch support for mobile interaction
        function handleTouch(e) {
            if (e.touches.length > 0) {
                mouse.x = e.touches[0].clientX;
                mouse.y = e.touches[0].clientY;
            }
        }
        window.addEventListener('touchstart', handleTouch, { passive: true });
        window.addEventListener('touchmove', handleTouch, { passive: true });

        init();
        animate();
    }
});
