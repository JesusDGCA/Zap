'use client';

import {
  Maquilero,
  ModeloCalzado,
  InventarioCrudo,
  OrdenSalida,
  OrdenSalidaDetalle,
  Recepcion,
  OrdenSalidaConMaquilero,
  AlertaIncompletaView,
  ResumenCorteSabatino,
  ResumenPagoSemanal,
  CorteSabatinoItem,
  TicketPagoSemanalGuardado,
  PedidoCliente,
  DetalleTallaPedido,
  SalidaGeneral,
  EtapaProduccion,
  LoteProduccion,
  HistorialMovimientoLote,
  ItemRecetaBOM,
  FichaTecnicaModeloBOM,
  ResultadoExplosionMateriales,
  Proveedor,
  OrdenCompra,
  OrdenCompraItem,
  TicketForrado,
  RecepcionForrado,
} from '@/types/database';

export const INITIAL_MODELOS: ModeloCalzado[] = [
  {
    id: 'mod-modelo-01',
    nombre: 'MODELO 01 - 2026',
    horma: 'ESTILO 01',
    linea: 'MODELO 01 - 2026',
    moldura: '2026',
    estilo: 'MODELO 01 - CHAROL NEGRO',
    descripcion_estilo: 'ZAPATILLA DE LÍNEA CLÁSICA',
    cliente_default: 'CLIENTE GENERAL',
    troquel_especificacion: 'NOM 20 / GRABADO: SINTÉTICO / NEGRO / PLATAFORMA',
  },
  {
    id: 'mod-modelo-02',
    nombre: 'MODELO 02',
    horma: 'ESTILO 02',
    linea: 'MODELO 02 - 2026',
    moldura: '3010',
    estilo: 'SANDALIA PLATAFORMA MODELO 02',
    descripcion_estilo: 'SANDALIA DE PLATAFORMA',
    cliente_default: 'CLIENTE GENERAL',
    troquel_especificacion: 'NOM 20 / GRABADO: SINTÉTICO / ORO',
  },
  {
    id: 'mod-modelo-03',
    nombre: 'MODELO 03',
    horma: 'ESTILO 03',
    linea: 'MODELO 03 - CONFORT',
    moldura: '1420',
    estilo: 'MOCASÍN CONFORT MODELO 03',
    descripcion_estilo: 'MOCASÍN CON HERRAJE',
    cliente_default: 'CLIENTE GENERAL',
    troquel_especificacion: 'NOM 20 / GRABADO: PIEL / NEGRO',
  },
];

export const INITIAL_FICHAS_TECNICAS_BOM: FichaTecnicaModeloBOM[] = [
  {
    id: 'bom-modelo-01',
    modelo_nombre: 'MODELO 01 - 2026',
    notas: 'Receta estándar de línea para producción base 48 pares',
    receta: [
      {
        id: 'r-1',
        pieza: 'CHINELA, TALON',
        material_nombre: 'CHAROL 0.8 HQ NEGRO BOMBOM',
        cantidad_por_par: 6.89,
        unidad_medida: 'DCM',
        consumo_total_unidad: 'MT',
        factor_conversion: 1 / 135,
        seccion: 'corte',
      },
      {
        id: 'r-2',
        pieza: 'FORRO AVIOS',
        material_nombre: 'CHAROL 0.8 HQ NEGRO VIRGEN',
        cantidad_por_par: 4.32,
        unidad_medida: 'DCM',
        consumo_total_unidad: 'MT',
        factor_conversion: 1 / 135,
        seccion: 'corte',
      },
      {
        id: 'r-3',
        pieza: 'MOÑO',
        material_nombre: 'CHAROL 0.8 HQ NEGRO VIRGEN',
        cantidad_por_par: 5.40,
        unidad_medida: 'DCM',
        consumo_total_unidad: 'MT',
        factor_conversion: 1 / 135,
        seccion: 'corte',
      },
      {
        id: 'r-4',
        pieza: 'MAT. ANILLO',
        material_nombre: 'CHAROL 0.8 HQ NEGRO VIRGEN',
        cantidad_por_par: 0.54,
        unidad_medida: 'DCM',
        consumo_total_unidad: 'MT',
        factor_conversion: 1 / 135,
        seccion: 'corte',
      },
      {
        id: 'r-5',
        pieza: 'TIRA P/ANILLO',
        material_nombre: 'TIRA DOBLELLADA A TOPE 9MM CHAROL NEGRO',
        cantidad_por_par: 20.00,
        unidad_medida: 'CM',
        consumo_total_unidad: 'MT',
        factor_conversion: 0.01,
        seccion: 'corte',
      },
      {
        id: 'r-6',
        pieza: 'BASE MOÑO',
        material_nombre: 'DURAZNO NEGRO VIRGEN',
        cantidad_por_par: 0.14,
        unidad_medida: 'DCM',
        consumo_total_unidad: 'MT',
        factor_conversion: 1 / 135,
        seccion: 'corte',
      },
      {
        id: 'r-7',
        pieza: 'FORRO, PLANTILLA',
        material_nombre: 'FORRO BARCELONA NEGRO',
        cantidad_por_par: 12.00,
        unidad_medida: 'DCM',
        consumo_total_unidad: 'MT',
        factor_conversion: 1 / 100,
        seccion: 'corte',
      },
      {
        id: 'r-8',
        pieza: 'ELASTICO',
        material_nombre: 'ELASTICO FORRADO 6MM KENYA NEGRO',
        cantidad_por_par: 1.69,
        unidad_medida: 'CM',
        consumo_total_unidad: 'MT',
        factor_conversion: 0.01,
        seccion: 'corte',
      },
      {
        id: 'r-9',
        pieza: 'CASCO',
        material_nombre: 'ASTARX BR',
        cantidad_por_par: 0.60,
        unidad_medida: 'DCM',
        consumo_total_unidad: 'MT',
        factor_conversion: 1 / 150,
        seccion: 'corte',
      },
      {
        id: 'r-10',
        pieza: 'HUESITO',
        material_nombre: 'LATEX 3MM REGULAR NATURAL SOFT (AIRFIT NAT REGULAR)',
        cantidad_por_par: 0.60,
        unidad_medida: 'DCM',
        consumo_total_unidad: 'MT',
        factor_conversion: 1 / 150,
        seccion: 'corte',
      },
      {
        id: 'r-11',
        pieza: 'PAPEL ENCAJILLADO',
        material_nombre: 'CHINA BLANCO 30X70',
        cantidad_por_par: 1.00,
        unidad_medida: 'PIEZA',
        consumo_total_unidad: 'MILLAR',
        factor_conversion: 0.001,
        seccion: 'empaque',
      },
      {
        id: 'r-12',
        pieza: 'CAJA',
        material_nombre: 'CAJA MODELO 01 31*16.5*10.5',
        cantidad_por_par: 1.00,
        unidad_medida: 'PIEZA',
        consumo_total_unidad: 'PIEZA',
        factor_conversion: 1,
        seccion: 'empaque',
      },
      {
        id: 'r-13',
        pieza: 'PLANTA',
        material_nombre: 'MODELO 01 ESQ. 2026',
        cantidad_por_par: 1.00,
        unidad_medida: 'PAR',
        consumo_total_unidad: 'PAR',
        factor_conversion: 1,
        seccion: 'suela_planta_tacon',
      },
      {
        id: 'r-14',
        pieza: 'SUELA',
        material_nombre: 'MODELO 01 NEGRO C/NEGRO',
        cantidad_por_par: 1.00,
        unidad_medida: 'PAR',
        consumo_total_unidad: 'PAR',
        factor_conversion: 1,
        seccion: 'suela_planta_tacon',
      },
      {
        id: 'r-15',
        pieza: 'TACON',
        material_nombre: 'TACON MODELO 01 NEGRO',
        cantidad_por_par: 1.00,
        unidad_medida: 'PAR',
        consumo_total_unidad: 'PAR',
        factor_conversion: 1,
        seccion: 'suela_planta_tacon',
      },
    ],
  },
];

