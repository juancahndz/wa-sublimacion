import React, { useState, useEffect } from 'react';
import { Product, ProductCategory, ProductMockupType, ProductVariant } from '../../types';
import { useStore } from '../../context/StoreContext';
import { ArrowLeft, X, Plus, Trash2, Upload, Sparkles, Layers, Image as ImageIcon, Film, RotateCw, Check } from 'lucide-react';
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

  // Explicit state for front and back images to prevent array shifts
  const [frontImage, setFrontImage] = useState<string>('');
  const [backImage, setBackImage] = useState<string>('');
  const [extraImages, setExtraImages] = useState<string[]>([]);
  const [previewFlip, setPreviewFlip] = useState(false);

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
      setFrontImage(productToEdit.images?.[0] || '');
      setBackImage(productToEdit.images?.[1] || '');
      setExtraImages(productToEdit.images?.slice(2) || []);
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
      setFrontImage('');
      setBackImage('');
      setExtraImages([]);
    }
    setPreviewFlip(false);
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

  // Upload Front Image directly
  const handleUploadFront = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressingImages(true);
      const compressed = await compressImageFile(file, 1200, 0.85);
      setFrontImage(compressed);
      showToast("Foto del FRENTE cargada con éxito.", "success");
    } catch (err) {
      console.error(err);
      showToast("Error al cargar la foto frontal.", "error");
    } finally {
      setIsCompressingImages(false);
      e.target.value = '';
    }
  };

  // Upload Back Image directly
  const handleUploadBack = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressingImages(true);
      const compressed = await compressImageFile(file, 1200, 0.85);
      setBackImage(compressed);
      showToast("Foto de la PARTE DE ATRÁS (360°) cargada con éxito.", "success");
    } catch (err) {
      console.error(err);
      showToast("Error al cargar la foto de atrás.", "error");
    } finally {
      setIsCompressingImages(false);
      e.target.value = '';
    }
  };

  // Upload Additional photos
  const handleUploadExtras = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsCompressingImages(true);
      const fileList = Array.from(files);
      const compressedList = await Promise.all(
        fileList.map(file => compressImageFile(file, 1200, 0.85))
      );

      // If front is empty, put first in front
      let remaining = [...compressedList];
      if (!frontImage && remaining.length > 0) {
        setFrontImage(remaining[0]);
        remaining = remaining.slice(1);
      }
      if (!backImage && remaining.length > 0) {
        setBackImage(remaining[0]);
        remaining = remaining.slice(1);
      }
      if (remaining.length > 0) {
        setExtraImages(prev => [...prev, ...remaining]);
      }

      showToast(compressedList.length + " foto(s) cargada(s) con éxito.", "success");
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
    const url = newImageUrl.trim();
    if (!frontImage) {
      setFrontImage(url);
    } else if (!backImage) {
      setBackImage(url);
    } else {
      setExtraImages(prev => [...prev, url]);
    }
    setNewImageUrl('');
    showToast("Imagen añadida.", "success");
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

    if (!frontImage) {
      showToast("Por favor sube al menos la Foto del Frente del producto.", "warning");
      return;
    }

    // Combine images: Front is images[0], Back is images[1], then extra images
    const finalImages: string[] = [frontImage];
    if (backImage) {
      finalImages.push(backImage);
    }
    if (extraImages && extraImages.length > 0) {
      finalImages.push(...extraImages);
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
      images: finalImages,
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
                placeholder="Ej: Camiseta de Algodón Premium Personalizada"
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
                placeholder="Ej: 30 x 40 cm (Pecho / Espalda)"
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
          {/* SECCIÓN CLARA DE FOTOS: FRENTE Y PARTE DE ATRÁS (ESPALDA) PARA VISTA 360° */}
          {/* ========================================================================= */}
          <div className="space-y-4 bg-indigo-50/40 p-4 sm:p-6 rounded-3xl border-2 border-indigo-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-100 pb-3">
              <div>
                <h4 className="text-sm font-black text-indigo-950 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-indigo-600" />
                  <span>Subir Fotos del Producto (Frente y Espalda para 360°)</span>
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Sube aquí la foto del <strong>frente</strong> y la foto de la <strong>parte de atrás</strong> de la camisa para verla girando en 360°.
                </p>
              </div>

              {isCompressingImages && (
                <span className="text-xs font-bold text-indigo-600 animate-pulse">
                  Procesando imagen...
                </span>
              )}
            </div>

            {/* Dos Cajas Principales Destacadas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* CAJA 1: FOTO DEL FRENTE */}
              <div className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                frontImage ? 'bg-white border-emerald-400 shadow-sm' : 'bg-white border-dashed border-indigo-300 hover:border-indigo-500'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${frontImage ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    1. Foto del Frente (0°) *
                  </span>
                  {frontImage ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Frente Listo
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                      Requerido
                    </span>
                  )}
                </div>

                {frontImage ? (
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center p-2 group">
                    <img src={frontImage} alt="Frente" className="max-h-full max-w-full object-contain drop-shadow-xs" referrerPolicy="no-referrer" />
                    <button
                      type="button"
                      onClick={() => setFrontImage('')}
                      className="absolute top-2 right-2 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md cursor-pointer transition-transform hover:scale-110"
                      title="Quitar foto del frente"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <label className="absolute bottom-2 inset-x-2 py-1.5 bg-slate-900/90 hover:bg-indigo-600 text-white text-center text-[10px] font-bold rounded-lg cursor-pointer transition-colors shadow">
                      <span>Cambiar foto del frente</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadFront}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-6 rounded-xl cursor-pointer hover:bg-indigo-50/50 transition-colors aspect-4/3 text-center group">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-2 group-hover:scale-110 shadow-sm transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-indigo-900">
                      📸 Seleccionar Foto del FRENTE
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1">
                      Toca aquí para elegir la foto delantera
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadFront}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* CAJA 2: FOTO DE LA PARTE DE ATRÁS (ESPALDA) */}
              <div className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                backImage ? 'bg-white border-purple-400 shadow-sm' : 'bg-white border-dashed border-purple-300 hover:border-purple-500'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-purple-950 flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${backImage ? 'bg-purple-500' : 'bg-slate-300'}`} />
                    2. Foto de la Parte de Atrás (180°)
                  </span>
                  {backImage ? (
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <RotateCw className="w-3 h-3" />
                      360° Activo
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                      Para vista 360°
                    </span>
                  )}
                </div>

                {backImage ? (
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center p-2 group">
                    <img src={backImage} alt="Espalda" className="max-h-full max-w-full object-contain drop-shadow-xs" referrerPolicy="no-referrer" />
                    <button
                      type="button"
                      onClick={() => setBackImage('')}
                      className="absolute top-2 right-2 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md cursor-pointer transition-transform hover:scale-110"
                      title="Quitar foto de la espalda"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <label className="absolute bottom-2 inset-x-2 py-1.5 bg-slate-900/90 hover:bg-purple-600 text-white text-center text-[10px] font-bold rounded-lg cursor-pointer transition-colors shadow">
                      <span>Cambiar foto de la espalda</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadBack}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-6 rounded-xl cursor-pointer hover:bg-purple-50/50 transition-colors aspect-4/3 text-center group">
                    <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center mb-2 group-hover:scale-110 shadow-sm transition-transform">
                      <RotateCw className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-purple-950">
                      🔄 Seleccionar Foto de la PARTE DE ATRÁS
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1">
                      Para ver la camisa girando en 360°
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadBack}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

            </div>

            {/* Previsualizador Rápido en Vivo de Frente y Espalda */}
            {(frontImage || backImage) && (
              <div className="bg-white p-3.5 rounded-2xl border border-indigo-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                    <img 
                      src={previewFlip && backImage ? backImage : (frontImage || backImage)} 
                      alt="Vista previa" 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      {previewFlip && backImage ? 'Vista: Espalda / Atrás (180°)' : 'Vista: Frente (0°)'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {backImage ? '✓ Producto listo con vista 360° Frente y Espalda' : 'Sube la foto de atrás para activar el giro 360°'}
                    </span>
                  </div>
                </div>

                {backImage && (
                  <button
                    type="button"
                    onClick={() => setPreviewFlip(!previewFlip)}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <RotateCw className={`w-3.5 h-3.5 transition-transform duration-500 ${previewFlip ? 'rotate-180' : ''}`} />
                    <span>{previewFlip ? 'Ver Frente' : 'Girar y Ver Espalda'}</span>
                  </button>
                )}
              </div>
            )}

            {/* Opciones Secundarias: Múltiples fotos y pegar URL */}
            <div className="pt-2 border-t border-indigo-100 flex flex-wrap items-center justify-between gap-2">
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 text-indigo-900 border border-indigo-200 text-xs font-bold cursor-pointer transition-colors shadow-2xs">
                <Upload className="w-3.5 h-3.5 text-indigo-600" />
                <span>📁 Subir múltiples fotos juntas</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={isCompressingImages}
                  onChange={handleUploadExtras}
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

            {/* Fotos adicionales */}
            {extraImages && extraImages.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-indigo-100">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                  Fotos adicionales ({extraImages.length}):
                </span>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {extraImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-white group">
                      <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <button
                        type="button"
                        onClick={() => setExtraImages(prev => prev.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 p-0.5 bg-rose-600 text-white rounded-full hover:scale-110 cursor-pointer shadow"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
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
