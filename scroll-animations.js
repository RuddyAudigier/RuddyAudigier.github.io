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

        // 1. Navbar Shrink (Always active)
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // 2. Hero Animations - Only on Desktop (> 768px)
        if (window.innerWidth > 768) {
            // A. Project Hero: Parallax Scale Down
            if (projectHero) {
                const progress = scrollY;
                const scale = Math.max(0.8, 1 - (progress * 0.0002));
                const opacity = Math.max(0, 1 - (progress * 0.0015));
                projectHero.style.transform = `scale(${scale})`;
                projectHero.style.opacity = opacity;
            }

            // B. Index Hero: Visual Scale Shrink
            if (indexHero) {
                const limit = 400;
                const progress = Math.min(scrollY / limit, 1);
                const scale = 1 - (progress * 0.1);
                const opacity = 1 - (progress * 0.5);
                indexHero.style.transform = `scale(${scale})`;
                indexHero.style.opacity = opacity;
            }
        } else {
            // Reset styles on mobile
            if (projectHero) {
                projectHero.style.transform = 'none';
                projectHero.style.opacity = 1;
            }
            if (indexHero) {
                indexHero.style.transform = 'none';
                indexHero.style.opacity = 1;
            }
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    // ========================================
    // HERO SCROLL SNAP (Cover Page Effect)
    // ========================================

    let isSnapping = false;

    // Apply scroll snap to both project hero and index hero (Desktop Only)
    if ((projectHero || indexHero) && window.innerWidth > 900) {
        window.addEventListener('wheel', (e) => {
            // Trigger with minimal scroll down (threshold reduced to 5)
            if (window.scrollY < 50 && e.deltaY > 5 && !isSnapping) {
                e.preventDefault();
                isSnapping = true;

                // Different targets for index vs project pages
                let targetScroll;
                if (indexHero) {
                    // For index, scroll to #about section
                    const aboutSection = document.querySelector('#about');
                    if (aboutSection) {
                        aboutSection.scrollIntoView({ behavior: 'smooth' });
                        isSnapping = false;
                        return;
                    }
                } else {
                    // For project pages, scroll 80% of viewport height (not full height)
                    targetScroll = window.innerHeight * 0.8;
                }

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
