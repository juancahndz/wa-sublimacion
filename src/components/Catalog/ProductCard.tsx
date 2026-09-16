import React from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Sparkles, Star, ArrowRight, Eye, Layers, Trash2, Edit3, Film } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onEdit?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView, onEdit }) => {
  const { startCustomizingProduct, settings, inventory, isAdminLoggedIn, deleteProduct } = useStore();

  // Check inventory stock status
  const linkedItem = inventory.find(inv => inv.id === product.linkedInventoryId);
  const isOutOfStock = linkedItem && linkedItem.currentStock <= 0;
  const isLowStock = linkedItem && linkedItem.currentStock > 0 && linkedItem.currentStock <= linkedItem.minStockAlert;

  const catMatch = (settings.customCategories || []).find(c => c.id === product.category);
  const categoryLabel = catMatch 
    ? catMatch.label.toUpperCase() 
    : product.category.replace('_', ' ').toUpperCase();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`¿Estás seguro de que deseas eliminar permanentemente el producto "${product.name}"?`)) {
      deleteProduct(product.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(product);
    }
  };

  return (
    <div 
      id={`product-card-${product.id}`}
      className={`bg-white border rounded-xl overflow-hidden group shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between relative ${
        isAdminLoggedIn ? 'border-indigo-200 ring-1 ring-indigo-100' : 'border-slate-200'
      }`}
    >
      {/* Admin Quick Action Floating Badge */}
      {isAdminLoggedIn && (
        <div className="absolute top-2 right-2 z-20 flex items-center gap-1 bg-slate-900/90 backdrop-blur-xs p-1 rounded-lg shadow-md">
          {onEdit && (
            <button
              onClick={handleEdit}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
              title="Editar este producto"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={handleDelete}
            className="p-1.5 text-rose-300 hover:text-white hover:bg-rose-600 rounded-md transition-colors cursor-pointer"
            title="Eliminar este producto"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Image Container */}
      <div 
        onClick={() => onQuickView(product)}
        className="aspect-4/3 bg-slate-100 relative overflow-hidden cursor-pointer"
      >
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />

        {/* Top Badges */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2 py-1 rounded text-[10px] font-bold text-slate-700 border border-slate-200 shadow-xs">
          {categoryLabel}
        </span>

        {/* Video Available Badge */}
        {product.videoUrl && (
          <span className="absolute bottom-3 left-3 bg-slate-900/90 text-indigo-300 backdrop-blur-xs px-2 py-0.5 rounded text-[9px] font-bold border border-indigo-500/30 flex items-center gap-1 shadow-xs">
            <Film className="w-2.5 h-2.5 text-indigo-400" />
            <span>Video</span>
          </span>
        )}

        {isOutOfStock && (
          <span className="absolute bottom-3 right-3 px-2 py-1 rounded text-[10px] font-bold bg-rose-500 text-white">
            AGOTADO
          </span>
        )}

        {/* Quick View Button */}
        {!isAdminLoggedIn && (
          <button
            onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
            className="absolute top-3 right-3 p-1.5 bg-white/90 hover:bg-white text-slate-700 rounded-lg border border-slate-200 shadow-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            title="Vista previa rápida"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 
              onClick={() => onQuickView(product)}
              className="font-bold text-slate-800 text-sm leading-snug group-hover:text-indigo-600 transition-colors line-clamp-1 cursor-pointer"
            >
              {product.name}
            </h3>
            <div className="flex items-center gap-0.5 text-amber-500 text-[11px] font-bold shrink-0">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
            {product.description}
          </p>
        </div>

        {/* Bottom Price & Button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-slate-400 block leading-none">Precio desde</span>
            <span className="font-bold text-indigo-600 text-base">
              {settings.currency}{product.basePrice.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {isAdminLoggedIn && (
              <button
                onClick={handleDelete}
                className="px-2 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer flex items-center gap-1"
                title="Eliminar artículo"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Eliminar</span>
              </button>
            )}

            <button
              onClick={() => onQuickView(product)}
              disabled={isOutOfStock}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Ver Artículo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
