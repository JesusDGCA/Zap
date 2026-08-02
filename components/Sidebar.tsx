'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PackageCheck,
  PackageMinus,
  Receipt,
  Factory,
  RefreshCw,
  Truck,
  FolderPlus,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { ProductionStore } from '@/lib/store';

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    if (saved !== null) {
      setIsCollapsed(saved === 'true');
    }
  }, []);

  const toggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem('sidebar_collapsed', String(nextState));
  };

  const handleResetData = () => {
    if (confirm('¿Deseas reiniciar la base de datos a los valores iniciales de prueba?')) {
      ProductionStore.resetToDefault();
      window.location.reload();
    }
  };

  const navItems = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Salida a Maquila', href: '/salida', icon: Truck },
    { label: 'Salidas Almacén', href: '/salidas-generales', icon: PackageMinus },
    { label: 'Recepción', href: '/recepcion', icon: PackageCheck },
    { label: 'Pago Semanal', href: '/pago-semanal', icon: Receipt },
    { label: 'Catálogos & Stock', href: '/catalogos', icon: FolderPlus },
  ];

  return (
    <>
      {/* HEADER MÓVIL Y TABLET PEQUEÑA */}
      <header className="w-full bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center justify-between md:hidden sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-zinc-300 hover:text-white bg-zinc-800 rounded-lg border border-zinc-700/80 focus:outline-none"
            aria-label="Abrir menú"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-100">
              <Factory className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="font-bold text-base text-zinc-100 uppercase tracking-tight">
              ALMACÉN & MAQUILA
            </span>
          </div>
        </div>

        <button
          onClick={handleResetData}
          className="p-2 text-zinc-400 hover:text-zinc-100 bg-zinc-800 rounded-lg border border-zinc-700 text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors"
          title="Reiniciar datos de demo"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </header>

      {/* OVERLAY MÓVIL */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* SIDEBAR DESKTOP & TABLET GRANDE */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-zinc-900/95 backdrop-blur-md border-r border-zinc-800/80 flex flex-col justify-between transition-all duration-200 print:hidden ${
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'md:w-16' : 'md:w-64'}`}
      >
        <div>
          {/* LOGO DE MARCA */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-zinc-800/80">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 overflow-hidden"
            >
              <div className="w-9 h-9 shrink-0 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-100 shadow-sm">
                <Factory className="w-5 h-5 text-emerald-400" />
              </div>
              {(!isCollapsed || mobileOpen) && (
                <div className="transition-opacity duration-150">
                  <span className="font-extrabold text-sm tracking-wide text-zinc-100 uppercase block whitespace-nowrap">
                    ALMACÉN <span className="text-emerald-400 font-normal">PRO</span>
                  </span>
                  <span className="text-[11px] text-zinc-400 font-medium block whitespace-nowrap">
                    Control de Planta
                  </span>
                </div>
              )}
            </Link>

            <button
              onClick={toggleCollapse}
              className="hidden md:flex p-1.5 text-zinc-400 hover:text-white bg-zinc-800/60 hover:bg-zinc-800 rounded-lg border border-zinc-700/80 transition-colors"
              title={isCollapsed ? 'Expandir menú' : 'Contraer menú'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* LISTA DE NAVEGACIÓN CON TAMAÑOS MÁS CONFORTABLES */}
          <nav className="p-3 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const showText = !isCollapsed || mobileOpen;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  title={isCollapsed ? item.label : undefined}
                  className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all group relative ${
                    isActive
                      ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-colors ${
                      isActive ? 'text-emerald-400' : 'text-zinc-400 group-hover:text-zinc-200'
                    }`}
                  />

                  {showText && <span className="truncate leading-none">{item.label}</span>}

                  {isCollapsed && !mobileOpen && (
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-zinc-900 text-zinc-100 text-xs font-semibold rounded-lg border border-zinc-700 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* PIE DEL SIDEBAR */}
        <div className="p-3 border-t border-zinc-800/80 space-y-2">
          {(!isCollapsed || mobileOpen) && (
            <div className="px-3 py-2 bg-zinc-950/60 rounded-xl border border-zinc-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400">Sistema</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </span>
            </div>
          )}

          <button
            onClick={handleResetData}
            title="Reiniciar datos de demo"
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 text-xs sm:text-sm font-semibold text-zinc-400 hover:text-zinc-200 bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all ${
              isCollapsed && !mobileOpen ? 'px-0' : ''
            }`}
          >
            <RefreshCw className="w-4 h-4 shrink-0" />
            {(!isCollapsed || mobileOpen) && <span>Reset Demo</span>}
          </button>
        </div>
      </aside>

      {/* BARRA DE NAVEGACIÓN INFERIOR PWA (TABLETS Y CELULARES) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800 md:hidden px-2 py-2 flex justify-around items-center print:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full py-1.5 px-1 rounded-xl transition-all ${
                isActive
                  ? 'text-white font-bold bg-zinc-800 border border-zinc-700/80'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-emerald-400' : 'text-zinc-400'}`} />
              <span className="text-[11px] leading-tight truncate max-w-[68px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