export const INITIAL_INVENTARIO_CRUDO: InventarioCrudo[] = [
  { id: 'inv-1', tipo_material: 'CHAROL 0.8 HQ NEGRO BOMBOM', talla: 0, cantidad_total: 50, unidad_medida: 'MT', seccion: 'corte', costo_unitario: 280 },
  { id: 'inv-2', tipo_material: 'CHAROL 0.8 HQ NEGRO VIRGEN', talla: 0, cantidad_total: 80, unidad_medida: 'MT', seccion: 'corte', costo_unitario: 310 },
  { id: 'inv-3', tipo_material: 'TIRA DOBLELLADA A TOPE 9MM CHAROL NEGRO', talla: 0, cantidad_total: 200, unidad_medida: 'MT', seccion: 'corte', costo_unitario: 45 },
  { id: 'inv-4', tipo_material: 'DURAZNO NEGRO VIRGEN', talla: 0, cantidad_total: 30, unidad_medida: 'MT', seccion: 'corte', costo_unitario: 185 },
  { id: 'inv-5', tipo_material: 'FORRO BARCELONA NEGRO', talla: 0, cantidad_total: 100, unidad_medida: 'MT', seccion: 'corte', costo_unitario: 95 },
  { id: 'inv-6', tipo_material: 'ELASTICO FORRADO 6MM KENYA NEGRO', talla: 0, cantidad_total: 50, unidad_medida: 'MT', seccion: 'corte', costo_unitario: 28 },
  { id: 'inv-7', tipo_material: 'ASTARX BR', talla: 0, cantidad_total: 40, unidad_medida: 'MT', seccion: 'corte', costo_unitario: 120 },
  { id: 'inv-8', tipo_material: 'LATEX 3MM REGULAR NATURAL SOFT', talla: 0, cantidad_total: 40, unidad_medida: 'MT', seccion: 'corte', costo_unitario: 75 },
  { id: 'inv-9', tipo_material: 'CHINA BLANCO 30X70', talla: 0, cantidad_total: 2, unidad_medida: 'MILLAR', seccion: 'empaque', costo_unitario: 350 },
  { id: 'inv-10', tipo_material: 'CAJA MODELO 01 31*16.5*10.5', talla: 0, cantidad_total: 500, unidad_medida: 'PIEZA', seccion: 'empaque', costo_unitario: 18 },
  { id: 'inv-11', tipo_material: 'MODELO 01 ESQ. 2026', talla: 23, cantidad_total: 50, unidad_medida: 'PAR', seccion: 'suela_planta_tacon', costo_unitario: 65 },
  { id: 'inv-12', tipo_material: 'MODELO 01 ESQ. 2026', talla: 24, cantidad_total: 100, unidad_medida: 'PAR', seccion: 'suela_planta_tacon', costo_unitario: 65 },
  { id: 'inv-13', tipo_material: 'MODELO 01 ESQ. 2026', talla: 25, cantidad_total: 100, unidad_medida: 'PAR', seccion: 'suela_planta_tacon', costo_unitario: 65 },
  { id: 'inv-14', tipo_material: 'MODELO 01 NEGRO C/NEGRO', talla: 23, cantidad_total: 50, unidad_medida: 'PAR', seccion: 'suela_planta_tacon', costo_unitario: 55 },
  { id: 'inv-15', tipo_material: 'MODELO 01 NEGRO C/NEGRO', talla: 24, cantidad_total: 100, unidad_medida: 'PAR', seccion: 'suela_planta_tacon', costo_unitario: 55 },
  { id: 'inv-16', tipo_material: 'MODELO 01 NEGRO C/NEGRO', talla: 25, cantidad_total: 100, unidad_medida: 'PAR', seccion: 'suela_planta_tacon', costo_unitario: 55 },
  { id: 'inv-17', tipo_material: 'TACON MODELO 01 NEGRO', talla: 0, cantidad_total: 300, unidad_medida: 'PAR', seccion: 'suela_planta_tacon', costo_unitario: 42 },
];

export const INITIAL_PROVEEDORES: Proveedor[] = [
  { id: 'prov-1', nombre: 'Pieles del Bajío S.A.', contacto: 'Carlos Martínez', telefono: '477-123-4567', materiales_que_surte: 'Charol, Durazno, Pieles Sintéticas' },
  { id: 'prov-2', nombre: 'Curtidora León', contacto: 'María López', telefono: '477-234-5678', materiales_que_surte: 'Forros, Tiras, Elásticos' },
  { id: 'prov-3', nombre: 'Suelas y Tacones MX', contacto: 'Roberto García', telefono: '477-345-6789', materiales_que_surte: 'Plantas, Suelas, Tacones' },
];

export const INITIAL_LOTES_PRODUCCION: LoteProduccion[] = [];

export const INITIAL_MAQUILEROS: Maquilero[] = [
  { id: 'mq-miguel', nombre: 'Miguel', tarifa_por_par: 3 },
  { id: 'mq-test', nombre: 'Test', tarifa_por_par: 4 },
  { id: 'mq-juan', nombre: 'Juan', tarifa_por_par: 5 },
  { id: 'mq-rosa', nombre: 'Rosa', tarifa_por_par: 5.5 },
  { id: 'mq-luis', nombre: 'Luis', tarifa_por_par: 6 },
  { id: 'mq-maria', nombre: 'María', tarifa_por_par: 7 },
];
function fechaDemo(diasAtras: number): string {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - diasAtras);
  return fecha.toISOString().split('T')[0];
}

function fechaDemoISO(diasAtras: number): string {
  return `${fechaDemo(diasAtras)}T12:00:00.000Z`;
}

export const INITIAL_ORDENES_SALIDA: OrdenSalida[] = [
  {
    id: 'ORD-DEMO-001',
    maquilero_id: 'mq-miguel',
    modelo: 'MODELO 01 - 2026',
    fecha_envio: fechaDemo(3),
    estatus: 'Pendiente',
    insumos: ['Planta', 'Pegamento'],
  },
  {
    id: 'ORD-DEMO-002',
    maquilero_id: 'mq-juan',
    modelo: 'MODELO 02',
    fecha_envio: fechaDemo(2),
    estatus: 'Pendiente',
    insumos: ['Planta', 'Forro'],
  },
  {
    id: 'ORD-DEMO-003',
    maquilero_id: 'mq-rosa',
    modelo: 'MODELO 03',
    fecha_envio: fechaDemo(1),
    estatus: 'Pendiente',
    insumos: ['Planta', 'Tacon'],
  },
];

export const INITIAL_ORDENES_SALIDA_DETALLE: OrdenSalidaDetalle[] = [
  { id: 'dt-demo-001', orden_id: 'ORD-DEMO-001', talla: 23, pares_enviados: 40 },
  { id: 'dt-demo-002', orden_id: 'ORD-DEMO-001', talla: 24, pares_enviados: 35 },
  { id: 'dt-demo-003', orden_id: 'ORD-DEMO-002', talla: 25, pares_enviados: 50 },
  { id: 'dt-demo-004', orden_id: 'ORD-DEMO-003', talla: 26, pares_enviados: 30 },
];

export const INITIAL_RECEPCIONES: Recepcion[] = [
  {
    id: 'rec-demo-001',
    orden_detalle_id: 'dt-demo-001',
    fecha_recepcion: fechaDemoISO(2),
    pares_completos_entregados: 40,
    faltantes_izquierdos: 0,
    faltantes_derechos: 0,
    nota: 'Ejemplo de recepción completa.',
    alerta_activa: false,
  },
  {
    id: 'rec-demo-002',
    orden_detalle_id: 'dt-demo-002',
    fecha_recepcion: fechaDemoISO(1),
    pares_completos_entregados: 35,
    faltantes_izquierdos: 0,
    faltantes_derechos: 0,
    nota: 'Ejemplo de recepción completa.',
    alerta_activa: false,
  },
  {
    id: 'rec-demo-003',
    orden_detalle_id: 'dt-demo-003',
    fecha_recepcion: fechaDemoISO(1),
    pares_completos_entregados: 45,
    faltantes_izquierdos: 3,
    faltantes_derechos: 2,
    nota: 'Ejemplo con piezas faltantes para revisar en pago maquila.',
    alerta_activa: true,
  },
  {
    id: 'rec-demo-004',
    orden_detalle_id: 'dt-demo-004',
    fecha_recepcion: fechaDemoISO(0),
    pares_completos_entregados: 30,
    faltantes_izquierdos: 0,
    faltantes_derechos: 0,
    nota: 'Ejemplo de recepción del día.',
    alerta_activa: false,
  },
];
export const INITIAL_TICKETS_PAGOS: TicketPagoSemanalGuardado[] = [];
export const INITIAL_PEDIDOS_CLIENTES: PedidoCliente[] = [];
export const INITIAL_SALIDAS_GENERALES: SalidaGeneral[] = [];
export const INITIAL_TICKETS_FORRADO: TicketForrado[] = [];
export const INITIAL_RECEPCIONES_FORRADO: RecepcionForrado[] = [];

const STORAGE_KEYS = {
  MAQUILEROS: 'calzado_pwa_maquileros',
  MODELOS: 'calzado_pwa_modelos',
  INVENTARIO: 'calzado_pwa_inventario',
  ORDENES: 'calzado_pwa_ordenes',
  DETALLES: 'calzado_pwa_detalles',
  RECEPCIONES: 'calzado_pwa_recepciones',
  TICKETS_PAGOS: 'calzado_pwa_tickets_pagos',
  PEDIDOS: 'calzado_pwa_pedidos_clientes',
  SALIDAS_GENERALES: 'calzado_pwa_salidas_generales',
  LOTES_PRODUCCION: 'calzado_pwa_lotes_produccion',
  HISTORIAL_MOVIMIENTOS: 'calzado_pwa_historial_movimientos',
  FICHAS_TECNICAS_BOM: 'calzado_pwa_fichas_tecnicas_bom',
  PROVEEDORES: 'calzado_pwa_proveedores',
  ORDENES_COMPRA: 'calzado_pwa_ordenes_compra',
  TICKETS_FORRADO: 'calzado_pwa_tickets_forrado',
  RECEPCIONES_FORRADO: 'calzado_pwa_recepciones_forrado',
};

function checkAndAutoPurgeOnce(): void {
  if (typeof window === 'undefined') return;
  // Marca de inicialización para no repetir lógica cada vez
  if (localStorage.getItem('calzado_pwa_system_v2_initialized') !== 'true') {
    localStorage.setItem('calzado_pwa_system_v2_initialized', 'true');
  }

  // En una instalación nueva dejamos recepciones de ejemplo conectadas a sus
  // órdenes y detalles para que Pago maquila pueda probarse de inmediato.
  if (localStorage.getItem('calzado_pwa_demo_maquila_v1') !== 'true') {
    const ordenes = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDENES) || '[]');
    const detalles = JSON.parse(localStorage.getItem(STORAGE_KEYS.DETALLES) || '[]');
    const recepciones = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECEPCIONES) || '[]');

    if (recepciones.length === 0) {
      const idsOrdenes = new Set(ordenes.map((orden: OrdenSalida) => orden.id));
      const idsDetalles = new Set(detalles.map((detalle: OrdenSalidaDetalle) => detalle.id));
      const ordenesDemo = INITIAL_ORDENES_SALIDA.filter((orden) => !idsOrdenes.has(orden.id));
      const detallesDemo = INITIAL_ORDENES_SALIDA_DETALLE.filter((detalle) => !idsDetalles.has(detalle.id));

      localStorage.setItem(STORAGE_KEYS.ORDENES, JSON.stringify([...ordenesDemo, ...ordenes]));
      localStorage.setItem(STORAGE_KEYS.DETALLES, JSON.stringify([...detallesDemo, ...detalles]));
      localStorage.setItem(STORAGE_KEYS.RECEPCIONES, JSON.stringify(INITIAL_RECEPCIONES));
    }
    localStorage.setItem('calzado_pwa_demo_maquila_v1', 'true');
  }
}

