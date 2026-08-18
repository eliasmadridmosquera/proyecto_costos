"use strict";
const CLAVE_ALMACENAMIENTO = 'panelacademico-theme';
function temaEfectivoActual() {
    const explicito = document.documentElement.getAttribute('data-theme');
    if (explicito === 'light' || explicito === 'dark')
        return explicito;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
(function initThemeToggle() {
    const boton = document.getElementById('themeToggle');
    if (!(boton instanceof HTMLButtonElement))
        return;
    function actualizarAria(tema) {
        boton.setAttribute('aria-label', tema === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
        boton.setAttribute('aria-pressed', String(tema === 'dark'));
    }
    actualizarAria(temaEfectivoActual());
    boton.addEventListener('click', () => {
        const nuevoTema = temaEfectivoActual() === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nuevoTema);
        try {
            localStorage.setItem(CLAVE_ALMACENAMIENTO, nuevoTema);
        }
        catch {
            // localStorage puede fallar en modo privado — el tema igual se aplica para esta sesión.
        }
        actualizarAria(nuevoTema);
    });
    // Si el usuario nunca eligió manualmente, el toggle sigue reflejando
    // cambios en la preferencia del sistema operativo en tiempo real.
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (document.documentElement.getAttribute('data-theme') === null) {
            actualizarAria(temaEfectivoActual());
        }
    });
})();
//# sourceMappingURL=theme.js.map