/**
 * MODELO DE DATOS RELACIONAL (POSTGRESQL / SUPABASE)
 * Y TIPOS DE TYPESCRIPT PARA CONTROL DE PRODUCCIÓN Y MAQUILA DE CALZADO
 */

export type EstatusOrden = 'Pendiente' | 'Completado';

export type EtapaProduccion =
  | 'Corte'
  | 'Pespunte'
  | 'Forrado'
  | 'Montado'
  | 'Adornado'
  | 'Producto Terminado';

export interface LoteProduccion {
  id: string;
  folio: string; // Ej. "LOT-2026-001"
  modelo: string;
  total_pares: number;
  etapa_actual: EtapaProduccion;
  maquilero_id?: string;
  maquilero_nombre?: string;
  fecha_inicio: string; // YYYY-MM-DD
  desglose_tallas: { talla: number; pares: number }[];
  notas?: string;
}

export interface HistorialMovimientoLote {
  id: string;
  lote_id: string;
  etapa_origen: EtapaProduccion;
  etapa_destino: EtapaProduccion;
  fecha: string; // ISO String
  maquilero_nombre?: string;
  notas?: string;
}

export type UnidadMedidaInsumo = 'pares' | 'piezas' | 'litros' | 'metros' | 'unidades';

export interface ItemRecetaBOM {
  id: string;
  material_nombre: string;
  cantidad_por_par: number; // Ej. 1.0 (pares), 0.05 (litros), 0.20 (metros)
  unidad_medida: UnidadMedidaInsumo;
}

export interface FichaTecnicaModeloBOM {
  id: string;
  modelo_nombre: string;
  receta: ItemRecetaBOM[];
  notas?: string;
}

export interface ResultadoExplosionMateriales {
  material_nombre: string;
  unidad_medida: UnidadMedidaInsumo;
  cantidad_requerida_total: number;
  stock_actual: number;
  diferencia_stock: number; // stock_actual - requerida
  suficiente: boolean;
}

export interface Maquilero {


  id: string;
  nombre: string;
  tarifa_por_par: number; // Ej. 14.50 MXN
}

export interface ModeloCalzado {
  id: string;
  nombre: string;  // Ej. "Frozen", "Carol", "Carmin"
  estilo?: string; // Ej. "Sandalia Plataforma", "Zapatilla Stiletto"
}

export interface InventarioCrudo {
  id: string;
  tipo_material: string; // ej. "Planta Modelo Frozen", "Tacón 7cm", "Rollo Piel Sintética"
  talla: number;         // ej. 22.0, 23.0, 24.0, 25.0
  cantidad_total: number; // Pares o unidades crudas en almacén
}

export interface OrdenSalida {
  id: string;
  maquilero_id: string;
  modelo: string;
  fecha_envio: string; // YYYY-MM-DD
  estatus: EstatusOrden;
  insumos?: string[];
}

export interface OrdenSalidaDetalle {
  id: string;
  orden_id: string;
  talla: number;
  pares_enviados: number;
}

export type TipoDefectoQC =
  | 'Piel Manchada/Abierta'
  | 'Costura Desalineada'
  | 'Planta/Tacón Despegado'
  | 'Merma Irreparable'
  | 'Otro Defecto';

export interface Recepcion {
  id: string;
  orden_detalle_id: string;
  fecha_recepcion: string; // ISO string
  pares_completos_entregados: number;
  faltantes_izquierdos: number;
  faltantes_derechos: number;
  pares_segunda?: number;
  mermas_totales?: number;
  tipo_defecto?: TipoDefectoQC;
  cargo_maquilero_mxn?: number;
  nota: string | null;
  alerta_activa: boolean;
}

// Interfaces compuestas para renderizado
export interface OrdenSalidaConMaquilero extends OrdenSalida {
  maquilero_nombre: string;
  maquilero_tarifa?: number;
  detalles: (OrdenSalidaDetalle & {
    pares_recibidos_completos?: number;
  })[];
  total_pares_enviados: number;
}