function getStoredData<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  checkAndAutoPurgeOnce();
  try {
    const item = localStorage.getItem(key);
    // Se clona el fallback: si se devuelve por referencia, las altas del usuario
    // modifican las constantes INITIAL_* y los catalogos base se contaminan.
    if (item === null) return JSON.parse(JSON.stringify(fallback)) as T;
    return JSON.parse(item) as T;
  } catch (e) {
    console.error(`Error leyendo ${key} de localStorage`, e);
    return fallback;
  }
}

function setStoredData<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error guardando ${key} en localStorage`, e);
  }
}

/**
 * Convierte una fecha 'YYYY-MM-DD' a fecha LOCAL.
 * Ojo: new Date('2026-09-15') la interpreta como UTC, lo que en Mexico (UTC-6)
 * la recorre al dia anterior y hacia que la raya semanal no encontrara las
 * entregas del dia seleccionado.
 */
function parseFechaHoraLocal(fecha: string, finDelDia: boolean): Date {
  const soloFecha = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fecha);
  if (soloFecha) {
    const anio = Number(soloFecha[1]);
    const mes = Number(soloFecha[2]) - 1;
    const dia = Number(soloFecha[3]);
    return finDelDia
      ? new Date(anio, mes, dia, 23, 59, 59, 999)
      : new Date(anio, mes, dia, 0, 0, 0, 0);
  }
  return new Date(fecha);
}

/**
 * Consumo total requerido de un insumo de la receta.
 * Es la MISMA formula que usa la Explosion de Materiales: respeta
 * factor_conversion y las conversiones DCM/MT, CM/MT y PIEZA/MILLAR.
 */
function calcularCantidadRequeridaItem(item: ItemRecetaBOM, totalPares: number): number {
  const unidadPar = (item.unidad_medida || 'pares').toUpperCase();
  const unidadTotal = (item.consumo_total_unidad || item.unidad_medida || 'pares').toUpperCase();

  if (item.factor_conversion !== undefined && item.factor_conversion > 0) {
    return Number((item.cantidad_por_par * totalPares * item.factor_conversion).toFixed(2));
  }
  if (unidadPar === 'DCM' && unidadTotal === 'MT') {
    return Number(((item.cantidad_por_par * totalPares) / 135).toFixed(2));
  }
  if (unidadPar === 'CM' && unidadTotal === 'MT') {
    return Number(((item.cantidad_por_par * totalPares) / 100).toFixed(2));
  }
  if (unidadPar === 'PIEZA' && unidadTotal === 'MILLAR') {
    return Number(((item.cantidad_por_par * totalPares) / 1000).toFixed(2));
  }
  return Number((item.cantidad_por_par * totalPares).toFixed(2));
}

/**
 * Genera un id unico. Date.now() a secas puede repetirse cuando se crean dos
 * registros en el mismo milisegundo (dos maquileros con el mismo id, etc.).
 */
function generarId(prefijo: string): string {
  return `${prefijo}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

export class ProductionStore {
  // RECETARIO Y FICHAS TÉCNICAS (BOM & EXPLOSIÓN DE MATERIALES)
  static getFichasTecnicasBOM(): FichaTecnicaModeloBOM[] {
    return getStoredData(STORAGE_KEYS.FICHAS_TECNICAS_BOM, INITIAL_FICHAS_TECNICAS_BOM);
  }

  static getFichaTecnicaPorModelo(modeloNombre: string): FichaTecnicaModeloBOM | undefined {
    const list = this.getFichasTecnicasBOM();
    const found = list.find((f) => f.modelo_nombre.toLowerCase() === modeloNombre.toLowerCase());
    if (found) return found;
    return INITIAL_FICHAS_TECNICAS_BOM.find(
      (f) => f.modelo_nombre.toLowerCase() === modeloNombre.toLowerCase()
    );
  }

  static guardarFichaTecnicaBOM(
    modeloNombre: string,
    receta: ItemRecetaBOM[],
    notas?: string
  ): FichaTecnicaModeloBOM {
    const list = this.getFichasTecnicasBOM();
    const index = list.findIndex((f) => f.modelo_nombre.toLowerCase() === modeloNombre.toLowerCase());

    const nuevaFicha: FichaTecnicaModeloBOM = {
      id: index !== -1 ? list[index].id : generarId('bom'),
      modelo_nombre: modeloNombre,
      receta,
      notas,
    };

    if (index !== -1) {
      list[index] = nuevaFicha;
    } else {
      list.unshift(nuevaFicha);
    }

    setStoredData(STORAGE_KEYS.FICHAS_TECNICAS_BOM, list);
    return nuevaFicha;
  }

  static calcularExplosionMateriales(
    modeloNombre: string,
    totalPares: number
  ): ResultadoExplosionMateriales[] {
    const ficha = this.getFichaTecnicaPorModelo(modeloNombre);
    if (!ficha || ficha.receta.length === 0) return [];

    const inventario = this.getInventarioCrudo();

    return ficha.receta.map((item) => {
      const cantidadRequeridaTotal = calcularCantidadRequeridaItem(item, totalPares);

      // Buscar coincidencia en inventario por nombre de material
      const invMatches = inventario.filter((inv) =>
        inv.tipo_material.toLowerCase().includes(item.material_nombre.toLowerCase())
      );

      const stockActual = invMatches.reduce((sum, inv) => sum + inv.cantidad_total, 0);
      const diferenciaStock = stockActual - cantidadRequeridaTotal;
      const suficiente = stockActual >= cantidadRequeridaTotal;

      // Calcular costo del material
      const costoUnit = item.costo_unitario || 0;
      const costoMaterialTotal = Number((costoUnit * cantidadRequeridaTotal).toFixed(2));

      return {
        pieza: item.pieza || 'GENERAL',
        material_nombre: item.material_nombre,
        consumo_por_par: item.cantidad_por_par,
        unidad_medida_par: item.unidad_medida,
        cantidad_requerida_total: cantidadRequeridaTotal,
        unidad_medida_total: item.consumo_total_unidad || item.unidad_medida,
        stock_actual: stockActual,
        diferencia_stock: diferenciaStock,
        suficiente,
        seccion: item.seccion || 'corte',
        costo_unitario: costoUnit > 0 ? costoUnit : undefined,
        costo_material_total: costoUnit > 0 ? costoMaterialTotal : undefined,
      };
    });
  }

  static descontarStockPorExplosion(
    modeloNombre: string,
    totalPares: number,
    desgloseTallas?: { talla: number; pares: number }[]
  ): { exito: boolean; resumenInsumos: string[] } {
    const ficha = this.getFichaTecnicaPorModelo(modeloNombre);
    if (!ficha || ficha.receta.length === 0) {
      return { exito: false, resumenInsumos: [] };
    }

    const inventario = this.getInventarioCrudo();
    const resumenInsumos: string[] = [];

    for (const item of ficha.receta) {
      const esPorParOTalla = item.unidad_medida === 'pares' || item.unidad_medida === 'piezas';

      if (esPorParOTalla && desgloseTallas && desgloseTallas.length > 0) {
        // Descuento exacto por talla para componentes por par (ej. Planta, Suela, Tacón)
        for (const tItem of desgloseTallas) {
          if (tItem.pares <= 0) continue;
          const cantidadDescontar = Number((item.cantidad_por_par * tItem.pares).toFixed(2));

          // Buscar coincidencia en inventario por tipo_material y talla
          let invMatch = inventario.find(
            (inv) =>
              inv.tipo_material.toLowerCase().includes(item.material_nombre.toLowerCase()) &&
              Number(inv.talla) === Number(tItem.talla)
          );

          if (!invMatch) {
            // Si no existe entrada específica de talla, busca genérica por material
            invMatch = inventario.find((inv) =>
              inv.tipo_material.toLowerCase().includes(item.material_nombre.toLowerCase())
            );
          }

          if (invMatch) {
            invMatch.cantidad_total = Math.max(0, invMatch.cantidad_total - cantidadDescontar);
            resumenInsumos.push(
              `${item.material_nombre} #${tItem.talla}: -${cantidadDescontar} ${item.unidad_medida}`
            );
          }
        }
      } else {
        // Descuento global por volumen de consumibles (ej. Pegamento, Forro, Hilo)
        let porDescontar = calcularCantidadRequeridaItem(item, totalPares);
        const cantidadTotalDescontada = porDescontar;

        for (const inv of inventario) {
          if (inv.tipo_material.toLowerCase().includes(item.material_nombre.toLowerCase())) {
            if (inv.cantidad_total >= porDescontar) {
              inv.cantidad_total -= porDescontar;
              porDescontar = 0;
              break;
            } else {
              porDescontar -= inv.cantidad_total;
              inv.cantidad_total = 0;
            }
          }
        }
        resumenInsumos.push(
          `${item.material_nombre}: -${cantidadTotalDescontada} ${item.unidad_medida}`
        );
      }
    }

    setStoredData(STORAGE_KEYS.INVENTARIO, inventario);
    return { exito: true, resumenInsumos };
  }


  // GESTIÓN DE LOTES DE PRODUCCIÓN (WIP - WORK IN PROGRESS)
  static getLotesProduccion(): LoteProduccion[] {
    return getStoredData(STORAGE_KEYS.LOTES_PRODUCCION, INITIAL_LOTES_PRODUCCION);
  }

  static getHistorialMovimientos(): HistorialMovimientoLote[] {
    return getStoredData(STORAGE_KEYS.HISTORIAL_MOVIMIENTOS, []);
  }

