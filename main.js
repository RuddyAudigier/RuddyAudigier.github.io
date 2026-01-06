/**
 * Main Script - Portfolio Ruddy Audigier
 * Handles Slideshows, Lightboxes, Mobile Menu, and Modals
 */

document.addEventListener('DOMContentLoaded', () => {
    startSlideshows();
    setupLightbox();
    setupMobileMenu();
    initHeroAnimations();
    initCustomCursor();
    init3DTilt();
    initPokemonCard();
});

// ========================================
// GENERAL UI (Modals, Menus)
// ========================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.classList.add('modal-open'); // Add class for cursor fix
        setTimeout(() => {
            modal.classList.add('active');
        }, 50);
    }
}

function closeModal(event, modalId) {
    // Check if the click is on the overlay or the close button
    // Note: 'event' might be passed from an inline onclick, so we check target
    if (event.target.classList.contains('modal-overlay') || event.target.classList.contains('close-btn')) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.classList.remove('modal-open'); // Remove class
            }, 300);
        }
    }
}

// Expose globally for inline onclicks
window.openModal = openModal;
window.closeModal = closeModal;
window.toggleMenu = toggleMenu;

// ========================================
// MOBILE MENU
// ========================================
function setupMobileMenu() {
    const hamburgerBtn = document.querySelector('.hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', toggleMenu);

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('mobile-active')) {
                    toggleMenu();
                }
            });
        });
    }
}

function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    const hamburgerIcon = document.querySelector('.hamburger i');

    if (!navLinks || !hamburgerIcon) return;

    navLinks.classList.toggle('mobile-active');

    if (navLinks.classList.contains('mobile-active')) {
        hamburgerIcon.classList.remove('fa-bars');
        hamburgerIcon.classList.add('fa-times');
    } else {
        hamburgerIcon.classList.remove('fa-times');
        hamburgerIcon.classList.add('fa-bars');
    }
}

// ========================================
// SLIDESHOW LOGIC
// ========================================
function startSlideshows() {
    const cards = document.querySelectorAll('.proof-card[data-images]');

    cards.forEach(card => {
        const images = JSON.parse(card.dataset.images);
        if (images.length <= 1) return;

        let index = 0;
        const imgElement = card.querySelector('img');

        if (!imgElement) return;

        // Ensure transition property exists
        imgElement.style.transition = 'opacity 0.2s ease';

        setInterval(() => {
            index = (index + 1) % images.length;
            imgElement.style.opacity = '0.7';
            setTimeout(() => {
                imgElement.src = images[index];
                imgElement.style.opacity = '1';
            }, 200);
        }, 1500); // Change every 1.5 seconds
    });
}

// ========================================
// LIGHTBOX LOGIC
// ========================================
let currentGroup = [];
let currentCaptions = [];
let currentIndex = 0;

function setupLightbox() {
    // Attach click events to proof cards
    const cards = document.querySelectorAll('.proof-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            if (card.dataset.images && card.dataset.captions) {
                openLightboxGroup(card);
            }
        });
    });

    // Lightbox controls
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('close-lightbox')) {
                closeLightbox();
            }
        });

        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');

        if (prevBtn) prevBtn.addEventListener('click', (e) => changeLightboxImage(-1, e));
        if (nextBtn) nextBtn.addEventListener('click', (e) => changeLightboxImage(1, e));
    }

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.style.display === 'flex') {
            if (e.key === 'ArrowLeft') {
                changeLightboxImage(-1);
            } else if (e.key === 'ArrowRight') {
                changeLightboxImage(1);
            } else if (e.key === 'Escape') {
                closeLightbox();
            }
        }
    });
}

function openLightboxGroup(card) {
    currentGroup = JSON.parse(card.dataset.images);
    currentCaptions = JSON.parse(card.dataset.captions);
    currentIndex = 0;

    updateLightboxContent();
    showLightbox();
}

