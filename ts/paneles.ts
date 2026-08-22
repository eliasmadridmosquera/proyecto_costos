type TabId = CategoriaPanel['id'] | 'asistente';

interface MensajeChat {
  autor: 'user' | 'bot';
  texto: string;
}

(function initPaneles(): void {
  const sesionActual = leerSesionDemo();
  if (!sesionActual) return; // session.ts ya redirige a iniciar-sesion.html

  const sesion: SesionDemo = sesionActual;

  const roleBanner = document.getElementById('roleBanner');
  const tabsEl = document.getElementById('panelTabs');
  const bodyEl = document.getElementById('panelBody');
  if (!(roleBanner instanceof HTMLElement) || !(tabsEl instanceof HTMLElement) || !(bodyEl instanceof HTMLElement)) {
    return;
  }
  // Re-vinculados con tipo explícito: los nested functions de más abajo no
  // heredan el angostamiento de tipo (narrowing) de las verificaciones de arriba.
  const tabsElemento: HTMLElement = tabsEl;
  const bodyElemento: HTMLElement = bodyEl;

  const puedeExportar = sesion.rol !== 'visitante';

  roleBanner.innerHTML =
    sesion.rol === 'decanato'
      ? `Estás viendo la facultad de <strong>${sesion.facultad}</strong> + el benchmark institucional agregado. Ninguna otra facultad es visible desde este rol.`
      : puedeExportar
        ? 'Estás viendo el panorama institucional completo.'
        : 'Estás viendo el panorama institucional completo. Modo visitante: exportar y calculadora están desactivados.';

  function formatearMoneda(valor: number): string {
    const signo = valor < 0 ? '-' : '+';
    return `${signo}$${Math.abs(valor).toLocaleString('es-EC')}`;
  }

  function formatearIndice(valor: number): string {
    const signo = valor > 0 ? '+' : valor < 0 ? '-' : '';
    return `${signo}${Math.abs(valor)}`;
  }

  function iconoTendencia(t: Tendencia): string {
    if (t === 'alza') return '▲';
    if (t === 'baja') return '▼';
    return '●';
  }

  function claseBalance(valor: number): string {
    return valor >= 0 ? 'is-positive' : 'is-negative';
  }

  // El filtrado por facultad ocurre solo en lo que se pinta en pantalla — al ser
  // frontend puro sin backend, no hay una frontera de seguridad real todavía.
  // El criterio de aceptación de filtrado server-side vive en plan.md, pendiente
  // de la API real.
  function calcularBenchmark(categoria: CategoriaPanel): FilaFacultad {
    const n = categoria.filas.length;
    const suma = categoria.filas.reduce(
      (acc, f) => ({
        docentes: acc.docentes + f.docentes,
        costoTotal: acc.costoTotal + f.costoTotal,
        balance: acc.balance + f.balance,
      }),
      { docentes: 0, costoTotal: 0, balance: 0 }
    );
    return {
      facultad: 'Benchmark institucional (agregado)',
      docentes: Math.round(suma.docentes / n),
      costoTotal: Math.round(suma.costoTotal / n),
      balance: Math.round(suma.balance / n),
      tendencia: 'estable',
    };
  }

  function filasVisibles(categoria: CategoriaPanel): FilaFacultad[] {
    if (sesion.rol !== 'decanato') return categoria.filas;
    const propia = categoria.filas.find((f) => f.facultad === sesion.facultad);
    return propia ? [propia, calcularBenchmark(categoria)] : [calcularBenchmark(categoria)];
  }

  function renderizarDashboard(categoria: CategoriaPanel): string {
    const filas = filasVisibles(categoria);
    const filasParaStats = sesion.rol === 'decanato' ? filas.slice(0, 1) : filas;
    const totalDocentes = filasParaStats.reduce((acc, f) => acc + f.docentes, 0);
    const totalCosto = filasParaStats.reduce((acc, f) => acc + f.costoTotal, 0);
    const enPositivo = filasParaStats.filter((f) => f.balance >= 0).length;
    const esIndice = categoria.id === 'calidad';

    const filasHtml = filas
      .map((f) => {
        const esBenchmark = f.facultad.startsWith('Benchmark');
        return `<tr${esBenchmark ? ' class="is-benchmark"' : ''}>
          <td>${f.facultad}</td>
          <td>${f.docentes.toLocaleString('es-EC')}</td>
          <td>$${f.costoTotal.toLocaleString('es-EC')}</td>
          <td class="${claseBalance(f.balance)}">${esIndice ? formatearIndice(f.balance) : formatearMoneda(f.balance)}</td>
          <td>${iconoTendencia(f.tendencia)}</td>
        </tr>`;
      })
      .join('');

    const atributosDeshabilitado = puedeExportar ? '' : ' disabled title="No disponible en modo visitante"';

    return `
      <p class="panel-desc">${categoria.descripcion}</p>
      <div class="stat-grid">
        <div class="stat-card">
          <span class="stat-label">${esIndice ? 'Estudiantes' : 'Docentes'}</span>
          <span class="stat-value">${totalDocentes.toLocaleString('es-EC')}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Costo total</span>
          <span class="stat-value">$${totalCosto.toLocaleString('es-EC')}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">${categoria.etiquetaMetrica3}</span>
          <span class="stat-value">${enPositivo} / ${filasParaStats.length}</span>
        </div>
      </div>
      <div class="panel-actions">
        <button type="button" class="btn-secondary"${atributosDeshabilitado}>Exportar</button>
        <button type="button" class="btn-secondary"${atributosDeshabilitado}>Calculadora</button>
      </div>
      <div class="table-scroll-full">
        <table class="data-table">
          <thead>
            <tr>
              <th>Facultad</th>
              <th>${esIndice ? 'Estudiantes' : 'Docentes'}</th>
              <th>Costo total</th>
              <th>Balance</th>
              <th>Tendencia</th>
            </tr>
          </thead>
          <tbody>${filasHtml}</tbody>
        </table>
      </div>
    `;
  }

  const CATEGORIA_CHAT = PANELES.find((p) => p.id === 'docencia') ?? PANELES[0];
  const mensajesChat: MensajeChat[] = [
    {
      autor: 'bot',
      texto: `Demo — respuestas precargadas sobre los datos de ${CATEGORIA_CHAT.titulo}. El asistente real se conecta a la API del backend (ver plan.md).`,
    },
  ];

  function responderPregunta(pregunta: string): string {
    const q = pregunta.toLowerCase();
    if (q.includes('déficit') || q.includes('deficit')) {
      const enDeficit = CATEGORIA_CHAT.filas.filter((f) => f.balance < 0).map((f) => f.facultad);
      return enDeficit.length
        ? `En ${CATEGORIA_CHAT.titulo}, las facultades en déficit son: ${enDeficit.join(', ')}.`
        : `Ninguna facultad está en déficit en ${CATEGORIA_CHAT.titulo} este período.`;
    }
    if (q.includes('superávit') || q.includes('superavit')) {
      const enSuperavit = CATEGORIA_CHAT.filas.filter((f) => f.balance >= 0).map((f) => f.facultad);
      return `Facultades en superávit (${CATEGORIA_CHAT.titulo}): ${enSuperavit.join(', ')}.`;
    }
    if (q.includes('tendencia')) {
      const enAlza = CATEGORIA_CHAT.filas.filter((f) => f.tendencia === 'alza').map((f) => f.facultad);
      return `Con tendencia al alza: ${enAlza.join(', ') || 'ninguna facultad'}.`;
    }
    if (q.includes('costo') || q.includes('total')) {
      const total = CATEGORIA_CHAT.filas.reduce((acc, f) => acc + f.costoTotal, 0);
      return `El costo total de ${CATEGORIA_CHAT.titulo} en el período es de $${total.toLocaleString('es-EC')}.`;
    }
    return 'Esta es una demo con respuestas precargadas. Prueba preguntar por "déficit", "superávit", "tendencia" o "costo total".';
  }

  function pintarMensajes(contenedor: HTMLElement): void {
    contenedor.innerHTML = mensajesChat
      .map((m) => `<div class="chat-message chat-message-${m.autor}">${m.texto}</div>`)
      .join('');
    contenedor.scrollTop = contenedor.scrollHeight;
  }

  function renderizarChat(): string {
    return `
      <p class="panel-desc">Pregúntale a tus datos sobre ${CATEGORIA_CHAT.titulo} — respuestas precargadas, sin conexión real a un modelo todavía.</p>
      <div class="chat-box">
        <div class="chat-messages" id="chatMessages" aria-live="polite"></div>
        <form class="chat-input-row" id="chatForm">
          <label class="sr-only" for="chatInput">Escribe tu pregunta</label>
          <input type="text" id="chatInput" placeholder="Ej: ¿qué facultades están en déficit?" autocomplete="off">
          <button type="submit" class="btn-primary">Enviar</button>
        </form>
      </div>
    `;
  }

  function vincularChat(): void {
    const form = document.getElementById('chatForm');
    const input = document.getElementById('chatInput');
    const contenedor = document.getElementById('chatMessages');
    if (!(form instanceof HTMLFormElement) || !(input instanceof HTMLInputElement) || !(contenedor instanceof HTMLElement)) {
      return;
    }
    const mensajesEl: HTMLElement = contenedor;
    pintarMensajes(mensajesEl);

    form.addEventListener('submit', (e: SubmitEvent) => {
      e.preventDefault();
      const pregunta = input.value.trim();
      if (!pregunta) return;
      mensajesChat.push({ autor: 'user', texto: pregunta });
      mensajesChat.push({ autor: 'bot', texto: responderPregunta(pregunta) });
      pintarMensajes(mensajesEl);
      input.value = '';
      input.focus();
    });
  }

  const tabs: { id: TabId; label: string }[] = [
    ...PANELES.map((p) => ({ id: p.id as TabId, label: p.titulo })),
    { id: 'asistente', label: 'Asistente IA' },
  ];

  function activarTab(id: TabId): void {
    tabsElemento.querySelectorAll('.panel-tab').forEach((btn) => {
      const esActiva = btn.getAttribute('data-tab') === id;
      btn.classList.toggle('active', esActiva);
      btn.setAttribute('aria-selected', String(esActiva));
    });

    if (id === 'asistente') {
      bodyElemento.innerHTML = renderizarChat();
      vincularChat();
      return;
    }

    const categoria = PANELES.find((p) => p.id === id);
    if (categoria) bodyElemento.innerHTML = renderizarDashboard(categoria);
  }

  tabsElemento.innerHTML = tabs
    .map(
      (t) =>
        `<button type="button" class="panel-tab" role="tab" aria-selected="false" data-tab="${t.id}">${t.label}</button>`
    )
    .join('');

  tabsElemento.querySelectorAll('.panel-tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-tab');
      if (id === 'asistente' || PANELES.some((p) => p.id === id)) activarTab(id as TabId);
    });
  });

  activarTab(PANELES[0].id);
})();
