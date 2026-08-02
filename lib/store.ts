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
} from '@/types/database';

export const INITIAL_MAQUILEROS: Maquilero[] = [
  { id: 'mq-1', nombre: 'Miguel - Forrado de Plantas', tarifa_por_par: 14.50 },
  { id: 'mq-2', nombre: 'Don Beto - Forrados Especiales', tarifa_por_par: 16.00 },
  { id: 'mq-3', nombre: 'Taller El Chino - Tacones y Plataformas', tarifa_por_par: 18.00 },
];

export const INITIAL_MODELOS: ModeloCalzado[] = [
  { id: 'mod-1', nombre: 'Frozen', estilo: 'Sandalia Plataforma' },
  { id: 'mod-2', nombre: 'Carol', estilo: 'Zapatilla Tacón Medio' },
  { id: 'mod-3', nombre: 'Carmin', estilo: 'Zapatilla Stiletto 7cm' },
  { id: 'mod-4', nombre: 'Stiletto Verona', estilo: 'Zapatilla Fiesta' },
];

export const INITIAL_INVENTARIO_CRUDO: InventarioCrudo[] = [
  { id: 'inv-1', tipo_material: 'Planta Modelo Frozen', talla: 22.0, cantidad_total: 500 },
  { id: 'inv-2', tipo_material: 'Planta Modelo Frozen', talla: 23.0, cantidad_total: 600 },
  { id: 'inv-3', tipo_material: 'Planta Modelo Frozen', talla: 24.0, cantidad_total: 750 },
  { id: 'inv-4', tipo_material: 'Planta Modelo Frozen', talla: 25.0, cantidad_total: 500 },
  { id: 'inv-5', tipo_material: 'Planta Modelo Frozen', talla: 26.0, cantidad_total: 400 },
  { id: 'inv-6', tipo_material: 'Planta Modelo Carol', talla: 24.0, cantidad_total: 450 },
  { id: 'inv-7', tipo_material: 'Planta Modelo Carmin', talla: 25.0, cantidad_total: 400 },
  { id: 'inv-8', tipo_material: 'Tacón Luis XV 7cm', talla: 24.0, cantidad_total: 300 },
  { id: 'inv-9', tipo_material: 'Rollo Material Piel Sintética', talla: 0, cantidad_total: 50 },
];

export const INITIAL_ORDENES_SALIDA: OrdenSalida[] = [
  {
    id: 'ORD-2026-001',
    maquilero_id: 'mq-1',
    modelo: 'Frozen',
    fecha_envio: '2026-07-26',
    estatus: 'Pendiente',
  },
  {
    id: 'ORD-2026-002',
    maquilero_id: 'mq-1',
    modelo: 'Carol',
    fecha_envio: '2026-07-27',
    estatus: 'Pendiente',
  },
  {
    id: 'ORD-2026-003',
    maquilero_id: 'mq-2',
    modelo: 'Stiletto Verona',
    fecha_envio: '2026-07-25',
    estatus: 'Pendiente',
  },
];

export const INITIAL_ORDENES_SALIDA_DETALLE: OrdenSalidaDetalle[] = [
  { id: 'dt-101', orden_id: 'ORD-2026-001', talla: 22.0, pares_enviados: 40 },
  { id: 'dt-102', orden_id: 'ORD-2026-001', talla: 23.0, pares_enviados: 40 },
  { id: 'dt-103', orden_id: 'ORD-2026-001', talla: 25.0, pares_enviados: 50 },
  { id: 'dt-104', orden_id: 'ORD-2026-001', talla: 26.0, pares_enviados: 20 },
  { id: 'dt-105', orden_id: 'ORD-2026-002', talla: 24.0, pares_enviados: 88 },
  { id: 'dt-106', orden_id: 'ORD-2026-003', talla: 23.0, pares_enviados: 40 },
  { id: 'dt-107', orden_id: 'ORD-2026-003', talla: 24.0, pares_enviados: 60 },
];

export const INITIAL_RECEPCIONES: Recepcion[] = [
  {
    id: 'rec-1',
    orden_detalle_id: 'dt-103',
    fecha_recepcion: new Date(Date.now() - 3600000 * 3).toISOString(),
    pares_completos_entregados: 48,
    faltantes_izquierdos: 2,
    faltantes_derechos: 0,
    nota: 'Suela raspada en montado, faltan 2 izq.',
    alerta_activa: true,
  },
];

