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
  { key: 'Corte', label: '1. Corte', desc: 'Piel y sintético habilitado', color: 'border-blue-500/80 text-blue-400' },
  { key: 'Pespunte', label: '2. Pespunte', desc: 'Costura de corte/chinela', color: 'border-purple-500/80 text-purple-400' },
  { key: 'Forrado', label: '3. Forrado', desc: 'Plantas, tacón y plataforma', color: 'border-amber-500/80 text-amber-400' },
  { key: 'Montado', label: '4. Montado', desc: 'Montado sobre horma y suela', color: 'border-orange-500/80 text-orange-400' },
  { key: 'Adornado', label: '5. Adornado', desc: 'Limpieza, empaque y ajuste', color: 'border-cyan-500/80 text-cyan-400' },
  { key: 'Producto Terminado', label: '6. Terminado', desc: 'Listo para despacho', color: 'border-emerald-500/80 text-emerald-400' },
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
  const [nuevoModelo, setNuevoModelo] = useState<string>('Frozen');
  const [nuevoNotas, setNuevoNotas] = useState<string>('');
  const [tallasLote, setTallasLote] = useState<{ [talla: number]: number }>({
    22: 30,
    23: 30,
    24: 40,
    25: 35,
    26: 15,
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

    setMensajeExito(`⚡ ¡Lote ${nuevo.folio} (${nuevo.total_pares} pares) ingresado a Corte! Insumos descontados automáticamente del almacén crudo.`);

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
      notas: `Avanzado a 1-Clic a ${proximaEtapa}`,
    });

    setMensajeExito(`⚡ Lote ${lote.folio} avanzado a ${proximaEtapa} en 1-Clic.`);
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

    setMensajeExito(`Lote ${loteMover.folio} avanzado a la etapa ${etapaDestino}.`);
    setLoteMover(null);
    cargarDatos();
    setTimeout(() => setMensajeExito(null), 3000);
  };

  // Cálculo de totales de resumen WIP
  const totalParesWIP = lotes
    .filter((l) => l.etapa_actual !== 'Producto Terminado')
    .reduce((sum, l) => sum + l.total_pares, 0);

  const totalLotesWIP = lotes.filter((l) => l.etapa_actual !== 'Producto Terminado').length;

  const lotesFiltrados = lotes.filter((l) => {
    const q = busqueda.toLowerCase().trim();
    if (!q) return true;
    return (
      l.folio.toLowerCase().includes(q) ||
      l.modelo.toLowerCase().includes(q) ||
      (l.maquilero_nombre && l.maquilero_nombre.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 w-full max-w-[1600px] mx-auto">
      {/* HEADER PRINCIPAL MINIMALISTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-100 uppercase">
            Control Multietapa de Procesos (WIP)
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 mt-1">
            Rastreo en tiempo real de lotes por etapa productiva en la fábrica de calzado.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3 font-mono text-sm bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-800">
            <span className="text-zinc-400">Pares en Proceso:</span>
            <span className="font-extrabold text-emerald-400 text-base">{totalParesWIP} pares</span>
            <span className="text-zinc-500">({totalLotesWIP} lotes)</span>
          </div>

          <button
            onClick={() => setModalNuevoLote(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Lanzar Lote a Corte</span>
          </button>
        </div>
      </div>

      {mensajeExito && (
        <div className="bg-emerald-950/60 border border-emerald-700/80 text-emerald-200 rounded-2xl p-4 text-center font-semibold text-sm sm:text-base shadow-md flex items-center justify-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {/* BARRA DE BÚSQUEDA */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar lote por folio, modelo o taller..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none font-medium"
          />
        </div>
        <div className="text-xs sm:text-sm text-zinc-400 font-mono flex items-center gap-1.5 flex-wrap">
          <span className="text-zinc-500 font-bold">Flujo:</span>
          <span>Corte</span> <span className="text-emerald-400">→</span>
          <span>Pespunte</span> <span className="text-emerald-400">→</span>
          <span>Forrado</span> <span className="text-emerald-400">→</span>
          <span>Montado</span> <span className="text-emerald-400">→</span>
          <span>Adornado</span> <span className="text-emerald-400">→</span>
          <span className="text-emerald-400 font-bold">Terminado</span>
        </div>

      </div>

      {/* TABLERO KANBAN DE ETAPAS (WIP PIPELINE) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {ETAPAS.map((etapa) => {
          const lotesEnEtapa = lotesFiltrados.filter((l) => l.etapa_actual === etapa.key);
          const totalParesEtapa = lotesEnEtapa.reduce((sum, l) => sum + l.total_pares, 0);

          return (
            <div
              key={etapa.key}
              className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3.5 space-y-3 flex flex-col justify-between min-w-[240px]"
            >
              {/* ENCABEZADO DE COLUMNA */}
              <div className={`pb-2.5 border-b-2 ${etapa.color}`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-zinc-100 uppercase tracking-tight">
                    {etapa.label}
                  </h3>
                  <span className="text-xs font-mono font-bold bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800 text-zinc-300">
                    {lotesEnEtapa.length}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 block mt-0.5">{etapa.desc}</span>
                <span className="text-xs font-mono font-bold text-emerald-400 block mt-1">
                  {totalParesEtapa} pares
                </span>
              </div>

              {/* LISTA DE TARJETAS DE LOTES */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[550px] pr-1">
                {lotesEnEtapa.length === 0 ? (
                  <div className="py-8 text-center text-xs text-zinc-600 italic">
                    Sin lotes en esta etapa
                  </div>
                ) : (
                  lotesEnEtapa.map((lote) => (
                    <div
                      key={lote.id}
                      className="bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-xl p-3 space-y-2 transition-all shadow-sm group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-extrabold text-emerald-400">
                          {lote.folio}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {lote.fecha_inicio}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-zinc-100">{lote.modelo}</h4>
                        {lote.maquilero_nombre && (
                          <span className="text-[11px] text-amber-400 font-medium block mt-0.5 truncate">
                            👤 {lote.maquilero_nombre}
                          </span>
                        )}
                      </div>

                      {/* DESGLOSE DE TALLAS RÁPIDO */}
                      <div className="flex flex-wrap gap-1 text-[10px] font-mono text-zinc-400 pt-1 border-t border-zinc-800/60">
                        {lote.desglose_tallas.map((t) => (
                          <span key={t.talla} className="bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                            #{t.talla}:{t.pares}
                          </span>
                        ))}
                      </div>

                      <div className="pt-2 flex items-center justify-between gap-1">
                        <span className="text-xs font-mono font-extrabold text-zinc-200">
                          {lote.total_pares} p
                        </span>
                        {etapa.key !== 'Producto Terminado' && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleAvanzarUnToque(lote)}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-extrabold flex items-center gap-0.5 shadow transition-colors"
                              title="Avanzar etapa en 1-Clic"
                            >
                              <span>⚡ Avanzar</span>
                            </button>
                            <button
                              onClick={() => handleAbrirMoverModal(lote)}
                              className="p-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg text-xs font-bold border border-zinc-700"
                              title="Asignar taller u opciones"
                            >
                              <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />
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

      {/* HISTORIAL DE MOVIMIENTOS RECIENTES */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-3">
        <h2 className="text-sm sm:text-base font-mono font-bold text-zinc-200 uppercase border-b border-zinc-800 pb-2.5">
          Historial de Movimientos de Producción
        </h2>
        {historial.length === 0 ? (
          <div className="py-6 text-center text-xs text-zinc-500">No hay movimientos registrados.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 font-mono text-xs">
                  <th className="py-2.5 px-3 font-semibold">Fecha</th>
                  <th className="py-2.5 px-3 font-semibold">Transición de Etapa</th>
                  <th className="py-2.5 px-3 font-semibold">Maquilero / Taller</th>
                  <th className="py-2.5 px-3 font-semibold">Notas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {historial.slice(0, 10).map((h) => (
                  <tr key={h.id} className="hover:bg-zinc-800/40">
                    <td className="py-2.5 px-3 font-mono text-zinc-400 text-xs">
                      {new Date(h.fecha).toLocaleString('es-MX')}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-zinc-200">
                      <span className="text-zinc-400">{h.etapa_origen}</span> <span className="text-emerald-400 font-extrabold">→</span>{' '}
                      <span className="text-emerald-400">{h.etapa_destino}</span>
                    </td>

                    <td className="py-2.5 px-3 text-amber-400 font-medium">{h.maquilero_nombre || '-'}</td>
                    <td className="py-2.5 px-3 text-zinc-400 italic text-xs">{h.notas || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL CREAR NUEVO LOTE */}
      {modalNuevoLote && (
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-zinc-100 uppercase">
                Lanzar Nuevo Lote a Corte
              </h3>
              <button
                onClick={() => setModalNuevoLote(false)}
                className="text-zinc-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCrearLote} className="space-y-4">
              <div>
                <label className="text-xs font-mono font-bold text-zinc-400 uppercase block mb-1.5">
                  Modelo de Calzado
                </label>
                <select
                  value={nuevoModelo}
                  onChange={(e) => setNuevoModelo(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none"
                >
                  {modelos.map((m) => (
                    <option key={m.id} value={m.nombre}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-zinc-400 uppercase block mb-1.5">
                  Corrida por Talla (Puntos Cerrados 22-26)
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[22, 23, 24, 25, 26].map((t) => (
                    <div key={t} className="text-center">
                      <span className="text-xs font-mono text-zinc-400 font-bold block mb-1">#{t}</span>
                      <input
                        type="number"
                        min="0"
                        value={tallasLote[t] || ''}
                        onChange={(e) =>
                          setTallasLote((prev) => ({
                            ...prev,
                            [t]: Math.max(0, parseInt(e.target.value, 10) || 0),
                          }))
                        }
                        className="w-full bg-zinc-950 border border-zinc-700 text-center font-mono font-extrabold text-sm text-zinc-100 rounded-lg py-1.5 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-zinc-400 uppercase block mb-1.5">
                  Notas / Observaciones
                </label>
                <input
                  type="text"
                  placeholder="Ej. Prioridad pedido cliente..."
                  value={nuevoNotas}
                  onChange={(e) => setNuevoNotas(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-xl px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setModalNuevoLote(false)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl text-xs sm:text-sm font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold uppercase"
                >
                  Lanzar Lote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL AVANZAR ETAPA DE LOTE */}
      {loteMover && (
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="font-mono text-xs text-emerald-400 font-bold">
                  {loteMover.folio}
                </span>
                <h3 className="text-lg font-bold text-zinc-100 uppercase">
                  Avanzar Etapa de Producción
                </h3>
              </div>
              <button
                onClick={() => setLoteMover(null)}
                className="text-zinc-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmarMovimiento} className="space-y-4">
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-xs text-zinc-300 space-y-1">
                <div>
                  Modelo: <span className="font-bold text-zinc-100">{loteMover.modelo}</span> ({loteMover.total_pares} pares)
                </div>
                <div>
                  Etapa Actual: <span className="font-bold text-amber-400">{loteMover.etapa_actual}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-zinc-400 uppercase block mb-1.5">
                  Nueva Etapa Destino
                </label>
                <select
                  value={etapaDestino}
                  onChange={(e) => setEtapaDestino(e.target.value as EtapaProduccion)}
                  className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none"
                >
                  {ETAPAS.map((e) => (
                    <option key={e.key} value={e.key}>
                      {e.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-zinc-400 uppercase block mb-1.5">
                  Maquilero / Taller Responsable (Opcional)
                </label>
                <select
                  value={maquileroAsignadoId}
                  onChange={(e) => setMaquileroAsignadoId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none"
                >
                  <option value="">Ninguno (Proceso Interno)</option>
                  {maquileros.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre} (${m.tarifa_por_par.toFixed(2)}/par)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-zinc-400 uppercase block mb-1.5">
                  Notas de Transferencia
                </label>
                <input
                  type="text"
                  placeholder="Ej. Entregado en turno matutino..."
                  value={notasMovimiento}
                  onChange={(e) => setNotasMovimiento(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-xl px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setLoteMover(null)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl text-xs sm:text-sm font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold uppercase"
                >
                  Confirmar Avance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
