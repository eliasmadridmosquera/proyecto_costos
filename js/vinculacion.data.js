"use strict";
/** Datos sintéticos de la unidad Vinculación — cifras ficticias, sin
 * trazabilidad real (mismo criterio que el resto del proyecto, ver plan.md).
 * Sin plantilla real de referencia — métricas estándar de extensión
 * universitaria (programas, participantes, comunidades atendidas). Cada
 * categoría fija aloja un arreglo `dashboards` — hoy 1 cada una. */
const CATEGORIAS_VINCULACION = [
    {
        id: 'gestion',
        titulo: 'Gestión Vinculación',
        dashboards: [
            {
                id: 'principal',
                titulo: 'Gestión Vinculación',
                descripcion: 'Programas activos vs. ejecución presupuestaria, por facultad.',
                etiquetaMetricaPrincipal: 'Programas activos',
                etiquetaMetrica3: 'facultades en superávit de ejecución',
                esIndice: false,
                filas: [
                    { facultad: 'Ciencias Sociales', metricaPrincipal: 14, costoTotal: 180000, balance: 5000, tendencia: 'alza' },
                    { facultad: 'Ingeniería', metricaPrincipal: 9, costoTotal: 220000, balance: -10000, tendencia: 'baja' },
                    { facultad: 'Ciencias de la Vida', metricaPrincipal: 18, costoTotal: 260000, balance: 15000, tendencia: 'alza' },
                    { facultad: 'Artes y Humanidades', metricaPrincipal: 21, costoTotal: 190000, balance: 8000, tendencia: 'estable' },
                    { facultad: 'Ciencias Exactas', metricaPrincipal: 7, costoTotal: 140000, balance: -6000, tendencia: 'baja' },
                    { facultad: 'Negocios', metricaPrincipal: 12, costoTotal: 170000, balance: 4000, tendencia: 'estable' },
                ],
            },
        ],
    },
    {
        id: 'vinculacion',
        titulo: 'Vinculación',
        dashboards: [
            {
                id: 'principal',
                titulo: 'Vinculación',
                descripcion: 'Participantes y ejecución presupuestaria de programas de vinculación, por facultad.',
                etiquetaMetricaPrincipal: 'Participantes',
                etiquetaMetrica3: 'facultades en superávit',
                esIndice: false,
                filas: [
                    { facultad: 'Ciencias Sociales', metricaPrincipal: 1240, costoTotal: 180000, balance: 5000, tendencia: 'alza' },
                    { facultad: 'Ingeniería', metricaPrincipal: 860, costoTotal: 220000, balance: -10000, tendencia: 'baja' },
                    { facultad: 'Ciencias de la Vida', metricaPrincipal: 1510, costoTotal: 260000, balance: 15000, tendencia: 'alza' },
                    { facultad: 'Artes y Humanidades', metricaPrincipal: 1780, costoTotal: 190000, balance: 8000, tendencia: 'estable' },
                    { facultad: 'Ciencias Exactas', metricaPrincipal: 690, costoTotal: 140000, balance: -6000, tendencia: 'baja' },
                    { facultad: 'Negocios', metricaPrincipal: 980, costoTotal: 170000, balance: 4000, tendencia: 'estable' },
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
                descripcion: 'Calidad×Costo: comunidades atendidas frente al costo, por facultad.',
                etiquetaMetricaPrincipal: 'Comunidades atendidas',
                etiquetaMetrica3: 'facultades sobre el índice objetivo',
                esIndice: true,
                filas: [
                    { facultad: 'Ciencias Sociales', metricaPrincipal: 9, costoTotal: 180000, balance: 1, tendencia: 'alza' },
                    { facultad: 'Ingeniería', metricaPrincipal: 5, costoTotal: 220000, balance: -1, tendencia: 'baja' },
                    { facultad: 'Ciencias de la Vida', metricaPrincipal: 11, costoTotal: 260000, balance: 2, tendencia: 'alza' },
                    { facultad: 'Artes y Humanidades', metricaPrincipal: 13, costoTotal: 190000, balance: 1, tendencia: 'estable' },
                    { facultad: 'Ciencias Exactas', metricaPrincipal: 4, costoTotal: 140000, balance: -2, tendencia: 'baja' },
                    { facultad: 'Negocios', metricaPrincipal: 7, costoTotal: 170000, balance: 0, tendencia: 'estable' },
                ],
            },
        ],
    },
];
//# sourceMappingURL=vinculacion.data.js.map