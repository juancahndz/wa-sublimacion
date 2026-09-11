import React, { useState, useEffect } from 'react';
import { InventoryItem, InventoryCategory } from '../../types';
import { useStore } from '../../context/StoreContext';
import { X, Save, Boxes } from 'lucide-react';

interface InventoryFormModalProps {
  itemToEdit?: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InventoryFormModal: React.FC<InventoryFormModalProps> = ({ itemToEdit, isOpen, onClose }) => {
  const { addInventoryItem, updateInventoryItem, showToast } = useStore();

  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    sku: '',
    name: '',
    category: 'blancos_ceramica',
    currentStock: 50,
    minStockAlert: 15,
    unitCost: 2.00,
    unit: 'unidades',
    supplier: '',
    location: '',
    notes: ''
  });

  useEffect(() => {
    if (itemToEdit) {
      setFormData(itemToEdit);
    } else {
      const randNum = Math.floor(100 + Math.random() * 900);
      setFormData({
        sku: `INS-${randNum}`,
        name: '',
        category: 'blancos_ceramica',
        currentStock: 50,
        minStockAlert: 15,
        unitCost: 2.00,
        unit: 'unidades',
        supplier: '',
        location: '',
        notes: ''
      });
    }
  }, [itemToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.sku?.trim()) {
      showToast("Nombre y código SKU son requeridos.", "warning");
      return;
    }

    const finalItem: InventoryItem = {
      id: itemToEdit ? itemToEdit.id : `inv-${Date.now()}`,
      sku: formData.sku.toUpperCase(),
      name: formData.name,
      category: (formData.category || 'blancos_ceramica') as InventoryCategory,
      currentStock: Number(formData.currentStock) || 0,
      minStockAlert: Number(formData.minStockAlert) || 5,
      unitCost: Number(formData.unitCost) || 0,
      unit: (formData.unit || 'unidades') as any,
      supplier: formData.supplier || '',
      location: formData.location || '',
      notes: formData.notes || '',
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    if (itemToEdit) {
      updateInventoryItem(finalItem);
    } else {
      addInventoryItem(finalItem);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
        
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {itemToEdit ? 'Editar Insumo / Blanco' : 'Registrar Insumo en Inventario'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Código SKU *</label>
              <input
                type="text"
                required
                placeholder="Ej: BLA-TAZ-001"
                value={formData.sku || ''}
                onChange={e => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono uppercase"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Categoría</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white"
              >
                <option value="blancos_ceramica">Blancos Cerámica</option>
                <option value="blancos_textil">Blancos Textil</option>
                <option value="blancos_aluminio">Blancos Aluminio</option>
                <option value="blancos_polimero">Polímeros & Puzzles</option>
                <option value="tintas_papel">Tintas & Papel Sublimación</option>
                <option value="empaques_cintas">Cintas & Empaques</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Nombre del Insumo / Artículo *</label>
            <input
              type="text"
              required
              placeholder="Ej: Tazas Blancas AAA 11oz (Caja x 36)"
              value={formData.name || ''}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Stock Actual *</label>
              <input
                type="number"
                min="0"
                required
                value={formData.currentStock ?? 0}
                onChange={e => setFormData({ ...formData, currentStock: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Alerta Mínima *</label>
              <input
                type="number"
                min="1"
                required
                value={formData.minStockAlert ?? 5}
                onChange={e => setFormData({ ...formData, minStockAlert: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Unidad</label>
              <select
                value={formData.unit}
                onChange={e => setFormData({ ...formData, unit: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white"
              >
                <option value="unidades">Unidades</option>
                <option value="hojas">Hojas</option>
                <option value="cajas">Cajas</option>
                <option value="ml">Mililitros (ml)</option>
                <option value="rollos">Rollos</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Costo Unitario ($)</label>
              <input
                type="number"
                step="0.05"
                min="0"
                value={formData.unitCost ?? 0}
                onChange={e => setFormData({ ...formData, unitCost: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Ubicación en Taller</label>
              <input
                type="text"
                placeholder="Ej: Estante A-1, Gaveta 3"
                value={formData.location || ''}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Proveedor</label>
            <input
              type="text"
              placeholder="Ej: Cerámicas Sublimex, Textiles Andinos"
              value={formData.supplier || ''}
              onChange={e => setFormData({ ...formData, supplier: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Notas / Lote</label>
            <textarea
              rows={2}
              placeholder="Detalles sobre temperatura recomendada de planchado, lote..."
              value={formData.notes || ''}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md"
            >
              {itemToEdit ? 'Guardar Cambios' : 'Registrar Insumo'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
