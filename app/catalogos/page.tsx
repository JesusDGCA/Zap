'use client';

import { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Trash2,
  PlusCircle,
} from 'lucide-react';
import { ProductionStore } from '@/lib/store';
import { Maquilero, ModeloCalzado, InventarioCrudo, PedidoCliente } from '@/types/database';
import { formatMXN } from '@/lib/utils';

export default function CatalogosPage() {
  const [activeTab, setActiveTab] = useState<'maquileros' | 'modelos' | 'insumos' | 'pedidos'>('maquileros');

  const [modelos, setModelos] = useState<ModeloCalzado[]>([]);
  const [maquileros, setMaquileros] = useState<Maquilero[]>([]);
  const [inventario, setInventario] = useState<InventarioCrudo[]>([]);
  const [pedidos, setPedidos] = useState<PedidoCliente[]>([]);

  // Forms states
  const [nuevoModeloNombre, setNuevoModeloNombre] = useState<string>('');
  const [nuevoModeloEstilo, setNuevoModeloEstilo] = useState<string>('');

  const [nuevoMaquileroNombre, setNuevoMaquileroNombre] = useState<string>('');
  const [nuevoMaquileroTarifa, setNuevoMaquileroTarifa] = useState<string>('');

  const [nuevoInsumoNombre, setNuevoInsumoNombre] = useState<string>('');
  const [nuevoInsumoTalla, setNuevoInsumoTalla] = useState<string>('24');
  const [nuevoInsumoCantidad, setNuevoInsumoCantidad] = useState<string>('100');

  const [nuevoClienteNombre, setNuevoClienteNombre] = useState<string>('');
  const [nuevoClienteModelo, setNuevoClienteModelo] = useState<string>('');
  const [nuevoClienteNotas, setNuevoClienteNotas] = useState<string>('');
  const [tallasPedido, setTallasPedido] = useState<{ [talla: number]: number }>({
    22.0: 0,
    23.0: 0,
    24.0: 0,
    25.0: 0,
    26.0: 0,
  });

  const [mensaje, setMensaje] = useState<string | null>(null);

  const cargarDatos = () => {
    const listModelos = ProductionStore.getModelos();
    setModelos(listModelos);
    setMaquileros(ProductionStore.getMaquileros());
    setInventario(ProductionStore.getInventarioCrudo());
    setPedidos(ProductionStore.getPedidosCliente());

    if (listModelos.length > 0 && !nuevoClienteModelo) {
      setNuevoClienteModelo(listModelos[0].nombre);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleCrearModelo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoModeloNombre.trim()) return;

    ProductionStore.crearModelo(nuevoModeloNombre, nuevoModeloEstilo);
    setNuevoModeloNombre('');
    setNuevoModeloEstilo('');
    cargarDatos();
    setMensaje('¡Modelo de calzado registrado!');
    setTimeout(() => setMensaje(null), 2500);
  };

  const handleCrearMaquilero = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoMaquileroNombre.trim()) return;

    const tarifa = parseFloat(nuevoMaquileroTarifa) || 0;
    ProductionStore.crearMaquilero(nuevoMaquileroNombre, tarifa);
    setNuevoMaquileroNombre('');
    setNuevoMaquileroTarifa('');
    cargarDatos();
    setMensaje('¡Maquilero registrado!');
    setTimeout(() => setMensaje(null), 2500);
  };

  const handleCrearInsumo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoInsumoNombre.trim()) return;

    const talla = parseFloat(nuevoInsumoTalla) || 0;
    const cantidad = parseInt(nuevoInsumoCantidad, 10) || 0;

    ProductionStore.agregarInsumoInventario(nuevoInsumoNombre, talla, cantidad);
    setNuevoInsumoNombre('');
    setNuevoInsumoCantidad('100');
    cargarDatos();
    setMensaje('¡Insumo registrado en el Inventario Crudo!');
    setTimeout(() => setMensaje(null), 2500);
  };

  const handleCrearPedido = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoClienteNombre.trim() || !nuevoClienteModelo) return;

    const desglose = Object.entries(tallasPedido).map(([tallaStr, pares]) => ({
      talla: parseFloat(tallaStr),
      pares: pares || 0,
    }));

    const totalPares = desglose.reduce((sum, item) => sum + item.pares, 0);
    if (totalPares <= 0) {
      alert('Ingresa al menos 1 par en las tallas del pedido.');
      return;
    }

    ProductionStore.crearPedidoCliente({
      cliente: nuevoClienteNombre,
      modelo: nuevoClienteModelo,
      notas: nuevoClienteNotas,
      desglose_tallas: desglose,
    });

    setNuevoClienteNombre('');
    setNuevoClienteNotas('');
    setTallasPedido({ 22.0: 0, 23.0: 0, 24.0: 0, 25.0: 0, 26.0: 0 });
    cargarDatos();
    setMensaje(`¡Pedido de ${nuevoClienteNombre} por ${totalPares} pares registrado!`);
    setTimeout(() => setMensaje(null), 2500);
  };

  const handleEliminarPedido = (id: string, folio: string) => {
    if (confirm(`¿Eliminar el pedido ${folio}?`)) {
      ProductionStore.eliminarPedidoCliente(id);
      cargarDatos();
    }
  };

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto">
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-100 uppercase">
            Catálogos & Inventario Crudo
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 mt-1">
            Administración de maquileros, modelos, stock crudo y pedidos de fábrica.
          </p>
        </div>

        {/* PESTAÑAS */}
        <div className="flex items-center bg-zinc-900 p-1.5 rounded-xl border border-zinc-800 flex-wrap">
          <button
            onClick={() => setActiveTab('maquileros')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'maquileros'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Maquileros ({maquileros.length})
          </button>
          <button
            onClick={() => setActiveTab('modelos')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'modelos'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Modelos ({modelos.length})
          </button>
          <button
            onClick={() => setActiveTab('insumos')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'insumos'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Inventario Crudo
          </button>
          <button
            onClick={() => setActiveTab('pedidos')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'pedidos'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Pedidos ({pedidos.length})
          </button>
        </div>
      </div>

      {mensaje && (
        <div className="bg-emerald-950/60 border border-emerald-700/80 text-emerald-200 p-3 rounded-2xl text-center text-xs sm:text-sm font-semibold flex items-center justify-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{mensaje}</span>
        </div>
      )}

      {/* TAB 1: MAQUILEROS */}
      {activeTab === 'maquileros' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm sm:text-base font-mono font-bold text-zinc-200 uppercase flex items-center gap-2 border-b border-zinc-800 pb-2.5">
              <PlusCircle className="w-4 h-4 text-emerald-400" /> Nuevo Maquilero
            </h2>
            <form onSubmit={handleCrearMaquilero} className="space-y-4">
              <div>
                <label className="text-xs sm:text-sm font-mono font-bold text-zinc-400 uppercase block mb-1.5">
                  Nombre del Taller / Maquilero
                </label>
                <input
                  type="text"
                  placeholder="Ej. Don Beto - Forrado"
                  value={nuevoMaquileroNombre}
                  onChange={(e) => setNuevoMaquileroNombre(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-emerald-500 text-zinc-100 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-mono font-bold text-zinc-400 uppercase block mb-1.5">
                  Tarifa por Par (MXN)
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="14.50"
                  value={nuevoMaquileroTarifa}
                  onChange={(e) => setNuevoMaquileroTarifa(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-emerald-500 text-zinc-100 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold uppercase transition-colors"
              >
                Guardar Maquilero
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm sm:text-base font-mono font-bold text-zinc-200 uppercase border-b border-zinc-800 pb-2.5">
              Directorio de Maquileros
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 font-mono text-xs">
                    <th className="py-3 px-3 font-semibold">Nombre</th>
                    <th className="py-3 px-3 font-semibold text-right">Tarifa / Par</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {maquileros.map((m) => (
                    <tr key={m.id} className="hover:bg-zinc-800/40">
                      <td className="py-3 px-3 text-zinc-100 font-bold">{m.nombre}</td>
                      <td className="py-3 px-3 text-right font-mono font-extrabold text-emerald-400 text-sm sm:text-base">
                        {formatMXN(m.tarifa_por_par)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MODELOS */}
      {activeTab === 'modelos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm sm:text-base font-mono font-bold text-zinc-200 uppercase flex items-center gap-2 border-b border-zinc-800 pb-2.5">
              <PlusCircle className="w-4 h-4 text-emerald-400" /> Nuevo Modelo
            </h2>
            <form onSubmit={handleCrearModelo} className="space-y-4">
              <div>
                <label className="text-xs sm:text-sm font-mono font-bold text-zinc-400 uppercase block mb-1.5">
                  Nombre del Modelo
                </label>
                <input
                  type="text"
                  placeholder="Ej. Frozen, Carol, Stiletto..."
                  value={nuevoModeloNombre}
                  onChange={(e) => setNuevoModeloNombre(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-emerald-500 text-zinc-100 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-mono font-bold text-zinc-400 uppercase block mb-1.5">
                  Estilo / Tipo de Calzado
                </label>
                <input
                  type="text"
                  placeholder="Ej. Sandalia Plataforma"
                  value={nuevoModeloEstilo}
                  onChange={(e) => setNuevoModeloEstilo(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-emerald-500 text-zinc-100 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold uppercase transition-colors"
              >
                Guardar Modelo
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm sm:text-base font-mono font-bold text-zinc-200 uppercase border-b border-zinc-800 pb-2.5">
              Catálogo de Modelos Registrados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {modelos.map((m) => (
                <div
                  key={m.id}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-1"
                >
                  <span className="font-bold text-sm sm:text-base text-zinc-100 block">{m.nombre}</span>
                  <span className="text-xs sm:text-sm text-zinc-400 block">{m.estilo || 'Sin estilo especificado'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INVENTARIO CRUDO */}
      {activeTab === 'insumos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm sm:text-base font-mono font-bold text-zinc-200 uppercase flex items-center gap-2 border-b border-zinc-800 pb-2.5">
              <PlusCircle className="w-4 h-4 text-emerald-400" /> Ingresar Insumo Crudo
            </h2>
            <form onSubmit={handleCrearInsumo} className="space-y-4">
              <div>
                <label className="text-xs sm:text-sm font-mono font-bold text-zinc-400 uppercase block mb-1.5">
                  Tipo de Material / Planta / Tacón
                </label>
                <input
                  type="text"
                  placeholder="Ej. Planta Modelo Frozen"
                  value={nuevoInsumoNombre}
                  onChange={(e) => setNuevoInsumoNombre(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-emerald-500 text-zinc-100 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs sm:text-sm font-mono font-bold text-zinc-400 uppercase block mb-1.5">
                    Talla (#)
                  </label>
                  <input
                    type="number"
                    value={nuevoInsumoTalla}
                    onChange={(e) => setNuevoInsumoTalla(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 focus:border-emerald-500 text-zinc-100 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-mono font-bold text-zinc-400 uppercase block mb-1.5">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    value={nuevoInsumoCantidad}
                    onChange={(e) => setNuevoInsumoCantidad(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 focus:border-emerald-500 text-zinc-100 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold uppercase transition-colors"
              >
                Agregar a Stock Crudo
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm sm:text-base font-mono font-bold text-zinc-200 uppercase border-b border-zinc-800 pb-2.5">
              Inventario Crudo Disponible
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 font-mono text-xs">
                    <th className="py-3 px-3 font-semibold">Material</th>
                    <th className="py-3 px-3 font-semibold text-center">Talla</th>
                    <th className="py-3 px-3 font-semibold text-right">Cantidad Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {inventario.map((inv) => (
                    <tr key={inv.id} className="hover:bg-zinc-800/40">
                      <td className="py-3 px-3 text-zinc-100 font-bold">{inv.tipo_material}</td>
                      <td className="py-3 px-3 text-center font-mono text-zinc-400 font-semibold">
                        {inv.talla ? `#${inv.talla}` : '-'}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-extrabold text-emerald-400 text-sm sm:text-base">
                        {inv.cantidad_total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PEDIDOS */}
      {activeTab === 'pedidos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm sm:text-base font-mono font-bold text-zinc-200 uppercase flex items-center gap-2 border-b border-zinc-800 pb-2.5">
              <PlusCircle className="w-4 h-4 text-emerald-400" /> Registrar Pedido Cliente
            </h2>
            <form onSubmit={handleCrearPedido} className="space-y-4">
              <div>
                <label className="text-xs sm:text-sm font-mono font-bold text-zinc-400 uppercase block mb-1.5">
                  Nombre Cliente / Marca (ej. Clasben)
                </label>
                <input
                  type="text"
                  placeholder="Ej. Clasben Calzado"
                  value={nuevoClienteNombre}
                  onChange={(e) => setNuevoClienteNombre(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-emerald-500 text-zinc-100 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs sm:text-sm font-mono font-bold text-zinc-400 uppercase block mb-1.5">
                  Modelo de Calzado
                </label>
                <select
                  value={nuevoClienteModelo}
                  onChange={(e) => setNuevoClienteModelo(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-emerald-500 text-zinc-100 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:outline-none"
                >
                  {modelos.map((m) => (
                    <option key={m.id} value={m.nombre}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-mono font-bold text-zinc-400 uppercase block mb-1.5">
                  Corrida (22 al 26)
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[22, 23, 24, 25, 26].map((t) => (
                    <div key={t} className="text-center">
                      <span className="text-xs font-mono text-zinc-400 font-bold block mb-1">#{t}</span>
                      <input
                        type="number"
                        min="0"
                        value={tallasPedido[t] || ''}
                        onChange={(e) =>
                          setTallasPedido((prev) => ({
                            ...prev,
                            [t]: Math.max(0, parseInt(e.target.value, 10) || 0),
                          }))
                        }
                        className="w-full bg-zinc-950 border border-zinc-700 text-center font-mono font-bold text-sm text-zinc-100 rounded-lg py-1.5 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold uppercase transition-colors"
              >
                Registrar Pedido
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm sm:text-base font-mono font-bold text-zinc-200 uppercase border-b border-zinc-800 pb-2.5">
              Pedidos de Clientes Registrados
            </h2>
            {pedidos.length === 0 ? (
              <div className="py-10 text-center text-sm text-zinc-500">No hay pedidos registrados.</div>
            ) : (
              <div className="space-y-3">
                {pedidos.map((p) => (
                  <div
                    key={p.id}
                    className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex items-center justify-between text-xs sm:text-sm"
                  >
                    <div>
                      <span className="font-mono text-emerald-400 font-bold block">{p.folio}</span>
                      <span className="font-bold text-zinc-100 text-sm sm:text-base">{p.cliente}</span>
                      <span className="text-zinc-400 ml-2">Modelo: {p.modelo}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono font-bold text-zinc-200 text-sm sm:text-base">{p.total_pares} pares</span>
                      <button
                        onClick={() => handleEliminarPedido(p.id, p.folio)}
                        className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
