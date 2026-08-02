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

const MOTIVOS_SALIDA = [
  'Consumo Interno Planta / Almacén',
  'Pegamento / Adhesivos para Proceso',
  'Forros / Soles / Insumos de Apoyo',
  'Merma / Material Dañado',
  'Pruebas / Muestras de Calidad',
  'Ajuste de Almacén',
  'Otro',
];

const UNIDADES_MEDIDA = ['pares', 'piezas', 'litros', 'rollos', 'unidades', 'm2', 'kg'];

export default function SalidasGeneralesPage() {
  const [inventario, setInventario] = useState<InventarioCrudo[]>([]);
  const [historialSalidas, setHistorialSalidas] = useState<SalidaGeneral[]>([]);

  // Form states
  const [tipoMaterial, setTipoMaterial] = useState<string>('Pegamento Blanco');
  const [talla, setTalla] = useState<number>(0);
  const [cantidad, setCantidad] = useState<number>(1);
  const [unidad, setUnidad] = useState<string>('litros');
  const [motivoConcepto, setMotivoConcepto] = useState<string>('Consumo Interno Planta / Almacén');
  const [entregadoA, setEntregadoA] = useState<string>('');
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

    if (inv.length > 0) {
      setTipoMaterial(inv[0].tipo_material);
      setTalla(inv[0].talla || 0);
    }
  };

  const handleMaterialChange = (materialNombre: string) => {
    setTipoMaterial(materialNombre);
    const itemMatch = inventario.find((i) => i.tipo_material === materialNombre);
    if (itemMatch) {
      setTalla(itemMatch.talla || 0);
      if (materialNombre.toLowerCase().includes('pegamento')) {
        setUnidad('litros');
      } else if (materialNombre.toLowerCase().includes('rollo') || materialNombre.toLowerCase().includes('piel')) {
        setUnidad('rollos');
      } else {
        setUnidad('pares');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorValidacion(null);
    setMensajeExito(null);

    if (!tipoMaterial.trim()) {
      setErrorValidacion('Especifica o selecciona el tipo de material a retirar.');
      return;
    }

    if (cantidad <= 0) {
      setErrorValidacion('La cantidad a retirar debe ser mayor a 0.');
      return;
    }

    const nuevaSalida = ProductionStore.crearSalidaGeneral({
      tipo_material: tipoMaterial,
      talla: Number(talla),
      cantidad: Number(cantidad),
      unidad,
      motivo_concepto: motivoConcepto,
      entregado_a: entregadoA,
      notas,
    });

    setMensajeExito(
      `¡Salida ${nuevaSalida.folio} registrada! Se descontaron ${nuevaSalida.cantidad} ${nuevaSalida.unidad} de ${nuevaSalida.tipo_material}.`
    );

    setCantidad(1);
    setEntregadoA('');
    setNotas('');

    cargarDatos();
  };

  const handleEliminar = (id: string, folio: string) => {
    if (confirm(`¿Eliminar registro de salida ${folio}?`)) {
      ProductionStore.eliminarSalidaGeneral(id);
      cargarDatos();
    }
  };

  const historialFiltrado = historialSalidas.filter((s) => {
    const q = busqueda.toLowerCase().trim();
    if (!q) return true;
    return (
      s.folio.toLowerCase().includes(q) ||
      s.tipo_material.toLowerCase().includes(q) ||
      s.motivo_concepto.toLowerCase().includes(q) ||
      (s.entregado_a && s.entregado_a.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto">
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-100 uppercase">
            Salidas Generales de Almacén
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 mt-1">
            Egreso directo por consumo interno, pegamentos, forros o ajuste.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-sm sm:text-base">
          <span className="text-zinc-400">Total Salidas:</span>
          <span className="font-bold text-zinc-100 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800">
            {historialSalidas.length} registros
          </span>
        </div>
      </div>

      {/* NOTIFICACIONES */}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FORMULARIO DE REGISTRO RÁPIDO */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-sm sm:text-base font-mono font-bold text-zinc-200 uppercase flex items-center gap-2 border-b border-zinc-800 pb-2.5">
            <PlusCircle className="w-4 h-4 text-emerald-400" /> Nuevo Egreso de Material
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs sm:text-sm font-mono font-bold text-zinc-400 uppercase block mb-1.5">
                Material / Insumo
              </label>
              <select
                value={tipoMaterial}
                onChange={(e) => handleMaterialChange(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 focus:border-emerald-500 text-zinc-100 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none"
              >
                {inventario.map((item) => (
                  <option key={item.id} value={item.tipo_material}>
                    {item.tipo_material} {item.talla ? `(Talla #${item.talla})` : ''} — Stock:{' '}
                    {item.cantidad_total}
                  </option>
                ))}
                <option value="Pegamento Blanco">Pegamento Blanco (Adhesivo)</option>
                <option value="Pegamento Amarillo / Cemento">Pegamento Amarillo / Cemento</option>
                <option value="Material Forro Sintético">Material Forro Sintético</option>
                <option value="Tachuelas y Bisutería">Tachuelas y Bisutería</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs sm:text-sm font-mono font-bold text-zinc-400 uppercase block mb-1.5">
                  Cantidad
                </label>
                <input
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={(e) => setCantidad(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-emerald-500 text-zinc-100 rounded-xl px-3 py-2.5 text-sm font-mono font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs sm:text-sm font-mono font-bold text-zinc-400 uppercase block mb-1.5">
                  Unidad
                </label>
                <select
                  value={unidad}
                  onChange={(e) => setUnidad(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-emerald-500 text-zinc-100 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none"
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
              <label className="text-xs sm:text-sm font-mono font-bold text-zinc-400 uppercase block mb-1.5">
                Motivo / Concepto
              </label>
              <select
                value={motivoConcepto}
                onChange={(e) => setMotivoConcepto(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 focus:border-emerald-500 text-zinc-100 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none"
              >
                {MOTIVOS_SALIDA.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs sm:text-sm font-mono font-bold text-zinc-400 uppercase block mb-1.5">
                Entregado A / Solicitante
              </label>
              <input
                type="text"
                placeholder="Nombre del operario o taller..."
                value={entregadoA}
                onChange={(e) => setEntregadoA(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 focus:border-emerald-500 text-zinc-100 rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold uppercase tracking-wider shadow transition-colors flex items-center justify-center gap-2"
            >
              <PackageMinus className="w-4 h-4" /> Registrar Salida
            </button>
          </form>
        </div>

        {/* HISTORIAL Y TABLA */}
        <div className="lg:col-span-2 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
            <h2 className="text-sm sm:text-base font-mono font-bold text-zinc-200 uppercase">
              Historial de Egreso de Almacén
            </h2>
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Buscar por folio, material o persona..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 w-full sm:w-72 font-medium"
              />
            </div>
          </div>

          {historialFiltrado.length === 0 ? (
            <div className="py-10 text-center text-sm text-zinc-500">
              No hay egresos registrados o no coinciden con la búsqueda.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 font-mono text-xs">
                    <th className="py-3 px-3 font-semibold">Folio</th>
                    <th className="py-3 px-3 font-semibold">Material</th>
                    <th className="py-3 px-3 font-semibold text-right">Cantidad</th>
                    <th className="py-3 px-3 font-semibold">Motivo</th>
                    <th className="py-3 px-3 font-semibold">Entregado a</th>
                    <th className="py-3 px-3 font-semibold text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {historialFiltrado.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-zinc-200">{item.folio}</td>
                      <td className="py-3 px-3 text-zinc-100 font-bold">
                        {item.tipo_material} {item.talla ? `(#${item.talla})` : ''}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-extrabold text-amber-400 text-sm">
                        {item.cantidad} {item.unidad}
                      </td>
                      <td className="py-3 px-3 text-zinc-400 text-xs sm:text-sm">{item.motivo_concepto}</td>
                      <td className="py-3 px-3 text-zinc-300 font-medium">{item.entregado_a || '-'}</td>
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleEliminar(item.id, item.folio)}
                          className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors"
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