  static crearLoteProduccion(input: {
    modelo: string;
    desglose_tallas: { talla: number; pares: number }[];
    notas?: string;
  }): LoteProduccion {
    const lotes = this.getLotesProduccion();
    const totalPares = input.desglose_tallas.reduce((sum, item) => sum + item.pares, 0);

    const numLote = lotes.length + 1;
    const folio = `LOT-2026-${String(numLote).padStart(3, '0')}`;

    const nuevoLote: LoteProduccion = {
      id: generarId('lote'),
      folio,
      modelo: input.modelo,
      total_pares: totalPares,
      etapa_actual: 'Corte',
      fecha_inicio: new Date().toISOString().split('T')[0],
      desglose_tallas: input.desglose_tallas.filter((t) => t.pares > 0),
      notas: input.notas,
    };

    lotes.unshift(nuevoLote);
    setStoredData(STORAGE_KEYS.LOTES_PRODUCCION, lotes);

    // Descuento automático de inventario crudo por Recetario (BOM) exacto por talla
    this.descontarStockPorExplosion(nuevoLote.modelo, totalPares, input.desglose_tallas);

    // Registro inicial en historial
    const historial = this.getHistorialMovimientos();
    historial.unshift({
      id: generarId('mov'),
      lote_id: nuevoLote.id,
      etapa_origen: 'Corte',
      etapa_destino: 'Corte',
      fecha: new Date().toISOString(),
      notas: 'Lote ingresado a Producción (Corte de Material con autodescuento de insumos)',
    });
    setStoredData(STORAGE_KEYS.HISTORIAL_MOVIMIENTOS, historial);

    return nuevoLote;

  }

  static avanzarEtapaLote(input: {
    lote_id: string;
    nueva_etapa: EtapaProduccion;
    maquilero_id?: string;
    notas?: string;
  }): LoteProduccion | null {
    const lotes = this.getLotesProduccion();
    const index = lotes.findIndex((l) => l.id === input.lote_id);
    if (index === -1) return null;

    const loteAnterior = lotes[index];
    const etapaOrigen = loteAnterior.etapa_actual;

    let maquileroNombre: string | undefined = undefined;
    if (input.maquilero_id) {
      const maq = this.getMaquileros().find((m) => m.id === input.maquilero_id);
      maquileroNombre = maq ? maq.nombre : undefined;
    }

    const loteActualizado: LoteProduccion = {
      ...loteAnterior,
      etapa_actual: input.nueva_etapa,
      maquilero_id: input.maquilero_id || loteAnterior.maquilero_id,
      maquilero_nombre: maquileroNombre || loteAnterior.maquilero_nombre,
      notas: input.notas || loteAnterior.notas,
    };

    lotes[index] = loteActualizado;
    setStoredData(STORAGE_KEYS.LOTES_PRODUCCION, lotes);

    // Historial
    const historial = this.getHistorialMovimientos();
    historial.unshift({
      id: generarId('mov'),
      lote_id: input.lote_id,
      etapa_origen: etapaOrigen,
      etapa_destino: input.nueva_etapa,
      fecha: new Date().toISOString(),
      maquilero_nombre: maquileroNombre,
      notas: input.notas,
    });
    setStoredData(STORAGE_KEYS.HISTORIAL_MOVIMIENTOS, historial);

    return loteActualizado;
  }

  static getResumenWIPPorEtapa(): { [etapa in EtapaProduccion]: { lotesCount: number; paresCount: number } } {
    const lotes = this.getLotesProduccion();
    const etapas: EtapaProduccion[] = [
      'Corte',
      'Pespunte',
      'Forrado',
      'Montado',
      'Adornado',
      'Producto Terminado',
    ];

    const resumen: any = {};
    etapas.forEach((e) => {
      resumen[e] = { lotesCount: 0, paresCount: 0 };
    });

    lotes.forEach((l) => {
      if (resumen[l.etapa_actual]) {
        resumen[l.etapa_actual].lotesCount += 1;
        resumen[l.etapa_actual].paresCount += l.total_pares;
      }
    });

    return resumen;
  }

  // CATÁLOGO DE MAQUILEROS

  static getMaquileros(): Maquilero[] {
    return getStoredData(STORAGE_KEYS.MAQUILEROS, INITIAL_MAQUILEROS);
  }

  static crearMaquilero(nombre: string, tarifa_por_par: number): Maquilero {
    const list = this.getMaquileros();
    const nuevo: Maquilero = {
      id: generarId('mq'),
      nombre: nombre.trim(),
      tarifa_por_par: Math.max(0, tarifa_por_par),
    };
    list.unshift(nuevo);
    setStoredData(STORAGE_KEYS.MAQUILEROS, list);
    return nuevo;
  }

  static editarMaquilero(id: string, update: Partial<Pick<Maquilero, 'nombre' | 'tarifa_por_par'>>): Maquilero | null {
    const list = this.getMaquileros();
    const index = list.findIndex((m) => m.id === id);
    if (index === -1) return null;

    list[index] = {
      ...list[index],
      ...(update.nombre !== undefined ? { nombre: update.nombre.trim() } : {}),
      ...(update.tarifa_por_par !== undefined
        ? { tarifa_por_par: Math.max(0, update.tarifa_por_par) }
        : {}),
    };
    setStoredData(STORAGE_KEYS.MAQUILEROS, list);
    return list[index];
  }

  // CATÁLOGO DE MODELOS / ESTILOS
  static getModelos(): ModeloCalzado[] {
    return getStoredData(STORAGE_KEYS.MODELOS, INITIAL_MODELOS);
  }

  static crearModelo(
    input:
      | string
      | {
          nombre: string;
          horma?: string;
          linea?: string;
          moldura?: string;
          estilo?: string;
          descripcion_estilo?: string;
          cliente_default?: string;
          troquel_especificacion?: string;
        },
    estiloParam?: string
  ): ModeloCalzado {
    const list = this.getModelos();
    let nuevo: ModeloCalzado;
    if (typeof input === 'string') {
      nuevo = {
        id: generarId('mod'),
        nombre: input.trim(),
        estilo: estiloParam ? estiloParam.trim() : undefined,
      };
    } else {
      nuevo = {
        id: generarId('mod'),
        nombre: input.nombre.trim(),
        horma: input.horma ? input.horma.trim() : undefined,
        linea: input.linea ? input.linea.trim() : undefined,
        moldura: input.moldura ? input.moldura.trim() : undefined,
        estilo: input.estilo ? input.estilo.trim() : undefined,
        descripcion_estilo: input.descripcion_estilo ? input.descripcion_estilo.trim() : undefined,
        cliente_default: input.cliente_default ? input.cliente_default.trim() : undefined,
        troquel_especificacion: input.troquel_especificacion ? input.troquel_especificacion.trim() : undefined,
      };
    }
    list.unshift(nuevo);
    setStoredData(STORAGE_KEYS.MODELOS, list);
    return nuevo;
  }

  static editarModelo(id: string, update: Partial<ModeloCalzado>): ModeloCalzado | null {
    const list = this.getModelos();
    const index = list.findIndex((m) => m.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...update };
    setStoredData(STORAGE_KEYS.MODELOS, list);
    return list[index];
  }

  static eliminarModelo(id: string): void {
    const list = this.getModelos().filter((m) => m.id !== id);
    setStoredData(STORAGE_KEYS.MODELOS, list);
  }

  // CATÁLOGO DE INVENTARIO CRUDO / INSUMOS
  static getInventarioCrudo(): InventarioCrudo[] {
    return getStoredData(STORAGE_KEYS.INVENTARIO, INITIAL_INVENTARIO_CRUDO);
  }

  static agregarInsumoInventario(
    tipo_material: string,
    talla: number,
    cantidad_total: number,
    unidad_medida?: string,
    seccion?: 'corte' | 'troquel' | 'suela_planta_tacon' | 'empaque' | 'general',
    costo_unitario?: number
  ): InventarioCrudo {
    const list = this.getInventarioCrudo();
    const nuevo: InventarioCrudo = {
      id: generarId('inv'),
      tipo_material: tipo_material.trim(),
      talla: Math.max(0, talla),
      cantidad_total: Math.max(0, cantidad_total),
      unidad_medida: unidad_medida || 'unidades',
      seccion: seccion || 'general',
      costo_unitario: costo_unitario && costo_unitario > 0 ? costo_unitario : undefined,
    };
    list.unshift(nuevo);
    setStoredData(STORAGE_KEYS.INVENTARIO, list);
    return nuevo;
  }

  static actualizarStockInsumo(id: string, deltaCantidad: number): InventarioCrudo | null {
    const list = this.getInventarioCrudo();
    const index = list.findIndex((i) => i.id === id);
    if (index === -1) return null;
    list[index].cantidad_total = Math.max(0, Number((list[index].cantidad_total + deltaCantidad).toFixed(2)));
    setStoredData(STORAGE_KEYS.INVENTARIO, list);
    return list[index];
  }

  static editarInsumoInventario(id: string, update: Partial<InventarioCrudo>): InventarioCrudo | null {
    const list = this.getInventarioCrudo();
    const index = list.findIndex((i) => i.id === id);
    if (index === -1) return null;

    list[index] = {
      ...list[index],
      ...update,
      tipo_material: update.tipo_material?.trim() || list[index].tipo_material,
      talla: update.talla !== undefined ? Math.max(0, update.talla) : list[index].talla,
      cantidad_total: update.cantidad_total !== undefined ? Math.max(0, update.cantidad_total) : list[index].cantidad_total,
      costo_unitario: update.costo_unitario && update.costo_unitario > 0 ? update.costo_unitario : undefined,
    };
    setStoredData(STORAGE_KEYS.INVENTARIO, list);
    return list[index];
  }

  static eliminarInsumoInventario(id: string): void {
    const list = this.getInventarioCrudo().filter((i) => i.id !== id);
    setStoredData(STORAGE_KEYS.INVENTARIO, list);
  }

  static getOrdenesSalida(): OrdenSalida[] {
    return getStoredData(STORAGE_KEYS.ORDENES, INITIAL_ORDENES_SALIDA);
  }

