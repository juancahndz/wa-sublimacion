import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { InventoryItem, InventoryCategory } from '../../types';
import { InventoryFormModal } from './InventoryFormModal';
import { 
  Plus, 
  Search, 
  AlertTriangle, 
  Boxes, 
  Edit3, 
  Trash2, 
  TrendingDown, 
  CheckCircle2,
  DollarSign
} from 'lucide-react';

export const AdminInventory: React.FC = () => {
  const { inventory, updateInventoryStock, deleteInventoryItem, settings } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const categories = [
    { id: 'all', label: 'Todos los Insumos' },
    { id: 'blancos_ceramica', label: '☕ Cerámica' },
    { id: 'blancos_textil', label: '👕 Textil' },
    { id: 'blancos_aluminio', label: '🥤 Aluminio' },
    { id: 'blancos_polimero', label: '🧩 Polímeros' },
    { id: 'tintas_papel', label: '🎨 Tintas & Papel' },
    { id: 'empaques_cintas', label: '📦 Cintas & Empaques' }
  ];

  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStockAlert);

  const filtered = inventory.filter(item => {
    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
    const cleanSearch = searchQuery.toLowerCase();
    const matchesSearch = 
      item.name.toLowerCase().includes(cleanSearch) ||
      item.sku.toLowerCase().includes(cleanSearch) ||
      (item.supplier ? item.supplier.toLowerCase().includes(cleanSearch) : false);
    return matchesCat && matchesSearch;
  });

  const totalValuation = inventory.reduce((acc, curr) => acc + (curr.currentStock * curr.unitCost), 0);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`¿Eliminar el insumo "${name}" del inventario?`)) {
      deleteInventoryItem(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Low Stock Warning Banner if any */}
      {lowStockItems.length > 0 && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3 text-xs text-amber-950">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold">¡Atención! Hay {lowStockItems.length} insumos con stock crítico</h4>
            <p className="text-amber-800 mt-0.5">
              Los siguientes insumos están por agotarse: {lowStockItems.map(i => `${i.name} (${i.currentStock} ${i.unit})`).join(', ')}.
            </p>
          </div>
        </div>
      )}

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-semibold block">Total Insumos Registrados</span>
            <span className="text-lg font-bold text-slate-900">{inventory.length} referencias</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-semibold block">Valoración de Stock en Taller</span>
            <span className="text-lg font-bold text-slate-900">{settings.currency}{totalValuation.toFixed(2)}</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
            lowStockItems.length > 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-semibold block">Insumos en Nivel Crítico</span>
            <span className={`text-lg font-bold ${lowStockItems.length > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
              {lowStockItems.length} por reabastecer
            </span>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 w-full sm:w-auto no-scrollbar">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setCategoryFilter(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                categoryFilter === c.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar SKU, insumo, proveedor..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            id="admin-add-inventory-btn"
            className="py-2 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            Nuevo Insumo
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Insumo / Blanco</th>
                <th className="py-3.5 px-4">Categoría</th>
                <th className="py-3.5 px-4">Stock Actual</th>
                <th className="py-3.5 px-4">Ajuste Rápido</th>
                <th className="py-3.5 px-4">Costo U.</th>
                <th className="py-3.5 px-4">Ubicación</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map(item => {
                const isCritical = item.currentStock <= item.minStockAlert;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">
                      {item.sku}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-slate-400">Prov: {item.supplier || 'N/A'}</div>
                    </td>
                    <td className="py-3.5 px-4 capitalize text-[11px] text-slate-500">
                      {item.category.replace('blancos_', '').replace('_', ' ')}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-black ${
                          isCritical ? 'text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200' : 'text-slate-900'
                        }`}>
                          {item.currentStock} {item.unit}
                        </span>
                        {isCritical && (
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" title="Por debajo del mínimo" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Mínimo: {item.minStockAlert}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateInventoryStock(item.id, -5)}
                          className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-bold"
                          title="Restar 5"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => updateInventoryStock(item.id, -1)}
                          className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-bold"
                          title="Restar 1"
                        >
                          -1
                        </button>
                        <button
                          onClick={() => updateInventoryStock(item.id, 1)}
                          className="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded font-bold"
                          title="Sumar 1"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => updateInventoryStock(item.id, 10)}
                          className="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded font-bold"
                          title="Sumar 10"
                        >
                          +10
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {settings.currency}{item.unitCost.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-[11px] text-slate-500">
                      {item.location || 'Estante Principal'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                          title="Editar insumo"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
                          title="Eliminar insumo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Modal */}
      <InventoryFormModal
        isOpen={isModalOpen}
        itemToEdit={editingItem}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
      />

    </div>
  );
};
