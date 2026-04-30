/* ============================================
   GIVE TO GAIN — KUHeS CHURCH 2025
   Premium Interactions & Particle System
   Complete JavaScript File
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initRevealAnimations();
    initNavScroll();
    initAmountInteraction();
    initCopyButtons();
    initSmoothScroll();
    initHeroParallax();
    initLogoFlameEffect();
});

/* ============================================
   PARTICLE SYSTEM (EMBER EFFECT)
   ============================================ */
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let mouseX = -1000;
    let mouseY = -1000;
    let isRunning = true;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', () => {
        resize();
        // Adjust particle count on resize for performance
        const newCount = getParticleCount();
        while (particles.length < newCount) {
            particles.push(new Particle());
        }
        while (particles.length > newCount) {
            particles.pop();
        }
    });

    function getParticleCount() {
        const width = window.innerWidth;
        if (width < 480) return 30;
        if (width < 768) return 50;
        if (width < 1200) return 70;
        return 90;
    }

    class Particle {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * canvas.width;
            this.y = initial 
                ? Math.random() * canvas.height 
                : canvas.height + Math.random() * 200;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedY = -(Math.random() * 0.6 + 0.15);
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.life = 1;
            this.decay = Math.random() * 0.0015 + 0.0005;
            this.hue = Math.random() > 0.5 ? '249, 115, 22' : '250, 204, 21';
            this.wobble = Math.random() * 0.02;
            this.wobbleSpeed = Math.random() * 0.02 + 0.01;
            this.wobbleOffset = Math.random() * Math.PI * 2;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(Date.now() * this.wobbleSpeed + this.wobbleOffset) * this.wobble;

            // Gentle drift toward mouse
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200) {
                const force = (200 - dist) / 200;
                this.x += dx * force * 0.001;
                this.y += dy * force * 0.001;
            }

            this.life -= this.decay;

            if (this.life <= 0 || this.y < -50 || this.x < -50 || this.x > canvas.width + 50) {
                this.reset();
            }
        }

        draw(ctx) {
            const alpha = this.opacity * this.life;
            
            // Main particle
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.hue}, ${alpha})`;
            ctx.fill();

            // Subtle glow for larger particles
            if (this.size > 1.5) {
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, this.size * 0.5,
                    this.x, this.y, this.size * 3
                );
                gradient.addColorStop(0, `rgba(${this.hue}, ${alpha * 0.3})`);
                gradient.addColorStop(1, `rgba(${this.hue}, 0)`);
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            }
        }
    }

    // Create initial particles
    const particleCount = getParticleCount();
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
        }
    }, { passive: true });

    // Reset mouse position when mouse leaves
    document.addEventListener('mouseleave', () => {
        mouseX = -1000;
        mouseY = -1000;
    });

    function animate(timestamp) {
        if (!isRunning) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw(ctx);
        });
        
        animationId = requestAnimationFrame(animate);
    }

    animationId = requestAnimationFrame(animate);

    // Handle visibility change to save resources
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            isRunning = false;
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        } else {
            isRunning = true;
            if (!animationId) {
                animationId = requestAnimationFrame(animate);
            }
            // Reset mouse position when tab becomes visible again
            mouseX = -1000;
            mouseY = -1000;
        }
    });

    // Cleanup function (call if needed for SPA-style navigation)
    return () => {
        isRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        particles = [];
    };
}

/* ============================================
   REVEAL ON SCROLL (Intersection Observer)
   ============================================ */
function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Handle nested reveal elements
                const children = entry.target.querySelectorAll('.reveal-child');
                if (children.length) {
                    children.forEach((child, i) => {
                        child.style.transitionDelay = `${i * 0.1}s`;
                        child.classList.add('visible');
                    });
                }
                
                // Unobserve after animation triggers
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    reveals.forEach(el => observer.observe(el));
}

/* ============================================
   NAVIGATION SCROLL EFFECT
   ============================================ */
function initNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    let lastScrollY = 0;
    let ticking = false;

    function updateNav() {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Hide/show nav on scroll direction (optional premium touch)
        if (scrollY > 300) {
            if (scrollY > lastScrollY) {
                // Scrolling down
                nav.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                nav.style.transform = 'translateY(0)';
            }
        } else {
            nav.style.transform = 'translateY(0)';
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const links = document.querySelector('.nav-links');
    
    if (!toggle || !links) return;
    
    toggle.addEventListener('click', () => {
        links.classList.toggle('active');
        const spans = toggle.querySelectorAll('span');
        if (links.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Close on link click
    links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            links.classList.remove('active');
        });
    });
}

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNav);
            ticking = true;
        }
    }, { passive: true });
}

/* ============================================
   AMOUNT INTERACTION (THE HUMBLE ASK)
   ============================================ */
function initAmountInteraction() {
    const amountBtns = document.querySelectorAll('.amount-btn');
    const customInput = document.getElementById('customAmount');
    const confirmationDiv = document.getElementById('amountConfirmation');
    
    if (!amountBtns.length && !customInput) return;

    function showConfirmation(amount) {
        if (!confirmationDiv) return;
        
        const numAmount = parseInt(amount);
        if (isNaN(numAmount) || numAmount <= 0) return;

        const formatted = numAmount.toLocaleString('en-US');
        
        // Build a personalized message based on amount
        let message = '';
        if (numAmount <= 2000) {
            message = `Beautiful. <strong>K${formatted}</strong> — every seed counts. That's your gift. Send it through any channel below, and watch what God does with it.`;
        } else if (numAmount <= 10000) {
            message = `Wonderful. <strong>K${formatted}</strong> — that's a generous seed. Send it through any channel below, and watch what God does with it.`;
        } else if (numAmount <= 50000) {
            message = `Amazing. <strong>K${formatted}</strong> — that's a multiplier. Send it through any channel below, and watch what God does with it.`;
        } else {
            message = `Incredible. <strong>K${formatted}</strong> — that shifts what's possible. Send it through any channel below, and watch what God does with it.`;
        }

        confirmationDiv.innerHTML = `<div class="confirmation-message">${message}</div>`;
        
        // Scroll confirmation into view with offset
        setTimeout(() => {
            const yOffset = -80;
            const y = confirmationDiv.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }, 150);

        // Track interaction (optional analytics — remove if not needed)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'amount_selected', {
                event_category: 'donation',
                event_label: 'amount_interaction',
                value: numAmount
            });
        }
    }

    // Preset buttons
    amountBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove selected from all buttons
            amountBtns.forEach(b => b.classList.remove('selected'));
            // Add selected to clicked button
            btn.classList.add('selected');
            // Clear custom input
            if (customInput) customInput.value = '';
            // Show confirmation
            const amount = btn.getAttribute('data-amount');
            if (amount) showConfirmation(amount);
            
            // Haptic feedback on mobile (subtle)
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        });
    });

    // Custom input handling
    if (customInput) {
        // Debounce function for input
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        const debouncedShowConfirmation = debounce((value) => {
            if (value && parseInt(value) > 0) {
                showConfirmation(value);
            }
        }, 800);

        customInput.addEventListener('input', () => {
            // Remove selected from preset buttons when typing
            amountBtns.forEach(b => b.classList.remove('selected'));
        });

        customInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const amount = customInput.value;
                if (amount && parseInt(amount) > 0) {
                    showConfirmation(amount);
                    customInput.blur();
                }
            }
            
            // Allow only numbers, backspace, delete, arrows, tab
            const allowedKeys = [
                'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 
                'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End'
            ];
            if (!/^[0-9]$/.test(e.key) && !allowedKeys.includes(e.key)) {
                e.preventDefault();
            }
        });

        customInput.addEventListener('blur', () => {
            const amount = customInput.value;
            if (amount && parseInt(amount) > 0) {
                showConfirmation(amount);
            }
        });

        // Prevent non-numeric input
        customInput.addEventListener('paste', (e) => {
            const pastedData = e.clipboardData?.getData('text') || '';
            if (!/^\d+$/.test(pastedData)) {
                e.preventDefault();
            }
        });
    }
}

