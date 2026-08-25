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
} from '@/types/database';

export const INITIAL_MODELOS: ModeloCalzado[] = [
  {
    id: 'mod-hellen-3596',
    nombre: 'HELLEN - 3596',
    horma: 'HELLEN',
    linea: 'HELLEN - 3596',
    moldura: '3596',
    estilo: '3596-02 CHAROL NEGRO ADRIANA BOCANEGRA (NEGRO)',
    descripcion_estilo: 'ZAPATILLA DESTALONADA CON MOÑO',
    cliente_default: 'ADRIANA BOCANEGRA',
    troquel_especificacion: 'NOM 20 / TROQUEL: SINTETICO / SINTETICO PLATA / BOCASSAO PLATA',
  },
  {
    id: 'mod-frozen',
    nombre: 'Frozen',
    horma: 'FROZEN',
    linea: 'FROZEN - 2026',
    moldura: '2026',
    estilo: 'SANDALIA PLATAFORMA FROZEN',
    descripcion_estilo: 'SANDALIA PLATAFORMA TACÓN 9CM',
    cliente_default: 'CLASBEN',
    troquel_especificacion: 'NOM 20 / TROQUEL: SINTETICO / ORO',
  },
  {
    id: 'mod-carol',
    nombre: 'Carol',
    horma: 'CAROL',
    linea: 'CAROL - CONFORT',
    moldura: '1420',
    estilo: 'MOCASÍN CONFORT DAMA',
    descripcion_estilo: 'MOCASÍN SUAVE CON HERRAJE',
    cliente_default: 'CKLASS',
    troquel_especificacion: 'NOM 20 / TROQUEL: PIEL VACUNO / NEGRO',
  },
];

