// Sett startdato og beregn nåværende uke
function initializeDates() {
    const startDate = new Date('2026-08-13');
    document.getElementById('start-date').textContent = startDate.toLocaleDateString('no-NO');

    const today = new Date();
    const weeksPassed = Math.floor((today - startDate) / (7 * 24 * 60 * 60 * 1000)) + 1;
    document.getElementById('current-week').textContent = 'Uke ' + weeksPassed;

    document.getElementById('last-update').textContent = today.toLocaleDateString('no-NO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Initialisér ved lasting
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('start-date')) {
        initializeDates();
    }

    initProfileModal();
});

function initProfileModal() {
    const modal = document.getElementById('profileModal');
    if (!modal) return;

    const image = document.getElementById('profileModalImage');
    const title = document.getElementById('profileModalTitle');
    const role = document.getElementById('profileModalRole');
    const bio = document.getElementById('profileModalBio');
    const email = document.getElementById('profileModalEmail');
    const phone = document.getElementById('profileModalPhone');
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
            github: 'https://github.com/Mohamedlosman'
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
        role.textContent = card.dataset.role;
        bio.textContent = card.dataset.bio;
        email.textContent = 'E-post: ' + card.dataset.email;
        phone.textContent = 'Telefon: ' + card.dataset.phone;
        const links = profileLinks[card.dataset.name] || {};
        githubLink.href = links.github || '#';
        githubLink.hidden = !links.github;
        linkedinLink.href = links.linkedin || '#';
        linkedinLink.hidden = !links.linkedin;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    document.querySelectorAll('.team-card .read-more-btn').forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.team-card');
            openModal(card);
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

// Simple gallery lightbox for images with class 'gallery-item'
function initGalleryLightbox() {
    const images = document.querySelectorAll('.gallery-item');
    if (!images.length) return;

    // create overlay
    let overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.style.display = 'none';
    overlay.innerHTML = '<img alt="" /><button class="lightbox-close" aria-label="Lukk">×</button>';
    document.body.appendChild(overlay);

    const overlayImg = overlay.querySelector('img');
    const closeBtn = overlay.querySelector('.lightbox-close');

    images.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', function() {
            overlayImg.src = this.src;
            overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLightbox() {
        overlay.style.display = 'none';
        overlayImg.src = '';
        document.body.style.overflow = '';
    }

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay || e.target === closeBtn) closeLightbox();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeLightbox();
    });
}

document.addEventListener('DOMContentLoaded', initGalleryLightbox);
