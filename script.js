// Gruppemedlemmer, brukt av deltakerlistene på prosjektkortene (data-members)
const TEAM_MEMBERS = {
    haakon: { name: 'Haakon Elias Halvorsen', image: 'assets/images/haakon.jpeg' },
    marius: { name: 'Marius Khiem Nguyen', image: 'assets/images/marius.jpeg' },
    mohamed: { name: 'Mohamed Liban Osman', image: 'assets/images/mohamed.jpeg' },
    dawit: { name: 'Dawit Ghirmay Andom', image: 'assets/images/dawit.jpeg' },
    fanuel: { name: 'Fanuel Ogbai Habte', image: 'assets/images/profilbilde.jpg' },
    victor: { name: 'Victor Imanuel Ziadpour', image: 'assets/images/victor.jpg' }
};

const splitList = (value) => (value || '').split(',').map(item => item.trim()).filter(Boolean);

const createEl = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    return el;
};

// Holder Tab-fokus inne i en åpen dialog
function trapFocus(container, event) {
    if (event.key !== 'Tab') return;
    const focusable = [...container.querySelectorAll('a[href], button, iframe, select, input, textarea, [tabindex]:not([tabindex="-1"])')]
        .filter(el => !el.hidden && !el.disabled && el.getClientRects().length);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || !container.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
}

function renderTagList(list, tags) {
    list.replaceChildren(...tags.map(tag => createEl('li', 'tag', tag)));
}

// Bygger én rad i Detaljer-listen fra data-attributtene, så nye prosjekter bare trenger en <article>
function renderProjectRow(entry) {
    const { title, badge, short, summary } = entry.dataset;
    const row = createEl('tr', 'project-row');

    const nameCell = createEl('td');
    const name = createEl('div', 'project-row__name');
    const icon = document.createElement('img');
    icon.src = entry.dataset.icon || 'assets/images/program.svg';
    icon.alt = '';
    const text = createEl('div');
    const open = createEl('button', 'project-row__open', title);
    open.type = 'button';
    text.append(open);
    // Kort beskrivelse i listen; faller tilbake på hele sammendraget
    if (short || summary) text.append(createEl('span', 'project-row__summary', short || summary));
    name.append(icon, text);
    nameCell.append(name);

    const memberCell = createEl('td');
    const members = splitList(entry.dataset.members).map(key => TEAM_MEMBERS[key]).filter(Boolean);
    const stack = createEl('ul', 'avatar-stack');
    stack.setAttribute('aria-label', members.map(m => m.name).join(', '));
    members.forEach(member => {
        const item = createEl('li', 'avatar');
        item.dataset.name = member.name.split(' ')[0];
        const img = document.createElement('img');
        img.src = member.image;
        img.alt = member.name;
        img.loading = 'lazy';
        item.append(img);
        stack.append(item);
    });
    memberCell.append(stack);

    const periodCell = createEl('td', 'project-row__period', badge || '');

    row.append(nameCell, memberCell, periodCell);
    return { row, open };
}

// Initialisér ved lasting
document.addEventListener('DOMContentLoaded', function() {
    initBootScreen();
    initProfileModal();
    initProjectModal();
    initContactModal();
    initWindowTransitions();
});

// Windows 95-style boot screen, shown once per browser session
function initBootScreen() {
    const screen = document.getElementById('bootScreen');
    if (!screen) return;

    let alreadyBooted = false;
    try {
        alreadyBooted = sessionStorage.getItem('systema-booted') === '1';
    } catch (e) {}

    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (alreadyBooted || reducedMotion) {
        screen.remove();
        return;
    }

    document.body.style.overflow = 'hidden';

    const bar = screen.querySelector('.boot-bar');
    const status = screen.querySelector('.boot-status');
    const fillStart = 450;
    const fillDuration = 700;
    const statusMessages = ['Starter SYSTEMA...', 'Laster komponenter...', 'Kontrollerer minne...', 'Klar.'];

    const fill = document.createElement('div');
    fill.className = 'boot-bar-fill';
    fill.style.animationDelay = `${fillStart}ms`;
    fill.style.animationDuration = `${fillDuration}ms`;
    bar.appendChild(fill);

    const barEndTime = fillStart + fillDuration;
    if (status) {
        statusMessages.forEach((message, i) => {
            setTimeout(() => { status.textContent = message; }, fillStart + i * (fillDuration / statusMessages.length));
        });
    }

    let finished = false;
    const finish = () => {
        if (finished) return;
        finished = true;
        document.removeEventListener('keydown', finish);
        screen.classList.add('is-done');
        try { sessionStorage.setItem('systema-booted', '1'); } catch (e) {}
        document.body.style.overflow = '';
        screen.addEventListener('animationend', () => screen.remove(), { once: true });
    };

    setTimeout(finish, barEndTime + 250);

    // Klikk eller hvilken som helst tast hopper over oppstarten
    screen.addEventListener('click', finish);
    document.addEventListener('keydown', finish);
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
        },
        'Victor Imanuel Ziadpour': {
            github: 'https://github.com/VictorImanuel2',
            linkedin: 'https://www.linkedin.com/in/victor-imanuel-ziadpour-8a7a29345/'
        }
    };

    let lastFocused = null;

    const openModal = (card) => {
        lastFocused = card.querySelector('.read-more-btn') || card;
        image.src = card.dataset.image;
        image.alt = card.dataset.name;
        title.textContent = card.dataset.name;
        if (card.dataset.role) {
            title.append(' – ', createEl('span', 'profile-modal__role', card.dataset.role));
        }
        bio.textContent = card.dataset.bio;
        const links = profileLinks[card.dataset.name] || {};
        githubLink.href = links.github || '#';
        githubLink.hidden = !links.github;
        linkedinLink.href = links.linkedin || '#';
        linkedinLink.hidden = !links.linkedin;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => {
            modal.classList.add('is-visible');
            closeButton.focus();
        });
    };

    const closeModal = () => {
        modal.classList.remove('is-visible');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        setTimeout(() => modal.classList.remove('is-open'), 340);
        if (lastFocused) lastFocused.focus();
    };

    // Hele kortet er klikkbart med mus; knappen er tastaturmålet (klikket bobler opp til kortet)
    document.querySelectorAll('.team-card').forEach(card => {
        const button = card.querySelector('.read-more-btn');
        if (button) button.setAttribute('aria-label', `Se mer om ${card.dataset.name}`);
        card.addEventListener('click', () => openModal(card));
    });

    closeButton.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (event) => {
        if (!modal.classList.contains('is-open')) return;
        if (event.key === 'Escape') closeModal();
        trapFocus(modal, event);
    });

}

