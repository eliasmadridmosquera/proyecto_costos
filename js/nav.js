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
/** Resalta en el nav el enlace de la sección visible mientras se hace scroll. */
function resaltarNavActivo() {
    const enlaces = Array.from(document.querySelectorAll('.primary-nav a[href^="#"]'));
    const objetivos = enlaces
        .map((enlace) => {
        const id = enlace.getAttribute('href')?.slice(1) ?? '';
        const seccion = document.getElementById(id);
        return seccion ? { enlace, seccion } : null;
    })
        .filter((objetivo) => objetivo !== null);
    if (objetivos.length === 0)
        return;
    function marcarActivo(idSeccionVisible) {
        objetivos.forEach(({ enlace, seccion }) => {
            const esActivo = seccion.id === idSeccionVisible;
            enlace.classList.toggle('active', esActivo);
            if (esActivo) {
                enlace.setAttribute('aria-current', 'true');
            }
            else {
                enlace.removeAttribute('aria-current');
            }
        });
    }
    const observer = new IntersectionObserver((entradas) => {
        const masVisible = entradas
            .filter((entrada) => entrada.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (masVisible)
            marcarActivo(masVisible.target.id);
    }, { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });
    objetivos.forEach(({ seccion }) => observer.observe(seccion));
    marcarActivo(objetivos[0].seccion.id);
}
resaltarNavActivo();
//# sourceMappingURL=nav.js.map