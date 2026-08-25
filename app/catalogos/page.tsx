'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Trash2,
  PlusCircle,
  FolderPlus,
  Edit2,
  Calculator,
  Search,
  Layers,
  Sparkles,
} from 'lucide-react';
import { ProductionStore } from '@/lib/store';
import {
  Maquilero,
  ModeloCalzado,
  InventarioCrudo,
  PedidoCliente,
  FichaTecnicaModeloBOM,
  ItemRecetaBOM,
  UnidadMedidaInsumo,
} from '@/types/database';
import { formatMXN } from '@/lib/utils';
import {
  CLIENTES_PREDEFINIDOS,
  HORMAS_PREDEFINIDAS,
  LINEAS_PREDEFINIDAS,
  MOLDURAS_PREDEFINIDAS,
  TROQUELES_PREDEFINIDOS,
  PIEZAS_CALZADO_PREDEFINIDAS,
} from '@/lib/constants-calzado';

const TALLAS_DESPLEGABLES = [
  { val: 0, label: '0 - General / Rollo / Caja' },
  { val: 22, label: '#22' },
  { val: 22.5, label: '#22.5' },
  { val: 23, label: '#23' },
  { val: 23.5, label: '#23.5' },
  { val: 24, label: '#24' },
  { val: 24.5, label: '#24.5' },
  { val: 25, label: '#25' },
  { val: 25.5, label: '#25.5' },
  { val: 26, label: '#26' },
  { val: 26.5, label: '#26.5' },
  { val: 27, label: '#27' },
];

const PRESETS_CONSUMO = [0.50, 1.00, 2.00, 4.32, 5.40, 6.89, 10.00, 20.00, 30.00];