export const INITIAL_TICKETS_PAGOS: TicketPagoSemanalGuardado[] = [
  {
    id: 'ticket-demo-1',
    folio: 'TCK-2026-001',
    fecha_guardado: new Date(Date.now() - 86400000 * 7).toISOString(),
    maquilero_id: 'mq-1',
    maquilero_nombre: 'Miguel - Forrado de Plantas',
    tarifa_por_par: 14.50,
    fecha_inicio: '2026-07-20',
    fecha_fin: '2026-07-25',
    total_pares_completos: 150,
    total_faltantes_piezas: 2,
    total_pagar_mxn: 2175.00,
    items: [
      {
        recepcion_id: 'rec-demo-1',
        fecha: new Date(Date.now() - 86400000 * 8).toISOString(),
        modelo: 'Frozen',
        talla: 24,
        pares_completos: 150,
        faltantes_izq: 2,
        faltantes_der: 0,
        tarifa_unitaria: 14.50,
        subtotal_pagar: 2175.00,
        nota: 'Pago semana previa registrado correctamente.',
      },
    ],
    incidencias: [
      {
        fecha: new Date(Date.now() - 86400000 * 8).toISOString(),
        modelo: 'Frozen',
        talla: 24,
        faltantes: 'Izq: 2 | Der: 0',
        nota: 'Detalle de 2 pies faltantes reportados.',
      },
    ],
  },
];

export const INITIAL_PEDIDOS_CLIENTES: PedidoCliente[] = [
  {
    id: 'ped-clasben-001',
    folio: 'PED-2026-900',
    cliente: 'Clasben',
    modelo: 'Frozen',
    fecha_pedido: '2026-07-28',
    total_pares: 900,
    estatus: 'En Producción',
    notas: 'Pedido especial de tienda Clasben con entrega prioritaria por puntos.',
    desglose_tallas: [
      { talla: 22.0, pares_solicitados: 150, pares_enviados_lotes: 100 },
      { talla: 23.0, pares_solicitados: 200, pares_enviados_lotes: 150 },
      { talla: 24.0, pares_solicitados: 250, pares_enviados_lotes: 200 },
      { talla: 25.0, pares_solicitados: 200, pares_enviados_lotes: 100 },
      { talla: 26.0, pares_solicitados: 100, pares_enviados_lotes: 50 },
    ],
  },
];

export const INITIAL_SALIDAS_GENERALES: SalidaGeneral[] = [
  {
    id: 'sg-demo-1',
    folio: 'SG-2026-001',
    fecha: '2026-07-28',
    tipo_material: 'Pegamento Blanco',
    cantidad: 5,
    unidad: 'litros',
    motivo_concepto: 'Consumo Interno Planta',
    entregado_a: 'Área de Montado / Pegado',
    notas: 'Surte para consumo semanal de la mesa 2.',
  },
  {
    id: 'sg-demo-2',
    folio: 'SG-2026-002',
    fecha: '2026-07-29',
    tipo_material: 'Planta Modelo Frozen',
    talla: 24.0,
    cantidad: 10,
    unidad: 'pares',
    motivo_concepto: 'Merma / Dañado',
    entregado_a: 'Control de Calidad',
    notas: 'Plantas dobladas durante transportación interna.',
  },
];

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
};

