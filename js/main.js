/* ============================================
   GIVE TO GAIN — KUHeS CHURCH 2025
   Premium Interactions v2
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initRevealAnimations();
    initNavScroll();
    initMobileMenu();
    initBackToTop();
    initScrollDownButton();
    initAmountInteraction();
    initShareButtons();
    initCopyButtons();
    initSmoothScroll();
    initHeroParallax();
    initHeroBackground();
    logBrand();
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
        adjustParticleCount();
    });

    function getParticleCount() {
        const width = window.innerWidth;
        if (width < 480) return 25;
        if (width < 768) return 40;
        if (width < 1200) return 60;
        return 80;
    }

    function adjustParticleCount() {
        const target = getParticleCount();
        while (particles.length < target) {
            particles.push(new Particle());
        }
        while (particles.length > target) {
            particles.pop();
        }
    }

    class Particle {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * canvas.width;
            this.y = initial ? Math.random() * canvas.height : canvas.height + Math.random() * 200;
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
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.hue}, ${alpha})`;
            ctx.fill();

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

    const particleCount = getParticleCount();
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

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

    document.addEventListener('mouseleave', () => {
        mouseX = -1000;
        mouseY = -1000;
    });

    function animate() {
        if (!isRunning) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw(ctx);
        });
        animationId = requestAnimationFrame(animate);
    }

    animationId = requestAnimationFrame(animate);

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
            mouseX = -1000;
            mouseY = -1000;
        }
    });
}

/* ============================================
   REVEAL ON SCROLL
   ============================================ */
function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

/* ============================================
   NAVIGATION SCROLL EFFECT
   ============================================ */
function initNavScroll() {
    const nav = document.getElementById('navbar');
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

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNav);
            ticking = true;
        }
    }, { passive: true });
}

/* ============================================
   MOBILE MENU (HAMBURGER)
   ============================================ */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburgerBtn');
    const navLinks = document.getElementById('navLinks');
    const overlay = document.getElementById('mobileMenuOverlay');
    const links = navLinks ? navLinks.querySelectorAll('a') : [];

    if (!hamburger || !navLinks) return;

    function openMenu() {
        hamburger.classList.add('active');
        navLinks.classList.add('active');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close on overlay click
    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }

    // Close on link click
    links.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });

    // Close on resize if desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });
}

/* ============================================
   BACK TO TOP BUTTON
   ============================================ */
function initBackToTop() {
    const btn = document.getElementById('backToTopBtn');
    if (!btn) return;

    let ticking = false;

    function updateVisibility() {
        if (window.scrollY > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateVisibility);
            ticking = true;
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ============================================
   SCROLL DOWN BUTTON (HERO)
   ============================================ */
function initScrollDownButton() {
    const btn = document.getElementById('scrollDownBtn');
    if (!btn) return;

    let ticking = false;

    function updateVisibility() {
        if (window.scrollY > 200) {
            btn.classList.add('hidden');
        } else {
            btn.classList.remove('hidden');
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateVisibility);
            ticking = true;
        }
    }, { passive: true });

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector('#need');
        if (target) {
            const navHeight = document.getElementById('navbar')?.offsetHeight || 64;
            const y = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    });
}

/* ============================================
   AMOUNT INTERACTION
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
        let message = '';

        if (numAmount <= 2000) {
            message = `Beautiful. <strong>K${formatted}</strong> — every seed counts. Send it through any channel below, and watch what God does with it.`;
        } else if (numAmount <= 10000) {
            message = `Wonderful. <strong>K${formatted}</strong> — that's a generous seed. Send it through any channel below, and watch what God does with it.`;
        } else if (numAmount <= 50000) {
            message = `Amazing. <strong>K${formatted}</strong> — that's a multiplier. Send it through any channel below, and watch what God does with it.`;
        } else {
            message = `Incredible. <strong>K${formatted}</strong> — that shifts what's possible. Send it through any channel below, and watch what God does with it.`;
        }

        confirmationDiv.innerHTML = `<div class="confirmation-message">${message}</div>`;

        setTimeout(() => {
            const yOffset = -80;
            const y = confirmationDiv.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }, 150);
    }

    amountBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            amountBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            if (customInput) customInput.value = '';
            const amount = btn.getAttribute('data-amount');
            if (amount) showConfirmation(amount);
            if (navigator.vibrate) navigator.vibrate(10);
        });
    });

    if (customInput) {
        let debounceTimer;

        customInput.addEventListener('input', () => {
            amountBtns.forEach(b => b.classList.remove('selected'));
        });

        customInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const amount = customInput.value;
                if (amount && parseInt(amount) > 0) {
                    clearTimeout(debounceTimer);
                    showConfirmation(amount);
                    customInput.blur();
                }
            }
        });

        customInput.addEventListener('blur', () => {
            clearTimeout(debounceTimer);
            const amount = customInput.value;
            if (amount && parseInt(amount) > 0) {
                showConfirmation(amount);
            }
        });

        // Prevent non-numeric paste
        customInput.addEventListener('paste', (e) => {
            const pastedData = e.clipboardData?.getData('text') || '';
            if (!/^\d+$/.test(pastedData)) {
                e.preventDefault();
            }
        });
    }
}

/* ============================================
   COPY BUTTONS
   ============================================ */
