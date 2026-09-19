'use client';

import { useState, useEffect } from 'react';
import { ProductionStore } from '@/lib/store';
import { TicketForrado, RecepcionForrado, InventarioCrudo } from '@/types/database';
import {
  Package,
  ArrowRightCircle,
  ArrowLeftCircle,
  CheckCircle2,
  AlertCircle,
  Plus,
  Save,
  Clock,
  CheckCircle
} from 'lucide-react';
import { formatMXN, formatDateShort } from '@/lib/utils';

export default function ForradoPlantaPage() {
  const [activeTab, setActiveTab] = useState<'insumos' | 'enviar' | 'recibir'>('insumos');

  // Estado
  const [inventario, setInventario] = useState<InventarioCrudo[]>([]);
  const [tickets, setTickets] = useState<TicketForrado[]>([]);
  const [recepciones, setRecepciones] = useState<RecepcionForrado[]>([]);
  const [maquileros, setMaquileros] = useState<{ id: string; nombre: string }[]>([]);

  // Formularios
  const [formInsumo, setFormInsumo] = useState({ tipo_material: '', cantidad: 0, unidad: 'pares' });
  const [formTicket, setFormTicket] = useState({ maquilero_id: '', pares_enviados: 0, pegamento: 0, forro: 0, notas: '' });
  const [formRecepcion, setFormRecepcion] = useState({ ticket_id: '', pares_recibidos: 0, notas: '' });

  // UI States
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const listMaq = ProductionStore.getMaquileros();
    setInventario(ProductionStore.getInventarioCrudo());
    setTickets(ProductionStore.getTicketsForrado());
    setRecepciones(ProductionStore.getRecepcionesForrado());
    setMaquileros(listMaq);

    setFormTicket((prev) => ({
      ...prev,
      maquilero_id: prev.maquilero_id || listMaq[0]?.id || '',
    }));
  };

  const showMessage = (msg: string, isError = false) => {
    if (isError) {
      setError(msg);
      setTimeout(() => setError(null), 4000);
    } else {
      setSuccess(msg);
      setTimeout(() => setSuccess(null), 4000);
    }
  };

  // 1. RECEPCIÓN DE INSUMOS
  const handleAltaInsumo = () => {
    if (!formInsumo.tipo_material || formInsumo.cantidad <= 0) {
      return showMessage('Ingresa nombre de material y cantidad válida', true);
    }
    
    // Ver si ya existe
    const existente = inventario.find(i => i.tipo_material.toLowerCase() === formInsumo.tipo_material.toLowerCase() && i.unidad_medida === formInsumo.unidad);
    
    if (existente) {
      ProductionStore.actualizarStockInsumo(existente.id, formInsumo.cantidad);
    } else {
      ProductionStore.agregarInsumoInventario(
        formInsumo.tipo_material,
        0,
        formInsumo.cantidad,
        formInsumo.unidad,
        'suela_planta_tacon'
      );
    }
    
    showMessage(`Se agregaron ${formInsumo.cantidad} ${formInsumo.unidad} de ${formInsumo.tipo_material}`);
    setFormInsumo({ tipo_material: '', cantidad: 0, unidad: 'pares' });
    loadData();
  };

  // 2. ENVIAR A FORRADO
  const handleCalcularConsumo = () => {
    // 65 pares = 1 litro de pegamento
    if (formTicket.pares_enviados > 0) {
      const litros = Number((formTicket.pares_enviados / 65).toFixed(2));
      // Asumimos un aproximado de metros de forro, ej: 1 metro por cada 10 pares
      const metrosForro = Number((formTicket.pares_enviados / 10).toFixed(2));
      setFormTicket(prev => ({ ...prev, pegamento: litros, forro: metrosForro }));
    }
  };

  const handleCrearTicket = () => {
    if (!formTicket.maquilero_id) {
      return showMessage('Selecciona un maquilero antes de crear el ticket', true);
    }

    if (formTicket.pares_enviados <= 0) {
      return showMessage('Los pares a enviar deben ser mayor a 0', true);
    }

    ProductionStore.crearTicketForrado({
      maquilero_id: formTicket.maquilero_id,
      pares_enviados: formTicket.pares_enviados,
      pegamento_consumido: formTicket.pegamento,
      forro_consumido: formTicket.forro,
      notas: formTicket.notas
    });

    // Descontar inventario (Simplificado para el MVP)
    // Buscamos algo de planta y descontamos
    const planta = inventario.find(i => i.tipo_material.toLowerCase().includes('planta') || i.unidad_medida === 'pares');
    if (planta && planta.cantidad_total >= formTicket.pares_enviados) {
       ProductionStore.actualizarStockInsumo(planta.id, -formTicket.pares_enviados);
    }

    showMessage('Ticket de forrado creado exitosamente');
    setFormTicket((prev) => ({ ...prev, pares_enviados: 0, pegamento: 0, forro: 0, notas: '' }));
    loadData();
    setActiveTab('recibir');
  };

  // 3. RECIBIR PLANTA FORRADA

  const handleRecibirParcialidad = () => {
    if (!formRecepcion.ticket_id || formRecepcion.pares_recibidos <= 0) {
      return showMessage('Selecciona un ticket y pon una cantidad válida', true);
    }

    const res = ProductionStore.recibirPlantaForrada(formRecepcion.ticket_id, formRecepcion.pares_recibidos, formRecepcion.notas);
    if (!res.exito) {
      return showMessage(res.error || 'Error al recibir', true);
    }

    // Agregar 'Planta Forrada' al inventario
    let plantaForrada = inventario.find(i => i.tipo_material === 'Planta Forrada');
    if (plantaForrada) {
      ProductionStore.actualizarStockInsumo(plantaForrada.id, formRecepcion.pares_recibidos);
    } else {
      ProductionStore.agregarInsumoInventario('Planta Forrada', 0, formRecepcion.pares_recibidos, 'pares', 'suela_planta_tacon');
    }

    showMessage(`Se recibieron ${formRecepcion.pares_recibidos} pares forrados`);
    setFormRecepcion({ ticket_id: '', pares_recibidos: 0, notas: '' });
    loadData();
  };


  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" />
            Forrado de Planta
          </h1>
          <p className="text-sm text-gray-500 mt-1">Control de consumos y recepciones parciales</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2 border border-red-200">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 text-emerald-700 p-4 rounded-lg flex items-center gap-2 border border-emerald-200">
          <CheckCircle2 className="w-5 h-5" />
          {success}
        </div>
      )}

      {/* Tabs Nav */}
      <div className="flex border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab('insumos')}
          className={`px-4 py-3 text-sm font-medium border-b-2 flex items-center gap-2 ${
            activeTab === 'insumos' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Plus className="w-4 h-4" /> Alta Insumos
        </button>
        <button
          onClick={() => setActiveTab('enviar')}
          className={`px-4 py-3 text-sm font-medium border-b-2 flex items-center gap-2 ${
            activeTab === 'enviar' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <ArrowRightCircle className="w-4 h-4" /> Enviar a Forrado
        </button>
        <button
          onClick={() => setActiveTab('recibir')}
          className={`px-4 py-3 text-sm font-medium border-b-2 flex items-center gap-2 ${
            activeTab === 'recibir' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <ArrowLeftCircle className="w-4 h-4" /> Recepción (Parcial/Total)
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        
        {/* TAB 1: ALTA INSUMOS */}
        {activeTab === 'insumos' && (
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Registrar Entrada de Material</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Material</label>
                <input
                  type="text"
                  placeholder="Ej. Planta Cruda, Pegamento..."
                  value={formInsumo.tipo_material}
                  onChange={(e) => setFormInsumo({ ...formInsumo, tipo_material: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Cantidad</label>
                <input
                  type="number"
                  min="0"
                  value={formInsumo.cantidad || ''}
                  onChange={(e) => setFormInsumo({ ...formInsumo, cantidad: Number(e.target.value) })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Unidad</label>
                <select
                  value={formInsumo.unidad}
                  onChange={(e) => setFormInsumo({ ...formInsumo, unidad: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700"
                >
                  <option value="pares">Pares</option>
                  <option value="litros">Litros</option>
                  <option value="metros">Metros</option>
                  <option value="piezas">Piezas</option>
                </select>
              </div>
              <div>
                <button
                  onClick={handleAltaInsumo}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Agregar Stock
                </button>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-semibold mb-3">Inventario Actual (Filtro Rápido)</h3>
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="bg-gray-50 dark:bg-gray-800 text-xs uppercase font-semibold text-gray-700 dark:text-gray-300">
                    <tr>
                      <th className="px-4 py-3">Material</th>
                      <th className="px-4 py-3 text-right">Cantidad Total</th>
                      <th className="px-4 py-3">Unidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventario.slice(0, 10).map((inv) => (
                      <tr key={inv.id} className="border-t border-gray-200 dark:border-gray-700">
                        <td className="px-4 py-2">{inv.tipo_material}</td>
                        <td className="px-4 py-2 text-right font-medium">{inv.cantidad_total}</td>
                        <td className="px-4 py-2">{inv.unidad_medida}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ENVIAR A FORRADO */}
        {activeTab === 'enviar' && (
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm max-w-2xl">
            <h2 className="text-lg font-semibold mb-4">Generar Ticket de Forrado</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Maquilero / Taller</label>
                <select
                  value={formTicket.maquilero_id}
                  onChange={(e) => setFormTicket({ ...formTicket, maquilero_id: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700"
                >
                  <option value="">-- Seleccionar maquilero --</option>
                  {maquileros.map((maq) => (
                    <option key={maq.id} value={maq.id}>{maq.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Pares a forrar (Planta Cruda)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={formTicket.pares_enviados || ''}
                    onChange={(e) => setFormTicket({ ...formTicket, pares_enviados: Number(e.target.value) })}
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700"
                  />
                  <button
                    onClick={handleCalcularConsumo}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium px-4 rounded-md transition border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    Auto-Calcular Materiales
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Calcula 1L Pegamento por cada 65 pares</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Pegamento a consumir (Litros)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formTicket.pegamento || ''}
                    onChange={(e) => setFormTicket({ ...formTicket, pegamento: Number(e.target.value) })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Forro a consumir (Metros)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formTicket.forro || ''}
                    onChange={(e) => setFormTicket({ ...formTicket, forro: Number(e.target.value) })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notas del Ticket</label>
                <textarea
                  value={formTicket.notas}
                  onChange={(e) => setFormTicket({ ...formTicket, notas: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700"
                  rows={2}
                />
              </div>

              <button
                onClick={handleCrearTicket}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" /> Generar Ticket y Descontar Insumos
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: RECIBIR PLANTA FORRADA */}
        {activeTab === 'recibir' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-1 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Registrar Entrega</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Ticket a Recibir</label>
                  <select
                    value={formRecepcion.ticket_id}
                    onChange={(e) => setFormRecepcion({ ...formRecepcion, ticket_id: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700"
                  >
                    <option value="">-- Seleccionar Ticket --</option>
                    {tickets.filter(t => t.estatus !== 'Completado').map(t => (
                      <option key={t.id} value={t.id}>
                        {t.folio} - Faltan: {t.pares_enviados - t.pares_recibidos} pares
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Pares Recibidos Hoy</label>
                  <input
                    type="number"
                    value={formRecepcion.pares_recibidos || ''}
                    onChange={(e) => setFormRecepcion({ ...formRecepcion, pares_recibidos: Number(e.target.value) })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Notas (Opcional)</label>
                  <input
                    type="text"
                    value={formRecepcion.notas}
                    onChange={(e) => setFormRecepcion({ ...formRecepcion, notas: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
                <button
                  onClick={handleRecibirParcialidad}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-md transition-colors"
                >
                  Registrar Recepción
                </button>
              </div>
            </div>

            <div className="lg:col-span-2">
              <h2 className="text-lg font-semibold mb-4">Tickets Activos</h2>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                {tickets.map(ticket => (
                  <div key={ticket.id} className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden">
                    {ticket.estatus === 'Completado' && (
                       <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">COMPLETADO</div>
                    )}
                    {ticket.estatus === 'Parcial' && (
                       <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">PARCIAL</div>
                    )}
                     {ticket.estatus === 'Pendiente' && (
                       <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">PENDIENTE</div>
                    )}

                    <div className="font-medium text-gray-900 dark:text-white">{ticket.folio}</div>
                    <div className="text-xs text-gray-500 mb-2">{ticket.fecha}</div>
                    
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Total Enviado:</span>
                      <span className="font-semibold">{ticket.pares_enviados} pares</span>
                    </div>

                    <div className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progreso ({ticket.pares_recibidos}/{ticket.pares_enviados})</span>
                        <span>{Math.round((ticket.pares_recibidos / ticket.pares_enviados) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div 
                          className={`h-2 rounded-full ${ticket.estatus === 'Completado' ? 'bg-emerald-500' : 'bg-blue-600'}`} 
                          style={{ width: `${Math.min(100, (ticket.pares_recibidos / ticket.pares_enviados) * 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-800 mt-2">
                      Insumos: {ticket.pegamento_consumido}L Pegamento, {ticket.forro_consumido}M Forro
                    </div>
                  </div>
                ))}
                {tickets.length === 0 && (
                  <div className="col-span-2 text-center text-gray-500 py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300">
                    No hay tickets de forrado.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
