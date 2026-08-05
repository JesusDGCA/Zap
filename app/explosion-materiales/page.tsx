'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Flame,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Box,
  ArrowRight,
  MinusCircle,
  Package,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { ProductionStore } from '@/lib/store';
import {
  ModeloCalzado,
  FichaTecnicaModeloBOM,
  ResultadoExplosionMateriales,
} from '@/types/database';

export default function ExplosionMaterialesPage() {
  const [modelos, setModelos] = useState<ModeloCalzado[]>([]);
  const [selectedModeloNombre, setSelectedModeloNombre] = useState<string>('Frozen');
  const [totalPares, setTotalPares] = useState<number>(200);

  const [fichaActual, setFichaActual] = useState<FichaTecnicaModeloBOM | undefined>(undefined);
  const [resultados, setResultados] = useState<ResultadoExplosionMateriales[]>([]);

  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [errorMensaje, setErrorMensaje] = useState<string | null>(null);

  const cargarDatos = () => {
    const listMod = ProductionStore.getModelos();
    setModelos(listMod);

    if (listMod.length > 0 && !selectedModeloNombre) {
      setSelectedModeloNombre(listMod[0].nombre);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    if (selectedModeloNombre && totalPares > 0) {
      const ficha = ProductionStore.getFichaTecnicaPorModelo(selectedModeloNombre);
      const res = ProductionStore.calcularExplosionMateriales(selectedModeloNombre, totalPares);
      setFichaActual(ficha);
      setResultados(res);
    } else {
      setResultados([]);
    }
  }, [selectedModeloNombre, totalPares]);

  const handleAplicarDescuento = () => {
    if (resultados.length === 0) {
      setErrorMensaje('No hay materiales que descontar o el modelo no tiene ficha técnica.');
      return;
    }

    const tieneFaltantes = resultados.some((r) => !r.suficiente);
    if (tieneFaltantes) {
      const confirmar = confirm(
        '⚠️ Existen insumos con stock insuficiente. ¿Deseas aplicar el descuento de todos modos?'
      );
      if (!confirmar) return;
    }

    const exito = ProductionStore.descontarStockPorExplosion(selectedModeloNombre, totalPares);
    if (exito) {
      setMensajeExito(
        `¡Descuento de explosión aplicado con éxito para ${totalPares} pares de ${selectedModeloNombre}!`
      );
      cargarDatos();
      // Recalcular resultados tras el descuento
      const res = ProductionStore.calcularExplosionMateriales(selectedModeloNombre, totalPares);
      setResultados(res);
      setTimeout(() => setMensajeExito(null), 3500);
    }
  };

  const countSuficientes = resultados.filter((r) => r.suficiente).length;
  const countFaltantes = resultados.filter((r) => !r.suficiente).length;

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto">
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-100 uppercase">
            Explosión de Materiales (MRP)
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 mt-1">
            Calculadora de consumo de insumos por modelo de calzado y análisis de stock disponible.
          </p>
        </div>

        <Link
          href="/catalogos"
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 border border-zinc-700 transition-colors self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Configurar Recetario (BOM)</span>
        </Link>
      </div>

      {mensajeExito && (
        <div className="bg-emerald-950/60 border border-emerald-700/80 text-emerald-200 rounded-2xl p-4 text-center font-semibold text-sm sm:text-base shadow-md flex items-center justify-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {errorMensaje && (
        <div className="bg-rose-950/60 border border-rose-800/80 text-rose-200 rounded-2xl p-4 text-center font-semibold text-sm sm:text-base flex items-center justify-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{errorMensaje}</span>
        </div>
      )}

      {/* CONTROLES DE SIMULACIÓN Y EXPLOSIÓN */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs sm:text-sm font-mono font-bold text-zinc-300 uppercase tracking-wider block mb-2">
            1. Seleccionar Modelo de Calzado
          </label>
          <select
            value={selectedModeloNombre}
            onChange={(e) => setSelectedModeloNombre(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-700 focus:border-emerald-500 text-zinc-100 rounded-xl px-4 py-3 text-sm sm:text-base font-semibold focus:outline-none transition-colors"
          >
            {modelos.map((m) => (
              <option key={m.id} value={m.nombre}>
                {m.nombre} {m.estilo ? `(${m.estilo})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs sm:text-sm font-mono font-bold text-zinc-300 uppercase tracking-wider block mb-2">
            2. Cantidad de Pares a Fabricar
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              value={totalPares}
              onChange={(e) => setTotalPares(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-full bg-zinc-950 border border-zinc-700 focus:border-emerald-500 text-zinc-100 rounded-xl px-4 py-3 text-base sm:text-lg font-mono font-extrabold focus:outline-none"
            />
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setTotalPares(50)}
                className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono font-bold rounded-lg border border-zinc-700"
              >
                50p
              </button>
              <button
                type="button"
                onClick={() => setTotalPares(200)}
                className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono font-bold rounded-lg border border-zinc-700"
              >
                200p
              </button>
              <button
                type="button"
                onClick={() => setTotalPares(500)}
                className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono font-bold rounded-lg border border-zinc-700"
              >
                500p
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RESULTADOS DE LA EXPLOSIÓN DE MATERIALES */}
      {!fichaActual || fichaActual.receta.length === 0 ? (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-8 text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
          <h3 className="text-base font-bold text-zinc-200">
            Sin Ficha Técnica (BOM) configurada para el modelo &quot;{selectedModeloNombre}&quot;
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            Agrega la receta de consumos por par (plantas, tacones, pegamento, forro) en el catálogo para realizar la explosión automática.
          </p>
          <Link
            href="/catalogos"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold uppercase"
          >
            Configurar Recetario
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* TARJETAS RESUMEN DE SEMÁFORO DE STOCK */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-zinc-400 uppercase block">
                  Materiales Analizados
                </span>
                <span className="text-2xl font-extrabold font-mono text-zinc-100">
                  {resultados.length} insumos
                </span>
              </div>
              <Box className="w-8 h-8 text-zinc-500" />
            </div>

            <div className="bg-zinc-900/90 border border-emerald-900/60 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase block">
                  Stock Suficiente
                </span>
                <span className="text-2xl font-extrabold font-mono text-emerald-400">
                  {countSuficientes} ok
                </span>
              </div>
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>

            <div className="bg-zinc-900/90 border border-rose-900/60 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-rose-400 uppercase block">
                  Stock Faltante
                </span>
                <span className="text-2xl font-extrabold font-mono text-rose-400">
                  {countFaltantes} en déficit
                </span>
              </div>
              <AlertTriangle className="w-8 h-8 text-rose-400" />
            </div>
          </div>

          {/* TABLA DE DETALLE DE EXPLOSIÓN */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-zinc-100 uppercase">
                  Desglose de Consumos para {totalPares} Pares de &quot;{selectedModeloNombre}&quot;
                </h3>
                <p className="text-xs text-zinc-400">
                  Calculado conforme a la Ficha Técnica del modelo.
                </p>
              </div>

              <button
                onClick={handleAplicarDescuento}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-extrabold uppercase shadow flex items-center gap-2 transition-colors"
              >
                <MinusCircle className="w-4 h-4" /> Descontar del Inventario Crudo
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left border border-zinc-800">
                <thead>
                  <tr className="bg-zinc-950 text-zinc-300 font-mono border-b border-zinc-800">
                    <th className="py-3 px-4 font-bold">Insumo / Material</th>
                    <th className="py-3 px-4 font-bold text-center">Consumo por Par</th>
                    <th className="py-3 px-4 font-bold text-right">Requerido ({totalPares}p)</th>
                    <th className="py-3 px-4 font-bold text-right">Stock Actual</th>
                    <th className="py-3 px-4 font-bold text-center">Estado de Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/70">
                  {resultados.map((r, i) => (
                    <tr key={i} className="hover:bg-zinc-800/40">
                      <td className="py-3 px-4 font-bold text-zinc-100">{r.material_nombre}</td>
                      <td className="py-3 px-4 text-center font-mono text-zinc-400">
                        {r.cantidad_requerida_total / totalPares} {r.unidad_medida}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-extrabold text-amber-400">
                        {r.cantidad_requerida_total} {r.unidad_medida}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-zinc-200">
                        {r.stock_actual} {r.unidad_medida}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {r.suficiente ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 text-xs font-bold rounded-lg">
                            ✓ Stock OK (+{r.diferencia_stock.toFixed(1)})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-950/80 border border-rose-800/80 text-rose-300 text-xs font-bold rounded-lg">
                            ⚠️ Faltan {Math.abs(r.diferencia_stock).toFixed(1)} {r.unidad_medida}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
