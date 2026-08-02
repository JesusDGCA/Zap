'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Truck,
  PackageCheck,
  PackageMinus,
  Receipt,
  FolderPlus,
  ArrowRight,
  AlertTriangle,
  PlusCircle,
} from 'lucide-react';
import { ProductionStore } from '@/lib/store';
import { OrdenSalidaConMaquilero, AlertaIncompletaView } from '@/types/database';

export default function DashboardPage() {
  const [alertasCount, setAlertasCount] = useState<number>(0);
  const [ordenesPendientes, setOrdenesPendientes] = useState<OrdenSalidaConMaquilero[]>([]);
  const [alertasActivas, setAlertasActivas] = useState<AlertaIncompletaView[]>([]);
  const [salidasGeneralesCount, setSalidasGeneralesCount] = useState<number>(0);
  const [ticketsCount, setTicketsCount] = useState<number>(0);
  const [pedidosCount, setPedidosCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const actAlertas = ProductionStore.getAlertasActivas();
    const actOrdenes = ProductionStore.getOrdenesPendientesConDetalle();
    const actSalidasGenerales = ProductionStore.getSalidasGenerales();
    const tickets = ProductionStore.getTicketsPagoSemanal();
    const pedidos = ProductionStore.getPedidosCliente();

    setAlertasCount(actAlertas.length);
    setAlertasActivas(actAlertas);
    setOrdenesPendientes(actOrdenes);
    setSalidasGeneralesCount(actSalidasGenerales.length);
    setTicketsCount(tickets.length);
    setPedidosCount(pedidos.length);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-zinc-400">
        <div className="w-8 h-8 border-3 border-zinc-700 border-t-zinc-200 rounded-full animate-spin"></div>
        <p className="text-sm font-medium">Cargando Dashboard...</p>
      </div>
    );
  }

  const totalParesEnTransito = ordenesPendientes.reduce((sum, ord) => sum + ord.total_pares_enviados, 0);

  return (
    <div className="space-y-6 lg:space-y-8 w-full">
      {/* HEADER PRINCIPAL LEGIBLE Y ADAPTABLE */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-100 uppercase">
            Control de Producción & Almacén
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 mt-1">
            Resumen en tiempo real y accesos de operación rápida.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/salida"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nueva Salida</span>
          </Link>
          <Link
            href="/recepcion"
            className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl text-sm font-bold flex items-center gap-2 border border-zinc-700 transition-colors"
          >
            <PackageCheck className="w-4 h-4 text-emerald-400" />
            <span>Recepción</span>
          </Link>
        </div>
      </div>

      {/* STRIP DE KPIS OPERATIVOS GRANDES Y VISIBLES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <Link
          href="/salida"
          className="p-5 sm:p-6 bg-zinc-900/90 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
              En Tránsito
            </span>
            <div className="p-2 bg-zinc-800/80 rounded-xl text-zinc-300 group-hover:text-white">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-zinc-100">
              {ordenesPendientes.length}
            </span>
            <span className="text-xs sm:text-sm text-zinc-400 font-medium">
              órdenes ({totalParesEnTransito} pares)
            </span>
          </div>
        </Link>

        <Link
          href="/recepcion"
          className={`p-5 sm:p-6 rounded-2xl border transition-all shadow-sm group ${
            alertasCount > 0
              ? 'bg-rose-950/30 hover:bg-rose-950/50 border-rose-900/80 hover:border-rose-700'
              : 'bg-zinc-900/90 hover:bg-zinc-900 border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
              Alertas Recepción
            </span>
            <div className="p-2 bg-zinc-800/80 rounded-xl text-zinc-300">
              <AlertTriangle className={`w-5 h-5 ${alertasCount > 0 ? 'text-rose-400' : 'text-zinc-400'}`} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <span
              className={`text-3xl sm:text-4xl font-extrabold font-mono ${
                alertasCount > 0 ? 'text-rose-400' : 'text-zinc-100'
              }`}
            >
              {alertasCount}
            </span>
            <span className="text-xs sm:text-sm text-zinc-400 font-medium">faltantes activos</span>
          </div>
        </Link>

        <Link
          href="/pago-semanal"
          className="p-5 sm:p-6 bg-zinc-900/90 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
              Raya / Tickets
            </span>
            <div className="p-2 bg-zinc-800/80 rounded-xl text-zinc-300 group-hover:text-white">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-zinc-100">
              {ticketsCount}
            </span>
            <span className="text-xs sm:text-sm text-zinc-400 font-medium">tickets guardados</span>
          </div>
        </Link>

        <Link
          href="/catalogos"
          className="p-5 sm:p-6 bg-zinc-900/90 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
              Pedidos Cliente
            </span>
            <div className="p-2 bg-zinc-800/80 rounded-xl text-zinc-300 group-hover:text-white">
              <FolderPlus className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-zinc-100">
              {pedidosCount}
            </span>
            <span className="text-xs sm:text-sm text-zinc-400 font-medium">registrados</span>
          </div>
        </Link>
      </div>

      {/* ALERTAS ACTIVAS SI EXISTEN */}
      {alertasActivas.length > 0 && (
        <div className="bg-rose-950/20 border border-rose-900/60 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-rose-300 font-bold text-sm uppercase tracking-wider">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>Atención Requerida en Recepción ({alertasActivas.length})</span>
            </div>
            <Link
              href="/recepcion"
              className="text-xs sm:text-sm font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              Resolver Alertas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {alertasActivas.slice(0, 3).map((alerta) => (
              <div
                key={alerta.recepcion_id}
                className="bg-zinc-900 border border-rose-900/50 rounded-xl p-3.5 space-y-1.5"
              >
                <div className="flex items-center justify-between text-zinc-200 text-sm">
                  <span className="font-bold">{alerta.maquilero_nombre}</span>
                  <span className="font-mono text-xs text-rose-400 font-bold">
                    -{(alerta.faltantes_izquierdos + alerta.faltantes_derechos)} piezas
                  </span>
                </div>
                <div className="text-xs text-zinc-400">
                  Modelo: <span className="text-zinc-200 font-medium">{alerta.modelo}</span> (Talla #{alerta.talla})
                </div>
                <p className="text-xs text-zinc-500 italic truncate">&quot;{alerta.nota}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VISTA RÁPIDA DE ÓRDENES EN TRÁNSITO */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-zinc-100 uppercase tracking-tight">
              Órdenes de Maquila en Tránsito
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">Lotes actualmente entregados en talleres externos.</p>
          </div>
          <Link
            href="/salida"
            className="text-xs sm:text-sm text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
          >
            Ver módulo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {ordenesPendientes.length === 0 ? (
          <div className="py-8 text-center text-sm text-zinc-500">
            No hay órdenes pendientes en tránsito.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead>
                <tr className="text-zinc-400 font-mono border-b border-zinc-800 text-xs">
                  <th className="py-3 px-3 font-semibold">Folio</th>
                  <th className="py-3 px-3 font-semibold">Maquilero</th>
                  <th className="py-3 px-3 font-semibold">Modelo</th>
                  <th className="py-3 px-3 font-semibold">Fecha Envío</th>
                  <th className="py-3 px-3 font-semibold text-right">Total Pares</th>
                  <th className="py-3 px-3 font-semibold text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {ordenesPendientes.map((ord) => (
                  <tr key={ord.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-zinc-200">{ord.id}</td>
                    <td className="py-3 px-3 text-zinc-100 font-semibold">{ord.maquilero_nombre}</td>
                    <td className="py-3 px-3 text-zinc-300">{ord.modelo}</td>
                    <td className="py-3 px-3 text-zinc-400 font-mono text-xs">{ord.fecha_envio}</td>
                    <td className="py-3 px-3 text-right font-mono font-extrabold text-emerald-400 text-sm">
                      {ord.total_pares_enviados}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Link
                        href="/recepcion"
                        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg text-xs font-bold border border-zinc-700 inline-flex items-center gap-1.5 transition-colors"
                      >
                        <PackageCheck className="w-3.5 h-3.5 text-emerald-400" /> Recibir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ACCESOS DIRECTOS GRANDES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/salida"
          className="p-5 bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-zinc-800 text-emerald-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-sm sm:text-base font-bold text-zinc-100 group-hover:text-white block">
                Salida a Maquila
              </span>
              <span className="text-xs text-zinc-400">Envío por lote de tallas</span>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/salidas-generales"
          className="p-5 bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-zinc-800 text-zinc-200">
              <PackageMinus className="w-6 h-6" />
            </div>
            <div>
              <span className="text-sm sm:text-base font-bold text-zinc-100 group-hover:text-white block">
                Salidas Generales
              </span>
              <span className="text-xs text-zinc-400">Consumo interno y pegamento</span>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/pago-semanal"
          className="p-5 bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-zinc-800 text-amber-400">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <span className="text-sm sm:text-base font-bold text-zinc-100 group-hover:text-white block">
                Pago Semanal
              </span>
              <span className="text-xs text-zinc-400">Raya a destajo e historial</span>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
