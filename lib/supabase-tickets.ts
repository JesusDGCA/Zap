/**
 * lib/supabase-tickets.ts
 * Capa de datos async para tickets de pago de maquila — usa Supabase.
 * Toda la lógica de CRUD de tickets vive aquí, alejada de la UI.
 */
import { supabase } from './supabase';
import { ResumenPagoSemanal, TicketPagoSemanalGuardado } from '@/types/database';

// ─── Tipos auxiliares ───────────────────────────────────────────────────────

export interface FiltrosTickets {
  maquilero_id?: string;
  estado?: 'POR_PAGAR' | 'PAGADO';
  fecha_desde?: string; // fecha_inicio del ticket >= fecha_desde
  fecha_hasta?: string; // fecha_fin del ticket <= fecha_hasta
}

// ─── READ ───────────────────────────────────────────────────────────────────

export async function getTicketsPago(
  filtros?: FiltrosTickets
): Promise<TicketPagoSemanalGuardado[]> {
  let query = supabase
    .from('tickets_pagos_semanales')
    .select('*')
    .order('fecha_guardado', { ascending: false });

  if (filtros?.maquilero_id) {
    query = query.eq('maquilero_id', filtros.maquilero_id);
  }
  if (filtros?.estado) {
    query = query.eq('estado', filtros.estado);
  }
  if (filtros?.fecha_desde) {
    query = query.gte('fecha_inicio', filtros.fecha_desde);
  }
  if (filtros?.fecha_hasta) {
    query = query.lte('fecha_fin', filtros.fecha_hasta);
  }

  const { data, error } = await query;
  if (error) throw new Error(`getTicketsPago: ${error.message}`);
  return (data ?? []) as TicketPagoSemanalGuardado[];
}

// ─── CREATE ─────────────────────────────────────────────────────────────────

export async function crearTicketPago(
  resumen: ResumenPagoSemanal & { estado?: 'POR_PAGAR' | 'PAGADO' }
): Promise<TicketPagoSemanalGuardado> {
  // Generamos el folio contando los existentes para garantizar unicidad
  const { count } = await supabase
    .from('tickets_pagos_semanales')
    .select('*', { count: 'exact', head: true });

  const year = new Date().getFullYear();
  const folioNum = String((count ?? 0) + 1).padStart(3, '0');

  const nuevoTicket = {
    id: `ticket-${Date.now()}-${Math.floor(Math.random() * 9000) + 1000}`,
    folio: `TCK-${year}-${folioNum}`,
    fecha_guardado: new Date().toISOString(),
    maquilero_id: resumen.maquilero.id,
    maquilero_nombre: resumen.maquilero.nombre,
    tarifa_por_par: resumen.maquilero.tarifa_por_par,
    fecha_inicio: resumen.fecha_inicio,
    fecha_fin: resumen.fecha_fin,
    total_pares_completos: resumen.total_pares_completos,
    total_faltantes_piezas: resumen.total_faltantes_piezas,
    total_pares_segunda: resumen.total_pares_segunda ?? 0,
    total_mermas: resumen.total_mermas ?? 0,
    total_cargos_qc_mxn: resumen.total_cargos_qc_mxn ?? 0,
    total_pagar_mxn: resumen.total_pagar_mxn,
    estado: resumen.estado ?? 'POR_PAGAR',
    items: resumen.items,
    incidencias: resumen.incidencias ?? [],
  };

  const { data, error } = await supabase
    .from('tickets_pagos_semanales')
    .insert(nuevoTicket)
    .select()
    .single();

  if (error) throw new Error(`crearTicketPago: ${error.message}`);
  return data as TicketPagoSemanalGuardado;
}

// ─── UPDATE — pagar múltiples tickets ───────────────────────────────────────

export async function pagarTickets(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  const { error } = await supabase
    .from('tickets_pagos_semanales')
    .update({ estado: 'PAGADO' })
    .in('id', ids);
  if (error) throw new Error(`pagarTickets: ${error.message}`);
}

// ─── DELETE ─────────────────────────────────────────────────────────────────

export async function eliminarTicketPago(id: string): Promise<void> {
  const { error } = await supabase
    .from('tickets_pagos_semanales')
    .delete()
    .eq('id', id);
  if (error) throw new Error(`eliminarTicketPago: ${error.message}`);
}