function initProjectModal() {
    const modal = document.getElementById('projectModal');
    if (!modal) return;

    const badge = document.getElementById('projectModalBadge');
    const meta = document.getElementById('projectModalMeta');
    const title = document.getElementById('projectModalTitle');
    const short = document.getElementById('projectModalShort');
    const summary = document.getElementById('projectModalSummary');
    const icon = document.getElementById('projectModalIcon');
    const barIcon = document.getElementById('projectModalBarIcon');
    const barTitle = document.getElementById('projectModalBarTitle');
    const media = document.getElementById('projectModalMedia');
    const tagList = document.getElementById('projectModalTags');
    const githubLink = document.getElementById('projectModalGithub');
    const demoLink = document.getElementById('projectModalDemo');
    const closeButton = modal.querySelector('.project-modal__close');
    const okButton = modal.querySelector('.project-modal__ok');
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

    const stepCarousel = (step) => {
        if (!carouselImages.length) return;
        carouselIndex = (carouselIndex + step + carouselImages.length) % carouselImages.length;
        renderCarouselSlide();
    };

    const renderMedia = (card) => {
        media.innerHTML = '';
        carouselImages = [];

        if (card.dataset.video) {
            const frame = document.createElement('div');
            frame.className = 'demo-frame';
            frame.innerHTML = `<iframe src="${card.dataset.video}" title="Demo av ${card.dataset.title}" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
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

            carousel.querySelector('[data-carousel-prev]').addEventListener('click', () => stepCarousel(-1));
            carousel.querySelector('[data-carousel-next]').addEventListener('click', () => stepCarousel(1));

            renderCarouselSlide();
        }
    };

    let lastFocused = null;

    const openModal = (card, trigger) => {
        lastFocused = trigger || card;
        const iconSrc = card.dataset.icon || 'assets/images/program.svg';
        icon.src = iconSrc;
        barIcon.src = iconSrc;
        barTitle.textContent = card.dataset.title;
        badge.textContent = card.dataset.badge || '–';
        meta.textContent = card.dataset.meta || '–';
        title.textContent = card.dataset.title;
        short.textContent = card.dataset.short || '';
        short.hidden = !card.dataset.short;
        summary.textContent = card.dataset.summary;
        renderMedia(card);
        media.hidden = !media.children.length;
        renderTagList(tagList, splitList(card.dataset.tags));
        githubLink.href = card.dataset.github || '#';
        githubLink.hidden = !card.dataset.github;
        demoLink.href = card.dataset.demo || '#';
        demoLink.hidden = !card.dataset.demo;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => {
            modal.classList.add('is-visible');
            okButton.focus();
        });
    };

    const closeModal = () => {
        modal.classList.remove('is-visible');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        setTimeout(() => {
            modal.classList.remove('is-open');
            media.innerHTML = ''; // stopper videoen når vinduet lukkes
        }, 340);
        if (lastFocused) lastFocused.focus();
    };

    const list = document.getElementById('projectList');
    const count = document.getElementById('projectCount');
    // Prosjekter med flest deltakere øverst; like mange beholder rekkefølgen fra HTML-en
    const entries = [...list.querySelectorAll('.project-entry')]
        .sort((a, b) => splitList(b.dataset.members).length - splitList(a.dataset.members).length);

    const table = createEl('table', 'project-table');
    const head = createEl('thead');
    const headRow = createEl('tr');
    ['Navn', 'Deltakere', 'Periode'].forEach(label => {
        const th = createEl('th', '', label);
        th.scope = 'col';
        headRow.append(th);
    });
    head.append(headRow);
    const body = createEl('tbody');
    table.append(head, body);

    entries.forEach(entry => {
        const { row, open } = renderProjectRow(entry);
        // Hele raden er klikkbar med mus; knappen i navnet er tastaturmålet
        row.addEventListener('click', () => openModal(entry, open));
        body.append(row);
    });

    list.replaceChildren(table);

    if (count) count.textContent = `${entries.length} ${entries.length === 1 ? 'objekt' : 'objekter'}`;

    closeButton.addEventListener('click', closeModal);
    okButton.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (event) => {
        if (!modal.classList.contains('is-open')) return;
        if (event.key === 'Escape') closeModal();
        // Piltaster blar i bildekarusellen
        if (event.key === 'ArrowLeft') stepCarousel(-1);
        if (event.key === 'ArrowRight') stepCarousel(1);
        trapFocus(modal, event);
    });
}

// Animate windows opening on load, and closing before navigating to another page
function initWindowTransitions() {
    const windows = document.querySelectorAll('.win-window');
    if (!windows.length) return;

    const stagger = 70;

    windows.forEach((win, i) => {
        win.style.animationDelay = `${i * stagger}ms`;
        win.classList.add('win-window--enter');
        win.addEventListener('animationend', () => {
            win.classList.remove('win-window--enter');
            win.style.animationDelay = '';
        }, { once: true });
    });

    const leaveDuration = 160;
    const leaveStagger = 40;
    const closeDuration = leaveDuration + (windows.length - 1) * leaveStagger;

    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || !href.endsWith('.html') || link.target === '_blank') return;

        link.addEventListener('click', (event) => {
            if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            windows.forEach((win, i) => {
                win.style.animationDelay = `${i * leaveStagger}ms`;
                win.classList.add('win-window--leave');
            });
            setTimeout(() => { window.location.href = href; }, closeDuration);
        });
    });
}

// Kontaktvindu for bachelorbedrifter, åpnes fra "Kontakt oss"-ikonet og knappene med data-contact
const CONTACT_EMAIL = 'fanueloh@student.uia.no';
const CONTACT_SUBJECT = 'Bachelorsamarbeid med Systema';

function initContactModal() {
    const triggers = document.querySelectorAll('[data-contact]');
    if (!triggers.length) return;

    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(CONTACT_SUBJECT)}`;
    document.body.insertAdjacentHTML('beforeend', `
        <div class="project-modal contact-modal" id="contactModal" aria-hidden="true">
            <div class="project-modal__backdrop" data-close-contact="true"></div>
            <div class="project-modal__dialog contact-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="contactModalTitle">
                <div class="win-titlebar">
                    <span class="win-titlebar-text"><img class="project-modal__bar-icon" src="assets/images/icon-mail.svg" alt="">Ny melding</span>
                    <button class="project-modal__close" type="button" aria-label="Lukk">×</button>
                </div>
                <div class="contact-modal__content">
                    <div class="contact-modal__body">
                        <img class="contact-modal__icon" src="assets/images/icon-mail.svg" alt="" width="56" height="56">
                        <div>
                            <h2 id="contactModalTitle">La oss samarbeide om bacheloroppgaven!</h2>
                            <p>Vi gleder oss til å høre fra dere. Send en e-post, så tar vi kontakt.</p>
                        </div>
                    </div>
                    <p class="contact-modal__email">
                        <span>Kontakt:</span>
                        <a href="${mailto}">${CONTACT_EMAIL}</a>
                    </p>
                    <p class="contact-modal__status" role="status" aria-live="polite"></p>
                </div>
                <div class="project-modal__buttons">
                    <button class="home-btn contact-modal__copy" type="button">Kopier adresse</button>
                    <button class="home-btn home-btn-primary contact-modal__cancel" type="button">OK</button>
                </div>
            </div>
        </div>`);

    const modal = document.getElementById('contactModal');
    const status = modal.querySelector('.contact-modal__status');
    const okButton = modal.querySelector('.contact-modal__cancel');
    let lastFocused = null;

    const openModal = (trigger) => {
        lastFocused = trigger;
        status.textContent = '';
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => {
            modal.classList.add('is-visible');
            okButton.focus();
        });
    };

    const closeModal = () => {
        modal.classList.remove('is-visible');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        setTimeout(() => modal.classList.remove('is-open'), 340);
        if (lastFocused) lastFocused.focus();
    };

    triggers.forEach(trigger => {
        trigger.addEventListener('click', (event) => {
            event.preventDefault();
            openModal(trigger);
        });
    });

    modal.querySelector('.contact-modal__copy').addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(CONTACT_EMAIL);
            status.textContent = 'Adressen er kopiert til utklippstavlen.';
        } catch (e) {
            status.textContent = `Kunne ikke kopiere. Adressen er ${CONTACT_EMAIL}`;
        }
    });

    modal.querySelectorAll('.project-modal__close, .contact-modal__cancel, [data-close-contact]')
        .forEach(el => el.addEventListener('click', closeModal));

    document.addEventListener('keydown', (event) => {
        if (!modal.classList.contains('is-open')) return;
        if (event.key === 'Escape') closeModal();
        trapFocus(modal, event);
    });
}
