'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Receipt,
  Printer,
  CheckCircle2,
  Save,
  Trash2,
  Eye,
  Search,
  Clock,
  CheckCircle,
  CreditCard,
  FileText,
  Square,
  SquareCheck,
  Loader2,
  AlertCircle,
  Download,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
// Importamos ProductionStore para manejar todo localmente (compatible con Netlify)
import { ProductionStore } from '@/lib/store';
// Ya no usamos supabase-tickets porque estamos trabajando puramente en frontend
import { Maquilero, ResumenPagoSemanal, TicketPagoSemanalGuardado } from '@/types/database';
import { formatMXN, getWorkWeekRange, formatDateShort } from '@/lib/utils';

// ─── Helpers ───────────────────────────────────────────────────────────────

function BadgeEstado({ estado }: { estado?: string }) {
  if (estado === 'PAGADO') {
    return (
      <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
        <CheckCircle className="w-3 h-3" /> PAGADO
      </span>
    );
  }
  return (
    <span className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
      <Clock className="w-3 h-3" /> POR PAGAR
    </span>
  );
}

// ─── Generador de PDF baucher ───────────────────────────────────────────────

function generarBaucherPDF(
  ticketsPagados: TicketPagoSemanalGuardado[],
  fechaPago: string
): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Encabezado
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('BAUCHER DE PAGO — RAYA SEMANAL', 105, 20, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha de pago: ${fechaPago}`, 14, 30);
  doc.text(`Total de notas liquidadas: ${ticketsPagados.length}`, 14, 36);

  const totalMXN = ticketsPagados.reduce((s, t) => s + t.total_pagar_mxn, 0);
  const totalPares = ticketsPagados.reduce((s, t) => s + t.total_pares_completos, 0);

  doc.setFont('helvetica', 'bold');
  doc.text(`TOTAL PAGADO: $${totalMXN.toFixed(2)} MXN`, 14, 44);
  doc.text(`TOTAL PARES: ${totalPares}`, 14, 50);

  doc.line(14, 54, 196, 54);

  // Tabla de tickets
  autoTable(doc, {
    startY: 58,
    head: [['Folio', 'Maquilero', 'Periodo', 'Pares', 'Total MXN', 'Estado']],
    body: ticketsPagados.map((t) => [
      t.folio,
      t.maquilero_nombre,
      `${t.fecha_inicio} → ${t.fecha_fin}`,
      String(t.total_pares_completos),
      `$${t.total_pagar_mxn.toFixed(2)}`,
      'PAGADO',
    ]),
    foot: [
      ['', '', 'TOTAL', String(totalPares), `$${totalMXN.toFixed(2)}`, ''],
    ],
    headStyles: { fillColor: [29, 78, 216], textColor: 255, fontStyle: 'bold' },
    footStyles: { fillColor: [243, 244, 246], textColor: [17, 24, 39], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    styles: { fontSize: 9 },
  });

  // Pie de página
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150);
    doc.text(
      `Generado el ${new Date().toLocaleString('es-MX')} — Página ${i} de ${pageCount}`,
      105,
      287,
      { align: 'center' }
    );
  }

  doc.save(`baucher-pago-${new Date().toISOString().split('T')[0]}.pdf`);
}

// ─── Componente principal ──────────────────────────────────────────────────

export default function PagoSemanalPage() {
  // ── Tab ──
  const [activeTab, setActiveTab] = useState<'generar' | 'historial'>('generar');

  // ── Pestaña GENERAR: Calcular raya de TODOS los maquileros ──
  const weekRange = getWorkWeekRange();
  const [fechaInicio, setFechaInicio] = useState<string>(weekRange.inicio);
  const [fechaFin, setFechaFin] = useState<string>(weekRange.fin);
  const [resumenes, setResumenes] = useState<ResumenPagoSemanal[]>([]);
  const [filtroMaquileroCalculo, setFiltroMaquileroCalculo] = useState<string>('TODOS');
  const [maquileroExpandido, setMaquileroExpandido] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // ── Pestaña HISTORIAL: Tickets desde LocalStorage ──
  const [tickets, setTickets] = useState<TicketPagoSemanalGuardado[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [ticketDetalle, setTicketDetalle] = useState<TicketPagoSemanalGuardado | null>(null);

  // Checkboxes
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filtros historial
  const [busqueda, setBusqueda] = useState('');
  const [filtroMaqId, setFiltroMaqId] = useState('TODOS');
  const [filtroEstado, setFiltroEstado] = useState<'TODOS' | 'POR_PAGAR' | 'PAGADO'>('TODOS');
  const [filtroDesde, setFiltroDesde] = useState('');
  const [filtroHasta, setFiltroHasta] = useState('');

  // Notificación
  const [notif, setNotif] = useState<{ texto: string; tipo: 'success' | 'info' | 'error' } | null>(null);

  // ── Cálculo raya en tiempo real para TODOS los talleres ──
  useEffect(() => {
    if (fechaInicio && fechaFin) {
      const maquilerosLocal = ProductionStore.getMaquileros();
      const todosResumenes: ResumenPagoSemanal[] = [];

      for (const maq of maquilerosLocal) {
        const res = ProductionStore.calcularPagoSemanal(maq.id, fechaInicio, fechaFin);
        // Sólo incluimos en la lista a los talleres que tienen recepciones/items entregados en ese periodo
        if (res && res.items.length > 0) {
          todosResumenes.push(res);
        }
      }
      setResumenes(todosResumenes);
    }
  }, [fechaInicio, fechaFin]);

  // ── Carga de tickets desde LocalStorage (en vez de Supabase para Netlify) ──
  const cargarTickets = useCallback(() => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      let data = ProductionStore.getTicketsPagoSemanal();
      
      // Aplicar filtros localmente
      if (filtroMaqId !== 'TODOS') data = data.filter(t => t.maquilero_id === filtroMaqId);
      if (filtroEstado !== 'TODOS') data = data.filter(t => t.estado === filtroEstado);
      if (filtroDesde) data = data.filter(t => t.fecha_inicio >= filtroDesde);
      if (filtroHasta) data = data.filter(t => t.fecha_fin <= filtroHasta);
      
      setTickets(data);
      setSelectedIds(new Set()); // limpiar selección al recargar
    } catch (e: any) {
      setErrorMsg(e.message ?? 'Error cargando tickets');
    } finally {
      setIsLoading(false);
    }
  }, [filtroMaqId, filtroEstado, filtroDesde, filtroHasta]);

  useEffect(() => {
    if (activeTab === 'historial') cargarTickets();
  }, [activeTab, cargarTickets]);

  // ── Notificación temporal ──
  const mostrarNotif = (texto: string, tipo: 'success' | 'info' | 'error' = 'success') => {
    setNotif({ texto, tipo });
    setTimeout(() => setNotif(null), 4000);
  };

  // ── GUARDAR nuevo ticket en LocalStorage ──
  const handleGuardarTodos = (maquileroId?: string) => {
    const resumenesParaGuardar = maquileroId
      ? resumenes.filter((resumen) => resumen.maquilero.id === maquileroId)
      : resumenes;

    if (resumenesParaGuardar.length === 0 || isSaving) return;

    setIsSaving(true);
    try {
      for (const resumen of resumenesParaGuardar) {
        ProductionStore.guardarTicketPagoSemanal({ ...resumen, estado: 'POR_PAGAR' });
      }

      const texto = maquileroId
        ? `Ticket de ${resumenesParaGuardar[0].maquilero.nombre} generado correctamente.`
        : `${resumenesParaGuardar.length} notas de liquidación generadas correctamente.`;

      mostrarNotif(texto);
      setActiveTab('historial');
    } catch (e: any) {
      mostrarNotif(e.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // ── PAGAR tickets seleccionados (marcar como pagados en LocalStorage) ──
  const handlePagarSeleccionados = (ids: string[]) => {
    if (ids.length === 0 || isPaying) return;
    const confirmMsg =
      ids.length === 1
        ? `¿Confirmas el pago de 1 nota?`
        : `¿Confirmas el pago de ${ids.length} notas?`;
    if (!confirm(confirmMsg)) return;

    setIsPaying(true);
    try {
      // Actualizamos cada ticket a PAGADO localmente
      for (const id of ids) {
        ProductionStore.actualizarEstadoTicket(id, 'PAGADO');
      }
      const pagados = tickets.filter((t) => ids.includes(t.id));
      generarBaucherPDF(pagados, new Date().toLocaleDateString('es-MX'));
      mostrarNotif(`${ids.length} nota(s) marcadas como PAGADAS. PDF descargado.`);
      cargarTickets();
    } catch (e: any) {
      mostrarNotif(e.message, 'error');
    } finally {
      setIsPaying(false);
    }
  };

  // ── PAGAR TODO (filtro activo, solo POR_PAGAR) ──
  const handlePagarTodo = () => {
    const porPagar = ticketsFiltrados.filter((t) => t.estado !== 'PAGADO');
    handlePagarSeleccionados(porPagar.map((t) => t.id));
  };

  // ── ELIMINAR ticket (de LocalStorage) ──
  const handleEliminar = (id: string, folio: string) => {
    if (!confirm(`¿Deseas eliminar la nota ${folio}?`)) return;
    try {
      ProductionStore.eliminarTicketPagoSemanal(id);
      mostrarNotif(`Nota ${folio} eliminada.`, 'info');
      if (ticketDetalle?.id === id) setTicketDetalle(null);
      cargarTickets();
    } catch (e: any) {
      mostrarNotif(e.message, 'error');
    }
  };

  // ── Checkbox helpers ──
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    const porPagarIds = ticketsFiltrados.filter((t) => t.estado !== 'PAGADO').map((t) => t.id);
    const allSelected = porPagarIds.every((id) => selectedIds.has(id));
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(porPagarIds));
    }
  };

  // ── Filtrado client-side (texto) ──
  const ticketsFiltrados = tickets.filter((t) => {
    const texto = busqueda.toLowerCase();
    return (
      t.folio.toLowerCase().includes(texto) ||
      t.maquilero_nombre.toLowerCase().includes(texto)
    );
  });

  // ── Maquileros únicos en los tickets cargados ──
  const maqsEnTickets = Array.from(
    new Map(tickets.map((t) => [t.maquilero_id, { id: t.maquilero_id, nombre: t.maquilero_nombre }])).values()
  );

  const resumenFiltrado = ticketsFiltrados.reduce(
    (acc, t) => ({
      pares: acc.pares + t.total_pares_completos,
      porCobrar: acc.porCobrar + (t.estado !== 'PAGADO' ? t.total_pagar_mxn : 0),
      pagado: acc.pagado + (t.estado === 'PAGADO' ? t.total_pagar_mxn : 0),
    }),
    { pares: 0, porCobrar: 0, pagado: 0 }
  );

  const resumenesFiltrados = resumenes.filter((resumen) =>
    filtroMaquileroCalculo === 'TODOS' ? true : resumen.maquilero.id === filtroMaquileroCalculo
  );

  const maquilerosCalculo = ProductionStore.getMaquileros().filter((maq) =>
    resumenes.some((resumen) => resumen.maquilero.id === maq.id)
  );

  const seleccionados = ticketsFiltrados.filter((t) => selectedIds.has(t.id));
  const totalSeleccionadoMXN = seleccionados.reduce((s, t) => s + t.total_pagar_mxn, 0);
  const hayPorPagar = ticketsFiltrados.some((t) => t.estado !== 'PAGADO');
  const porPagarIds = ticketsFiltrados.filter((t) => t.estado !== 'PAGADO').map((t) => t.id);
  const todosSeleccionados = porPagarIds.length > 0 && porPagarIds.every((id) => selectedIds.has(id));

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto">

      {/* ── ENCABEZADO ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase flex items-center gap-2">
            <Receipt className="w-7 h-7 text-blue-700 dark:text-blue-500" />
            <span>Pagar Raya Semanal</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
            Liquidación de maquileros agrupada por taller
          </p>
        </div>
        <div className="flex items-center bg-slate-100 dark:bg-zinc-900 p-1.5 rounded-xl border border-slate-200 dark:border-zinc-800">
          <button
            onClick={() => { setActiveTab('generar'); setTicketDetalle(null); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'generar'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            Calcular Raya
          </button>
          <button
            onClick={() => { setActiveTab('historial'); setTicketDetalle(null); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'historial'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            Historial & Pagos
          </button>
        </div>
      </div>

      {/* ── NOTIFICACIÓN ── */}
      {notif && (
        <div className={`border rounded-2xl p-4 text-center font-semibold text-sm shadow-sm flex items-center justify-center gap-3 ${
          notif.tipo === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
            : notif.tipo === 'error'
            ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
            : 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
        }`}>
          {notif.tipo === 'error' ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
          <span>{notif.texto}</span>
        </div>
      )}

      {/* ════════════════════════════════════════
          TAB 1: CALCULAR RAYA
      ════════════════════════════════════════ */}
      {activeTab === 'generar' && (
        <div className="space-y-5">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl">
              <div>
                <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 uppercase block mb-1">
                  Fecha Inicio de Raya
                </label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 uppercase block mb-1">
                  Fecha Fin de Raya
                </label>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Talleres con entregas por cobrar ({resumenesFiltrados.length})</h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                <select
                  value={filtroMaquileroCalculo}
                  onChange={(e) => setFiltroMaquileroCalculo(e.target.value)}
                  className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="TODOS">Todos los talleres</option>
                  {maquilerosCalculo.map((maq) => (
                    <option key={maq.id} value={maq.id}>{maq.nombre}</option>
                  ))}
                </select>

                {resumenesFiltrados.length > 0 && (
                  <button
                    onClick={() => handleGuardarTodos(filtroMaquileroCalculo === 'TODOS' ? undefined : filtroMaquileroCalculo)}
                    disabled={isSaving}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold flex items-center gap-1.5 shadow disabled:opacity-50 transition-all"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>{isSaving ? 'Guardando...' : filtroMaquileroCalculo === 'TODOS' ? 'Generar Todos los Tickets' : 'Generar Ticket del Taller'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {!resumenes || resumenes.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-8 text-center space-y-2 shadow-sm">
              <Receipt className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Sin entregas en este periodo</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Ningún maquilero tiene recepciones de calzado completadas para estas fechas.
              </p>
            </div>
          ) : resumenesFiltrados.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-8 text-center space-y-2 shadow-sm">
              <Receipt className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Sin resultados para el filtro</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Selecciona otro taller o vuelve a ver todos los registros.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {resumenesFiltrados.map((resumen) => {
                const abierto = maquileroExpandido === resumen.maquilero.id;
                return (
                  <div key={resumen.maquilero.id} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setMaquileroExpandido((prev) => (prev === resumen.maquilero.id ? null : resumen.maquilero.id))}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 bg-slate-50 dark:bg-zinc-950/80 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-1.5 h-10 sm:h-12 rounded-full bg-blue-600" />
                        <div className="min-w-0">
                          <div className="text-[10px] font-mono font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide">Taller</div>
                          <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white truncate">{resumen.maquilero.nombre}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-[10px] font-mono font-bold text-slate-600 dark:text-zinc-400 uppercase">Total</div>
                          <div className="text-lg sm:text-2xl font-black font-mono text-blue-800 dark:text-blue-400">{formatMXN(resumen.total_pagar_mxn)}</div>
                        </div>
                        <span className="text-xl text-slate-500 dark:text-zinc-400">{abierto ? '−' : '+'}</span>
                      </div>
                    </button>

                    {abierto && (
                      <div className="p-4 sm:p-5 space-y-4 border-t border-slate-200 dark:border-zinc-800">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm bg-slate-50 dark:bg-zinc-950 p-3 rounded-xl border border-slate-100 dark:border-zinc-800">
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="font-mono font-bold text-slate-800 dark:text-slate-200">{resumen.total_pares_completos} pares completos</div>
                            {resumen.total_faltantes_piezas > 0 && (
                              <div className="font-mono font-bold text-amber-700">{resumen.total_faltantes_piezas} piezas faltantes</div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleGuardarTodos(resumen.maquilero.id)}
                            disabled={isSaving}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow disabled:opacity-50 transition-all"
                          >
                            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                            <span>{isSaving ? 'Guardando...' : 'Ticket del taller'}</span>
                          </button>
                        </div>

                        <div className="border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                          <table className="w-full text-xs sm:text-sm text-left">
                            <thead>
                              <tr className="bg-slate-100 dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800 font-mono font-bold text-slate-600 dark:text-zinc-400">
                                <th className="py-2.5 px-3">Fecha</th>
                                <th className="py-2.5 px-3">Modelo</th>
                                <th className="py-2.5 px-3 text-center">Talla</th>
                                <th className="py-2.5 px-3 text-center">Pares</th>
                                <th className="py-2.5 px-3 text-right">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
                              {resumen.items.map((it, idx) => (
                                <tr key={`${resumen.maquilero.id}-${idx}`} className={(it.faltantes_izq + it.faltantes_der) > 0 ? 'bg-amber-50/50 dark:bg-amber-950/20' : ''}>
                                  <td className="py-2 px-3 font-mono text-xs text-slate-500">{formatDateShort(it.fecha)}</td>
                                  <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">{it.modelo}</td>
                                  <td className="py-2 px-3 text-center font-mono font-bold">#{it.talla}</td>
                                  <td className="py-2 px-3 text-center font-mono font-bold">{it.pares_completos}</td>
                                  <td className="py-2 px-3 text-right font-mono font-bold text-blue-700 dark:text-blue-400">{formatMXN(it.subtotal_pagar)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════
          TAB 2: HISTORIAL & PAGOS
      ════════════════════════════════════════ */}
      {activeTab === 'historial' && (
        <div className="space-y-4">

          {/* Vista detalle de un ticket */}
          {ticketDetalle ? (
            <div className="bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3 flex-wrap gap-2">
                <div>
                  <button onClick={() => setTicketDetalle(null)} className="text-xs font-bold text-blue-700 dark:text-blue-400 hover:underline block mb-1">
                    ← Volver
                  </button>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                      {ticketDetalle.folio} — {ticketDetalle.maquilero_nombre}
                    </h3>
                    <BadgeEstado estado={ticketDetalle.estado} />
                  </div>
                  <span className="text-xs text-slate-500 dark:text-zinc-400">
                    {ticketDetalle.fecha_inicio} al {ticketDetalle.fecha_fin} · ${ticketDetalle.tarifa_por_par.toFixed(2)}/par
                  </span>
                </div>
                <div className="flex gap-2">
                  {ticketDetalle.estado !== 'PAGADO' && (
                    <button
                      onClick={() => handlePagarSeleccionados([ticketDetalle.id])}
                      disabled={isPaying}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow disabled:opacity-50"
                    >
                      {isPaying ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                      Liquidar y Descargar PDF
                    </button>
                  )}
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-300 dark:border-zinc-700"
                  >
                    <Printer className="w-4 h-4" /> Imprimir
                  </button>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-zinc-950/60 rounded-xl border border-slate-200 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 uppercase block">Total del Ticket</span>
                  <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">{formatMXN(ticketDetalle.total_pagar_mxn)}</span>
                </div>
                <span className="font-mono font-bold text-sm text-slate-700 dark:text-zinc-300">{ticketDetalle.total_pares_completos} pares</span>
              </div>

              {ticketDetalle.items?.length > 0 && (
                <div className="border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                  <table className="w-full text-xs sm:text-sm text-left">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800 font-mono font-bold text-slate-600 dark:text-zinc-400">
                        <th className="py-2.5 px-3">Fecha</th><th className="py-2.5 px-3">Modelo</th>
                        <th className="py-2.5 px-3 text-center">Talla</th><th className="py-2.5 px-3 text-center">Pares</th>
                        <th className="py-2.5 px-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
                      {ticketDetalle.items.map((it, i) => (
                        <tr key={i}>
                          <td className="py-2 px-3 font-mono text-xs text-slate-500">{formatDateShort(it.fecha)}</td>
                          <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">{it.modelo}</td>
                          <td className="py-2 px-3 text-center font-mono">#{it.talla}</td>
                          <td className="py-2 px-3 text-center font-mono font-bold">{it.pares_completos}</td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-blue-700 dark:text-blue-400">{formatMXN(it.subtotal_pagar)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          ) : (
            /* ── LISTA DE TICKETS ── */
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4 shadow-sm">

              {/* ── FILTROS ── */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Maquilero */}
                  <div>
                    <label className="text-[10px] font-mono font-bold text-slate-500 uppercase block mb-1">Maquilero</label>
                    <select
                      value={filtroMaqId}
                      onChange={(e) => setFiltroMaqId(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="TODOS">Todos los maquileros</option>
                      {maqsEnTickets.map((m) => (
                        <option key={m.id} value={m.id}>{m.nombre}</option>
                      ))}
                    </select>
                  </div>

                  {/* Estado */}
                  <div>
                    <label className="text-[10px] font-mono font-bold text-slate-500 uppercase block mb-1">Estado</label>
                    <select
                      value={filtroEstado}
                      onChange={(e) => setFiltroEstado(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="TODOS">Todos</option>
                      <option value="POR_PAGAR">Por Pagar</option>
                      <option value="PAGADO">Pagados</option>
                    </select>
                  </div>

                  {/* Desde */}
                  <div>
                    <label className="text-[10px] font-mono font-bold text-slate-500 uppercase block mb-1">Desde</label>
                    <input
                      type="date"
                      value={filtroDesde}
                      onChange={(e) => setFiltroDesde(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Hasta */}
                  <div>
                    <label className="text-[10px] font-mono font-bold text-slate-500 uppercase block mb-1">Hasta</label>
                    <input
                      type="date"
                      value={filtroHasta}
                      onChange={(e) => setFiltroHasta(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Fila 2: Busqueda + Aplicar filtros */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex-1 relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Buscar folio o maquilero..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={cargarTickets}
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    Aplicar
                  </button>
                </div>
              </div>

              {/* ── PANEL RESUMEN ── */}
              {ticketsFiltrados.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200 dark:border-zinc-800 p-3 text-center">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">Total Pares</span>
                    <span className="text-xl font-black font-mono text-slate-800 dark:text-white">{resumenFiltrado.pares}</span>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900 p-3 text-center">
                    <span className="text-[10px] font-mono font-bold text-amber-600 uppercase block">Por Cobrar</span>
                    <span className="text-xl font-black font-mono text-amber-700 dark:text-amber-300">{formatMXN(resumenFiltrado.porCobrar)}</span>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900 p-3 text-center">
                    <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase block">Ya Pagado</span>
                    <span className="text-xl font-black font-mono text-emerald-700 dark:text-emerald-300">{formatMXN(resumenFiltrado.pagado)}</span>
                  </div>
                </div>
              )}

              {/* ── BARRA DE ACCIONES BULK ── */}
              {ticketsFiltrados.length > 0 && (
                <div className="flex items-center justify-between flex-wrap gap-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleSelectAll}
                      disabled={porPagarIds.length === 0}
                      className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-zinc-300 hover:text-blue-700 disabled:opacity-40 transition-colors"
                    >
                      {todosSeleccionados
                        ? <SquareCheck className="w-5 h-5 text-blue-700" />
                        : <Square className="w-5 h-5" />}
                      Seleccionar todos los pendientes
                    </button>
                    {selectedIds.size > 0 && (
                      <span className="text-xs font-mono text-blue-700 dark:text-blue-400 font-bold">
                        {selectedIds.size} seleccionado(s) · {formatMXN(totalSeleccionadoMXN)}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {selectedIds.size > 0 && (
                      <button
                        onClick={() => handlePagarSeleccionados(Array.from(selectedIds))}
                        disabled={isPaying}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow disabled:opacity-50 transition-all"
                      >
                        {isPaying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        Pagar Seleccionados ({selectedIds.size})
                      </button>
                    )}
                    {hayPorPagar && (
                      <button
                        onClick={handlePagarTodo}
                        disabled={isPaying}
                        className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow disabled:opacity-50 transition-all"
                      >
                        {isPaying ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                        Pagar Todo ({porPagarIds.length} pendientes)
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* ── ESTADO DE CARGA / ERROR ── */}
              {isLoading && (
                <div className="py-12 flex justify-center items-center gap-2 text-sm text-slate-500">
                  <Loader2 className="w-5 h-5 animate-spin" /> Cargando tickets...
                </div>
              )}
              {errorMsg && !isLoading && (
                <div className="py-8 text-center text-sm text-rose-600 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-800 flex items-center justify-center gap-2">
                  <AlertCircle className="w-5 h-5" /> {errorMsg}
                </div>
              )}

              {/* ── LISTA ── */}
              {!isLoading && !errorMsg && ticketsFiltrados.length === 0 && (
                <div className="py-12 text-center text-sm text-slate-500 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-dashed border-slate-300 dark:border-zinc-800">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                  No hay notas que coincidan con los filtros.
                </div>
              )}

              {!isLoading && !errorMsg && ticketsFiltrados.length > 0 && (
                <div className="space-y-2">
                  {ticketsFiltrados.map((tck) => {
                    const isChecked = selectedIds.has(tck.id);
                    const isPagado = tck.estado === 'PAGADO';
                    return (
                      <div
                        key={tck.id}
                        className={`flex items-center gap-3 border rounded-xl px-4 py-3 transition-all ${
                          isChecked
                            ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-400 dark:border-blue-600'
                            : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-700 hover:border-blue-300'
                        }`}
                      >
                        {/* Checkbox — solo para POR_PAGAR */}
                        <button
                          onClick={() => !isPagado && toggleSelect(tck.id)}
                          disabled={isPagado}
                          className="shrink-0 disabled:opacity-30"
                          aria-label={isChecked ? 'Deseleccionar' : 'Seleccionar'}
                        >
                          {isChecked
                            ? <SquareCheck className="w-5 h-5 text-blue-700" />
                            : <Square className="w-5 h-5 text-slate-400" />}
                        </button>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-400">{tck.folio}</span>
                            <BadgeEstado estado={tck.estado} />
                          </div>
                          <span className="font-bold text-sm text-slate-900 dark:text-white block truncate">{tck.maquilero_nombre}</span>
                          <span className="text-xs text-slate-500 dark:text-zinc-500">
                            {tck.fecha_inicio} → {tck.fecha_fin} · {tck.total_pares_completos} pares
                          </span>
                        </div>

                        {/* Monto */}
                        <span className="font-mono font-black text-base text-slate-800 dark:text-slate-200 shrink-0">
                          {formatMXN(tck.total_pagar_mxn)}
                        </span>

                        {/* Acciones */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => setTicketDetalle(tck)}
                            className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
                            title="Ver detalle"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {!isPagado && (
                            <button
                              onClick={() => handlePagarSeleccionados([tck.id])}
                              disabled={isPaying}
                              className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors disabled:opacity-40"
                              title="Pagar esta nota"
                            >
                              <CreditCard className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleEliminar(tck.id, tck.folio)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                            title="Eliminar nota"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}