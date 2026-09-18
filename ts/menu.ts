/** Menú desplegable accesible (trigger + role="menu"), extraído de
 * playground.ts porque ahora tiene un segundo consumidor real: el menú de
 * cuenta del header en las páginas internas (ver ts/session.ts). */
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
