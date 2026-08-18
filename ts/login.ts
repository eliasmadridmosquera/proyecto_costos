interface Credenciales {
  correo: string;
  contrasena: string;
}

type CampoLogin = keyof Credenciales;

const validadoresLogin: Record<CampoLogin, (valor: string) => string | null> = {
  correo: validarCorreoInstitucional,
  contrasena(valor) {
    if (valor.length === 0) return 'Ingresa tu contraseña.';
    if (valor.length < 8) return 'Debe tener al menos 8 caracteres.';
    return null;
  },
};

function esInputElement(value: unknown): value is HTMLInputElement {
  return value instanceof HTMLInputElement;
}

(function initLoginForm(): void {
  const form = document.getElementById('login-form');
  if (!(form instanceof HTMLFormElement)) return;

  const status = document.getElementById('form-status');
  const campos: CampoLogin[] = ['correo', 'contrasena'];

  function getInput(campo: CampoLogin): HTMLInputElement | null {
    const el = document.getElementById(campo);
    return esInputElement(el) ? el : null;
  }

  function mostrarError(campo: CampoLogin, mensaje: string | null, animar = false): void {
    const input = getInput(campo);
    const errorEl = document.getElementById(`${campo}-error`);
    const wrapper = input?.closest('.form-field');
    if (!input || !errorEl || !(wrapper instanceof HTMLElement)) return;

    errorEl.textContent = mensaje ?? '';
    input.setAttribute('aria-invalid', mensaje ? 'true' : 'false');
    wrapper.classList.toggle('is-invalid', Boolean(mensaje));

    if (animar && mensaje) {
      wrapper.classList.remove('shake');
      void wrapper.offsetWidth;
      wrapper.classList.add('shake');
    }
  }

  function mostrarEstado(mensaje: string, tipo: 'success' | 'error'): void {
    if (!status) return;
    status.textContent = mensaje;
    status.classList.remove('is-success', 'is-error', 'anim-in');
    void status.offsetWidth;
    status.classList.add(tipo === 'success' ? 'is-success' : 'is-error', 'anim-in');
  }

  campos.forEach((campo) => {
    const input = getInput(campo);
    if (!input) return;
    const revalidar = (): void => mostrarError(campo, validadoresLogin[campo](input.value));
    input.addEventListener('input', revalidar);
    input.addEventListener('blur', revalidar);
  });

  form.addEventListener('submit', (evento: SubmitEvent) => {
    evento.preventDefault();
    const datos: Credenciales = {
      correo: getInput('correo')?.value ?? '',
      contrasena: getInput('contrasena')?.value ?? '',
    };

    const errores: Partial<Record<CampoLogin, string>> = {};
    campos.forEach((campo) => {
      const mensaje = validadoresLogin[campo](datos[campo]);
      if (mensaje) errores[campo] = mensaje;
      mostrarError(campo, mensaje ?? null, true);
    });

    if (Object.keys(errores).length > 0) {
      mostrarEstado('Revisa los campos marcados antes de continuar.', 'error');
      const primerInvalido = campos.find((campo) => errores[campo]);
      if (primerInvalido) getInput(primerInvalido)?.focus();
      return;
    }

    mostrarEstado(
      'Credenciales válidas (demo). El inicio de sesión real requiere el backend — ver hoja de ruta del proyecto.',
      'success'
    );
  });
})();
