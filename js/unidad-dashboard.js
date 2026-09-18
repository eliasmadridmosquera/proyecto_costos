"use strict";
/** Motor compartido por las 3 unidades sustantivas (Docencia/Investigación/
 * Vinculación) — generalizado a partir de lo que antes vivía solo en
 * paneles.ts (tabs con roving tabindex, scoping por rol, render de tabla),
 * ahora con más de un consumidor real. */
function hayDatosImportados() {
    try {
        return localStorage.getItem(CLAVE_DATOS_IMPORTADOS) === 'true';
    }
    catch {
        return false;
    }
}
function renderPlaceholderVacio() {
    return `
    <div class="empty-state">
      <p class="empty-state-title">Todavía no hay datos cargados</p>
      <p class="empty-state-text">Importa el archivo base del año para ver esta información calculada.</p>
      <a class="btn-primary" href="importar.html">Ir a Importar</a>
    </div>
  `;
}
function formatearMonedaUnidad(valor) {
    const signo = valor < 0 ? '-' : '+';
    return `${signo}$${Math.abs(valor).toLocaleString('es-EC')}`;
}
function formatearIndiceUnidad(valor) {
    const signo = valor > 0 ? '+' : valor < 0 ? '-' : '';
    return `${signo}${Math.abs(valor)}`;
}
function iconoTendenciaUnidad(t) {
    if (t === 'alza')
        return '▲';
    if (t === 'baja')
        return '▼';
    return '●';
}
function claseBalanceUnidad(valor) {
    return valor >= 0 ? 'is-positive' : 'is-negative';
}
function calcularBenchmarkUnidad(filas) {
    const n = filas.length;
    const suma = filas.reduce((acc, f) => ({
        metricaPrincipal: acc.metricaPrincipal + f.metricaPrincipal,
        costoTotal: acc.costoTotal + f.costoTotal,
        balance: acc.balance + f.balance,
    }), { metricaPrincipal: 0, costoTotal: 0, balance: 0 });
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
function filasParaRol(filas, sesion, filtroFacultad) {
    if (sesion.rol === 'decanato') {
        const propia = filas.find((f) => f.facultad === sesion.facultad);
        return propia ? [propia, calcularBenchmarkUnidad(filas)] : [calcularBenchmarkUnidad(filas)];
    }
    if (filtroFacultad)
        return filas.filter((f) => f.facultad === filtroFacultad);
    return filas;
}
function renderStatCardsUnidad(cards) {
    return `<div class="stat-grid">${cards
        .map((c) => `
    <div class="stat-card">
      <span class="stat-label">${c.etiqueta}</span>
      <span class="stat-value">${c.valor}</span>
    </div>`)
        .join('')}</div>`;
}
function renderFiltroFacultad(facultades, activo) {
    const pill = (etiqueta, valor) => `<button type="button" class="faculty-pill${valor === activo ? ' is-active' : ''}" data-facultad="${valor ?? ''}">${etiqueta}</button>`;
    return `<div class="faculty-filter" role="group" aria-label="Filtrar por facultad">
    ${pill('Todas', null)}
    ${facultades.map((f) => pill(f, f)).join('')}
  </div>`;
}
function renderTablaUnidad(vista, filas) {
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
function tokenColor(nombre) {
    return getComputedStyle(document.documentElement).getPropertyValue(nombre).trim();
}
function crearGraficoBarras(canvas, filas) {
    const ctx = canvas.getContext('2d');
    if (!ctx)
        return null;
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
/** Tabs con roving tabindex + navegación por flechas — mismo patrón ya
 * probado en el antiguo paneles.ts, generalizado para cualquier unidad. */
function initTabsUnidad(tabsElemento, bodyElemento, vistas) {
    function activarTab(id) {
        tabsElemento.querySelectorAll('.panel-tab').forEach((btn) => {
            const esActiva = btn.getAttribute('data-tab') === id;
            btn.classList.toggle('active', esActiva);
            btn.setAttribute('aria-selected', String(esActiva));
            btn.setAttribute('tabindex', esActiva ? '0' : '-1');
        });
        bodyElemento.setAttribute('aria-labelledby', `tab-${id}`);
        const vista = vistas.find((v) => v.id === id);
        if (vista)
            vista.render(bodyElemento);
    }
    tabsElemento.innerHTML = vistas
        .map((v) => `<button type="button" id="tab-${v.id}" class="panel-tab" role="tab" aria-selected="false" aria-controls="panelBody" tabindex="-1" data-tab="${v.id}">${v.label}</button>`)
        .join('');
    const botonesTab = Array.from(tabsElemento.querySelectorAll('.panel-tab'));
    botonesTab.forEach((btn) => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-tab');
            if (id)
                activarTab(id);
        });
    });
    tabsElemento.addEventListener('keydown', (evento) => {
        const teclasManejadas = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
        if (!teclasManejadas.includes(evento.key))
            return;
        evento.preventDefault();
        const indiceActual = botonesTab.findIndex((btn) => btn.getAttribute('aria-selected') === 'true');
        let indiceNuevo = indiceActual;
        if (evento.key === 'ArrowLeft')
            indiceNuevo = (indiceActual - 1 + botonesTab.length) % botonesTab.length;
        else if (evento.key === 'ArrowRight')
            indiceNuevo = (indiceActual + 1) % botonesTab.length;
        else if (evento.key === 'Home')
            indiceNuevo = 0;
        else if (evento.key === 'End')
            indiceNuevo = botonesTab.length - 1;
        const botonNuevo = botonesTab[indiceNuevo];
        const idNuevo = botonNuevo.getAttribute('data-tab');
        if (idNuevo) {
            activarTab(idNuevo);
            botonNuevo.focus();
        }
    });
    if (vistas.length > 0)
        activarTab(vistas[0].id);
}
//# sourceMappingURL=unidad-dashboard.js.map