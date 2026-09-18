/** Datos sintéticos de la unidad Docencia — cifras ficticias, sin trazabilidad
 * real (mismo criterio que el resto del proyecto, ver plan.md). Cada
 * categoría fija aloja un arreglo `dashboards` — hoy 1 cada una, pero admite
 * agregar más análisis sin tocar la navegación (ver ts/unidad-dashboard.ts). */

const CATEGORIAS_DOCENCIA: CategoriaUnidad[] = [
  {
    id: 'gestion',
    titulo: 'Gestión Docencia',
    dashboards: [
      {
        id: 'principal',
        titulo: 'Gestión Docencia',
        descripcion: 'Plazas con nombramiento vs. costo de nómina titulada, por facultad.',
        etiquetaMetricaPrincipal: 'Docentes con nombramiento',
        etiquetaMetrica3: 'facultades en superávit de plazas',
        esIndice: false,
        filas: [
          { facultad: 'Ciencias Sociales', metricaPrincipal: 98, costoTotal: 1_850_000, balance: -70_000, tendencia: 'baja' },
          { facultad: 'Ingeniería', metricaPrincipal: 176, costoTotal: 3_640_000, balance: 150_000, tendencia: 'alza' },
          { facultad: 'Ciencias de la Vida', metricaPrincipal: 89, costoTotal: 1_690_000, balance: 25_000, tendencia: 'estable' },
          { facultad: 'Artes y Humanidades', metricaPrincipal: 52, costoTotal: 920_000, balance: -40_000, tendencia: 'baja' },
          { facultad: 'Ciencias Exactas', metricaPrincipal: 121, costoTotal: 2_310_000, balance: 95_000, tendencia: 'alza' },
          { facultad: 'Negocios', metricaPrincipal: 84, costoTotal: 1_540_000, balance: 30_000, tendencia: 'estable' },
        ],
      },
    ],
  },
  {
    id: 'docencia',
    titulo: 'Docencia',
    dashboards: [
      {
        id: 'principal',
        titulo: 'Docencia',
        descripcion: 'Nómina y carga docente por facultad — tiempo completo y parcial.',
        etiquetaMetricaPrincipal: 'Docentes',
        etiquetaMetrica3: 'facultades en superávit',
        esIndice: false,
        filas: [
          { facultad: 'Ciencias Sociales', metricaPrincipal: 142, costoTotal: 2_180_000, balance: -95_000, tendencia: 'baja' },
          { facultad: 'Ingeniería', metricaPrincipal: 231, costoTotal: 4_320_000, balance: 210_000, tendencia: 'alza' },
          { facultad: 'Ciencias de la Vida', metricaPrincipal: 118, costoTotal: 1_960_000, balance: 40_000, tendencia: 'estable' },
          { facultad: 'Artes y Humanidades', metricaPrincipal: 76, costoTotal: 1_120_000, balance: -60_000, tendencia: 'baja' },
          { facultad: 'Ciencias Exactas', metricaPrincipal: 154, costoTotal: 2_640_000, balance: 130_000, tendencia: 'alza' },
          { facultad: 'Negocios', metricaPrincipal: 117, costoTotal: 1_980_000, balance: 75_000, tendencia: 'estable' },
        ],
      },
    ],
  },
  {
    id: 'resumen',
    titulo: 'Resumen general',
    dashboards: [
      {
        id: 'principal',
        titulo: 'Resumen general',
        descripcion: 'Calidad×Costo: índice de calidad académica frente al costo por estudiante, por facultad.',
        etiquetaMetricaPrincipal: 'Estudiantes',
        etiquetaMetrica3: 'facultades sobre el índice objetivo',
        esIndice: true,
        filas: [
          { facultad: 'Ciencias Sociales', metricaPrincipal: 3120, costoTotal: 2_260_000, balance: -1, tendencia: 'baja' },
          { facultad: 'Ingeniería', metricaPrincipal: 4210, costoTotal: 4_480_000, balance: 2, tendencia: 'alza' },
          { facultad: 'Ciencias de la Vida', metricaPrincipal: 2870, costoTotal: 2_040_000, balance: 1, tendencia: 'estable' },
          { facultad: 'Artes y Humanidades', metricaPrincipal: 1540, costoTotal: 1_190_000, balance: -2, tendencia: 'baja' },
          { facultad: 'Ciencias Exactas', metricaPrincipal: 3390, costoTotal: 2_750_000, balance: 1, tendencia: 'alza' },
          { facultad: 'Negocios', metricaPrincipal: 2650, costoTotal: 2_070_000, balance: 0, tendencia: 'estable' },
        ],
      },
    ],
  },
];
