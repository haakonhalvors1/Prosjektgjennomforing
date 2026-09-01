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

    initTeamAboutExpanders();
});

function initTeamAboutExpanders() {
    const buttons = document.querySelectorAll('.read-more-btn');

    buttons.forEach(button => {
        const wrapper = button.previousElementSibling;

        if (!wrapper || !wrapper.classList.contains('team-about-wrapper')) {
            return;
        }

        button.addEventListener('click', () => {
            const isExpanded = wrapper.classList.toggle('expanded');
            button.textContent = isExpanded ? 'Vis mindre' : 'Les mer';
            button.setAttribute('aria-expanded', String(isExpanded));
        });
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
