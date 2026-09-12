import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { CategoryOption, HeroFeatureButton } from '../../types';
import { 
  ArrowLeft, 
  X, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Check, 
  Sparkles, 
  SlidersHorizontal, 
  Upload, 
  Image as ImageIcon, 
  Eye, 
  EyeOff,
  Flame,
  ShieldCheck,
  CheckCircle2,
  Truck,
  Clock,
  Star,
  Heart,
  Gift,
  Tag
} from 'lucide-react';
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

  const defaultFeatureButtons: HeroFeatureButton[] = [
    { 
      id: 'feat-1', 
      label: 'Sin pedido mínimo (desde 1 pz)', 
      description: '¡Puedes ordenar desde una sola pieza personalizada sin ningún recargo o cantidad mínima!',
      icon: 'check', 
      actionType: 'info' 
    },
    { 
      id: 'feat-2', 
      label: 'Tintas UltraChrome resistentes', 
      description: 'Nuestras tintas UltraChrome HD no se decoloran, resisten cientos de lavadas y microondas.',
      icon: 'flame', 
      actionType: 'info' 
    },
    { 
      id: 'feat-3', 
      label: 'Seguimiento paso a paso', 
      description: 'Te enviamos fotos del proceso y notificaciones en tiempo real del avance de tu pedido por WhatsApp.',
      icon: 'shield', 
      actionType: 'info' 
    }
  ];

  const [hideHeroBanner, setHideHeroBanner] = useState<boolean>(settings.hideHeroBanner || false);
  const [heroTopBadgeText, setHeroTopBadgeText] = useState(settings.heroTopBadgeText || '');
  const [heroTitle, setHeroTitle] = useState(settings.heroTitle || '');
  const [heroSubtitle, setHeroSubtitle] = useState(settings.heroSubtitle || '');
  const [heroPrimaryButtonText, setHeroPrimaryButtonText] = useState(settings.heroPrimaryButtonText || '');
  const [heroSecondaryButtonText, setHeroSecondaryButtonText] = useState(settings.heroSecondaryButtonText || '');
  
  const [featureButtons, setFeatureButtons] = useState<HeroFeatureButton[]>([]);
  const [newBtnLabel, setNewBtnLabel] = useState('');

  const [heroImageUrl, setHeroImageUrl] = useState(settings.heroImageUrl || defaultHeroImage);
  const [heroBadgeTag, setHeroBadgeTag] = useState(settings.heroBadgeTag || 'HD');
  const [heroBadgeTitle, setHeroBadgeTitle] = useState(settings.heroBadgeTitle || 'Sublimación Térmica');
  const [heroBadgeSubtitle, setHeroBadgeSubtitle] = useState(settings.heroBadgeSubtitle || '200°C / Presión Uniforme');
  
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
      setHideHeroBanner(settings.hideHeroBanner || false);
      setHeroTopBadgeText(settings.heroTopBadgeText || '');
      setHeroTitle(settings.heroTitle || '');
      setHeroSubtitle(settings.heroSubtitle || '');
      setHeroPrimaryButtonText(settings.heroPrimaryButtonText || '');
      setHeroSecondaryButtonText(settings.heroSecondaryButtonText || '');
      
      if (settings.heroFeatureButtons && settings.heroFeatureButtons.length >= 0) {
        setFeatureButtons(settings.heroFeatureButtons);
      } else {
        const btns: HeroFeatureButton[] = [];
        if (settings.heroTrustPoint1 !== undefined ? settings.heroTrustPoint1 : 'Sin pedido mínimo (desde 1 pz)') {
          btns.push({
            id: 'feat-1',
            label: settings.heroTrustPoint1 || 'Sin pedido mínimo (desde 1 pz)',
            description: '¡Puedes ordenar desde una sola pieza personalizada sin ningún recargo o cantidad mínima!',
            icon: 'check',
            actionType: 'info'
          });
        }
        if (settings.heroTrustPoint2 !== undefined ? settings.heroTrustPoint2 : 'Tintas UltraChrome resistentes') {
          btns.push({
            id: 'feat-2',
            label: settings.heroTrustPoint2 || 'Tintas UltraChrome resistentes',
            description: 'Nuestras tintas UltraChrome HD no se decoloran, resisten cientos de lavadas y microondas.',
            icon: 'flame',
            actionType: 'info'
          });
        }
        if (settings.heroTrustPoint3 !== undefined ? settings.heroTrustPoint3 : 'Seguimiento paso a paso') {
          btns.push({
            id: 'feat-3',
            label: settings.heroTrustPoint3 || 'Seguimiento paso a paso',
            description: 'Te enviamos fotos del proceso y notificaciones en tiempo real del avance de tu pedido por WhatsApp.',
            icon: 'shield',
            actionType: 'info'
          });
        }
        setFeatureButtons(btns.length > 0 ? btns : defaultFeatureButtons);
      }

      setHeroImageUrl(settings.heroImageUrl || defaultHeroImage);
      setHeroBadgeTag(settings.heroBadgeTag || 'HD');
      setHeroBadgeTitle(settings.heroBadgeTitle || 'Sublimación Térmica');
      setHeroBadgeSubtitle(settings.heroBadgeSubtitle || '200°C / Presión Uniforme');
      setTitle(settings.catalogTitle || 'Catálogo de Productos en Existencia');
      setSubtitle(settings.catalogSubtitle || 'Explora los artículos disponibles en stock con estampados listos para envío.');
      setCategories(
        settings.customCategories && settings.customCategories.length > 0 
          ? settings.customCategories 
          : defaultCategories
      );
      setNewCatLabel('');
      setNewCatId('');
      setNewBtnLabel('');
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

  const handleAddFeatureButton = () => {
    if (!newBtnLabel.trim()) {
      showToast("Escribe el texto del botón primero.", "warning");
      return;
    }
    const newBtn: HeroFeatureButton = {
      id: `feat-${Date.now()}`,
      label: newBtnLabel.trim(),
      description: `Información sobre ${newBtnLabel.trim()}`,
      icon: 'check',
      actionType: 'info'
    };
    setFeatureButtons([...featureButtons, newBtn]);
    setNewBtnLabel('');
    showToast("Botón agregado. Guarda los cambios para aplicar.", "info");
  };

  const handleDeleteFeatureButton = (index: number) => {
    setFeatureButtons(featureButtons.filter((_, i) => i !== index));
    showToast("Botón eliminado.", "info");
  };

  const handleUpdateFeatureButton = (index: number, fields: Partial<HeroFeatureButton>) => {
    const updated = [...featureButtons];
    updated[index] = { ...updated[index], ...fields };
    setFeatureButtons(updated);
  };

  const handleResetDefaults = () => {
    setHideHeroBanner(false);
    setHeroTopBadgeText('');
    setHeroTitle('');
    setHeroSubtitle('');
    setHeroPrimaryButtonText('');
    setHeroSecondaryButtonText('');
    setFeatureButtons(defaultFeatureButtons);
    setHeroImageUrl(defaultHeroImage);
    setHeroBadgeTag('HD');
    setHeroBadgeTitle('Sublimación Térmica');
    setHeroBadgeSubtitle('200°C / Presión Uniforme');
    setTitle('Catálogo de Productos en Existencia');
    setSubtitle('Explora los artículos disponibles en stock con estampados listos para envío.');
    setCategories(defaultCategories);
    showToast("Valores restablecidos al formato original.", "info");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      hideHeroBanner,
      heroTopBadgeText: heroTopBadgeText.trim() || undefined,
      heroTitle: heroTitle.trim() || undefined,
      heroSubtitle: heroSubtitle.trim() || undefined,
      heroPrimaryButtonText: heroPrimaryButtonText.trim() || undefined,
      heroSecondaryButtonText: heroSecondaryButtonText.trim() || undefined,
      heroFeatureButtons: featureButtons,
      heroImageUrl: heroImageUrl.trim() || undefined,
      heroBadgeTag: heroBadgeTag.trim() || undefined,
      heroBadgeTitle: heroBadgeTitle.trim() || undefined,
      heroBadgeSubtitle: heroBadgeSubtitle.trim() || undefined,
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
          
          {/* 1. Portada Principal (Hero Banner) - Editar o Eliminar */}
          <div className="space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-indigo-700 block">
                  1. Portada Principal (Hero Banner)
                </span>
                <p className="text-[11px] text-slate-500">
                  Edita los títulos, botones, beneficios e imagen, o elimina la portada por completo.
                </p>
              </div>

              {/* Delete / Hide or Show Banner Toggle Button */}
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                  hideHeroBanner 
                    ? 'bg-rose-50 text-rose-700 border-rose-200' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {hideHeroBanner ? '🚫 Portada Oculta / Eliminada' : '👁️ Portada Visible'}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setHideHeroBanner(!hideHeroBanner);
                    showToast(
                      !hideHeroBanner 
                        ? "Portada marcada como eliminada/oculta. Guarda los cambios para aplicar." 
                        : "Portada restaurada como visible.", 
                      !hideHeroBanner ? "warning" : "info"
                    );
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                    hideHeroBanner
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-rose-600 hover:bg-rose-500 text-white'
                  }`}
                  id="toggle-hero-banner-btn"
                >
                  {hideHeroBanner ? (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Mostrar Portada</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Eliminar Portada</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {hideHeroBanner && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                ⚠️ <strong>La portada no se mostrará en la tienda</strong>. Los clientes verán directamente el catálogo de artículos. (Puedes volver a activarla cuando desees).
              </div>
            )}

            {/* Editable Content */}
            <div className={`space-y-4 ${hideHeroBanner ? 'opacity-50 pointer-events-none' : ''}`}>
              
              {/* Top Badge Text */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Texto de la Insignia Superior (Pastilla Flotante)
                </label>
                <input
                  type="text"
                  value={heroTopBadgeText}
                  onChange={e => setHeroTopBadgeText(e.target.value)}
                  placeholder="Ej: Sublimación & Diseños Exclusivos en Existencia"
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Main Headline */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Título Principal de la Portada
                </label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={e => setHeroTitle(e.target.value)}
                  placeholder="Ej: Diseños Disponibles en Tazas, Ropa y Accesorios"
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Subtítulo / Descripción de la Portada
                </label>
                <textarea
                  rows={2}
                  value={heroSubtitle}
                  onChange={e => setHeroSubtitle(e.target.value)}
                  placeholder="Ej: Explora nuestras colecciones en existencia listas para entrega inmediata. Impresión fotográfica indeleble de alta definición."
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Action Buttons Labels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Texto del Botón 1 (Catálogo)
                  </label>
                  <input
                    type="text"
                    value={heroPrimaryButtonText}
                    onChange={e => setHeroPrimaryButtonText(e.target.value)}
                    placeholder="Ver Productos en Stock"
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Texto del Botón 2 (Diseños)
                  </label>
                  <input
                    type="text"
                    value={heroSecondaryButtonText}
                    onChange={e => setHeroSecondaryButtonText(e.target.value)}
                    placeholder="Galería de Diseños"
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Feature Buttons Manager (Interactive Editable Buttons) */}
              <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block">
                      Botones de Beneficios & Garantías ({featureButtons.length})
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Convierte estos textos en botones interactivos. Puedes cambiar su texto, mensaje informativo o eliminarlos.
                    </p>
                  </div>
                </div>

                {/* List of buttons */}
                {featureButtons.length === 0 ? (
                  <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                    No hay botones de beneficios. Agrega uno nuevo con el formulario de abajo.
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {featureButtons.map((btn, index) => (
                      <div key={btn.id || index} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                            {index + 1}
                          </span>
                          <input
                            type="text"
                            value={btn.label}
                            onChange={e => handleUpdateFeatureButton(index, { label: e.target.value })}
                            placeholder="Texto del botón (ej: Sin pedido mínimo)"
                            className="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteFeatureButton(index)}
                            className="p-1.5 text-rose-500 hover:text-white hover:bg-rose-600 rounded-lg transition-colors cursor-pointer shrink-0"
                            title="Eliminar este botón"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                          <div className="sm:col-span-6">
                            <input
                              type="text"
                              value={btn.description || ''}
                              onChange={e => handleUpdateFeatureButton(index, { description: e.target.value })}
                              placeholder="Mensaje explicativo al pulsar..."
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-600"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <select
                              value={btn.icon || 'check'}
                              onChange={e => handleUpdateFeatureButton(index, { icon: e.target.value })}
                              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 font-medium"
                            >
                              <option value="check">✔ Check</option>
                              <option value="flame">🔥 Llama</option>
                              <option value="shield">🛡️ Escudo</option>
                              <option value="truck">🚚 Envío</option>
                              <option value="sparkles">✨ Destello</option>
                              <option value="clock">⏱️ Reloj</option>
                              <option value="star">⭐ Estrella</option>
                              <option value="heart">❤️ Corazón</option>
                              <option value="gift">🎁 Regalo</option>
                              <option value="tag">🏷️ Oferta</option>
                            </select>
                          </div>

                          <div className="sm:col-span-3">
                            <select
                              value={btn.actionType || 'info'}
                              onChange={e => handleUpdateFeatureButton(index, { actionType: e.target.value as any })}
                              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 font-medium"
                            >
                              <option value="info">💬 Mostrar Info</option>
                              <option value="catalog">🛍️ Ver Catálogo</option>
                              <option value="customizer">🎨 Personalizador</option>
                              <option value="designs">🖼️ Ver Diseños</option>
                              <option value="whatsapp">📱 WhatsApp</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new button */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newBtnLabel}
                    onChange={e => setNewBtnLabel(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddFeatureButton(); } }}
                    placeholder="Escribe el texto de un nuevo botón..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeatureButton}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0 transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar Botón</span>
                  </button>
                </div>
              </div>

              {/* Image Preview & Upload & Badge */}
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
