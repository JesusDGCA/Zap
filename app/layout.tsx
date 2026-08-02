import type { Metadata, Viewport } from 'next';
import './globals.css';
import SidebarLayout from '@/components/SidebarLayout';

export const metadata: Metadata = {
  title: 'Control de Producción & Maquila | Fábrica de Calzado',
  description: 'Sistema PWA para control de inventario crudo, recepción de maquila y liquidación de pago semanal a destajo.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full bg-zinc-950 text-zinc-100 antialiased">
      <body className="h-full bg-zinc-950 text-zinc-100 font-sans selection:bg-zinc-800 selection:text-zinc-100">
        <SidebarLayout>{children}</SidebarLayout>
      </body>
    </html>
  );
}

