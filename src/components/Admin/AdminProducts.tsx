import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { ProductFormModal } from './ProductFormModal';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Star, 
  Sparkles, 
  Printer, 
  Search,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const { products, deleteProduct, updateProduct, inventory, settings, showToast } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`¿Seguro que deseas eliminar el producto "${name}" del catálogo?`)) {
      deleteProduct(id);
    }
  };

  const handleToggleFeatured = (product: Product) => {
    updateProduct({ ...product, featured: !product.featured });
    showToast(`Producto ${product.featured ? 'removido de' : 'agregado a'} destacados.`, 'info');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar producto por nombre..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <button
          onClick={handleOpenAdd}
          id="admin-add-product-btn"
          className="w-full sm:w-auto py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Subir Nuevo Producto
        </button>
      </div>

      {/* Products Table/Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Producto ({filtered.length})</th>
                  <th className="py-3.5 px-4">Categoría</th>
                  <th className="py-3.5 px-4">Precio Base</th>
                  <th className="py-3.5 px-4">Simulador 3D</th>
                  <th className="py-3.5 px-4">Insumo Stock</th>
                  <th className="py-3.5 px-4">Destacado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map(product => {
                  const linkedInv = inventory.find(inv => inv.id === product.linkedInventoryId);
                  return (
                    <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={product.images[0]} 
                            alt="" 
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{product.name}</div>
                            <div className="text-[11px] text-slate-400">
                              Área: {product.sublimationAreaText}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium text-[11px]">
                          {(settings.customCategories || []).find(c => c.id === product.category)?.label || product.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-black text-slate-900">
                        {settings.currency}{product.basePrice.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-indigo-600">
                        {product.mockupType}
                      </td>
                      <td className="py-3.5 px-4">
                        {linkedInv ? (
                          <span className={`text-[11px] font-bold ${
                            linkedInv.currentStock <= linkedInv.minStockAlert ? 'text-rose-600' : 'text-emerald-700'
                          }`}>
                            {linkedInv.currentStock} {linkedInv.unit}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">Sin vincular</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleFeatured(product)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            product.featured ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-slate-400'
                          }`}
                          title="Alternar destacado"
                        >
                          <Star className={`w-4 h-4 ${product.featured ? 'fill-amber-400' : ''}`} />
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(product)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium flex items-center gap-1"
                            title="Editar producto"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Editar</span>
                          </button>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors font-medium flex items-center gap-1"
                            title="Eliminar producto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 p-6 space-y-4">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">No hay productos en esta lista</h3>
              <p className="text-xs text-slate-500 mt-1">
                {searchQuery ? `No hay resultados para "${searchQuery}".` : 'Aún no has agregado ningún producto al catálogo.'}
              </p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Subir Primer Producto</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        productToEdit={editingProduct}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
      />

    </div>
  );
};
