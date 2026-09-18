"use strict";
(function initPlayground() {
    initAlertClose();
    initDialog();
    initMenu('pgMenuAccountToggle', 'pgMenuAccountList');
    initMenu('pgMenuIconToggle', 'pgMenuIconList');
    initToasts();
    function initAlertClose() {
        document.querySelectorAll('.c-alert-close').forEach((boton) => {
            boton.addEventListener('click', () => {
                const alerta = boton.closest('.c-alert');
                if (alerta instanceof HTMLElement)
                    alerta.remove();
            });
        });
    }
    function initDialog() {
        const triggerEl = document.getElementById('pgDialogTrigger');
        const dialogEl = document.getElementById('pgConfirmDialog');
        const cancelEl = document.getElementById('pgDialogCancel');
        const confirmEl = document.getElementById('pgDialogConfirm');
        if (!(triggerEl instanceof HTMLButtonElement) ||
            !(dialogEl instanceof HTMLDialogElement) ||
            !(cancelEl instanceof HTMLButtonElement) ||
            !(confirmEl instanceof HTMLButtonElement)) {
            return;
        }
        // Re-vinculados con tipo explícito: los listeners de más abajo no
        // heredan el angostamiento de tipo (narrowing) de las verificaciones de arriba.
        const trigger = triggerEl;
        const dialogo = dialogEl;
        const cancelar = cancelEl;
        const confirmar = confirmEl;
        trigger.addEventListener('click', () => {
            dialogo.showModal();
        });
        // Cubre tanto Escape (evento nativo "cancel" de <dialog>) como el cierre
        // por botón: el foco siempre vuelve al trigger que abrió el diálogo.
        dialogo.addEventListener('close', () => {
            trigger.focus();
        });
        cancelar.addEventListener('click', () => {
            dialogo.close();
        });
        confirmar.addEventListener('click', () => {
            dialogo.close();
        });
    }
    function initToasts() {
        const contenedorEl = document.getElementById('pgToastContainer');
        const botonExitoEl = document.getElementById('pgToastShowSuccess');
        const botonErrorEl = document.getElementById('pgToastShowError');
        if (!(contenedorEl instanceof HTMLElement) ||
            !(botonExitoEl instanceof HTMLButtonElement) ||
            !(botonErrorEl instanceof HTMLButtonElement)) {
            return;
        }
        const contenedor = contenedorEl;
        const botonExito = botonExitoEl;
        const botonError = botonErrorEl;
        // Los toasts de ejemplo ya están en el HTML al cargar la página;
        // también se retiran solos, igual que cualquier toast creado después.
        Array.from(contenedor.children).forEach((hijo) => {
            window.setTimeout(() => hijo.remove(), DURACION_TOAST_MS);
        });
        botonExito.addEventListener('click', () => {
            crearToast('pgToastContainer', 'success', 'Los cambios se guardaron correctamente.');
        });
        botonError.addEventListener('click', () => {
            crearToast('pgToastContainer', 'error', 'No se pudo completar la solicitud. Intenta de nuevo.');
        });
    }
})();
//# sourceMappingURL=playground.js.map