/* ═══════════════════════════════════════════════════════════════
   APEX Financial Platforms - Main JavaScript
   Peak Financial Technology
   ═══════════════════════════════════════════════════════════════ */

(function() {
    'use strict';

    /* ═══════════════════════════════════════════════════════════════
       PRELOADER
       ═══════════════════════════════════════════════════════════════ */
    const preloader = document.getElementById('preloader');

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.style.overflow = 'auto';
            initAnimations();
        }, 1500);
    });

    /* ═══════════════════════════════════════════════════════════════
       PARTICLES BACKGROUND
       ═══════════════════════════════════════════════════════════════ */
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticles() {
        particles = [];
        const numberOfParticles = Math.floor((canvas.width * canvas.height) / 15000);

        for (let i = 0; i < numberOfParticles; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Wrap around edges
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;

            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 102, 255, ${particle.opacity})`;
            ctx.fill();

            // Draw connections
            particles.slice(index + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = `rgba(0, 102, 255, ${0.1 * (1 - distance / 100)})`;
                    ctx.stroke();
                }
            });
        });

        animationFrameId = requestAnimationFrame(drawParticles);
    }

    function initParticles() {
        resizeCanvas();
        createParticles();
        drawParticles();
    }

    window.addEventListener('resize', () => {
        cancelAnimationFrame(animationFrameId);
        resizeCanvas();
        createParticles();
        drawParticles();
    });

    initParticles();

    /* ═══════════════════════════════════════════════════════════════
       NAVIGATION
       ═══════════════════════════════════════════════════════════════ */
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ═══════════════════════════════════════════════════════════════
       SCROLL ANIMATIONS
       ═══════════════════════════════════════════════════════════════ */
    function initAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    /* ═══════════════════════════════════════════════════════════════
       COUNTER ANIMATION
       ═══════════════════════════════════════════════════════════════ */
    function animateCounter(element) {
        const target = parseFloat(element.dataset.target);
        const decimals = parseInt(element.dataset.decimals) || 0;
        const prefix = element.dataset.prefix || '';
        const suffix = element.dataset.suffix || '';
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out cubic)
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            const current = target * easeProgress;

            if (decimals > 0) {
                element.textContent = prefix + current.toFixed(decimals) + suffix;
            } else {
                element.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // Observe counter elements
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-target]').forEach(counter => {
        counterObserver.observe(counter);
    });

    /* ═══════════════════════════════════════════════════════════════
       PLATFORM CARDS 3D TILT EFFECT
       ═══════════════════════════════════════════════════════════════ */
    const platformCards = document.querySelectorAll('.platform-card');

    platformCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        });
    });

    /* ═══════════════════════════════════════════════════════════════
       EMAIL COPY FUNCTIONALITY
       ═══════════════════════════════════════════════════════════════ */
    const emailCopy = document.getElementById('email-copy');

    if (emailCopy) {
        emailCopy.addEventListener('click', async (e) => {
            e.preventDefault();

            const email = 'rafael@ffollowme.com';

            try {
                await navigator.clipboard.writeText(email);

                // Visual feedback
                const originalHTML = emailCopy.innerHTML;
                emailCopy.innerHTML = `
                    <span style="color: #10B981;">Copied!</span>
                    <svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                `;

                setTimeout(() => {
                    emailCopy.innerHTML = originalHTML;
                }, 2000);
            } catch (err) {
                // Fallback - open mail client
                window.location.href = `mailto:${email}`;
            }
        });
    }

    /* ═══════════════════════════════════════════════════════════════
       PARALLAX EFFECT ON HERO
       ═══════════════════════════════════════════════════════════════ */
    const heroBg = document.querySelector('.hero-bg');
    const heroContent = document.querySelector('.hero-content');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroHeight = document.querySelector('.hero').offsetHeight;

        if (scrolled < heroHeight) {
            if (heroBg) {
                heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
            if (heroContent) {
                heroContent.style.transform = `translateY(${scrolled * 0.1}px)`;
                heroContent.style.opacity = 1 - (scrolled / heroHeight) * 0.5;
            }
        }
    });

    /* ═══════════════════════════════════════════════════════════════
       MOUSE FOLLOW EFFECT ON HERO (Subtle)
       ═══════════════════════════════════════════════════════════════ */
    const hero = document.querySelector('.hero');

    if (hero && window.innerWidth > 768) {
        hero.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { width, height } = hero.getBoundingClientRect();

            const x = (clientX / width - 0.5) * 20;
            const y = (clientY / height - 0.5) * 20;

            const heroTitle = document.querySelector('.hero-title');
            if (heroTitle) {
                heroTitle.style.transform = `translate(${x}px, ${y}px)`;
            }
        });

        hero.addEventListener('mouseleave', () => {
            const heroTitle = document.querySelector('.hero-title');
            if (heroTitle) {
                heroTitle.style.transform = 'translate(0, 0)';
            }
        });
    }

    /* ═══════════════════════════════════════════════════════════════
       ACTIVE NAV LINK ON SCROLL
       ═══════════════════════════════════════════════════════════════ */
    const sections = document.querySelectorAll('section[id]');

    function highlightNavLink() {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);

    /* ═══════════════════════════════════════════════════════════════
       LAZY LOADING IMAGES (if any)
       ═══════════════════════════════════════════════════════════════ */
    const lazyImages = document.querySelectorAll('img[data-src]');

    if (lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }

    /* ═══════════════════════════════════════════════════════════════
       KEYBOARD NAVIGATION
       ═══════════════════════════════════════════════════════════════ */
    document.addEventListener('keydown', (e) => {
        // Close mobile menu on Escape
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    /* ═══════════════════════════════════════════════════════════════
       PERFORMANCE OPTIMIZATION
       ═══════════════════════════════════════════════════════════════ */
    // Throttle function for scroll events
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Optimize scroll listeners
    const throttledHighlight = throttle(highlightNavLink, 100);
    window.removeEventListener('scroll', highlightNavLink);
    window.addEventListener('scroll', throttledHighlight);

    /* ═══════════════════════════════════════════════════════════════
       CONSOLE BRANDING
       ═══════════════════════════════════════════════════════════════ */
    console.log(
        '%c▲ APEX Financial Platforms',
        'color: #0066FF; font-size: 24px; font-weight: bold;'
    );
    console.log(
        '%cPeak Financial Technology',
        'color: #7C3AED; font-size: 14px;'
    );
    console.log(
        '%c© 2026 FFOLLOWME OÜ. All Rights Reserved.',
        'color: #6B7280; font-size: 12px;'
    );

})();
