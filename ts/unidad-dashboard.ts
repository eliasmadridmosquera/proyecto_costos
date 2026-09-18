/** Motor compartido por las 3 unidades sustantivas (Docencia/Investigación/
 * Vinculación) — generalizado a partir de lo que antes vivía solo en
 * paneles.ts (tabs con roving tabindex, scoping por rol, render de tabla),
 * ahora con más de un consumidor real. */

type Tendencia = 'alza' | 'baja' | 'estable';

interface FilaUnidad {
  facultad: string;
  metricaPrincipal: number;
  costoTotal: number;
  balance: number;
  tendencia: Tendencia;
}

interface VistaUnidad {
  id: string;
  titulo: string;
  descripcion: string;
  etiquetaMetricaPrincipal: string;
  etiquetaMetrica3: string;
  esIndice: boolean;
  filas: FilaUnidad[];
}

/** Categoría fija (Gestión X / X / Resumen general) — cada una puede alojar
 * más de un dashboard/análisis (hoy exactamente 1 cada una; agregar el 2do
 * es solo sumar un elemento a `dashboards`, sin tocar navegación). */
interface CategoriaUnidad {
  id: string;
  titulo: string;
  dashboards: VistaUnidad[];
}

/** El SDK de Chart.js se carga como script global vía CDN (ver <head> de cada
 * página de unidad) — declaración ambiental mínima, no hay @types instalado. */
interface ChartConfigMinimo {
  type: 'bar';
  data: {
    labels: string[];
    datasets: { data: number[]; backgroundColor: string; borderRadius?: number }[];
  };
  options?: Record<string, unknown>;
}
declare class Chart {
  constructor(ctx: CanvasRenderingContext2D, config: ChartConfigMinimo);
  destroy(): void;
}

/** Simula el tiempo de carga de un dashboard real (no hay backend todavía). */
const DURACION_CARGA_DASHBOARD_MS = 800;

function renderCargando(): string {
  return `
    <div class="dashboard-loading" role="status">
      <span class="dashboard-loading-spinner" aria-hidden="true"></span>
      <p>Cargando dashboard…</p>
    </div>
  `;
}

function renderPlaceholderVacio(): string {
  return `
    <div class="empty-state">
      <p class="empty-state-title">Todavía no hay datos cargados</p>
      <p class="empty-state-text">Importa el archivo base del año para ver esta información calculada.</p>
      <a class="btn-primary" href="importar.html">Ir a Importar</a>
    </div>
  `;
}

function formatearMonedaUnidad(valor: number): string {
  const signo = valor < 0 ? '-' : '+';
  return `${signo}$${Math.abs(valor).toLocaleString('es-EC')}`;
}

function formatearIndiceUnidad(valor: number): string {
  const signo = valor > 0 ? '+' : valor < 0 ? '-' : '';
  return `${signo}${Math.abs(valor)}`;
}

function iconoTendenciaUnidad(t: Tendencia): string {
  if (t === 'alza') return '▲';
  if (t === 'baja') return '▼';
  return '●';
}

function claseBalanceUnidad(valor: number): string {
  return valor >= 0 ? 'is-positive' : 'is-negative';
}

function calcularBenchmarkUnidad(filas: FilaUnidad[]): FilaUnidad {
  const n = filas.length;
  const suma = filas.reduce(
    (acc, f) => ({
      metricaPrincipal: acc.metricaPrincipal + f.metricaPrincipal,
      costoTotal: acc.costoTotal + f.costoTotal,
      balance: acc.balance + f.balance,
    }),
    { metricaPrincipal: 0, costoTotal: 0, balance: 0 }
  );
  return {
    facultad: 'Benchmark institucional (agregado)',
    metricaPrincipal: Math.round(suma.metricaPrincipal / n),
    costoTotal: Math.round(suma.costoTotal / n),
    balance: Math.round(suma.balance / n),
    tendencia: 'estable',
  };
}

/** Decanato ve solo su facultad + el benchmark agregado — mismo criterio que
 * ya estaba probado en paneles.ts. Filtrado solo en el render: sin backend
 * real todavía no hay una frontera de seguridad server-side (ver plan.md). */
function filasParaRol(filas: FilaUnidad[], sesion: SesionDemo, filtroFacultad: string | null): FilaUnidad[] {
  if (sesion.rol === 'decanato') {
    const propia = filas.find((f) => f.facultad === sesion.facultad);
    return propia ? [propia, calcularBenchmarkUnidad(filas)] : [calcularBenchmarkUnidad(filas)];
  }
  if (filtroFacultad) return filas.filter((f) => f.facultad === filtroFacultad);
  return filas;
}

