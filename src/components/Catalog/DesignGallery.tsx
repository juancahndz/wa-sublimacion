import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { DesignTemplate, Product } from '../../types';
import { 
  Palette, 
  Sparkles, 
  Search, 
  Tag, 
  ArrowRight, 
  Layers, 
  X, 
  Check, 
  ShoppingBag, 
  MessageCircle, 
  CheckCircle2
} from 'lucide-react';

export const DesignGallery: React.FC = () => {
  const { designTemplates, products, addToCart, settings, showToast } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTemplateForModal, setSelectedTemplateForModal] = useState<DesignTemplate | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);

  const categories = [
    { id: 'all', label: 'Todos los Diseños' },
    { id: 'anime', label: '🌸 Anime & Manga' },
    { id: 'gaming', label: '🎮 Gamer & Arcade' },
    { id: 'parejas', label: '❤️ Parejas & Amor' },
    { id: 'frases', label: '☕ Frases & Humor' },
    { id: 'mascotas', label: '🐾 Mascotas' },
    { id: 'musica', label: '🎸 Música & Rock' },
    { id: 'empresas', label: '💼 Negocios & Logos' },
    { id: 'festividades', label: '🎓 Graduaciones & Fechas' }
  ];

  const filteredDesigns = useMemo(() => {
    return designTemplates.filter(des => {
      const matchesCat = selectedCategory === 'all' || des.category === selectedCategory;
      const matchesQuery = 
        des.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        des.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesQuery;
    });
  }, [designTemplates, selectedCategory, searchQuery]);

  const handleOpenModal = (template: DesignTemplate) => {
    setSelectedTemplateForModal(template);
    // Default to first compatible or available product
    setSelectedProduct(products[0] || null);
    setSelectedVariant({});
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!selectedTemplateForModal || !selectedProduct) return;

    addToCart(selectedProduct, quantity, selectedVariant, {
      uploadedImageUrl: selectedTemplateForModal.imageUrl,
      selectedTemplateId: selectedTemplateForModal.id,
      position: 'frente',
      printFinish: 'brillante'
    });

    showToast(`"${selectedTemplateForModal.title}" en ${selectedProduct.name} añadido al carrito.`, 'success');
    setSelectedTemplateForModal(null);
  };

  const handleWhatsAppOrder = () => {
    if (!selectedTemplateForModal || !selectedProduct) return;

    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const variantList = Object.entries(selectedVariant).map(([k, v]) => `${k}: ${v}`).join(', ');
    const totalPrice = (selectedProduct.basePrice * quantity).toFixed(2);

    const textMsg = encodeURIComponent(
      `¡Hola ${settings.storeName}! 👋\n` +
      `Deseo ordenar el siguiente diseño de catálogo en existencia:\n\n` +
      `🎨 *Diseño:* ${selectedTemplateForModal.title} (Cat: ${selectedTemplateForModal.category})\n` +
      `📦 *Artículo:* ${selectedProduct.name}\n` +
      `⚙️ *Opciones:* ${variantList || 'Estándar'}\n` +
      `🔢 *Cantidad:* ${quantity} unidad(es)\n` +
      `💰 *Total estimado:* ${settings.currency}${totalPrice}\n\n` +
      `¿Tienen stock disponible para entrega?`
    );

    window.open(`https://wa.me/${cleanNumber}?text=${textMsg}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              <Palette className="w-3.5 h-3.5" />
              <span>Galería de Diseños en Existencia</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Diseños Exclusivos Listos para Entrega
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Elige tu diseño favorito y el producto en el que deseas recibirlo con sublimación HD indeleble.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por temática, anime, gaming..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100/90 border border-slate-200 rounded-full py-2 px-10 text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Categories Pill Bar */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-indigo-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Designs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredDesigns.map(design => (
            <div 
              key={design.id}
              className="group bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
            >
              {/* Image Preview Container */}
              <div 
                onClick={() => handleOpenModal(design)}
                className="relative aspect-square bg-slate-900 overflow-hidden cursor-pointer"
              >
                <img 
                  src={design.imageUrl} 
                  alt={design.title} 
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />

                {/* Gradient and overlay */}
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleOpenModal(design); }}
                    className="w-full py-2 px-3 bg-white text-slate-900 rounded-lg text-xs font-bold shadow-xs flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-indigo-600" />
                    Comprar con este Diseño
                  </button>
                </div>

                {design.popular && (
                  <span className="absolute top-3 left-3 bg-pink-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
                    Popular
                  </span>
                )}
              </div>

              {/* Design Meta */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block mb-0.5">
                    {design.category}
                  </span>
                  <h3 
                    onClick={() => handleOpenModal(design)}
                    className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors line-clamp-1 cursor-pointer"
                  >
                    {design.title}
                  </h3>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {design.tags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Button */}
                <div className="pt-3 mt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleOpenModal(design)}
                    className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Elegir Artículo y Comprar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Select Product and Direct Order Modal */}
      {selectedTemplateForModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8">
            <button
              onClick={() => setSelectedTemplateForModal(null)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100">
              <img 
                src={selectedTemplateForModal.imageUrl} 
                alt="" 
                className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase">Diseño de Catálogo</span>
                <h3 className="text-base font-bold text-slate-900">{selectedTemplateForModal.title}</h3>
                <p className="text-xs text-slate-500">Sublimación de alta durabilidad lista para estampar</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Step 1: Select Product */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. Selecciona el artículo base:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
                  {products.map(prod => (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => {
                        setSelectedProduct(prod);
                        setSelectedVariant({});
                      }}
                      className={`flex flex-col p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedProduct.id === prod.id
                          ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-200'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <img 
                        src={prod.images[0]} 
                        alt={prod.name} 
                        className="w-full h-20 object-cover rounded-lg mb-1.5"
                        referrerPolicy="no-referrer"
                      />
                      <h4 className="text-xs font-bold text-slate-900 truncate">{prod.name}</h4>
                      <span className="text-xs font-black text-indigo-600 mt-0.5">
                        {settings.currency}{prod.basePrice.toFixed(2)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step: Quantity & Price */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-700 block">Cantidad:</span>
                  <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 overflow-hidden mt-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-slate-600 hover:bg-slate-200 text-sm font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 text-xs font-bold text-slate-900 bg-white min-w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 text-slate-600 hover:bg-slate-200 text-sm font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block">Total a pagar:</span>
                  <span className="text-2xl font-black text-indigo-600">
                    {settings.currency}{(selectedProduct.basePrice * quantity).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Direct Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Añadir al Carrito
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  Pedir por WhatsApp
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