  static getOrdenesDetalle(): OrdenSalidaDetalle[] {
    return getStoredData(STORAGE_KEYS.DETALLES, INITIAL_ORDENES_SALIDA_DETALLE);
  }

  static getRecepciones(): Recepcion[] {
    return getStoredData(STORAGE_KEYS.RECEPCIONES, INITIAL_RECEPCIONES);
  }

  static crearOrdenSalidaDirecta(input: {
    maquilero_id: string;
    modelo: string;
    insumos: string[];
    tallas: { talla: number; pares: number }[];
  }): { ordenId: string; totalPares: number; ordenCompleta: OrdenSalidaConMaquilero } {

    const ordenes = this.getOrdenesSalida();
    const detalles = this.getOrdenesDetalle();
    const inventario = this.getInventarioCrudo();

    const totalPares = input.tallas.reduce((acc, curr) => acc + curr.pares, 0);

    const ordenNum = ordenes.length + 1;
    const ordenId = `ORD-2026-${String(ordenNum).padStart(3, '0')}`;

    const nuevaOrden: OrdenSalida = {
      id: ordenId,
      maquilero_id: input.maquilero_id,
      modelo: input.modelo,
      fecha_envio: new Date().toISOString().split('T')[0],
      estatus: 'Pendiente',
      insumos: input.insumos,
    };

    ordenes.unshift(nuevaOrden);

    for (const item of input.tallas) {
      if (item.pares <= 0) continue;

      const nuevoDetalle: OrdenSalidaDetalle = {
        id: generarId('dt'),
        orden_id: ordenId,
        talla: item.talla,
        pares_enviados: item.pares,
      };
      detalles.unshift(nuevoDetalle);

      const invMatch = inventario.find(
        (i) => i.tipo_material.toLowerCase().includes(input.modelo.toLowerCase()) && i.talla === item.talla
      );
      if (invMatch) {
        invMatch.cantidad_total = Math.max(0, invMatch.cantidad_total - item.pares);
      }
    }

    setStoredData(STORAGE_KEYS.ORDENES, ordenes);
    setStoredData(STORAGE_KEYS.DETALLES, detalles);
    setStoredData(STORAGE_KEYS.INVENTARIO, inventario);

    // Descuento automático por Recetario (BOM) exacto por talla y consumibles
    this.descontarStockPorExplosion(input.modelo, totalPares, input.tallas);

    const maq = this.getMaquileros().find((m) => m.id === input.maquilero_id);

    // Sincronización Automática con Tablero WIP (/procesos):
    // Crear el Lote de Producción correspondiente para que aparezca de inmediato en la etapa de Corte/Pespunte
    const lotes = this.getLotesProduccion();
    const numLote = lotes.length + 1;
    const folioLote = `LOT-2026-${String(numLote).padStart(3, '0')}`;

    const nuevoLote: LoteProduccion = {
      id: generarId('lote'),
      folio: folioLote,
      modelo: input.modelo,
      total_pares: totalPares,
      etapa_actual: 'Corte',
      maquilero_id: input.maquilero_id,
      maquilero_nombre: maq ? maq.nombre : undefined,
      fecha_inicio: new Date().toISOString().split('T')[0],
      desglose_tallas: input.tallas.filter((t) => t.pares > 0),
      notas: `Salida de Maquila ${ordenId}`,
    };

    lotes.unshift(nuevoLote);
    setStoredData(STORAGE_KEYS.LOTES_PRODUCCION, lotes);

    // Registro en Historial de Movimientos de Producción
    const historial = this.getHistorialMovimientos();
    historial.unshift({
      id: generarId('mov'),
      lote_id: nuevoLote.id,
      etapa_origen: 'Corte',
      etapa_destino: 'Corte',
      fecha: new Date().toISOString(),
      maquilero_nombre: maq ? maq.nombre : undefined,
      notas: `Lote ingresado a Producción mediante Orden de Salida ${ordenId}`,
    });
    setStoredData(STORAGE_KEYS.HISTORIAL_MOVIMIENTOS, historial);

    const ordenCompleta: OrdenSalidaConMaquilero = {
      ...nuevaOrden,
      maquilero_nombre: maq ? maq.nombre : 'Maquilero',
      maquilero_tarifa: maq ? maq.tarifa_por_par : 0,
      detalles: detalles.filter((d) => d.orden_id === ordenId),
      total_pares_enviados: totalPares,
    };

    return { ordenId, totalPares, ordenCompleta };

  }

  static getModelosDisponiblesMaquilero(maquileroId: string): {
    modelos: string[];
    tallasCerradas: number[];
  } {
    const ordenes = this.getOrdenesSalida().filter(
      (o) => o.maquilero_id === maquileroId && o.estatus === 'Pendiente'
    );
    const modelosSet = new Set(ordenes.map((o) => o.modelo));

    if (modelosSet.size === 0) {
      const modelosCat = this.getModelos().map((m) => m.nombre);
      return {
        modelos: modelosCat.length > 0 ? modelosCat : ['MODELO 01 - 2026', 'MODELO 02', 'MODELO 03', 'MODELO 04'],
        tallasCerradas: [22, 23, 24, 25, 26, 27],
      };
    }

    return {
      modelos: Array.from(modelosSet),
      tallasCerradas: [22, 23, 24, 25, 26, 27],
    };
  }

  static getTodasOrdenesConDetalle(): OrdenSalidaConMaquilero[] {
    const ordenes = this.getOrdenesSalida();
    const maquileros = this.getMaquileros();
    const detalles = this.getOrdenesDetalle();
    const recepciones = this.getRecepciones();

    return ordenes.map((o) => {
      const maq = maquileros.find((m) => m.id === o.maquilero_id);
      const ordDetalles = detalles.filter((d) => d.orden_id === o.id);

      const detallesConRecibidos = ordDetalles.map((dt) => {
        const recs = recepciones.filter((r) => r.orden_detalle_id === dt.id);
        const acumuladoCompletos = recs.reduce(
          (acc, curr) => acc + curr.pares_completos_entregados,
          0
        );
        return {
          ...dt,
          pares_recibidos_completos: acumuladoCompletos,
        };
      });

      const totalEnviados = ordDetalles.reduce((acc, curr) => acc + curr.pares_enviados, 0);

      return {
        ...o,
        maquilero_nombre: maq ? maq.nombre : 'Maquilero Desconocido',
        maquilero_tarifa: maq ? maq.tarifa_por_par : 0,
        detalles: detallesConRecibidos,
        total_pares_enviados: totalEnviados,
      };
    });
  }

  static getOrdenesPendientesConDetalle(): OrdenSalidaConMaquilero[] {
    return this.getTodasOrdenesConDetalle().filter((o) => o.estatus === 'Pendiente');
  }


  static getAlertasActivas(): AlertaIncompletaView[] {
    const recepciones = this.getRecepciones().filter((r) => r.alerta_activa);
    const detalles = this.getOrdenesDetalle();
    const ordenes = this.getOrdenesSalida();
    const maquileros = this.getMaquileros();

    return recepciones.map((rec) => {
      const dt = detalles.find((d) => d.id === rec.orden_detalle_id);
      const ord = dt ? ordenes.find((o) => o.id === dt.orden_id) : null;
      const maq = ord ? maquileros.find((m) => m.id === ord.maquilero_id) : null;

      return {
        recepcion_id: rec.id,
        fecha_recepcion: rec.fecha_recepcion,
        maquilero_nombre: maq ? maq.nombre : 'Maquilero',
        modelo: ord ? ord.modelo : 'General',
        talla: dt ? dt.talla : 0,
        pares_completos: rec.pares_completos_entregados,
        faltantes_izquierdos: rec.faltantes_izquierdos,
        faltantes_derechos: rec.faltantes_derechos,
        nota: rec.nota || 'Sin nota de incidencia registrada.',
        alerta_activa: rec.alerta_activa,
      };
    });
  }

  static resolverAlerta(recepcionId: string): void {
    const recepciones = this.getRecepciones();
    const index = recepciones.findIndex((r) => r.id === recepcionId);
    if (index !== -1) {
      recepciones[index].alerta_activa = false;
      setStoredData(STORAGE_KEYS.RECEPCIONES, recepciones);
    }
  }

