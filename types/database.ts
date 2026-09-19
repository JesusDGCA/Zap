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

export type UnidadMedidaInsumo =
  | 'pares'
  | 'piezas'
  | 'litros'
  | 'metros'
  | 'unidades'
  | 'DCM'
  | 'CM'
  | 'MT'
  | 'MILLAR'
  | 'PAR'
  | 'PIEZA'
  | string;

export interface ItemRecetaBOM {
  id: string;
  pieza?: string; // Ej. "CHINELA, TALON", "FORRO AVIOS", "MOÑO", "TIRA P/ANILLO", "PLANTA", "SUELA", "TACON", "CAJA"
  material_nombre: string;
  cantidad_por_par: number; // Consumo por par (CxP) ej. 6.89, 4.32, 20.00, 1.00
  unidad_medida: UnidadMedidaInsumo; // Unidad por par (ej. "DCM", "CM", "PIEZA", "PAR")
  consumo_total_unidad?: string; // Unidad de consumo total / compra (ej. "MT", "MILLAR", "PIEZA", "PAR")
  factor_conversion?: number; // Factor opcional para convertir unidad individual a total (ej. DCM/100 o CM/100)
  seccion?: 'corte' | 'troquel' | 'suela_planta_tacon' | 'empaque' | 'general';
  costo_unitario?: number; // Precio del material en MXN por unidad de compra (ej. $250/MT, $15/PAR)
}

export interface FichaTecnicaModeloBOM {
  id: string;
  modelo_nombre: string;
  receta: ItemRecetaBOM[];
  notas?: string;
}

export interface ResultadoExplosionMateriales {
  pieza?: string;
  material_nombre: string;
  consumo_por_par: number;
  unidad_medida_par: string;
  cantidad_requerida_total: number;
  unidad_medida_total: string;
  stock_actual: number;
  diferencia_stock: number; // stock_actual - requerida
  suficiente: boolean;
  seccion?: 'corte' | 'troquel' | 'suela_planta_tacon' | 'empaque' | 'general';
  costo_unitario?: number; // Precio por unidad de compra
  costo_material_total?: number; // costo_unitario * cantidad_requerida_total
}

export interface DetalleTallaCorrida {
  talla: string | number;
  pares: number;
}

export interface TarjetaProduccionData {
  lote: string;
  programa: string;
  fecha_entrega: string;
  horma: string;
  linea: string;
  moldura: string;
  cliente: string;
  estilo: string;
  descripcion_estilo: string;
  renglon: string;
  desglose_tallas: DetalleTallaCorrida[];
  total_pares: number;
  materiales: ResultadoExplosionMateriales[];
  troquel_especificacion?: string;
}

export interface Maquilero {
  id: string;
  nombre: string;
  tarifa_por_par: number; // Ej. 14.50 MXN
}

export interface ModeloCalzado {
  id: string;
  nombre: string;  // Ej. "MODELO 01 - 2026", "MODELO 02", "MODELO 03"
  horma?: string;  // Ej. "ESTILO 01"
  linea?: string;  // Ej. "MODELO 01 - 2026"
  moldura?: string; // Ej. "2026"
  estilo?: string; // Ej. "MODELO 01 - CHAROL NEGRO"
  descripcion_estilo?: string; // Ej. "ZAPATILLA DE LÍNEA CLÁSICA"
  cliente_default?: string; // Ej. "CLIENTE GENERAL"
  troquel_especificacion?: string; // Ej. "NOM 20 / GRABADO: SINTÉTICO / NEGRO / PLATAFORMA"
}

export interface InventarioCrudo {
  id: string;
  tipo_material: string; // ej. "CHAROL 0.8 HQ NEGRO VIRGEN", "MODELO 01 ESQ. 2026", "CAJA MODELO 01..."
  talla: number;         // ej. 0 si es general, o 22, 23, 24, 25, 26 si es por talla (plantas, suelas)
  cantidad_total: number; // Cantidad en almacén
  unidad_medida?: string; // MT, DCM, PAR, PIEZA, MILLAR, KG, LITROS
  seccion?: 'corte' | 'troquel' | 'suela_planta_tacon' | 'empaque' | 'general';
  costo_unitario?: number; // Precio por unidad de medida en MXN (ej. $250 por MT de piel)
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
  estado?: 'POR_PAGAR' | 'PAGADO';
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
  modelo: string;  // Ej. "MODELO 01 - 2026", "MODELO 02"
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
  tipo_material: string; // Ej. "Pegamento", "Forro", "Planta Modelo 01", "Tacón 7cm", "Rollo Piel Sintética"
  talla?: number; // Ej. 24.0 o 0 si no aplica
  cantidad: number;
  unidad: string; // "pares", "piezas", "litros", "rollos", "unidades"
  motivo_concepto: string; // Ej. "Consumo Interno Planta", "Merma / Dañado", "Pruebas de Calidad", "Ajuste de Almacén", "Otro"
  entregado_a?: string; // Operador, departamento o responsable
  notas?: string;
}

// PROVEEDORES DE MATERIA PRIMA
export interface Proveedor {
  id: string;
  nombre: string;     // Ej. "Pieles del Bajío S.A.", "Curtidora León"
  contacto?: string;  // Nombre de la persona de contacto
  telefono?: string;  // Teléfono de contacto
  materiales_que_surte?: string; // Ej. "Pieles, Sintéticos, Forros"
  notas?: string;
}

// ÓRDENES DE COMPRA GENERADAS
export interface OrdenCompraItem {
  material_nombre: string;
  cantidad_requerida: number;
  unidad_medida: string;
  costo_unitario?: number;
  costo_total?: number;
}

export interface OrdenCompra {
  id: string;
  folio: string;       // Ej. "OC-2026-001"
  fecha: string;       // YYYY-MM-DD
  proveedor_id: string;
  proveedor_nombre: string;
  estatus: 'Pendiente' | 'Enviada' | 'Recibida';
  items: OrdenCompraItem[];
  total_estimado_mxn: number;
  notas?: string;
}

// ==========================================
// FORRADO DE PLANTA (MVP)
// ==========================================

export type EstatusTicketForrado = 'Pendiente' | 'Parcial' | 'Completado';

export interface TicketForrado {
  id: string;
  folio: string; // Ej. "FOR-2026-001"
  fecha: string; // YYYY-MM-DD
  maquilero_id: string; // Quien realiza el forrado
  maquilero_nombre: string;
  pares_enviados: number;
  pares_recibidos: number;
  pegamento_consumido: number; // en Litros
  forro_consumido: number; // en Metros
  estatus: EstatusTicketForrado;
  notas?: string;
  creado_en?: string;
}

export interface RecepcionForrado {
  id: string;
  ticket_id: string;
  fecha: string; // YYYY-MM-DD
  pares_recibidos: number;
  notas?: string;
  creado_en?: string;
}
