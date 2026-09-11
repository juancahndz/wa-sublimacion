import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';
import { OrderDetailModal } from './OrderDetailModal';
import { 
  Search, 
  Filter, 
  Eye, 
  Clock, 
  CheckCircle2, 
  Printer, 
  Truck, 
  Package, 
  AlertCircle,
  FileText
} from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { orders, settings } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);

  const statusList: { key: string; label: string }[] = [
    { key: 'all', label: 'Todos los Pedidos' },
    { key: 'recibido', label: '📥 Recibidos' },
    { key: 'arte_aprobacion', label: '🎨 Arte Aprobado' },
    { key: 'sublimando', label: '🖨️ Sublimando' },
    { key: 'control_calidad', label: '✨ Control Calidad' },
    { key: 'listo_despacho', label: '🚚 En Despacho' },
    { key: 'entregado', label: '✅ Entregados' },
    { key: 'cancelado', label: '❌ Cancelados' },
  ];

  const filteredOrders = useMemo(() => {
    return orders.filter(ord => {
      const matchesStatus = statusFilter === 'all' || ord.status === statusFilter;
      const clean = searchQuery.toLowerCase();
      const matchesSearch = 
        ord.trackingCode.toLowerCase().includes(clean) ||
        ord.customer.name.toLowerCase().includes(clean) ||
        ord.customer.phone.includes(clean) ||
        ord.customer.city.toLowerCase().includes(clean);
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'recibido':
        return <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-[11px] font-bold">Recibido</span>;
      case 'arte_aprobacion':
        return <span className="bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full text-[11px] font-bold">Arte Aprobado</span>;
      case 'sublimando':
        return <span className="bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full text-[11px] font-bold animate-pulse">Sublimando</span>;
      case 'control_calidad':
        return <span className="bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-full text-[11px] font-bold">Control Calidad</span>;
      case 'listo_despacho':
        return <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-[11px] font-bold">En Despacho</span>;
      case 'entregado':
        return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[11px] font-bold">Entregado</span>;
      case 'cancelado':
        return <span className="bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full text-[11px] font-bold">Cancelado</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 w-full sm:w-auto no-scrollbar">
          {statusList.map(item => (
            <button
              key={item.key}
              onClick={() => setStatusFilter(item.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === item.key
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por código, cliente, teléfono..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Código</th>
                <th className="py-3.5 px-4">Fecha</th>
                <th className="py-3.5 px-4">Cliente</th>
                <th className="py-3.5 px-4">Artículos</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Pago</th>
                <th className="py-3.5 px-4">Estado Producción</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {order.trackingCode}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{order.customer.name}</div>
                      <div className="text-[11px] text-slate-400">{order.customer.city}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-800">
                          {order.items.reduce((s, i) => s + i.quantity, 0)} u.
                        </span>
                        <span className="text-[11px] text-slate-400">
                          ({order.items.map(i => i.product.name.split(' ')[0]).join(', ')})
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900">
                      {settings.currency}{order.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        order.paymentStatus === 'verificado'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.paymentStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrderForModal(order)}
                        className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition-colors font-bold cursor-pointer"
                        title="Ver detalles, arte y cambiar estado"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No se encontraron pedidos con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail & Workflow Modal */}
      <OrderDetailModal
        order={selectedOrderForModal}
        onClose={() => setSelectedOrderForModal(null)}
      />

    </div>
  );
};