// Exposed globally for backward compatibility with inline onclicks
window.openLightbox = function (imageSrc, caption) {
    currentGroup = [imageSrc];
    currentCaptions = [caption];
    currentIndex = 0;

    updateLightboxContent();
    showLightbox();
}

// Exposed globally for backward compatibility
window.openLightboxGroup = function (cardId) {
    const card = document.getElementById(cardId);
    if (card) openLightboxGroup(card);
}

// Exposed globally
window.closeLightbox = closeLightbox;
window.changeLightboxImage = changeLightboxImage;

function showLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.style.display = 'flex';
        document.body.classList.add('modal-open'); // Add class for cursor fix
        setTimeout(() => {
            lightbox.classList.add('active');
        }, 50);
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        setTimeout(() => {
            lightbox.style.display = 'none';
            document.body.classList.remove('modal-open'); // Remove class
        }, 300);
    }
}

function updateLightboxContent() {
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');

    if (!lightboxImg || !lightboxCaption) return;

    // Simple fade effect
    lightboxImg.style.opacity = '0.5';
    setTimeout(() => {
        lightboxImg.src = currentGroup[currentIndex];
        lightboxCaption.textContent = currentCaptions[currentIndex];
        lightboxImg.style.opacity = '1';
    }, 150);
}

function changeLightboxImage(direction, event) {
    if (event) event.stopPropagation();

    currentIndex += direction;

    if (currentIndex >= currentGroup.length) {
        currentIndex = 0;
    } else if (currentIndex < 0) {
        currentIndex = currentGroup.length - 1;
    }

    updateLightboxContent();
}

// ========================================
// HERO ANIMATIONS (Index)
// ========================================
function initHeroAnimations() {
    // 1. Typewriter Effect
    const codeLines = document.querySelectorAll('.hero-background-code .code-column span');
    if (codeLines.length > 0) {
        let delay = 0;
        codeLines.forEach((line, index) => {
            // Randomize delay slightly for realism
            delay += Math.random() * 1000 + 500;
            setTimeout(() => {
                line.classList.add('typing');
                // Remove typing cursor after animation
                setTimeout(() => {
                    line.classList.remove('typing');
                    line.classList.add('typed');
                }, 3000); // Match animation duration
            }, delay);
        });
    }

    // 2. Interactive Particles
    const hero = document.querySelector('.hero-gaming');
    if (hero) {
        const particles = document.querySelectorAll('.game-particle');

        hero.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            // Calculate mouse position relative to center (-1 to 1)
            const x = (clientX / innerWidth) - 0.5;
            const y = (clientY / innerHeight) - 0.5;

            particles.forEach((particle, index) => {
                // Different depth for each particle based on index
                const depth = (index + 1) * 20;
                const moveX = x * depth;
                const moveY = y * depth;

                particle.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });
    }
}

// ========================================
// CUSTOM CURSOR
// ========================================
function initCustomCursor() {
    // Only for non-touch devices
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Add hover effect for ALL interactive elements
    const interactables = document.querySelectorAll(
        'a, button, .interactable, .card, .proof-card, ' +
        '[onclick], .scroll-indicator, .lightbox-prev, .lightbox-next, ' +
        '.close-lightbox, .close-btn, .sidebar-value[onclick], ' +
        '.nav-btn-cv, .btn, .btn-outline'
    );

    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });

    // Hide custom cursor on form elements (let system cursor show)
    const formElements = document.querySelectorAll('input, textarea, select');
    formElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.style.display = 'none');
        el.addEventListener('mouseleave', () => cursor.style.display = 'block');
    });
}