export const INITIAL_FICHAS_TECNICAS_BOM: FichaTecnicaModeloBOM[] = [
  {
    id: 'bom-hellen-3596',
    modelo_nombre: 'HELLEN - 3596',
    notas: 'Receta estándar Zapatilla Destalonada con Moño 48 pares / Programa 260228',
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
        material_nombre: 'CAJA BOCASSAO 31*16.5*10.5',
        cantidad_por_par: 1.00,
        unidad_medida: 'PIEZA',
        consumo_total_unidad: 'PIEZA',
        factor_conversion: 1,
        seccion: 'empaque',
      },
      {
        id: 'r-13',
        pieza: 'PLANTA',
        material_nombre: 'HELLEN ESQ. 3596',
        cantidad_por_par: 1.00,
        unidad_medida: 'PAR',
        consumo_total_unidad: 'PAR',
        factor_conversion: 1,
        seccion: 'suela_planta_tacon',
      },
      {
        id: 'r-14',
        pieza: 'SUELA',
        material_nombre: 'HELLEN NEGRO C/NEGRO',
        cantidad_por_par: 1.00,
        unidad_medida: 'PAR',
        consumo_total_unidad: 'PAR',
        factor_conversion: 1,
        seccion: 'suela_planta_tacon',
      },
      {
        id: 'r-15',
        pieza: 'TACON',
        material_nombre: 'LULU CON FIRME NEGRO',
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
  { id: 'inv-1', tipo_material: 'CHAROL 0.8 HQ NEGRO BOMBOM', talla: 0, cantidad_total: 50, unidad_medida: 'MT', seccion: 'corte' },
  { id: 'inv-2', tipo_material: 'CHAROL 0.8 HQ NEGRO VIRGEN', talla: 0, cantidad_total: 80, unidad_medida: 'MT', seccion: 'corte' },
  { id: 'inv-3', tipo_material: 'TIRA DOBLELLADA A TOPE 9MM CHAROL NEGRO', talla: 0, cantidad_total: 200, unidad_medida: 'MT', seccion: 'corte' },
  { id: 'inv-4', tipo_material: 'DURAZNO NEGRO VIRGEN', talla: 0, cantidad_total: 30, unidad_medida: 'MT', seccion: 'corte' },
  { id: 'inv-5', tipo_material: 'FORRO BARCELONA NEGRO', talla: 0, cantidad_total: 100, unidad_medida: 'MT', seccion: 'corte' },
  { id: 'inv-6', tipo_material: 'ELASTICO FORRADO 6MM KENYA NEGRO', talla: 0, cantidad_total: 50, unidad_medida: 'MT', seccion: 'corte' },
  { id: 'inv-7', tipo_material: 'ASTARX BR', talla: 0, cantidad_total: 40, unidad_medida: 'MT', seccion: 'corte' },
  { id: 'inv-8', tipo_material: 'LATEX 3MM REGULAR NATURAL SOFT', talla: 0, cantidad_total: 40, unidad_medida: 'MT', seccion: 'corte' },
  { id: 'inv-9', tipo_material: 'CHINA BLANCO 30X70', talla: 0, cantidad_total: 2, unidad_medida: 'MILLAR', seccion: 'empaque' },
  { id: 'inv-10', tipo_material: 'CAJA BOCASSAO 31*16.5*10.5', talla: 0, cantidad_total: 500, unidad_medida: 'PIEZA', seccion: 'empaque' },
  { id: 'inv-11', tipo_material: 'HELLEN ESQ. 3596', talla: 23, cantidad_total: 50, unidad_medida: 'PAR', seccion: 'suela_planta_tacon' },
  { id: 'inv-12', tipo_material: 'HELLEN ESQ. 3596', talla: 24, cantidad_total: 100, unidad_medida: 'PAR', seccion: 'suela_planta_tacon' },
  { id: 'inv-13', tipo_material: 'HELLEN ESQ. 3596', talla: 25, cantidad_total: 100, unidad_medida: 'PAR', seccion: 'suela_planta_tacon' },
  { id: 'inv-14', tipo_material: 'HELLEN NEGRO C/NEGRO', talla: 23, cantidad_total: 50, unidad_medida: 'PAR', seccion: 'suela_planta_tacon' },
  { id: 'inv-15', tipo_material: 'HELLEN NEGRO C/NEGRO', talla: 24, cantidad_total: 100, unidad_medida: 'PAR', seccion: 'suela_planta_tacon' },
  { id: 'inv-16', tipo_material: 'HELLEN NEGRO C/NEGRO', talla: 25, cantidad_total: 100, unidad_medida: 'PAR', seccion: 'suela_planta_tacon' },
  { id: 'inv-17', tipo_material: 'LULU CON FIRME NEGRO', talla: 0, cantidad_total: 300, unidad_medida: 'PAR', seccion: 'suela_planta_tacon' },
];

export const INITIAL_LOTES_PRODUCCION: LoteProduccion[] = [
  {
    id: 'lote-1568',
    folio: 'LOT-1568',
    modelo: 'HELLEN - 3596',
    total_pares: 48,
    etapa_actual: 'Corte',
    fecha_inicio: '2026-07-29',
    desglose_tallas: [
      { talla: 23, pares: 4 },
      { talla: 23.5, pares: 4 },
      { talla: 24, pares: 8 },
      { talla: 24.5, pares: 8 },
      { talla: 25, pares: 8 },
      { talla: 25.5, pares: 8 },
      { talla: 26, pares: 8 },
    ],
    notas: 'Programa 260228 - Zapatilla Destalonada con Moño - Cliente Adriana Bocanegra',
  },
];

export const INITIAL_MAQUILEROS: Maquilero[] = [
  { id: 'mq-1', nombre: 'Taller Don Beto - Forrado & Montado', tarifa_por_par: 16.5 },
  { id: 'mq-2', nombre: 'Pespunte Doña Carmen', tarifa_por_par: 14.0 },
];
export const INITIAL_ORDENES_SALIDA: OrdenSalida[] = [];
export const INITIAL_ORDENES_SALIDA_DETALLE: OrdenSalidaDetalle[] = [];
export const INITIAL_RECEPCIONES: Recepcion[] = [];
export const INITIAL_TICKETS_PAGOS: TicketPagoSemanalGuardado[] = [];
export const INITIAL_PEDIDOS_CLIENTES: PedidoCliente[] = [];
export const INITIAL_SALIDAS_GENERALES: SalidaGeneral[] = [];

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
};

