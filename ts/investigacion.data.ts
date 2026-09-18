/** Datos sintéticos de la unidad Investigación — cifras ficticias, sin
 * trazabilidad real (mismo criterio que el resto del proyecto, ver plan.md).
 * Cada categoría fija aloja un arreglo `dashboards` — hoy 1 cada una. */

const CATEGORIAS_INVESTIGACION: CategoriaUnidad[] = [
  {
    id: 'gestion',
    titulo: 'Gestión Investigación',
    dashboards: [
      {
        id: 'principal',
        titulo: 'Gestión Investigación',
        descripcion: 'Investigadores con proyecto activo vs. ejecución presupuestaria, por facultad.',
        etiquetaMetricaPrincipal: 'Investigadores con proyecto activo',
        etiquetaMetrica3: 'facultades en superávit de ejecución',
        esIndice: false,
        filas: [
          { facultad: 'Ciencias Sociales', metricaPrincipal: 22, costoTotal: 410_000, balance: 8_000, tendencia: 'estable' },
          { facultad: 'Ingeniería', metricaPrincipal: 58, costoTotal: 1_120_000, balance: 180_000, tendencia: 'alza' },
          { facultad: 'Ciencias de la Vida', metricaPrincipal: 41, costoTotal: 780_000, balance: -20_000, tendencia: 'baja' },
          { facultad: 'Artes y Humanidades', metricaPrincipal: 11, costoTotal: 150_000, balance: -5_000, tendencia: 'estable' },
          { facultad: 'Ciencias Exactas', metricaPrincipal: 49, costoTotal: 960_000, balance: 60_000, tendencia: 'alza' },
          { facultad: 'Negocios', metricaPrincipal: 16, costoTotal: 240_000, balance: 3_000, tendencia: 'estable' },
        ],
      },
    ],
  },
  {
    id: 'investigacion',
    titulo: 'Investigación',
    dashboards: [
      {
        id: 'principal',
        titulo: 'Investigación',
        descripcion: 'Proyectos activos y ejecución presupuestaria por facultad.',
        etiquetaMetricaPrincipal: 'Investigadores',
        etiquetaMetrica3: 'facultades en superávit',
        esIndice: false,
        filas: [
          { facultad: 'Ciencias Sociales', metricaPrincipal: 38, costoTotal: 540_000, balance: 12_000, tendencia: 'estable' },
          { facultad: 'Ingeniería', metricaPrincipal: 96, costoTotal: 1_780_000, balance: 240_000, tendencia: 'alza' },
          { facultad: 'Ciencias de la Vida', metricaPrincipal: 61, costoTotal: 1_050_000, balance: -35_000, tendencia: 'baja' },
          { facultad: 'Artes y Humanidades', metricaPrincipal: 19, costoTotal: 210_000, balance: -8_000, tendencia: 'estable' },
          { facultad: 'Ciencias Exactas', metricaPrincipal: 82, costoTotal: 1_460_000, balance: 95_000, tendencia: 'alza' },
          { facultad: 'Negocios', metricaPrincipal: 27, costoTotal: 380_000, balance: 5_000, tendencia: 'estable' },
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
        descripcion: 'Calidad×Costo: productos de investigación generados frente al costo, por facultad.',
        etiquetaMetricaPrincipal: 'Productos generados',
        etiquetaMetrica3: 'facultades sobre el índice objetivo',
        esIndice: true,
        filas: [
          { facultad: 'Ciencias Sociales', metricaPrincipal: 64, costoTotal: 540_000, balance: 0, tendencia: 'estable' },
          { facultad: 'Ingeniería', metricaPrincipal: 145, costoTotal: 1_780_000, balance: 2, tendencia: 'alza' },
          { facultad: 'Ciencias de la Vida', metricaPrincipal: 98, costoTotal: 1_050_000, balance: -1, tendencia: 'baja' },
          { facultad: 'Artes y Humanidades', metricaPrincipal: 22, costoTotal: 210_000, balance: -1, tendencia: 'estable' },
          { facultad: 'Ciencias Exactas', metricaPrincipal: 130, costoTotal: 1_460_000, balance: 1, tendencia: 'alza' },
          { facultad: 'Negocios', metricaPrincipal: 35, costoTotal: 380_000, balance: 0, tendencia: 'estable' },
        ],
      },
    ],
  },
];
