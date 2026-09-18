(function initVinculacion(): void {
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

  roleBanner.innerHTML =
    sesion.rol === 'decanato'
      ? `Estás viendo la facultad de <strong>${sesion.facultad}</strong> + el benchmark institucional agregado.`
      : 'Estás viendo el panorama institucional completo de Vinculación.';

  function renderVista(vista: VistaUnidad, contenedor: HTMLElement): void {
    if (!hayDatosImportados()) {
      contenedor.innerHTML = renderPlaceholderVacio();
      return;
    }

    const inicioRender = performance.now();
    let filtroFacultad: string | null = null;
    let chartActual: Chart | null = null;
    const mostrarFiltro = sesion.rol !== 'decanato';

    function pintar(): void {
      const filas = filasParaRol(vista.filas, sesion, filtroFacultad);
      const totalMetrica = filas.reduce((acc, f) => acc + f.metricaPrincipal, 0);
      const totalCosto = filas.reduce((acc, f) => acc + f.costoTotal, 0);
      const enPositivo = filas.filter((f) => f.balance >= 0).length;

      contenedor.innerHTML = `
        <p class="panel-desc">${vista.descripcion}</p>
        ${renderStatCardsUnidad([
          { etiqueta: vista.etiquetaMetricaPrincipal, valor: totalMetrica.toLocaleString('es-EC') },
          { etiqueta: 'Costo total', valor: `$${totalCosto.toLocaleString('es-EC')}` },
          { etiqueta: vista.etiquetaMetrica3, valor: `${enPositivo} / ${filas.length}` },
        ])}
        ${mostrarFiltro ? renderFiltroFacultad(FACULTADES_DEMO, filtroFacultad) : ''}
        <div class="chart-box"><canvas id="chart-${vista.id}"></canvas></div>
        ${renderTablaUnidad(vista, filas)}
      `;

      if (chartActual) chartActual.destroy();
      const canvas = document.getElementById(`chart-${vista.id}`);
      if (canvas instanceof HTMLCanvasElement) chartActual = crearGraficoBarras(canvas, filas);

      if (mostrarFiltro) {
        contenedor.querySelectorAll<HTMLButtonElement>('.faculty-pill').forEach((btn) => {
          btn.addEventListener('click', () => {
            filtroFacultad = btn.getAttribute('data-facultad') || null;
            pintar();
          });
        });
      }
    }

    pintar();

    trackEvento('dashboard_category_viewed', {
      user_role: sesion.rol,
      analysis_context: `vinculacion:${vista.id}`,
      render_time_ms: Math.round(performance.now() - inicioRender),
    });
  }

  const vistas = VISTAS_VINCULACION.map((vista) => ({
    id: vista.id,
    label: vista.titulo,
    datos: vista,
    render: (contenedor: HTMLElement): void => renderVista(vista, contenedor),
  }));

  initTabsUnidad(tabsElemento, bodyElemento, 'Vinculación', vistas);

  trackEvento('dashboard_loaded', {
    user_role: sesion.rol,
    dashboard_type: sesion.rol === 'decanato' ? 'faculty_overview' : 'institution_overview',
    unit: 'vinculacion',
  });
})();
