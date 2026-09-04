type ToastVariante = 'success' | 'error';

const DURACION_TOAST_MS = 4000;
const MAX_TOASTS_VISIBLES = 3;

(function initPlayground(): void {
  initAlertClose();
  initDialog();
  initMenu('pgMenuAccountToggle', 'pgMenuAccountList');
  initMenu('pgMenuIconToggle', 'pgMenuIconList');
  initToasts();

  function initAlertClose(): void {
    document.querySelectorAll('.c-alert-close').forEach((boton) => {
      boton.addEventListener('click', () => {
        const alerta = boton.closest('.c-alert');
        if (alerta instanceof HTMLElement) alerta.remove();
      });
    });
  }

  function initDialog(): void {
    const triggerEl = document.getElementById('pgDialogTrigger');
    const dialogEl = document.getElementById('pgConfirmDialog');
    const cancelEl = document.getElementById('pgDialogCancel');
    const confirmEl = document.getElementById('pgDialogConfirm');
    if (
      !(triggerEl instanceof HTMLButtonElement) ||
      !(dialogEl instanceof HTMLDialogElement) ||
      !(cancelEl instanceof HTMLButtonElement) ||
      !(confirmEl instanceof HTMLButtonElement)
    ) {
      return;
    }
    // Re-vinculados con tipo explícito: los listeners de más abajo no
    // heredan el angostamiento de tipo (narrowing) de las verificaciones de arriba.
    const trigger: HTMLButtonElement = triggerEl;
    const dialogo: HTMLDialogElement = dialogEl;
    const cancelar: HTMLButtonElement = cancelEl;
    const confirmar: HTMLButtonElement = confirmEl;

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

  function initMenu(toggleId: string, listId: string): void {
    const toggleEl = document.getElementById(toggleId);
    const listEl = document.getElementById(listId);
    if (!(toggleEl instanceof HTMLButtonElement) || !(listEl instanceof HTMLUListElement)) {
      return;
    }
    const toggle: HTMLButtonElement = toggleEl;
    const lista: HTMLUListElement = listEl;

    function abrir(): void {
      lista.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
    }

    function cerrar(devolverFoco: boolean): void {
      lista.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      if (devolverFoco) toggle.focus();
    }

    toggle.addEventListener('click', () => {
      if (lista.hidden) abrir();
      else cerrar(false);
    });

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !lista.hidden) cerrar(true);
    });

    document.addEventListener('click', (e: MouseEvent) => {
      if (lista.hidden) return;
      const objetivo = e.target;
      if (objetivo instanceof Node && !toggle.contains(objetivo) && !lista.contains(objetivo)) {
        cerrar(false);
      }
    });
  }

  function crearToast(contenedor: HTMLElement, variante: ToastVariante, mensaje: string): void {
    const toast = document.createElement('div');
    toast.className = `c-toast c-toast--${variante}`;
    toast.textContent = mensaje;
    contenedor.appendChild(toast);

    while (contenedor.children.length > MAX_TOASTS_VISIBLES) {
      contenedor.firstElementChild?.remove();
    }

    window.setTimeout(() => toast.remove(), DURACION_TOAST_MS);
  }

  function initToasts(): void {
    const contenedorEl = document.getElementById('pgToastContainer');
    const botonExitoEl = document.getElementById('pgToastShowSuccess');
    const botonErrorEl = document.getElementById('pgToastShowError');
    if (
      !(contenedorEl instanceof HTMLElement) ||
      !(botonExitoEl instanceof HTMLButtonElement) ||
      !(botonErrorEl instanceof HTMLButtonElement)
    ) {
      return;
    }
    const contenedor: HTMLElement = contenedorEl;
    const botonExito: HTMLButtonElement = botonExitoEl;
    const botonError: HTMLButtonElement = botonErrorEl;

    // Los toasts de ejemplo ya están en el HTML al cargar la página;
    // también se retiran solos, igual que cualquier toast creado después.
    Array.from(contenedor.children).forEach((hijo) => {
      window.setTimeout(() => hijo.remove(), DURACION_TOAST_MS);
    });

    botonExito.addEventListener('click', () => {
      crearToast(contenedor, 'success', 'Los cambios se guardaron correctamente.');
    });

    botonError.addEventListener('click', () => {
      crearToast(contenedor, 'error', 'No se pudo completar la solicitud. Intenta de nuevo.');
    });
  }
})();
