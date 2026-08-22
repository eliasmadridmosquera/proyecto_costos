"use strict";
/** Validadores puros: solo reciben datos, nunca tocan el DOM. */
const validadores = {
    nombre(valor) {
        const limpio = valor.trim();
        if (limpio.length === 0)
            return 'Ingresa tu nombre completo.';
        if (limpio.length < 3)
            return 'El nombre debe tener al menos 3 caracteres.';
        return null;
    },
    correo: validarCorreoInstitucional,
    rol(valor) {
        return validarRequerido(valor, 'Selecciona el rol que solicitas.');
    },
};
function validarCampo(campo, valor) {
    return validadores[campo](valor);
}
function validarSolicitud(datos) {
    const errores = {};
    Object.keys(validadores).forEach((campo) => {
        const mensaje = validarCampo(campo, datos[campo]);
        if (mensaje)
            errores[campo] = mensaje;
    });
    return errores;
}
function esInputOSelect(value) {
    return value instanceof HTMLInputElement || value instanceof HTMLSelectElement;
}
(function initAccessForm() {
    const form = document.getElementById('access-form');
    if (!(form instanceof HTMLFormElement))
        return;
    const status = document.getElementById('form-status');
    const submitBtn = form.querySelector('button[type="submit"]');
    const campos = ['nombre', 'correo', 'rol'];
    function getInput(campo) {
        const el = document.getElementById(campo);
        return esInputOSelect(el) ? el : null;
    }
    function mostrarError(campo, mensaje, animar = false) {
        const input = getInput(campo);
        const errorEl = document.getElementById(`${campo}-error`);
        const wrapper = input?.closest('.form-field');
        if (!input || !errorEl || !(wrapper instanceof HTMLElement))
            return;
        errorEl.textContent = mensaje ?? '';
        input.setAttribute('aria-invalid', mensaje ? 'true' : 'false');
        wrapper.classList.toggle('is-invalid', Boolean(mensaje));
        // Feedback visual: solo se anima al validar el envío completo, no en cada
        // pulsación, para no "temblar" la pantalla mientras el usuario escribe.
        if (animar && mensaje) {
            wrapper.classList.remove('shake');
            void wrapper.offsetWidth; // fuerza reflow para poder repetir la animación
            wrapper.classList.add('shake');
        }
    }
    function leerDatos() {
        return {
            nombre: getInput('nombre')?.value ?? '',
            correo: getInput('correo')?.value ?? '',
            rol: getInput('rol')?.value ?? '',
        };
    }
    function mostrarEstado(mensaje, tipo) {
        if (!status)
            return;
        status.textContent = mensaje;
        status.classList.remove('is-success', 'is-error', 'anim-in');
        void status.offsetWidth; // fuerza reflow para repetir la animación en envíos sucesivos
        status.classList.add(tipo === 'success' ? 'is-success' : 'is-error', 'anim-in');
    }
    // Validación en tiempo real: al escribir y al salir del campo.
    campos.forEach((campo) => {
        const input = getInput(campo);
        if (!input)
            return;
        const revalidar = () => mostrarError(campo, validarCampo(campo, leerDatos()[campo]));
        input.addEventListener('input', revalidar);
        input.addEventListener('blur', revalidar);
    });
    form.addEventListener('submit', (evento) => {
        evento.preventDefault();
        const datos = leerDatos();
        const errores = validarSolicitud(datos);
        campos.forEach((campo) => mostrarError(campo, errores[campo] ?? null, true));
        if (Object.keys(errores).length > 0) {
            mostrarEstado('Revisa los campos marcados antes de continuar.', 'error');
            const primerCampoInvalido = campos.find((campo) => errores[campo]);
            if (primerCampoInvalido)
                getInput(primerCampoInvalido)?.focus();
            return;
        }
        if (submitBtn instanceof HTMLButtonElement)
            submitBtn.disabled = true;
        mostrarEstado(`Solicitud enviada. Un Webmaster la revisará y te contactará a ${datos.correo} con tus credenciales.`, 'success');
        form.reset();
        campos.forEach((campo) => mostrarError(campo, null));
        if (submitBtn instanceof HTMLButtonElement)
            submitBtn.disabled = false;
    });
})();
//# sourceMappingURL=form.js.map