function initCopyButtons() {
    const copyBtns = document.querySelectorAll('.copy-btn');
    const toast = document.getElementById('toast');
    if (!copyBtns.length) return;

    let toastTimeout;

    function showToast(message = 'Copied! Go with God.') {
        if (!toast) return;
        const msgSpan = toast.querySelector('.toast-message');
        if (msgSpan) msgSpan.textContent = message;
        if (toastTimeout) clearTimeout(toastTimeout);
        toast.classList.add('show');
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    copyBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const textToCopy = btn.getAttribute('data-copy');
            if (!textToCopy) return;

            let copySuccess = false;

            try {
                await navigator.clipboard.writeText(textToCopy);
                copySuccess = true;
            } catch (err) {
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
                    showToast('Please copy the number manually');
                    return;
                }
            }

            if (copySuccess) {
                const originalHTML = btn.innerHTML;
                btn.classList.add('copied');
                btn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span>Copied!</span>
                `;

                setTimeout(() => {
                    btn.classList.remove('copied');
                    btn.innerHTML = originalHTML;
                }, 2000);

                showToast();
                if (navigator.vibrate) navigator.vibrate([10, 30, 10]);
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
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            e.preventDefault();
            const navHeight = document.getElementById('navbar')?.offsetHeight || 64;
            const extraOffset = 20;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - extraOffset;

            window.scrollTo({ top: targetPosition, behavior: 'smooth' });

            if (history.pushState) {
                history.pushState(null, null, targetId);
            }
        });
    });
}

/* ============================================
   HERO PARALLAX (SMOOTH, NO JITTER)
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
            const translateY = scrollY * 0.2;
            heroContent.style.opacity = Math.max(0, opacity);
            heroContent.style.transform = `translateY(${translateY}px)`;
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
   HERO BACKGROUND IMAGE (PARALLAX FADE)
   ============================================ */
function initHeroBackground() {
    const bgImage = document.getElementById('heroBgImage');
    if (!bgImage) return;

    // Set the background image
    // Replace this URL with your actual image path
    bgImage.style.backgroundImage = `url('assets/hero-bg.jpg')`;

    // If the image doesn't exist, hide the element gracefully
    const testImg = new Image();
    testImg.onerror = () => {
        bgImage.style.display = 'none';
    };
    testImg.src = 'assets/hero-bg.jpg';

    let ticking = false;

    function updateBgParallax() {
        const scrollY = window.scrollY;
        bgImage.style.transform = `translateY(${scrollY * 0.15}px)`;
        const opacity = Math.max(0, 0.08 - scrollY / 8000);
        bgImage.style.opacity = opacity;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateBgParallax);
            ticking = true;
        }
    }, { passive: true });
}


/* ============================================
   SHARE & INVITE BUTTONS
   ============================================ */
function initShareButtons() {
    const shareBtn = document.getElementById('shareBtn');
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    const confirmation = document.getElementById('inviteConfirmation');

    const pageUrl = window.location.href;
    const shareTitle = 'Give to Gain — KUHeS Church 2025';
    const shareText = 'Help create a warm, impactful first experience for students at KUHeS. Give what lifts your heart.';

    function showConfirmation(message) {
        if (!confirmation) return;
        confirmation.textContent = message;
        confirmation.style.opacity = '1';
        setTimeout(() => {
            confirmation.style.opacity = '0';
        }, 3000);
    }

    // Native Share (works on mobile)
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: shareTitle,
                        text: shareText,
                        url: pageUrl
                    });
                    showConfirmation('Thank you for sharing! 🌟');
                } catch (err) {
                    // User cancelled — do nothing
                    if (err.name !== 'AbortError') {
                        fallbackCopy();
                    }
                }
            } else {
                fallbackCopy();
            }
        });
    }

    // Copy link button
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', fallbackCopy);
    }

    function fallbackCopy() {
        navigator.clipboard.writeText(pageUrl).then(() => {
            showConfirmation('Link copied! Share it anywhere ✨');
        }).catch(() => {
            // Final fallback
            const textarea = document.createElement('textarea');
            textarea.value = pageUrl;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showConfirmation('Link copied! Share it anywhere ✨');
        });
    }
}
/* ============================================
   KEYBOARD ACCESSIBILITY
   ============================================ */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const confirmationDiv = document.getElementById('amountConfirmation');
        if (confirmationDiv) confirmationDiv.innerHTML = '';
        const amountBtns = document.querySelectorAll('.amount-btn');
        amountBtns.forEach(b => b.classList.remove('selected'));
        const customInput = document.getElementById('customAmount');
        if (customInput) customInput.value = '';
    }
});

/* ============================================
   BRAND CONSOLE LOG
   ============================================ */
function logBrand() {
    console.log(
        '%c Give to Gain %c KUHeS Church 2025 %c 🕊️',
        'background: #F97316; color: #000; padding: 4px 8px; font-weight: bold; border-radius: 4px 0 0 4px;',
        'background: #0f0f14; color: #fff; padding: 4px 8px; border-radius: 0 4px 4px 0;',
        'font-size: 16px;'
    );
    console.log('%cSite crafted as worship. Soli Deo gloria.', 'color: #b0b0b8; font-style: italic;');
}