/**
 * Main JavaScript File
 * Handles Theme Toggling, Animations, and Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------------------------------
    // 0. Initial Setup & Scroll Reset
    // ------------------------------------------------------------------
    // Force scroll to top on refresh
    window.scrollTo(0, 0);
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

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
    // 2. Custom Cursor
    // ------------------------------------------------------------------
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const cursorGlow = document.querySelector('.cursor-bg-glow');

    // Only activate custom cursor on non-touch devices
    if (window.matchMedia("(pointer: fine)").matches && cursorDot) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Animate outline with delay
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });

            cursorGlow.style.left = `${posX}px`;
            cursorGlow.style.top = `${posY}px`;
        });

        // Click Effects
        window.addEventListener('mousedown', () => document.body.classList.add('clicking'));
        window.addEventListener('mouseup', () => document.body.classList.remove('clicking'));

        // Hover Effects
        const interactiveElements = document.querySelectorAll('a, button, .btn, input, textarea, .theme-toggle, .mobile-menu-btn');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });
    }

    // ------------------------------------------------------------------
    // 3. Typing Animation (All Text)
    // ------------------------------------------------------------------

    // Select all relevant text elements
    const allTextElements = document.querySelectorAll(
        'h1, h2, h3, h4, h5, h6, p, li, .tag, .btn, .project-link, span.greeting, span.timeline-date, span.timeline-company'
    );

    // Helper: Wrap text in spans
    function prepareElement(element) {
        if (element.classList.contains('typed-prepared')) return;

        // Skip elements with complex structure if needed, but try to handle text nodes
        const nodes = Array.from(element.childNodes);
        let hasText = false;

        nodes.forEach(node => {
            if (node.nodeType === 3) { // Text Node
                const text = node.nodeValue;
                if (!text.match(/\S/)) return;

                hasText = true;
                const fragment = document.createDocumentFragment();
                const chars = text.split('');

                chars.forEach(char => {
                    const span = document.createElement('span');
                    span.textContent = char;
                    span.style.opacity = '0'; // Start hidden
                    span.className = 'char-reveal';
                    fragment.appendChild(span);
                });

                node.parentNode.replaceChild(fragment, node);
            }
        });

        if (hasText || element.querySelector('.char-reveal')) {
            element.classList.add('typed-prepared');
            element.style.opacity = '1';
        }
    }

    // Prepare all elements
    allTextElements.forEach(prepareElement);

    // Observe and Trigger Typing
    const typeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                if (!el.classList.contains('typed-done')) {
                    startTyping(el);
                    observer.unobserve(el);
                }
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    // Only observe prepared elements
    document.querySelectorAll('.typed-prepared').forEach(el => typeObserver.observe(el));

    function startTyping(element) {
        element.classList.add('typing-cursor');
        const chars = element.querySelectorAll('.char-reveal');

        if (chars.length === 0) {
            finishTyping(element);
            return;
        }

        let delay = 20;
        if (chars.length > 50) delay = 10;
        if (chars.length > 100) delay = 3;

        let index = 0;
        function typeNext() {
            if (index >= chars.length) {
                finishTyping(element);
                return;
            }
            chars[index].style.opacity = '1';
            index++;

            if (index % 3 === 0) {
                setTimeout(typeNext, delay + Math.random() * 15);
            } else {
                setTimeout(typeNext, delay);
            }
        }
        typeNext();
    }

    function finishTyping(element) {
        element.classList.remove('typing-cursor');
        element.classList.add('typed-done');
    }

    // ------------------------------------------------------------------
    // 4. Fade Animations
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

    document.querySelectorAll('.mobile-link').forEach(link => link.addEventListener('click', toggleMenu));

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        });
    });



    // ------------------------------------------------------------------
    // 7. Interactive Magnetic Vortex Background
    // ------------------------------------------------------------------
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let mouse = { x: null, y: null, radius: 250 };
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;

                // Physics properties
                this.density = (Math.random() * 20) + 1;
                this.vx = (Math.random() - 0.5) * 1.5;
                this.vy = (Math.random() - 0.5) * 1.5;
                this.friction = 0.98;
            }

            draw() {
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)';

                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }

            update() {
                // 1. Magnetic Attraction & Vortex
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouse.radius) {
                        // Attraction force
                        const force = (mouse.radius - distance) / mouse.radius;
                        const directionX = (dx / distance) * force * 1.5;
                        const directionY = (dy / distance) * force * 1.5;

                        this.vx += directionX;
                        this.vy += directionY;

                        // Vortex Logic (Centripetal Swirl)
                        const swirlStrength = force * 0.8;
                        this.vx += (dy / distance) * swirlStrength;
                        this.vy -= (dx / distance) * swirlStrength;
                    }
                }

                this.vx *= this.friction;
                this.vy *= this.friction;

                // Subtle floaty drift
                this.vx += (Math.random() - 0.5) * 0.05;
                this.vy += (Math.random() - 0.5) * 0.05;

                this.x += this.vx;
                this.y += this.vy;

                // Wrap
                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }
        }

        function init() {
            particlesArray = [];
            let numberOfParticles = 800; // Slightly lower for constellation performance
            if (window.innerWidth > 1000) numberOfParticles = 1200;

            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        function connect() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const lineColor = isDark ? '255, 255, 255' : '0, 0, 0';

            // Connect Mouse to particles
            if (mouse.x != null) {
                for (let a = 0; a < particlesArray.length; a++) {
                    let dx = mouse.x - particlesArray[a].x;
                    let dy = mouse.y - particlesArray[a].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        let opacity = 1 - (distance / 150);
                        ctx.strokeStyle = `rgba(${lineColor}, ${opacity * 0.2})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(mouse.x, mouse.y);
                        ctx.lineTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            connect();
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        });

        init();
        animate();
    }

});