export interface RecepcionConDetalle extends Recepcion {
  maquilero_nombre: string;
  maquilero_id: string;
  modelo: string;
  talla: number;
  pares_enviados: number;
  tarifa_por_par: number;
}

export interface AlertaIncompletaView {
  recepcion_id: string;
  fecha_recepcion: string;
  maquilero_nombre: string;
  modelo: string;
  talla: number;
  pares_completos: number;
  faltantes_izquierdos: number;
  faltantes_derechos: number;
  pares_segunda?: number;
  mermas_totales?: number;
  tipo_defecto?: TipoDefectoQC;
  cargo_maquilero_mxn?: number;
  nota: string;
  alerta_activa: boolean;
}

export interface CorteSabatinoItem {
  recepcion_id: string;
  fecha: string;
  modelo: string;
  talla: number;
  pares_completos: number;
  faltantes_izq: number;
  faltantes_der: number;
  pares_segunda?: number;
  mermas_totales?: number;
  tipo_defecto?: TipoDefectoQC;
  cargo_maquilero_mxn?: number;
  tarifa_unitaria: number;
  subtotal_pagar: number;
  nota: string | null;
}

export type ItemPagoSemanal = CorteSabatinoItem;

export interface ResumenCorteSabatino {
  maquilero: Maquilero;
  fecha_inicio: string;
  fecha_fin: string;
  total_pares_completos: number;
  total_faltantes_piezas: number;
  total_pares_segunda?: number;
  total_mermas?: number;
  total_cargos_qc_mxn?: number;
  total_pagar_mxn: number;
  items: CorteSabatinoItem[];
  incidencias: {
    fecha: string;
    modelo: string;
    talla: number;
    faltantes: string;
    nota: string;
  }[];
}


export type ResumenPagoSemanal = ResumenCorteSabatino;

export interface TicketPagoSemanalGuardado {
  id: string;
  folio: string;
  fecha_guardado: string;
  maquilero_id: string;
  maquilero_nombre: string;
  tarifa_por_par: number;
  fecha_inicio: string;
  fecha_fin: string;
  total_pares_completos: number;
  total_faltantes_piezas: number;
  total_pares_segunda?: number;
  total_mermas?: number;
  total_cargos_qc_mxn?: number;
  total_pagar_mxn: number;
  items: CorteSabatinoItem[];

  incidencias: {
    fecha: string;
    modelo: string;
    talla: number;
    faltantes: string;
    nota: string;
  }[];
}

export interface DetalleTallaPedido {
  talla: number;
  pares_solicitados: number;
  pares_enviados_lotes: number;
}

export interface PedidoCliente {
  id: string;
  folio: string;
  cliente: string; // Ej. "Clasben", "Andrea", "Cklass"
  modelo: string;  // Ej. "Frozen", "Carol"
  fecha_pedido: string; // YYYY-MM-DD
  total_pares: number;
  estatus: 'Pendiente' | 'En Producción' | 'Completado';
  desglose_tallas: DetalleTallaPedido[];
  notas?: string;
}

export interface SalidaGeneral {
  id: string;
  folio: string; // Ej. "SG-2026-001"
  fecha: string; // YYYY-MM-DD o ISO string
  tipo_material: string; // Ej. "Pegamento", "Forro", "Planta Frozen", "Tacón 7cm", "Rollo Piel Sintética"
  talla?: number; // Ej. 24.0 o 0 si no aplica
  cantidad: number;
  unidad: string; // "pares", "piezas", "litros", "rollos", "unidades"
  motivo_concepto: string; // Ej. "Consumo Interno Planta", "Merma / Dañado", "Pruebas de Calidad", "Ajuste de Almacén", "Otro"
  entregado_a?: string; // Operador, departamento o responsable
  notas?: string;
}