function checkAndAutoPurgeOnce(): void {
  if (typeof window === 'undefined') return;
  // Inicializar con datos si está vacío
  if (localStorage.getItem('calzado_pwa_system_v2_initialized') !== 'true') {
    if (!localStorage.getItem(STORAGE_KEYS.MODELOS) || JSON.parse(localStorage.getItem(STORAGE_KEYS.MODELOS) || '[]').length === 0) {
      localStorage.setItem(STORAGE_KEYS.MODELOS, JSON.stringify(INITIAL_MODELOS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.FICHAS_TECNICAS_BOM) || JSON.parse(localStorage.getItem(STORAGE_KEYS.FICHAS_TECNICAS_BOM) || '[]').length === 0) {
      localStorage.setItem(STORAGE_KEYS.FICHAS_TECNICAS_BOM, JSON.stringify(INITIAL_FICHAS_TECNICAS_BOM));
    }
    if (!localStorage.getItem(STORAGE_KEYS.INVENTARIO) || JSON.parse(localStorage.getItem(STORAGE_KEYS.INVENTARIO) || '[]').length === 0) {
      localStorage.setItem(STORAGE_KEYS.INVENTARIO, JSON.stringify(INITIAL_INVENTARIO_CRUDO));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LOTES_PRODUCCION) || JSON.parse(localStorage.getItem(STORAGE_KEYS.LOTES_PRODUCCION) || '[]').length === 0) {
      localStorage.setItem(STORAGE_KEYS.LOTES_PRODUCCION, JSON.stringify(INITIAL_LOTES_PRODUCCION));
    }
    localStorage.setItem('calzado_pwa_system_v2_initialized', 'true');
  }
}

