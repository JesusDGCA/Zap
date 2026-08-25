'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { ThemeProvider, useTheme } from './ThemeProvider';

function SidebarLayoutInner({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
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

    window.addEventListener('storage', updateCollapseState);
    const interval = setInterval(updateCollapseState, 300);

    return () => {
      window.removeEventListener('storage', updateCollapseState);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={`${theme} min-h-screen bg-slate-100 dark:bg-black text-slate-900 dark:text-zinc-100 flex flex-col md:flex-row font-sans transition-colors duration-200`}>
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

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SidebarLayoutInner>{children}</SidebarLayoutInner>
    </ThemeProvider>
  );
}
