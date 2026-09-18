/** Toasts compartidos: mismo componente que playground.html (css/toasts.css),
 * reutilizado en los flujos reales que simulan una espera de red (login, importar). */

type ToastVariante = 'success' | 'error';

const DURACION_TOAST_MS = 4000;
const MAX_TOASTS_VISIBLES = 3;

function crearToast(contenedorId: string, variante: ToastVariante, mensaje: string): void {
  const contenedor = document.getElementById(contenedorId);
  if (!(contenedor instanceof HTMLElement)) return;

  const toast = document.createElement('div');
  toast.className = `c-toast c-toast--${variante}`;
  toast.textContent = mensaje;
  contenedor.appendChild(toast);

  while (contenedor.children.length > MAX_TOASTS_VISIBLES) {
    contenedor.firstElementChild?.remove();
  }

  window.setTimeout(() => toast.remove(), DURACION_TOAST_MS);
}
