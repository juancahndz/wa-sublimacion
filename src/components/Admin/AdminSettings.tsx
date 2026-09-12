import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { StoreSettings, CategoryOption } from '../../types';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Building2, 
  Smartphone, 
  Truck, 
  Store, 
  PhoneCall,
  CheckCircle2,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Lock,
  Layers,
  Plus,
  Trash2,
  SlidersHorizontal,
  Eye,
  EyeOff
} from 'lucide-react';
import { compressImageFile } from '../../utils/imageCompressor';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, resetToInitialData, showToast } = useStore();
  const [form, setForm] = useState<StoreSettings>({ ...settings });
  const [newCatLabel, setNewCatLabel] = useState('');

  // Always keep form synchronized with store settings
  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
  };

  const handleReset = () => {
    if (confirm("¿Seguro que deseas restablecer todos los datos de muestra (productos, pedidos e inventario)? Los cambios locales se reiniciarán.")) {
      resetToInitialData();
    }
  };

  const handleAddCategory = () => {
    if (!newCatLabel.trim()) return;
    const cleanId = newCatLabel.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    const currentCats = form.customCategories || [];
    if (currentCats.some(c => c.id === cleanId)) {
      showToast("Ya existe una categoría con ese identificador.", "warning");
      return;
    }
    const updated = [...currentCats, { id: cleanId, label: newCatLabel.trim() }];
    setForm({ ...form, customCategories: updated });
    setNewCatLabel('');
    showToast("Categoría añadida a la lista. Guarda los cambios para aplicar.", "info");
  };

  const handleDeleteCategory = (id: string) => {
    if (id === 'all') {
      showToast("La categoría principal no se puede eliminar.", "warning");
      return;
    }
    const updated = (form.customCategories || []).filter(c => c.id !== id);
    setForm({ ...form, customCategories: updated });
  };

  const handleUpdateCategoryLabel = (index: number, newLabel: string) => {
    const updated = [...(form.customCategories || [])];
    if (updated[index]) {
      updated[index] = { ...updated[index], label: newLabel };
      setForm({ ...form, customCategories: updated });
    }
  };

  return (
    <div className="w-full space-y-6">
      
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Admin Credentials & Security */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Lock className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Credenciales de Acceso Administrador</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Correo Electrónico del Administrador</label>
              <input
                type="email"
                required
                value={form.adminEmail || 'admin@wasublimacion.com'}
                onChange={e => setForm({ ...form, adminEmail: e.target.value })}
                placeholder="admin@wasublimacion.com"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Contraseña de Administrador</label>
              <input
                type="text"
                required
                value={form.adminPassword || 'admin1234'}
                onChange={e => setForm({ ...form, adminPassword: e.target.value })}
                placeholder="admin1234"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-800"
              />
              <span className="text-[10px] text-slate-500 font-medium mt-1 block">Por defecto: admin1234</span>
            </div>
          </div>
        </div>

        {/* Store Identity & Logo */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Store className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Identidad del Taller, Logo & Moneda</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-bold text-slate-800 block text-xs">Logo Oficial del Negocio</label>
                  <p className="text-[11px] text-slate-500">Puedes subir cualquier imagen desde tu dispositivo o pegar un enlace web.</p>
                </div>
                {form.logoUrl && form.logoUrl !== '/logo.png' && (
                  <button
                    type="button"
                    onClick={() => {
                      setForm(prev => ({ ...prev, logoUrl: '/logo.png' }));
                      showToast("Logo restablecido al diseño predeterminado.", "info");
                    }}
                    className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold underline cursor-pointer"
                  >
                    Restablecer logo predeterminado
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                {/* Visual Previews */}
                <div className="sm:col-span-4 flex items-center gap-2">
                  <div className="flex-1 text-center">
                    <div className="h-16 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-xs overflow-hidden">
                      <img 
                        src={form.logoUrl || '/logo.png'} 
                        alt="Logo preview claro" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium mt-1 block">Fondo Claro (Nav)</span>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="h-16 rounded-xl bg-slate-900 border border-slate-800 p-1 flex items-center justify-center shadow-xs overflow-hidden">
                      <img 
                        src={form.logoUrl || '/logo.png'} 
                        alt="Logo preview oscuro" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium mt-1 block">Fondo Oscuro (Footer)</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="sm:col-span-8 space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={form.logoUrl || ''}
                      onChange={e => setForm({ ...form, logoUrl: e.target.value })}
                      placeholder="/logo.png o URL externa (https://...)"
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-xl bg-white text-xs font-mono"
                    />
                    <label className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs cursor-pointer text-center shrink-0 shadow-xs transition-colors flex items-center justify-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir Logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const result = await compressImageFile(file, 600, 0.8);
                              setForm(prev => ({ ...prev, logoUrl: result }));
                              showToast("Logo optimizado y cargado. Recuerda presionar 'Guardar Configuración'.", "success");
                            } catch (err) {
                              console.error(err);
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                  <p className="text-[10px] text-slate-500">Formatos recomendados: PNG transparente, SVG o JPG.</p>
                </div>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Nombre del Negocio</label>
              <input
                type="text"
                value={form.storeName}
                onChange={e => setForm({ ...form, storeName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">WhatsApp de Atención & Pedidos</label>
              <input
                type="text"
                value={form.whatsappNumber}
                onChange={e => setForm({ ...form, whatsappNumber: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Símbolo de Moneda</label>
              <input
                type="text"
                value={form.currency}
                onChange={e => setForm({ ...form, currency: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Subtítulo / Slogan</label>
              <input
                type="text"
                value={form.slogan || ''}
                onChange={e => setForm({ ...form, slogan: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Dirección / Ubicación del Taller</label>
              <input
                type="text"
                value={form.address || ''}
                onChange={e => setForm({ ...form, address: e.target.value })}
                placeholder="Ej: Comayagua, Honduras"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Correo Electrónico de Contacto</label>
              <input
                type="email"
                value={form.contactEmail || ''}
                onChange={e => setForm({ ...form, contactEmail: e.target.value })}
                placeholder="contacto@wasublimacion.com"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Hero Section & Catalog Texts */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Portada Principal (Hero Banner) & Catálogo</h3>
            </div>
            
            {/* Banner Toggle Button */}
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                form.hideHeroBanner 
                  ? 'bg-rose-50 text-rose-700 border-rose-200' 
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {form.hideHeroBanner ? '🚫 Portada Oculta / Eliminada' : '👁️ Portada Visible'}
              </span>

              <button
                type="button"
                onClick={() => {
                  setForm(prev => ({ ...prev, hideHeroBanner: !prev.hideHeroBanner }));
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  form.hideHeroBanner
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-rose-600 hover:bg-rose-500 text-white'
                }`}
              >
                {form.hideHeroBanner ? (
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

          {form.hideHeroBanner && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
              ⚠️ <strong>La portada está desactivada/oculta</strong>. Los visitantes de la tienda verán directamente la sección de productos. Puedes volver a activarla en cualquier momento.
            </div>
          )}

          {/* Hero Showcase Image & Badge */}
          <div className={`bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 ${form.hideHeroBanner ? 'opacity-60' : ''}`}>
            <div className="flex items-center justify-between">
              <div>
                <label className="font-bold text-slate-800 block text-xs">Imagen Destacada de la Portada</label>
                <p className="text-[11px] text-slate-500">Es la imagen principal que aparece a la derecha de la portada con su insignia flotante.</p>
              </div>
              {form.heroImageUrl && form.heroImageUrl !== "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80" && (
                <button
                  type="button"
                  onClick={() => {
                    setForm(prev => ({ 
                      ...prev, 
                      heroImageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
                      heroBadgeTag: "HD",
                      heroBadgeTitle: "Sublimación Térmica",
                      heroBadgeSubtitle: "200°C / Presión Uniforme"
                    }));
                    showToast("Imagen de portada restablecida.", "info");
                  }}
                  className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold underline cursor-pointer"
                >
                  Restablecer imagen predeterminada
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Preview */}
              <div className="sm:col-span-4 flex justify-center">
                <div className="relative w-32 h-32 rounded-2xl bg-slate-900 border border-slate-700 p-1 shadow-md flex items-center justify-center overflow-hidden">
                  <img 
                    src={form.heroImageUrl || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80"} 
                    alt="Hero Preview" 
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute bottom-1.5 left-1.5 bg-white px-2 py-1 rounded-lg text-[9px] font-bold text-slate-900 shadow-md flex items-center gap-1.5">
                    <span className="text-pink-600 font-black">{form.heroBadgeTag || "HD"}</span>
                    <span className="truncate max-w-[70px]">{form.heroBadgeTitle || "Sublimación"}</span>
                  </div>
                </div>
              </div>

              {/* Upload and input */}
              <div className="sm:col-span-8 space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={form.heroImageUrl || ''}
                    onChange={e => setForm({ ...form, heroImageUrl: e.target.value })}
                    placeholder="URL externa (https://...) o sube un archivo"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-xl bg-white text-xs font-mono"
                  />
                  <label className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs cursor-pointer text-center shrink-0 shadow-xs transition-colors flex items-center justify-center gap-1.5">
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
                            setForm(prev => ({ ...prev, heroImageUrl: result }));
                            showToast("Imagen de portada optimizada y cargada.", "success");
                          } catch (err) {
                            console.error(err);
                          }
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1 text-[10px]">Tag Insignia</label>
                    <input
                      type="text"
                      value={form.heroBadgeTag || 'HD'}
                      onChange={e => setForm({ ...form, heroBadgeTag: e.target.value })}
                      placeholder="HD"
                      maxLength={6}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-center bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1 text-[10px]">Título Insignia</label>
                    <input
                      type="text"
                      value={form.heroBadgeTitle || 'Sublimación Térmica'}
                      onChange={e => setForm({ ...form, heroBadgeTitle: e.target.value })}
                      placeholder="Sublimación Térmica"
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1 text-[10px]">Subtítulo Insignia</label>
                    <input
                      type="text"
                      value={form.heroBadgeSubtitle || '200°C / Presión Uniforme'}
                      onChange={e => setForm({ ...form, heroBadgeSubtitle: e.target.value })}
                      placeholder="200°C / Presión Uniforme"
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs ${form.hideHeroBanner ? 'opacity-60' : ''}`}>
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Insignia Superior (Pastilla Flotante)</label>
              <input
                type="text"
                value={form.heroTopBadgeText || ''}
                onChange={e => setForm({ ...form, heroTopBadgeText: e.target.value })}
                placeholder="Sublimación & Diseños Exclusivos en Existencia"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Título de la Portada Principal (Hero)</label>
              <input
                type="text"
                value={form.heroTitle || ''}
                onChange={e => setForm({ ...form, heroTitle: e.target.value })}
                placeholder="Diseños Disponibles en Tazas, Ropa y Accesorios"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Subtítulo de la Portada Principal</label>
              <input
                type="text"
                value={form.heroSubtitle || ''}
                onChange={e => setForm({ ...form, heroSubtitle: e.target.value })}
                placeholder="Explora nuestras colecciones en existencia listas para entrega inmediata..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Texto del Botón 1 (Catálogo)</label>
              <input
                type="text"
                value={form.heroPrimaryButtonText || ''}
                onChange={e => setForm({ ...form, heroPrimaryButtonText: e.target.value })}
                placeholder="Ver Productos en Stock"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Texto del Botón 2 (Diseños)</label>
              <input
                type="text"
                value={form.heroSecondaryButtonText || ''}
                onChange={e => setForm({ ...form, heroSecondaryButtonText: e.target.value })}
                placeholder="Galería de Diseños"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Beneficio 1 (Check)</label>
              <input
                type="text"
                value={form.heroTrustPoint1 || ''}
                onChange={e => setForm({ ...form, heroTrustPoint1: e.target.value })}
                placeholder="Sin pedido mínimo (desde 1 pz)"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Beneficio 2 (Check)</label>
              <input
                type="text"
                value={form.heroTrustPoint2 || ''}
                onChange={e => setForm({ ...form, heroTrustPoint2: e.target.value })}
                placeholder="Tintas UltraChrome resistentes"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Beneficio 3 (Check)</label>
              <input
                type="text"
                value={form.heroTrustPoint3 || ''}
                onChange={e => setForm({ ...form, heroTrustPoint3: e.target.value })}
                placeholder="Seguimiento paso a paso"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Título de la Sección del Catálogo</label>
              <input
                type="text"
                value={form.catalogTitle || ''}
                onChange={e => setForm({ ...form, catalogTitle: e.target.value })}
                placeholder="Catálogo de Productos en Existencia"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Subtítulo de la Sección del Catálogo</label>
              <input
                type="text"
                value={form.catalogSubtitle || ''}
                onChange={e => setForm({ ...form, catalogSubtitle: e.target.value })}
                placeholder="Explora los artículos disponibles en stock con estampados listos para envío."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          {/* Categories Manager in AdminSettings */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <label className="font-bold text-slate-800 block text-xs">
              Botones de Categorías del Catálogo ({form.customCategories?.length || 0})
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {form.customCategories?.map((cat, idx) => (
                <div key={cat.id} className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <input
                    type="text"
                    value={cat.label}
                    onChange={e => handleUpdateCategoryLabel(idx, e.target.value)}
                    className="flex-1 px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {cat.id}
                  </span>
                  {cat.id !== 'all' && (
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nueva categoría (ej: 🏷️ Llaveros Metálicos)"
                value={newCatLabel}
                onChange={e => setNewCatLabel(e.target.value)}
                className="flex-1 px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-white"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shrink-0 cursor-pointer"
              >
                + Añadir Categoría
              </button>
            </div>
          </div>
        </div>

        {/* Shipping & Delivery Rules */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Truck className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Tarifas de Envío & Despacho</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Costo de Envío Estándar ({form.currency})</label>
              <input
                type="number"
                step="0.5"
                value={form.standardShippingCost}
                onChange={e => setForm({ ...form, standardShippingCost: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Monto Mínimo para Envío Gratis ({form.currency})</label>
              <input
                type="number"
                step="1"
                value={form.freeShippingThreshold}
                onChange={e => setForm({ ...form, freeShippingThreshold: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Datos para Transferencias Bancarias</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Banco</label>
              <input
                type="text"
                value={form.bankDetails.bankName}
                onChange={e => setForm({ ...form, bankDetails: { ...form.bankDetails, bankName: e.target.value } })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Titular de la Cuenta</label>
              <input
                type="text"
                value={form.bankDetails.accountHolder}
                onChange={e => setForm({ ...form, bankDetails: { ...form.bankDetails, accountHolder: e.target.value } })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Número de Cuenta</label>
              <input
                type="text"
                value={form.bankDetails.accountNumber}
                onChange={e => setForm({ ...form, bankDetails: { ...form.bankDetails, accountNumber: e.target.value } })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">CLABE Interbancaria / IBAN</label>
              <input
                type="text"
                value={form.bankDetails.clabeOrIban || ''}
                onChange={e => setForm({ ...form, bankDetails: { ...form.bankDetails, clabeOrIban: e.target.value } })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
              />
            </div>
          </div>
        </div>

        {/* Digital Payment Details */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Smartphone className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Pago Móvil (Zelle, SINPE, Bizum, MercadoPago)</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Tipo de Servicio</label>
              <input
                type="text"
                placeholder="Ej: SINPE Móvil / Zelle"
                value={form.digitalPaymentDetails.type}
                onChange={e => setForm({ ...form, digitalPaymentDetails: { ...form.digitalPaymentDetails, type: e.target.value } })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Número / Email / Alias</label>
              <input
                type="text"
                value={form.digitalPaymentDetails.identifier}
                onChange={e => setForm({ ...form, digitalPaymentDetails: { ...form.digitalPaymentDetails, identifier: e.target.value } })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Instrucciones de Pago para el Cliente</label>
              <input
                type="text"
                value={form.digitalPaymentDetails.instructions}
                onChange={e => setForm({ ...form, digitalPaymentDetails: { ...form.digitalPaymentDetails, instructions: e.target.value } })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Restablecer Base de Datos Demo
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Guardar Configuración
          </button>
        </div>

      </form>

    </div>
  );
};
