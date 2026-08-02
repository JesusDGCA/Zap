'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CorteSabatinoRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/pago-semanal');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-slate-400">
      <div className="w-8 h-8 border-4 border-slate-700 border-t-slate-200 rounded-full animate-spin"></div>
      <p className="text-sm font-medium">Redirigiendo a Pago Semanal...</p>
    </div>
  );
}
