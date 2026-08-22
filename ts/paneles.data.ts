/** Datos sintéticos para los 4 dashboards — cifras ficticias, sin trazabilidad real.
 * Reemplaza en el futuro la lectura desde la API/BD real (ver plan.md). */

type Tendencia = 'alza' | 'baja' | 'estable';

interface FilaFacultad {
  facultad: string;
  docentes: number;
  costoTotal: number;
  balance: number;
  tendencia: Tendencia;
}

interface CategoriaPanel {
  id: 'docencia' | 'investigacion' | 'nombramientos' | 'calidad';
  titulo: string;
  descripcion: string;
  etiquetaMetrica3: string;
  filas: FilaFacultad[];
}

const PANELES: CategoriaPanel[] = [
  {
    id: 'docencia',
    titulo: 'Docencia',
    descripcion: 'Nómina y carga docente por facultad — tiempo completo y parcial.',
    etiquetaMetrica3: 'facultades en superávit',
    filas: [
      { facultad: 'Ciencias Sociales', docentes: 142, costoTotal: 2_180_000, balance: -95_000, tendencia: 'baja' },
      { facultad: 'Ingeniería', docentes: 231, costoTotal: 4_320_000, balance: 210_000, tendencia: 'alza' },
      { facultad: 'Ciencias de la Vida', docentes: 118, costoTotal: 1_960_000, balance: 40_000, tendencia: 'estable' },
      { facultad: 'Artes y Humanidades', docentes: 76, costoTotal: 1_120_000, balance: -60_000, tendencia: 'baja' },
      { facultad: 'Ciencias Exactas', docentes: 154, costoTotal: 2_640_000, balance: 130_000, tendencia: 'alza' },
      { facultad: 'Negocios', docentes: 117, costoTotal: 1_980_000, balance: 75_000, tendencia: 'estable' },
    ],
  },
  {
    id: 'investigacion',
    titulo: 'Investigación',
    descripcion: 'Proyectos activos y ejecución presupuestaria por facultad.',
    etiquetaMetrica3: 'facultades en superávit',
    filas: [
      { facultad: 'Ciencias Sociales', docentes: 38, costoTotal: 540_000, balance: 12_000, tendencia: 'estable' },
      { facultad: 'Ingeniería', docentes: 96, costoTotal: 1_780_000, balance: 240_000, tendencia: 'alza' },
      { facultad: 'Ciencias de la Vida', docentes: 61, costoTotal: 1_050_000, balance: -35_000, tendencia: 'baja' },
      { facultad: 'Artes y Humanidades', docentes: 19, costoTotal: 210_000, balance: -8_000, tendencia: 'estable' },
      { facultad: 'Ciencias Exactas', docentes: 82, costoTotal: 1_460_000, balance: 95_000, tendencia: 'alza' },
      { facultad: 'Negocios', docentes: 27, costoTotal: 380_000, balance: 5_000, tendencia: 'estable' },
    ],
  },
  {
    id: 'nombramientos',
    titulo: 'Nombramientos',
    descripcion: 'Plazas tituladas vs. contratadas, por facultad y período.',
    etiquetaMetrica3: 'facultades en superávit',
    filas: [
      { facultad: 'Ciencias Sociales', docentes: 89, costoTotal: 1_640_000, balance: -120_000, tendencia: 'baja' },
      { facultad: 'Ingeniería', docentes: 150, costoTotal: 2_980_000, balance: 60_000, tendencia: 'estable' },
      { facultad: 'Ciencias de la Vida', docentes: 74, costoTotal: 1_410_000, balance: 30_000, tendencia: 'alza' },
      { facultad: 'Artes y Humanidades', docentes: 41, costoTotal: 720_000, balance: -45_000, tendencia: 'baja' },
      { facultad: 'Ciencias Exactas', docentes: 96, costoTotal: 1_890_000, balance: 85_000, tendencia: 'alza' },
      { facultad: 'Negocios', docentes: 68, costoTotal: 1_260_000, balance: 20_000, tendencia: 'estable' },
    ],
  },
  {
    id: 'calidad',
    titulo: 'Calidad×Costo',
    descripcion: 'Índice de calidad académica frente al costo por estudiante.',
    etiquetaMetrica3: 'facultades sobre el índice objetivo',
    filas: [
      { facultad: 'Ciencias Sociales', docentes: 3120, costoTotal: 2_180_000, balance: -1, tendencia: 'baja' },
      { facultad: 'Ingeniería', docentes: 4210, costoTotal: 4_320_000, balance: 2, tendencia: 'alza' },
      { facultad: 'Ciencias de la Vida', docentes: 2870, costoTotal: 1_960_000, balance: 1, tendencia: 'estable' },
      { facultad: 'Artes y Humanidades', docentes: 1540, costoTotal: 1_120_000, balance: -2, tendencia: 'baja' },
      { facultad: 'Ciencias Exactas', docentes: 3390, costoTotal: 2_640_000, balance: 1, tendencia: 'alza' },
      { facultad: 'Negocios', docentes: 2650, costoTotal: 1_980_000, balance: 0, tendencia: 'estable' },
    ],
  },
];