  static registrarRecepcionDirecta(input: {
    maquilero_id: string;
    items: {
      modelo: string;
      talla: number;
      pares_completos: number;
      faltantes_izq: number;
      faltantes_der: number;
      pares_segunda?: number;
      mermas_totales?: number;
      tipo_defecto?: any;
      cargo_maquilero_mxn?: number;
    }[];
    nota: string;
  }): { totalRegistrados: number; contieneAlerta: boolean } {
    const ordenes = this.getOrdenesSalida();
    let detalles = this.getOrdenesDetalle();
    const recepciones = this.getRecepciones();

    let totalRegistrados = 0;
    let contieneAlerta = false;

    const tieneFaltantesTotales = input.items.some(
      (it) => it.faltantes_izq > 0 || it.faltantes_der > 0 || (it.mermas_totales || 0) > 0 || (it.cargo_maquilero_mxn || 0) > 0
    );
    const tieneNota = input.nota.trim().length > 0;
    const generaAlertaGlobal = tieneFaltantesTotales || tieneNota;

    for (const item of input.items) {
      if (
        item.pares_completos <= 0 &&
        item.faltantes_izq <= 0 &&
        item.faltantes_der <= 0 &&
        (item.pares_segunda || 0) <= 0 &&
        (item.mermas_totales || 0) <= 0
      ) {
        continue;
      }

      let ordenMatch = ordenes.find(
        (o) => o.maquilero_id === input.maquilero_id && o.modelo === item.modelo && o.estatus === 'Pendiente'
      );

      if (!ordenMatch) {
        ordenMatch = {
          id: `ORD-2026-${String(ordenes.length + 1).padStart(3, '0')}`,
          maquilero_id: input.maquilero_id,
          modelo: item.modelo,
          fecha_envio: new Date().toISOString().split('T')[0],
          estatus: 'Pendiente',
        };
        ordenes.unshift(ordenMatch);
      }

      let dtMatch = detalles.find(
        (d) => d.orden_id === ordenMatch!.id && d.talla === item.talla
      );

      if (!dtMatch) {
        dtMatch = {
          id: generarId('dt-auto'),
          orden_id: ordenMatch.id,
          talla: item.talla,
          pares_enviados: item.pares_completos + item.faltantes_izq + item.faltantes_der + (item.mermas_totales || 0),
        };
        detalles.unshift(dtMatch);
      }

      const esAlertaItem =
        item.faltantes_izq > 0 ||
        item.faltantes_der > 0 ||
        (item.mermas_totales || 0) > 0 ||
        (item.cargo_maquilero_mxn || 0) > 0 ||
        generaAlertaGlobal;

      if (esAlertaItem) contieneAlerta = true;

      const nuevaRecepcion: Recepcion = {
        id: generarId('rec'),
        orden_detalle_id: dtMatch.id,
        fecha_recepcion: new Date().toISOString(),
        pares_completos_entregados: item.pares_completos,
        faltantes_izquierdos: item.faltantes_izq,
        faltantes_derechos: item.faltantes_der,
        pares_segunda: item.pares_segunda || 0,
        mermas_totales: item.mermas_totales || 0,
        tipo_defecto: item.tipo_defecto || undefined,
        cargo_maquilero_mxn: item.cargo_maquilero_mxn || 0,
        nota: tieneNota
          ? input.nota.trim()
          : item.tipo_defecto
          ? `Defecto QC (${item.tipo_defecto}): ${item.mermas_totales || 0} mermas / ${item.pares_segunda || 0} 2das`
          : null,
        alerta_activa: esAlertaItem,
      };

      recepciones.unshift(nuevaRecepcion);
      totalRegistrados += item.pares_completos;
    }

    setStoredData(STORAGE_KEYS.ORDENES, ordenes);
    setStoredData(STORAGE_KEYS.DETALLES, detalles);
    setStoredData(STORAGE_KEYS.RECEPCIONES, recepciones);

    // Cerrar la orden (estatus 'Completado') cuando ya se recibio o justifico
    // todo lo enviado; asi el tablero deja de contarla como envio pendiente.
    const detallesGuardados = this.getOrdenesDetalle();
    const recepcionesGuardadas = this.getRecepciones();
    let ordenesCambiadas = false;

    for (const orden of ordenes) {
      const detallesOrden = detallesGuardados.filter((d) => d.orden_id === orden.id);
      if (detallesOrden.length === 0) continue;

      const completa = detallesOrden.every((dt) => {
        const acumulado = recepcionesGuardadas
          .filter((r) => r.orden_detalle_id === dt.id)
          .reduce(
            (acc, r) =>
              acc +
              r.pares_completos_entregados +
              r.faltantes_izquierdos +
              r.faltantes_derechos +
              (r.pares_segunda || 0) +
              (r.mermas_totales || 0),
            0
          );
        return acumulado >= dt.pares_enviados;
      });

      const nuevoEstatus = completa ? 'Completado' : 'Pendiente';
      if (orden.estatus !== nuevoEstatus) {
        orden.estatus = nuevoEstatus;
        ordenesCambiadas = true;
      }
    }

    if (ordenesCambiadas) {
      setStoredData(STORAGE_KEYS.ORDENES, ordenes);
    }

    // Sincronizar actualización de Lote WIP en /procesos a 'Producto Terminado'
    const lotes = this.getLotesProduccion();
    let lotesCambiados = false;

    for (const item of input.items) {
      const ordenItem = ordenes.find(
        (o) => o.maquilero_id === input.maquilero_id && o.modelo === item.modelo
      );
      // El lote pasa a Producto Terminado solo cuando la orden ya quedo completa
      if (!ordenItem || ordenItem.estatus !== 'Completado') continue;

      const loteMatch = lotes.find(
        (l) =>
          l.modelo.toLowerCase() === item.modelo.toLowerCase() &&
          l.etapa_actual !== 'Producto Terminado'
      );
      if (loteMatch) {
        loteMatch.etapa_actual = 'Producto Terminado';
        lotesCambiados = true;
      }
    }

    if (lotesCambiados) {
      setStoredData(STORAGE_KEYS.LOTES_PRODUCCION, lotes);
    }

    return { totalRegistrados, contieneAlerta };
  }


  static calcularCorteSabatino(
    maquileroId: string,
    fechaInicio: string,
    fechaFin: string,
    recepcionesExcluidas: Set<string> = new Set()
  ): ResumenCorteSabatino | null {
    const maquileros = this.getMaquileros();
    const maquilero = maquileros.find((m) => m.id === maquileroId);
    if (!maquilero) return null;

    const ordenes = this.getOrdenesSalida().filter((o) => o.maquilero_id === maquileroId);
    const detalles = this.getOrdenesDetalle();
    const recepciones = this.getRecepciones();

    const ordenesIds = new Set(ordenes.map((o) => o.id));
    const detallesFiltrados = detalles.filter((d) => ordenesIds.has(d.orden_id));
    const detallesMap = new Map(detallesFiltrados.map((d) => [d.id, d]));

    const inicio = parseFechaHoraLocal(fechaInicio, false);
    const fin = parseFechaHoraLocal(fechaFin, true);

    const items: CorteSabatinoItem[] = [];
    const incidencias: ResumenCorteSabatino['incidencias'] = [];

    let totalParesCompletos = 0;
    let totalFaltantesPiezas = 0;
    let totalParesSegunda = 0;
    let totalMermas = 0;
    let totalCargosQCMXN = 0;

    for (const rec of recepciones) {
      if (recepcionesExcluidas.has(rec.id)) continue;
      const dt = detallesMap.get(rec.orden_detalle_id);
      if (!dt) continue;

      const recDate = new Date(rec.fecha_recepcion);
      if (recDate >= inicio && recDate <= fin) {
        const ord = ordenes.find((o) => o.id === dt.orden_id);
        const subtotal = rec.pares_completos_entregados * maquilero.tarifa_por_par - (rec.cargo_maquilero_mxn || 0);

        totalParesCompletos += rec.pares_completos_entregados;
        const faltantesPiezas = rec.faltantes_izquierdos + rec.faltantes_derechos;
        totalFaltantesPiezas += faltantesPiezas;

        totalParesSegunda += rec.pares_segunda || 0;
        totalMermas += rec.mermas_totales || 0;
        totalCargosQCMXN += rec.cargo_maquilero_mxn || 0;

        items.push({
          recepcion_id: rec.id,
          fecha: rec.fecha_recepcion,
          modelo: ord ? ord.modelo : 'N/A',
          talla: dt.talla,
          pares_completos: rec.pares_completos_entregados,
          faltantes_izq: rec.faltantes_izquierdos,
          faltantes_der: rec.faltantes_derechos,
          pares_segunda: rec.pares_segunda || 0,
          mermas_totales: rec.mermas_totales || 0,
          tipo_defecto: rec.tipo_defecto,
          cargo_maquilero_mxn: rec.cargo_maquilero_mxn || 0,
          tarifa_unitaria: maquilero.tarifa_por_par,
          subtotal_pagar: subtotal,
          nota: rec.nota,
        });

        if (faltantesPiezas > 0 || (rec.mermas_totales || 0) > 0 || (rec.cargo_maquilero_mxn || 0) > 0 || rec.nota) {
          incidencias.push({
            fecha: rec.fecha_recepcion,
            modelo: ord ? ord.modelo : 'N/A',
            talla: dt.talla,
            faltantes: `Izq: ${rec.faltantes_izquierdos} | Der: ${rec.faltantes_derechos} | 2da: ${rec.pares_segunda || 0} | Merma: ${rec.mermas_totales || 0}`,
            nota: rec.cargo_maquilero_mxn
              ? `Cargo QC: -$${rec.cargo_maquilero_mxn.toFixed(2)} MXN (${rec.tipo_defecto || 'Defecto'}). ${rec.nota || ''}`
              : rec.nota || 'Sin detalle de nota.',
          });
        }
      }
    }

    // --- INTEGRACIÓN: FORRADO DE PLANTA ---
    const ticketsForrado = this.getTicketsForrado().filter(t => t.maquilero_id === maquileroId);
    const ticketsForradoIds = new Set(ticketsForrado.map(t => t.id));
    const recepcionesForrado = this.getRecepcionesForrado().filter(r => ticketsForradoIds.has(r.ticket_id));

    for (const rec of recepcionesForrado) {
      if (recepcionesExcluidas.has(rec.id)) continue;
      const recDate = parseFechaHoraLocal(rec.fecha, false);
      if (recDate >= inicio && recDate <= fin) {
        const ticket = ticketsForrado.find(t => t.id === rec.ticket_id);
        const subtotal = rec.pares_recibidos * maquilero.tarifa_por_par;

        totalParesCompletos += rec.pares_recibidos;

        items.push({
          recepcion_id: rec.id,
          fecha: rec.fecha,
          modelo: 'FORRADO DE PLANTA',
          talla: 0,
          pares_completos: rec.pares_recibidos,
          faltantes_izq: 0,
          faltantes_der: 0,
          pares_segunda: 0,
          mermas_totales: 0,
          cargo_maquilero_mxn: 0,
          tarifa_unitaria: maquilero.tarifa_por_par,
          subtotal_pagar: subtotal,
          nota: rec.notas || `Ticket ${ticket?.folio}`,
        });
      }
    }
    // ----------------------------------------

    const totalPagarMXN = Math.max(0, totalParesCompletos * maquilero.tarifa_por_par - totalCargosQCMXN);

    return {
      maquilero,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      total_pares_completos: totalParesCompletos,
      total_faltantes_piezas: totalFaltantesPiezas,
      total_pares_segunda: totalParesSegunda,
      total_mermas: totalMermas,
      total_cargos_qc_mxn: totalCargosQCMXN,
      total_pagar_mxn: totalPagarMXN,
      items,
      incidencias,
    };
  }


