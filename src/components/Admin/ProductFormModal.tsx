import React, { useState, useEffect } from 'react';
import { Product, ProductCategory, ProductMockupType, ProductVariant } from '../../types';
import { useStore } from '../../context/StoreContext';
import { ArrowLeft, X, Plus, Trash2, Upload, Sparkles, Layers, Image as ImageIcon, Film } from 'lucide-react';
import { compressImageFile } from '../../utils/imageCompressor';

interface ProductFormModalProps {
  productToEdit?: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({ productToEdit, isOpen, onClose }) => {
  const { addProduct, updateProduct, inventory, settings, showToast } = useStore();

  const activeCategories = (settings.customCategories && settings.customCategories.length > 0)
    ? settings.customCategories.filter(c => c.id !== 'all')
    : [];

  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    slug: '',
    category: activeCategories[0]?.id || 'tazas',
    basePrice: 6.50,
    description: '',
    features: ['Sublimación Ultra HD', 'Colores brillantes indelebles'],
    images: [],
    videoUrl: '',
    mockupType: 'mug',
    linkedInventoryId: '',
    variants: [],
    tags: ['sublimacion', 'personalizado'],
    featured: false,
    isCustomizable: true,
    minQuantity: 1,
    sublimationAreaText: '9.5 x 20 cm',
    rating: 5.0,
    reviewCount: 1
  });

  const [newFeatureText, setNewFeatureText] = useState('');
  const [newTagText, setNewTagText] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isCompressingImages, setIsCompressingImages] = useState(false);

  // Variant input helper
  const [newVarName, setNewVarName] = useState('');
  const [newVarType, setNewVarType] = useState<'color' | 'size' | 'finish' | 'material'>('color');
  const [newVarValue, setNewVarValue] = useState('');
  const [newVarModifier, setNewVarModifier] = useState(0);

  useEffect(() => {
    if (productToEdit) {
      setFormData(productToEdit);
    } else {
      setFormData({
        name: '',
        slug: '',
        category: 'tazas',
        basePrice: 6.50,
        description: '',
        features: ['Sublimación Ultra HD', 'Colores brillantes indelebles'],
        images: [],
        videoUrl: '',
        mockupType: 'mug',
        linkedInventoryId: inventory[0]?.id || '',
        variants: [],
        tags: ['sublimacion', 'personalizado'],
        featured: false,
        isCustomizable: true,
        minQuantity: 1,
        sublimationAreaText: '9.5 x 20 cm',
        rating: 5.0,
        reviewCount: 1
      });
    }
  }, [productToEdit, isOpen, inventory]);

  if (!isOpen) return null;

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    setFormData(prev => ({
      ...prev,
      features: [...(prev.features || []), newFeatureText.trim()]
    }));
    setNewFeatureText('');
  };

  const handleRemoveFeature = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== idx)
    }));
  };

  const handleAddTag = () => {
    if (!newTagText.trim()) return;
    setFormData(prev => ({
      ...prev,
      tags: [...(prev.tags || []), newTagText.trim().toLowerCase()]
    }));
    setNewTagText('');
  };

  const handleRemoveTag = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== idx)
    }));
  };

  const handleSlotImageFile = async (slotIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressingImages(true);
      const compressed = await compressImageFile(file, 1200, 0.85);
      setFormData(prev => {
        const list = [...(prev.images || [])];
        list[slotIndex] = compressed;
        return { ...prev, images: list.filter(Boolean) };
      });
      showToast(slotIndex === 0 ? "Foto del FRENTE cargada con éxito." : "Foto de la ESPALDA (360°) cargada con éxito.", "success");
    } catch (err) {
      console.error(err);
      showToast("Error al procesar la imagen.", "error");
    } finally {
      setIsCompressingImages(false);
      e.target.value = '';
    }
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), newImageUrl.trim()]
    }));
    setNewImageUrl('');
    showToast("Imagen añadida por enlace.", "success");
  };

  const handleMultipleImageFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsCompressingImages(true);
      const fileList = Array.from(files);
      const compressedList = await Promise.all(
        fileList.map(file => compressImageFile(file, 1200, 0.8))
      );

      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...compressedList]
      }));

      showToast(`¡${compressedList.length} foto(s) cargada(s) con éxito!`, "success");
    } catch (err) {
      console.error(err);
      showToast("Error al procesar las imágenes.", "error");
    } finally {
      setIsCompressingImages(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (idxToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== idxToRemove)
    }));
  };

  const handleMoveImage = (idx: number, direction: 'left' | 'right') => {
    setFormData(prev => {
      const list = [...(prev.images || [])];
      const targetIdx = direction === 'left' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= list.length) return prev;
      const temp = list[idx];
      list[idx] = list[targetIdx];
      list[targetIdx] = temp;
      return { ...prev, images: list };
    });
  };

  const handleAddVariant = () => {
    if (!newVarName.trim()) return;
    const newV: ProductVariant = {
      id: `v-${Date.now()}`,
      name: newVarName.trim(),
      type: newVarType,
      value: newVarValue || newVarName,
      priceModifier: Number(newVarModifier) || 0
    };
    setFormData(prev => ({
      ...prev,
      variants: [...(prev.variants || []), newV]
    }));
    setNewVarName('');
    setNewVarValue('');
    setNewVarModifier(0);
  };

  const handleRemoveVariant = (id: string) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants?.filter(v => v.id !== id)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.basePrice) {
      showToast("Nombre y precio base son requeridos.", "warning");
      return;
    }

    let resolvedCategory = formData.category || 'tazas';
    if (isCustomCategory && customCategoryName.trim()) {
      resolvedCategory = customCategoryName.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    }

    const slug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const finalProduct: Product = {
      id: productToEdit ? productToEdit.id : `prod-${Date.now()}`,
      name: formData.name,
      slug,
      category: resolvedCategory as ProductCategory,
      basePrice: Number(formData.basePrice),
      description: formData.description || '',
      features: formData.features || [],
      images: formData.images?.length ? formData.images : ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80'],
      videoUrl: formData.videoUrl ? formData.videoUrl.trim() : undefined,
      mockupType: formData.mockupType as ProductMockupType,
      linkedInventoryId: formData.linkedInventoryId,
      variants: formData.variants || [],
      tags: formData.tags || [],
      featured: !!formData.featured,
      isCustomizable: formData.isCustomizable ?? true,
      minQuantity: formData.minQuantity || 1,
      sublimationAreaText: formData.sublimationAreaText || 'Área de Estampado Estándar',
      rating: formData.rating || 5.0,
      reviewCount: formData.reviewCount || 1
    };

    if (productToEdit) {
      updateProduct(finalProduct);
    } else {
      addProduct(finalProduct);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-2xs group"
              title="Regresar / Cancelar"
              id="product-form-back-btn"
            >
              <ArrowLeft className="w-4 h-4 text-indigo-600 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Atrás</span>
            </button>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {productToEdit ? 'Editar Producto del Catálogo' : 'Subir Nuevo Producto al Catálogo'}
              </h3>
              <p className="text-xs text-slate-500">
                {productToEdit ? 'Modifica detalles, fotos y opciones de personalización.' : 'Completa la ficha técnica para publicar en la tienda online.'}
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

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Main Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">Nombre del Producto *</label>
              <input
                type="text"
                required
                placeholder="Ej: Taza de Cerámica AAA 11oz Blanca"
                value={formData.name || ''}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 block">Categoría / Línea de Sublimación</label>
                <button
                  type="button"
                  onClick={() => setIsCustomCategory(!isCustomCategory)}
                  className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold underline cursor-pointer"
                >
                  {isCustomCategory ? "Elegir existente" : "+ Crear nueva línea"}
                </button>
              </div>

              {isCustomCategory ? (
                <input
                  type="text"
                  required
                  placeholder="Ej: 🔑 Llaveros Metálicos"
                  value={customCategoryName}
                  onChange={e => setCustomCategoryName(e.target.value)}
                  className="w-full px-3.5 py-2 border border-indigo-300 rounded-xl text-xs bg-indigo-50/50 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              ) : (
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white font-medium"
                >
                  {activeCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Precio Base ($) *</label>
              <input
                type="number"
                step="0.10"
                min="0.5"
                required
                value={formData.basePrice || ''}
                onChange={e => setFormData({ ...formData, basePrice: parseFloat(e.target.value) })}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Tipo de Simulador Mockup 3D</label>
              <select
                value={formData.mockupType}
                onChange={e => setFormData({ ...formData, mockupType: e.target.value as ProductMockupType })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white font-semibold text-indigo-700"
              >
                <option value="mug">Taza Cilíndrica (Mug)</option>
                <option value="tshirt">Camiseta / Playera (T-Shirt)</option>
                <option value="hoodie">Sudadera con Capucha (Hoodie)</option>
                <option value="bottle">Botella de Aluminio / Termo</option>
                <option value="cap">Gorra Trucker</option>
                <option value="mousepad">Mousepad Gamer</option>
                <option value="pillow">Cojín Cuadrado</option>
                <option value="puzzle">Rompecabezas A4</option>
                <option value="keychain">Llavero Polímero</option>
                <option value="phonecase">Funda de Teléfono</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Vincular a Insumo de Inventario</label>
              <select
                value={formData.linkedInventoryId || ''}
                onChange={e => setFormData({ ...formData, linkedInventoryId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white"
              >
                <option value="">-- Sin vincular a stock --</option>
                {inventory.map(inv => (
                  <option key={inv.id} value={inv.id}>
                    {inv.name} (Stock: {inv.currentStock} {inv.unit})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Área de Impresión / Estampado</label>
              <input
                type="text"
                placeholder="Ej: 9.5 x 20 cm (Panorámica)"
                value={formData.sublimationAreaText || ''}
                onChange={e => setFormData({ ...formData, sublimationAreaText: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <div className="flex items-center gap-6 pt-5">
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured || false}
                  onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Destacar en Portada</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isCustomizable ?? true}
                  onChange={e => setFormData({ ...formData, isCustomizable: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Habilitar Personalizador</span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Descripción del Producto</label>
            <textarea
              rows={3}
              placeholder="Detalla materiales, acabado, resistencia a lavados..."
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs"
            />
          </div>

          {/* Fotografías del Producto - Subida por Lados (Frente y Espalda para vista 360°) */}
          <div className="space-y-4 bg-slate-50 p-4 sm:p-5 rounded-3xl border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-indigo-600" />
                  <span>Fotos del Producto (Frente y Parte de Atrás para 360°)</span>
                </label>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Sube la foto del <strong>frente</strong> y la foto de la <strong>parte de atrás</strong> de la camisa o producto para activar la vista 360°.
                </p>
              </div>

              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 self-start sm:self-auto">
                {formData.images?.length || 0} foto(s) cargada(s)
              </span>
            </div>

            {/* Dos Cajas Principales: FRENTE y ESPALDA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* CAJA 1: FOTO DEL FRENTE */}
              <div className="bg-white p-3.5 rounded-2xl border-2 border-indigo-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    1. Foto del Frente (0°) *
                  </span>
                  {formData.images?.[0] && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      ✓ Cargada
                    </span>
                  )}
                </div>

                {formData.images?.[0] ? (
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group">
                    <img src={formData.images[0]} alt="Frente" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(0)}
                      className="absolute top-2 right-2 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md cursor-pointer transition-transform hover:scale-110"
                      title="Eliminar foto del frente"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <label className="absolute bottom-2 inset-x-2 py-1.5 bg-slate-900/90 hover:bg-indigo-600 text-white text-center text-[10px] font-bold rounded-lg cursor-pointer transition-colors shadow">
                      <span>Cambiar foto del frente</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleSlotImageFile(0, e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-indigo-300 hover:border-indigo-500 bg-indigo-50/40 hover:bg-indigo-50/80 rounded-xl cursor-pointer transition-all aspect-4/3 text-center group">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-1.5 group-hover:scale-110 shadow-xs transition-transform">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-indigo-950">Subir Foto del Frente</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">Toca aquí para elegir foto frontal</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSlotImageFile(0, e)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* CAJA 2: FOTO DE LA ESPALDA / PARTE DE ATRÁS */}
              <div className="bg-white p-3.5 rounded-2xl border-2 border-purple-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    2. Foto de la Espalda / Atrás (180°)
                  </span>
                  {formData.images?.[1] ? (
                    <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                      ✓ Lista para 360°
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      Opcional
                    </span>
                  )}
                </div>

                {formData.images?.[1] ? (
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group">
                    <img src={formData.images[1]} alt="Espalda" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(1)}
                      className="absolute top-2 right-2 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md cursor-pointer transition-transform hover:scale-110"
                      title="Eliminar foto de la espalda"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <label className="absolute bottom-2 inset-x-2 py-1.5 bg-slate-900/90 hover:bg-purple-600 text-white text-center text-[10px] font-bold rounded-lg cursor-pointer transition-colors shadow">
                      <span>Cambiar foto de la espalda</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleSlotImageFile(1, e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-purple-300 hover:border-purple-500 bg-purple-50/40 hover:bg-purple-50/80 rounded-xl cursor-pointer transition-all aspect-4/3 text-center group">
                    <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-1.5 group-hover:scale-110 shadow-xs transition-transform">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-purple-950">Subir Foto de Atrás / Espalda</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">Para ver la camisa girando en 360°</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSlotImageFile(1, e)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

            </div>

            {/* Opciones Adicionales: Subir todas de golpe o pegar URL */}
            <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5 text-indigo-600" />
                <span>📁 Seleccionar múltiples fotos de golpe</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={isCompressingImages}
                  onChange={handleMultipleImageFiles}
                  className="hidden"
                />
              </label>

              <div className="flex items-center gap-2 flex-1 sm:max-w-xs">
                <input
                  type="url"
                  placeholder="O pegar URL de imagen..."
                  value={newImageUrl}
                  onChange={e => setNewImageUrl(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddImageUrl(); } }}
                  className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0"
                >
                  + URL
                </button>
              </div>
            </div>

            {/* Cuadrícula de Todas las Fotos Subidas si hay más de 2 */}
            {formData.images && formData.images.length > 2 && (
              <div className="space-y-1.5 pt-2 border-t border-slate-200">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                  Fotos adicionales / detalles ({formData.images.length - 2}):
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {formData.images.slice(2).map((img, idx) => {
                    const realIdx = idx + 2;
                    return (
                      <div key={realIdx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-white group">
                        <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <span className="absolute top-1 left-1 bg-slate-900/80 text-white text-[8px] font-bold px-1 rounded">
                          #{realIdx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(realIdx)}
                          className="absolute top-1 right-1 p-0.5 bg-rose-600 text-white rounded-full hover:scale-110 cursor-pointer"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Product Video (Optional) */}
          <div className="space-y-2 pt-3 border-t border-slate-100 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-indigo-600" />
                <span>Video Demostrativo del Producto (Opcional)</span>
              </label>
              {formData.videoUrl && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, videoUrl: '' })}
                  className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold underline cursor-pointer"
                >
                  Quitar video
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Pega un enlace de <strong>YouTube</strong>, <strong>Shorts</strong>, <strong>TikTok</strong>, <strong>Vimeo</strong> o archivo <strong>.mp4</strong> para mostrar una demostración en vivo de este artículo.
            </p>
            <input
              type="url"
              placeholder="Ej: https://www.youtube.com/watch?v=... o https://youtube.com/shorts/..."
              value={formData.videoUrl || ''}
              onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Variants */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 block">Variantes y Opciones (Colores, Tallas, Acabados)</label>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <input
                type="text"
                placeholder="Nombre (ej: Talla XL)"
                value={newVarName}
                onChange={e => setNewVarName(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
              />
              <select
                value={newVarType}
                onChange={e => setNewVarType(e.target.value as any)}
                className="px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
              >
                <option value="color">Color</option>
                <option value="size">Talla</option>
                <option value="finish">Acabado</option>
                <option value="material">Material</option>
              </select>
              <input
                type="number"
                step="0.5"
                placeholder="Precio extra ($)"
                value={newVarModifier || ''}
                onChange={e => setNewVarModifier(parseFloat(e.target.value) || 0)}
                className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
              />
              <button
                type="button"
                onClick={handleAddVariant}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700"
              >
                + Añadir
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.variants?.map(v => (
                <span key={v.id} className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-900 border border-indigo-200 rounded-xl text-xs">
                  <strong>{v.name}</strong> ({v.type}) {v.priceModifier > 0 && `+$${v.priceModifier}`}
                  <button type="button" onClick={() => handleRemoveVariant(v.id)} className="text-rose-500 hover:text-rose-700">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
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
              {productToEdit ? 'Guardar Cambios' : 'Publicar Producto'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
