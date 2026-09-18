"use strict";
/** Datos sintéticos de la unidad Investigación — cifras ficticias, sin
 * trazabilidad real (mismo criterio que el resto del proyecto, ver plan.md). */
const VISTAS_INVESTIGACION = [
    {
        id: 'gestion',
        titulo: 'Gestión Investigación',
        descripcion: 'Investigadores con proyecto activo vs. ejecución presupuestaria, por facultad.',
        etiquetaMetricaPrincipal: 'Investigadores con proyecto activo',
        etiquetaMetrica3: 'facultades en superávit de ejecución',
        esIndice: false,
        filas: [
            { facultad: 'Ciencias Sociales', metricaPrincipal: 22, costoTotal: 410000, balance: 8000, tendencia: 'estable' },
            { facultad: 'Ingeniería', metricaPrincipal: 58, costoTotal: 1120000, balance: 180000, tendencia: 'alza' },
            { facultad: 'Ciencias de la Vida', metricaPrincipal: 41, costoTotal: 780000, balance: -20000, tendencia: 'baja' },
            { facultad: 'Artes y Humanidades', metricaPrincipal: 11, costoTotal: 150000, balance: -5000, tendencia: 'estable' },
            { facultad: 'Ciencias Exactas', metricaPrincipal: 49, costoTotal: 960000, balance: 60000, tendencia: 'alza' },
            { facultad: 'Negocios', metricaPrincipal: 16, costoTotal: 240000, balance: 3000, tendencia: 'estable' },
        ],
    },
    {
        id: 'investigacion',
        titulo: 'Investigación',
        descripcion: 'Proyectos activos y ejecución presupuestaria por facultad.',
        etiquetaMetricaPrincipal: 'Investigadores',
        etiquetaMetrica3: 'facultades en superávit',
        esIndice: false,
        filas: [
            { facultad: 'Ciencias Sociales', metricaPrincipal: 38, costoTotal: 540000, balance: 12000, tendencia: 'estable' },
            { facultad: 'Ingeniería', metricaPrincipal: 96, costoTotal: 1780000, balance: 240000, tendencia: 'alza' },
            { facultad: 'Ciencias de la Vida', metricaPrincipal: 61, costoTotal: 1050000, balance: -35000, tendencia: 'baja' },
            { facultad: 'Artes y Humanidades', metricaPrincipal: 19, costoTotal: 210000, balance: -8000, tendencia: 'estable' },
            { facultad: 'Ciencias Exactas', metricaPrincipal: 82, costoTotal: 1460000, balance: 95000, tendencia: 'alza' },
            { facultad: 'Negocios', metricaPrincipal: 27, costoTotal: 380000, balance: 5000, tendencia: 'estable' },
        ],
    },
    {
        id: 'resumen',
        titulo: 'Resumen general',
        descripcion: 'Calidad×Costo: productos de investigación generados frente al costo, por facultad.',
        etiquetaMetricaPrincipal: 'Productos generados',
        etiquetaMetrica3: 'facultades sobre el índice objetivo',
        esIndice: true,
        filas: [
            { facultad: 'Ciencias Sociales', metricaPrincipal: 64, costoTotal: 540000, balance: 0, tendencia: 'estable' },
            { facultad: 'Ingeniería', metricaPrincipal: 145, costoTotal: 1780000, balance: 2, tendencia: 'alza' },
            { facultad: 'Ciencias de la Vida', metricaPrincipal: 98, costoTotal: 1050000, balance: -1, tendencia: 'baja' },
            { facultad: 'Artes y Humanidades', metricaPrincipal: 22, costoTotal: 210000, balance: -1, tendencia: 'estable' },
            { facultad: 'Ciencias Exactas', metricaPrincipal: 130, costoTotal: 1460000, balance: 1, tendencia: 'alza' },
            { facultad: 'Negocios', metricaPrincipal: 35, costoTotal: 380000, balance: 0, tendencia: 'estable' },
        ],
    },
];
//# sourceMappingURL=investigacion.data.js.map