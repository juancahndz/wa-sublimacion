import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { CategoryOption } from '../../types';
import { ArrowLeft, X, Plus, Trash2, RotateCcw, Check, Sparkles, SlidersHorizontal, Upload, Image as ImageIcon } from 'lucide-react';
import { compressImageFile } from '../../utils/imageCompressor';

interface EditCatalogSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditCatalogSectionModal: React.FC<EditCatalogSectionModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, showToast } = useStore();

  const defaultCategories: CategoryOption[] = [
    { id: 'all', label: 'Todos los Artículos' },
    { id: 'tazas', label: '☕ Tazas & Cerámica' },
    { id: 'textil', label: '👕 Camisetas & Hoodies' },
    { id: 'botellas_termos', label: '🥤 Botellas & Termos' },
    { id: 'accesorios_gamer', label: '🎮 Mousepads Gamer' },
    { id: 'gorras', label: '🧢 Gorras Trucker' },
    { id: 'hogar_decoracion', label: '🛋️ Cojines & Decoración' },
    { id: 'regalos_promocionales', label: '🧩 Puzzles & Llaveros' }
  ];

  const defaultHeroImage = "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80";

  const [heroImageUrl, setHeroImageUrl] = useState(settings.heroImageUrl || defaultHeroImage);
  const [heroBadgeTag, setHeroBadgeTag] = useState(settings.heroBadgeTag || 'HD');
  const [heroBadgeTitle, setHeroBadgeTitle] = useState(settings.heroBadgeTitle || 'Sublimación Térmica');
  const [heroBadgeSubtitle, setHeroBadgeSubtitle] = useState(settings.heroBadgeSubtitle || '200°C / Presión Uniforme');
  const [heroTitle, setHeroTitle] = useState(settings.heroTitle || '');
  const [heroSubtitle, setHeroSubtitle] = useState(settings.heroSubtitle || '');
  const [title, setTitle] = useState(settings.catalogTitle || 'Catálogo de Productos en Existencia');
  const [subtitle, setSubtitle] = useState(settings.catalogSubtitle || 'Explora los artículos disponibles en stock con estampados listos para envío.');
  const [categories, setCategories] = useState<CategoryOption[]>(
    settings.customCategories && settings.customCategories.length > 0 
      ? settings.customCategories 
      : defaultCategories
  );

  const [newCatLabel, setNewCatLabel] = useState('');
  const [newCatId, setNewCatId] = useState('');

  useEffect(() => {
    if (isOpen) {
      setHeroImageUrl(settings.heroImageUrl || defaultHeroImage);
      setHeroBadgeTag(settings.heroBadgeTag || 'HD');
      setHeroBadgeTitle(settings.heroBadgeTitle || 'Sublimación Térmica');
      setHeroBadgeSubtitle(settings.heroBadgeSubtitle || '200°C / Presión Uniforme');
      setHeroTitle(settings.heroTitle || '');
      setHeroSubtitle(settings.heroSubtitle || '');
      setTitle(settings.catalogTitle || 'Catálogo de Productos en Existencia');
      setSubtitle(settings.catalogSubtitle || 'Explora los artículos disponibles en stock con estampados listos para envío.');
      setCategories(
        settings.customCategories && settings.customCategories.length > 0 
          ? settings.customCategories 
          : defaultCategories
      );
      setNewCatLabel('');
      setNewCatId('');
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleUpdateCategoryLabel = (index: number, newLabel: string) => {
    const updated = [...categories];
    updated[index] = { ...updated[index], label: newLabel };
    setCategories(updated);
  };

  const handleAddCategory = () => {
    if (!newCatLabel.trim()) return;
    const cleanId = newCatId.trim() || newCatLabel.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const exists = categories.some(c => c.id === cleanId);
    if (exists) {
      showToast("Ya existe una categoría con ese identificador.", "warning");
      return;
    }
    setCategories([...categories, { id: cleanId, label: newCatLabel.trim() }]);
    setNewCatLabel('');
    setNewCatId('');
  };

  const handleDeleteCategory = (index: number) => {
    if (categories[index].id === 'all') {
      showToast("La categoría principal no puede ser eliminada.", "warning");
      return;
    }
    setCategories(categories.filter((_, i) => i !== index));
  };

  const handleResetDefaults = () => {
    setHeroImageUrl(defaultHeroImage);
    setHeroBadgeTag('HD');
    setHeroBadgeTitle('Sublimación Térmica');
    setHeroBadgeSubtitle('200°C / Presión Uniforme');
    setHeroTitle('');
    setHeroSubtitle('');
    setTitle('Catálogo de Productos en Existencia');
    setSubtitle('Explora los artículos disponibles en stock con estampados listos para envío.');
    setCategories(defaultCategories);
    showToast("Valores restablecidos al formato original.", "info");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      heroImageUrl: heroImageUrl.trim() || undefined,
      heroBadgeTag: heroBadgeTag.trim() || undefined,
      heroBadgeTitle: heroBadgeTitle.trim() || undefined,
      heroBadgeSubtitle: heroBadgeSubtitle.trim() || undefined,
      heroTitle: heroTitle.trim() || undefined,
      heroSubtitle: heroSubtitle.trim() || undefined,
      catalogTitle: title.trim(),
      catalogSubtitle: subtitle.trim(),
      customCategories: categories
    });
    showToast("Portada y catálogo actualizados con éxito.", "success");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-2xs group"
              title="Regresar / Cancelar"
              id="edit-catalog-section-back-btn"
            >
              <ArrowLeft className="w-4 h-4 text-indigo-600 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Atrás</span>
            </button>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Editar Sección de Portada & Catálogo
              </h3>
              <p className="text-xs text-slate-500">
                Personaliza la imagen principal, textos y categorías de la tienda.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          
          {/* Hero Banner Showcase & Texts */}
          <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-black uppercase tracking-wider text-indigo-700 block">
              1. Portada Principal (Imagen Hero & Textos)
            </span>

            {/* Image Preview & Upload */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-3">
              <label className="text-xs font-bold text-slate-800 block">
                Imagen Destacada de la Portada (Hero Showcase)
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Thumbnail Preview with Badge */}
                <div className="relative w-28 h-28 rounded-2xl bg-slate-900 border border-slate-700 overflow-hidden shrink-0 shadow-md flex items-center justify-center">
                  <img 
                    src={heroImageUrl || defaultHeroImage} 
                    alt="Hero Preview" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 left-1 bg-white/95 px-1.5 py-0.5 rounded-md text-[9px] font-bold text-slate-900 shadow-xs flex items-center gap-1">
                    <span className="text-pink-600 font-black">{heroBadgeTag || "HD"}</span>
                    <span className="truncate max-w-[65px]">{heroBadgeTitle || "Sublimación"}</span>
                  </div>
                </div>

                {/* Upload & URL Input */}
                <div className="flex-1 w-full space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={heroImageUrl}
                      onChange={e => setHeroImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/... o sube tu foto"
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <label className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs cursor-pointer text-center shrink-0 shadow-xs transition-colors flex items-center justify-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir Imagen</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const result = await compressImageFile(file, 1200, 0.8);
                              setHeroImageUrl(result);
                              showToast("Imagen de portada optimizada y cargada.", "success");
                            } catch (err) {
                              console.error(err);
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Sube cualquier foto desde tu teléfono o computadora, o pega un enlace directo.
                  </p>
                </div>
              </div>

              {/* Badge Inputs */}
              <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1 text-[11px]">Etiqueta / Tag</label>
                  <input
                    type="text"
                    value={heroBadgeTag}
                    onChange={e => setHeroBadgeTag(e.target.value)}
                    placeholder="HD"
                    maxLength={6}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-center"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1 text-[11px]">Título de Insignia</label>
                  <input
                    type="text"
                    value={heroBadgeTitle}
                    onChange={e => setHeroBadgeTitle(e.target.value)}
                    placeholder="Sublimación Térmica"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1 text-[11px]">Subtítulo de Insignia</label>
                  <input
                    type="text"
                    value={heroBadgeSubtitle}
                    onChange={e => setHeroBadgeSubtitle(e.target.value)}
                    placeholder="200°C / Presión Uniforme"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Título de la Portada Principal
              </label>
              <input
                type="text"
                value={heroTitle}
                onChange={e => setHeroTitle(e.target.value)}
                placeholder="Ej: Diseños Disponibles en Tazas, Ropa y Accesorios"
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Subtítulo de la Portada Principal
              </label>
              <input
                type="text"
                value={heroSubtitle}
                onChange={e => setHeroSubtitle(e.target.value)}
                placeholder="Ej: Explora nuestras colecciones en existencia listas para entrega inmediata..."
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Main Catalog Title & Subtitle */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-black uppercase tracking-wider text-indigo-700 block">
              2. Encabezado de la Sección del Catálogo
            </span>
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Título del Catálogo *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ej: Catálogo de Productos en Existencia"
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Subtítulo del Catálogo
              </label>
              <textarea
                rows={2}
                value={subtitle}
                onChange={e => setSubtitle(e.target.value)}
                placeholder="Ej: Explora los artículos disponibles en stock con estampados listos para envío."
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Categories Manager */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Botones de Categorías ({categories.length})
              </label>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Restablecer por defecto
              </button>
            </div>

            {/* Existing categories list */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {categories.map((cat, idx) => (
                <div key={cat.id} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={cat.label}
                      onChange={e => handleUpdateCategoryLabel(idx, e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 px-2 shrink-0 bg-slate-50 py-1 rounded">
                    ID: {cat.id}
                  </span>
                  {cat.id !== 'all' && (
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                      title="Eliminar categoría"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add new category */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
                + Añadir Nueva Categoría al Menú:
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ej: 🏷️ Stickers & Calcomanías"
                  value={newCatLabel}
                  onChange={e => setNewCatLabel(e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded-xl text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
