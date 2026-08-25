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
  Layers,
  Calculator,
  Sun,
  Moon,
} from 'lucide-react';
import { ProductionStore } from '@/lib/store';
import { useTheme } from './ThemeProvider';

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
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
    if (confirm('Atencion: Esta accion vaciara los datos de prueba. Deseas continuar?')) {
      ProductionStore.clearAllData();
      window.location.reload();
    }
  };

  const navItems = [
    { label: 'Inicio', href: '/', icon: LayoutDashboard },
    { label: '1. Salida a Maquila', href: '/salida', icon: Truck },
    { label: '2. Recepción de Maquila', href: '/recepcion', icon: PackageCheck },
    { label: '3. Zapatos en Proceso', href: '/procesos', icon: Layers },
    { label: '4. Pagar Raya Semanal', href: '/pago-semanal', icon: Receipt },
    { label: '5. Calcular Materiales', href: '/explosion-materiales', icon: Calculator },
    { label: '6. Modelos y Almacen', href: '/catalogos', icon: FolderPlus },
    { label: '7. Otras Salidas', href: '/salidas-generales', icon: PackageMinus },
  ];

  return (
    <>
      {/* HEADER MOVIL Y TABLET */}
      <header className="w-full bg-white dark:bg-black border-b border-slate-200 dark:border-zinc-800 px-4 py-3 flex items-center justify-between md:hidden sticky top-0 z-40 transition-colors">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg border border-slate-200 dark:border-zinc-700 focus:outline-none"
            aria-label="Abrir menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-700 dark:bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Factory className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white uppercase tracking-tight">
              Calzado & Taller
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* BOTON DE CAMBIO DE MODO (CLARO / OSCURO) */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-700 dark:text-zinc-200 bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-lg border border-slate-200 dark:border-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title={theme === 'dark' ? 'Cambiar a Modo Claro (Blanco y Azul Rey)' : 'Cambiar a Modo Oscuro (Negro y Azul)'}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Modo Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-blue-700" />
                <span className="hidden sm:inline">Modo Oscuro</span>
              </>
            )}
          </button>

          <button
            onClick={handleResetData}
            className="p-2 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 bg-slate-100 dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Reiniciar datos de prueba"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* OVERLAY MOVIL */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* SIDEBAR ESCRITORIO */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-white dark:bg-black border-r border-slate-200 dark:border-zinc-800/90 flex flex-col justify-between transition-all duration-200 print:hidden ${
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'md:w-16' : 'md:w-64'}`}
      >
        <div>
          {/* LOGO DE MARCA */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200 dark:border-zinc-800/80">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 overflow-hidden"
            >
              <div className="w-9 h-9 shrink-0 rounded-xl bg-blue-700 dark:bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <Factory className="w-5 h-5" />
              </div>
              {(!isCollapsed || mobileOpen) && (
                <div className="transition-opacity duration-150">
                  <span className="font-extrabold text-sm tracking-wide text-slate-900 dark:text-white uppercase block whitespace-nowrap">
                    CALZADO <span className="text-blue-700 dark:text-blue-400">PRO</span>
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium block whitespace-nowrap">
                    Sistema de Taller
                  </span>
                </div>
              )}
            </Link>

            <button
              onClick={toggleCollapse}
              className="hidden md:flex p-1.5 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-lg border border-slate-200 dark:border-zinc-800 transition-colors"
              title={isCollapsed ? 'Expandir menu' : 'Contraer menu'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* LISTA DE ENLACES DE NAVEGACION */}
          <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-14rem)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/80 shadow-sm font-bold'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-900/80'
                  }`}
                  title={item.label}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-colors ${
                      isActive ? 'text-blue-700 dark:text-blue-400' : 'text-slate-400 dark:text-zinc-500'
                    }`}
                  />
                  {(!isCollapsed || mobileOpen) && (
                    <span className="truncate">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* PIE DEL MENU CON BOTON DE MODO CLARO / OSCURO */}
        <div className="p-3 border-t border-slate-200 dark:border-zinc-800 space-y-2">
          {/* BOTON SELECTOR DE MODO OSCURO / CLARO */}
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-xs font-bold ${
              theme === 'dark'
                ? 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-800'
                : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
            }`}
            title={theme === 'dark' ? 'Cambiar a Modo Claro (Blanco y Azul Rey)' : 'Cambiar a Modo Oscuro (Negro y Azul)'}
          >
            <div className="flex items-center gap-2.5">
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <Moon className="w-4 h-4 text-blue-700 shrink-0" />
              )}
              {(!isCollapsed || mobileOpen) && (
                <span className="truncate font-semibold">
                  {theme === 'dark' ? 'Modo Oscuro' : 'Modo Claro'}
                </span>
              )}
            </div>
            {(!isCollapsed || mobileOpen) && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                theme === 'dark' ? 'bg-blue-950 text-blue-400 border border-blue-800' : 'bg-blue-100 text-blue-800 border border-blue-300'
              }`}>
                {theme === 'dark' ? 'Negro/Azul' : 'Blanco/Azul Rey'}
              </span>
            )}
          </button>

          {/* BOTON DE REINICIAR DATOS */}
          {(!isCollapsed || mobileOpen) && (
            <button
              onClick={handleResetData}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-[11px] font-semibold text-slate-500 dark:text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Limpiar datos de prueba</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
