'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  PackageCheck,
  AlertTriangle,
  CheckCircle2,
  MessageSquareWarning,
  PlusCircle,
  Trash2,
} from 'lucide-react';
import { ProductionStore } from '@/lib/store';
import { Maquilero, TipoDefectoQC } from '@/types/database';

const TALLAS_CERRADAS = [22, 23, 24, 25, 26, 27];

interface ItemCaptura {
  modelo: string;
  talla: number;
  completos: number;
  faltIzq: number;
  faltDer: number;
  segunda?: number;
  mermas?: number;
  tipoDefecto?: TipoDefectoQC;
  cargoMXN?: number;
}


export default function RecepcionPage() {
  const router = useRouter();

  const [maquileros, setMaquileros] = useState<Maquilero[]>([]);
  const [selectedMaquileroId, setSelectedMaquileroId] = useState<string>('');

  const [modelosDisponibles, setModelosDisponibles] = useState<string[]>(['Frozen', 'Carol', 'Carmin']);
  const [selectedModelo, setSelectedModelo] = useState<string>('Frozen');
  const [nuevoModeloInput, setNuevoModeloInput] = useState<string>('');
  const [mostrandoNuevoModelo, setMostrandoNuevoModelo] = useState<boolean>(false);

  const [selectedTalla, setSelectedTalla] = useState<number>(24);
  const [capturasMap, setCapturasMap] = useState<{ [key: string]: ItemCaptura }>({});

  const [notaIncidencia, setNotaIncidencia] = useState<string>('');
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);

  useEffect(() => {
    const listMaq = ProductionStore.getMaquileros();
    setMaquileros(listMaq);
    if (listMaq.length > 0) {
      setSelectedMaquileroId(listMaq[0].id);
    }
  }, []);

  useEffect(() => {
    if (selectedMaquileroId) {
      const res = ProductionStore.getModelosDisponiblesMaquilero(selectedMaquileroId);
      setModelosDisponibles(res.modelos);
      if (res.modelos.length > 0) {
        setSelectedModelo(res.modelos[0]);
      }
    }
  }, [selectedMaquileroId]);

  const itemKeyActual = `${selectedModelo}_${selectedTalla}`;
  const itemActual: ItemCaptura = capturasMap[itemKeyActual] || {
    modelo: selectedModelo,
    talla: selectedTalla,
    completos: 0,
    faltIzq: 0,
    faltDer: 0,
  };

  const handleUpdateCantidad = (field: 'completos' | 'faltIzq' | 'faltDer' | 'segunda' | 'mermas', delta: number) => {
    setCapturasMap((prev) => {
      const actual = prev[itemKeyActual] || {
        modelo: selectedModelo,
        talla: selectedTalla,
        completos: 0,
        faltIzq: 0,
        faltDer: 0,
        segunda: 0,
        mermas: 0,
      };
      const nuevoValor = Math.max(0, (actual[field] || 0) + delta);
      return {
        ...prev,
        [itemKeyActual]: {
          ...actual,
          [field]: nuevoValor,
        },
      };
    });
  };

  const handleInputChange = (field: 'completos' | 'faltIzq' | 'faltDer' | 'segunda' | 'mermas' | 'cargoMXN', valStr: string) => {
    const val = parseFloat(valStr);
    const num = isNaN(val) ? 0 : Math.max(0, val);
    setCapturasMap((prev) => ({
      ...prev,
      [itemKeyActual]: {
        ...(prev[itemKeyActual] || {
          modelo: selectedModelo,
          talla: selectedTalla,
          completos: 0,
          faltIzq: 0,
          faltDer: 0,
          segunda: 0,
          mermas: 0,
        }),
        [field]: num,
      },
    }));
  };

  const handleSetTipoDefecto = (tipo: TipoDefectoQC) => {
    setCapturasMap((prev) => ({
      ...prev,
      [itemKeyActual]: {
        ...(prev[itemKeyActual] || {
          modelo: selectedModelo,
          talla: selectedTalla,
          completos: 0,
          faltIzq: 0,
          faltDer: 0,
        }),
        tipoDefecto: tipo,
      },
    }));
  };


  const handleAgregarModeloPersonalizado = () => {
    if (nuevoModeloInput.trim()) {
      const mod = nuevoModeloInput.trim();
      if (!modelosDisponibles.includes(mod)) {
        setModelosDisponibles((prev) => [...prev, mod]);
      }
      setSelectedModelo(mod);
      setNuevoModeloInput('');
      setMostrandoNuevoModelo(false);
    }
  };

  const handleEliminarItemCapturado = (key: string) => {
    setCapturasMap((prev) => {
      const copia = { ...prev };
      delete copia[key];
      return copia;
    });
  };

  const itemsCapturadosArray = Object.values(capturasMap).filter(
    (it) => it.completos > 0 || it.faltIzq > 0 || it.faltDer > 0 || (it.segunda || 0) > 0 || (it.mermas || 0) > 0
  );

  const tieneFaltantesTotales = itemsCapturadosArray.some(
    (it) => it.faltIzq > 0 || it.faltDer > 0 || (it.mermas || 0) > 0 || (it.cargoMXN || 0) > 0
  );

  const totalParesCapturados = itemsCapturadosArray.reduce((acc, it) => acc + it.completos, 0);
  const totalFaltantesCapturados = itemsCapturadosArray.reduce(
    (acc, it) => acc + it.faltIzq + it.faltDer,
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorValidacion(null);

    if (!selectedMaquileroId) {
      setErrorValidacion('Selecciona un maquilero válido.');
      return;
    }

    if (itemsCapturadosArray.length === 0) {
      setErrorValidacion('Ingresa al menos 1 par completo, de 2da o mermado en la matriz de captura.');
      return;
    }

    if (tieneFaltantesTotales && !notaIncidencia.trim()) {
      setErrorValidacion('⚠️ Es obligatorio ingresar la Nota de Incidencia al registrar piezas faltantes, mermas o cargos QC.');
      return;
    }

    const result = ProductionStore.registrarRecepcionDirecta({
      maquilero_id: selectedMaquileroId,
      items: itemsCapturadosArray.map((it) => ({
        modelo: it.modelo,
        talla: it.talla,
        pares_completos: it.completos,
        faltantes_izq: it.faltIzq,
        faltantes_der: it.faltDer,
        pares_segunda: it.segunda || 0,
        mermas_totales: it.mermas || 0,
        tipo_defecto: it.tipoDefecto,
        cargo_maquilero_mxn: it.cargoMXN || 0,
      })),
      nota: notaIncidencia,
    });


    const maq = maquileros.find((m) => m.id === selectedMaquileroId);

    setMensajeExito(
      result.contieneAlerta
        ? `Recepción de ${result.totalRegistrados} pares para ${maq?.nombre || 'Maquilero'} guardada con Alerta de Incompletos activa.`
        : `¡Recepción registrada exitosamente! Se ingresaron ${result.totalRegistrados} pares completos a Producción.`
    );

    setTimeout(() => {
      router.push('/');
    }, 1500);
  };

  const handleRecibirTodoCompleto = () => {
    // Busca las órdenes del maquilero y modelo seleccionados o genera corrida estándar de 40 pares por talla
    const ordenes = ProductionStore.getOrdenesPendientesConDetalle().filter(
      (o) => o.maquilero_id === selectedMaquileroId && o.modelo === selectedModelo
    );

    const nuevoMap: { [key: string]: ItemCaptura } = { ...capturasMap };

    TALLAS_CERRADAS.forEach((talla) => {
      const key = `${selectedModelo}_${talla}`;
      let paresAEnviar = 40; // Default

      if (ordenes.length > 0) {
        const dt = ordenes[0].detalles.find((d) => d.talla === talla);
        if (dt) paresAEnviar = dt.pares_enviados;
      }

      nuevoMap[key] = {
        modelo: selectedModelo,
        talla,
        completos: paresAEnviar,
        faltIzq: 0,
        faltDer: 0,
        segunda: 0,
        mermas: 0,
      };
    });

    setCapturasMap(nuevoMap);
    setMensajeExito(`⚡ ¡Corrida completa de ${selectedModelo} para todas las tallas cargada a 1-Clic! Toca "Guardar Entrada".`);
    setTimeout(() => setMensajeExito(null), 4000);
  };

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto">
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-100 uppercase">
            Recepción de Calzado
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 mt-1">
            Captura ultra-rápida de lotes recibidos de maquila y control de calidad.
          </p>
        </div>

        {/* BOTÓN AUTOMÁTICO DE 1-CLIC */}
        <button
          type="button"
          onClick={handleRecibirTodoCompleto}
          className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-2xl text-sm sm:text-base font-extrabold uppercase shadow-lg border-2 border-emerald-300 transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02]"
        >
          <span>⚡ Recibir Todo Completo (1-Clic)</span>
        </button>
      </div>

      {itemsCapturadosArray.length > 0 && (
        <div className="flex items-center gap-3 text-sm sm:text-base font-mono bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-800">
          <span className="text-zinc-400">Total:</span>
          <span className="font-extrabold text-emerald-400">{totalParesCapturados} pares</span>
          {totalFaltantesCapturados > 0 && (
            <span className="text-rose-400 font-bold">({totalFaltantesCapturados} faltantes)</span>
          )}
        </div>
      )}

      {/* ALERTAS */}

      {mensajeExito && (
        <div className="bg-emerald-950/60 border border-emerald-700/80 text-emerald-200 rounded-2xl p-4 text-center font-semibold text-sm sm:text-base shadow-md flex items-center justify-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {errorValidacion && (
        <div className="bg-rose-950/60 border border-rose-800/80 text-rose-200 rounded-2xl p-4 text-center font-semibold text-sm sm:text-base flex items-center justify-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{errorValidacion}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SELECCIÓN DE MAQUILERO */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-2.5">
          <label className="text-xs sm:text-sm font-mono font-bold text-zinc-300 uppercase tracking-wider block">
            1. Seleccionar Maquilero
          </label>
          <select
            value={selectedMaquileroId}
            onChange={(e) => setSelectedMaquileroId(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-700 hover:border-zinc-500 focus:border-emerald-500 text-zinc-100 rounded-xl px-4 py-3 text-sm sm:text-base font-semibold focus:outline-none transition-colors"
          >
            {maquileros.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre} — Tarifa: ${m.tarifa_por_par.toFixed(2)} MXN/par
              </option>
            ))}
          </select>
        </div>

        {/* SELECCIÓN DE MODELO Y TALLAS CON BOTONES GRANDES Y TOUCH-FRIENDLY */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs sm:text-sm font-mono font-bold text-zinc-300 uppercase tracking-wider">
              2. Modelo & Talla a Capturar
            </label>
            {!mostrandoNuevoModelo ? (
              <button
                type="button"
                onClick={() => setMostrandoNuevoModelo(true)}
                className="text-xs sm:text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 font-bold"
              >
                <PlusCircle className="w-4 h-4" /> Agregar Otro Modelo
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Nombre del modelo..."
                  value={nuevoModeloInput}
                  onChange={(e) => setNuevoModeloInput(e.target.value)}
                  className="bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-1.5 text-xs sm:text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAgregarModeloPersonalizado}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs sm:text-sm"
                >
                  Ok
                </button>
              </div>
            )}
          </div>

          {/* BOTONES DE MODELO CON MEJOR TAMAÑO DE TEXTO */}
          <div className="flex flex-wrap gap-2">
            {modelosDisponibles.map((mod) => (
              <button
                key={mod}
                type="button"
                onClick={() => setSelectedModelo(mod)}
                className={`px-4 py-2.5 rounded-xl text-sm sm:text-base font-bold transition-all ${
                  selectedModelo === mod
                    ? 'bg-zinc-100 text-zinc-950 shadow-md ring-2 ring-white'
                    : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                {mod}
              </button>
            ))}
          </div>

          {/* GRID DE TALLAS CERRADAS CON TAMAÑOS GRANDES PARA TABLET Y PC */}
          <div className="pt-3 border-t border-zinc-800">
            <span className="text-xs sm:text-sm font-mono text-zinc-400 block mb-2 font-medium">
              Selecciona Talla para capturar:
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
              {TALLAS_CERRADAS.map((talla) => {
                const key = `${selectedModelo}_${talla}`;
                const item = capturasMap[key];
                const tieneDatos = item && (item.completos > 0 || item.faltIzq > 0 || item.faltDer > 0);
                const isSelected = selectedTalla === talla;

                return (
                  <button
                    key={talla}
                    type="button"
                    onClick={() => setSelectedTalla(talla)}
                    className={`py-3 sm:py-4 px-2 rounded-xl text-base sm:text-lg font-mono font-bold flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-emerald-500 text-zinc-950 ring-2 ring-emerald-400 shadow-md'
                        : tieneDatos
                        ? 'bg-zinc-800 text-emerald-400 border-2 border-emerald-500/60'
                        : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                    }`}
                  >
                    <span>#{talla}</span>
                    {tieneDatos && (
                      <span className="text-xs mt-1 leading-none font-extrabold">
                        {item.completos} p
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* EDITOR DE CANTIDADES TOUCH-FRIENDLY */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm sm:text-base border-b border-zinc-800 pb-3 gap-1">
            <span className="font-mono text-zinc-300 font-bold">
              Modelo: <span className="text-emerald-400">{selectedModelo}</span> — Talla #{selectedTalla}
            </span>
            <span className="text-xs sm:text-sm text-zinc-400 font-mono">
              Actual: <span className="text-zinc-100 font-extrabold">{itemActual.completos} pares</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* PARES COMPLETOS */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-3">
              <span className="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-wider block">
                Pares Completos (Par)
              </span>
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleUpdateCantidad('completos', -1)}
                  className="w-12 h-12 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold flex items-center justify-center text-xl shrink-0"
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  value={itemActual.completos || ''}
                  onChange={(e) => handleInputChange('completos', e.target.value)}
                  placeholder="0"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl text-center font-mono font-extrabold text-xl sm:text-2xl text-zinc-100 py-2 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => handleUpdateCantidad('completos', 1)}
                  className="w-12 h-12 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold flex items-center justify-center text-xl shrink-0"
                >
                  +
                </button>
              </div>
            </div>

            {/* FALTANTE IZQUIERDO */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-3">
              <span className="text-xs sm:text-sm font-bold text-rose-400 uppercase tracking-wider block">
                Faltante Izquierdo
              </span>
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleUpdateCantidad('faltIzq', -1)}
                  className="w-12 h-12 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold flex items-center justify-center text-xl shrink-0"
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  value={itemActual.faltIzq || ''}
                  onChange={(e) => handleInputChange('faltIzq', e.target.value)}
                  placeholder="0"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl text-center font-mono font-extrabold text-xl sm:text-2xl text-rose-300 py-2 focus:outline-none focus:border-rose-500"
                />
                <button
                  type="button"
                  onClick={() => handleUpdateCantidad('faltIzq', 1)}
                  className="w-12 h-12 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold flex items-center justify-center text-xl shrink-0"
                >
                  +
                </button>
              </div>
            </div>

            {/* FALTANTE DERECHO */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-3">
              <span className="text-xs sm:text-sm font-bold text-amber-400 uppercase tracking-wider block">
                Faltante Derecho
              </span>
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleUpdateCantidad('faltDer', -1)}
                  className="w-12 h-12 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold flex items-center justify-center text-xl shrink-0"
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  value={itemActual.faltDer || ''}
                  onChange={(e) => handleInputChange('faltDer', e.target.value)}
                  placeholder="0"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl text-center font-mono font-extrabold text-xl sm:text-2xl text-amber-300 py-2 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => handleUpdateCantidad('faltDer', 1)}
                  className="w-12 h-12 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold flex items-center justify-center text-xl shrink-0"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* SECCIÓN DE CONTROL DE CALIDAD (QC) Y PENALIZACIÓN */}
          <div className="pt-4 border-t border-zinc-800 space-y-4">
            <span className="text-xs sm:text-sm font-mono font-bold text-zinc-300 uppercase tracking-wider block">
              Control de Calidad (QC) & Mermas Imputables:
            </span>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-xs font-mono font-bold text-amber-400 block">Pares de 2da</span>
                <input
                  type="number"
                  min="0"
                  value={itemActual.segunda || ''}
                  onChange={(e) => handleInputChange('segunda', e.target.value)}
                  placeholder="0"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg text-center font-mono font-bold text-base text-zinc-100 py-1 focus:outline-none"
                />
              </div>

              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-xs font-mono font-bold text-rose-400 block">Mermas Totales</span>
                <input
                  type="number"
                  min="0"
                  value={itemActual.mermas || ''}
                  onChange={(e) => handleInputChange('mermas', e.target.value)}
                  placeholder="0"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg text-center font-mono font-bold text-base text-rose-300 py-1 focus:outline-none"
                />
              </div>

              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-xs font-mono font-bold text-zinc-400 block">Tipo de Defecto (QC)</span>
                <select
                  value={itemActual.tipoDefecto || 'Otro Defecto'}
                  onChange={(e) => handleSetTipoDefecto(e.target.value as TipoDefectoQC)}
                  className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg py-1 px-2 text-xs font-semibold focus:outline-none"
                >
                  <option value="Piel Manchada/Abierta">Piel Manchada/Abierta</option>
                  <option value="Costura Desalineada">Costura Desalineada</option>
                  <option value="Planta/Tacón Despegado">Planta/Tacón Despegado</option>
                  <option value="Merma Irreparable">Merma Irreparable</option>
                  <option value="Otro Defecto">Otro Defecto</option>
                </select>
              </div>

              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-xs font-mono font-bold text-rose-400 block">Cargo Maquilero ($ MXN)</span>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={itemActual.cargoMXN || ''}
                  onChange={(e) => handleInputChange('cargoMXN', e.target.value)}
                  placeholder="$0.00"
                  className="w-full bg-zinc-900 border border-rose-800 text-center font-mono font-extrabold text-base text-rose-400 py-1 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>


        {/* NOTA DE INCIDENCIA SI HAY FALTANTES */}
        {tieneFaltantesTotales && (
          <div className="bg-rose-950/20 border border-rose-900/60 rounded-2xl p-5 space-y-2.5">
            <label className="text-xs sm:text-sm font-bold text-rose-300 uppercase tracking-wide flex items-center gap-2">
              <MessageSquareWarning className="w-5 h-5 text-rose-400 shrink-0" />
              Nota de Incidencia (Obligatoria por Faltantes)
            </label>
            <textarea
              value={notaIncidencia}
              onChange={(e) => setNotaIncidencia(e.target.value)}
              placeholder="Explica la causa del faltante (ej. suela raspada en montado, faltan 2 izq)..."
              rows={2}
              className="w-full bg-zinc-950 border border-rose-800/80 rounded-xl p-3 text-sm text-zinc-100 focus:outline-none focus:border-rose-500"
            />
          </div>
        )}

        {/* RESUMEN DE CAPTURAS */}
        {itemsCapturadosArray.length > 0 && (
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs sm:text-sm font-mono font-bold text-zinc-300 uppercase">
              Resumen de la Recepción ({itemsCapturadosArray.length} partidas)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 font-mono text-xs">
                    <th className="py-2.5 px-3 font-semibold">Modelo</th>
                    <th className="py-2.5 px-3 font-semibold">Talla</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Completos</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Falt. Izq</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Falt. Der</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {itemsCapturadosArray.map((it) => {
                    const key = `${it.modelo}_${it.talla}`;
                    return (
                      <tr key={key} className="hover:bg-zinc-800/40">
                        <td className="py-2.5 px-3 text-zinc-100 font-bold">{it.modelo}</td>
                        <td className="py-2.5 px-3 text-zinc-300 font-mono">#{it.talla}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-extrabold text-emerald-400">
                          {it.completos}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-400">
                          {it.faltIzq || '-'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-400">
                          {it.faltDer || '-'}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleEliminarItemCapturado(key)}
                            className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors"
                            title="Eliminar partida"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BOTÓN DE CONFIRMACIÓN */}
        <button
          type="submit"
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-sm sm:text-base font-extrabold uppercase tracking-wider shadow-lg transition-colors flex items-center justify-center gap-2"
        >
          <PackageCheck className="w-5 h-5" />
          <span>Confirmar y Guardar Recepción ({totalParesCapturados} Pares)</span>
        </button>
      </form>
    </div>
  );
}
