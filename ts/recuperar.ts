(function initRecuperarForm(): void {
  const form = document.getElementById('recuperar-form');
  if (!(form instanceof HTMLFormElement)) return;

  const status = document.getElementById('form-status');
  const elCorreo = document.getElementById('correo');
  if (!(elCorreo instanceof HTMLInputElement)) return;
  const input: HTMLInputElement = elCorreo;

  function mostrarError(mensaje: string | null, animar = false): void {
    const errorEl = document.getElementById('correo-error');
    const wrapper = input.closest('.form-field');
    if (!errorEl || !(wrapper instanceof HTMLElement)) return;

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

  const revalidar = (): void => mostrarError(validarCorreoInstitucional(input.value));
  input.addEventListener('input', revalidar);
  input.addEventListener('blur', revalidar);

  form.addEventListener('submit', (evento: SubmitEvent) => {
    evento.preventDefault();
    const mensaje = validarCorreoInstitucional(input.value);
    mostrarError(mensaje, true);

    if (mensaje) {
      mostrarEstado('Revisa el correo ingresado antes de continuar.', 'error');
      input.focus();
      return;
    }

    // No se confirma ni se niega si el correo existe: evita que alguien
    // use este formulario para averiguar qué cuentas están registradas.
    mostrarEstado(
      'Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña.',
      'success'
    );
    form.reset();
    mostrarError(null);
  });
})();
