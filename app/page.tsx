'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Truck,
  PackageCheck,
  Receipt,
  Layers,
  Calculator,
  FolderPlus,
  ArrowRight,
  AlertTriangle,
  Clock,
  CheckCircle2,
  PackageMinus,
  Factory,
} from 'lucide-react';
import { ProductionStore } from '@/lib/store';
import { OrdenSalidaConMaquilero, AlertaIncompletaView } from '@/types/database';

export default function DashboardPage() {
  const [alertasCount, setAlertasCount] = useState<number>(0);
  const [ordenesPendientes, setOrdenesPendientes] = useState<OrdenSalidaConMaquilero[]>([]);
  const [alertasActivas, setAlertasActivas] = useState<AlertaIncompletaView[]>([]);
  const [totalParesWIP, setTotalParesWIP] = useState<number>(0);
  const [totalLotesWIP, setTotalLotesWIP] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const actAlertas = ProductionStore.getAlertasActivas();
    const actOrdenes = ProductionStore.getOrdenesPendientesConDetalle();
    const lotes = ProductionStore.getLotesProduccion();

    const lotesActivos = lotes.filter((l) => l.etapa_actual !== 'Producto Terminado');
    const totalPares = lotesActivos.reduce((sum, l) => sum + l.total_pares, 0);

    setAlertasCount(actAlertas.length);
    setAlertasActivas(actAlertas);
    setOrdenesPendientes(actOrdenes);
    setTotalParesWIP(totalPares);
    setTotalLotesWIP(lotesActivos.length);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-slate-500 dark:text-zinc-400">
        <div className="w-8 h-8 border-3 border-blue-700 dark:border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium">Cargando informacion...</p>
      </div>
    );
  }

  const totalParesEnTransito = ordenesPendientes.reduce((sum, ord) => sum + ord.total_pares_enviados, 0);

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto">
      {/* ENCABEZADO PRINCIPAL */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
            Panel de Control del Taller
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 mt-0.5">
            Selecciona la tarea que deseas realizar hoy.
          </p>
        </div>
      </div>

      {/* 4 BOTONES GRANDES DE OPERACION PRINCIPAL (FACILES Y VISIBLES) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. SALIDA A MAQUILA */}
        <Link
          href="/salida"
          className="p-5 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-2xl shadow-md border-2 border-blue-600 dark:border-blue-400 flex flex-col justify-between h-36 transition-all transform hover:scale-[1.01] group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
              Paso 1
            </span>
            <Truck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black uppercase leading-snug">
              1. Salida a Maquila
            </h2>
            <p className="text-xs text-blue-100 mt-0.5">
              Entregar corte y materiales al maquilero
            </p>
          </div>
        </Link>

        {/* 2. RECEPCION DE MAQUILA */}
        <Link
          href="/recepcion"
          className="p-5 bg-blue-800 hover:bg-blue-900 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-white rounded-2xl shadow-md border-2 border-blue-700 dark:border-blue-600 flex flex-col justify-between h-36 transition-all transform hover:scale-[1.01] group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
              Paso 2
            </span>
            <PackageCheck className="w-6 h-6 text-blue-300 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-black uppercase leading-snug">
              2. Recepción de Maquila
            </h2>
            <p className="text-xs text-blue-200 dark:text-zinc-400 mt-0.5">
              Contar pares recibidos y registrar piezas
            </p>
          </div>
        </Link>

        {/* 3. VER PROCESO */}
        <Link
          href="/procesos"
          className="p-5 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-850 text-slate-900 dark:text-white rounded-2xl shadow-md border-2 border-slate-300 dark:border-zinc-700 flex flex-col justify-between h-36 transition-all transform hover:scale-[1.01] group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
              Paso 3
            </span>
            <Layers className="w-6 h-6 text-blue-700 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-black uppercase leading-snug">
              3. Zapatos en Proceso
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Ver etapas (Corte, Forrado, Montado)
            </p>
          </div>
        </Link>

        {/* 4. PAGAR RAYA */}
        <Link
          href="/pago-semanal"
          className="p-5 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-850 text-slate-900 dark:text-white rounded-2xl shadow-md border-2 border-slate-300 dark:border-zinc-700 flex flex-col justify-between h-36 transition-all transform hover:scale-[1.01] group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
              Paso 4
            </span>
            <Receipt className="w-6 h-6 text-blue-700 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-black uppercase leading-snug">
              4. Pagar Raya Semanal
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Calcular e imprimir nota de pago
            </p>
          </div>
        </Link>
      </div>

      {/* ACCESOS RAPIDOS A MATERIALES Y CATALOGOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/explosion-materiales"
          className="p-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-xl flex items-center justify-between group shadow-sm transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-zinc-100 block">
                5. Calcular Materiales y Tarjeta
              </span>
              <span className="text-xs text-slate-500 dark:text-zinc-400 block">
                Generar tarjeta viajera de lote
              </span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors" />
        </Link>

        <Link
          href="/catalogos"
          className="p-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-xl flex items-center justify-between group shadow-sm transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-zinc-100 block">
                6. Modelos, Talleres y Almacen
              </span>
              <span className="text-xs text-slate-500 dark:text-zinc-400 block">
                Agregar modelos, recetas y stock
              </span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors" />
        </Link>

        <Link
          href="/salidas-generales"
          className="p-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-xl flex items-center justify-between group shadow-sm transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold">
              <PackageMinus className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-zinc-100 block">
                7. Otras Salidas de Material
              </span>
              <span className="text-xs text-slate-500 dark:text-zinc-400 block">
                Consumo interno, mermas o ajustes
              </span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors" />
        </Link>
      </div>

      {/* RESUMEN DE SITUACION ACTUAL DEL TALLER */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-zinc-400 uppercase block">
              Zapatos en Fabricacion
            </span>
            <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
              {totalParesWIP} pares
            </span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 block mt-0.5">
              En {totalLotesWIP} lotes activos
            </span>
          </div>
          <Layers className="w-8 h-8 text-blue-700 dark:text-blue-500" />
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-zinc-400 uppercase block">
              Envios en Taller
            </span>
            <span className="text-2xl font-extrabold font-mono text-blue-700 dark:text-blue-400">
              {totalParesEnTransito} pares
            </span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 block mt-0.5">
              En {ordenesPendientes.length} envios pendientes
            </span>
          </div>
          <Truck className="w-8 h-8 text-blue-700 dark:text-blue-400" />
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-zinc-400 uppercase block">
              Faltantes Registrados
            </span>
            <span className={`text-2xl font-extrabold font-mono ${alertasCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
              {alertasCount} incidencias
            </span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 block mt-0.5">
              Piezas sueltas o notas
            </span>
          </div>
          <AlertTriangle className={`w-8 h-8 ${alertasCount > 0 ? 'text-amber-500' : 'text-slate-400 dark:text-zinc-600'}`} />
        </div>
      </div>
    </div>
  );
}
