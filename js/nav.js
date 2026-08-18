"use strict";
function esHTMLElement(value) {
    return value instanceof HTMLElement;
}
(function initNav() {
    const menuToggle = document.getElementById('menuToggle');
    const primaryNav = document.getElementById('primaryNav');
    if (!esHTMLElement(menuToggle) || !esHTMLElement(primaryNav)) {
        return;
    }
    function setMenu(open) {
        primaryNav.classList.toggle('open', open);
        menuToggle.setAttribute('aria-expanded', String(open));
        menuToggle.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    }
    menuToggle.addEventListener('click', () => {
        setMenu(!primaryNav.classList.contains('open'));
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && primaryNav.classList.contains('open')) {
            setMenu(false);
            menuToggle.focus();
        }
    });
    primaryNav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            if (window.matchMedia('(max-width: 767px)').matches) {
                setMenu(false);
            }
        });
    });
})();
//# sourceMappingURL=nav.js.map