/**
 * Constantes y Catálogos Predefinidos de Fábrica de Calzado
 * Para evitar errores humanos mediante listas desplegables (selects)
 */

export const CLIENTES_PREDEFINIDOS = [
  'ADRIANA BOCANEGRA',
  'CLASBEN',
  'CKLASS',
  'ANDREA',
  'PRICE SHOES',
  'COPPEL',
  'LIVERPOOL',
  'SEARS',
  'ZAPATERIAS LEON',
  'CLIENTE GENERAL / TALLER',
];

export const HORMAS_PREDEFINIDAS = [
  'HELLEN',
  'FROZEN',
  'CAROL',
  'DANIELA',
  'LADY',
  'LULU',
  'VALERIA',
  'CONFORT',
  'OXFORD',
  'PLATAFORMA 9CM',
];

export const LINEAS_PREDEFINIDAS = [
  'HELLEN - 3596',
  'FROZEN - 2026',
  'CAROL - CONFORT',
  'DANIELA - 1420',
  'LADY - 5050',
  'LULU - ALTO',
  'VALERIA - CASUAL',
  'CONFORT FLEX',
];

export const MOLDURAS_PREDEFINIDAS = [
  '3596',
  '2026',
  '1420',
  '5050',
  '3010',
  '8800',
  '1020',
  '7400',
  '9200',
];

export const TROQUELES_PREDEFINIDOS = [
  'NOM 20 / TROQUEL: SINTETICO / SINTETICO PLATA / BOCASSAO PLATA',
  'NOM 20 / TROQUEL: SINTETICO / SINTETICO ORO / BOCASSAO ORO',
  'NOM 20 / TROQUEL: PIEL VACUNO / NEGRO',
  'NOM 20 / TROQUEL: SINTETICO / ORO ROSA',
  'NOM 20 / TROQUEL: SINTETICO / NEGRO BRILLOSO',
  'NOM 20 / TROQUEL: TEXTIL / TRANSFER BLANCO',
  'SIN TROQUEL / LISO',
];

export const PIEZAS_CALZADO_PREDEFINIDAS = [
  'CHINELA',
  'TALON',
  'CHINELA Y TALON',
  'FORRO AVIOS',
  'FORRO CHINELA',
  'FORRO TALON',
  'MOÑO',
  'TIRA P/ANILLO',
  'TIRA TRASERA',
  'VIVO',
  'RIBETE',
  'ELASTICO',
  'CASCO',
  'HUESITO',
  'LATEX',
  'PLANTA',
  'SUELA',
  'TACON',
  'PLATAFORMA',
  'PAPEL ENCAJILLADO',
  'CAJA',
  'ETIQUETA NOM',
];

export const PROGRAMAS_PREDEFINIDOS = [
  '260228',
  '260301',
  '260308',
  '260315',
  '260322',
  '260329',
  '260405',
  '260412',
  '260419',
  '260426',
];

export const FECHAS_ENTREGA_PREDEFINIDAS = [
  'Miercoles 29-Jul-2026',
  'Viernes 31-Jul-2026',
  'Miercoles 05-Ago-2026',
  'Viernes 07-Ago-2026',
  'Miercoles 12-Ago-2026',
  'Viernes 14-Ago-2026',
  'Miercoles 19-Ago-2026',
  'Viernes 21-Ago-2026',
  'Proxima Semana',
  'Fin de Mes',
];

export const LOTES_FOLIOS_PREDEFINIDOS = [
  '1568',
  '1569',
  '1570',
  '1571',
  '1572',
  '1573',
  '1574',
  '1575',
  '1576',
  '1577',
  '1578',
  '1579',
  '1580',
];

export const CORRIDAS_PRESET = {
  ESTANDAR_48P: {
    nombre: 'Corrida Estandar (48p)',
    tallas: {
      '22': 0,
      '22.5': 0,
      '23': 4,
      '23.5': 4,
      '24': 8,
      '24.5': 8,
      '25': 8,
      '25.5': 8,
      '26': 8,
      '26.5': 0,
      '27': 0,
    },
  },
  MEDIA_CORRIDA_24P: {
    nombre: 'Media Corrida (24p)',
    tallas: {
      '22': 0,
      '22.5': 0,
      '23': 2,
      '23.5': 2,
      '24': 4,
      '24.5': 4,
      '25': 4,
      '25.5': 4,
      '26': 4,
      '26.5': 0,
      '27': 0,
    },
  },
  DOBLE_CORRIDA_96P: {
    nombre: 'Doble Corrida (96p)',
    tallas: {
      '22': 0,
      '22.5': 0,
      '23': 8,
      '23.5': 8,
      '24': 16,
      '24.5': 16,
      '25': 16,
      '25.5': 16,
      '26': 16,
      '26.5': 0,
      '27': 0,
    },
  },
  LOTE_60P: {
    nombre: 'Corrida Cerrada (60p)',
    tallas: {
      '22': 4,
      '22.5': 0,
      '23': 6,
      '23.5': 0,
      '24': 14,
      '24.5': 0,
      '25': 16,
      '25.5': 0,
      '26': 14,
      '26.5': 0,
      '27': 6,
    },
  },
  LOTE_200P: {
    nombre: 'Lote Grande (200p)',
    tallas: {
      '22': 10,
      '22.5': 0,
      '23': 30,
      '23.5': 0,
      '24': 60,
      '24.5': 0,
      '25': 60,
      '25.5': 0,
      '26': 30,
      '26.5': 0,
      '27': 10,
    },
  },
};

export const AREAS_ENTREGA_PREDEFINIDAS = [
  'Taller de Corte',
  'Taller de Pespunte',
  'Taller de Forrado',
  'Taller de Montado',
  'Taller de Adornado',
  'Almacen Central',
  'Control de Calidad (QC)',
  'Maquila Externa',
];

export const DEFECTOS_QC_PREDEFINIDOS = [
  'Despegado de Suela',
  'Costura Chueca / Mal Rematada',
  'Material Manchado de Pegamento',
  'Piel / Sintetico Raspado o Roto',
  'Falta de Moño o Adorno',
  'Planta Desalineada',
  'Talla Incorrecta en Par',
  'Tacon Flojo o Mal Centrado',
  'Otro Defecto Menor',
];
