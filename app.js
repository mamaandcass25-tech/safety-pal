// Utility to refresh Lucide icons
function refreshIcons() {
    lucide.createIcons();
}

document.addEventListener("DOMContentLoaded", function () {
    // 1. Navigation Logic
    const mapPage = document.getElementById('map-page');
    const alertsPage = document.getElementById('alerts-page');
    const navItems = document.querySelectorAll('.nav-item');

    function switchPage(pageId) {
        if (pageId === 'nav-map') {
            mapPage.style.display = 'flex';
            alertsPage.style.display = 'none';
        } else if (pageId === 'nav-alerts') {
            mapPage.style.display = 'none';
            alertsPage.style.display = 'flex';
        }

        navItems.forEach(item => {
            if (item.id === pageId) item.classList.add('active');
            else item.classList.remove('active');
        });
        refreshIcons();
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            if (item.id) switchPage(item.id);
        });
    });

    // 2. Map Setup
    const map = L.map('map', { zoomControl: false }).setView([37.7749, -122.4194], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    document.getElementById('zoom-in').addEventListener('click', () => map.zoomIn());
    document.getElementById('zoom-out').addEventListener('click', () => map.zoomOut());

    function createCustomMarker(lat, lng, type, iconName, labelText) {
        const markerHTML = `
            <div class="custom-marker">
                <div class="marker-icon-wrapper marker-wrapper-${type}">
                    <i data-lucide="${iconName}"></i>
                </div>
                ${labelText ? `<div class="marker-label">${labelText}</div>` : ''}
            </div>
        `;
        const icon = L.divIcon({
            html: markerHTML,
            className: '',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });
        L.marker([lat, lng], { icon }).addTo(map);
    }

    // Load initial map markers
    createCustomMarker(37.8080, -122.4177, 'fire', 'flame', 'FIRE ALERT');
    createCustomMarker(37.7599, -122.4148, 'accident', 'alert-triangle', 'ACCIDENT');
    createCustomMarker(37.7400, -122.4150, 'police', 'shield', 'POLICE ACTIVITY');

    // Ensure icons in markers are rendered
    setTimeout(refreshIcons, 100);

    // 3. Search Bar Interaction
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.toLowerCase();
            if (query.includes('san francisco')) map.setView([37.7749, -122.4194], 14);
            else if (query.includes('fisherman')) map.setView([37.8080, -122.4177], 15);
            else if (query.includes('mission')) map.setView([37.7599, -122.4148], 15);
        }
    });

    // 4. Report Incident Logic
    const reportBtn = document.querySelector('.report-btn');
    const modalOverlay = document.querySelector('.modal-overlay');
    const submitBtn = document.querySelector('.submit-report-btn');
    const incidentOptions = document.querySelectorAll('.incident-option');
    let selectedType = 'fire';

    reportBtn.addEventListener('click', () => {
        modalOverlay.style.display = 'flex';
        refreshIcons();
    });

    document.querySelector('.close-modal').addEventListener('click', () => {
        modalOverlay.style.display = 'none';
    });

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) modalOverlay.style.display = 'none';
    });

    incidentOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            incidentOptions.forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            selectedType = opt.dataset.type;
        });
    });

    // FIX: Submit Report Functional Logic
    submitBtn.addEventListener('click', () => {
        const center = map.getCenter();
        createCustomMarker(center.lat, center.lng, selectedType,
            selectedType === 'fire' ? 'flame' :
                selectedType === 'police' ? 'shield' :
                    selectedType === 'medical' ? 'briefcase-medical' : 'alert-triangle',
            `NEW REPORT: ${selectedType.toUpperCase()}`
        );

        modalOverlay.style.display = 'none';
        alert(`Report for ${selectedType} submitted at current location!`);
        setTimeout(refreshIcons, 100);
    });

    // Initial icon refresh
    refreshIcons();
});

// Alerts page back button
document.querySelector('.back-btn').addEventListener('click', () => {
    document.getElementById('nav-map').click();
});