function renderStatCardsUnidad(cards: { etiqueta: string; valor: string }[]): string {
  return `<div class="stat-grid">${cards
    .map(
      (c) => `
    <div class="stat-card">
      <span class="stat-label">${c.etiqueta}</span>
      <span class="stat-value">${c.valor}</span>
    </div>`
    )
    .join('')}</div>`;
}

function renderFiltroFacultad(facultades: string[], activo: string | null): string {
  const pill = (etiqueta: string, valor: string | null): string =>
    `<button type="button" class="faculty-pill${valor === activo ? ' is-active' : ''}" data-facultad="${valor ?? ''}">${etiqueta}</button>`;
  return `<div class="faculty-filter" role="group" aria-label="Filtrar por facultad">
    ${pill('Todas', null)}
    ${facultades.map((f) => pill(f, f)).join('')}
  </div>`;
}

function renderTablaUnidad(vista: VistaUnidad, filas: FilaUnidad[]): string {
  const filasHtml = filas
    .map((f) => {
      const esBenchmark = f.facultad.startsWith('Benchmark');
      return `<tr${esBenchmark ? ' class="is-benchmark"' : ''}>
        <td>${f.facultad}</td>
        <td>${f.metricaPrincipal.toLocaleString('es-EC')}</td>
        <td>$${f.costoTotal.toLocaleString('es-EC')}</td>
        <td class="${claseBalanceUnidad(f.balance)}">${vista.esIndice ? formatearIndiceUnidad(f.balance) : formatearMonedaUnidad(f.balance)}</td>
        <td>${iconoTendenciaUnidad(f.tendencia)}</td>
      </tr>`;
    })
    .join('');

  return `
    <div class="table-scroll-full">
      <table class="data-table">
        <thead>
          <tr>
            <th>Facultad</th>
            <th>${vista.etiquetaMetricaPrincipal}</th>
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

/** Lee un token de color ya resuelto (no un var() crudo) porque Chart.js pinta
 * en <canvas>, no en CSS — así el gráfico igual respeta el tema activo. */
function tokenColor(nombre: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(nombre).trim();
}

function crearGraficoBarras(canvas: HTMLCanvasElement, filas: FilaUnidad[]): Chart | null {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: filas.map((f) => f.facultad),
      datasets: [{ data: filas.map((f) => f.costoTotal), backgroundColor: tokenColor('--color-primary'), borderRadius: 6 }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { color: tokenColor('--text-muted') }, grid: { color: tokenColor('--border') } },
        x: { ticks: { color: tokenColor('--text-muted') }, grid: { display: false } },
      },
    },
  });
}

/** Contexto que lee el asistente flotante (ts/asistente-flotante.ts) para
 * responder sobre la unidad/dashboard que el usuario tiene abierta en ese
 * momento — antes el chat vivía fijo a Docencia sin importar el tab. */
interface ContextoAsistente {
  unidad: string;
  vista: VistaUnidad;
}
let contextoAsistente: ContextoAsistente | null = null;

/** Motor de página de unidad: pinta las categorías fijas en el sub-menú del
 * sidebar (con deep-linking por hash), y dentro del área de contenido, si la
 * categoría activa tiene más de 1 dashboard, agrega un selector de pills para
 * elegir cuál — reutiliza el resto del mecanismo (stat-cards, filtro de
 * facultad, tabla, gráfico) sin cambios. */
function initUnidadPagina(unidadHref: string, unidadLabel: string, subId: string, categorias: CategoriaUnidad[]): void {
  const sesionActual = leerSesionDemo();
  if (!sesionActual) return; // session.ts ya redirige a iniciar-sesion.html

  const sesion: SesionDemo = sesionActual;

  const roleBanner = document.getElementById('roleBanner');
  const elSublista = document.getElementById(`sidebarSub-${subId}`);
  const elBody = document.getElementById('panelBody');
  if (!(roleBanner instanceof HTMLElement) || !(elSublista instanceof HTMLElement) || !(elBody instanceof HTMLElement)) {
    return;
  }
  // Re-vinculados con tipo explícito: los nested functions de más abajo no
  // heredan el angostamiento de tipo (narrowing) de las verificaciones de arriba.
  const sublista: HTMLElement = elSublista;
  const bodyElemento: HTMLElement = elBody;

  roleBanner.innerHTML =
    sesion.rol === 'decanato'
      ? `Estás viendo la facultad de <strong>${sesion.facultad}</strong> + el benchmark institucional agregado.`
      : `Estás viendo el panorama institucional completo de ${unidadLabel}.`;

  let temporizadorCarga: number | null = null;

  function renderCategoria(categoria: CategoriaUnidad): void {
    if (!hayDatosImportados()) {
      bodyElemento.innerHTML = renderPlaceholderVacio();
      return;
    }

    // Se fija el contexto del asistente ya, sin esperar a que termine la
    // carga — si el usuario abre el chat durante el spinner, igual sabe dónde está.
    contextoAsistente = { unidad: unidadLabel, vista: categoria.dashboards[0] };
    bodyElemento.innerHTML = renderCargando();
    temporizadorCarga = window.setTimeout(() => montarDashboard(categoria), DURACION_CARGA_DASHBOARD_MS);
  }

  function montarDashboard(categoria: CategoriaUnidad): void {
    // El tiempo medido es el del render en sí, sin la espera simulada.
    const inicioRender = performance.now();
    let indiceDashboard = 0;
    let filtroFacultad: string | null = null;
    let chartActual: Chart | null = null;
    const mostrarFiltro = sesion.rol !== 'decanato';

    function pintar(): void {
      const dashboard = categoria.dashboards[indiceDashboard];
      const filas = filasParaRol(dashboard.filas, sesion, filtroFacultad);
      const totalMetrica = filas.reduce((acc, f) => acc + f.metricaPrincipal, 0);
      const totalCosto = filas.reduce((acc, f) => acc + f.costoTotal, 0);
      const enPositivo = filas.filter((f) => f.balance >= 0).length;

      const selectorDashboards =
        categoria.dashboards.length > 1
          ? `<div class="dashboard-pill-row" role="group" aria-label="Elegir análisis">${categoria.dashboards
              .map(
                (d, i) =>
                  `<button type="button" class="dashboard-pill${i === indiceDashboard ? ' is-active' : ''}" data-indice="${i}">${d.titulo}</button>`
              )
              .join('')}</div>`
          : '';

      bodyElemento.innerHTML = `
        ${selectorDashboards}
        <p class="panel-desc">${dashboard.descripcion}</p>
        ${renderStatCardsUnidad([
          { etiqueta: dashboard.etiquetaMetricaPrincipal, valor: totalMetrica.toLocaleString('es-EC') },
          { etiqueta: 'Costo total', valor: `$${totalCosto.toLocaleString('es-EC')}` },
          { etiqueta: dashboard.etiquetaMetrica3, valor: `${enPositivo} / ${filas.length}` },
        ])}
        ${mostrarFiltro ? renderFiltroFacultad(FACULTADES_DEMO, filtroFacultad) : ''}
        <div class="chart-box"><canvas id="chart-${categoria.id}-${indiceDashboard}"></canvas></div>
        ${renderTablaUnidad(dashboard, filas)}
      `;

      if (chartActual) chartActual.destroy();
      const canvas = document.getElementById(`chart-${categoria.id}-${indiceDashboard}`);
      if (canvas instanceof HTMLCanvasElement) chartActual = crearGraficoBarras(canvas, filas);

      if (categoria.dashboards.length > 1) {
        bodyElemento.querySelectorAll<HTMLButtonElement>('.dashboard-pill').forEach((btn) => {
          btn.addEventListener('click', () => {
            const i = Number(btn.getAttribute('data-indice'));
            if (Number.isNaN(i)) return;
            indiceDashboard = i;
            filtroFacultad = null;
            pintar();
          });
        });
      }

      if (mostrarFiltro) {
        bodyElemento.querySelectorAll<HTMLButtonElement>('.faculty-pill').forEach((btn) => {
          btn.addEventListener('click', () => {
            filtroFacultad = btn.getAttribute('data-facultad') || null;
            pintar();
          });
        });
      }

      contextoAsistente = { unidad: unidadLabel, vista: dashboard };
    }

    pintar();

    trackEvento('dashboard_category_viewed', {
      user_role: sesion.rol,
      analysis_context: `${subId}:${categoria.id}`,
      render_time_ms: Math.round(performance.now() - inicioRender),
    });
  }

  function activarCategoria(id: string): void {
    // Si el usuario cambia de categoría mientras la anterior aún "carga",
    // se descarta esa carga pendiente para que no pise a la nueva.
    if (temporizadorCarga !== null) window.clearTimeout(temporizadorCarga);
    const categoria = categorias.find((c) => c.id === id) ?? categorias[0];
    sublista.querySelectorAll('a').forEach((a) => {
      a.classList.toggle('active', a.getAttribute('data-categoria') === categoria.id);
    });
    renderCategoria(categoria);
  }

  sublista.innerHTML = categorias
    .map((c) => `<li><a href="${unidadHref}#${c.id}" data-categoria="${c.id}">${c.titulo}</a></li>`)
    .join('');

  window.addEventListener('hashchange', () => {
    activarCategoria(window.location.hash.slice(1));
  });

  activarCategoria(window.location.hash.slice(1));

  trackEvento('dashboard_loaded', {
    user_role: sesion.rol,
    dashboard_type: sesion.rol === 'decanato' ? 'faculty_overview' : 'institution_overview',
    unit: subId,
  });
}
