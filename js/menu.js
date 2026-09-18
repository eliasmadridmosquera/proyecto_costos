"use strict";
/** Menú desplegable accesible (trigger + role="menu"), extraído de
 * playground.ts porque ahora tiene un segundo consumidor real: el menú de
 * cuenta del header en las páginas internas (ver ts/session.ts). */
function initMenu(toggleId, listId) {
    const toggleEl = document.getElementById(toggleId);
    const listEl = document.getElementById(listId);
    if (!(toggleEl instanceof HTMLButtonElement) || !(listEl instanceof HTMLUListElement)) {
        return;
    }
    const toggle = toggleEl;
    const lista = listEl;
    function abrir() {
        lista.hidden = false;
        toggle.setAttribute('aria-expanded', 'true');
    }
    function cerrar(devolverFoco) {
        lista.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
        if (devolverFoco)
            toggle.focus();
    }
    toggle.addEventListener('click', () => {
        if (lista.hidden)
            abrir();
        else
            cerrar(false);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !lista.hidden)
            cerrar(true);
    });
    document.addEventListener('click', (e) => {
        if (lista.hidden)
            return;
        const objetivo = e.target;
        if (objetivo instanceof Node && !toggle.contains(objetivo) && !lista.contains(objetivo)) {
            cerrar(false);
        }
    });
}
//# sourceMappingURL=menu.js.map