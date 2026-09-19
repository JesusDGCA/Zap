'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Truck,
  CheckCircle2,
  AlertTriangle,
  CheckSquare,
  Square,
  Printer,
  FileText,
  Eye,
  Search,
  PlusCircle,
  Zap,
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

const INSUMOS_DISPONIBLES = ['Planta', 'Pegamento', 'Forro', 'Tacon', 'Plataforma', 'Hebillas', 'Hilos'];

export default function SalidaPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'nueva' | 'historial'>('nueva');
  const [maquileros, setMaquileros] = useState<Maquilero[]>([]);
  const [modelosCat, setModelosCat] = useState<ModeloCalzado[]>([]);
  const [historialOrdenes, setHistorialOrdenes] = useState<OrdenSalidaConMaquilero[]>([]);

  const [selectedMaquileroId, setSelectedMaquileroId] = useState<string>('');
  const [selectedModeloNombre, setSelectedModeloNombre] = useState<string>('MODELO 01 - 2026');
  const [insumosSeleccionados, setInsumosSeleccionados] = useState<string[]>(['Planta', 'Pegamento']);

  const [cantidadesTalla, setCantidadesTalla] = useState<{ [talla: number]: number }>({
    22: 40,
    23: 40,
    24: 0,
    25: 50,
    26: 20,
    27: 0,
  });

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

  const handleCantidadChange = (talla: number, valor: string) => {
    const num = Math.max(0, parseInt(valor, 10) || 0);
    setCantidadesTalla((prev) => ({
      ...prev,
      [talla]: num,
    }));
  };

  const totalParesLanzar = Object.values(cantidadesTalla).reduce((acc, curr) => acc + (curr || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorValidacion(null);

    if (!selectedMaquileroId) {
      setErrorValidacion('Por favor selecciona un taller o maquilero.');
      return;
    }
    if (!selectedModeloNombre) {
      setErrorValidacion('Por favor selecciona un modelo.');
      return;
    }
    if (totalParesLanzar <= 0) {
      setErrorValidacion('Debes ingresar al menos 1 par en alguna de las tallas.');
      return;
    }

    const tallasParaEnvio = Object.entries(cantidadesTalla)
      .map(([tallaStr, pares]) => ({
        talla: parseFloat(tallaStr),
        pares: pares || 0,
      }))
      .filter((item) => item.pares > 0);

    const resultado = ProductionStore.crearOrdenSalidaDirecta({
      maquilero_id: selectedMaquileroId,
      modelo: selectedModeloNombre,
      insumos: insumosSeleccionados,
      tallas: tallasParaEnvio,
    });

    setTicketOrdenActual(resultado.ordenCompleta);
    setMensajeExito(`Nota de salida ${resultado.ordenId} generada exitosamente.`);
    cargarDatos();

    // Reset tallas
    setCantidadesTalla({ 22: 0, 23: 0, 24: 0, 25: 0, 26: 0, 27: 0 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const ordenesFiltradas = historialOrdenes.filter((o) => {
    const texto = `${o.id} ${o.maquilero_nombre} ${o.modelo}`.toLowerCase();
    return texto.includes(busquedaHistorial.toLowerCase());
  });

  const renderTicketSalida = (etiqueta: string) => (
    ticketOrdenActual && (
      <div className="print-sheet bg-white text-black rounded-none border-[2px] border-black print:shadow-none">
        <div className="border-b-[2px] border-black px-4 py-3 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-700">{etiqueta}</div>
            <div className="text-lg font-black font-mono">{ticketOrdenActual.id}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-700">Fecha</div>
            <div className="text-sm font-bold font-mono">{ticketOrdenActual.fecha_envio}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-0 border-b-[2px] border-black text-[11px]">
          <div className="border-r-[2px] border-black p-2">
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">Maquilero</div>
            <div className="mt-1 font-black text-sm uppercase">{ticketOrdenActual.maquilero_nombre}</div>
          </div>
          <div className="p-2">
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">Modelo</div>
            <div className="mt-1 font-black text-sm uppercase">{ticketOrdenActual.modelo}</div>
          </div>
        </div>

        <div className="grid grid-cols-4 border-b-[2px] border-black text-[11px] font-black">
          {['22', '23', '24', '25'].map((talla) => (
            <div key={talla} className="border-r-[2px] border-black p-2 text-center">
              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-600">#{talla}</div>
              <div className="mt-1 font-mono text-base">{ticketOrdenActual.detalles.find((d) => Number(d.talla) === Number(talla))?.pares_enviados ?? 0}</div>
            </div>
          ))}
          <div className="p-2 text-center">
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-600">Total</div>
            <div className="mt-1 font-mono text-base">{ticketOrdenActual.total_pares_enviados}</div>
          </div>
        </div>

        <div className="grid grid-cols-4 border-b-[2px] border-black text-[11px] font-black">
          {['26', '27', 'Piezas', 'Insumos'].map((talla) => (
            <div key={talla} className="border-r-[2px] border-black last:border-r-0 p-2 text-center">
              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-600">{talla}</div>
              <div className="mt-1 font-mono text-base">
                {talla === 'Piezas'
                  ? ticketOrdenActual.total_pares_enviados
                  : talla === 'Insumos'
                    ? (ticketOrdenActual.insumos?.length ?? 0)
                    : ticketOrdenActual.detalles.find((d) => Number(d.talla) === Number(talla))?.pares_enviados ?? 0}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 space-y-3">
          <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">Materiales entregados</div>
          <div className="flex flex-wrap gap-1.5">
            {(ticketOrdenActual.insumos?.length ? ticketOrdenActual.insumos : ['Sin insumos especificados']).map((insumo, index) => (
              <span key={`${insumo}-${index}`} className="border border-black px-2 py-1 text-[10px] font-bold uppercase">
                {insumo}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 border-t-[2px] border-black text-[11px]">
          <div className="border-r-[2px] border-black p-3 min-h-[70px]">
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">Firma maquilero</div>
            <div className="mt-8 border-t-[2px] border-black pt-1 font-semibold text-center">________________</div>
          </div>
          <div className="p-3 min-h-[70px]">
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">Firma fábrica</div>
            <div className="mt-8 border-t-[2px] border-black pt-1 font-semibold text-center">________________</div>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto">
      {/* ENCABEZADO */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200 dark:border-zinc-800 print:hidden">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase flex items-center gap-2">
            <Truck className="w-7 h-7 text-blue-700 dark:text-blue-500" />
            <span>1. Salida a Maquila</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 mt-0.5">
            Registra los pares y materiales que salen hacia el maquilero.
          </p>
        </div>

        {/* PESTAÑAS */}
        <div className="flex items-center bg-slate-100 dark:bg-zinc-900 p-1.5 rounded-xl border border-slate-200 dark:border-zinc-800">
          <button
            onClick={() => setActiveTab('nueva')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'nueva'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            Nueva Salida
          </button>
          <button
            onClick={() => setActiveTab('historial')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'historial'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            Historial de Salidas ({historialOrdenes.length})
          </button>
        </div>
      </div>

      {mensajeExito && (
        <div className="bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 rounded-2xl p-4 text-center font-semibold text-sm sm:text-base shadow-sm flex items-center justify-center gap-3 print:hidden">
          <CheckCircle2 className="w-5 h-5 text-blue-700 dark:text-blue-400 shrink-0" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {errorValidacion && (
        <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 rounded-2xl p-4 text-center font-semibold text-sm sm:text-base flex items-center justify-center gap-3 print:hidden">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{errorValidacion}</span>
        </div>
      )}

      {/* VISTA 1: FORMULARIO PASO A PASO */}
      {activeTab === 'nueva' && (
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6 print:hidden">
            {/* PASO 1: SELECCIONAR TALLER */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-2.5">
                <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                  Paso 1: Taller o Maquilero
                </span>
                <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                  ¿A quien se le entrega?
                </span>
              </div>

              {maquileros.length === 0 ? (
                <div className="text-center py-4 text-sm text-slate-500">
                  No hay maquileros registrados. Agrega uno en el menu de Almacen.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {maquileros.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMaquileroId(m.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        selectedMaquileroId === m.id
                          ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-600 dark:border-blue-500 shadow-sm'
                          : 'bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      <span className="font-bold text-sm block text-slate-900 dark:text-white">
                        {m.nombre}
                      </span>
                      <span className="text-xs font-mono text-blue-700 dark:text-blue-400 font-bold block mt-1">
                        Tarifa: ${m.tarifa_por_par.toFixed(2)} / par
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* PASO 2: SELECCIONAR MODELO */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-2.5">
                <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                  Paso 2: Modelo de Calzado
                </span>
                <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                  ¿Que estilo vas a mandar?
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {modelosCat.map((mod) => (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => setSelectedModeloNombre(mod.nombre)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedModeloNombre.toLowerCase() === mod.nombre.toLowerCase()
                        ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-600 dark:border-blue-500 shadow-sm font-bold'
                        : 'bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <span className="font-bold text-sm block text-slate-900 dark:text-white">
                      {mod.nombre}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-zinc-400 block truncate mt-0.5">
                      {mod.estilo || 'Estandar'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* PASO 3: CANTIDAD DE PARES POR NUMERO */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-2.5">
                <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                  Paso 3: Pares por Numero
                </span>
                <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800">
                  Total a enviar: {totalParesLanzar} pares
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {TALLAS_CERRADAS.map((t) => (
                  <div
                    key={t.num}
                    className="p-3 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200 dark:border-zinc-800 text-center"
                  >
                    <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 block mb-1">
                      {t.label}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={cantidadesTalla[t.num] || ''}
                      onChange={(e) => handleCantidadChange(t.num, e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-center font-mono font-black text-lg text-slate-900 dark:text-white rounded-lg py-1.5 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* PASO 4: MATERIALES ENTREGADOS */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-2.5">
                <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                  Paso 4: Materiales Entregados
                </span>
                <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                  Marca lo que incluye este lote
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {INSUMOS_DISPONIBLES.map((insumo) => {
                  const check = insumosSeleccionados.includes(insumo);
                  return (
                    <button
                      key={insumo}
                      type="button"
                      onClick={() => toggleInsumo(insumo)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                        check
                          ? 'bg-blue-700 text-white border-blue-700 shadow-sm'
                          : 'bg-slate-50 dark:bg-zinc-950 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-800 hover:border-slate-300'
                      }`}
                    >
                      {check ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-400" />}
                      <span>{insumo}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* BOTON DE ACCION PRINCIPAL */}
            <button
              type="submit"
              className="w-full py-4 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-2xl font-extrabold text-base uppercase tracking-wide shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Truck className="w-5 h-5" />
              <span>Generar Salida a Maquila ({totalParesLanzar} pares)</span>
            </button>
          </form>

          {/* VISTA DEL TICKET DE SALIDA GENERADO */}
          {ticketOrdenActual && (
            <>
              <div className="bg-white dark:bg-zinc-900 border-2 border-blue-700 dark:border-blue-600 rounded-2xl p-6 shadow-xl space-y-4 print:hidden">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3 flex-wrap gap-2 print:border-black">
                  <div>
                    <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400 uppercase block">
                      Nota de Salida a Maquila
                    </span>
                    <h3 className="text-xl font-black font-mono text-slate-900 dark:text-white">
                      {ticketOrdenActual.id}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold uppercase flex items-center gap-1.5 shadow print:hidden"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimir 2 Copias</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
                  <div className="p-3 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200 dark:border-zinc-800">
                    <span className="text-slate-500 dark:text-zinc-400 block text-[11px]">Taller / Maquilero</span>
                    <span className="font-bold text-slate-900 dark:text-white block mt-0.5">{ticketOrdenActual.maquilero_nombre}</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200 dark:border-zinc-800">
                    <span className="text-slate-500 dark:text-zinc-400 block text-[11px]">Modelo</span>
                    <span className="font-bold text-slate-900 dark:text-white block mt-0.5">{ticketOrdenActual.modelo}</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200 dark:border-zinc-800">
                    <span className="text-slate-500 dark:text-zinc-400 block text-[11px]">Fecha de Envio</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white block mt-0.5">{ticketOrdenActual.fecha_envio}</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200 dark:border-zinc-800">
                    <span className="text-slate-500 dark:text-zinc-400 block text-[11px]">Total Pares</span>
                    <span className="font-mono font-black text-base text-blue-700 dark:text-blue-400 block">{ticketOrdenActual.total_pares_enviados} p</span>
                  </div>
                </div>

                <div className="rounded-xl border border-dashed border-blue-400 bg-blue-50/60 dark:bg-blue-950/20 p-3 text-xs text-blue-800 dark:text-blue-300 font-semibold">
                  Se imprime en dos copias: una para el maquilero y otra para la fábrica. Queda registrada automáticamente para la raya semanal.
                </div>
              </div>

              <div className="hidden print:block print-ticket-set">
                {renderTicketSalida('COPIA MAQUILERO')}
                {renderTicketSalida('COPIA FÁBRICA')}
              </div>
            </>
          )}
        </div>
      )}

      {/* VISTA 2: HISTORIAL DE ENVIOS */}
      {activeTab === 'historial' && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase">
              Envios Registrados
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

          {ordenesFiltradas.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">
              No hay envios que coincidan con la busqueda.
            </div>
          ) : (
            <div className="space-y-3">
              {ordenesFiltradas.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 flex items-center justify-between flex-wrap gap-3"
                >
                  <div>
                    <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-400 block">{ord.id}</span>
                    <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white block">{ord.maquilero_nombre}</span>
                    <span className="text-xs text-slate-500 dark:text-zinc-400">Modelo: {ord.modelo} • Fecha: {ord.fecha_envio}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm sm:text-base font-mono font-bold text-slate-900 dark:text-white">
                      {ord.total_pares_enviados} pares
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setTicketOrdenActual(ord);
                        setActiveTab('nueva');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver Nota</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @page {
          size: A4 portrait;
          margin: 8mm;
        }

        .print-ticket-set {
          width: 100%;
          max-width: 100%;
          display: block;
        }

        .print-sheet {
          width: 100%;
          min-height: 180mm;
          page-break-after: always;
          overflow: hidden;
          box-sizing: border-box;
          font-family: Arial, Helvetica, sans-serif;
          color: #111827;
        }

        .print-sheet:last-child {
          page-break-after: auto;
        }

        @media print {
          body {
            background: white !important;
          }

          .print-hidden, .print\:hidden {
            display: none !important;
          }

          .print-ticket-set {
            display: block !important;
          }

          .print-sheet {
            display: block !important;
            margin: 0 0 8mm 0;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
