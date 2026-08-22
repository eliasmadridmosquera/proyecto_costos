"use strict";
/** Datos sintéticos para los 4 dashboards — cifras ficticias, sin trazabilidad real.
 * Reemplaza en el futuro la lectura desde la API/BD real (ver plan.md). */
const PANELES = [
    {
        id: 'docencia',
        titulo: 'Docencia',
        descripcion: 'Nómina y carga docente por facultad — tiempo completo y parcial.',
        etiquetaMetrica3: 'facultades en superávit',
        filas: [
            { facultad: 'Ciencias Sociales', docentes: 142, costoTotal: 2180000, balance: -95000, tendencia: 'baja' },
            { facultad: 'Ingeniería', docentes: 231, costoTotal: 4320000, balance: 210000, tendencia: 'alza' },
            { facultad: 'Ciencias de la Vida', docentes: 118, costoTotal: 1960000, balance: 40000, tendencia: 'estable' },
            { facultad: 'Artes y Humanidades', docentes: 76, costoTotal: 1120000, balance: -60000, tendencia: 'baja' },
            { facultad: 'Ciencias Exactas', docentes: 154, costoTotal: 2640000, balance: 130000, tendencia: 'alza' },
            { facultad: 'Negocios', docentes: 117, costoTotal: 1980000, balance: 75000, tendencia: 'estable' },
        ],
    },
    {
        id: 'investigacion',
        titulo: 'Investigación',
        descripcion: 'Proyectos activos y ejecución presupuestaria por facultad.',
        etiquetaMetrica3: 'facultades en superávit',
        filas: [
            { facultad: 'Ciencias Sociales', docentes: 38, costoTotal: 540000, balance: 12000, tendencia: 'estable' },
            { facultad: 'Ingeniería', docentes: 96, costoTotal: 1780000, balance: 240000, tendencia: 'alza' },
            { facultad: 'Ciencias de la Vida', docentes: 61, costoTotal: 1050000, balance: -35000, tendencia: 'baja' },
            { facultad: 'Artes y Humanidades', docentes: 19, costoTotal: 210000, balance: -8000, tendencia: 'estable' },
            { facultad: 'Ciencias Exactas', docentes: 82, costoTotal: 1460000, balance: 95000, tendencia: 'alza' },
            { facultad: 'Negocios', docentes: 27, costoTotal: 380000, balance: 5000, tendencia: 'estable' },
        ],
    },
    {
        id: 'nombramientos',
        titulo: 'Nombramientos',
        descripcion: 'Plazas tituladas vs. contratadas, por facultad y período.',
        etiquetaMetrica3: 'facultades en superávit',
        filas: [
            { facultad: 'Ciencias Sociales', docentes: 89, costoTotal: 1640000, balance: -120000, tendencia: 'baja' },
            { facultad: 'Ingeniería', docentes: 150, costoTotal: 2980000, balance: 60000, tendencia: 'estable' },
            { facultad: 'Ciencias de la Vida', docentes: 74, costoTotal: 1410000, balance: 30000, tendencia: 'alza' },
            { facultad: 'Artes y Humanidades', docentes: 41, costoTotal: 720000, balance: -45000, tendencia: 'baja' },
            { facultad: 'Ciencias Exactas', docentes: 96, costoTotal: 1890000, balance: 85000, tendencia: 'alza' },
            { facultad: 'Negocios', docentes: 68, costoTotal: 1260000, balance: 20000, tendencia: 'estable' },
        ],
    },
    {
        id: 'calidad',
        titulo: 'Calidad×Costo',
        descripcion: 'Índice de calidad académica frente al costo por estudiante.',
        etiquetaMetrica3: 'facultades sobre el índice objetivo',
        filas: [
            { facultad: 'Ciencias Sociales', docentes: 3120, costoTotal: 2180000, balance: -1, tendencia: 'baja' },
            { facultad: 'Ingeniería', docentes: 4210, costoTotal: 4320000, balance: 2, tendencia: 'alza' },
            { facultad: 'Ciencias de la Vida', docentes: 2870, costoTotal: 1960000, balance: 1, tendencia: 'estable' },
            { facultad: 'Artes y Humanidades', docentes: 1540, costoTotal: 1120000, balance: -2, tendencia: 'baja' },
            { facultad: 'Ciencias Exactas', docentes: 3390, costoTotal: 2640000, balance: 1, tendencia: 'alza' },
            { facultad: 'Negocios', docentes: 2650, costoTotal: 1980000, balance: 0, tendencia: 'estable' },
        ],
    },
];
//# sourceMappingURL=paneles.data.js.map