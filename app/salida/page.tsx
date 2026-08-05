'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Truck,
  CheckCircle2,
  AlertTriangle,
  CheckSquare,
  Square,
  RotateCcw,
  Printer,
  FileText,
  Eye,
  Search,
  ArrowLeft,
  History,
  PlusCircle,
} from 'lucide-react';
import { ProductionStore } from '@/lib/store';
import { Maquilero, ModeloCalzado, OrdenSalidaConMaquilero } from '@/types/database';

const TALLAS_CERRADAS = [
  { num: 22, label: '#22' },
  { num: 23, label: '#23' },
  { num: 24, label: '#24' },
  { num: 25, label: '#25' },
  { num: 26, label: '#26' },
  { num: 27, label: '#27' },
];

const INSUMOS_DISPONIBLES = ['Planta', 'Pegamento', 'Forro', 'Tacón', 'Plataforma'];

export default function SalidaPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'nueva' | 'historial'>('nueva');
  const [maquileros, setMaquileros] = useState<Maquilero[]>([]);
  const [modelosCat, setModelosCat] = useState<ModeloCalzado[]>([]);
  const [historialOrdenes, setHistorialOrdenes] = useState<OrdenSalidaConMaquilero[]>([]);

  const [selectedMaquileroId, setSelectedMaquileroId] = useState<string>('');
  const [selectedModeloNombre, setSelectedModeloNombre] = useState<string>('Frozen');
  const [insumosSeleccionados, setInsumosSeleccionados] = useState<string[]>(['Planta', 'Pegamento']);

  const [cantidadesTalla, setCantidadesTalla] = useState<{ [talla: number]: number }>({
    22: 40,
    23: 40,
    24: 0,
    25: 50,
    26: 20,
    27: 0,
  });

  // Ticket actual generado o seleccionado para visualizar/imprimir
  const [ticketOrdenActual, setTicketOrdenActual] = useState<OrdenSalidaConMaquilero | null>(null);

  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);
  const [busquedaHistorial, setBusquedaHistorial] = useState<string>('');

  const cargarDatos = () => {
    const listMaq = ProductionStore.getMaquileros();
    const listMod = ProductionStore.getModelos();
    const todasOrd = ProductionStore.getTodasOrdenesConDetalle();

    setMaquileros(listMaq);
    setModelosCat(listMod);
    setHistorialOrdenes(todasOrd);

    if (listMaq.length > 0 && !selectedMaquileroId) setSelectedMaquileroId(listMaq[0].id);
    if (listMod.length > 0 && !selectedModeloNombre) setSelectedModeloNombre(listMod[0].nombre);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const toggleInsumo = (insumo: string) => {
    setInsumosSeleccionados((prev) =>
      prev.includes(insumo) ? prev.filter((i) => i !== insumo) : [...prev, insumo]
    );
  };

  const handleUpdateCantidad = (talla: number, delta: number) => {
    setCantidadesTalla((prev) => {
      const actual = prev[talla] || 0;
      const nuevo = Math.max(0, actual + delta);
      return { ...prev, [talla]: nuevo };
    });
  };

  const handleInputChange = (talla: number, valStr: string) => {
    const val = parseInt(valStr, 10);
    const num = isNaN(val) ? 0 : Math.max(0, val);
    setCantidadesTalla((prev) => ({ ...prev, [talla]: num }));
  };

  const handlePresetBatch = (amount: number) => {
    setCantidadesTalla((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
        const k = Number(key);
        updated[k] = amount;
      });
      return updated;
    });
  };

  const handleResetBatch = () => {
    setCantidadesTalla({ 22: 0, 23: 0, 24: 0, 25: 0, 26: 0, 27: 0 });
  };

  const handlePrintTicket = () => {
    window.print();
  };

  const totalParesGenerar = Object.values(cantidadesTalla).reduce((acc, curr) => acc + curr, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorValidacion(null);

    if (!selectedMaquileroId) {
      setErrorValidacion('Selecciona un maquilero para la salida.');
      return;
    }

    if (!selectedModeloNombre) {
      setErrorValidacion('Selecciona el modelo de calzado.');
      return;
    }

    if (totalParesGenerar <= 0) {
      setErrorValidacion('Ingresa al menos 1 par en cualquiera de las tallas.');
      return;
    }

    const tallasArray = Object.keys(cantidadesTalla)
      .map((t) => ({ talla: Number(t), pares: cantidadesTalla[Number(t)] }))
      .filter((item) => item.pares > 0);

    const result = ProductionStore.crearOrdenSalidaDirecta({
      maquilero_id: selectedMaquileroId,
      modelo: selectedModeloNombre,
      insumos: insumosSeleccionados,
      tallas: tallasArray,
    });

    // Descuento automático de stock de insumos por Recetario BOM exacto por talla
    const descResult = ProductionStore.descontarStockPorExplosion(selectedModeloNombre, result.totalPares, tallasArray);

    const maq = maquileros.find((m) => m.id === selectedMaquileroId);

    const detalleDescuentoStr = descResult.resumenInsumos.length > 0
      ? ` Resumen de autodescuento: ${descResult.resumenInsumos.join(' | ')}.`
      : '';

    setMensajeExito(
      `⚡ ¡Orden ${result.ordenId} generada exitosamente! ${result.totalPares} pares de ${selectedModeloNombre} para ${maq?.nombre}.${detalleDescuentoStr}`
    );



    // Asignar el ticket recién creado para visualización e impresión inmediata
    setTicketOrdenActual(result.ordenCompleta);
    cargarDatos();
  };

  const ordenesFiltradas = historialOrdenes.filter((o) => {
    const q = busquedaHistorial.toLowerCase().trim();
    if (!q) return true;
    return (
      o.id.toLowerCase().includes(q) ||
      o.maquilero_nombre.toLowerCase().includes(q) ||
      o.modelo.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto">
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-800 print:hidden">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-100 uppercase">
            Salida a Maquila Externa
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 mt-1">
            Generación de orden e impresión de ticket de salida para el maquilero.
          </p>
        </div>

        {/* PESTAÑAS DE NAVEGACIÓN */}
        <div className="flex items-center bg-zinc-900 p-1.5 rounded-xl border border-zinc-800">
          <button
            onClick={() => {
              setActiveTab('nueva');
              setTicketOrdenActual(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'nueva' && !ticketOrdenActual
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Nueva Salida
          </button>
          <button
            onClick={() => {
              setActiveTab('historial');
              setTicketOrdenActual(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'historial' && !ticketOrdenActual
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Historial de Órdenes ({historialOrdenes.length})
          </button>
        </div>
      </div>

      {/* ALERTAS */}
      {mensajeExito && !ticketOrdenActual && (
        <div className="bg-emerald-950/60 border border-emerald-700/80 text-emerald-200 rounded-2xl p-4 text-center font-semibold text-sm sm:text-base shadow-md flex items-center justify-center gap-3 print:hidden">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {errorValidacion && (
        <div className="bg-rose-950/60 border border-rose-800/80 text-rose-200 rounded-2xl p-4 text-center font-semibold text-sm sm:text-base flex items-center justify-center gap-3 print:hidden">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{errorValidacion}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 1: VISTA / IMPRESIÓN DEL TICKET DE SALIDA A MAQUILA                */}
      {/* ========================================================================= */}
      {ticketOrdenActual ? (
        <div className="space-y-6">
          {/* BARRA DE ACCIONES SUPERIOR */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
            <button
              onClick={() => setTicketOrdenActual(null)}
              className="text-xs sm:text-sm text-zinc-400 hover:text-zinc-100 flex items-center gap-2 font-semibold"
            >
              <ArrowLeft className="w-4 h-4" /> Volver
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setTicketOrdenActual(null);
                  setActiveTab('nueva');
                }}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 border border-zinc-700 transition-colors"
              >
                <PlusCircle className="w-4 h-4 text-emerald-400" /> Nueva Salida
              </button>
              <button
                onClick={handlePrintTicket}
                className="px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow transition-colors"
              >
                <Printer className="w-4 h-4" /> Imprimir Ticket (PDF)
              </button>
            </div>
          </div>

          {/* TICKET DE ORDEN DE SALIDA (FORMATO IMPRIMIBLE EN HOJA / TÉRMICA) */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl print:bg-white print:text-black print:p-0 print:border-none print:shadow-none">
            {/* CABECERA DEL TICKET */}
            <div className="border-b-2 border-zinc-800 print:border-black pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400 print:text-black uppercase block tracking-wider">
                  FÁBRICA DE CALZADO — CONTROL DE PRODUCCIÓN & ALMACÉN
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-100 print:text-black uppercase mt-0.5">
                  ORDEN DE SALIDA A MAQUILA
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 print:text-gray-600">
                  Vale de entrega de materiales para proceso externo.
                </p>
              </div>
              <div className="bg-zinc-950 print:bg-gray-100 border border-zinc-800 print:border-gray-400 rounded-xl p-3 text-right">
                <span className="text-xs text-zinc-400 print:text-gray-600 uppercase block font-mono font-bold">
                  Folio Orden
                </span>
                <span className="text-xl sm:text-2xl font-mono font-extrabold text-emerald-400 print:text-black">
                  {ticketOrdenActual.id}
                </span>
                <span className="text-xs text-zinc-400 print:text-gray-600 block font-mono mt-0.5">
                  Fecha: {ticketOrdenActual.fecha_envio}
                </span>
              </div>
            </div>

            {/* DATOS DEL MAQUILERO Y MODELO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-950/60 print:bg-gray-50 border border-zinc-800 print:border-gray-300 rounded-xl p-4 text-xs sm:text-sm">
              <div>
                <span className="text-xs text-zinc-400 print:text-gray-600 font-mono font-bold uppercase block">
                  Maquilero / Taller Destino:
                </span>
                <span className="text-base font-extrabold text-zinc-100 print:text-black block mt-0.5">
                  {ticketOrdenActual.maquilero_nombre}
                </span>
              </div>
              <div>
                <span className="text-xs text-zinc-400 print:text-gray-600 font-mono font-bold uppercase block">
                  Modelo de Calzado:
                </span>
                <span className="text-base font-extrabold text-zinc-100 print:text-black block mt-0.5">
                  {ticketOrdenActual.modelo}
                </span>
              </div>
            </div>

            {/* INSUMOS ADJUNTOS EN LA ORDEN */}
            {ticketOrdenActual.insumos && ticketOrdenActual.insumos.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-zinc-300 print:text-black uppercase block">
                  Insumos / Materiales Adjuntos Entregados:
                </span>
                <div className="flex flex-wrap gap-2">
                  {ticketOrdenActual.insumos.map((ins) => (
                    <span
                      key={ins}
                      className="px-3 py-1 bg-zinc-800 print:bg-gray-200 text-zinc-200 print:text-black text-xs font-bold rounded-lg border border-zinc-700 print:border-gray-400"
                    >
                      ✓ {ins}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* TABLA DE CORRIDA POR TALLA */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-zinc-300 print:text-black uppercase block">
                Desglose de Corrida Enviada por Talla:
              </span>
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm text-left border border-zinc-800 print:border-black">
                  <thead>
                    <tr className="bg-zinc-950 print:bg-gray-200 border-b border-zinc-800 print:border-black text-zinc-300 print:text-black font-mono">
                      <th className="py-2.5 px-3 font-bold">Talla (#)</th>
                      <th className="py-2.5 px-3 font-bold text-right">Pares Enviados</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 print:divide-gray-400">
                    {ticketOrdenActual.detalles.map((dt) => (
                      <tr key={dt.id} className="hover:bg-zinc-800/30">
                        <td className="py-2.5 px-3 font-mono font-bold text-zinc-200 print:text-black">
                          Talla #{dt.talla}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-extrabold text-emerald-400 print:text-black text-base">
                          {dt.pares_enviados} pares
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-zinc-950/80 print:bg-gray-100 font-bold border-t-2 border-zinc-800 print:border-black text-sm">
                      <td className="py-3 px-3 uppercase text-zinc-200 print:text-black">
                        TOTAL DE PARES ENVIADOS
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-emerald-400 print:text-black font-extrabold text-lg">
                        {ticketOrdenActual.total_pares_enviados} PARES
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECCIÓN DE FIRMAS PARA COMPROBANTE FÍSICO */}
            <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs text-zinc-300 print:text-black border-t border-dashed border-zinc-700 print:border-gray-500">
              <div>
                <div className="border-b border-zinc-600 print:border-black mb-2 h-10"></div>
                <span className="font-extrabold block uppercase">Entregó (Almacén / Planta)</span>
                <span className="text-[11px] text-zinc-400 print:text-gray-600">Firma y Sello</span>
              </div>
              <div>
                <div className="border-b border-zinc-600 print:border-black mb-2 h-10"></div>
                <span className="font-extrabold block uppercase">Recibió Conforme (Maquilero)</span>
                <span className="text-[11px] text-zinc-400 print:text-gray-600">
                  {ticketOrdenActual.maquilero_nombre}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'nueva' ? (
        /* ========================================================================= */
        /* VISTA 2: FORMULARIO DE NUEVA SALIDA A MAQUILA                             */
        /* ========================================================================= */
        <form onSubmit={handleSubmit} className="space-y-6 print:hidden">
          {/* SELECCIÓN DE MAQUILERO Y MODELO */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs sm:text-sm font-mono font-bold text-zinc-300 uppercase tracking-wider block mb-2">
                1. Maquilero Destino
              </label>
              <select
                value={selectedMaquileroId}
                onChange={(e) => setSelectedMaquileroId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 focus:border-emerald-500 text-zinc-100 rounded-xl px-4 py-3 text-sm sm:text-base font-semibold focus:outline-none transition-colors"
              >
                {maquileros.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre} (${m.tarifa_por_par.toFixed(2)}/par)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs sm:text-sm font-mono font-bold text-zinc-300 uppercase tracking-wider block mb-2">
                2. Modelo de Calzado
              </label>
              <select
                value={selectedModeloNombre}
                onChange={(e) => setSelectedModeloNombre(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 focus:border-emerald-500 text-zinc-100 rounded-xl px-4 py-3 text-sm sm:text-base font-semibold focus:outline-none transition-colors"
              >
                {modelosCat.map((mod) => (
                  <option key={mod.id} value={mod.nombre}>
                    {mod.nombre} {mod.estilo ? `(${mod.estilo})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* INSUMOS ADJUNTOS */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-3">
            <label className="text-xs sm:text-sm font-mono font-bold text-zinc-300 uppercase tracking-wider block">
              3. Insumos Adjuntos en la Orden
            </label>
            <div className="flex flex-wrap gap-2">
              {INSUMOS_DISPONIBLES.map((insumo) => {
                const isChecked = insumosSeleccionados.includes(insumo);
                return (
                  <button
                    key={insumo}
                    type="button"
                    onClick={() => toggleInsumo(insumo)}
                    className={`px-4 py-2.5 rounded-xl text-sm sm:text-base font-bold flex items-center gap-2 transition-all border ${
                      isChecked
                        ? 'bg-zinc-100 text-zinc-950 border-white shadow'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-zinc-950" />
                    ) : (
                      <Square className="w-4 h-4 text-zinc-500" />
                    )}
                    <span>{insumo}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CORRIDA POR TALLAS */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
              <label className="text-xs sm:text-sm font-mono font-bold text-zinc-300 uppercase tracking-wider">
                4. Cantidad por Talla (Corrida Cerrada)
              </label>

              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-zinc-500 font-mono mr-1">Preajuste:</span>
                <button
                  type="button"
                  onClick={() => handlePresetBatch(10)}
                  className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs sm:text-sm font-mono font-bold rounded-lg border border-zinc-700"
                >
                  10 c/u
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetBatch(25)}
                  className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs sm:text-sm font-mono font-bold rounded-lg border border-zinc-700"
                >
                  25 c/u
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetBatch(50)}
                  className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs sm:text-sm font-mono font-bold rounded-lg border border-zinc-700"
                >
                  50 c/u
                </button>
                <button
                  type="button"
                  onClick={handleResetBatch}
                  className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-rose-400 text-xs sm:text-sm font-mono font-bold rounded-lg border border-zinc-700 flex items-center gap-1 ml-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Limpiar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {TALLAS_CERRADAS.map((tItem) => {
                const cant = cantidadesTalla[tItem.num] || 0;

                return (
                  <div
                    key={tItem.num}
                    className={`bg-zinc-950 border rounded-2xl p-3 text-center space-y-2 transition-all ${
                      cant > 0 ? 'border-emerald-500/70 bg-zinc-950/90 shadow' : 'border-zinc-800'
                    }`}
                  >
                    <span className="text-sm font-mono font-bold text-zinc-200 block">
                      {tItem.label}
                    </span>
                    <div className="flex items-center justify-between gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleUpdateCantidad(tItem.num, -5)}
                        className="w-9 h-9 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg font-bold text-base flex items-center justify-center shrink-0"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={cant}
                        onChange={(e) => handleInputChange(tItem.num, e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 text-center font-mono font-extrabold text-base sm:text-lg text-zinc-100 rounded-lg py-1 focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleUpdateCantidad(tItem.num, 5)}
                        className="w-9 h-9 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg font-bold text-base flex items-center justify-center shrink-0"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BOTÓN SUBMIT CON GENERACIÓN DE TICKET */}
          <button
            type="submit"
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-sm sm:text-base font-extrabold uppercase tracking-wider shadow-lg transition-colors flex items-center justify-center gap-2"
          >
            <Printer className="w-5 h-5" />
            <span>Generar Orden e Imprimir Ticket ({totalParesGenerar} Pares)</span>
          </button>
        </form>
      ) : (
        /* ========================================================================= */
        /* VISTA 3: HISTORIAL DE ÓRDENES Y TICKETS EMITIDOS                          */
        /* ========================================================================= */
        <div className="space-y-4 print:hidden">
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Buscar por folio, maquilero..."
                value={busquedaHistorial}
                onChange={(e) => setBusquedaHistorial(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none font-medium"
              />
            </div>
            <span className="text-xs sm:text-sm text-zinc-400 font-mono font-medium">
              {ordenesFiltradas.length} órdenes registradas
            </span>
          </div>

          {ordenesFiltradas.length === 0 ? (
            <div className="py-10 text-center text-sm text-zinc-500">
              No hay órdenes registradas o no coinciden con la búsqueda.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ordenesFiltradas.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs sm:text-sm font-bold text-emerald-400">
                        {ord.id}
                      </span>
                      <span className="text-xs text-zinc-500 font-mono">{ord.fecha_envio}</span>
                    </div>

                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-zinc-100">
                        {ord.maquilero_nombre}
                      </h3>
                      <p className="text-xs text-zinc-400">Modelo: {ord.modelo}</p>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs sm:text-sm border-t border-zinc-800">
                      <span className="font-mono text-zinc-400">Estado: <span className="text-zinc-200 font-bold">{ord.estatus}</span></span>
                      <span className="font-mono font-extrabold text-emerald-400 text-sm">
                        {ord.total_pares_enviados} pares
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setTicketOrdenActual(ord)}
                    className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors border border-zinc-700"
                  >
                    <Eye className="w-4 h-4 text-emerald-400" /> Ver Ticket u Orden
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