function getStoredData<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  checkAndAutoPurgeOnce();
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    if (Array.isArray(fallback) && Array.isArray(parsed) && parsed.length === 0) {
      return fallback;
    }
    return parsed;
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
      id: index !== -1 ? list[index].id : `bom-${Date.now()}`,
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
      let cantidadRequeridaTotal: number;
      const unidadPar = (item.unidad_medida || 'pares').toUpperCase();
      const unidadTotal = (item.consumo_total_unidad || item.unidad_medida || 'pares').toUpperCase();

      if (item.factor_conversion !== undefined && item.factor_conversion > 0) {
        cantidadRequeridaTotal = Number((item.cantidad_por_par * totalPares * item.factor_conversion).toFixed(2));
      } else if (unidadPar === 'DCM' && unidadTotal === 'MT') {
        // En calzado ~135 dm² = 1 metro lineal de sintético/piel
        cantidadRequeridaTotal = Number(((item.cantidad_por_par * totalPares) / 135).toFixed(2));
      } else if (unidadPar === 'CM' && unidadTotal === 'MT') {
        cantidadRequeridaTotal = Number(((item.cantidad_por_par * totalPares) / 100).toFixed(2));
      } else if (unidadPar === 'PIEZA' && unidadTotal === 'MILLAR') {
        cantidadRequeridaTotal = Number(((item.cantidad_por_par * totalPares) / 1000).toFixed(2));
      } else {
        cantidadRequeridaTotal = Number((item.cantidad_por_par * totalPares).toFixed(2));
      }

      // Buscar coincidencia en inventario por nombre de material
      const invMatches = inventario.filter((inv) =>
        inv.tipo_material.toLowerCase().includes(item.material_nombre.toLowerCase())
      );

      const stockActual = invMatches.reduce((sum, inv) => sum + inv.cantidad_total, 0);
      const diferenciaStock = stockActual - cantidadRequeridaTotal;
      const suficiente = stockActual >= cantidadRequeridaTotal || stockActual > 0;

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
        let porDescontar = Number((item.cantidad_por_par * totalPares).toFixed(2));
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
      id: `lote-${Date.now()}`,
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
      id: `mov-${Date.now()}`,
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
      id: `mov-${Date.now()}`,
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
      id: `mq-${Date.now()}`,
      nombre: nombre.trim(),
      tarifa_por_par: Math.max(0, tarifa_por_par),
    };
    list.unshift(nuevo);
    setStoredData(STORAGE_KEYS.MAQUILEROS, list);
    return nuevo;
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
        id: `mod-${Date.now()}`,
        nombre: input.trim(),
        estilo: estiloParam ? estiloParam.trim() : undefined,
      };
    } else {
      nuevo = {
        id: `mod-${Date.now()}`,
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
    seccion?: 'corte' | 'troquel' | 'suela_planta_tacon' | 'empaque' | 'general'
  ): InventarioCrudo {
    const list = this.getInventarioCrudo();
    const nuevo: InventarioCrudo = {
      id: `inv-${Date.now()}`,
      tipo_material: tipo_material.trim(),
      talla: Math.max(0, talla),
      cantidad_total: Math.max(0, cantidad_total),
      unidad_medida: unidad_medida || 'unidades',
      seccion: seccion || 'general',
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
        id: `dt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
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
      id: `lote-${Date.now()}`,
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
      id: `mov-${Date.now()}`,
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
        modelos: modelosCat.length > 0 ? modelosCat : ['Frozen', 'Carol', 'Carmin', 'Stiletto Verona'],
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
          id: `ORD-2026-${Date.now().toString().slice(-3)}`,
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
          id: `dt-auto-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
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
        id: `rec-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
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

    // Sincronizar actualización de Lote WIP en /procesos a 'Producto Terminado'
    const lotes = this.getLotesProduccion();
    let lotesCambiados = false;

    for (const item of input.items) {
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
    fechaFin: string
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

    const inicio = new Date(fechaInicio);
    inicio.setHours(0, 0, 0, 0);

    const fin = new Date(fechaFin);
    fin.setHours(23, 59, 59, 999);

    const items: CorteSabatinoItem[] = [];
    const incidencias: ResumenCorteSabatino['incidencias'] = [];

    let totalParesCompletos = 0;
    let totalFaltantesPiezas = 0;
    let totalParesSegunda = 0;
    let totalMermas = 0;
    let totalCargosQCMXN = 0;

    for (const rec of recepciones) {
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
    fechaFin: string
  ): ResumenPagoSemanal | null {
    return this.calcularCorteSabatino(maquileroId, fechaInicio, fechaFin);
  }

  // GESTIÓN DE HISTORIAL DE TICKETS DE PAGOS SEMANALES
  static getTicketsPagoSemanal(): TicketPagoSemanalGuardado[] {
    const list = getStoredData<TicketPagoSemanalGuardado[]>(STORAGE_KEYS.TICKETS_PAGOS, INITIAL_TICKETS_PAGOS);
    return list.sort((a, b) => new Date(b.fecha_guardado).getTime() - new Date(a.fecha_guardado).getTime());
  }

  static guardarTicketPagoSemanal(resumen: ResumenPagoSemanal): TicketPagoSemanalGuardado {
    const tickets = this.getTicketsPagoSemanal();
    const count = tickets.length + 1;
    const year = new Date().getFullYear();
    const folioStr = String(count).padStart(3, '0');
    
    const nuevoTicket: TicketPagoSemanalGuardado = {
      id: `ticket-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      folio: `TCK-${year}-${folioStr}`,
      fecha_guardado: new Date().toISOString(),
      maquilero_id: resumen.maquilero.id,
      maquilero_nombre: resumen.maquilero.nombre,
      tarifa_por_par: resumen.maquilero.tarifa_por_par,
      fecha_inicio: resumen.fecha_inicio,
      fecha_fin: resumen.fecha_fin,
      total_pares_completos: resumen.total_pares_completos,
      total_faltantes_piezas: resumen.total_faltantes_piezas,
      total_pagar_mxn: resumen.total_pagar_mxn,
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
      id: `ped-${Date.now()}`,
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
      id: `sg-${Date.now()}`,
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
    localStorage.setItem('calzado_pwa_system_wiped_clean_v1', 'true');
  }

  static resetToDefault(): void {
    this.clearAllData();
  }
}