  static calcularPagoSemanal(
    maquileroId: string,
    fechaInicio: string,
    fechaFin: string,
    recepcionesExcluidas: Set<string> = new Set()
  ): ResumenPagoSemanal | null {
    return this.calcularCorteSabatino(maquileroId, fechaInicio, fechaFin, recepcionesExcluidas);
  }

  // GESTIÓN DE HISTORIAL DE TICKETS DE PAGOS SEMANALES
  static getTicketsPagoSemanal(): TicketPagoSemanalGuardado[] {
    const list = getStoredData<TicketPagoSemanalGuardado[]>(STORAGE_KEYS.TICKETS_PAGOS, INITIAL_TICKETS_PAGOS);
    return list.sort((a, b) => new Date(b.fecha_guardado).getTime() - new Date(a.fecha_guardado).getTime());
  }

  static guardarTicketPagoSemanal(resumen: ResumenPagoSemanal & { estado?: 'POR_PAGAR' | 'PAGADO' }): TicketPagoSemanalGuardado {
    const tickets = this.getTicketsPagoSemanal();
    const count = tickets.length + 1;
    const year = new Date().getFullYear();
    const folioStr = String(count).padStart(3, '0');
    
    const nuevoTicket: TicketPagoSemanalGuardado = {
      id: generarId('ticket'),
      folio: `TCK-${year}-${folioStr}`,
      fecha_guardado: new Date().toISOString(),
      maquilero_id: resumen.maquilero.id,
      maquilero_nombre: resumen.maquilero.nombre,
      tarifa_por_par: resumen.maquilero.tarifa_por_par,
      fecha_inicio: resumen.fecha_inicio,
      fecha_fin: resumen.fecha_fin,
      total_pares_completos: resumen.total_pares_completos,
      total_faltantes_piezas: resumen.total_faltantes_piezas,
      total_pares_segunda: resumen.total_pares_segunda || 0,
      total_mermas: resumen.total_mermas || 0,
      total_cargos_qc_mxn: resumen.total_cargos_qc_mxn || 0,
      total_pagar_mxn: resumen.total_pagar_mxn,
      estado: resumen.estado || 'POR_PAGAR',
      items: resumen.items,
      incidencias: resumen.incidencias,
    };

    tickets.unshift(nuevoTicket);
    setStoredData(STORAGE_KEYS.TICKETS_PAGOS, tickets);
    return nuevoTicket;
  }

  static eliminarTicketPagoSemanal(id: string): void {
    const tickets = this.getTicketsPagoSemanal().filter((t) => t.id !== id);
    setStoredData(STORAGE_KEYS.TICKETS_PAGOS, tickets);
  }

  static actualizarEstadoTicket(id: string, nuevoEstado: 'POR_PAGAR' | 'PAGADO'): TicketPagoSemanalGuardado | null {
    const tickets = this.getTicketsPagoSemanal();
    const index = tickets.findIndex(t => t.id === id);
    if (index === -1) return null;
    
    tickets[index].estado = nuevoEstado;
    setStoredData(STORAGE_KEYS.TICKETS_PAGOS, tickets);
    return tickets[index];
  }

  // GESTIÓN DE PEDIDOS DE CLIENTES / FÁBRICA Y LOTES DE PRODUCCIÓN
  static getPedidosCliente(): PedidoCliente[] {
    return getStoredData<PedidoCliente[]>(STORAGE_KEYS.PEDIDOS, INITIAL_PEDIDOS_CLIENTES);
  }

  static crearPedidoCliente(input: {
    cliente: string;
    modelo: string;
    notas?: string;
    desglose_tallas: { talla: number; pares: number }[];
  }): PedidoCliente {
    const pedidos = this.getPedidosCliente();
    const count = pedidos.length + 1;
    const year = new Date().getFullYear();
    const totalPares = input.desglose_tallas.reduce((sum, item) => sum + Math.max(0, item.pares), 0);

    const nuevoPedido: PedidoCliente = {
      id: generarId('ped'),
      folio: `PED-${year}-${String(count).padStart(3, '0')}`,
      cliente: input.cliente.trim(),
      modelo: input.modelo.trim(),
      fecha_pedido: new Date().toISOString().split('T')[0],
      total_pares: totalPares,
      estatus: 'Pendiente',
      notas: input.notas ? input.notas.trim() : undefined,
      desglose_tallas: input.desglose_tallas.map((item) => ({
        talla: item.talla,
        pares_solicitados: Math.max(0, item.pares),
        pares_enviados_lotes: 0,
      })),
    };

    pedidos.unshift(nuevoPedido);
    setStoredData(STORAGE_KEYS.PEDIDOS, pedidos);
    return nuevoPedido;
  }

  static eliminarPedidoCliente(id: string): void {
    const pedidos = this.getPedidosCliente().filter((p) => p.id !== id);
    setStoredData(STORAGE_KEYS.PEDIDOS, pedidos);
  }

  static editarPedidoCliente(id: string, update: {
    cliente?: string;
    modelo?: string;
    notas?: string;
    desglose_tallas?: { talla: number; pares: number }[];
  }): PedidoCliente | null {
    const pedidos = this.getPedidosCliente();
    const index = pedidos.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const desglose = update.desglose_tallas
      ? update.desglose_tallas.map((item) => ({
          talla: item.talla,
          pares_solicitados: Math.max(0, item.pares),
          pares_enviados_lotes: 0,
        }))
      : pedidos[index].desglose_tallas;

    pedidos[index] = {
      ...pedidos[index],
      ...(update.cliente !== undefined ? { cliente: update.cliente.trim() } : {}),
      ...(update.modelo !== undefined ? { modelo: update.modelo.trim() } : {}),
      ...(update.notas !== undefined ? { notas: update.notas.trim() || undefined } : {}),
      desglose_tallas: desglose,
      total_pares: desglose.reduce((sum, item) => sum + item.pares_solicitados, 0),
    };
    setStoredData(STORAGE_KEYS.PEDIDOS, pedidos);
    return pedidos[index];
  }

  // GESTIÓN DE SALIDAS GENERALES DE MATERIAL (CONSUMO INTERNO, MERMA, PRUEBAS, ETC.)
  static getSalidasGenerales(): SalidaGeneral[] {
    const list = getStoredData<SalidaGeneral[]>(STORAGE_KEYS.SALIDAS_GENERALES, INITIAL_SALIDAS_GENERALES);
    return list.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }

  static crearSalidaGeneral(input: {
    tipo_material: string;
    talla?: number;
    cantidad: number;
    unidad: string;
    motivo_concepto: string;
    entregado_a?: string;
    notas?: string;
  }): SalidaGeneral {
    const salidas = this.getSalidasGenerales();
    const inventario = this.getInventarioCrudo();
    const count = salidas.length + 1;
    const year = new Date().getFullYear();

    const nuevaSalida: SalidaGeneral = {
      id: generarId('sg'),
      folio: `SG-${year}-${String(count).padStart(3, '0')}`,
      fecha: new Date().toISOString().split('T')[0],
      tipo_material: input.tipo_material.trim(),
      talla: input.talla !== undefined ? Number(input.talla) : 0,
      cantidad: Math.max(1, Number(input.cantidad)),
      unidad: input.unidad || 'unidades',
      motivo_concepto: input.motivo_concepto.trim(),
      entregado_a: input.entregado_a ? input.entregado_a.trim() : undefined,
      notas: input.notas ? input.notas.trim() : undefined,
    };

    salidas.unshift(nuevaSalida);

    // Descontar del inventario crudo si coincide el tipo de material y la talla
    const invMatch = inventario.find(
      (i) =>
        i.tipo_material.toLowerCase() === input.tipo_material.toLowerCase() &&
        (input.talla === undefined || input.talla === 0 || i.talla === input.talla)
    );
    if (invMatch) {
      invMatch.cantidad_total = Math.max(0, invMatch.cantidad_total - nuevaSalida.cantidad);
      setStoredData(STORAGE_KEYS.INVENTARIO, inventario);
    }

    setStoredData(STORAGE_KEYS.SALIDAS_GENERALES, salidas);
    return nuevaSalida;
  }

  static eliminarSalidaGeneral(id: string): void {
    const salidas = this.getSalidasGenerales().filter((s) => s.id !== id);
    setStoredData(STORAGE_KEYS.SALIDAS_GENERALES, salidas);
  }

