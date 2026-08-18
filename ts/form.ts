interface SolicitudAcceso {
  nombre: string;
  correo: string;
  rol: string;
}

type CampoId = keyof SolicitudAcceso;

/** Validadores puros: solo reciben datos, nunca tocan el DOM. */
const validadores: Record<CampoId, (valor: string) => string | null> = {
  nombre(valor) {
    const limpio = valor.trim();
    if (limpio.length === 0) return 'Ingresa tu nombre completo.';
    if (limpio.length < 3) return 'El nombre debe tener al menos 3 caracteres.';
    return null;
  },
  correo: validarCorreoInstitucional,
  rol(valor) {
    return validarRequerido(valor, 'Selecciona el rol que solicitas.');
  },
};

function validarCampo(campo: CampoId, valor: string): string | null {
  return validadores[campo](valor);
}

function validarSolicitud(datos: SolicitudAcceso): Partial<Record<CampoId, string>> {
  const errores: Partial<Record<CampoId, string>> = {};
  (Object.keys(validadores) as CampoId[]).forEach((campo) => {
    const mensaje = validarCampo(campo, datos[campo]);
    if (mensaje) errores[campo] = mensaje;
  });
  return errores;
}

function esInputOSelect(value: unknown): value is HTMLInputElement | HTMLSelectElement {
  return value instanceof HTMLInputElement || value instanceof HTMLSelectElement;
}

(function initAccessForm(): void {
  const form = document.getElementById('access-form');
  if (!(form instanceof HTMLFormElement)) return;

  const status = document.getElementById('form-status');
  const submitBtn = form.querySelector('button[type="submit"]');
  const campos: CampoId[] = ['nombre', 'correo', 'rol'];

  function getInput(campo: CampoId): HTMLInputElement | HTMLSelectElement | null {
    const el = document.getElementById(campo);
    return esInputOSelect(el) ? el : null;
  }

  function mostrarError(campo: CampoId, mensaje: string | null, animar = false): void {
    const input = getInput(campo);
    const errorEl = document.getElementById(`${campo}-error`);
    const wrapper = input?.closest('.form-field');
    if (!input || !errorEl || !(wrapper instanceof HTMLElement)) return;

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

  function leerDatos(): SolicitudAcceso {
    return {
      nombre: (getInput('nombre') as HTMLInputElement | null)?.value ?? '',
      correo: (getInput('correo') as HTMLInputElement | null)?.value ?? '',
      rol: (getInput('rol') as HTMLSelectElement | null)?.value ?? '',
    };
  }

  function mostrarEstado(mensaje: string, tipo: 'success' | 'error'): void {
    if (!status) return;
    status.textContent = mensaje;
    status.classList.remove('is-success', 'is-error', 'anim-in');
    void status.offsetWidth; // fuerza reflow para repetir la animación en envíos sucesivos
    status.classList.add(tipo === 'success' ? 'is-success' : 'is-error', 'anim-in');
  }

  // Validación en tiempo real: al escribir y al salir del campo.
  campos.forEach((campo) => {
    const input = getInput(campo);
    if (!input) return;
    const revalidar = (): void => mostrarError(campo, validarCampo(campo, leerDatos()[campo]));
    input.addEventListener('input', revalidar);
    input.addEventListener('blur', revalidar);
  });

  form.addEventListener('submit', (evento: SubmitEvent) => {
    evento.preventDefault();
    const datos = leerDatos();
    const errores = validarSolicitud(datos);

    campos.forEach((campo) => mostrarError(campo, errores[campo] ?? null, true));

    if (Object.keys(errores).length > 0) {
      mostrarEstado('Revisa los campos marcados antes de continuar.', 'error');
      const primerCampoInvalido = campos.find((campo) => errores[campo]);
      if (primerCampoInvalido) getInput(primerCampoInvalido)?.focus();
      return;
    }

    if (submitBtn instanceof HTMLButtonElement) submitBtn.disabled = true;
    mostrarEstado(`Solicitud enviada. Te contactaremos a ${datos.correo}.`, 'success');
    form.reset();
    campos.forEach((campo) => mostrarError(campo, null));
    if (submitBtn instanceof HTMLButtonElement) submitBtn.disabled = false;
  });
})();
