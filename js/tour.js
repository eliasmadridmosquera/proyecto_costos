"use strict";
/** Tour guiado de bienvenida del hub (paneles.html), con Driver.js cargado por
 * CDN (mismo criterio que Chart.js: sin bundler). Se ofrece automáticamente
 * una vez por rol, se puede omitir en cualquier paso, y se puede repetir desde
 * "Ver tour" en el menú de cuenta (ver ts/session.ts). Los pasos dependen del
 * rol: solo se explican las zonas que ese rol realmente tiene. */
function construirPasosTour(sesion) {
    const esMovil = window.matchMedia('(max-width: 767px)').matches;
    const puedeImportar = sesion.rol === 'webmaster' || sesion.rol === 'admin';
    const puedeReiniciar = puedeImportar;
    const pasos = [
        {
            popover: {
                title: 'Bienvenido a Panel Académico',
                description: 'Este es tu punto de partida. En menos de un minuto te mostramos dónde está cada cosa.',
            },
        },
        {
            element: '.units-list',
            popover: {
                title: 'Las 3 unidades sustantivas',
                description: 'Elige Docencia, Investigación o Vinculación para ver sus métricas. Dentro de cada una encuentras Gestión, la unidad en sí y un Resumen general.',
                side: 'top',
                align: 'center',
            },
        },
    ];
    if (!esMovil) {
        pasos.push({
            element: '#appSidebar',
            popover: {
                title: 'Tu menú de navegación',
                description: 'Desde aquí saltas entre unidades sin volver al inicio. Al entrar a una unidad, sus vistas aparecen debajo de su nombre.',
                side: 'right',
                align: 'start',
            },
        });
        if (document.querySelector('.sidebar-nav--utility')) {
            pasos.push({
                element: '.sidebar-nav--utility',
                popover: {
                    title: 'Administración',
                    description: sesion.rol === 'webmaster'
                        ? 'Usuarios: asignas rol y facultad a cada cuenta. Importar: cargas el archivo base del año. Estas opciones solo las ve tu rol.'
                        : 'Importar: cargas el archivo base del año y el sistema calcula las métricas. Esta opción solo la ven los roles que administran los datos.',
                    side: 'right',
                    align: 'start',
                },
            });
        }
    }
    pasos.push({
        element: '#dataStatus',
        popover: {
            title: 'Estado de los datos',
            description: puedeImportar
                ? 'Mientras diga «Sin datos», entra a Importar, sube el archivo y vuelve a una unidad: ahí aparecen los gráficos. Con datos, además, verás un asistente flotante para preguntar sobre lo que tienes abierto.'
                : 'Aquí ves si ya hay datos cargados. Los dashboards se llenan cuando el Administrador importa el archivo base; con datos, verás un asistente flotante para preguntar sobre lo que tienes abierto.',
            side: 'bottom',
            align: 'end',
        },
    });
    pasos.push({
        element: '#userChipToggle',
        popover: {
            title: 'Tu cuenta',
            description: puedeReiniciar
                ? 'Desde aquí cierras sesión, reinicias la demo para volver a empezar sin datos, o vuelves a ver este tour.'
                : 'Desde aquí cierras sesión o vuelves a ver este tour cuando quieras.',
            side: 'bottom',
            align: 'end',
        },
    });
    return pasos;
}
function iniciarTour(sesion, origen) {
    const fabrica = window.driver?.js.driver;
    if (!fabrica)
        return; // CDN bloqueado o sin red: el tour es opcional, no se insiste.
    const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pasos = construirPasosTour(sesion);
    let tour = null;
    tour = fabrica({
        steps: pasos,
        showProgress: true,
        progressText: '{{current}} de {{total}}',
        nextBtnText: 'Siguiente',
        prevBtnText: 'Anterior',
        doneBtnText: 'Listo',
        allowClose: true,
        animate: !reducirMovimiento,
        smoothScroll: !reducirMovimiento,
        overlayOpacity: 0.6,
        stagePadding: 6,
        stageRadius: 8,
        onPopoverRender: (popover) => {
            // Omitir siempre visible y en texto (no solo la "×"): quien no quiere el
            // tour tiene que poder salir en un clic desde cualquier paso.
            if (tour && tour.isLastStep())
                return;
            const omitir = document.createElement('button');
            omitir.type = 'button';
            omitir.className = 'tour-skip';
            omitir.textContent = 'Omitir tour';
            omitir.addEventListener('click', () => tour?.destroy());
            popover.wrapper.appendChild(omitir);
        },
        onDestroyed: (_elemento, _paso, opciones) => {
            const indice = opciones.state.activeIndex ?? 0;
            trackEvento('tour_finished', {
                user_role: sesion.rol,
                trigger: origen,
                steps_total: pasos.length,
                reached_last_step: indice >= pasos.length - 1,
            });
        },
    });
    marcarTourVisto(sesion.rol);
    trackEvento('tour_started', { user_role: sesion.rol, trigger: origen });
    tour.drive();
}
(function initTourHub() {
    const sesionActual = leerSesionDemo();
    if (!sesionActual)
        return; // session.ts ya redirige a iniciar-sesion.html
    const sesion = sesionActual;
    let pedidoDesdeMenu = false;
    try {
        pedidoDesdeMenu = sessionStorage.getItem(CLAVE_TOUR_PENDIENTE) === '1';
        if (pedidoDesdeMenu)
            sessionStorage.removeItem(CLAVE_TOUR_PENDIENTE);
    }
    catch {
        // sin sessionStorage no hay pedido pendiente que consumir.
    }
    // Pequeña espera para que el sidebar y el header ya estén pintados.
    if (pedidoDesdeMenu) {
        window.setTimeout(() => iniciarTour(sesion, 'manual'), 400);
    }
    else if (!tourYaVisto(sesion.rol)) {
        window.setTimeout(() => iniciarTour(sesion, 'auto'), 700);
    }
})();
//# sourceMappingURL=tour.js.map