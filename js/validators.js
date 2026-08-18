"use strict";
/** Validadores compartidos entre registro.html, iniciar-sesion.html y recuperar-clave.html. */
const DOMINIO_INSTITUCIONAL = '@universidadejemplo.edu';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validarCorreoInstitucional(valor) {
    const limpio = valor.trim();
    if (limpio.length === 0)
        return 'Ingresa tu correo institucional.';
    if (!EMAIL_PATTERN.test(limpio))
        return 'El formato del correo no es válido.';
    if (!limpio.toLowerCase().endsWith(DOMINIO_INSTITUCIONAL)) {
        return `El correo debe terminar en ${DOMINIO_INSTITUCIONAL}.`;
    }
    return null;
}
function validarRequerido(valor, mensaje) {
    return valor.trim().length === 0 ? mensaje : null;
}
//# sourceMappingURL=validators.js.map