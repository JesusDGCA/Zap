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
  ArrowLeft,
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
  const [filtroMaquileroHistorial, setFiltroMaquileroHistorial] = useState<string>('todos');
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
    setMensajeGuardado(`Ticket ${ticketGuardado.folio} guardado en historial.`);
    setTimeout(() => {
      setMensajeGuardado(null);
    }, 3000);
  };

  const handleEliminarTicket = (id: string, folio: string) => {
    if (confirm(`¿Eliminar el ticket ${folio} del historial?`)) {
      ProductionStore.eliminarTicketPagoSemanal(id);
      cargarHistorial();
      if (ticketSeleccionadoHistorial?.id === id) {
        setTicketSeleccionadoHistorial(null);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const ticketsFiltrados = ticketsGuardados.filter((t) => {
    const cumpleMaquilero =
      filtroMaquileroHistorial === 'todos' || t.maquilero_id === filtroMaquileroHistorial;
    const cumpleBusqueda =
      t.folio.toLowerCase().includes(busquedaHistorial.toLowerCase()) ||
      t.maquilero_nombre.toLowerCase().includes(busquedaHistorial.toLowerCase()) ||
      t.fecha_inicio.includes(busquedaHistorial) ||
      t.fecha_fin.includes(busquedaHistorial);
    return cumpleMaquilero && cumpleBusqueda;
  });

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto">
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-800 print:hidden">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-100 uppercase">
            Pago Semanal — Raya a Destajo
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 mt-1">
            Cálculo por par entregado e historial de tickets de liquidación.
          </p>
        </div>

        {/* PESTAÑAS */}
        <div className="flex items-center bg-zinc-900 p-1.5 rounded-xl border border-zinc-800">
          <button
            onClick={() => {
              setActiveTab('generar');
              setTicketSeleccionadoHistorial(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'generar'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Generar Pago
          </button>
          <button
            onClick={() => setActiveTab('historial')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'historial'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Historial ({ticketsGuardados.length})
          </button>
        </div>
      </div>

      {mensajeGuardado && (
        <div className="bg-emerald-950/60 border border-emerald-700/80 text-emerald-200 p-3.5 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-semibold print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{mensajeGuardado}</span>
          </div>
          <button
            onClick={() => setActiveTab('historial')}
            className="text-xs sm:text-sm font-bold text-emerald-400 underline"
          >
            Ver Historial →
          </button>
        </div>
      )}

      {/* PESTAÑA GENERAR PAGO */}
      {activeTab === 'generar' && (
        <div className="space-y-6">
          {/* CONTROLES DE FILTRO */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-4 print:hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs sm:text-sm font-mono font-bold text-zinc-400 uppercase block mb-1.5">
                  Maquilero Destino
                </label>
                <select
                  value={selectedMaquileroId}
                  onChange={(e) => setSelectedMaquileroId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-xl px-3.5 py-2.5 text-sm sm:text-base font-semibold focus:outline-none"
                >
                  {maquileros.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre} ({formatMXN(m.tarifa_por_par)}/par)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-mono font-bold text-zinc-400 uppercase block mb-1.5">
                  Fecha Inicio (Lunes)
                </label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-xl px-3.5 py-2.5 text-sm sm:text-base font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs sm:text-sm font-mono font-bold text-zinc-400 uppercase block mb-1.5">
                  Fecha Fin (Sábado)
                </label>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-xl px-3.5 py-2.5 text-sm sm:text-base font-semibold focus:outline-none"
                />
              </div>
            </div>

            {resumen && resumen.items.length > 0 && (
              <div className="pt-3 flex flex-wrap items-center justify-end gap-3 border-t border-zinc-800">
                <button
                  onClick={handleGuardarTicket}
                  className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold text-xs sm:text-sm rounded-xl border border-zinc-700 flex items-center gap-2 transition-colors shadow"
                >
                  <Save className="w-4 h-4 text-emerald-400" />
                  <span>Guardar Ticket en Historial</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 font-extrabold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Ticket (PDF)</span>
                </button>
              </div>
            )}
          </div>

          {/* VISTA DEL TICKET ACTUAL */}
          {resumen && (
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 print:bg-white print:text-black print:p-0 print:border-none">
              <div className="border-b border-zinc-800 print:border-black pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <span className="text-xs font-mono text-emerald-400 print:text-black uppercase font-bold">
                    FÁBRICA DE CALZADO — CONTROL DE RAYA
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-100 print:text-black uppercase">
                    TICKET DE PAGO SEMANAL
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 print:text-gray-600 mt-0.5">
                    Periodo: <strong>{fechaInicio}</strong> al <strong>{fechaFin}</strong>
                  </p>
                </div>
                <div className="bg-zinc-950 print:bg-gray-100 border border-zinc-800 print:border-gray-300 rounded-xl p-4 text-right">
                  <span className="text-xs text-zinc-400 print:text-gray-600 uppercase block font-mono font-bold">
                    Tarifa por Par
                  </span>
                  <span className="text-xl sm:text-2xl font-mono font-extrabold text-zinc-100 print:text-black">
                    {formatMXN(resumen.maquilero.tarifa_por_par)}
                  </span>
                </div>
              </div>

              <div className="bg-zinc-950/60 print:bg-gray-50 border border-zinc-800 print:border-gray-300 rounded-xl p-4 flex flex-col sm:flex-row justify-between gap-3 text-sm">
                <div>
                  <span className="text-xs text-zinc-400 uppercase font-mono font-bold block">Maquilero / Taller</span>
                  <span className="text-base sm:text-lg font-extrabold text-zinc-100 print:text-black">
                    {resumen.maquilero.nombre}
                  </span>
                </div>
                <div className="flex items-center gap-4 sm:gap-6 text-right flex-wrap justify-end">
                  <div>
                    <span className="text-xs text-zinc-400 uppercase font-mono font-bold block">Pares Entregados</span>
                    <span className="font-extrabold font-mono text-emerald-400 print:text-black text-base">
                      {resumen.total_pares_completos} pares
                    </span>
                  </div>
                  {Boolean(resumen.total_cargos_qc_mxn && resumen.total_cargos_qc_mxn > 0) && (
                    <div>
                      <span className="text-xs text-rose-400 uppercase font-mono font-bold block">Cargos QC / Merma</span>
                      <span className="font-extrabold font-mono text-rose-400 text-base">
                        -{formatMXN(resumen.total_cargos_qc_mxn!)}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-xs text-zinc-400 uppercase font-mono font-bold block">Total Liquidado</span>
                    <span className="font-extrabold font-mono text-emerald-400 print:text-black text-base sm:text-lg">
                      {formatMXN(resumen.total_pagar_mxn)}
                    </span>
                  </div>
                </div>
              </div>


              {/* DETALLE TABLA DE RECEPCIONES */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm text-left">
                  <thead>
                    <tr className="border-b border-zinc-800 print:border-black text-zinc-400 print:text-black font-mono text-xs">
                      <th className="py-3 px-3 font-semibold">Modelo</th>
                      <th className="py-3 px-3 font-semibold">Fecha</th>
                      <th className="py-3 px-3 font-semibold text-right">Pares</th>
                      <th className="py-3 px-3 font-semibold text-right">Tarifa</th>
                      <th className="py-3 px-3 font-semibold text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 print:divide-gray-300">
                    {resumen.items.map((it) => (
                      <tr key={it.recepcion_id} className="hover:bg-zinc-800/40">
                        <td className="py-3 px-3 text-zinc-100 print:text-black font-bold">
                          {it.modelo} (Talla #{it.talla})
                        </td>
                        <td className="py-3 px-3 text-zinc-400 print:text-black font-mono text-xs">
                          {formatDateShort(it.fecha)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-extrabold text-zinc-100 print:text-black">
                          {it.pares_completos}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-zinc-400 print:text-black">
                          {formatMXN(it.tarifa_unitaria)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-extrabold text-emerald-400 print:text-black">
                          {formatMXN(it.subtotal_pagar)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PESTAÑA HISTORIAL */}
      {activeTab === 'historial' && (
        <div className="space-y-4">
          {ticketSeleccionadoHistorial ? (
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 space-y-4 print:bg-white print:text-black">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3 print:hidden">
                <button
                  onClick={() => setTicketSeleccionadoHistorial(null)}
                  className="text-xs sm:text-sm text-zinc-400 hover:text-zinc-100 flex items-center gap-1.5 font-semibold"
                >
                  <ArrowLeft className="w-4 h-4" /> Volver al listado
                </button>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-zinc-100 text-zinc-950 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-4 h-4" /> Imprimir Ticket
                </button>
              </div>

              <div>
                <span className="text-xs font-mono text-emerald-400 uppercase font-bold">
                  TICKET GUARDADO — {ticketSeleccionadoHistorial.folio}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-zinc-100 print:text-black">
                  {ticketSeleccionadoHistorial.maquilero_nombre}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Periodo: {ticketSeleccionadoHistorial.fecha_inicio} al {ticketSeleccionadoHistorial.fecha_fin} — Total:{' '}
                  <span className="font-extrabold text-emerald-400">
                    {formatMXN(ticketSeleccionadoHistorial.total_pagar_mxn)}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Buscar ticket o maquilero..."
                    value={busquedaHistorial}
                    onChange={(e) => setBusquedaHistorial(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none font-medium"
                  />
                </div>
                <span className="text-xs sm:text-sm text-zinc-400 font-mono font-medium">
                  {ticketsFiltrados.length} tickets guardados
                </span>
              </div>

              {ticketsFiltrados.length === 0 ? (
                <div className="py-10 text-center text-sm text-zinc-500">
                  No hay tickets guardados o no coinciden con la búsqueda.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ticketsFiltrados.map((t) => (
                    <div
                      key={t.id}
                      className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 space-y-3 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs sm:text-sm font-bold text-emerald-400">
                          {t.folio}
                        </span>
                        <span className="text-xs text-zinc-500 font-mono">
                          {formatDateShort(t.fecha_guardado)}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-zinc-100">{t.maquilero_nombre}</h3>
                        <p className="text-xs text-zinc-400">
                          {t.fecha_inicio} al {t.fecha_fin}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs sm:text-sm">
                        <span className="font-mono text-zinc-300">{t.total_pares_completos} pares</span>
                        <span className="font-mono font-extrabold text-emerald-400 text-sm sm:text-base">
                          {formatMXN(t.total_pagar_mxn)}
                        </span>
                      </div>

                      <div className="pt-2 flex items-center justify-between">
                        <button
                          onClick={() => handleEliminarTicket(t.id, t.folio)}
                          className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors"
                          title="Eliminar ticket"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setTicketSeleccionadoHistorial(t)}
                          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" /> Ver Ticket
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
