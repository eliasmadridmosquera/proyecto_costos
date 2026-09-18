"use strict";
(function initHeroPreview() {
    const preview = document.querySelector('.hero-preview');
    if (!(preview instanceof HTMLElement))
        return;
    // Re-vinculado con tipo explícito: los nested functions de más abajo no
    // heredan el angostamiento de tipo (narrowing) de la verificación de arriba.
    const heroPreview = preview;
    // Respeta "reducir movimiento" del sistema: sin JS de animación, el SVG
    // ya muestra sus valores finales de forma estática (ver index.html).
    if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches)
        return;
    function contarValor(el) {
        const destino = Number(el.getAttribute('data-count-to'));
        if (Number.isNaN(destino))
            return;
        const prefijo = el.getAttribute('data-prefix') ?? '';
        const sufijo = el.getAttribute('data-suffix') ?? '';
        const decimales = Number(el.getAttribute('data-decimals') ?? '0');
        const duracionMs = 700;
        const inicio = performance.now();
        function paso(ahora) {
            const progreso = Math.min((ahora - inicio) / duracionMs, 1);
            el.textContent = `${prefijo}${(destino * progreso).toFixed(decimales)}${sufijo}`;
            if (progreso < 1)
                requestAnimationFrame(paso);
        }
        requestAnimationFrame(paso);
    }
    function revelar() {
        heroPreview.classList.add('is-revealed');
        heroPreview.querySelectorAll('.pv-value[data-count-to]').forEach(contarValor);
    }
    if (!('IntersectionObserver' in window)) {
        revelar();
        return;
    }
    const observer = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                revelar();
                observer.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.3 });
    observer.observe(heroPreview);
})();
//# sourceMappingURL=index.js.map