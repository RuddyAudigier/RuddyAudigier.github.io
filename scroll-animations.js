/**
 * Scroll Animations - Portfolio Ruddy Audigier
 * Handles navbar shrink and hero shrink animations
 */

(function () {
    'use strict';

    // ========================================
    // NAVBAR SHRINK ON SCROLL
    // ========================================

    const header = document.querySelector('.site-header');
    const projectHero = document.querySelector('.project-hero');
    const indexHero = document.querySelector('.hero');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateAnimations() {
        const scrollY = window.scrollY;

        // 1. Navbar Shrink
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // 2. Hero Animations

        // A. Project Hero: Parallax Scale Down (Inception Effect)
        if (projectHero) {
            // Since hero is sticky, we just scale it down as content scrolls over it
            const progress = scrollY;

            // Scale down slowly (1 -> 0.8 at 1000px scroll)
            const scale = Math.max(0.8, 1 - (progress * 0.0002));

            // Fade out slowly (1 -> 0 at 800px scroll)
            const opacity = Math.max(0, 1 - (progress * 0.0015));

            projectHero.style.transform = `scale(${scale})`;
            projectHero.style.opacity = opacity;
        }

        // B. Index Hero: Visual Scale Shrink (Parallax)
        if (indexHero) {
            const limit = 400;
            const progress = Math.min(scrollY / limit, 1);

            // Scale down slightly (1 -> 0.9)
            const scale = 1 - (progress * 0.1);

            // Fade out slightly (1 -> 0.5)
            const opacity = 1 - (progress * 0.5);

            indexHero.style.transform = `scale(${scale})`;
            indexHero.style.opacity = opacity;
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    // ========================================
    // HERO SCROLL SNAP (Cover Page Effect)
    // ========================================

    let isSnapping = false;

    if (projectHero) {
        window.addEventListener('wheel', (e) => {
            // Trigger with minimal scroll down (threshold reduced to 5)
            if (window.scrollY < 50 && e.deltaY > 5 && !isSnapping) {
                e.preventDefault();
                isSnapping = true;

                // Target: Scroll until content (which starts at 100vh) is at top
                const targetScroll = window.innerHeight;

                window.scrollTo({
                    top: targetScroll,
                    behavior: 'smooth'
                });

                // Reset flag after animation
                setTimeout(() => {
                    isSnapping = false;
                }, 1000);
            }
        }, { passive: false });
    }

    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateAnimations);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick, { passive: true });

    // ========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Don't prevent default for # only or javascript:void(0)
            if (href === '#' || href === '#!' || href.startsWith('javascript:')) {
                return;
            }

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

})();
