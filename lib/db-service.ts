import { supabase, supabaseConfigured } from './supabase';
import { ProductionStore } from './store';
import {
  Maquilero,
  ModeloCalzado,
  InventarioCrudo,
  OrdenSalida,
  OrdenSalidaDetalle,
  Recepcion,
  OrdenSalidaConMaquilero,
  LoteProduccion,
  HistorialMovimientoLote,
  TicketPagoSemanalGuardado,
  FichaTecnicaModeloBOM,
  SalidaGeneral,
} from '@/types/database';

export class DBService {
  // MAQUILEROS
  static async getMaquileros(): Promise<Maquilero[]> {
    if (!supabaseConfigured) return ProductionStore.getMaquileros();
    const { data, error } = await supabase.from('maquileros').select('*').order('nombre');
    if (error || !data) return ProductionStore.getMaquileros();
    return data as Maquilero[];
  }

  static async crearMaquilero(nombre: string, tarifa_por_par: number): Promise<Maquilero> {
    const nuevoLocal = ProductionStore.crearMaquilero(nombre, tarifa_por_par);
    if (!supabaseConfigured) return nuevoLocal;

    const { data, error } = await supabase
      .from('maquileros')
      .insert({ id: nuevoLocal.id, nombre: nuevoLocal.nombre, tarifa_por_par: nuevoLocal.tarifa_por_par })
      .select()
      .single();

    return error || !data ? nuevoLocal : (data as Maquilero);
  }

  // MODELOS
  static async getModelos(): Promise<ModeloCalzado[]> {
    if (!supabaseConfigured) return ProductionStore.getModelos();
    const { data, error } = await supabase.from('modelos').select('*').order('nombre');
    if (error || !data) return ProductionStore.getModelos();
    return data as ModeloCalzado[];
  }

  static async crearModelo(nombre: string, estilo?: string): Promise<ModeloCalzado> {
    const nuevoLocal = ProductionStore.crearModelo(nombre, estilo);
    if (!supabaseConfigured) return nuevoLocal;

    const { data, error } = await supabase
      .from('modelos')
      .insert({ id: nuevoLocal.id, nombre: nuevoLocal.nombre, estilo: nuevoLocal.estilo })
      .select()
      .single();

    return error || !data ? nuevoLocal : (data as ModeloCalzado);
  }

  // INVENTARIO CRUDO
  static async getInventarioCrudo(): Promise<InventarioCrudo[]> {
    if (!supabaseConfigured) return ProductionStore.getInventarioCrudo();
    const { data, error } = await supabase.from('inventario_crudo').select('*').order('tipo_material');
    if (error || !data) return ProductionStore.getInventarioCrudo();
    return data as InventarioCrudo[];
  }

  static async agregarInsumoInventario(tipo_material: string, talla: number, cantidad_total: number): Promise<InventarioCrudo> {
    const nuevoLocal = ProductionStore.agregarInsumoInventario(tipo_material, talla, cantidad_total);
    if (!supabaseConfigured) return nuevoLocal;

    const { data, error } = await supabase
      .from('inventario_crudo')
      .insert({ id: nuevoLocal.id, tipo_material: nuevoLocal.tipo_material, talla: nuevoLocal.talla, cantidad_total: nuevoLocal.cantidad_total })
      .select()
      .single();

    return error || !data ? nuevoLocal : (data as InventarioCrudo);
  }

  // LOTES DE PRODUCCIÓN (WIP)
  static async getLotesProduccion(): Promise<LoteProduccion[]> {
    if (!supabaseConfigured) return ProductionStore.getLotesProduccion();
    const { data, error } = await supabase.from('lotes_produccion').select('*').order('creado_en', { ascending: false });
    if (error || !data) return ProductionStore.getLotesProduccion();
    return data as LoteProduccion[];
  }

  static async crearLoteProduccion(input: { modelo: string; desglose_tallas: { talla: number; pares: number }[]; notas?: string }): Promise<LoteProduccion> {
    const nuevoLocal = ProductionStore.crearLoteProduccion(input);
    if (!supabaseConfigured) return nuevoLocal;

    await supabase.from('lotes_produccion').insert({
      id: nuevoLocal.id,
      folio: nuevoLocal.folio,
      modelo: nuevoLocal.modelo,
      total_pares: nuevoLocal.total_pares,
      etapa_actual: nuevoLocal.etapa_actual,
      fecha_inicio: nuevoLocal.fecha_inicio,
      desglose_tallas: nuevoLocal.desglose_tallas,
      notas: nuevoLocal.notas,
    });

    return nuevoLocal;
  }

  // VACIADO COMPLETO
  static async clearAllData(): Promise<void> {
    ProductionStore.clearAllData();
    if (!supabaseConfigured) return;

    await Promise.all([
      supabase.from('recepciones').delete().neq('id', ''),
      supabase.from('ordenes_salida_detalle').delete().neq('id', ''),
      supabase.from('ordenes_salida').delete().neq('id', ''),
      supabase.from('historial_movimientos_lote').delete().neq('id', ''),
      supabase.from('lotes_produccion').delete().neq('id', ''),
      supabase.from('inventario_crudo').delete().neq('id', ''),
      supabase.from('fichas_tecnicas_bom').delete().neq('id', ''),
      supabase.from('modelos').delete().neq('id', ''),
      supabase.from('maquileros').delete().neq('id', ''),
      supabase.from('tickets_pagos_semanales').delete().neq('id', ''),
      supabase.from('salidas_generales').delete().neq('id', ''),
    ]);
  }
}
