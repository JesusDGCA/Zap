'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  PackageCheck,
  AlertTriangle,
  CheckCircle2,
  PlusCircle,
  Trash2,
  ArrowRight,
  ShieldAlert,
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

  const [modelosDisponibles, setModelosDisponibles] = useState<string[]>(['HELLEN - 3596', 'Frozen', 'Carol']);
  const [selectedModelo, setSelectedModelo] = useState<string>('HELLEN - 3596');

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

  const handleSetCantidadDirecta = (field: 'completos' | 'faltIzq' | 'faltDer' | 'segunda' | 'mermas', val: number) => {
    setCapturasMap((prev) => {
      const actual = prev[itemKeyActual] || {
        modelo: selectedModelo,
        talla: selectedTalla,
        completos: 0,
        faltIzq: 0,
        faltDer: 0,
      };

      return {
        ...prev,
        [itemKeyActual]: {
          ...actual,
          [field]: Math.max(0, val),
        },
      };
    });
  };

  const listaCapturados = Object.values(capturasMap).filter(
    (it) => it.completos > 0 || it.faltIzq > 0 || it.faltDer > 0 || (it.segunda || 0) > 0 || (it.mermas || 0) > 0
  );

  const totalParesCompletosGlobal = listaCapturados.reduce((acc, curr) => acc + curr.completos, 0);
  const totalFaltantesGlobal = listaCapturados.reduce(
    (acc, curr) => acc + curr.faltIzq + curr.faltDer + (curr.mermas || 0),
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorValidacion(null);

    if (!selectedMaquileroId) {
      setErrorValidacion('Por favor selecciona un maquilero.');
      return;
    }

    if (listaCapturados.length === 0) {
      setErrorValidacion('Debes ingresar al menos 1 par completo o un faltante para guardar.');
      return;
    }

    const resultado = ProductionStore.registrarRecepcionDirecta({
      maquilero_id: selectedMaquileroId,
      items: listaCapturados.map((it) => ({
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

    setMensajeExito(
      `Recepcion guardada: ${resultado.totalRegistrados} pares completos registrados con exito.`
    );

    setCapturasMap({});
    setNotaIncidencia('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto">
      {/* ENCABEZADO */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase flex items-center gap-2">
            <PackageCheck className="w-7 h-7 text-blue-700 dark:text-blue-500" />
            <span>2. Recepción de Maquila</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 mt-0.5">
            Cuenta los pares terminados y anota si falta algun pie o hay defectos.
          </p>
        </div>
      </div>

      {mensajeExito && (
        <div className="bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 rounded-2xl p-4 text-center font-semibold text-sm sm:text-base shadow-sm flex items-center justify-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-blue-700 dark:text-blue-400 shrink-0" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {errorValidacion && (
        <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 rounded-2xl p-4 text-center font-semibold text-sm sm:text-base flex items-center justify-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{errorValidacion}</span>
        </div>
      )}

      {/* SELECCION DE TALLER Y MODELO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* TALLER */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm space-y-2">
          <label className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400 uppercase block">
            1. ¿Quien esta entregando el trabajo?
          </label>
          <select
            value={selectedMaquileroId}
            onChange={(e) => setSelectedMaquileroId(e.target.value)}
            className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:border-blue-600 focus:outline-none"
          >
            {maquileros.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre} (${m.tarifa_por_par.toFixed(2)}/par)
              </option>
            ))}
          </select>
        </div>

        {/* MODELO */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm space-y-2">
          <label className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400 uppercase block">
            2. ¿Que modelo estan entregando?
          </label>
          <select
            value={selectedModelo}
            onChange={(e) => setSelectedModelo(e.target.value)}
            className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:border-blue-600 focus:outline-none"
          >
            {modelosDisponibles.map((m, i) => (
              <option key={i} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CONTEO POR TALLAS CON BOTONES GIGANTES */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider block">
            3. Selecciona la Talla a Contar
          </span>
          <div className="grid grid-cols-6 gap-2 mt-2">
            {TALLAS_CERRADAS.map((talla) => {
              const k = `${selectedModelo}_${talla}`;
              const count = capturasMap[k]?.completos || 0;
              const isSelected = selectedTalla === talla;

              return (
                <button
                  key={talla}
                  type="button"
                  onClick={() => setSelectedTalla(talla)}
                  className={`p-3 rounded-xl border font-bold text-center transition-all ${
                    isSelected
                      ? 'bg-blue-700 text-white border-blue-700 shadow-sm'
                      : 'bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-200 border-slate-200 dark:border-zinc-800 hover:border-slate-300'
                  }`}
                >
                  <span className="text-base font-mono block">#{talla}</span>
                  <span className="text-xs block mt-0.5 opacity-90">{count > 0 ? `${count}p` : '-'}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* PANEL DE CONTEO PARA LA TALLA SELECCIONADA */}
        <div className="p-4 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Contando talla #{selectedTalla} ({selectedModelo})
            </span>
            <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400">
              Pares completos: {itemActual.completos}
            </span>
          </div>

          {/* BOTONES GIGANTES DE SUMA / RESTA */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handleUpdateCantidad('completos', 10)}
              className="py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-mono font-bold text-sm shadow transition-colors"
            >
              +10 pares
            </button>
            <button
              type="button"
              onClick={() => handleUpdateCantidad('completos', 5)}
              className="py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-mono font-bold text-sm shadow transition-colors"
            >
              +5 pares
            </button>
            <button
              type="button"
              onClick={() => handleUpdateCantidad('completos', 1)}
              className="py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-mono font-bold text-sm shadow transition-colors"
            >
              +1 par
            </button>
            <button
              type="button"
              onClick={() => handleUpdateCantidad('completos', -1)}
              className="py-3 bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 rounded-xl font-mono font-bold text-sm transition-colors"
            >
              -1 par
            </button>
          </div>

          {/* REGISTRO DE PIEZAS SUELTAS / FALTANTES */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-zinc-800">
            <div>
              <label className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 block mb-1">
                Faltante Pie Izquierdo (Pzas)
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleUpdateCantidad('faltIzq', -1)}
                  className="w-8 h-8 rounded bg-slate-200 dark:bg-zinc-800 font-bold"
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  value={itemActual.faltIzq || 0}
                  onChange={(e) => handleSetCantidadDirecta('faltIzq', parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-center font-mono font-bold text-sm rounded py-1"
                />
                <button
                  type="button"
                  onClick={() => handleUpdateCantidad('faltIzq', 1)}
                  className="w-8 h-8 rounded bg-amber-600 text-white font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 block mb-1">
                Faltante Pie Derecho (Pzas)
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleUpdateCantidad('faltDer', -1)}
                  className="w-8 h-8 rounded bg-slate-200 dark:bg-zinc-800 font-bold"
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  value={itemActual.faltDer || 0}
                  onChange={(e) => handleSetCantidadDirecta('faltDer', parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-center font-mono font-bold text-sm rounded py-1"
                />
                <button
                  type="button"
                  onClick={() => handleUpdateCantidad('faltDer', 1)}
                  className="w-8 h-8 rounded bg-amber-600 text-white font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RESUMEN DE RECEPCION Y BOTON GUARDAR */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase">
              Resumen de la Entrega
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Verifica los pares antes de confirmar
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-mono font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800">
              {totalParesCompletosGlobal} pares completos
            </span>
            {totalFaltantesGlobal > 0 && (
              <span className="text-xs font-mono font-bold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 px-2.5 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800">
                {totalFaltantesGlobal} faltantes
              </span>
            )}
          </div>
        </div>

        {/* NOTA OPCIONAL */}
        <div>
          <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 uppercase block mb-1">
            Nota de Incidencia o Comentario (Opcional)
          </label>
          <input
            type="text"
            placeholder="Ej. Entregaron 2 pares sin adorno, se descontara en la raya..."
            value={notaIncidencia}
            onChange={(e) => setNotaIncidencia(e.target.value)}
            className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 text-xs focus:border-blue-600 focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full py-4 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-2xl font-extrabold text-base uppercase tracking-wide shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <PackageCheck className="w-5 h-5" />
          <span>Confirmar y Guardar Recepción de Maquila ({totalParesCompletosGlobal} pares)</span>
        </button>
      </div>
    </div>
  );
}
