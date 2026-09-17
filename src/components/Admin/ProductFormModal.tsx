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
    mockupType: 'tshirt',
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
        mockupType: 'tshirt',
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

  // Upload Multiple Photos at once
  const handleMultipleImageFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsCompressingImages(true);
      const fileList = Array.from(files);
      const compressedList = await Promise.all(
        fileList.map(file => compressImageFile(file, 1200, 0.85))
      );

      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...compressedList]
      }));

      showToast("¡" + compressedList.length + " foto(s) cargada(s) con éxito!", "success");
    } catch (err) {
      console.error(err);
      showToast("Error al procesar las imágenes.", "error");
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
    showToast("Imagen añadida por URL.", "success");
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
      id: "v-" + Date.now(),
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

    if (!formData.images || formData.images.length === 0) {
      showToast("Por favor sube al menos una fotografía del producto.", "warning");
      return;
    }

    let finalCategory = formData.category || 'tazas';
    if (isCustomCategory && customCategoryName.trim()) {
      finalCategory = customCategoryName.trim().toLowerCase().replace(/\s+/g, '_') as ProductCategory;
    }

    const payload: Product = {
      id: productToEdit ? productToEdit.id : ("prod-" + Date.now()),
      name: formData.name.trim(),
      slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: finalCategory,
      basePrice: Number(formData.basePrice),
      description: formData.description || '',
      features: formData.features || [],
      images: formData.images || [],
      videoUrl: formData.videoUrl || '',
      mockupType: formData.mockupType || 'tshirt',
      linkedInventoryId: formData.linkedInventoryId || undefined,
      variants: formData.variants || [],
      tags: formData.tags || [],
      featured: formData.featured || false,
      isCustomizable: formData.isCustomizable ?? true,
      minQuantity: formData.minQuantity || 1,
      sublimationAreaText: formData.sublimationAreaText || '9.5 x 20 cm',
      rating: formData.rating || 5.0,
      reviewCount: formData.reviewCount || 1
    };

    if (productToEdit) {
      updateProduct(payload);
      showToast("Producto actualizado exitosamente.", "success");
    } else {
      addProduct(payload);
      showToast("Producto publicado exitosamente en el catálogo.", "success");
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-4 sm:p-8 shadow-2xl border border-slate-100 relative my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer group"
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
                {productToEdit ? 'Modifica detalles, fotos y opciones.' : 'Completa los datos y sube las fotos para publicar en la tienda.'}
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
                placeholder="Ej: Camiseta de Algodón Premium Personalizada"
                value={formData.name || ''}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 block">Categoría / Línea</label>
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
                  placeholder="Ej: 👕 Camisetas & Playeras"
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
              <label className="text-xs font-bold text-slate-700 block mb-1">Tipo de Simulador Mockup</label>
              <select
                value={formData.mockupType}
                onChange={e => setFormData({ ...formData, mockupType: e.target.value as ProductMockupType })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white font-semibold text-indigo-700"
              >
                <option value="tshirt">Camiseta / Playera (T-Shirt)</option>
                <option value="hoodie">Sudadera con Capucha (Hoodie)</option>
                <option value="mug">Taza Cilíndrica (Mug)</option>
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
                placeholder="Ej: 30 x 40 cm"
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

          {/* ========================================================================= */}
          {/* FOTOGRAFÍAS DEL PRODUCTO - SUBIDA SIMPLE Y DIRECTA */}
          {/* ========================================================================= */}
          <div className="space-y-4 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-indigo-600" />
                  <span>Fotografías del Producto</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sube las fotos de tu artículo (frente, reverso, detalles). La primera foto será la portada.
                </p>
              </div>

              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 self-start sm:self-auto">
                {formData.images?.length || 0} foto(s) cargada(s)
              </span>
            </div>

            {/* Botón Principal de Subida Múltiple */}
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-indigo-300 hover:border-indigo-500 bg-white hover:bg-indigo-50/50 rounded-2xl cursor-pointer transition-all group text-center shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-2 group-hover:scale-110 shadow-sm transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-indigo-950">
                {isCompressingImages ? "Optimizando y cargando fotos..." : "📁 Seleccionar fotos desde tu dispositivo"}
              </span>
              <span className="text-[11px] text-slate-500 mt-1">
                Puedes seleccionar 1 o varias fotos al mismo tiempo
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={isCompressingImages}
                onChange={handleMultipleImageFiles}
                className="hidden"
              />
            </label>

            {/* O pegar URL */}
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="O pega un enlace de imagen directa (https://...)"
                value={newImageUrl}
                onChange={e => setNewImageUrl(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddImageUrl(); } }}
                className="flex-1 px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0"
              >
                + Añadir URL
              </button>
            </div>

            {/* Cuadrícula de Fotos Subidas */}
            {formData.images && formData.images.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Fotos cargadas ({formData.images.length}):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-slate-200 bg-white shadow-xs group">
                      <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      
                      {/* Badge # */}
                      <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold shadow-xs bg-slate-900/80 text-white">
                        {idx === 0 ? 'Portada (Foto 1)' : 'Foto ' + (idx + 1)}
                      </span>

                      {/* Botón Eliminar */}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-rose-600 text-white hover:bg-rose-700 shadow-md transition-transform hover:scale-110 cursor-pointer"
                        title="Eliminar foto"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      {/* Botones para Mover Orden */}
                      <div className="absolute bottom-1.5 inset-x-1.5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 p-1 rounded-lg backdrop-blur-2xs">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveImage(idx, 'left')}
                          className="text-white text-[10px] font-bold px-1.5 py-0.5 rounded hover:bg-white/20 disabled:opacity-30 cursor-pointer"
                          title="Mover antes"
                        >
                          ◀
                        </button>
                        <span className="text-[9px] text-slate-300 font-mono">#{idx + 1}</span>
                        <button
                          type="button"
                          disabled={idx === (formData.images?.length || 1) - 1}
                          onClick={() => handleMoveImage(idx, 'right')}
                          className="text-white text-[10px] font-bold px-1.5 py-0.5 rounded hover:bg-white/20 disabled:opacity-30 cursor-pointer"
                          title="Mover después"
                        >
                          ▶
                        </button>
                      </div>
                    </div>
                  ))}
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
            <input
              type="url"
              placeholder="Enlace de video en formato MP4 (https://...)"
              value={formData.videoUrl || ''}
              onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs bg-white"
            />
          </div>

          {/* Variants */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-800 block">
              Variantes y Opciones Disponibles (Tallas, Colores, etc.)
            </label>
            
            <div className="flex flex-wrap gap-2">
              {formData.variants?.map(v => (
                <span 
                  key={v.id} 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-medium text-slate-800"
                >
                  <span className="font-bold">{v.name}</span>
                  {v.priceModifier > 0 && (
                    <span className="text-indigo-600 font-bold">(+$" + v.priceModifier.toFixed(2) + ")</span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(v.id)}
                    className="text-slate-400 hover:text-rose-600 ml-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 items-center bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <input
                type="text"
                placeholder="Nombre (Ej: Talla XL / Negro)"
                value={newVarName}
                onChange={e => setNewVarName(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-white flex-1 min-w-[140px]"
              />
              <select
                value={newVarType}
                onChange={e => setNewVarType(e.target.value as any)}
                className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-white"
              >
                <option value="size">Talla</option>
                <option value="color">Color</option>
                <option value="finish">Acabado</option>
                <option value="material">Material</option>
              </select>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-500">+$</span>
                <input
                  type="number"
                  step="0.50"
                  min="0"
                  placeholder="Extra"
                  value={newVarModifier || ''}
                  onChange={e => setNewVarModifier(parseFloat(e.target.value) || 0)}
                  className="w-16 px-2 py-1.5 border border-slate-300 rounded-xl text-xs bg-white text-right"
                />
              </div>
              <button
                type="button"
                onClick={handleAddVariant}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                + Opción
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-800 block">
              Puntos Fuertes / Características Destacadas
            </label>
            <div className="flex flex-wrap gap-2">
              {formData.features?.map((feat, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-800 text-xs font-medium">
                  <span>{feat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-indigo-400 hover:text-rose-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ej: Estampado indeleble apto para microondas y lavavajillas"
                value={newFeatureText}
                onChange={e => setNewFeatureText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddFeature(); } }}
                className="flex-1 px-3.5 py-1.5 border border-slate-300 rounded-xl text-xs"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                + Añadir
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-800 block">Etiquetas de Búsqueda (Tags)</label>
            <div className="flex flex-wrap gap-1.5">
              {formData.tags?.map((tag, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-xs">
                  <span>#{tag}</span>
                  <button type="button" onClick={() => handleRemoveTag(idx)} className="text-slate-400 hover:text-rose-600 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ej: anime, cumpleaños, corporativo..."
                value={newTagText}
                onChange={e => setNewTagText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                className="flex-1 px-3.5 py-1.5 border border-slate-300 rounded-xl text-xs"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                + Tag
              </button>
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 sticky bottom-0 bg-white/95 backdrop-blur-md p-2 -mx-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isCompressingImages}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all cursor-pointer disabled:opacity-50"
            >
              {productToEdit ? 'Guardar Cambios' : 'Publicar Producto en Catálogo'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
