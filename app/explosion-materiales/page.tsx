'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Calculator,
  CheckCircle2,
  AlertTriangle,
  Box,
  MinusCircle,
  FolderPlus,
  FileText,
  Sliders,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { ProductionStore } from '@/lib/store';
import {
  ModeloCalzado,
  FichaTecnicaModeloBOM,
  ResultadoExplosionMateriales,
  LoteProduccion,
  PedidoCliente,
  TarjetaProduccionData,
} from '@/types/database';
import TarjetaProduccion from '@/components/TarjetaProduccion';
import {
  CLIENTES_PREDEFINIDOS,
  PROGRAMAS_PREDEFINIDOS,
  FECHAS_ENTREGA_PREDEFINIDAS,
  LOTES_FOLIOS_PREDEFINIDOS,
  CORRIDAS_PRESET,
} from '@/lib/constants-calzado';

const TALLAS_DISPONIBLES = [
  '22',
  '22.5',
  '23',
  '23.5',
  '24',
  '24.5',
  '25',
  '25.5',
  '26',
  '26.5',
  '27',
];

const OPCIONES_CANTIDAD_TALLA = [0, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 30, 40, 50];

export default function ExplosionMaterialesPage() {
  const [modelos, setModelos] = useState<ModeloCalzado[]>([]);
  const [lotesWip, setLotesWip] = useState<LoteProduccion[]>([]);
  const [pedidosClientes, setPedidosClientes] = useState<PedidoCliente[]>([]);

  // Pestaña activa
  const [activeTab, setActiveTab] = useState<'tarjeta' | 'mrp'>('tarjeta');

  // CAMPOS DE LA TARJETA VINCULADOS
  const [selectedModeloNombre, setSelectedModeloNombre] = useState<string>('HELLEN - 3596');
  const [loteFolio, setLoteFolio] = useState<string>('1568');
  const [programaNum, setProgramaNum] = useState<string>('260228');
  const [fechaEntrega, setFechaEntrega] = useState<string>('Miercoles 29-Jul-2026');
  const [cliente, setCliente] = useState<string>('ADRIANA BOCANEGRA');
  const [horma, setHorma] = useState<string>('HELLEN');
  const [linea, setLinea] = useState<string>('HELLEN - 3596');
  const [moldura, setMoldura] = useState<string>('3596');
  const [estilo, setEstilo] = useState<string>('3596-02 CHAROL NEGRO ADRIANA BOCANEGRA (NEGRO)');
  const [descripcionEstilo, setDescripcionEstilo] = useState<string>('ZAPATILLA DESTALONADA CON MOÑO');
  const [troquel, setTroquel] = useState<string>('NOM 20 / TROQUEL: SINTETICO / SINTETICO PLATA / BOCASSAO PLATA');
  const [renglon, setRenglon] = useState<string>('1 de 1');

  // Desglose de corrida de tallas
  const [tallasCorrida, setTallasCorrida] = useState<{ [talla: string]: number }>({
    '22': 0,
    '22.5': 0,
    '23': 4,
    '23.5': 4,
    '24': 8,
    '24.5': 8,
    '25': 8,
    '25.5': 8,
    '26': 8,
    '26.5': 0,
    '27': 0,
  });

  const [panelConfigAbierto, setPanelConfigAbierto] = useState<boolean>(true);
  const [fichaActual, setFichaActual] = useState<FichaTecnicaModeloBOM | undefined>(undefined);
  const [resultados, setResultados] = useState<ResultadoExplosionMateriales[]>([]);

  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [errorMensaje, setErrorMensaje] = useState<string | null>(null);

  // Calcular total de pares a partir de la corrida
  const totalParesCalculado = useMemo(() => {
    return Object.values(tallasCorrida).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
  }, [tallasCorrida]);

  const cargarDatos = () => {
    const listMod = ProductionStore.getModelos();
    setModelos(listMod);
    setLotesWip(ProductionStore.getLotesProduccion());
    setPedidosClientes(ProductionStore.getPedidosCliente());

    if (listMod.length > 0 && !selectedModeloNombre) {
      setSelectedModeloNombre(listMod[0].nombre);
      sincronizarMetadatosModelo(listMod[0].nombre, listMod);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const sincronizarMetadatosModelo = (nombre: string, lista = modelos) => {
    const mod = lista.find((m) => m.nombre.toLowerCase() === nombre.toLowerCase());
    if (mod) {
      setHorma(mod.horma || mod.nombre);
      setLinea(mod.linea || `${mod.nombre} - ${mod.moldura || 'STD'}`);
      setMoldura(mod.moldura || 'STD');
      setEstilo(mod.estilo || mod.nombre);
      setDescripcionEstilo(mod.descripcion_estilo || 'CALZADO DE LINEA');
      if (mod.cliente_default) setCliente(mod.cliente_default);
      if (mod.troquel_especificacion) setTroquel(mod.troquel_especificacion);
    }
  };

  const handleModeloChange = (nombre: string) => {
    setSelectedModeloNombre(nombre);
    sincronizarMetadatosModelo(nombre);
  };

  const handleCargarLoteWip = (loteId: string) => {
    const lote = lotesWip.find((l) => l.id === loteId);
    if (!lote) return;

    setSelectedModeloNombre(lote.modelo);
    setLoteFolio(lote.folio.replace('LOT-', '').replace('2026-', ''));
    if (lote.fecha_inicio) setFechaEntrega(lote.fecha_inicio);

    const newCorrida: { [talla: string]: number } = {};
    TALLAS_DISPONIBLES.forEach((t) => (newCorrida[t] = 0));
    lote.desglose_tallas.forEach((dt) => {
      const key = String(dt.talla);
      newCorrida[key] = dt.pares;
    });
    setTallasCorrida(newCorrida);

    sincronizarMetadatosModelo(lote.modelo);
    setMensajeExito(`Lote ${lote.folio} (${lote.total_pares} pares) cargado con exito.`);
    setTimeout(() => setMensajeExito(null), 3000);
  };

  const handleCargarPedidoCliente = (pedidoId: string) => {
    const ped = pedidosClientes.find((p) => p.id === pedidoId);
    if (!ped) return;

    setSelectedModeloNombre(ped.modelo);
    setCliente(ped.cliente);
    setLoteFolio(ped.folio.replace('PED-', ''));

    const newCorrida: { [talla: string]: number } = {};
    TALLAS_DISPONIBLES.forEach((t) => (newCorrida[t] = 0));
    ped.desglose_tallas.forEach((dt) => {
      const key = String(dt.talla);
      newCorrida[key] = dt.pares_solicitados;
    });
    setTallasCorrida(newCorrida);

    sincronizarMetadatosModelo(ped.modelo);
    setMensajeExito(`Pedido ${ped.folio} (${ped.cliente}) cargado con exito.`);
    setTimeout(() => setMensajeExito(null), 3000);
  };

  const aplicarCorridaPreset = (presetKey: keyof typeof CORRIDAS_PRESET) => {
    const preset = CORRIDAS_PRESET[presetKey];
    if (preset) {
      setTallasCorrida({ ...preset.tallas });
      setMensajeExito(`Distribucion de corrida "${preset.nombre}" aplicada.`);
      setTimeout(() => setMensajeExito(null), 2500);
    }
  };

  const limpiarCorrida = () => {
    const vacia: { [t: string]: number } = {};
    TALLAS_DISPONIBLES.forEach((t) => (vacia[t] = 0));
    setTallasCorrida(vacia);
  };

  useEffect(() => {
    if (selectedModeloNombre && totalParesCalculado > 0) {
      const ficha = ProductionStore.getFichaTecnicaPorModelo(selectedModeloNombre);
      const res = ProductionStore.calcularExplosionMateriales(
        selectedModeloNombre,
        totalParesCalculado
      );
      setFichaActual(ficha);
      setResultados(res);
    } else {
      setResultados([]);
    }
  }, [selectedModeloNombre, totalParesCalculado]);

  const handleAplicarDescuento = () => {
    if (resultados.length === 0) {
      setErrorMensaje('No hay materiales para descontar.');
      return;
    }

    const tieneFaltantes = resultados.some((r) => !r.suficiente);
    if (tieneFaltantes) {
      const confirmar = confirm(
        'Atencion: Existen insumos con stock insuficiente. Deseas aplicar el descuento de todos modos?'
      );
      if (!confirmar) return;
    }

    const desgloseParaDescuento = Object.entries(tallasCorrida)
      .filter(([_, pares]) => pares > 0)
      .map(([talla, pares]) => ({
        talla: parseFloat(talla),
        pares,
      }));

    const exito = ProductionStore.descontarStockPorExplosion(
      selectedModeloNombre,
      totalParesCalculado,
      desgloseParaDescuento
    );

    if (exito.exito) {
      setMensajeExito(
        `Descuento de materiales aplicado con exito para ${totalParesCalculado} pares de ${selectedModeloNombre}.`
      );
      cargarDatos();
      const res = ProductionStore.calcularExplosionMateriales(
        selectedModeloNombre,
        totalParesCalculado
      );
      setResultados(res);
      setTimeout(() => setMensajeExito(null), 3500);
    }
  };

  const tarjetaData: TarjetaProduccionData = useMemo(() => {
    const desgloseFiltrado = TALLAS_DISPONIBLES.filter(
      (t) => (tallasCorrida[t] || 0) > 0 || ['23', '23.5', '24', '24.5', '25', '25.5', '26'].includes(t)
    ).map((t) => ({
      talla: t,
      pares: tallasCorrida[t] || 0,
    }));

    return {
      lote: loteFolio,
      programa: programaNum,
      fecha_entrega: fechaEntrega,
      horma,
      linea,
      moldura,
      cliente,
      estilo,
      descripcion_estilo: descripcionEstilo,
      renglon,
      desglose_tallas: desgloseFiltrado,
      total_pares: totalParesCalculado,
      materiales: resultados,
      troquel_especificacion: troquel,
    };
  }, [
    loteFolio,
    programaNum,
    fechaEntrega,
    horma,
    linea,
    moldura,
    cliente,
    estilo,
    descripcionEstilo,
    renglon,
    tallasCorrida,
    totalParesCalculado,
    resultados,
    troquel,
  ]);

  const countSuficientes = resultados.filter((r) => r.suficiente).length;
  const countFaltantes = resultados.filter((r) => !r.suficiente).length;

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200 dark:border-zinc-800 print:hidden">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase flex items-center gap-2">
            <Calculator className="w-7 h-7 text-blue-700 dark:text-blue-500" />
            <span>5. Calcular Materiales y Tarjeta</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 mt-0.5">
            Generador de tarjeta viajera de taller y calculadora de consumos de calzado.
          </p>
        </div>

        {/* PESTANAS Y ACCIONES */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-100 dark:bg-zinc-900 p-1.5 rounded-xl border border-slate-200 dark:border-zinc-800">
            <button
              onClick={() => setActiveTab('tarjeta')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'tarjeta'
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Ver Tarjeta de Taller</span>
            </button>
            <button
              onClick={() => setActiveTab('mrp')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'mrp'
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
              }`}
            >
              <Box className="w-4 h-4" />
              <span>Inventario de Materiales</span>
            </button>
          </div>

          <Link
            href="/catalogos"
            className="px-3.5 py-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 border border-slate-300 dark:border-zinc-700 transition-colors"
          >
            <FolderPlus className="w-4 h-4 text-blue-700 dark:text-blue-400" />
            <span>Editar Recetas</span>
          </Link>
        </div>
      </div>

      {mensajeExito && (
        <div className="bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 rounded-2xl p-4 text-center font-semibold text-sm sm:text-base shadow-sm flex items-center justify-center gap-3 print:hidden">
          <CheckCircle2 className="w-5 h-5 text-blue-700 dark:text-blue-400 shrink-0" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {errorMensaje && (
        <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 rounded-2xl p-4 text-center font-semibold text-sm sm:text-base flex items-center justify-center gap-3 print:hidden">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{errorMensaje}</span>
        </div>
      )}

      {/* PANEL DE CONFIGURACION 100% DESPLEGABLE (SIN INGRESO MANUAL PROPENSO A ERRORES) */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4 shadow-sm print:hidden">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-700 dark:text-blue-400" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase">
              Seleccionar Orden y Tallas (Datos Predefinidos)
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {lotesWip.length > 0 && (
              <select
                onChange={(e) => {
                  if (e.target.value) handleCargarLoteWip(e.target.value);
                }}
                defaultValue=""
                className="bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 font-semibold text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value="">Cargar Lote de Planta...</option>
                {lotesWip.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.folio} ({l.modelo} - {l.total_pares}p)
                  </option>
                ))}
              </select>
            )}

            {pedidosClientes.length > 0 && (
              <select
                onChange={(e) => {
                  if (e.target.value) handleCargarPedidoCliente(e.target.value);
                }}
                defaultValue=""
                className="bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value="">Cargar Pedido Cliente...</option>
                {pedidosClientes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.folio} - {p.cliente} ({p.total_pares}p)
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={() => setPanelConfigAbierto(!panelConfigAbierto)}
              className="text-xs font-bold text-slate-600 dark:text-zinc-300 px-2 py-1 bg-slate-100 dark:bg-zinc-800 rounded-md border border-slate-200 dark:border-zinc-700"
            >
              {panelConfigAbierto ? 'Ocultar Opciones' : 'Mostrar Opciones'}
            </button>
          </div>
        </div>

        {panelConfigAbierto && (
          <div className="space-y-4">
            {/* FILA 1: DESPLEGABLES PRINCIPALES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {/* 1. MODELO */}
              <div>
                <label className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400 uppercase block mb-1">
                  1. Modelo de Calzado *
                </label>
                <select
                  value={selectedModeloNombre}
                  onChange={(e) => handleModeloChange(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-sm font-bold focus:border-blue-600 focus:outline-none shadow-sm"
                >
                  {modelos.map((m) => (
                    <option key={m.id} value={m.nombre}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. LOTE FOLIO (DESPLEGABLE) */}
              <div>
                <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 uppercase block mb-1">
                  2. Lote #
                </label>
                <select
                  value={loteFolio}
                  onChange={(e) => setLoteFolio(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-sm font-mono font-bold focus:border-blue-600 focus:outline-none"
                >
                  {LOTES_FOLIOS_PREDEFINIDOS.map((fol) => (
                    <option key={fol} value={fol}>
                      Lote #{fol}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. PROGRAMA # (DESPLEGABLE) */}
              <div>
                <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 uppercase block mb-1">
                  3. Programa #
                </label>
                <select
                  value={programaNum}
                  onChange={(e) => setProgramaNum(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-sm font-mono font-bold focus:border-blue-600 focus:outline-none"
                >
                  {PROGRAMAS_PREDEFINIDOS.map((prog) => (
                    <option key={prog} value={prog}>
                      Prog: {prog}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. FECHA DE ENTREGA (DESPLEGABLE) */}
              <div>
                <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 uppercase block mb-1">
                  4. Fecha de Entrega
                </label>
                <select
                  value={fechaEntrega}
                  onChange={(e) => setFechaEntrega(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs font-semibold focus:border-blue-600 focus:outline-none"
                >
                  {FECHAS_ENTREGA_PREDEFINIDAS.map((fech) => (
                    <option key={fech} value={fech}>
                      {fech}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* FILA 2: CLIENTE DESPLEGABLE Y METADATOS VINCULADOS AUTOMATICAMENTE */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* CLIENTE DESPLEGABLE */}
              <div>
                <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 uppercase block mb-1">
                  Cliente de Destino (Desplegable)
                </label>
                <select
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs font-bold focus:border-blue-600 focus:outline-none"
                >
                  {CLIENTES_PREDEFINIDOS.map((cli) => (
                    <option key={cli} value={cli}>
                      {cli}
                    </option>
                  ))}
                </select>
              </div>

              {/* METADATOS TÉCNICOS AUTO-VINCULADOS (HORMA / LINEA / MOLDURA) */}
              <div className="sm:col-span-2 p-3 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200 dark:border-zinc-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-zinc-400 uppercase">
                    Datos Técnicos del Modelo (Auto-vinculados)
                  </span>
                  <span className="text-[10px] font-mono text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded">
                    Sin escritura manual
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono font-bold">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Horma:</span>
                    <span className="text-slate-900 dark:text-white">{horma || '-'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Línea:</span>
                    <span className="text-slate-900 dark:text-white">{linea || '-'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Moldura:</span>
                    <span className="text-slate-900 dark:text-white">{moldura || '-'}</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-700 dark:text-zinc-300 font-sans truncate pt-1 border-t border-slate-200 dark:border-zinc-800">
                  <span className="font-bold">Estilo:</span> {estilo} ({descripcionEstilo})
                </div>
              </div>
            </div>

            {/* SELECCIÓN DE CORRIDA CON BOTONES DE 1 CLIC Y SELECTORES */}
            <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-xs font-mono font-extrabold text-slate-900 dark:text-white uppercase block">
                    Distribución de Pares por Talla
                  </span>
                  <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400">
                    Total calculado: {totalParesCalculado} pares
                  </span>
                </div>

                {/* BOTONES DE PRESET RAPIDO DE 1 CLIC */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => aplicarCorridaPreset('ESTANDAR_48P')}
                    className="px-2.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Corrida 48p (Foto)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => aplicarCorridaPreset('MEDIA_CORRIDA_24P')}
                    className="px-2.5 py-1.5 bg-white dark:bg-zinc-800 hover:bg-slate-100 text-slate-700 dark:text-zinc-200 text-xs font-bold rounded-lg border border-slate-300 dark:border-zinc-700 transition-colors"
                  >
                    Media 24p
                  </button>
                  <button
                    type="button"
                    onClick={() => aplicarCorridaPreset('DOBLE_CORRIDA_96P')}
                    className="px-2.5 py-1.5 bg-white dark:bg-zinc-800 hover:bg-slate-100 text-slate-700 dark:text-zinc-200 text-xs font-bold rounded-lg border border-slate-300 dark:border-zinc-700 transition-colors"
                  >
                    Doble 96p
                  </button>
                  <button
                    type="button"
                    onClick={() => aplicarCorridaPreset('LOTE_60P')}
                    className="px-2.5 py-1.5 bg-white dark:bg-zinc-800 hover:bg-slate-100 text-slate-700 dark:text-zinc-200 text-xs font-bold rounded-lg border border-slate-300 dark:border-zinc-700 transition-colors"
                  >
                    Lote 60p
                  </button>
                  <button
                    type="button"
                    onClick={() => aplicarCorridaPreset('LOTE_200P')}
                    className="px-2.5 py-1.5 bg-white dark:bg-zinc-800 hover:bg-slate-100 text-slate-700 dark:text-zinc-200 text-xs font-bold rounded-lg border border-slate-300 dark:border-zinc-700 transition-colors"
                  >
                    Lote 200p
                  </button>
                  <button
                    type="button"
                    onClick={limpiarCorrida}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors"
                    title="Limpiar corrida a 0"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* MATRIZ DE TALLAS CON SELECTORES DESPLEGABLES */}
              <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5 pt-1">
                {TALLAS_DISPONIBLES.map((t) => (
                  <div key={t} className="text-center">
                    <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-zinc-400 block mb-0.5">
                      #{t}
                    </span>
                    <select
                      value={tallasCorrida[t] || 0}
                      onChange={(e) =>
                        setTallasCorrida((prev) => ({
                          ...prev,
                          [t]: Number(e.target.value) || 0,
                        }))
                      }
                      className={`w-full bg-white dark:bg-zinc-900 border text-center font-mono font-black text-xs sm:text-sm rounded-lg py-1.5 focus:border-blue-600 focus:outline-none ${
                        (tallasCorrida[t] || 0) > 0
                          ? 'border-blue-600 text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30'
                          : 'border-slate-300 dark:border-zinc-700 text-slate-400 dark:text-zinc-500'
                      }`}
                    >
                      {OPCIONES_CANTIDAD_TALLA.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt > 0 ? `${opt}p` : '-'}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RESULTADO: TARJETA O MRP */}
      {!fichaActual || fichaActual.receta.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-8 text-center space-y-3 shadow-sm">
          <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Sin Receta configurada para el modelo &quot;{selectedModeloNombre}&quot;
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 max-w-md mx-auto">
            Configura la receta de materiales en el catalogo para generar automaticamente la tarjeta de taller y la lista de insumos.
          </p>
          <Link
            href="/catalogos"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold uppercase"
          >
            Configurar Receta
          </Link>
        </div>
      ) : activeTab === 'tarjeta' ? (
        <div className="space-y-4">
          <TarjetaProduccion data={tarjetaData} />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-zinc-400 uppercase block">
                  Materiales en Receta
                </span>
                <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
                  {resultados.length} insumos
                </span>
              </div>
              <Box className="w-8 h-8 text-slate-400 dark:text-zinc-600" />
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400 uppercase block">
                  Stock Disponible
                </span>
                <span className="text-2xl font-extrabold font-mono text-blue-700 dark:text-blue-400">
                  {countSuficientes} completos
                </span>
              </div>
              <CheckCircle2 className="w-8 h-8 text-blue-700 dark:text-blue-400" />
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 uppercase block">
                  Stock Faltante
                </span>
                <span className="text-2xl font-extrabold font-mono text-amber-700 dark:text-amber-400">
                  {countFaltantes} en deficit
                </span>
              </div>
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3 flex-wrap gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase">
                  Consumos para {totalParesCalculado} Pares de &quot;{selectedModeloNombre}&quot;
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Calculado segun la receta del modelo.
                </p>
              </div>

              <button
                onClick={handleAplicarDescuento}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold uppercase shadow flex items-center gap-2"
              >
                <MinusCircle className="w-4 h-4" /> Descontar del Almacen
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left border border-slate-200 dark:border-zinc-800">
                <thead>
                  <tr className="bg-slate-100 dark:bg-zinc-950 text-slate-700 dark:text-zinc-300 font-mono border-b border-slate-200 dark:border-zinc-800">
                    <th className="py-2.5 px-3 font-bold">Pieza</th>
                    <th className="py-2.5 px-3 font-bold">Material / Insumo</th>
                    <th className="py-2.5 px-3 font-bold text-center">Consumo x Par</th>
                    <th className="py-2.5 px-3 font-bold text-right">Requerido ({totalParesCalculado}p)</th>
                    <th className="py-2.5 px-3 font-bold text-right">Stock Actual</th>
                    <th className="py-2.5 px-3 font-bold text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
                  {resultados.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40">
                      <td className="py-2 px-3 font-semibold text-slate-700 dark:text-zinc-300 uppercase">
                        {r.pieza || 'GENERAL'}
                      </td>
                      <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">{r.material_nombre}</td>
                      <td className="py-2 px-3 text-center font-mono text-slate-600 dark:text-zinc-400">
                        {r.consumo_por_par} {r.unidad_medida_par}
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-blue-700 dark:text-blue-400">
                        {r.cantidad_requerida_total} {r.unidad_medida_total}
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-800 dark:text-zinc-200">
                        {r.stock_actual} {r.unidad_medida_total}
                      </td>
                      <td className="py-2 px-3 text-center">
                        {r.suficiente ? (
                          <span className="inline-flex items-center px-2 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-lg border border-blue-200 dark:border-blue-800">
                            Disponible
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-lg border border-amber-200 dark:border-amber-800">
                            Faltan {Math.abs(r.diferencia_stock).toFixed(1)} {r.unidad_medida_total}
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
