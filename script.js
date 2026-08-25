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
});
