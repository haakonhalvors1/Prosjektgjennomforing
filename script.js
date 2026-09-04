// Initialisér ved lasting
document.addEventListener('DOMContentLoaded', function() {
    initProfileModal();
    initProjectModal();
    initAutoHideHeader();
    initWindowTransitions();
});

function initAutoHideHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const revealZone = 80; // px from top of viewport that always reveals the header
    let lastScrollY = window.scrollY;

    const showHeader = () => header.classList.remove('site-header--hidden');
    const hideHeader = () => header.classList.add('site-header--hidden');

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY <= revealZone) {
            showHeader();
        } else if (currentScrollY > lastScrollY) {
            hideHeader();
        } else if (currentScrollY < lastScrollY) {
            showHeader();
        }

        lastScrollY = currentScrollY;
    }, { passive: true });

    window.addEventListener('mousemove', (event) => {
        if (event.clientY <= revealZone) {
            showHeader();
        }
    });
}


function initProfileModal() {
    const modal = document.getElementById('profileModal');
    if (!modal) return;

    const image = document.getElementById('profileModalImage');
    const title = document.getElementById('profileModalTitle');
    const bio = document.getElementById('profileModalBio');
    const closeButton = modal.querySelector('.profile-modal__close');
    const backdrop = modal.querySelector('[data-close-modal="true"]');
    const githubLink = modal.querySelector('.social-btn--github');
    const linkedinLink = modal.querySelector('.social-btn--linkedin');
    const profileLinks = {
        'Dawit Ghirmay Andom': {
            github: 'https://github.com/dawitandom',
            linkedin: 'https://www.linkedin.com/in/dawit-andom-787199243/'
        },
        'Haakon Elias Halvorsen': {
            github: 'https://github.com/haakonhalvors1',
            linkedin: 'https://www.linkedin.com/in/haakon-halvorsen-bb3982354/'
        },
        'Marius Khiem Nguyen': {
            github: 'https://github.com/MariusKhiem',
            linkedin: 'https://www.linkedin.com/in/marius-nguyen-189544313/'
        },
        'Mohamed Liban Osman': {
            github: 'https://github.com/Mohamedlosman',
            linkedin: 'https://www.linkedin.com/in/mohamed-osman-375564428/'
        },
        'Fanuel Ogbai Habte': {
            github: 'https://github.com/FanuelHab',
            linkedin: 'https://www.linkedin.com/in/fanuel-habte/'
        }
    };

    const openModal = (card) => {
        image.src = card.dataset.image;
        image.alt = card.dataset.name;
        title.textContent = card.dataset.name;
        bio.textContent = card.dataset.bio;
        const links = profileLinks[card.dataset.name] || {};
        githubLink.href = links.github || '#';
        githubLink.hidden = !links.github;
        linkedinLink.href = links.linkedin || '#';
        linkedinLink.hidden = !links.linkedin;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => modal.classList.add('is-visible'));
    };

    const closeModal = () => {
        modal.classList.remove('is-visible');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        setTimeout(() => modal.classList.remove('is-open'), 340);
    };

    document.querySelectorAll('.team-card').forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.addEventListener('click', () => openModal(card));
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openModal(card);
            }
        });
    });

    closeButton.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });
}

function initProjectModal() {
    const modal = document.getElementById('projectModal');
    if (!modal) return;

    const badge = document.getElementById('projectModalBadge');
    const meta = document.getElementById('projectModalMeta');
    const title = document.getElementById('projectModalTitle');
    const summary = document.getElementById('projectModalSummary');
    const media = document.getElementById('projectModalMedia');
    const githubLink = document.getElementById('projectModalGithub');
    const demoLink = document.getElementById('projectModalDemo');
    const closeButton = modal.querySelector('.project-modal__close');
    const backdrop = modal.querySelector('[data-close-project-modal="true"]');

    let carouselImages = [];
    let carouselIndex = 0;

    const renderCarouselSlide = () => {
        const img = media.querySelector('.project-carousel__viewport img');
        const count = media.querySelector('.project-carousel__count');
        if (!img || !carouselImages.length) return;
        img.src = carouselImages[carouselIndex].src;
        img.alt = carouselImages[carouselIndex].alt || '';
        count.textContent = `${carouselIndex + 1} / ${carouselImages.length}`;
    };

    const renderMedia = (card) => {
        media.innerHTML = '';
        carouselImages = [];

        if (card.dataset.video) {
            const frame = document.createElement('div');
            frame.className = 'demo-frame';
            frame.innerHTML = `<iframe src="${card.dataset.video}" title="Videodemonstrasjon av ${card.dataset.title}" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
            media.appendChild(frame);
            return;
        }

        if (card.dataset.images) {
            carouselImages = JSON.parse(card.dataset.images);
            carouselIndex = 0;

            const carousel = document.createElement('div');
            carousel.className = 'project-carousel';
            carousel.innerHTML = `
                <div class="project-carousel__viewport"><img src="" alt=""></div>
                <div class="project-carousel__nav">
                    <button type="button" class="project-carousel__btn" data-carousel-prev>← Forrige</button>
                    <span class="project-carousel__count"></span>
                    <button type="button" class="project-carousel__btn" data-carousel-next>Neste →</button>
                </div>`;
            media.appendChild(carousel);

            carousel.querySelector('[data-carousel-prev]').addEventListener('click', () => {
                carouselIndex = (carouselIndex - 1 + carouselImages.length) % carouselImages.length;
                renderCarouselSlide();
            });
            carousel.querySelector('[data-carousel-next]').addEventListener('click', () => {
                carouselIndex = (carouselIndex + 1) % carouselImages.length;
                renderCarouselSlide();
            });

            renderCarouselSlide();
        }
    };

    const openModal = (card) => {
        badge.textContent = card.dataset.badge || '';
        meta.textContent = card.dataset.meta || '';
        title.textContent = card.dataset.title;
        summary.textContent = card.dataset.summary;
        renderMedia(card);
        githubLink.href = card.dataset.github || '#';
        githubLink.hidden = !card.dataset.github;
        demoLink.href = card.dataset.demo || '#';
        demoLink.hidden = !card.dataset.demo;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => modal.classList.add('is-visible'));
    };

    const closeModal = () => {
        modal.classList.remove('is-visible');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        setTimeout(() => modal.classList.remove('is-open'), 340);
    };

    document.querySelectorAll('.project-card').forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.addEventListener('click', () => openModal(card));
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openModal(card);
            }
        });
    });

    closeButton.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });
}

// Animate windows opening on load, and closing before navigating to another page
function initWindowTransitions() {
    const windows = document.querySelectorAll('.win-window');
    if (!windows.length) return;

    const stagger = 70;
    const animDuration = 260;

    windows.forEach((win, i) => {
        win.style.animationDelay = `${i * stagger}ms`;
        win.classList.add('win-window--enter');
        win.addEventListener('animationend', () => {
            win.classList.remove('win-window--enter');
            win.style.animationDelay = '';
        }, { once: true });
    });

    const closeDuration = animDuration + (windows.length - 1) * stagger;

    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || !href.endsWith('.html') || link.target === '_blank') return;

        link.addEventListener('click', (event) => {
            if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            windows.forEach((win, i) => {
                win.style.animationDelay = `${i * stagger}ms`;
                win.classList.add('win-window--leave');
            });
            setTimeout(() => { window.location.href = href; }, closeDuration);
        });
    });
}

