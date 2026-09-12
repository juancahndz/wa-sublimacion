import React, { useState, useEffect, useMemo } from 'react';
import { Product, DesignTemplate } from '../../types';
import { useStore } from '../../context/StoreContext';
import { ProductFormModal } from '../Admin/ProductFormModal';
import { 
  ArrowLeft,
  X, 
  Check, 
  Star, 
  ShoppingBag, 
  Printer, 
  MessageCircle, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  Palette, 
  Sparkles, 
  Trash2, 
  Edit3, 
  ShieldCheck, 
  Image as ImageIcon 
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { designTemplates, addToCart, settings, inventory, showToast, isAdminLoggedIn, deleteProduct } = useStore();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedVariantOptions, setSelectedVariantOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [selectedDesign, setSelectedDesign] = useState<DesignTemplate | null>(null);
  const [galleryTab, setGalleryTab] = useState<'product_images' | 'templates'>('product_images');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Filter designs specifically available/compatible for this product
  const compatibleDesigns = useMemo(() => {
    if (!product) return [];
    const list = designTemplates.filter(d => 
      d.compatibleMockups?.includes(product.mockupType) ||
      (d.tags && d.tags.some(t => product.tags.includes(t) || product.category.includes(t)))
    );
    return list.length > 0 ? list : designTemplates;
  }, [designTemplates, product]);

  // Set initial state when opening product: always show the product's uploaded photos first!
  useEffect(() => {
    setSelectedDesign(null);
    setSelectedVariantOptions({});
    setQuantity(1);
    setSelectedImageIdx(0);
    setGalleryTab('product_images');
  }, [product]);

  if (!product) return null;

  const linkedItem = inventory.find(inv => inv.id === product.linkedInventoryId);
  const availableStock = linkedItem ? linkedItem.currentStock : 99;
  const isOutOfStock = linkedItem && linkedItem.currentStock <= 0;
  const isLowStock = linkedItem && linkedItem.currentStock > 0 && linkedItem.currentStock <= linkedItem.minStockAlert;

  // Calculate dynamic price
  let variantExtra = 0;
  Object.entries(selectedVariantOptions).forEach(([_, valName]) => {
    const found = product.variants?.find(v => v.name === valName);
    if (found) variantExtra += found.priceModifier;
  });

  const unitPrice = product.basePrice + variantExtra;
  const totalPrice = unitPrice * quantity;

  // Active display image
  const displayImage = selectedDesign ? selectedDesign.imageUrl : (product.images[selectedImageIdx] || product.images[0]);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const activeImage = selectedDesign ? selectedDesign.imageUrl : (product.images[selectedImageIdx] || product.images[0]);

    addToCart(product, quantity, selectedVariantOptions, {
      uploadedImageUrl: activeImage,
      selectedTemplateId: selectedDesign ? selectedDesign.id : undefined,
      position: 'frente',
      printFinish: 'brillante'
    });

    showToast(`"${product.name}${selectedDesign ? ` (${selectedDesign.title})` : ''}" añadido al carrito.`, 'success');
    onClose();
  };

  const handleWhatsAppOrder = () => {
    if (isOutOfStock) return;
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const variantList = Object.entries(selectedVariantOptions).map(([k, v]) => `${k}: ${v}`).join(', ');
    const textMsg = encodeURIComponent(
      `¡Hola ${settings.storeName}! 👋\n` +
      `Me interesa comprar el siguiente artículo en existencia:\n\n` +
      `📦 *Artículo:* ${product.name}\n` +
      (selectedDesign ? `🎨 *Diseño elegido:* ${selectedDesign.title} (${selectedDesign.category})\n` : '') +
      `⚙️ *Opciones:* ${variantList || 'Estándar'}\n` +
      `🔢 *Cantidad:* ${quantity} unidad(es)\n` +
      `💰 *Total:* ${settings.currency}${totalPrice.toFixed(2)}\n\n` +
      `¿Tienen stock disponible para entrega inmediata?`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${textMsg}`, '_blank');
  };

  const handleDeleteProduct = () => {
    if (!product) return;
    if (confirm(`¿Estás seguro de que deseas eliminar permanentemente el producto "${product.name}"?`)) {
      deleteProduct(product.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8">
        
        {/* Top Header Bar with Back Arrow and Close */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-bold text-xs transition-all cursor-pointer shadow-2xs group"
            title="Regresar al Catálogo"
            id="product-modal-back-btn"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-600 group-hover:-translate-x-0.5 transition-transform" />
            <span>Volver al Catálogo</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Bar inside Modal */}
        {isAdminLoggedIn && (
          <div className="mb-6 -mt-2 p-3 bg-slate-900 text-white rounded-2xl flex flex-wrap items-center justify-between gap-3 border border-slate-800 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-slate-200">Acciones de Administrador</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar Producto</span>
              </button>
              <button
                type="button"
                onClick={handleDeleteProduct}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eliminar Producto</span>
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left: Main Image Preview & Product Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative group">
              <img 
                src={displayImage} 
                alt={selectedDesign?.title || product.name} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />

              {/* Design or Photo overlay badge */}
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                {selectedDesign ? `Diseño: ${selectedDesign.title}` : `Foto ${selectedImageIdx + 1} de ${product.images?.length || 1}`}
              </div>

              <span className={`absolute bottom-3 left-3 px-2.5 py-1 rounded text-[11px] font-bold shadow-xs ${
                isOutOfStock 
                  ? 'bg-rose-500 text-white' 
                  : isLowStock 
                  ? 'bg-amber-500 text-white' 
                  : 'bg-emerald-500 text-white'
              }`}>
                {isOutOfStock ? 'Agotado' : isLowStock ? `Últimas ${availableStock} pzs` : `En Existencia (${availableStock} disponibles)`}
              </span>
            </div>

            {/* Thumbnail strip on the left if multiple photos exist */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 pt-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedImageIdx(idx);
                      setSelectedDesign(null);
                      setGalleryTab('product_images');
                    }}
                    className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      !selectedDesign && selectedImageIdx === idx
                        ? 'border-indigo-600 ring-2 ring-indigo-200 scale-95'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}

            {/* Sublimation print area badge */}
            <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center gap-2 text-xs text-indigo-900">
              <Printer className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Estampado por sublimación térmica HD indeleble</span>
            </div>

            {/* Features Checklist */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-xs text-slate-600">
              <span className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
                Características del artículo:
              </span>
              <ul className="space-y-1">
                {product.features?.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Images & Design Picker, Options & Purchase */}
          <div className="md:col-span-7 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {product.category.replace('_', ' ')}
                </span>
                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-slate-400 font-normal">({product.reviewCount} opiniones)</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                {product.name}
              </h2>

              <div className="text-2xl font-black text-indigo-600 mt-1">
                {settings.currency}{unitPrice.toFixed(2)}
              </div>
            </div>

            {/* Article Photos & Design Picker Section */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setGalleryTab('product_images');
                      setSelectedDesign(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      galleryTab === 'product_images'
                        ? 'bg-white text-indigo-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Fotos del Artículo ({product.images?.length || 0})</span>
                  </button>

                  {compatibleDesigns.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setGalleryTab('templates')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        galleryTab === 'templates'
                          ? 'bg-white text-indigo-600 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Palette className="w-3.5 h-3.5" />
                      <span>Catálogo de Diseños ({compatibleDesigns.length})</span>
                    </button>
                  )}
                </div>

                {galleryTab === 'product_images' && (
                  <span className="text-[11px] font-semibold text-indigo-600">
                    Foto #{selectedImageIdx + 1}
                  </span>
                )}
                {galleryTab === 'templates' && selectedDesign && (
                  <span className="text-[11px] font-semibold text-indigo-600 truncate max-w-[150px]">
                    ✓ {selectedDesign.title}
                  </span>
                )}
              </div>

              {/* Tab 1: Product Uploaded Images */}
              {galleryTab === 'product_images' && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-52 overflow-y-auto pr-1">
                  {product.images?.map((img, idx) => {
                    const isSelected = !selectedDesign && selectedImageIdx === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedImageIdx(idx);
                          setSelectedDesign(null);
                        }}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 text-left transition-all group cursor-pointer ${
                          isSelected 
                            ? 'border-indigo-600 ring-2 ring-indigo-300 scale-95 shadow-md' 
                            : 'border-slate-200 hover:border-indigo-400'
                        }`}
                      >
                        <img 
                          src={img} 
                          alt={`Foto ${idx + 1}`} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                          <span className="text-[10px] font-bold text-white leading-tight">
                            Foto {idx + 1}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-indigo-600 text-white rounded-full p-0.5 shadow">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Tab 2: Design Templates */}
              {galleryTab === 'templates' && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-52 overflow-y-auto pr-1">
                  {compatibleDesigns.map(design => {
                    const isSelected = selectedDesign?.id === design.id;
                    return (
                      <button
                        key={design.id}
                        type="button"
                        onClick={() => setSelectedDesign(design)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 text-left transition-all group cursor-pointer ${
                          isSelected 
                            ? 'border-indigo-600 ring-2 ring-indigo-300 scale-95 shadow-md' 
                            : 'border-slate-200 hover:border-indigo-400'
                        }`}
                      >
                        <img 
                          src={design.imageUrl} 
                          alt={design.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-1.5">
                          <span className="text-[10px] font-bold text-white leading-tight line-clamp-2">
                            {design.title}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-indigo-600 text-white rounded-full p-0.5 shadow">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quantity Selector & Subtotal */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">Cantidad:</span>
                <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 text-sm font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-bold text-slate-900 bg-white min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={Boolean(linkedItem && quantity >= linkedItem.currentStock)}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 text-sm font-bold cursor-pointer disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-500 block">Total a pagar:</span>
                <span className="font-black text-slate-900 text-2xl">{settings.currency}{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-2.5">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isOutOfStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {isOutOfStock 
                    ? 'Producto Agotado' 
                    : selectedDesign 
                    ? `Añadir al Carrito (${selectedDesign.title})` 
                    : 'Añadir al Carrito'}
                </span>
              </button>

              <button
                onClick={handleWhatsAppOrder}
                disabled={isOutOfStock}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                Consultar / Pedir por WhatsApp
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <ProductFormModal
          isOpen={isEditModalOpen}
          productToEdit={product}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};
