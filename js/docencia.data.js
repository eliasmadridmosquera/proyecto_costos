"use strict";
/** Datos sintéticos de la unidad Docencia — cifras ficticias, sin trazabilidad
 * real (mismo criterio que el resto del proyecto, ver plan.md). */
const VISTAS_DOCENCIA = [
    {
        id: 'gestion',
        titulo: 'Gestión Docencia',
        descripcion: 'Plazas con nombramiento vs. costo de nómina titulada, por facultad.',
        etiquetaMetricaPrincipal: 'Docentes con nombramiento',
        etiquetaMetrica3: 'facultades en superávit de plazas',
        esIndice: false,
        filas: [
            { facultad: 'Ciencias Sociales', metricaPrincipal: 98, costoTotal: 1850000, balance: -70000, tendencia: 'baja' },
            { facultad: 'Ingeniería', metricaPrincipal: 176, costoTotal: 3640000, balance: 150000, tendencia: 'alza' },
            { facultad: 'Ciencias de la Vida', metricaPrincipal: 89, costoTotal: 1690000, balance: 25000, tendencia: 'estable' },
            { facultad: 'Artes y Humanidades', metricaPrincipal: 52, costoTotal: 920000, balance: -40000, tendencia: 'baja' },
            { facultad: 'Ciencias Exactas', metricaPrincipal: 121, costoTotal: 2310000, balance: 95000, tendencia: 'alza' },
            { facultad: 'Negocios', metricaPrincipal: 84, costoTotal: 1540000, balance: 30000, tendencia: 'estable' },
        ],
    },
    {
        id: 'docencia',
        titulo: 'Docencia',
        descripcion: 'Nómina y carga docente por facultad — tiempo completo y parcial.',
        etiquetaMetricaPrincipal: 'Docentes',
        etiquetaMetrica3: 'facultades en superávit',
        esIndice: false,
        filas: [
            { facultad: 'Ciencias Sociales', metricaPrincipal: 142, costoTotal: 2180000, balance: -95000, tendencia: 'baja' },
            { facultad: 'Ingeniería', metricaPrincipal: 231, costoTotal: 4320000, balance: 210000, tendencia: 'alza' },
            { facultad: 'Ciencias de la Vida', metricaPrincipal: 118, costoTotal: 1960000, balance: 40000, tendencia: 'estable' },
            { facultad: 'Artes y Humanidades', metricaPrincipal: 76, costoTotal: 1120000, balance: -60000, tendencia: 'baja' },
            { facultad: 'Ciencias Exactas', metricaPrincipal: 154, costoTotal: 2640000, balance: 130000, tendencia: 'alza' },
            { facultad: 'Negocios', metricaPrincipal: 117, costoTotal: 1980000, balance: 75000, tendencia: 'estable' },
        ],
    },
    {
        id: 'resumen',
        titulo: 'Resumen general',
        descripcion: 'Calidad×Costo: índice de calidad académica frente al costo por estudiante, por facultad.',
        etiquetaMetricaPrincipal: 'Estudiantes',
        etiquetaMetrica3: 'facultades sobre el índice objetivo',
        esIndice: true,
        filas: [
            { facultad: 'Ciencias Sociales', metricaPrincipal: 3120, costoTotal: 2260000, balance: -1, tendencia: 'baja' },
            { facultad: 'Ingeniería', metricaPrincipal: 4210, costoTotal: 4480000, balance: 2, tendencia: 'alza' },
            { facultad: 'Ciencias de la Vida', metricaPrincipal: 2870, costoTotal: 2040000, balance: 1, tendencia: 'estable' },
            { facultad: 'Artes y Humanidades', metricaPrincipal: 1540, costoTotal: 1190000, balance: -2, tendencia: 'baja' },
            { facultad: 'Ciencias Exactas', metricaPrincipal: 3390, costoTotal: 2750000, balance: 1, tendencia: 'alza' },
            { facultad: 'Negocios', metricaPrincipal: 2650, costoTotal: 2070000, balance: 0, tendencia: 'estable' },
        ],
    },
];
//# sourceMappingURL=docencia.data.js.map