import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { ProductDetailModal } from './ProductDetailModal';
import { ProductFormModal } from '../Admin/ProductFormModal';
import { EditCatalogSectionModal } from '../Admin/EditCatalogSectionModal';
import { Product, ProductCategory } from '../../types';
import { 
  Search, 
  Sparkles, 
  Filter, 
  ArrowUpDown, 
  SlidersHorizontal,
  Flame,
  Layers,
  Printer,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Store,
  Palette,
  Plus,
  Settings,
  Lock,
  Edit3
} from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const { 
    products, 
    setActiveView, 
    isAdminLoggedIn, 
    setIsAdminAuthModalOpen, 
    setAdminTab, 
    settings,
    selectedCategory,
    setSelectedCategory
  } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating'>('featured');
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditSectionModalOpen, setIsEditSectionModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormModalOpen(true);
  };

  const categories = useMemo(() => {
    if (settings.customCategories && settings.customCategories.length > 0) {
      return settings.customCategories;
    }
    return [{ id: 'all', label: 'Todos los Artículos' }];
  }, [settings.customCategories]);

  // If the active selected category was deleted, fallback smoothly to 'all'
  React.useEffect(() => {
    const exists = categories.some(c => c.id === selectedCategory);
    if (!exists) {
      setSelectedCategory('all');
    }
  }, [categories, selectedCategory]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesSearch = 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.basePrice - b.basePrice;
        if (sortBy === 'price_desc') return b.basePrice - a.basePrice;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50/50">
      
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-16 sm:py-24">
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-pink-500/20 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-pink-300">
                <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
                <span>Sublimación & Diseños Exclusivos en Existencia</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none text-white">
                {settings.heroTitle ? (
                  settings.heroTitle
                ) : (
                  <>
                    Diseños Disponibles en <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">Tazas, Ropa y Accesorios</span>
                  </>
                )}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                {settings.heroSubtitle || "Explora nuestras colecciones en existencia listas para entrega inmediata. Impresión fotográfica indeleble de alta definición."}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => {
                    const catalogEl = document.getElementById('catalog-section');
                    if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  id="hero-view-catalog-btn"
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-indigo-900/40 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Store className="w-4 h-4" />
                  Ver Productos en Stock
                </button>

                <button
                  onClick={() => setActiveView('designs')}
                  id="hero-view-designs-btn"
                  className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Palette className="w-4 h-4" />
                  Galería de Diseños
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Fast trust points */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Sin pedido mínimo (desde 1 pz)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Tintas UltraChrome resistentes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Seguimiento paso a paso</span>
                </div>
              </div>
            </div>

            {/* Right Hero Graphic Showcase */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-sm aspect-square rounded-3xl bg-gradient-to-tr from-white/10 to-white/5 border border-white/15 p-4 shadow-2xl backdrop-blur-md flex items-center justify-center group">
                <img 
                  src={settings.heroImageUrl || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80"} 
                  alt="Imagen destacada de sublimación" 
                  className="w-full h-full object-cover rounded-2xl shadow-inner"
                  referrerPolicy="no-referrer"
                />
                
                {/* Admin Quick Edit Hero Image Button */}
                {isAdminLoggedIn && (
                  <button
                    onClick={() => setIsEditSectionModalOpen(true)}
                    className="absolute top-6 right-6 px-3 py-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-lg border border-white/20 backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 z-20"
                    title="Cambiar imagen y textos de portada"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-pink-400" />
                    <span>Editar Imagen</span>
                  </button>
                )}

                {/* Floating mini badge */}
                <div className="absolute -bottom-4 -left-4 bg-white text-slate-900 p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 z-10">
                  <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-black">
                    {settings.heroBadgeTag || "HD"}
                  </div>
                  <div>
                    <div className="text-xs font-bold">{settings.heroBadgeTitle || "Sublimación Térmica"}</div>
                    <div className="text-[11px] text-slate-500">{settings.heroBadgeSubtitle || "200°C / Presión Uniforme"}</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Catalog & Filter Section */}
      <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Admin Quick Bar - Only shown to authenticated Admin */}
        {isAdminLoggedIn && (
          <div className="mb-6 p-4 bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl text-white shadow-md border border-indigo-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 font-bold shrink-0">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-indigo-300">Modo Administrador Activo</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-xs text-slate-300">
                  Botones de <strong>Eliminar</strong> y <strong>Editar</strong> habilitados en cada tarjeta. O agrega un nuevo artículo aquí:
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleOpenAddProduct}
                id="catalog-admin-add-product-btn"
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Agregar Nuevo Producto</span>
              </button>

              <button
                onClick={() => { setActiveView('admin'); setAdminTab('products'); }}
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Panel Admin</span>
              </button>
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {settings.catalogTitle || "Catálogo de Productos en Existencia"}
              </h2>
              {isAdminLoggedIn && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsEditSectionModalOpen(true)}
                    id="edit-catalog-header-btn"
                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                    title="Editar título, descripción y categorías del catálogo"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Editar Sección</span>
                  </button>
                  <button
                    onClick={handleOpenAddProduct}
                    className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nuevo Producto</span>
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {settings.catalogSubtitle || "Explora los artículos disponibles en stock con estampados listos para envío."}
            </p>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search input with rounded-full pill */}
            <div className="relative min-w-[260px] flex-1 sm:flex-initial">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar diseños o productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100/90 border border-slate-200 rounded-full py-2 px-10 text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-xs text-xs font-semibold text-slate-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent focus:outline-none cursor-pointer text-xs"
              >
                <option value="featured">Destacados</option>
                <option value="price_asc">Menor Precio</option>
                <option value="price_desc">Mayor Precio</option>
                <option value="rating">Mejor Calificación</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
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

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setDetailProduct(p)}
                onEdit={handleOpenEditProduct}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-8 space-y-3">
            <Search className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No se encontraron productos</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Intenta con otra palabra clave o restablece los filtros de categoría para ver todos los artículos.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                Restablecer Filtros
              </button>
              {isAdminLoggedIn && (
                <button
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Subir Nuevo Producto</span>
                </button>
              )}
            </div>
          </div>
        )}

      </section>

      {/* Quick View Modal */}
      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
      />

      {/* Admin Product Form Modal (Add / Edit) */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        productToEdit={editingProduct}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingProduct(null);
        }}
      />

      {/* Admin Catalog Section & Categories Modal */}
      <EditCatalogSectionModal
        isOpen={isEditSectionModalOpen}
        onClose={() => setIsEditSectionModalOpen(false)}
      />
    </div>
  );
};
