'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  useEffect(() => {
    // Sincronizar con localStorage
    const updateCollapseState = () => {
      const saved = localStorage.getItem('sidebar_collapsed');
      if (saved !== null) {
        setIsCollapsed(saved === 'true');
      }
    };

    updateCollapseState();

    // Escuchar cambios de localStorage en la ventana
    window.addEventListener('storage', updateCollapseState);
    const interval = setInterval(updateCollapseState, 300);

    return () => {
      window.removeEventListener('storage', updateCollapseState);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col md:flex-row font-sans">
      <Sidebar />
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-200 pb-20 md:pb-8 ${
          isCollapsed ? 'md:pl-16' : 'md:pl-64'
        }`}
      >
        <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );


}
