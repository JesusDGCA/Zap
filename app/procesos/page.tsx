'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  PlusCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Building2,
  Search,
  ChevronRight,
  Tag,
  Zap,
  FileText,
} from 'lucide-react';
import { ProductionStore } from '@/lib/store';
import {
  EtapaProduccion,
  LoteProduccion,
  Maquilero,
  ModeloCalzado,
  HistorialMovimientoLote,
} from '@/types/database';

const ETAPAS: { key: EtapaProduccion; label: string; desc: string; color: string }[] = [
  { key: 'Corte', label: '1. Corte', desc: 'Piel y sintetico habilitado', color: 'border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-400' },
  { key: 'Pespunte', label: '2. Pespunte', desc: 'Costura de corte y chinela', color: 'border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-400' },
  { key: 'Forrado', label: '3. Forrado', desc: 'Plantas, tacon y plataforma', color: 'border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-400' },
  { key: 'Montado', label: '4. Montado', desc: 'Montado sobre horma y suela', color: 'border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-400' },
  { key: 'Adornado', label: '5. Adornado', desc: 'Limpieza, empaque y ajuste', color: 'border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-400' },
  { key: 'Producto Terminado', label: '6. Terminado', desc: 'Listo en almacen de producto', color: 'border-emerald-600 dark:border-emerald-500 text-emerald-700 dark:text-emerald-400' },
];

const PROXIMA_ETAPA_MAP: { [key in EtapaProduccion]?: EtapaProduccion } = {
  Corte: 'Pespunte',
  Pespunte: 'Forrado',
  Forrado: 'Montado',
  Montado: 'Adornado',
  Adornado: 'Producto Terminado',
};