export default function CatalogosPage() {
  const [activeTab, setActiveTab] = useState<'modelos' | 'recetas' | 'insumos' | 'maquileros' | 'pedidos'>('modelos');

  const [modelos, setModelos] = useState<ModeloCalzado[]>([]);
  const [maquileros, setMaquileros] = useState<Maquilero[]>([]);
  const [inventario, setInventario] = useState<InventarioCrudo[]>([]);
  const [pedidos, setPedidos] = useState<PedidoCliente[]>([]);
  const [fichasTecnicas, setFichasTecnicas] = useState<FichaTecnicaModeloBOM[]>([]);

  // Filtros
  const [busquedaMaterial, setBusquedaMaterial] = useState<string>('');
  const [filtroSeccionMaterial, setFiltroSeccionMaterial] = useState<string>('todos');

  // FORMULARIO MODELOS (CON SELECTS)
  const [modeloEditandoId, setModeloEditandoId] = useState<string | null>(null);
  const [modNombre, setModNombre] = useState<string>('');
  const [modHorma, setModHorma] = useState<string>(HORMAS_PREDEFINIDAS[0]);
  const [modLinea, setModLinea] = useState<string>(LINEAS_PREDEFINIDAS[0]);
  const [modMoldura, setModMoldura] = useState<string>(MOLDURAS_PREDEFINIDAS[0]);
  const [modEstilo, setModEstilo] = useState<string>('');
  const [modDescripcionEstilo, setModDescripcionEstilo] = useState<string>('');
  const [modClienteDefault, setModClienteDefault] = useState<string>(CLIENTES_PREDEFINIDOS[0]);
  const [modTroquel, setModTroquel] = useState<string>(TROQUELES_PREDEFINIDOS[0]);

  // FORMULARIO RECETA BOM (CON SELECTS)
  const [selectedBOMModelo, setSelectedBOMModelo] = useState<string>('HELLEN - 3596');
  const [nuevoItemPieza, setNuevoItemPieza] = useState<string>(PIEZAS_CALZADO_PREDEFINIDAS[0]);
  const [nuevoMaterialNombre, setNuevoMaterialNombre] = useState<string>('');
  const [nuevoMaterialCantidad, setNuevoMaterialCantidad] = useState<string>('1.0');
  const [nuevoMaterialUnidad, setNuevoMaterialUnidad] = useState<UnidadMedidaInsumo>('DCM');
  const [nuevoMaterialConsumoTotalUnidad, setNuevoMaterialConsumoTotalUnidad] = useState<string>('MT');
  const [nuevoItemSeccion, setNuevoItemSeccion] = useState<'corte' | 'troquel' | 'suela_planta_tacon' | 'empaque' | 'general'>('corte');
  const [recetaEnEdicion, setRecetaEnEdicion] = useState<ItemRecetaBOM[]>([]);

  // FORMULARIO INSUMOS ALMACEN (CON SELECTS)
  const [nuevoInsumoNombre, setNuevoInsumoNombre] = useState<string>('');
  const [nuevoInsumoTalla, setNuevoInsumoTalla] = useState<number>(0);
  const [nuevoInsumoCantidad, setNuevoInsumoCantidad] = useState<string>('100');
  const [nuevoInsumoUnidad, setNuevoInsumoUnidad] = useState<string>('MT');
  const [nuevoInsumoSeccion, setNuevoInsumoSeccion] = useState<'corte' | 'troquel' | 'suela_planta_tacon' | 'empaque' | 'general'>('corte');

  // FORMULARIO MAQUILEROS
  const [nuevoMaquileroNombre, setNuevoMaquileroNombre] = useState<string>('');
  const [nuevoMaquileroTarifa, setNuevoMaquileroTarifa] = useState<string>('');

  // FORMULARIO PEDIDOS (CON SELECTS)
  const [nuevoClienteNombre, setNuevoClienteNombre] = useState<string>(CLIENTES_PREDEFINIDOS[0]);
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
    const listInv = ProductionStore.getInventarioCrudo();
    setModelos(listModelos);
    setMaquileros(ProductionStore.getMaquileros());
    setInventario(listInv);
    setPedidos(ProductionStore.getPedidosCliente());

    const fichas = ProductionStore.getFichasTecnicasBOM();
    setFichasTecnicas(fichas);

    if (listModelos.length > 0 && !selectedBOMModelo) {
      setSelectedBOMModelo(listModelos[0].nombre);
    }
    if (listModelos.length > 0 && !nuevoClienteModelo) {
      setNuevoClienteModelo(listModelos[0].nombre);
    }
    if (listInv.length > 0 && !nuevoMaterialNombre) {
      setNuevoMaterialNombre(listInv[0].tipo_material);
    }
    if (listInv.length > 0 && !nuevoInsumoNombre) {
      setNuevoInsumoNombre(listInv[0].tipo_material);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    if (selectedBOMModelo) {
      const ficha = ProductionStore.getFichaTecnicaPorModelo(selectedBOMModelo);
      setRecetaEnEdicion(ficha ? ficha.receta : []);
    }
  }, [selectedBOMModelo]);

  // Autocompletar datos del modelo al cambiar nombre o moldura
  const handleAutoGenerarEstilo = (nombreMod: string, molduraSel: string) => {
    setModNombre(nombreMod);
    if (!modEstilo) {
      setModEstilo(`${molduraSel}-01 ${nombreMod.toUpperCase()} NEGRO (${modClienteDefault})`);
    }
    if (!modDescripcionEstilo) {
      setModDescripcionEstilo(`CALZADO DE LINEA ${nombreMod.toUpperCase()}`);
    }
  };

  // GESTION DE MODELOS
  const handleGuardarModelo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modNombre.trim()) return;

    if (modeloEditandoId) {
      ProductionStore.editarModelo(modeloEditandoId, {
        nombre: modNombre.trim(),
        horma: modHorma,
        linea: modLinea,
        moldura: modMoldura,
        estilo: modEstilo.trim() || `${modMoldura}-01 ${modNombre} (${modClienteDefault})`,
        descripcion_estilo: modDescripcionEstilo.trim() || `CALZADO DE LINEA ${modNombre}`,
        cliente_default: modClienteDefault,
        troquel_especificacion: modTroquel,
      });
      setMensaje(`Modelo "${modNombre}" actualizado con éxito.`);
      setModeloEditandoId(null);
    } else {
      ProductionStore.crearModelo({
        nombre: modNombre.trim(),
        horma: modHorma,
        linea: modLinea,
        moldura: modMoldura,
        estilo: modEstilo.trim() || `${modMoldura}-01 ${modNombre} (${modClienteDefault})`,
        descripcion_estilo: modDescripcionEstilo.trim() || `CALZADO DE LINEA ${modNombre}`,
        cliente_default: modClienteDefault,
        troquel_especificacion: modTroquel,
      });
      setMensaje(`Modelo "${modNombre}" registrado correctamente.`);
    }

    setModNombre('');
    setModEstilo('');
    setModDescripcionEstilo('');
    cargarDatos();
    setTimeout(() => setMensaje(null), 3000);
  };

  const handleEditarModeloClick = (m: ModeloCalzado) => {
    setModeloEditandoId(m.id);
    setModNombre(m.nombre);
    setModHorma(m.horma || HORMAS_PREDEFINIDAS[0]);
    setModLinea(m.linea || LINEAS_PREDEFINIDAS[0]);
    setModMoldura(m.moldura || MOLDURAS_PREDEFINIDAS[0]);
    setModEstilo(m.estilo || '');
    setModDescripcionEstilo(m.descripcion_estilo || '');
    setModClienteDefault(m.cliente_default || CLIENTES_PREDEFINIDOS[0]);
    setModTroquel(m.troquel_especificacion || TROQUELES_PREDEFINIDOS[0]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEliminarModelo = (id: string, nombre: string) => {
    if (confirm(`¿Deseas eliminar el modelo "${nombre}"?`)) {
      ProductionStore.eliminarModelo(id);
      cargarDatos();
    }
  };

  // GESTION DE RECETA BOM
  const handleAgregarItemReceta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoMaterialNombre.trim()) return;

    let factor = 1;
    const uPar = nuevoMaterialUnidad.toUpperCase();
    const uTot = nuevoMaterialConsumoTotalUnidad.toUpperCase();

    if (uPar === 'DCM' && uTot === 'MT') {
      factor = 1 / 135;
    } else if (uPar === 'CM' && uTot === 'MT') {
      factor = 1 / 100;
    } else if (uPar === 'PIEZA' && uTot === 'MILLAR') {
      factor = 1 / 1000;
    }

    const nuevoItem: ItemRecetaBOM = {
      id: `r-${Date.now()}`,
      pieza: nuevoItemPieza,
      material_nombre: nuevoMaterialNombre,
      cantidad_por_par: Math.max(0.001, parseFloat(nuevoMaterialCantidad) || 1.0),
      unidad_medida: nuevoMaterialUnidad,
      consumo_total_unidad: nuevoMaterialConsumoTotalUnidad.trim() || nuevoMaterialUnidad,
      factor_conversion: factor,
      seccion: nuevoItemSeccion,
    };

    const actualizada = [...recetaEnEdicion, nuevoItem];
    setRecetaEnEdicion(actualizada);
    ProductionStore.guardarFichaTecnicaBOM(selectedBOMModelo, actualizada);
    setNuevoMaterialCantidad('1.0');
    cargarDatos();
    setMensaje(`Insumo "${nuevoItem.material_nombre}" añadido a la receta de ${selectedBOMModelo}.`);
    setTimeout(() => setMensaje(null), 2500);
  };

  const handleEliminarItemReceta = (itemId: string) => {
    const actualizada = recetaEnEdicion.filter((i) => i.id !== itemId);
    setRecetaEnEdicion(actualizada);
    ProductionStore.guardarFichaTecnicaBOM(selectedBOMModelo, actualizada);
    cargarDatos();
  };

  // GESTION DE INVENTARIO
  const handleCrearInsumo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoInsumoNombre.trim()) return;

    const cantidadNum = parseFloat(nuevoInsumoCantidad) || 0;

    ProductionStore.agregarInsumoInventario(
      nuevoInsumoNombre,
      nuevoInsumoTalla,
      cantidadNum,
      nuevoInsumoUnidad,
      nuevoInsumoSeccion
    );

    setNuevoInsumoCantidad('100');
    cargarDatos();
    setMensaje(`Material "${nuevoInsumoNombre}" registrado en el almacén.`);
    setTimeout(() => setMensaje(null), 2500);
  };

  const handleActualizarStock = (id: string, delta: number) => {
    ProductionStore.actualizarStockInsumo(id, delta);
    cargarDatos();
  };

  const handleEliminarInsumo = (id: string, nombre: string) => {
    if (confirm(`¿Eliminar "${nombre}" del almacén?`)) {
      ProductionStore.eliminarInsumoInventario(id);
      cargarDatos();
    }
  };

  // GESTION DE MAQUILEROS
  const handleCrearMaquilero = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoMaquileroNombre.trim()) return;

    const tarifa = parseFloat(nuevoMaquileroTarifa) || 0;
    ProductionStore.crearMaquilero(nuevoMaquileroNombre, tarifa);
    setNuevoMaquileroNombre('');
    setNuevoMaquileroTarifa('');
    cargarDatos();
    setMensaje('Maquilero registrado.');
    setTimeout(() => setMensaje(null), 2500);
  };

  // GESTION DE PEDIDOS
  const handleCrearPedido = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoClienteNombre || !nuevoClienteModelo) return;

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

    setNuevoClienteNotas('');
    setTallasPedido({ 22.0: 0, 23.0: 0, 24.0: 0, 25.0: 0, 26.0: 0 });
    cargarDatos();
    setMensaje(`Pedido de ${nuevoClienteNombre} por ${totalPares} pares registrado.`);
    setTimeout(() => setMensaje(null), 2500);
  };

  const handleEliminarPedido = (id: string, folio: string) => {
    if (confirm(`¿Eliminar el pedido ${folio}?`)) {
      ProductionStore.eliminarPedidoCliente(id);
      cargarDatos();
    }
  };

  // Filtros de inventario
  const inventarioFiltrado = inventario.filter((inv) => {
    const coincideTexto = inv.tipo_material.toLowerCase().includes(busquedaMaterial.toLowerCase());
    const coincideSeccion =
      filtroSeccionMaterial === 'todos' ||
      (inv.seccion && inv.seccion === filtroSeccionMaterial) ||
      (!inv.seccion && filtroSeccionMaterial === 'general');
    return coincideTexto && coincideSeccion;
  });

  const modeloSeleccionadoObj = modelos.find(
    (m) => m.nombre.toLowerCase() === selectedBOMModelo.toLowerCase()
  );

  // Lista única de nombres de materiales en almacén para desplegables
  const materialesUnicos = Array.from(new Set(inventario.map((i) => i.tipo_material)));

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase flex items-center gap-2">
            <FolderPlus className="w-7 h-7 text-blue-700 dark:text-blue-500" />
            <span>6. Modelos y Almacen de Materiales</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 mt-0.5">
            Configuración rápida con listas desplegables para evitar errores de captura.
          </p>
        </div>

        {/* PESTAÑAS */}
        <div className="flex items-center bg-slate-100 dark:bg-zinc-900 p-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('modelos')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'modelos'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            Modelos ({modelos.length})
          </button>
          <button
            onClick={() => setActiveTab('recetas')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'recetas'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            Recetas de Materiales ({fichasTecnicas.length})
          </button>
          <button
            onClick={() => setActiveTab('insumos')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'insumos'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            Almacen de Materiales ({inventario.length})
          </button>
          <button
            onClick={() => setActiveTab('maquileros')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'maquileros'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            Maquileros ({maquileros.length})
          </button>
          <button
            onClick={() => setActiveTab('pedidos')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'pedidos'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            Pedidos ({pedidos.length})
          </button>
        </div>
      </div>

      {mensaje && (
        <div className="bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 p-3 rounded-2xl text-center text-xs sm:text-sm font-semibold flex items-center justify-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-blue-700 dark:text-blue-400 shrink-0" />
          <span>{mensaje}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 1: MODELOS (CON MENÚS DESPLEGABLES)                  */}
      {/* ======================================================== */}
      {activeTab === 'modelos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* FORMULARIO DE MODELO 100% DESPLEGABLE */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-2.5">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                <span>{modeloEditandoId ? 'Editar Modelo' : 'Nuevo Modelo de Calzado'}</span>
              </h2>
              {modeloEditandoId && (
                <button
                  type="button"
                  onClick={() => {
                    setModeloEditandoId(null);
                    setModNombre('');
                    setModEstilo('');
                    setModDescripcionEstilo('');
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200 font-bold"
                >
                  Cancelar
                </button>
              )}
            </div>

            <form onSubmit={handleGuardarModelo} className="space-y-3">
              <div>
                <label className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400 uppercase block mb-1">
                  1. Nombre / Clave del Modelo *
                </label>
                <input
                  type="text"
                  placeholder="Ej. HELLEN - 3596, Frozen, Carol..."
                  value={modNombre}
                  onChange={(e) => handleAutoGenerarEstilo(e.target.value, modMoldura)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 focus:border-blue-600 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-sm font-bold focus:outline-none"
                  required
                />
              </div>

              {/* HORMA / LINEA / MOLDURA CON DESPLEGABLES */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-mono font-bold text-slate-600 dark:text-zinc-400 uppercase block mb-1">
                    Horma (Desplegable)
                  </label>
                  <select
                    value={modHorma}
                    onChange={(e) => setModHorma(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-lg px-2 py-1.5 text-xs font-bold focus:outline-none"
                  >
                    {HORMAS_PREDEFINIDAS.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono font-bold text-slate-600 dark:text-zinc-400 uppercase block mb-1">
                    Linea (Desplegable)
                  </label>
                  <select
                    value={modLinea}
                    onChange={(e) => setModLinea(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-lg px-2 py-1.5 text-xs font-bold focus:outline-none"
                  >
                    {LINEAS_PREDEFINIDAS.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono font-bold text-slate-600 dark:text-zinc-400 uppercase block mb-1">
                    Moldura
                  </label>
                  <select
                    value={modMoldura}
                    onChange={(e) => {
                      setModMoldura(e.target.value);
                      handleAutoGenerarEstilo(modNombre, e.target.value);
                    }}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-lg px-2 py-1.5 text-xs font-bold focus:outline-none"
                  >
                    {MOLDURAS_PREDEFINIDAS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* CLIENTE DESPLEGABLE */}
              <div>
                <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 uppercase block mb-1">
                  Cliente Predeterminado (Desplegable)
                </label>
                <select
                  value={modClienteDefault}
                  onChange={(e) => setModClienteDefault(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                >
                  {CLIENTES_PREDEFINIDOS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* TROQUEL DESPLEGABLE */}
              <div>
                <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 uppercase block mb-1">
                  Especificacion Troquel NOM 20 (Desplegable)
                </label>
                <select
                  value={modTroquel}
                  onChange={(e) => setModTroquel(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs font-medium focus:outline-none"
                >
                  {TROQUELES_PREDEFINIDOS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 uppercase block mb-1">
                  Descripcion del Estilo
                </label>
                <input
                  type="text"
                  placeholder="Ej. ZAPATILLA DESTALONADA CON MOÑO"
                  value={modDescripcionEstilo}
                  onChange={(e) => setModDescripcionEstilo(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-bold uppercase transition-colors shadow"
              >
                {modeloEditandoId ? 'Actualizar Modelo' : 'Guardar Modelo'}
              </button>
            </form>
          </div>

          {/* LISTA DE MODELOS REGISTRADOS */}
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-2.5">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase">
                  Modelos de Calzado Registrados
                </h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Configuración completa para tarjeta viajera y explosión de materiales.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {modelos.map((m) => (
                <div
                  key={m.id}
                  className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 hover:border-blue-400 dark:hover:border-blue-600 rounded-xl p-4 space-y-2.5 transition-all shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-base text-slate-900 dark:text-white block">
                        {m.nombre}
                      </span>
                      <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                        {m.moldura ? `Moldura: ${m.moldura}` : 'Calzado'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-zinc-400 space-y-0.5 pt-1 font-mono">
                      {m.horma && <div><span className="font-bold text-slate-700 dark:text-zinc-300">Horma:</span> {m.horma} | <span className="font-bold text-slate-700 dark:text-zinc-300">Linea:</span> {m.linea || '-'}</div>}
                      {m.descripcion_estilo && <div className="text-slate-800 dark:text-zinc-200 font-sans font-semibold">{m.descripcion_estilo}</div>}
                      {m.cliente_default && <div><span className="font-bold text-slate-700 dark:text-zinc-300">Cliente:</span> {m.cliente_default}</div>}
                      {m.troquel_especificacion && <div className="text-[11px] text-slate-500 truncate">{m.troquel_especificacion}</div>}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-1 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedBOMModelo(m.nombre);
                          setActiveTab('recetas');
                        }}
                        className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-400 rounded-lg text-xs font-bold flex items-center gap-1 border border-blue-200 dark:border-blue-800"
                        title="Ver y editar receta de materiales"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Ver Receta</span>
                      </button>

                      <Link
                        href="/explosion-materiales"
                        className="px-2 py-1 bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 text-slate-800 dark:text-zinc-200 rounded-lg text-xs font-bold flex items-center gap-1"
                        title="Calcular tarjeta"
                      >
                        <Calculator className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditarModeloClick(m)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 transition-colors"
                        title="Editar modelo"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleEliminarModelo(m.id, m.nombre)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Eliminar modelo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: RECETA BOM (100% DESPLEGABLES)                    */}
      {/* ======================================================== */}
      {activeTab === 'recetas' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* FORMULARIO AGREGAR INSUMO CON DESPLEGABLES */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="border-b border-slate-200 dark:border-zinc-800 pb-2.5">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                <span>Anadir Insumo a la Receta</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                Selecciona la pieza y el material sin escribir a mano.
              </p>
            </div>

            <form onSubmit={handleAgregarItemReceta} className="space-y-3">
              {/* MODELO DESPLEGABLE */}
              <div>
                <label className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400 uppercase block mb-1">
                  1. Modelo de Calzado (Desplegable)
                </label>
                <select
                  value={selectedBOMModelo}
                  onChange={(e) => setSelectedBOMModelo(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-sm font-bold focus:border-blue-600 focus:outline-none shadow-sm"
                >
                  {modelos.map((m) => (
                    <option key={m.id} value={m.nombre}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* PIEZA DESPLEGABLE */}
              <div>
                <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 uppercase block mb-1">
                  2. Pieza / Componente (Desplegable)
                </label>
                <select
                  value={nuevoItemPieza}
                  onChange={(e) => setNuevoItemPieza(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                >
                  {PIEZAS_CALZADO_PREDEFINIDAS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* MATERIAL DESPLEGABLE DE INVENTARIO */}
              <div>
                <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 uppercase block mb-1">
                  3. Material / Insumo de Almacen (Desplegable)
                </label>
                <select
                  value={nuevoMaterialNombre}
                  onChange={(e) => setNuevoMaterialNombre(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                  required
                >
                  {materialesUnicos.map((mat, i) => (
                    <option key={i} value={mat}>{mat}</option>
                  ))}
                </select>
              </div>

              {/* CONSUMO X PAR (PRESETS O NÚMERO) */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 uppercase block mb-1">
                    C x P (Consumo)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={nuevoMaterialCantidad}
                    onChange={(e) => setNuevoMaterialCantidad(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-sm font-mono font-bold focus:outline-none"
                    required
                  />
                  <div className="flex flex-wrap gap-1 mt-1">
                    {PRESETS_CONSUMO.slice(0, 4).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNuevoMaterialCantidad(String(p))}
                        className="text-[10px] px-1 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 font-mono"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 uppercase block mb-1">
                    Uni. Par
                  </label>
                  <select
                    value={nuevoMaterialUnidad}
                    onChange={(e) => setNuevoMaterialUnidad(e.target.value as UnidadMedidaInsumo)}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                  >
                    <option value="DCM">DCM (Decimetros)</option>
                    <option value="CM">CM (Centimetros)</option>
                    <option value="PIEZA">PIEZA</option>
                    <option value="PAR">PAR</option>
                    <option value="pares">pares</option>
                    <option value="litros">litros</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 uppercase block mb-1">
                    Uni. Total (Almacen)
                  </label>
                  <select
                    value={nuevoMaterialConsumoTotalUnidad}
                    onChange={(e) => setNuevoMaterialConsumoTotalUnidad(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                  >
                    <option value="MT">MT (Metros)</option>
                    <option value="MILLAR">MILLAR</option>
                    <option value="PIEZA">PIEZA</option>
                    <option value="PAR">PAR</option>
                    <option value="KG">KG</option>
                    <option value="LITROS">LITROS</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 uppercase block mb-1">
                    Seccion Tarjeta
                  </label>
                  <select
                    value={nuevoItemSeccion}
                    onChange={(e) => setNuevoItemSeccion(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs font-medium focus:outline-none"
                  >
                    <option value="corte">Corte y Forros</option>
                    <option value="suela_planta_tacon">Suela / Planta / Tacon</option>
                    <option value="empaque">Empaque y Cajas</option>
                    <option value="troquel">Troquel / Grabado</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-bold uppercase transition-colors shadow"
              >
                Guardar en la Receta
              </button>
            </form>
          </div>

          {/* TABLA DE RECETA EXACTA DEL MODELO */}
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3 flex-wrap gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase flex items-center gap-2">
                  <span>Receta del Modelo:</span>
                  <span className="text-blue-700 dark:text-blue-400">&quot;{selectedBOMModelo}&quot;</span>
                </h2>
                {modeloSeleccionadoObj && (
                  <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono mt-0.5">
                    Horma: {modeloSeleccionadoObj.horma || '-'} | Linea: {modeloSeleccionadoObj.linea || '-'} | Moldura: {modeloSeleccionadoObj.moldura || '-'}
                  </p>
                )}
              </div>

              <Link
                href="/explosion-materiales"
                className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Generar Tarjeta de Este Modelo</span>
              </Link>
            </div>

            {recetaEnEdicion.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-500">
                Este modelo aun no tiene insumos en su receta. Agrega el primero a la izquierda.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm text-left border border-slate-200 dark:border-zinc-800">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-zinc-950 text-slate-700 dark:text-zinc-300 font-mono border-b border-slate-200 dark:border-zinc-800 uppercase text-[11px]">
                      <th className="py-2.5 px-3 font-bold">Pieza</th>
                      <th className="py-2.5 px-3 font-bold">Material / Insumo</th>
                      <th className="py-2.5 px-3 font-bold text-right">C x P</th>
                      <th className="py-2.5 px-2 font-bold text-center">Uni.</th>
                      <th className="py-2.5 px-2 font-bold text-center">Uni. Total</th>
                      <th className="py-2.5 px-3 font-bold text-center">Seccion</th>
                      <th className="py-2.5 px-3 font-bold text-right">Accion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
                    {recetaEnEdicion.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40">
                        <td className="py-2 px-3 font-bold text-slate-900 dark:text-zinc-100 uppercase font-sans">
                          {item.pieza || '-'}
                        </td>
                        <td className="py-2 px-3 font-semibold text-slate-800 dark:text-zinc-200 truncate max-w-[200px]">
                          {item.material_nombre}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-blue-700 dark:text-blue-400">
                          {item.cantidad_por_par.toFixed(2)}
                        </td>
                        <td className="py-2 px-2 text-center font-mono text-[11px] text-slate-500 dark:text-zinc-400">
                          {item.unidad_medida}
                        </td>
                        <td className="py-2 px-2 text-center font-mono font-bold text-[11px] text-slate-800 dark:text-zinc-300">
                          {item.consumo_total_unidad || item.unidad_medida}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                            {item.seccion || 'corte'}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <button
                            onClick={() => handleEliminarItemReceta(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Eliminar insumo de la receta"
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
      )}

      {/* ======================================================== */}
      {/* TAB 3: ALMACEN DE MATERIALES (CON SELECTS Y AJUSTES)     */}
      {/* ======================================================== */}
      {activeTab === 'insumos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* FORMULARIO AGREGAR MATERIAL */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4 shadow-sm">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pb-2.5">
              <PlusCircle className="w-4 h-4 text-blue-700 dark:text-blue-400" />
              <span>Ingresar Material al Almacen</span>
            </h2>

            <form onSubmit={handleCrearInsumo} className="space-y-3.5">
              <div>
                <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 uppercase block mb-1">
                  1. Seleccionar o Escribir Material
                </label>
                <select
                  value={nuevoInsumoNombre}
                  onChange={(e) => setNuevoInsumoNombre(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs font-bold focus:border-blue-600 focus:outline-none mb-1.5"
                >
                  {materialesUnicos.map((mat, i) => (
                    <option key={i} value={mat}>{mat}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="O escribe otro nombre de material..."
                  value={nuevoInsumoNombre}
                  onChange={(e) => setNuevoInsumoNombre(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 uppercase block mb-1">
                    Cantidad a Ingresar
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={nuevoInsumoCantidad}
                    onChange={(e) => setNuevoInsumoCantidad(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-sm font-mono font-bold focus:outline-none"
                    required
                  />
                  <div className="flex gap-1 mt-1">
                    {[10, 50, 100, 500].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setNuevoInsumoCantidad(String(c))}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 font-mono"
                      >
                        +{c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 uppercase block mb-1">
                    Unidad (Desplegable)
                  </label>
                  <select
                    value={nuevoInsumoUnidad}
                    onChange={(e) => setNuevoInsumoUnidad(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                  >
                    <option value="MT">MT (Metros)</option>
                    <option value="PAR">PAR</option>
                    <option value="PIEZA">PIEZA</option>
                    <option value="MILLAR">MILLAR</option>
                    <option value="DCM">DCM</option>
                    <option value="KG">KG</option>
                    <option value="LITROS">LITROS</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 uppercase block mb-1">
                    Talla (Desplegable)
                  </label>
                  <select
                    value={nuevoInsumoTalla}
                    onChange={(e) => setNuevoInsumoTalla(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-2.5 py-2 text-xs font-semibold focus:outline-none"
                  >
                    {TALLAS_DESPLEGABLES.map((t) => (
                      <option key={t.val} value={t.val}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 uppercase block mb-1">
                    Seccion (Desplegable)
                  </label>
                  <select
                    value={nuevoInsumoSeccion}
                    onChange={(e) => setNuevoInsumoSeccion(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs font-medium focus:outline-none"
                  >
                    <option value="corte">Corte y Forros</option>
                    <option value="suela_planta_tacon">Suela/Planta/Tacon</option>
                    <option value="empaque">Empaque y Cajas</option>
                    <option value="troquel">Troquel</option>
                    <option value="general">General / Quimicos</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-bold uppercase transition-colors shadow"
              >
                Agregar a Stock
              </button>
            </form>
          </div>

          {/* LISTA DE MATERIALES EN STOCK */}
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3 flex-wrap gap-2">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase">
                  Inventario de Materiales en Almacen
                </h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Existencias disponibles para alimentar las recetas y lotes.
                </p>
              </div>

              {/* BUSCADOR Y FILTRO DE SECCION */}
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={filtroSeccionMaterial}
                  onChange={(e) => setFiltroSeccionMaterial(e.target.value)}
                  className="bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="todos">Todas las Secciones</option>
                  <option value="corte">Corte y Forros</option>
                  <option value="suela_planta_tacon">Suelas / Plantas</option>
                  <option value="empaque">Empaque y Cajas</option>
                  <option value="general">General</option>
                </select>

                <div className="relative w-40 sm:w-48">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar material..."
                    value={busquedaMaterial}
                    onChange={(e) => setBusquedaMaterial(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-lg pl-8 pr-2.5 py-1.5 text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 font-mono text-xs uppercase">
                    <th className="py-2.5 px-3">Material</th>
                    <th className="py-2.5 px-2 text-center">Talla</th>
                    <th className="py-2.5 px-2 text-center">Seccion</th>
                    <th className="py-2.5 px-3 text-right">Stock Actual</th>
                    <th className="py-2.5 px-3 text-right">Ajuste Rapido</th>
                    <th className="py-2.5 px-2 text-right">Accion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
                  {inventarioFiltrado.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40">
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                        {inv.tipo_material}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono text-slate-500 dark:text-zinc-400 font-semibold">
                        {inv.talla && inv.talla > 0 ? `#${inv.talla}` : '-'}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300">
                          {inv.seccion || 'general'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-black text-blue-700 dark:text-blue-400 text-sm">
                        {inv.cantidad_total} {inv.unidad_medida || 'unidades'}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1 font-mono text-xs">
                          <button
                            onClick={() => handleActualizarStock(inv.id, -10)}
                            className="px-1.5 py-0.5 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 rounded font-bold"
                            title="Restar 10"
                          >
                            -10
                          </button>
                          <button
                            onClick={() => handleActualizarStock(inv.id, 10)}
                            className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 hover:bg-blue-100 rounded font-bold"
                            title="Sumar 10"
                          >
                            +10
                          </button>
                          <button
                            onClick={() => handleActualizarStock(inv.id, 50)}
                            className="px-1.5 py-0.5 bg-blue-600 text-white rounded font-bold"
                            title="Sumar 50"
                          >
                            +50
                          </button>
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-right">
                        <button
                          onClick={() => handleEliminarInsumo(inv.id, inv.tipo_material)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Eliminar insumo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: MAQUILEROS                                        */}
      {/* ======================================================== */}
      {activeTab === 'maquileros' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4 shadow-sm">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pb-2.5">
              <PlusCircle className="w-4 h-4 text-blue-700 dark:text-blue-400" /> Nuevo Maquilero
            </h2>
            <form onSubmit={handleCrearMaquilero} className="space-y-4">
              <div>
                <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 uppercase block mb-1.5">
                  Nombre del Taller / Maquilero
                </label>
                <input
                  type="text"
                  placeholder="Ej. Don Beto - Forrado"
                  value={nuevoMaquileroNombre}
                  onChange={(e) => setNuevoMaquileroNombre(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 focus:border-blue-600 text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 uppercase block mb-1.5">
                  Tarifa por Par ($ MXN)
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="14.50"
                  value={nuevoMaquileroTarifa}
                  onChange={(e) => setNuevoMaquileroTarifa(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 focus:border-blue-600 text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-bold uppercase transition-colors shadow"
              >
                Guardar Maquilero
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4 shadow-sm">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase border-b border-slate-200 dark:border-zinc-800 pb-2.5">
              Directorio de Maquileros
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 font-mono text-xs uppercase">
                    <th className="py-3 px-3 font-semibold">Nombre</th>
                    <th className="py-3 px-3 font-semibold text-right">Tarifa / Par</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
                  {maquileros.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40">
                      <td className="py-3 px-3 text-slate-900 dark:text-white font-bold">{m.nombre}</td>
                      <td className="py-3 px-3 text-right font-mono font-extrabold text-blue-700 dark:text-blue-400 text-sm sm:text-base">
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

      {/* ======================================================== */}
      {/* TAB 5: PEDIDOS DE CLIENTES (CON SELECTS)                 */}
      {/* ======================================================== */}
      {activeTab === 'pedidos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4 shadow-sm">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pb-2.5">
              <PlusCircle className="w-4 h-4 text-blue-700 dark:text-blue-400" /> Registrar Pedido de Cliente
            </h2>
            <form onSubmit={handleCrearPedido} className="space-y-4">
              <div>
                <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 uppercase block mb-1.5">
                  Nombre Cliente / Marca (Desplegable)
                </label>
                <select
                  value={nuevoClienteNombre}
                  onChange={(e) => setNuevoClienteNombre(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 focus:border-blue-600 text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 text-sm font-bold focus:outline-none"
                >
                  {CLIENTES_PREDEFINIDOS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 uppercase block mb-1.5">
                  Modelo de Calzado (Desplegable)
                </label>
                <select
                  value={nuevoClienteModelo}
                  onChange={(e) => setNuevoClienteModelo(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 focus:border-blue-600 text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:outline-none"
                >
                  {modelos.map((m) => (
                    <option key={m.id} value={m.nombre}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 uppercase block mb-1.5">
                  Pares por Talla (22 al 26)
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[22, 23, 24, 25, 26].map((t) => (
                    <div key={t} className="text-center">
                      <span className="text-xs font-mono text-slate-500 dark:text-zinc-400 font-bold block mb-1">#{t}</span>
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
                        className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-center font-mono font-bold text-sm text-slate-900 dark:text-white rounded-lg py-1.5 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-bold uppercase transition-colors shadow"
              >
                Registrar Pedido
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4 shadow-sm">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase border-b border-slate-200 dark:border-zinc-800 pb-2.5">
              Pedidos Registrados
            </h2>
            {pedidos.length === 0 ? (
              <div className="py-10 text-center text-sm text-slate-500">No hay pedidos registrados.</div>
            ) : (
              <div className="space-y-3">
                {pedidos.map((p) => (
                  <div
                    key={p.id}
                    className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 flex items-center justify-between text-xs sm:text-sm"
                  >
                    <div>
                      <span className="font-mono text-blue-700 dark:text-blue-400 font-bold block">{p.folio}</span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">{p.cliente}</span>
                      <span className="text-slate-500 dark:text-zinc-400 ml-2">Modelo: {p.modelo}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono font-bold text-slate-900 dark:text-white text-sm sm:text-base">{p.total_pares} pares</span>
                      <button
                        onClick={() => handleEliminarPedido(p.id, p.folio)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Eliminar pedido"
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
