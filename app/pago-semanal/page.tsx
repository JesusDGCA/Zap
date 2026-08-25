'use client';

import { useState, useEffect } from 'react';
import {
  Receipt,
  Printer,
  FileText,
  CheckCircle2,
  Save,
  Trash2,
  Eye,
  Search,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { ProductionStore } from '@/lib/store';
import { Maquilero, ResumenPagoSemanal, TicketPagoSemanalGuardado } from '@/types/database';
import { formatMXN, getWorkWeekRange, formatDateShort } from '@/lib/utils';

export default function PagoSemanalPage() {
  const [activeTab, setActiveTab] = useState<'generar' | 'historial'>('generar');
  const [maquileros, setMaquileros] = useState<Maquilero[]>([]);
  const [selectedMaquileroId, setSelectedMaquileroId] = useState<string>('');
  
  const weekRange = getWorkWeekRange();
  const [fechaInicio, setFechaInicio] = useState<string>(weekRange.inicio);
  const [fechaFin, setFechaFin] = useState<string>(weekRange.fin);

  const [resumen, setResumen] = useState<ResumenPagoSemanal | null>(null);
  const [ticketsGuardados, setTicketsGuardados] = useState<TicketPagoSemanalGuardado[]>([]);
  const [ticketSeleccionadoHistorial, setTicketSeleccionadoHistorial] = useState<TicketPagoSemanalGuardado | null>(null);

  const [mensajeGuardado, setMensajeGuardado] = useState<string | null>(null);
  const [busquedaHistorial, setBusquedaHistorial] = useState<string>('');

  const cargarHistorial = () => {
    const list = ProductionStore.getTicketsPagoSemanal();
    setTicketsGuardados(list);
  };

  useEffect(() => {
    const listMaq = ProductionStore.getMaquileros();
    setMaquileros(listMaq);
    if (listMaq.length > 0) {
      setSelectedMaquileroId(listMaq[0].id);
    }
    cargarHistorial();
  }, []);

  useEffect(() => {
    if (selectedMaquileroId && fechaInicio && fechaFin) {
      const res = ProductionStore.calcularPagoSemanal(
        selectedMaquileroId,
        fechaInicio,
        fechaFin
      );
      setResumen(res);
    }
  }, [selectedMaquileroId, fechaInicio, fechaFin]);

  const handleGuardarTicket = () => {
    if (!resumen || resumen.items.length === 0) return;
    const ticketGuardado = ProductionStore.guardarTicketPagoSemanal(resumen);
    cargarHistorial();
    setMensajeGuardado(`Nota de pago ${ticketGuardado.folio} guardada en historial.`);
    setTimeout(() => {
      setMensajeGuardado(null);
    }, 3000);
  };

  const handleEliminarTicket = (id: string, folio: string) => {
    if (confirm(`¿Deseas eliminar la nota de pago ${folio}?`)) {
      ProductionStore.eliminarTicketPagoSemanal(id);
      cargarHistorial();
      if (ticketSeleccionadoHistorial?.id === id) {
        setTicketSeleccionadoHistorial(null);
      }
    }
  };

  const ticketsFiltrados = ticketsGuardados.filter((t) => {
    const texto = `${t.folio} ${t.maquilero_nombre}`.toLowerCase();
    return texto.includes(busquedaHistorial.toLowerCase());
  });

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto">
      {/* ENCABEZADO */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200 dark:border-zinc-800 print:hidden">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase flex items-center gap-2">
            <Receipt className="w-7 h-7 text-blue-700 dark:text-blue-500" />
            <span>4. Pagar Raya Semanal a Maquileros</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 mt-0.5">
            Liquidacion de pares completos entregados en la semana.
          </p>
        </div>

        <div className="flex items-center bg-slate-100 dark:bg-zinc-900 p-1.5 rounded-xl border border-slate-200 dark:border-zinc-800">
          <button
            onClick={() => {
              setActiveTab('generar');
              setTicketSeleccionadoHistorial(null);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'generar' && !ticketSeleccionadoHistorial
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            Calcular Raya
          </button>
          <button
            onClick={() => setActiveTab('historial')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'historial'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            Historial de Notas ({ticketsGuardados.length})
          </button>
        </div>
      </div>

      {mensajeGuardado && (
        <div className="bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 rounded-2xl p-4 text-center font-semibold text-sm sm:text-base shadow-sm flex items-center justify-center gap-3 print:hidden">
          <CheckCircle2 className="w-5 h-5 text-blue-700 dark:text-blue-400 shrink-0" />
          <span>{mensajeGuardado}</span>
        </div>
      )}

      {/* VISTA 1: CALCULAR RAYA SEMANAL */}
      {activeTab === 'generar' && !ticketSeleccionadoHistorial && (
        <div className="space-y-6">
          {/* CONTROLES: TALLER Y FECHAS */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4 print:hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400 uppercase block mb-1">
                  1. Taller o Maquilero
                </label>
                <select
                  value={selectedMaquileroId}
                  onChange={(e) => setSelectedMaquileroId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none"
                >
                  {maquileros.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre} (${m.tarifa_por_par.toFixed(2)} / par)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 uppercase block mb-1">
                  2. Fecha Inicio
                </label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-sm font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 uppercase block mb-1">
                  3. Fecha Fin
                </label>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-sm font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* RESULTADO DE LA LIQUIDACION */}
          {!resumen || resumen.items.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-8 text-center space-y-2 shadow-sm">
              <Receipt className="w-10 h-10 text-slate-400 dark:text-zinc-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Sin entregas registradas en esta semana
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
                No hay recepciones de calzado completadas para este maquilero en el periodo seleccionado.
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 border-2 border-blue-700 dark:border-blue-600 rounded-2xl p-6 shadow-xl space-y-5 print:border-black print:p-0">
              {/* ENCABEZADO DEL TICKET */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3 flex-wrap gap-2">
                <div>
                  <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400 uppercase block">
                    Nota de Liquidacion Semanal
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {resumen.maquilero.nombre}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-zinc-400">
                    Periodo: {resumen.fecha_inicio} al {resumen.fecha_fin} • Tarifa: ${resumen.maquilero.tarifa_por_par.toFixed(2)}/par
                  </span>
                </div>

                <div className="flex items-center gap-2 print:hidden">
                  <button
                    onClick={handleGuardarTicket}
                    className="px-3.5 py-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-300 dark:border-zinc-700"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Nota</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold uppercase flex items-center gap-1.5 shadow"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimir Nota</span>
                  </button>
                </div>
              </div>

              {/* TOTAL GIGANTE A PAGAR */}
              <div className="p-5 bg-blue-50 dark:bg-blue-950/60 rounded-2xl border border-blue-200 dark:border-blue-800 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <span className="text-xs font-mono font-bold text-slate-600 dark:text-blue-300 uppercase block">
                    Total a Pagar en Raya
                  </span>
                  <span className="text-3xl sm:text-4xl font-black font-mono text-blue-800 dark:text-blue-300">
                    {formatMXN(resumen.total_pagar_mxn)}
                  </span>
                </div>
                <div className="text-right font-mono">
                  <span className="text-sm font-bold text-slate-700 dark:text-zinc-300 block">
                    {resumen.total_pares_completos} pares completos
                  </span>
                  {resumen.total_faltantes_piezas > 0 && (
                    <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold block">
                      {resumen.total_faltantes_piezas} piezas faltantes
                    </span>
                  )}
                </div>
              </div>

              {/* TABLA DE DETALLE */}
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
                      <tr key={idx}>
                        <td className="py-2 px-3 text-slate-600 dark:text-zinc-400 font-mono text-xs">{formatDateShort(it.fecha)}</td>
                        <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">{it.modelo}</td>
                        <td className="py-2 px-3 text-center font-mono font-bold">#{it.talla}</td>
                        <td className="py-2 px-3 text-center font-mono font-bold">{it.pares_completos}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-blue-700 dark:text-blue-400">{formatMXN(it.subtotal_pagar)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* INCIDENCIAS SI EXISTEN */}
              {resumen.incidencias && resumen.incidencias.length > 0 && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-xs space-y-1">
                  <span className="font-bold text-amber-800 dark:text-amber-300 block">Notas e Incidencias:</span>
                  {resumen.incidencias.map((inc, i) => (
                    <div key={i} className="text-amber-900 dark:text-amber-200">
                      - {inc.modelo} (#{inc.talla}): {inc.faltantes} {inc.nota && `• ${inc.nota}`}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* VISTA 2: HISTORIAL DE TICKETS GUARDADOS */}
      {(activeTab === 'historial' || ticketSeleccionadoHistorial) && (
        <div className="space-y-4">
          {ticketSeleccionadoHistorial ? (
            <div className="bg-white dark:bg-zinc-900 border-2 border-blue-700 dark:border-blue-600 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3 flex-wrap gap-2">
                <div>
                  <button
                    onClick={() => setTicketSeleccionadoHistorial(null)}
                    className="text-xs font-bold text-blue-700 dark:text-blue-400 hover:underline block mb-1"
                  >
                    ← Volver a lista
                  </button>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    Nota {ticketSeleccionadoHistorial.folio} — {ticketSeleccionadoHistorial.maquilero_nombre}
                  </h3>
                </div>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold uppercase flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Nota</span>
                </button>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950/60 rounded-xl border border-blue-200 dark:border-blue-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-slate-600 dark:text-blue-300 uppercase block">Total Pagado</span>
                  <span className="text-2xl sm:text-3xl font-black font-mono text-blue-800 dark:text-blue-300">
                    {formatMXN(ticketSeleccionadoHistorial.total_pagar_mxn)}
                  </span>
                </div>
                <span className="font-mono font-bold text-sm text-slate-700 dark:text-zinc-300">
                  {ticketSeleccionadoHistorial.total_pares_completos} pares
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase">
                  Notas de Pago Guardadas
                </h2>
                <div className="w-full sm:w-64 relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar por folio o maquilero..."
                    value={busquedaHistorial}
                    onChange={(e) => setBusquedaHistorial(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {ticketsFiltrados.length === 0 ? (
                <div className="py-12 text-center text-sm text-slate-500">
                  No hay notas de pago guardadas.
                </div>
              ) : (
                <div className="space-y-3">
                  {ticketsFiltrados.map((tck) => (
                    <div
                      key={tck.id}
                      className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 flex items-center justify-between flex-wrap gap-3"
                    >
                      <div>
                        <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-400 block">{tck.folio}</span>
                        <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white block">{tck.maquilero_nombre}</span>
                        <span className="text-xs text-slate-500 dark:text-zinc-400">
                          {tck.fecha_inicio} al {tck.fecha_fin} • {tck.total_pares_completos} pares
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-base font-mono font-black text-blue-700 dark:text-blue-400">
                          {formatMXN(tck.total_pagar_mxn)}
                        </span>
                        <button
                          type="button"
                          onClick={() => setTicketSeleccionadoHistorial(tck)}
                          className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEliminarTicket(tck.id, tck.folio)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Eliminar nota"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