export default function ProcesosPage() {
  const [lotes, setLotes] = useState<LoteProduccion[]>([]);
  const [historial, setHistorial] = useState<HistorialMovimientoLote[]>([]);
  const [maquileros, setMaquileros] = useState<Maquilero[]>([]);
  const [modelos, setModelos] = useState<ModeloCalzado[]>([]);

  // Modal para crear nuevo lote
  const [modalNuevoLote, setModalNuevoLote] = useState<boolean>(false);
  const [nuevoModelo, setNuevoModelo] = useState<string>('MODELO 01 - 2026');
  const [nuevoNotas, setNuevoNotas] = useState<string>('');
  const [tallasLote, setTallasLote] = useState<{ [talla: number]: number }>({
    22: 0,
    23: 10,
    24: 20,
    25: 20,
    26: 10,
    27: 0,
  });

  // Modal para avanzar etapa de lote
  const [loteMover, setLoteMover] = useState<LoteProduccion | null>(null);
  const [etapaDestino, setEtapaDestino] = useState<EtapaProduccion>('Pespunte');
  const [maquileroAsignadoId, setMaquileroAsignadoId] = useState<string>('');
  const [notasMovimiento, setNotasMovimiento] = useState<string>('');

  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState<string>('');

  const cargarDatos = () => {
    const listLotes = ProductionStore.getLotesProduccion();
    const listHist = ProductionStore.getHistorialMovimientos();
    const listMaq = ProductionStore.getMaquileros();
    const listMod = ProductionStore.getModelos();

    setLotes(listLotes);
    setHistorial(listHist);
    setMaquileros(listMaq);
    setModelos(listMod);

    if (listMod.length > 0 && !nuevoModelo) {
      setNuevoModelo(listMod[0].nombre);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleCrearLote = (e: React.FormEvent) => {
    e.preventDefault();
    const desglose = Object.entries(tallasLote).map(([t, p]) => ({
      talla: Number(t),
      pares: p || 0,
    }));

    const totalPares = desglose.reduce((sum, item) => sum + item.pares, 0);
    if (totalPares <= 0) {
      alert('Ingresa al menos 1 par en las tallas del lote.');
      return;
    }

    const nuevo = ProductionStore.crearLoteProduccion({
      modelo: nuevoModelo,
      desglose_tallas: desglose,
      notas: nuevoNotas,
    });

    setMensajeExito(`Lote ${nuevo.folio} (${nuevo.total_pares} pares) ingresado a Corte correctamente.`);

    setModalNuevoLote(false);
    setNuevoNotas('');
    cargarDatos();
    setTimeout(() => setMensajeExito(null), 3000);
  };

  const handleAbrirMoverModal = (lote: LoteProduccion) => {
    setLoteMover(lote);
    const proxima = PROXIMA_ETAPA_MAP[lote.etapa_actual] || 'Producto Terminado';
    setEtapaDestino(proxima);
    setMaquileroAsignadoId(lote.maquilero_id || '');
    setNotasMovimiento('');
  };

  const handleAvanzarUnToque = (lote: LoteProduccion) => {
    const proximaEtapa = PROXIMA_ETAPA_MAP[lote.etapa_actual];
    if (!proximaEtapa) return;

    ProductionStore.avanzarEtapaLote({
      lote_id: lote.id,
      nueva_etapa: proximaEtapa,
      notas: `Avanzado a ${proximaEtapa}`,
    });

    setMensajeExito(`Lote ${lote.folio} avanzado a ${proximaEtapa}.`);
    cargarDatos();
    setTimeout(() => setMensajeExito(null), 3000);
  };

  const handleConfirmarMovimiento = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loteMover) return;

    ProductionStore.avanzarEtapaLote({
      lote_id: loteMover.id,
      nueva_etapa: etapaDestino,
      maquilero_id: maquileroAsignadoId || undefined,
      notas: notasMovimiento,
    });

    setMensajeExito(`Lote ${loteMover.folio} movido a ${etapaDestino}.`);
    setLoteMover(null);
    cargarDatos();
    setTimeout(() => setMensajeExito(null), 3000);
  };

  const lotesFiltrados = lotes.filter((l) => {
    const texto = `${l.folio} ${l.modelo} ${l.maquilero_nombre || ''} ${l.etapa_actual}`.toLowerCase();
    return texto.includes(busqueda.toLowerCase());
  });

  const totalParesEnPlanta = lotes
    .filter((l) => l.etapa_actual !== 'Producto Terminado')
    .reduce((sum, l) => sum + l.total_pares, 0);

  return (
    <div className="space-y-6 w-full max-w-[1550px] mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase flex items-center gap-2">
            <Layers className="w-7 h-7 text-blue-700 dark:text-blue-500" />
            <span>3. Zapatos en Fabricacion</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 mt-0.5">
            Sigue el avance de cada lote desde el corte hasta el producto terminado.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setModalNuevoLote(true)}
            className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Ingresar Nuevo Lote</span>
          </button>
        </div>
      </div>

      {mensajeExito && (
        <div className="bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 rounded-2xl p-4 text-center font-semibold text-sm sm:text-base shadow-sm flex items-center justify-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-blue-700 dark:text-blue-400 shrink-0" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {/* BARRA DE FILTRO Y RESUMEN */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950 rounded-xl border border-blue-200 dark:border-blue-800">
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-zinc-400 uppercase block">
              Zapatos en Fabricacion
            </span>
            <span className="text-xl font-extrabold font-mono text-blue-700 dark:text-blue-400">
              {totalParesEnPlanta} pares
            </span>
          </div>
          <div className="px-3 py-1.5 bg-slate-100 dark:bg-zinc-950 rounded-xl border border-slate-200 dark:border-zinc-800">
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-zinc-400 uppercase block">
              Lotes en Proceso
            </span>
            <span className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">
              {lotes.filter((l) => l.etapa_actual !== 'Producto Terminado').length}
            </span>
          </div>
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por lote o modelo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl pl-9 pr-3 py-2 text-xs focus:border-blue-600 focus:outline-none"
          />
        </div>
      </div>

      {/* TABLERO KANBAN DE ETAPAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3.5 overflow-x-auto pb-4">
        {ETAPAS.map((etapa) => {
          const lotesEnEtapa = lotesFiltrados.filter((l) => l.etapa_actual === etapa.key);
          const totalParesEtapa = lotesEnEtapa.reduce((sum, l) => sum + l.total_pares, 0);

          return (
            <div
              key={etapa.key}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-3.5 space-y-3 flex flex-col justify-between min-w-[240px] shadow-sm"
            >
              {/* ENCABEZADO DE COLUMNA */}
              <div className={`pb-2.5 border-b-2 ${etapa.color}`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm uppercase tracking-tight">
                    {etapa.label}
                  </h3>
                  <span className="text-xs font-mono font-bold bg-slate-100 dark:bg-zinc-950 px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300">
                    {lotesEnEtapa.length}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 block mt-0.5">{etapa.desc}</span>
                <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400 block mt-1">
                  {totalParesEtapa} pares
                </span>
              </div>

              {/* LISTA DE LOTES */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[550px] pr-1">
                {lotesEnEtapa.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400 dark:text-zinc-600 italic">
                    Sin lotes en esta etapa
                  </div>
                ) : (
                  lotesEnEtapa.map((lote) => (
                    <div
                      key={lote.id}
                      className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 hover:border-blue-400 dark:hover:border-blue-600 rounded-xl p-3 space-y-2 transition-all shadow-sm group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-extrabold text-blue-700 dark:text-blue-400">
                          {lote.folio}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-zinc-500 font-mono">
                          {lote.fecha_inicio}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-zinc-100">{lote.modelo}</h4>
                        {lote.maquilero_nombre && (
                          <span className="text-[11px] text-slate-600 dark:text-zinc-400 font-medium block mt-0.5 truncate">
                            Taller: {lote.maquilero_nombre}
                          </span>
                        )}
                      </div>

                      {/* DESGLOSE DE TALLAS */}
                      <div className="flex flex-wrap gap-1 text-[10px] font-mono text-slate-600 dark:text-zinc-400 pt-1 border-t border-slate-200 dark:border-zinc-800">
                        {lote.desglose_tallas.map((t) => (
                          <span key={t.talla} className="bg-white dark:bg-zinc-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-zinc-800">
                            #{t.talla}:{t.pares}
                          </span>
                        ))}
                      </div>

                      <div className="pt-2 flex items-center justify-between gap-1 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-mono font-extrabold text-slate-900 dark:text-zinc-200">
                            {lote.total_pares} p
                          </span>
                          <Link
                            href={`/explosion-materiales`}
                            className="px-1.5 py-0.5 bg-white dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 rounded text-[10px] font-mono flex items-center gap-1 border border-slate-200 dark:border-zinc-700"
                            title="Ver e Imprimir Tarjeta de Producción"
                          >
                            <FileText className="w-3 h-3 text-blue-700 dark:text-blue-400" />
                            <span>Tarjeta</span>
                          </Link>
                        </div>

                        {etapa.key !== 'Producto Terminado' && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleAvanzarUnToque(lote)}
                              className="px-2 py-1 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow transition-colors"
                              title="Avanzar etapa"
                            >
                              <Zap className="w-3 h-3" />
                              <span>Avanzar</span>
                            </button>
                            <button
                              onClick={() => handleAbrirMoverModal(lote)}
                              className="p-1 bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 rounded-lg text-xs font-bold"
                              title="Opciones de movimiento"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL NUEVO LOTE */}
      {modalNuevoLote && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase border-b border-slate-200 dark:border-zinc-800 pb-2">
              Ingresar Lote a Corte
            </h3>
            <form onSubmit={handleCrearLote} className="space-y-4">
              <div>
                <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 block mb-1">
                  Modelo
                </label>
                <select
                  value={nuevoModelo}
                  onChange={(e) => setNuevoModelo(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none"
                >
                  {modelos.map((m) => (
                    <option key={m.id} value={m.nombre}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 block mb-1">
                  Pares por Talla
                </label>
                <div className="grid grid-cols-6 gap-1">
                  {[22, 23, 24, 25, 26, 27].map((t) => (
                    <div key={t} className="text-center">
                      <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 block">#{t}</span>
                      <input
                        type="number"
                        min="0"
                        value={tallasLote[t] || ''}
                        onChange={(e) =>
                          setTallasLote((prev) => ({
                            ...prev,
                            [t]: parseInt(e.target.value, 10) || 0,
                          }))
                        }
                        className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-center font-mono font-bold text-sm text-slate-900 dark:text-white rounded py-1"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalNuevoLote(false)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-xl text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold uppercase"
                >
                  Guardar Lote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL MOVER LOTE */}
      {loteMover && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase border-b border-slate-200 dark:border-zinc-800 pb-2">
              Avanzar Lote {loteMover.folio}
            </h3>
            <form onSubmit={handleConfirmarMovimiento} className="space-y-4">
              <div>
                <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 block mb-1">
                  Siguiente Etapa
                </label>
                <select
                  value={etapaDestino}
                  onChange={(e) => setEtapaDestino(e.target.value as EtapaProduccion)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none"
                >
                  {ETAPAS.map((e) => (
                    <option key={e.key} value={e.key}>
                      {e.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 block mb-1">
                  Taller / Maquilero Asignado (Opcional)
                </label>
                <select
                  value={maquileroAsignadoId}
                  onChange={(e) => setMaquileroAsignadoId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="">Sin taller asignado</option>
                  {maquileros.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setLoteMover(null)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-xl text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold uppercase"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
