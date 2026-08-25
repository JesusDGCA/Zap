'use client';

import { useState, useEffect } from 'react';
import {
  PackageMinus,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Search,
  PlusCircle,
} from 'lucide-react';
import { ProductionStore } from '@/lib/store';
import { InventarioCrudo, SalidaGeneral } from '@/types/database';
import { AREAS_ENTREGA_PREDEFINIDAS } from '@/lib/constants-calzado';

const MOTIVOS_SALIDA = [
  'Consumo Interno en Taller / Almacen',
  'Pegamento y Adhesivos para Proceso',
  'Forros / Suelas / Insumos de Apoyo',
  'Merma / Material Danado',
  'Pruebas y Muestras de Calidad',
  'Ajuste de Inventario',
  'Otro Concepto',
];

const UNIDADES_MEDIDA = ['MT', 'PAR', 'PIEZA', 'MILLAR', 'KG', 'LITROS', 'ROLLOS'];

export default function SalidasGeneralesPage() {
  const [inventario, setInventario] = useState<InventarioCrudo[]>([]);
  const [historialSalidas, setHistorialSalidas] = useState<SalidaGeneral[]>([]);

  // Form states con selectores
  const [tipoMaterial, setTipoMaterial] = useState<string>('');
  const [talla, setTalla] = useState<number>(0);
  const [cantidad, setCantidad] = useState<number>(1);
  const [unidad, setUnidad] = useState<string>('MT');
  const [motivoConcepto, setMotivoConcepto] = useState<string>(MOTIVOS_SALIDA[0]);
  const [entregadoA, setEntregadoA] = useState<string>(AREAS_ENTREGA_PREDEFINIDAS[0]);
  const [notas, setNotas] = useState<string>('');

  // UI state
  const [busqueda, setBusqueda] = useState<string>('');
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    const inv = ProductionStore.getInventarioCrudo();
    const salidas = ProductionStore.getSalidasGenerales();
    setInventario(inv);
    setHistorialSalidas(salidas);

    if (inv.length > 0 && !tipoMaterial) {
      setTipoMaterial(inv[0].tipo_material);
      setTalla(inv[0].talla || 0);
      setUnidad(inv[0].unidad_medida || 'MT');
    }
  };

  const handleMaterialChange = (materialNombre: string) => {
    setTipoMaterial(materialNombre);
    const itemMatch = inventario.find((i) => i.tipo_material === materialNombre);
    if (itemMatch) {
      setTalla(itemMatch.talla || 0);
      setUnidad(itemMatch.unidad_medida || 'MT');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorValidacion(null);
    setMensajeExito(null);

    if (!tipoMaterial.trim()) {
      setErrorValidacion('Por favor selecciona el material a entregar.');
      return;
    }

    if (cantidad <= 0) {
      setErrorValidacion('La cantidad debe ser mayor a 0.');
      return;
    }

    const nueva = ProductionStore.crearSalidaGeneral({
      tipo_material: tipoMaterial,
      talla: talla > 0 ? talla : undefined,
      cantidad: Number(cantidad),
      unidad,
      motivo_concepto: motivoConcepto,
      entregado_a: entregadoA,
      notas,
    });

    setMensajeExito(`Salida ${nueva.folio} registrada (${cantidad} ${unidad} de ${tipoMaterial} para ${entregadoA}).`);
    setCantidad(1);
    setNotas('');
    cargarDatos();

    setTimeout(() => setMensajeExito(null), 3500);
  };

  const handleEliminar = (id: string, folio: string) => {
    if (confirm(`¿Deseas eliminar el registro de salida ${folio}?`)) {
      ProductionStore.eliminarSalidaGeneral(id);
      cargarDatos();
    }
  };

  const salidasFiltradas = historialSalidas.filter((s) => {
    const query = busqueda.toLowerCase();
    return (
      s.folio.toLowerCase().includes(query) ||
      s.tipo_material.toLowerCase().includes(query) ||
      s.motivo_concepto.toLowerCase().includes(query) ||
      (s.entregado_a && s.entregado_a.toLowerCase().includes(query))
    );
  });

  const materialesUnicos = Array.from(new Set(inventario.map((i) => i.tipo_material)));

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase flex items-center gap-2">
            <PackageMinus className="w-7 h-7 text-blue-700 dark:text-blue-500" />
            <span>7. Otras Salidas de Material</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 mt-0.5">
            Registra salidas del almacen por consumo de taller, mermas o pruebas.
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FORMULARIO */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pb-2.5">
            <PlusCircle className="w-4 h-4 text-blue-700 dark:text-blue-400" /> Registrar Salida
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400 uppercase block mb-1">
                1. Material a Entregar (Desplegable)
              </label>
              <select
                value={tipoMaterial}
                onChange={(e) => handleMaterialChange(e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs font-bold focus:border-blue-600 focus:outline-none"
              >
                {materialesUnicos.map((m, i) => (
                  <option key={i} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 uppercase block mb-1">
                  Cantidad
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  value={cantidad}
                  onChange={(e) => setCantidad(parseFloat(e.target.value) || 1)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-sm font-mono font-bold focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 uppercase block mb-1">
                  Unidad
                </label>
                <select
                  value={unidad}
                  onChange={(e) => setUnidad(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                >
                  {UNIDADES_MEDIDA.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 uppercase block mb-1">
                Motivo / Concepto (Desplegable)
              </label>
              <select
                value={motivoConcepto}
                onChange={(e) => setMotivoConcepto(e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
              >
                {MOTIVOS_SALIDA.map((mot) => (
                  <option key={mot} value={mot}>
                    {mot}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 uppercase block mb-1">
                Entregado a / Taller (Desplegable)
              </label>
              <select
                value={entregadoA}
                onChange={(e) => setEntregadoA(e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
              >
                {AREAS_ENTREGA_PREDEFINIDAS.map((area) => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-bold uppercase transition-colors shadow"
            >
              Registrar Salida
            </button>
          </form>
        </div>

        {/* HISTORIAL */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3 flex-wrap gap-2">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase">
                Historial de Salidas Generales
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Registros de consumos internos y mermas.
              </p>
            </div>

            <div className="relative w-40 sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar salida..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-lg pl-8 pr-2.5 py-1.5 text-xs focus:outline-none"
              />
            </div>
          </div>

          {salidasFiltradas.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">
              No hay salidas registradas.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 font-mono text-xs uppercase">
                    <th className="py-2.5 px-3">Folio</th>
                    <th className="py-2.5 px-3">Material</th>
                    <th className="py-2.5 px-3 text-right">Cantidad</th>
                    <th className="py-2.5 px-3">Concepto</th>
                    <th className="py-2.5 px-3">Entregado A</th>
                    <th className="py-2.5 px-2 text-right">Accion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
                  {salidasFiltradas.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40">
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-700 dark:text-blue-400">
                        {s.folio}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                        {s.tipo_material} {s.talla && s.talla > 0 ? `(#${s.talla})` : ''}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {s.cantidad} {s.unidad}
                      </td>
                      <td className="py-2.5 px-3 text-xs text-slate-600 dark:text-zinc-300">
                        {s.motivo_concepto}
                      </td>
                      <td className="py-2.5 px-3 text-xs font-semibold text-slate-700 dark:text-zinc-300">
                        {s.entregado_a || '-'}
                      </td>
                      <td className="py-2.5 px-2 text-right">
                        <button
                          onClick={() => handleEliminar(s.id, s.folio)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Eliminar registro"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