/* ============================================
   COPY BUTTONS WITH FEEDBACK
   ============================================ */
function initCopyButtons() {
    const copyBtns = document.querySelectorAll('.copy-btn');
    const toast = document.getElementById('toast');
    
    if (!copyBtns.length) return;

    let toastTimeout;
    let activeToast = false;

    function showToast(message = 'Copied! Go with God.') {
        if (!toast) return;

        // Update message
        const msgSpan = toast.querySelector('.toast-message');
        if (msgSpan) msgSpan.textContent = message;

        // Clear existing timeout
        if (toastTimeout) clearTimeout(toastTimeout);

        // Show toast
        toast.classList.add('show');
        activeToast = true;

        // Hide after delay
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
            activeToast = false;
        }, 2500);
    }

    copyBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const textToCopy = btn.getAttribute('data-copy');
            if (!textToCopy) return;

            let copySuccess = false;

            // Try modern clipboard API
            try {
                await navigator.clipboard.writeText(textToCopy);
                copySuccess = true;
            } catch (err) {
                // Fallback for older browsers or insecure contexts
                try {
                    const textarea = document.createElement('textarea');
                    textarea.value = textToCopy;
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = '0';
                    textarea.style.pointerEvents = 'none';
                    document.body.appendChild(textarea);
                    textarea.select();
                    textarea.setSelectionRange(0, 99999);
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    copySuccess = true;
                } catch (fallbackErr) {
                    console.error('Copy failed:', fallbackErr);
                    showToast('Please copy the number manually');
                    return;
                }
            }

            if (copySuccess) {
                // Store original content
                const originalHTML = btn.innerHTML;

                // Update button to success state
                btn.classList.add('copied');
                btn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span>Copied!</span>
                `;

                // Reset after delay
                setTimeout(() => {
                    btn.classList.remove('copied');
                    btn.innerHTML = originalHTML;
                }, 2000);

                // Show toast
                showToast();

                // Haptic feedback on mobile
                if (navigator.vibrate) {
                    navigator.vibrate([10, 30, 10]);
                }

                // Track (optional)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'copy_account', {
                        event_category: 'donation',
                        event_label: textToCopy
                    });
                }

                console.log(`Give to Gain: Copied account number`);
            }
        });
    });
}

/* ============================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#" or empty
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            e.preventDefault();

            const nav = document.querySelector('.nav');
            const navHeight = nav ? nav.offsetHeight : 0;
            const extraOffset = 20; // breathing room

            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - extraOffset;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Update URL hash without jump (optional)
            if (history.pushState) {
                history.pushState(null, null, targetId);
            }
        });
    });
}

/* ============================================
   HERO PARALLAX EFFECT
   ============================================ */
function initHeroParallax() {
    const heroContent = document.querySelector('.hero-content');
    const heroSection = document.querySelector('.hero');
    
    if (!heroContent || !heroSection) return;

    let ticking = false;

    function updateParallax() {
        const scrollY = window.scrollY;
        const heroHeight = heroSection.offsetHeight;
        
        if (scrollY <= heroHeight) {
            const progress = scrollY / heroHeight;
            const opacity = 1 - progress * 1.2;
            const translateY = scrollY * 0.3;
            const scale = 1 - progress * 0.05;

            heroContent.style.opacity = Math.max(0, opacity);
            heroContent.style.transform = `translateY(${translateY}px) scale(${Math.max(0.95, scale)})`;
            heroContent.style.pointerEvents = scrollY > heroHeight * 0.5 ? 'none' : 'auto';
        }
        
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
}

/* ============================================
   LOGO FLAME EFFECT (SUBTLE PULSE)
   ============================================ */
function initLogoFlameEffect() {
    const logoImg = document.querySelector('.nav-logo .logo-img');
    if (!logoImg) return;

    // Add subtle breathing effect on hover
    logoImg.addEventListener('mouseenter', () => {
        logoImg.style.transition = 'filter 0.3s ease, transform 0.3s ease';
        logoImg.style.filter = 'drop-shadow(0 0 20px rgba(249, 115, 22, 0.6))';
        logoImg.style.transform = 'scale(1.05)';
    });

    logoImg.addEventListener('mouseleave', () => {
        logoImg.style.filter = 'drop-shadow(0 0 12px rgba(249, 115, 22, 0.3))';
        logoImg.style.transform = 'scale(1)';
    });
}

/* ============================================
   PERFORMANCE UTILITIES
   ============================================ */

// Debounce utility (available globally)
function debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
        const context = this;
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Throttle utility (available globally)
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Log performance in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
                console.log(`LCP: ${entry.startTime.toFixed(0)}ms`);
            }
        }
    });
    observer.observe({ type: 'largest-contentful-paint', buffered: true });

    window.addEventListener('load', () => {
        const timing = performance.getEntriesByType('navigation')[0];
        if (timing) {
            console.log(`Page fully loaded in: ${timing.loadEventEnd.toFixed(0)}ms`);
        }
    });
}

/* ============================================
   KEYBOARD ACCESSIBILITY
   ============================================ */
document.addEventListener('keydown', (e) => {
    // Escape key clears amount confirmation
    if (e.key === 'Escape') {
        const confirmationDiv = document.getElementById('amountConfirmation');
        if (confirmationDiv) {
            confirmationDiv.innerHTML = '';
        }
        const amountBtns = document.querySelectorAll('.amount-btn');
        amountBtns.forEach(b => b.classList.remove('selected'));
        const customInput = document.getElementById('customAmount');
        if (customInput) customInput.value = '';
    }
});

/* ============================================
   SERVICE WORKER REGISTRATION (OPTIONAL PWA)
   Uncomment if you want offline caching
   ============================================ */
// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('/sw.js').then(registration => {
//             console.log('SW registered:', registration.scope);
//         }).catch(err => {
//             console.log('SW registration failed:', err);
//         });
//     });
// }

console.log('%c Give to Gain %c KUHeS Church 2025 %c 🕊️',
    'background: #F97316; color: #000; padding: 4px 8px; font-weight: bold; border-radius: 4px 0 0 4px;',
    'background: #0f0f14; color: #fff; padding: 4px 8px; border-radius: 0 4px 4px 0;',
    'font-size: 16px;'
);
console.log('%cSite crafted as worship. Soli Deo gloria.', 'color: #b0b0b8; font-style: italic;');