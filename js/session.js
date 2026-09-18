"use strict";
/** Sesión demo compartida entre páginas internas (paneles, usuarios, importar).
 * No hay backend: el rol activo se guarda en localStorage, igual que el tema. */
const CLAVE_SESION = 'panelacademico-demo-rol';
/** La setea importar.ts tras un CSV exitoso; la leen los dashboards de unidad
 * (docencia/investigación/vinculación) para decidir placeholder vs. datos reales. */
const CLAVE_DATOS_IMPORTADOS = 'panelacademico-datos-importados';
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
const ENLACES_UNIDADES = [
    { href: 'paneles.html', label: 'Paneles' },
    { href: 'docencia.html', label: 'Docencia' },
    { href: 'investigacion.html', label: 'Investigación' },
    { href: 'vinculacion.html', label: 'Vinculación' },
];
const NAV_INTERNA = {
    webmaster: [
        ...ENLACES_UNIDADES,
        { href: 'usuarios.html', label: 'Usuarios' },
        { href: 'importar.html', label: 'Importar' },
    ],
    admin: [...ENLACES_UNIDADES, { href: 'importar.html', label: 'Importar' }],
    rectorado: ENLACES_UNIDADES,
    decanato: ENLACES_UNIDADES,
    visitante: ENLACES_UNIDADES,
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
/** Pinta el chip de usuario + nav interna en páginas autenticadas. Si la página
 * no tiene el marcado esperado (páginas públicas), no hace nada. */
(function initHeaderInterno() {
    const chipNombre = document.getElementById('userChipName');
    const navInterna = document.getElementById('internalNav');
    const logout = document.getElementById('userChipLogout');
    if (!chipNombre)
        return;
    const sesion = leerSesionDemo();
    if (!sesion) {
        window.location.href = 'iniciar-sesion.html';
        return;
    }
    chipNombre.textContent = sesion.nombre;
    const paginaActual = window.location.pathname.split('/').pop() ?? '';
    if (navInterna) {
        navInterna.innerHTML = NAV_INTERNA[sesion.rol]
            .map((item) => {
            const activa = item.href === paginaActual;
            return `<a href="${item.href}"${activa ? ' class="active" aria-current="page"' : ''}>${item.label}</a>`;
        })
            .join('');
    }
    if (logout) {
        logout.addEventListener('click', () => {
            trackEvento('logout', { user_role: sesion.rol });
            cerrarSesionDemo();
        });
    }
})();
//# sourceMappingURL=session.js.map