  static clearAllData(): void {
    if (typeof window === 'undefined') return;
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
      localStorage.setItem(key, JSON.stringify([]));
    });
    // Se restauran los catalogos base (modelos, recetas de materiales, inventario
    // y proveedores) para que el sistema siga siendo utilizable despues de limpiar
    // los datos de prueba; de lo contrario la Explosion de Materiales quedaria vacia.
    localStorage.setItem(STORAGE_KEYS.MODELOS, JSON.stringify(INITIAL_MODELOS));
    localStorage.setItem(STORAGE_KEYS.FICHAS_TECNICAS_BOM, JSON.stringify(INITIAL_FICHAS_TECNICAS_BOM));
    localStorage.setItem(STORAGE_KEYS.INVENTARIO, JSON.stringify(INITIAL_INVENTARIO_CRUDO));
    localStorage.setItem(STORAGE_KEYS.PROVEEDORES, JSON.stringify(INITIAL_PROVEEDORES));
    localStorage.setItem('calzado_pwa_system_wiped_clean_v1', 'true');
  }

  static resetToDefault(): void {
    this.clearAllData();
  }

  // ========================================
  // PROVEEDORES DE MATERIA PRIMA
  // ========================================
  static getProveedores(): Proveedor[] {
    return getStoredData(STORAGE_KEYS.PROVEEDORES, INITIAL_PROVEEDORES);
  }

  static crearProveedor(input: {
    nombre: string;
    contacto?: string;
    telefono?: string;
    materiales_que_surte?: string;
    notas?: string;
  }): Proveedor {
    const list = this.getProveedores();
    const nuevo: Proveedor = {
      id: generarId('prov'),
      nombre: input.nombre.trim(),
      contacto: input.contacto ? input.contacto.trim() : undefined,
      telefono: input.telefono ? input.telefono.trim() : undefined,
      materiales_que_surte: input.materiales_que_surte ? input.materiales_que_surte.trim() : undefined,
      notas: input.notas ? input.notas.trim() : undefined,
    };
    list.unshift(nuevo);
    setStoredData(STORAGE_KEYS.PROVEEDORES, list);
    return nuevo;
  }

  static editarProveedor(id: string, update: Partial<Proveedor>): Proveedor | null {
    const list = this.getProveedores();
    const index = list.findIndex((p) => p.id === id);
    if (index === -1) return null;

    list[index] = {
      ...list[index],
      ...update,
      nombre: update.nombre?.trim() || list[index].nombre,
      contacto: update.contacto?.trim() || undefined,
      telefono: update.telefono?.trim() || undefined,
      materiales_que_surte: update.materiales_que_surte?.trim() || undefined,
    };
    setStoredData(STORAGE_KEYS.PROVEEDORES, list);
    return list[index];
  }

  static eliminarProveedor(id: string): void {
    const list = this.getProveedores().filter((p) => p.id !== id);
    setStoredData(STORAGE_KEYS.PROVEEDORES, list);
  }

  // ========================================
  // ÓRDENES DE COMPRA
  // ========================================
  static getOrdenesCompra(): OrdenCompra[] {
    return getStoredData(STORAGE_KEYS.ORDENES_COMPRA, []);
  }

  static crearOrdenCompra(input: {
    proveedor_id: string;
    proveedor_nombre: string;
    items: OrdenCompraItem[];
    notas?: string;
  }): OrdenCompra {
    const list = this.getOrdenesCompra();
    const count = list.length + 1;
    const year = new Date().getFullYear();

    const totalEstimado = input.items.reduce((sum, it) => sum + (it.costo_total || 0), 0);

    const nuevaOC: OrdenCompra = {
      id: generarId('oc'),
      folio: `OC-${year}-${String(count).padStart(3, '0')}`,
      fecha: new Date().toISOString().split('T')[0],
      proveedor_id: input.proveedor_id,
      proveedor_nombre: input.proveedor_nombre,
      estatus: 'Pendiente',
      items: input.items,
      total_estimado_mxn: totalEstimado,
      notas: input.notas ? input.notas.trim() : undefined,
    };

    list.unshift(nuevaOC);
    setStoredData(STORAGE_KEYS.ORDENES_COMPRA, list);
    return nuevaOC;
  }

  static eliminarOrdenCompra(id: string): void {
    const list = this.getOrdenesCompra().filter((oc) => oc.id !== id);
    setStoredData(STORAGE_KEYS.ORDENES_COMPRA, list);
  }

  static generarOrdenCompraDesdeExplosion(
    faltantes: ResultadoExplosionMateriales[],
    proveedor_id: string,
    proveedor_nombre: string
  ): OrdenCompra {
    const items: OrdenCompraItem[] = faltantes
      .filter((f) => !f.suficiente || f.diferencia_stock < 0)
      .map((f) => ({
        material_nombre: f.material_nombre,
        cantidad_requerida: Math.abs(f.diferencia_stock),
        unidad_medida: f.unidad_medida_total,
        costo_unitario: f.costo_unitario || 0,
        costo_total: Number(((f.costo_unitario || 0) * Math.abs(f.diferencia_stock)).toFixed(2)),
      }));

    return this.crearOrdenCompra({
      proveedor_id,
      proveedor_nombre,
      items,
      notas: `Generada automáticamente desde Explosión de Materiales`,
    });
  }

  // ========================================
  // PORCENTAJE DE CUMPLIMIENTO
  // ========================================
  static calcularCumplimientoGlobal(): {
    porcentaje_entrega: number;
    pares_terminados: number;
    pares_totales: number;
    lotes_terminados: number;
    lotes_totales: number;
  } {
    const lotes = this.getLotesProduccion();
    if (lotes.length === 0) {
      return { porcentaje_entrega: 0, pares_terminados: 0, pares_totales: 0, lotes_terminados: 0, lotes_totales: 0 };
    }

    const paresTotales = lotes.reduce((sum, l) => sum + l.total_pares, 0);
    const lotesTerminados = lotes.filter((l) => l.etapa_actual === 'Producto Terminado');
    const paresTerminados = lotesTerminados.reduce((sum, l) => sum + l.total_pares, 0);
    const porcentaje = paresTotales > 0 ? Math.round((paresTerminados / paresTotales) * 100) : 0;

    return {
      porcentaje_entrega: porcentaje,
      pares_terminados: paresTerminados,
      pares_totales: paresTotales,
      lotes_terminados: lotesTerminados.length,
      lotes_totales: lotes.length,
    };
  }

  static calcularProgresoLote(lote: LoteProduccion): number {
    const etapasOrden: EtapaProduccion[] = ['Corte', 'Pespunte', 'Forrado', 'Montado', 'Adornado', 'Producto Terminado'];
    const idx = etapasOrden.indexOf(lote.etapa_actual);
    if (idx === -1) return 0;
    // Producto Terminado = 100%
    return Math.round(((idx + 1) / etapasOrden.length) * 100);
  }

  // ========================================
  // ALERTAS DE LOTES VENCIDOS
  // ========================================
  static getLotesVencidos(): (LoteProduccion & { dias_atraso: number; estatus_vencimiento: 'vencido' | 'por_vencer' | 'a_tiempo' })[] {
    const lotes = this.getLotesProduccion();
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    return lotes
      .filter((l) => l.etapa_actual !== 'Producto Terminado')
      .map((l) => {
        // Calcular fecha de entrega comprometida (fecha_inicio + 14 días por defecto para producción)
        const fechaInicio = parseFechaHoraLocal(l.fecha_inicio, false);
        const fechaEntregaEstimada = new Date(fechaInicio);
        fechaEntregaEstimada.setDate(fechaEntregaEstimada.getDate() + 14); // 2 semanas estándar de producción

        const diffMs = hoy.getTime() - fechaEntregaEstimada.getTime();
        const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        let estatus: 'vencido' | 'por_vencer' | 'a_tiempo' = 'a_tiempo';
        if (diffDias > 0) {
          estatus = 'vencido';
        } else if (diffDias >= -3) {
          estatus = 'por_vencer'; // 3 días antes de la fecha límite
        }

        return {
          ...l,
          dias_atraso: diffDias,
          estatus_vencimiento: estatus,
        };
      })
      .filter((l) => l.estatus_vencimiento !== 'a_tiempo')
      .sort((a, b) => b.dias_atraso - a.dias_atraso);
  }

  // ========================================
  // FORRADO DE PLANTA (MVP)
  // ========================================

  static getTicketsForrado(): TicketForrado[] {
    return getStoredData(STORAGE_KEYS.TICKETS_FORRADO, INITIAL_TICKETS_FORRADO);
  }

  static getRecepcionesForrado(): RecepcionForrado[] {
    return getStoredData(STORAGE_KEYS.RECEPCIONES_FORRADO, INITIAL_RECEPCIONES_FORRADO);
  }

  static crearTicketForrado(input: {
    maquilero_id: string;
    pares_enviados: number;
    pegamento_consumido: number;
    forro_consumido: number;
    notas?: string;
  }): TicketForrado {
    const list = this.getTicketsForrado();
    const num = list.length + 1;
    const folio = `FOR-2026-${String(num).padStart(3, '0')}`;

    const maq = this.getMaquileros().find((m) => m.id === input.maquilero_id);
    const maquilero_nombre = maq ? maq.nombre : 'Desconocido';

    const nuevo: TicketForrado = {
      id: generarId('for'),
      folio,
      fecha: new Date().toISOString().split('T')[0],
      maquilero_id: input.maquilero_id,
      maquilero_nombre,
      pares_enviados: input.pares_enviados,
      pares_recibidos: 0,
      pegamento_consumido: input.pegamento_consumido,
      forro_consumido: input.forro_consumido,
      estatus: 'Pendiente',
      notas: input.notas,
      creado_en: new Date().toISOString(),
    };

    list.unshift(nuevo);
    setStoredData(STORAGE_KEYS.TICKETS_FORRADO, list);
    return nuevo;
  }

  static recibirPlantaForrada(ticketId: string, pares_recibir: number, notas?: string): {
    exito: boolean;
    ticket?: TicketForrado;
    error?: string;
  } {
    const tickets = this.getTicketsForrado();
    const index = tickets.findIndex((t) => t.id === ticketId);
    if (index === -1) return { exito: false, error: 'Ticket no encontrado' };

    const ticket = tickets[index];
    const paresRestantes = ticket.pares_enviados - ticket.pares_recibidos;

    if (pares_recibir <= 0 || pares_recibir > paresRestantes) {
      return { exito: false, error: 'Cantidad inválida o excede los pares faltantes' };
    }

    ticket.pares_recibidos += pares_recibir;
    if (ticket.pares_recibidos >= ticket.pares_enviados) {
      ticket.estatus = 'Completado';
    } else {
      ticket.estatus = 'Parcial';
    }

    // Guardar ticket
    tickets[index] = ticket;
    setStoredData(STORAGE_KEYS.TICKETS_FORRADO, tickets);

    // Crear registro de recepción parcial
    const recepciones = this.getRecepcionesForrado();
    recepciones.unshift({
      id: generarId('rec-for'),
      ticket_id: ticketId,
      fecha: new Date().toISOString().split('T')[0],
      pares_recibidos: pares_recibir,
      notas,
      creado_en: new Date().toISOString(),
    });
    setStoredData(STORAGE_KEYS.RECEPCIONES_FORRADO, recepciones);

    return { exito: true, ticket };
  }
}