// ========================================
// 3D TILT EFFECT
// ========================================
function init3DTilt() {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation based on cursor position
            // Center of card is (0,0)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg rotation
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

// ========================================
// SKILLS CAROUSEL
// ========================================
function initSkillsCarousel() {
    const track = document.getElementById('skillsTrack');
    const scrollContainer = document.querySelector('.skills-track-container');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const prevBtn = document.querySelector('.carousel-nav.prev');
    const nextBtn = document.querySelector('.carousel-nav.next');
    const container = document.querySelector('.skills-carousel-container');

    if (!track || !container || !scrollContainer) return;

    let autoScrollInterval;
    const scrollAmount = 180; // Card width + gap
    const autoScrollDelay = 3000; // Increased delay for better readability

    function updateArrows() {
        const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        if (maxScroll <= 5) { // Almost no scroll possible
            if (prevBtn) prevBtn.style.opacity = '0';
            if (nextBtn) nextBtn.style.opacity = '0';
            if (prevBtn) prevBtn.style.pointerEvents = 'none';
            if (nextBtn) nextBtn.style.pointerEvents = 'none';
        } else {
            if (prevBtn) prevBtn.style.opacity = '1';
            if (nextBtn) nextBtn.style.opacity = '1';
            if (prevBtn) prevBtn.style.pointerEvents = 'auto';
            if (nextBtn) nextBtn.style.pointerEvents = 'auto';
        }
    }

    // 1. Filtering Logic
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            const cards = track.querySelectorAll('.skill-card-mini');

            cards.forEach(card => {
                const categories = card.dataset.category;
                if (categories.includes(filter)) {
                    card.classList.remove('hidden');
                    card.style.opacity = '0';
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    card.classList.add('hidden');
                }
            });

            // Reset scroll and update arrows visibility
            scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
            setTimeout(updateArrows, 350);

            stopAutoScroll();
            startAutoScroll();
        });
    });

    // 2. Auto Scroll Logic
    function startAutoScroll() {
        stopAutoScroll();
        const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        if (maxScroll <= 5) return; // Don't auto-scroll if it fits

        autoScrollInterval = setInterval(() => {
            scrollTrack(1);
        }, autoScrollDelay);
    }

    function stopAutoScroll() {
        if (autoScrollInterval) clearInterval(autoScrollInterval);
    }

    function scrollTrack(direction) {
        const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        if (maxScroll <= 5) return;

        let newScrollLeft = scrollContainer.scrollLeft + (direction * scrollAmount);

        // Circular loop logic
        if (newScrollLeft >= maxScroll + (scrollAmount / 2)) {
            scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
        } else if (newScrollLeft < -50) {
            scrollContainer.scrollTo({ left: maxScroll, behavior: 'smooth' });
        } else {
            scrollContainer.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
        }
    }

    // 3. Event Listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            scrollTrack(-1);
            stopAutoScroll();
            setTimeout(startAutoScroll, 2000); // Wait bit longer before resuming
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            scrollTrack(1);
            stopAutoScroll();
            setTimeout(startAutoScroll, 2000);
        });
    }

    container.addEventListener('mouseenter', stopAutoScroll);
    container.addEventListener('mouseleave', startAutoScroll);

    // Initial check & default filter
    setTimeout(() => {
        // Trigger initial filter (Web)
        const webBtn = Array.from(filterBtns).find(b => b.dataset.filter === 'web');
        if (webBtn) webBtn.click();

        updateArrows();
        startAutoScroll();
    }, 500);
}

// Add to initialization
document.addEventListener('DOMContentLoaded', () => {
    // ... existing init calls ...
    initSkillsCarousel();
});

// Fallback: Try initializing again after a short delay to ensure layout is stable
window.addEventListener('load', () => {
    initSkillsCarousel();
});



