import type { Metadata, Viewport } from 'next';
import './globals.css';
import SidebarLayout from '@/components/SidebarLayout';

export const metadata: Metadata = {
  title: 'Control de Producción & Almacén | Fábrica de Calzado',
  description: 'Sistema para control de calzado en taller, materiales, recepción y pago de maquila.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#000000',
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
    <html lang="es" className="h-full dark">
      <body className="h-full font-sans antialiased">
        <SidebarLayout>{children}</SidebarLayout>
      </body>
    </html>
  );
}
