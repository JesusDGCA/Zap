'use client';

import React, { useRef } from 'react';
import {
  Printer,
  Copy,
  Check,
  FileText,
  Stamp,
} from 'lucide-react';
import { TarjetaProduccionData } from '@/types/database';

interface TarjetaProduccionProps {
  data: TarjetaProduccionData;
  onPrint?: () => void;
}

export default function TarjetaProduccion({
  data,
  onPrint,
}: TarjetaProduccionProps) {
  const [copiado, setCopiado] = React.useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const handleCopy = () => {
    const text = `
TARJETA DE PRODUCCION Y CONSUMO DE MATERIALES
Lote: ${data.lote} | Programa: ${data.programa} | Fecha: ${data.fecha_entrega}
Cliente: ${data.cliente}
Horma: ${data.horma} | Linea: ${data.linea} | Moldura: ${data.moldura}
Estilo: ${data.estilo}
Descripcion: ${data.descripcion_estilo}
Total Pares: ${data.total_pares}

Tallas: ${data.desglose_tallas.map((t) => `#${t.talla}: ${t.pares}p`).join(' | ')}

CONSUMOS DE MATERIALES:
${data.materiales
  .map(
    (m) =>
      `- ${m.pieza || 'PIEZA'}: ${m.material_nombre} | Consumo x Par: ${m.consumo_por_par} ${m.unidad_medida_par} | Requerido Total: ${m.cantidad_requerida_total} ${m.unidad_medida_total}`
  )
  .join('\n')}

Grabado / Diseño: ${data.troquel_especificacion || 'N/A'}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  // Separar materiales por secciones
  const materialesCorte = data.materiales.filter(
    (m) => m.seccion !== 'suela_planta_tacon' && m.seccion !== 'troquel'
  );
  const materialesSuela = data.materiales.filter(
    (m) => m.seccion === 'suela_planta_tacon'
  );

  return (
    <div className="space-y-3">
      {/* BARRA DE ACCIONES SUPERIOR (Oculta al imprimir) */}
      <div className="flex items-center justify-between gap-2 p-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl print:hidden shadow-sm transition-colors">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 dark:text-zinc-300">
          <FileText className="w-4 h-4 text-blue-700 dark:text-blue-400" />
          <span>Tarjeta Viajera de Taller (Lote #{data.lote})</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-slate-200 dark:border-zinc-700 transition-colors"
            title="Copiar texto resumen"
          >
            {copiado ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiado ? 'Copiado' : 'Copiar'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-lg text-xs font-extrabold uppercase flex items-center gap-1.5 shadow transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Tarjeta</span>
          </button>
        </div>
      </div>

      {/* CONTENEDOR DE LA TARJETA INDUSTRIAL FISICA */}
      <div
        ref={cardRef}
        id="tarjeta-imprimible"
        className="w-full max-w-[850px] mx-auto bg-white text-black p-4 sm:p-6 rounded-lg shadow-xl border border-slate-300 font-sans text-xs sm:text-[13px] leading-tight select-text print:shadow-none print:border-0 print:p-0 print:m-0 print:max-w-none print:w-full print:text-black"
        style={{
          color: '#000',
          backgroundColor: '#fff',
        }}
      >
        {/* ENCABEZADO 1: HORMA, LINEA, MOLDURA, FECHA ENTREGA, LOTE */}
        <div className="border-2 border-black divide-y-2 divide-black">
          {/* Fila 1 */}
          <div className="grid grid-cols-12 divide-x-2 divide-black bg-zinc-50 font-bold uppercase text-[11px] sm:text-xs">
            <div className="col-span-2 p-1.5 sm:p-2">
              <span className="block text-[9px] sm:text-[10px] text-zinc-600 font-semibold tracking-wider">HORMA</span>
              <span className="font-extrabold text-sm sm:text-base tracking-tight">{data.horma || '-'}</span>
            </div>
            <div className="col-span-3 p-1.5 sm:p-2">
              <span className="block text-[9px] sm:text-[10px] text-zinc-600 font-semibold tracking-wider">LINEA</span>
              <span className="font-extrabold text-sm sm:text-base tracking-tight">{data.linea || '-'}</span>
            </div>
            <div className="col-span-2 p-1.5 sm:p-2">
              <span className="block text-[9px] sm:text-[10px] text-zinc-600 font-semibold tracking-wider">MOLDURA</span>
              <span className="font-extrabold text-sm sm:text-base tracking-tight">{data.moldura || '-'}</span>
            </div>
            <div className="col-span-3 p-1.5 sm:p-2">
              <span className="block text-[9px] sm:text-[10px] text-zinc-600 font-semibold tracking-wider">FECHA ENTREGA</span>
              <span className="font-bold text-xs sm:text-sm whitespace-nowrap">{data.fecha_entrega || '-'}</span>
            </div>
            <div className="col-span-2 p-1.5 sm:p-2 bg-zinc-200/80 text-right">
              <span className="block text-[9px] sm:text-[10px] text-zinc-600 font-semibold tracking-wider text-right">LOTE</span>
              <span className="font-mono font-black text-base sm:text-xl tracking-tight">{data.lote || '-'}</span>
            </div>
          </div>

          {/* Fila 2: CLIENTE Y ESTILO */}
          <div className="grid grid-cols-12 divide-x-2 divide-black uppercase text-xs">
            <div className="col-span-4 p-1.5 sm:p-2 flex flex-col justify-center">
              <span className="text-[9px] sm:text-[10px] text-zinc-600 font-semibold tracking-wider block">CLIENTE</span>
              <span className="font-extrabold text-xs sm:text-sm truncate">{data.cliente || '-'}</span>
            </div>
            <div className="col-span-8 p-1.5 sm:p-2 flex items-center gap-2">
              <div className="flex-1">
                <span className="text-[9px] sm:text-[10px] text-zinc-600 font-semibold tracking-wider block">ESTILO</span>
                <span className="font-black text-xs sm:text-sm block">{data.estilo || '-'}</span>
              </div>
            </div>
          </div>

          {/* Fila 3: DESCRIPCION ESTILO */}
          <div className="p-1.5 sm:p-2 bg-zinc-50 uppercase flex items-center justify-between">
            <div>
              <span className="text-[9px] sm:text-[10px] text-zinc-600 font-semibold tracking-wider block">DESCRIPCION ESTILO</span>
              <span className="font-extrabold text-xs sm:text-sm tracking-wide">{data.descripcion_estilo || '-'}</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-zinc-400 text-[10px] font-mono pr-2">
              <Stamp className="w-3.5 h-3.5" />
              <span>ORDEN DE PRODUCCION</span>
            </div>
          </div>
        </div>

        {/* TABLA DE CORRIDA / TALLAS / PROGRAMA */}
        <div className="mt-2 border-2 border-black overflow-x-auto">
          <table className="w-full text-center border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-zinc-100 font-bold border-b-2 border-black divide-x-2 divide-black text-[11px] sm:text-xs">
                <th className="py-1.5 px-2 text-left font-extrabold w-24">Programa</th>
                {data.desglose_tallas.map((t, idx) => (
                  <th key={idx} className="py-1.5 px-1 sm:px-2 font-mono font-bold">
                    {t.talla}
                  </th>
                ))}
                <th className="py-1.5 px-2 bg-zinc-200 font-extrabold">Total</th>
                <th className="py-1.5 px-2 font-extrabold">Renglon</th>
              </tr>
            </thead>
            <tbody>
              <tr className="font-mono font-black text-xs sm:text-sm divide-x-2 divide-black">
                <td className="py-1.5 px-2 text-left font-bold text-zinc-800">{data.programa || '260228'}</td>
                {data.desglose_tallas.map((t, idx) => (
                  <td key={idx} className="py-1.5 px-1 sm:px-2 text-center text-sm font-extrabold">
                    {t.pares > 0 ? t.pares : '-'}
                  </td>
                ))}
                <td className="py-1.5 px-2 bg-zinc-100 text-sm sm:text-base font-black text-center">
                  {data.total_pares}
                </td>
                <td className="py-1.5 px-2 text-center font-sans font-semibold text-[11px]">
                  {data.renglon || '1 de 1'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* TABLA DE EXPLOSION DE MATERIALES (CORTE, FORRO, ADORNOS, INSUMOS) */}
        <div className="mt-2 border-2 border-black">
          <table className="w-full text-left border-collapse text-[11px] sm:text-xs">
            <thead>
              <tr className="bg-zinc-100 font-black border-b-2 border-black divide-x-2 divide-black uppercase text-[10px] sm:text-[11px]">
                <th className="py-1.5 px-2 w-[22%]">Pieza</th>
                <th className="py-1.5 px-2 w-[48%]">Material</th>
                <th className="py-1.5 px-1.5 text-right w-[10%]">C x P</th>
                <th className="py-1.5 px-1.5 text-center w-[6%]">Uni.</th>
                <th className="py-1.5 px-1.5 text-right w-[9%]">Consumo</th>
                <th className="py-1.5 px-1.5 text-center w-[5%]">Uni.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-300 font-mono text-[11px] sm:text-xs">
              {materialesCorte.map((m, idx) => (
                <tr key={idx} className="divide-x divide-zinc-300 hover:bg-zinc-50">
                  <td className="py-1 px-2 font-sans font-bold uppercase text-zinc-900 tracking-tight">
                    {m.pieza}
                  </td>
                  <td className="py-1 px-2 font-sans font-semibold uppercase text-zinc-800 truncate">
                    {m.material_nombre}
                  </td>
                  <td className="py-1 px-1.5 text-right font-bold text-zinc-900">
                    {m.consumo_por_par.toFixed(2)}
                  </td>
                  <td className="py-1 px-1.5 text-center text-zinc-600 font-sans font-medium text-[10px]">
                    {m.unidad_medida_par}
                  </td>
                  <td className="py-1 px-1.5 text-right font-black text-black">
                    {m.cantidad_requerida_total.toFixed(2)}
                  </td>
                  <td className="py-1 px-1.5 text-center text-zinc-800 font-sans font-bold text-[10px]">
                    {m.unidad_medida_total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SECCION GRABADO / NOM 20 */}
        {data.troquel_especificacion && (
          <div className="mt-2 border-2 border-black p-2 bg-zinc-50 flex items-center justify-between text-xs sm:text-sm font-bold uppercase">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 bg-black text-white font-mono font-black text-[10px] sm:text-xs rounded-sm">
                NOM 20
              </span>
              <span className="font-extrabold text-xs sm:text-sm">GRABADO:</span>
              <span className="text-zinc-800 text-[11px] sm:text-xs font-semibold">
                {data.troquel_especificacion.replace(/^NOM\s*20\s*\/\s*(TROQUEL|GRABADO):\s*/i, '').trim()}
              </span>
            </div>
          </div>
        )}

        {/* SECCION SUELA, PLANTA, TACON */}
        {materialesSuela.length > 0 && (
          <div className="mt-2 border-2 border-black">
            <div className="bg-zinc-100 px-2 py-1 border-b-2 border-black font-black uppercase text-[10px] sm:text-[11px] text-zinc-700 tracking-wider">
              COMPONENTES DE PISO Y CALZADO (PLANTA / SUELA / TACON)
            </div>
            <table className="w-full text-left border-collapse text-[11px] sm:text-xs">
              <tbody className="divide-y divide-zinc-300 font-mono text-[11px] sm:text-xs">
                {materialesSuela.map((m, idx) => (
                  <tr key={idx} className="divide-x divide-zinc-300">
                    <td className="py-1 px-2 font-sans font-bold uppercase text-zinc-900 w-[22%]">
                      {m.pieza}
                    </td>
                    <td className="py-1 px-2 font-sans font-semibold uppercase text-zinc-800 w-[48%]">
                      {m.material_nombre}
                    </td>
                    <td className="py-1 px-1.5 text-right font-bold text-zinc-900 w-[10%]">
                      {m.consumo_por_par.toFixed(2)}
                    </td>
                    <td className="py-1 px-1.5 text-center text-zinc-600 font-sans font-medium text-[10px] w-[6%]">
                      {m.unidad_medida_par}
                    </td>
                    <td className="py-1 px-1.5 text-right font-black text-black w-[9%]">
                      {m.cantidad_requerida_total.toFixed(2)}
                    </td>
                    <td className="py-1 px-1.5 text-center text-zinc-800 font-sans font-bold text-[10px] w-[5%]">
                      {m.unidad_medida_total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PIE DE TARJETA / FIRMAS DE CONTROL */}
        <div className="mt-3 grid grid-cols-3 gap-2 pt-2 border-t border-dashed border-zinc-400 text-center text-[9px] sm:text-[10px] text-zinc-600 font-mono uppercase">
          <div className="p-1 border border-zinc-300 rounded">
            <span className="block font-bold text-black">1. CORTE Y PESPUNTE</span>
            <span className="block mt-3 border-t border-zinc-300 pt-0.5">Firma / Sello Habilitado</span>
          </div>
          <div className="p-1 border border-zinc-300 rounded">
            <span className="block font-bold text-black">2. FORRADO Y MONTADO</span>
            <span className="block mt-3 border-t border-zinc-300 pt-0.5">Firma / Sello Maquila</span>
          </div>
          <div className="p-1 border border-zinc-300 rounded">
            <span className="block font-bold text-black">3. ADORNADO Y REVISION</span>
            <span className="block mt-3 border-t border-zinc-300 pt-0.5">Firma / Sello Almacen</span>
          </div>
        </div>
      </div>
    </div>
  );
}