/* =========================================
   CINEMATIC FPS TRAILER LOGIC
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const fpsIntro = document.getElementById('fps-intro');
    const briefingText = document.getElementById('briefing-text');
    const warTitleContainer = document.getElementById('war-title-container');
    const warTitles = document.querySelectorAll('.war-title');
    const deployBtn = document.getElementById('deploy-btn');
    const flashbang = document.querySelector('.flashbang-overlay');
    const heroBg = document.querySelector('.hero-bg');
    const cinemaBars = document.querySelector('.cinema-bars');

    // Skip if elements missing
    if (!fpsIntro || !briefingText) return;

    // Optional: Check if already visited
    // if (sessionStorage.getItem('introShown')) {
    //     fpsIntro.style.display = 'none';
    //     return;
    // }

    // SEQUENCE CONFIG
    const messages = [
        "ENCRYPTED SIGNAL DETECTED...",
        "DECODING...",
        "SOURCE: UNKNOWN",
        "ESTABLISHING VISUAL..."
    ];

    let msgIndex = 0;

    // 1. Typewriter Effect
    function typeWriter(text, i, fnCallback) {
        if (i < text.length) {
            briefingText.innerHTML = text.substring(0, i + 1) + '<span aria-hidden="true"></span>';
            setTimeout(function () {
                typeWriter(text, i + 1, fnCallback)
            }, 30); // Typing speed
        } else if (typeof fnCallback == 'function') {
            setTimeout(fnCallback, 500); // Wait after line finished
        }
    }

    function startSequence() {
        if (msgIndex < messages.length) {
            typeWriter(messages[msgIndex], 0, function () {
                msgIndex++;
                startSequence();
            });
        } else {
            // End of briefing -> Trigger FLASHBANG
            setTimeout(triggerFlashbang, 200);
        }
    }

    // 2. Flashbang & Reveal
    function triggerFlashbang() {
        briefingText.innerHTML = ""; // Clear text
        flashbang.classList.add('active');

        // At peak of flash (0.1s), reveal background
        setTimeout(() => {
            heroBg.classList.add('reveal');
            cinemaBars.classList.add('active'); // Letterbox in
        }, 100);

        // After flash fades slightly (1.5s), show "PREPAREZ-VOUS"
        setTimeout(() => {
            warTitleContainer.classList.remove('hidden');
            warTitles[0].classList.add('visible'); // Heartbeat text
        }, 1500);

        // Then "A LA GUERRE" (3s)
        setTimeout(() => {
            warTitles[1].classList.add('visible'); // Glitch text
        }, 3000);

        // Finally Button (4s)
        setTimeout(() => {
            deployBtn.classList.remove('hidden');
            setTimeout(() => {
                deployBtn.classList.add('visible');
            }, 100);
        }, 4000);
    }

    // 3. Start immediately
    setTimeout(startSequence, 1000);

    // 4. Deploy Interaction
    if (deployBtn) {
        deployBtn.addEventListener('click', () => {
            // Visual feedback
            deployBtn.innerHTML = "DEPLOYING...";
            deployBtn.style.color = "#000";
            deployBtn.style.background = "#10b981";

            // Fade out
            setTimeout(() => {
                fpsIntro.style.opacity = '0';
                setTimeout(() => {
                    fpsIntro.style.display = 'none';
                    sessionStorage.setItem('introShown', 'true');
                }, 1000);
            }, 800);
        });
    }
});

// ========================================
// POKEMON CARD 3D LOGIC
// ========================================
function initPokemonCard() {
    const card = document.querySelector('.pokemon-card');
    if (!card) return;

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Tilt Effect
        const rotateX = ((y - centerY) / centerY) * -14; // Max 14deg tilt
        const rotateY = ((x - centerX) / centerX) * 14;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;

        // Update CSS variables for sheen
        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${percentX}%`);
        card.style.setProperty('--mouse-y', `${percentY}%`);
        card.style.setProperty('--opacity-sheen', '1');
    });

    card.addEventListener('mouseleave', () => {
        // Reset position
        card.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        card.style.setProperty('--opacity-sheen', '0');

        // Remove transition after it resets so mousemove is instant
        setTimeout(() => {
            card.style.transition = '';
        }, 600);
    });

    // Smooth entry
    card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease';
    });
}
