"use strict";
/** Sesión demo compartida entre páginas internas (paneles, usuarios, importar).
 * No hay backend: el rol activo se guarda en localStorage, igual que el tema. */
const CLAVE_SESION = 'panelacademico-demo-rol';
/** La setea importar.ts tras un CSV exitoso (con la fecha/hora en ISO, no un
 * simple booleano) — la leen los dashboards de unidad (docencia/investigación/
 * vinculación) para decidir placeholder vs. datos reales, y el indicador de
 * frescura del header para mostrar cuándo se importó por última vez. */
const CLAVE_DATOS_IMPORTADOS = 'panelacademico-datos-importados';
function leerFechaImportacion() {
    try {
        return localStorage.getItem(CLAVE_DATOS_IMPORTADOS);
    }
    catch {
        return null;
    }
}
function hayDatosImportados() {
    return leerFechaImportacion() !== null;
}
function formatearFechaImportacion(iso) {
    const fecha = new Date(iso);
    return fecha.toLocaleString('es-EC', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
}
/** Pinta/actualiza el indicador de frescura de datos en el header — lo llama
 * initHeaderInterno al cargar la página, y también importar.ts justo después
 * de guardar un import exitoso, para reflejar el cambio sin esperar un reload. */
function actualizarEstadoDatos(rol) {
    const el = document.getElementById('dataStatus');
    if (!(el instanceof HTMLElement))
        return;
    const fechaIso = leerFechaImportacion();
    if (fechaIso) {
        el.className = 'data-status is-ok';
        el.textContent = `Datos actualizados: ${formatearFechaImportacion(fechaIso)}`;
        return;
    }
    const puedeImportar = ENLACES_UTILIDAD[rol].some((e) => e.href === 'importar.html');
    el.className = 'data-status is-empty';
    el.innerHTML = puedeImportar ? 'Sin datos — <a href="importar.html">impórtalos</a>' : 'Sin datos importados aún';
}
/** Lista de facultades demo, compartida entre paneles.html (datos por facultad)
 * y usuarios.html (selector de facultad al editar un usuario Decanato). */
const FACULTADES_DEMO = [
    'Ciencias Sociales',
    'Ingeniería',
    'Ciencias de la Vida',
    'Artes y Humanidades',
    'Ciencias Exactas',
    'Negocios',
];
/** Tour guiado del hub (ver ts/tour.ts): se ofrece una vez por rol, y "Reiniciar
 * demo" lo vuelve a ofrecer. La bandera "pendiente" (sessionStorage) permite
 * pedirlo desde el menú de cuenta de otra página sin depender de la URL. */
const PREFIJO_CLAVE_TOUR = 'panelacademico-tour-visto-';
const CLAVE_TOUR_PENDIENTE = 'panelacademico-tour-pendiente';
function tourYaVisto(rol) {
    try {
        return localStorage.getItem(PREFIJO_CLAVE_TOUR + rol) === '1';
    }
    catch {
        return true; // sin storage no se puede recordar: mejor no insistir con el tour.
    }
}
function marcarTourVisto(rol) {
    try {
        localStorage.setItem(PREFIJO_CLAVE_TOUR + rol, '1');
    }
    catch {
        // sin acceso a localStorage: el tour simplemente no se recordará.
    }
}
function limpiarTourVisto() {
    try {
        Object.keys(SESIONES_DEMO).forEach((rol) => localStorage.removeItem(PREFIJO_CLAVE_TOUR + rol));
    }
    catch {
        // nada que limpiar si localStorage no está disponible.
    }
}
const SESIONES_DEMO = {
    webmaster: { rol: 'webmaster', nombre: 'Webmaster Demo', facultad: null },
    admin: { rol: 'admin', nombre: 'Admin Demo', facultad: null },
    rectorado: { rol: 'rectorado', nombre: 'Rectorado Demo', facultad: null },
    decanato: { rol: 'decanato', nombre: 'Decanato Demo', facultad: 'Ciencias Sociales' },
    visitante: { rol: 'visitante', nombre: 'Auditor Externo Demo', facultad: null },
};
// El hub de unidades sustantivas (paneles.html) es el destino universal tras
// login — Importar y Usuarios pasan a ser enlaces del nav interno, no destinos.
const DESTINO_LOGIN = {
    webmaster: 'paneles.html',
    admin: 'paneles.html',
    rectorado: 'paneles.html',
    decanato: 'paneles.html',
    visitante: 'paneles.html',
};
// Contenido (navegable, siempre visible) — separado de las acciones de
// utilidad/administración, que se pintan aparte en su propio grupo del
// sidebar (ver ENLACES_UTILIDAD) en vez de mezclarse en la misma lista.
const ENLACES_UNIDADES = [
    { href: 'paneles.html', label: 'Inicio' },
    { href: 'docencia.html', label: 'Docencia', subId: 'docencia' },
    { href: 'investigacion.html', label: 'Investigación', subId: 'investigacion' },
    { href: 'vinculacion.html', label: 'Vinculación', subId: 'vinculacion' },
];
const ENLACES_UTILIDAD = {
    webmaster: [
        { href: 'usuarios.html', label: 'Usuarios' },
        { href: 'importar.html', label: 'Importar' },
    ],
    admin: [{ href: 'importar.html', label: 'Importar' }],
    rectorado: [],
    decanato: [],
    visitante: [],
};
function esRolDemo(valor) {
    return valor === 'webmaster' || valor === 'admin' || valor === 'rectorado' || valor === 'decanato' || valor === 'visitante';
}
function guardarSesionDemo(rol) {
    try {
        localStorage.setItem(CLAVE_SESION, rol);
    }
    catch {
        // localStorage puede fallar en modo privado — el demo sigue funcionando para esta carga de página.
    }
}
function leerSesionDemo() {
    try {
        const rol = localStorage.getItem(CLAVE_SESION);
        if (rol && esRolDemo(rol))
            return SESIONES_DEMO[rol];
    }
    catch {
        // sin acceso a localStorage: se trata igual que "sin sesión".
    }
    return null;
}
function cerrarSesionDemo() {
    try {
        localStorage.removeItem(CLAVE_SESION);
    }
    catch {
        // nada que limpiar si localStorage no está disponible.
    }
}
function destinoParaRol(rol) {
    return DESTINO_LOGIN[rol];
}
/** Pinta el chip de usuario + sidebar en páginas autenticadas. Si la página
 * no tiene el marcado esperado (páginas públicas), no hace nada. */
(function initHeaderInterno() {
    const chipNombre = document.getElementById('userChipName');
    const sidebar = document.getElementById('appSidebar');
    const menuLista = document.getElementById('userChipMenu');
    if (!chipNombre)
        return;
    const sesion = leerSesionDemo();
    if (!sesion) {
        window.location.href = 'iniciar-sesion.html';
        return;
    }
    chipNombre.textContent = sesion.nombre;
    actualizarEstadoDatos(sesion.rol);
    // Sin ".html": Netlify sirve /paneles en vez de /paneles.html (pretty URLs),
    // y el enlace activo del sidebar dejaba de detectarse en producción.
    const sinHtml = (ruta) => ruta.replace(/\.html$/, '');
    const paginaActual = sinHtml(window.location.pathname.split('/').pop() ?? '');
    function renderEnlace(item) {
        const activa = sinHtml(item.href) === paginaActual;
        const sublista = item.subId ? `<ul class="sidebar-sublist" id="sidebarSub-${item.subId}"></ul>` : '';
        return `<div class="sidebar-item"><a href="${item.href}" class="sidebar-link${activa ? ' active' : ''}"${activa ? ' aria-current="page"' : ''}>${item.label}</a>${sublista}</div>`;
    }
    if (sidebar instanceof HTMLElement) {
        const utilidad = ENLACES_UTILIDAD[sesion.rol];
        sidebar.innerHTML = `
      <nav class="sidebar-nav" aria-label="Unidades">${ENLACES_UNIDADES.map(renderEnlace).join('')}</nav>
      ${utilidad.length > 0
            ? `<hr class="sidebar-divider"><nav class="sidebar-nav sidebar-nav--utility" aria-label="Administración">${utilidad.map(renderEnlace).join('')}</nav>`
            : ''}
    `;
    }
    // Toggle mobile del sidebar — mismo patrón (click, Escape, click-afuera)
    // que ya usa nav.js para el menú público, aplicado a este panel nuevo.
    const elToggle = document.getElementById('sidebarToggle');
    if (sidebar instanceof HTMLElement && elToggle instanceof HTMLElement) {
        // Re-vinculados con tipo explícito: los nested functions de más abajo no
        // heredan el angostamiento de tipo (narrowing) de las verificaciones de arriba.
        const sidebarEl = sidebar;
        const sidebarToggle = elToggle;
        function setSidebar(abierto) {
            sidebarEl.classList.toggle('open', abierto);
            sidebarToggle.setAttribute('aria-expanded', String(abierto));
            sidebarToggle.setAttribute('aria-label', abierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
        }
        sidebarToggle.addEventListener('click', () => {
            setSidebar(!sidebarEl.classList.contains('open'));
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebarEl.classList.contains('open')) {
                setSidebar(false);
                sidebarToggle.focus();
            }
        });
        document.addEventListener('click', (e) => {
            if (!sidebarEl.classList.contains('open'))
                return;
            const objetivo = e.target;
            if (objetivo instanceof Node && !sidebarEl.contains(objetivo) && !sidebarToggle.contains(objetivo)) {
                setSidebar(false);
            }
        });
    }
    // Menú de cuenta: "Reiniciar demo" (deliberadamente NO atado al logout —
    // eso dejaría a los roles de solo lectura sin forma de volver a ver datos,
    // ya que no tienen acceso a Importar; solo Webmaster/Admin lo deciden) +
    // "Cerrar sesión", siempre presente.
    if (menuLista instanceof HTMLElement) {
        // Re-vinculado con tipo explícito: los closures de más abajo no heredan el
        // angostamiento de tipo (narrowing) de la verificación de arriba.
        const listaCuenta = menuLista;
        const puedeReiniciar = sesion.rol === 'webmaster' || sesion.rol === 'admin';
        listaCuenta.innerHTML = `
      <li role="none"><button type="button" role="menuitem" id="userChipTour">Ver tour</button></li>
      ${puedeReiniciar ? '<li role="none"><button type="button" role="menuitem" id="userChipReset">Reiniciar demo</button></li>' : ''}
      <li role="none"><a role="menuitem" href="index.html" id="userChipLogout">Cerrar sesión</a></li>
    `;
        // El tour vive en el hub: ahí arranca directo; desde otra página se deja
        // una bandera "pendiente" y se navega al hub, que la consume al cargar.
        const verTour = document.getElementById('userChipTour');
        const toggleCuenta = document.getElementById('userChipToggle');
        if (verTour) {
            verTour.addEventListener('click', () => {
                listaCuenta.hidden = true;
                if (toggleCuenta)
                    toggleCuenta.setAttribute('aria-expanded', 'false');
                if (paginaActual === 'paneles') {
                    iniciarTour(sesion, 'manual');
                    return;
                }
                try {
                    sessionStorage.setItem(CLAVE_TOUR_PENDIENTE, '1');
                }
                catch {
                    // sin sessionStorage el tour no se puede pedir desde otra página.
                }
                window.location.href = 'paneles.html';
            });
        }
        const logout = document.getElementById('userChipLogout');
        if (logout) {
            logout.addEventListener('click', () => {
                trackEvento('logout', { user_role: sesion.rol });
                cerrarSesionDemo();
            });
        }
        const reiniciar = document.getElementById('userChipReset');
        if (reiniciar) {
            reiniciar.addEventListener('click', () => {
                try {
                    localStorage.removeItem(CLAVE_DATOS_IMPORTADOS);
                }
                catch {
                    // localStorage puede fallar en modo privado — no hay nada que limpiar en ese caso.
                }
                limpiarTourVisto();
                window.location.reload();
            });
        }
        initMenu('userChipToggle', 'userChipMenu');
    }
})();
//# sourceMappingURL=session.js.map