function getStoredData<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
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

  static crearModelo(nombre: string, estilo?: string): ModeloCalzado {
    const list = this.getModelos();
    const nuevo: ModeloCalzado = {
      id: `mod-${Date.now()}`,
      nombre: nombre.trim(),
      estilo: estilo ? estilo.trim() : undefined,
    };
    list.unshift(nuevo);
    setStoredData(STORAGE_KEYS.MODELOS, list);
    return nuevo;
  }

  // CATÁLOGO DE INVENTARIO CRUDO / INSUMOS
  static getInventarioCrudo(): InventarioCrudo[] {
    return getStoredData(STORAGE_KEYS.INVENTARIO, INITIAL_INVENTARIO_CRUDO);
  }

  static agregarInsumoInventario(tipo_material: string, talla: number, cantidad_total: number): InventarioCrudo {
    const list = this.getInventarioCrudo();
    const nuevo: InventarioCrudo = {
      id: `inv-${Date.now()}`,
      tipo_material: tipo_material.trim(),
      talla: Math.max(0, talla),
      cantidad_total: Math.max(0, cantidad_total),
    };
    list.unshift(nuevo);
    setStoredData(STORAGE_KEYS.INVENTARIO, list);
    return nuevo;
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

    const maq = this.getMaquileros().find((m) => m.id === input.maquilero_id);

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
    }[];
    nota: string;
  }): { totalRegistrados: number; contieneAlerta: boolean } {
    const ordenes = this.getOrdenesSalida();
    let detalles = this.getOrdenesDetalle();
    const recepciones = this.getRecepciones();

    let totalRegistrados = 0;
    let contieneAlerta = false;

    const tieneFaltantesTotales = input.items.some(
      (it) => it.faltantes_izq > 0 || it.faltantes_der > 0
    );
    const tieneNota = input.nota.trim().length > 0;
    const generaAlertaGlobal = tieneFaltantesTotales || tieneNota;

    for (const item of input.items) {
      if (item.pares_completos <= 0 && item.faltantes_izq <= 0 && item.faltantes_der <= 0) {
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
          pares_enviados: item.pares_completos + item.faltantes_izq + item.faltantes_der,
        };
        detalles.unshift(dtMatch);
      }

      const esAlertaItem = item.faltantes_izq > 0 || item.faltantes_der > 0 || generaAlertaGlobal;
      if (esAlertaItem) contieneAlerta = true;

      const nuevaRecepcion: Recepcion = {
        id: `rec-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        orden_detalle_id: dtMatch.id,
        fecha_recepcion: new Date().toISOString(),
        pares_completos_entregados: item.pares_completos,
        faltantes_izquierdos: item.faltantes_izq,
        faltantes_derechos: item.faltantes_der,
        nota: tieneNota ? input.nota.trim() : (item.faltantes_izq > 0 || item.faltantes_der > 0 ? `Faltante de piezas en ${item.modelo} talla ${item.talla}` : null),
        alerta_activa: esAlertaItem,
      };

      recepciones.unshift(nuevaRecepcion);
      totalRegistrados += item.pares_completos;
    }

    setStoredData(STORAGE_KEYS.ORDENES, ordenes);
    setStoredData(STORAGE_KEYS.DETALLES, detalles);
    setStoredData(STORAGE_KEYS.RECEPCIONES, recepciones);

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

    for (const rec of recepciones) {
      const dt = detallesMap.get(rec.orden_detalle_id);
      if (!dt) continue;

      const recDate = new Date(rec.fecha_recepcion);
      if (recDate >= inicio && recDate <= fin) {
        const ord = ordenes.find((o) => o.id === dt.orden_id);
        const subtotal = rec.pares_completos_entregados * maquilero.tarifa_por_par;

        totalParesCompletos += rec.pares_completos_entregados;
        const faltantesPiezas = rec.faltantes_izquierdos + rec.faltantes_derechos;
        totalFaltantesPiezas += faltantesPiezas;

        items.push({
          recepcion_id: rec.id,
          fecha: rec.fecha_recepcion,
          modelo: ord ? ord.modelo : 'N/A',
          talla: dt.talla,
          pares_completos: rec.pares_completos_entregados,
          faltantes_izq: rec.faltantes_izquierdos,
          faltantes_der: rec.faltantes_derechos,
          tarifa_unitaria: maquilero.tarifa_por_par,
          subtotal_pagar: subtotal,
          nota: rec.nota,
        });

        if (faltantesPiezas > 0 || rec.nota) {
          incidencias.push({
            fecha: rec.fecha_recepcion,
            modelo: ord ? ord.modelo : 'N/A',
            talla: dt.talla,
            faltantes: `Izq: ${rec.faltantes_izquierdos} | Der: ${rec.faltantes_derechos}`,
            nota: rec.nota || 'Sin detalle de nota.',
          });
        }
      }
    }

    const totalPagarMXN = totalParesCompletos * maquilero.tarifa_por_par;

    return {
      maquilero,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      total_pares_completos: totalParesCompletos,
      total_faltantes_piezas: totalFaltantesPiezas,
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

  static resetToDefault(): void {
    setStoredData(STORAGE_KEYS.MAQUILEROS, INITIAL_MAQUILEROS);
    setStoredData(STORAGE_KEYS.MODELOS, INITIAL_MODELOS);
    setStoredData(STORAGE_KEYS.INVENTARIO, INITIAL_INVENTARIO_CRUDO);
    setStoredData(STORAGE_KEYS.ORDENES, INITIAL_ORDENES_SALIDA);
    setStoredData(STORAGE_KEYS.DETALLES, INITIAL_ORDENES_SALIDA_DETALLE);
    setStoredData(STORAGE_KEYS.RECEPCIONES, INITIAL_RECEPCIONES);
    setStoredData(STORAGE_KEYS.TICKETS_PAGOS, INITIAL_TICKETS_PAGOS);
    setStoredData(STORAGE_KEYS.PEDIDOS, INITIAL_PEDIDOS_CLIENTES);
    setStoredData(STORAGE_KEYS.SALIDAS_GENERALES, INITIAL_SALIDAS_GENERALES);
  }
}
