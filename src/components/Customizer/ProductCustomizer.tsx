import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { MockupCanvas } from './MockupCanvas';
import { Product, DesignTemplate, CustomDesignData } from '../../types';
import { 
  Upload, 
  Type, 
  Palette, 
  RotateCw, 
  ZoomIn, 
  Move, 
  Sparkles, 
  ShoppingBag, 
  MessageCircle, 
  Eye, 
  Sliders, 
  Check, 
  Info,
  Layers,
  Image as ImageIcon,
  Trash2,
  Download,
  Wand2,
  Smile,
  RefreshCw,
  Share2
} from 'lucide-react';

const AI_OCCASION_IDEAS: { category: string; ideas: string[] }[] = [
  {
    category: '❤️ Amor & Parejas',
    ideas: [
      'Tú y Yo Contra el Mundo ❤️',
      'Nuestra Historia Comienza Aquí ✨ 14.02.2024',
      'Eres mi Lugar Favorito en el Universo 🪐',
      'Contigo Todo es Mejor ☕❤️',
      'Amor Infinito & Café Caliente'
    ]
  },
  {
    category: '🎮 Gamer & Geek',
    ideas: [
      'EAT · SLEEP · GAME · REPEAT 🕹️',
      'Modo Gamer: NO MOLESTAR 🚫',
      'Level Up! Nivel Desbloqueado 🚀',
      'Player 1 Ready | High Score Club 👾',
      'Respawn en 3, 2, 1... ⚡'
    ]
  },
  {
    category: '☕ Café & Oficina',
    ideas: [
      'Primero Café, Luego Tu Opinión ☕',
      'Sobreviviendo a otro Lunes con Estilo ✨',
      'Cargando Paciencia... 99% 🔋',
      'El Mejor Jefe / Colega del Mundo 🏆',
      'Café: Mi Combustible Creativo 💡'
    ]
  },
  {
    category: '🐾 Mascotas Pet Lover',
    ideas: [
      'El Rey de la Casa Tiene 4 Patas 👑🐾',
      'Amor a Primera Huella 🐶❤️',
      'Gato Feliz = Hogar en Paz 🐱✨',
      'Mi Humano Favorito me Dio Esto 🦴',
      'Lealtad Incondicional 🐾'
    ]
  },
  {
    category: '🎓 Graduación & Éxito',
    ideas: [
      'Misión Cumplida: Generación 2026 🎓',
      'El Futuro Pertenece a Quien Sueña 🚀',
      'Licenciado en Hacerlo Realidad ✨',
      'Orgullo Graduado 2026 🎓🏆',
      'Lo Logré con Esfuerzo & Pasión'
    ]
  }
];

const STICKER_PRESETS: { emoji: string; name: string }[] = [
  { emoji: '❤️', name: 'Corazón' },
  { emoji: '👑', name: 'Corona' },
  { emoji: '⚡', name: 'Rayo' },
  { emoji: '☕', name: 'Café' },
  { emoji: '🎮', name: 'Mando' },
  { emoji: '🐾', name: 'Huella' },
  { emoji: '🚀', name: 'Cohete' },
  { emoji: '🎓', name: 'Graduado' },
  { emoji: '🔥', name: 'Fuego' },
  { emoji: '⭐', name: 'Estrella' },
  { emoji: '🌸', name: 'Flor' },
  { emoji: '🏆', name: 'Trofeo' }
];

export const ProductCustomizer: React.FC = () => {
  const { 
    products, 
    designTemplates, 
    selectedProductForCustomizer, 
    setSelectedProductForCustomizer,
    selectedTemplateForCustomizer,
    setSelectedTemplateForCustomizer,
    addToCart, 
    settings,
    setActiveView,
    showToast
  } = useStore();

  // Active product being customized
  const [currentProduct, setCurrentProduct] = useState<Product>(
    selectedProductForCustomizer || products[0] || {} as Product
  );

  // Sync if selected from outside
  useEffect(() => {
    if (selectedProductForCustomizer) {
      setCurrentProduct(selectedProductForCustomizer);
    }
  }, [selectedProductForCustomizer]);

  // Variant selections
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  
  // Customization state
  const [customDesign, setCustomDesign] = useState<CustomDesignData>({
    uploadedImageUrl: selectedTemplateForCustomizer?.imageUrl || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    selectedTemplateId: selectedTemplateForCustomizer?.id || undefined,
    customText: 'Mi Nombre o Frase',
    textColor: '#1E293B',
    fontFamily: 'sans',
    fontSize: 16,
    position: 'frente',
    scale: 1,
    rotation: 0,
    offsetX: 0,
    offsetY: 0,
    specialInstructions: '',
    printFinish: 'brillante'
  });

  const [quantity, setQuantity] = useState<number>(1);
  const [showGuides, setShowGuides] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'image' | 'text' | 'adjust' | 'variants' | 'ai'>('image');
  const [aiGenerating, setAiGenerating] = useState(false);

  // Initialize variants when currentProduct changes
  useEffect(() => {
    if (currentProduct?.variants?.length) {
      const initialVars: Record<string, string> = {};
      currentProduct.variants.forEach(v => {
        if (!initialVars[v.type]) {
          initialVars[v.type] = v.name;
        }
      });
      setSelectedVariants(initialVars);
    }
  }, [currentProduct]);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast("La imagen supera los 10MB. Por favor sube un archivo más liviano.", "warning");
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const resultUrl = uploadEvent.target?.result as string;
        setCustomDesign(prev => ({
          ...prev,
          uploadedImageUrl: resultUrl,
          selectedTemplateId: undefined
        }));
        showToast("¡Imagen cargada en el personalizador con éxito!", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  // Price calculations
  let variantExtras = 0;
  Object.entries(selectedVariants).forEach(([_, valName]) => {
    const found = currentProduct.variants?.find(v => v.name === valName);
    if (found) variantExtras += found.priceModifier;
  });

  let customExtras = 0;
  if (customDesign.position === 'ambos') customExtras += 2.50;
  if (customDesign.position === 'panoramico') customExtras += 1.00;
  if (customDesign.printFinish === 'metalizado') customExtras += 1.50;

  const unitPrice = (currentProduct.basePrice || 0) + variantExtras + customExtras;
  const totalPrice = unitPrice * quantity;

  // Selected base color for mockup
  const getSelectedColorHex = () => {
    const colorVarName = selectedVariants['color'];
    if (colorVarName) {
      const v = currentProduct.variants?.find(item => item.name === colorVarName);
      if (v?.value && v.value.startsWith('#')) return v.value;
    }
    return '#FFFFFF';
  };

  const handleAddToCart = () => {
    addToCart(currentProduct, quantity, selectedVariants, customDesign);
  };

  const handleWhatsAppOrder = () => {
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const variantList = Object.entries(selectedVariants).map(([k, v]) => `${k}: ${v}`).join(', ');
    const textMsg = encodeURIComponent(
      `¡Hola ${settings.storeName}! 👋\n` +
      `Deseo ordenar el siguiente producto personalizado de sublimación:\n\n` +
      `📦 *Producto:* ${currentProduct.name}\n` +
      `🎨 *Opciones:* ${variantList || 'Estándar'}\n` +
      `✍️ *Texto personalizado:* "${customDesign.customText || 'Sin texto'}"\n` +
      `📍 *Posición:* ${customDesign.position}\n` +
      `✨ *Acabado:* ${customDesign.printFinish || 'Brillante'}\n` +
      `🔢 *Cantidad:* ${quantity} unidad(es)\n` +
      `💰 *Total estimado:* ${settings.currency}${totalPrice.toFixed(2)}\n\n` +
      `Notas: ${customDesign.specialInstructions || 'Ninguna'}`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${textMsg}`, '_blank');
  };

  const handleApplyAiIdea = (phrase: string) => {
    setCustomDesign(prev => ({
      ...prev,
      customText: phrase
    }));
    setActiveTab('text');
    showToast(`Dedicatoria "${phrase}" aplicada.`, 'success');
  };

  const handleAddSticker = (emoji: string) => {
    setCustomDesign(prev => ({
      ...prev,
      customText: prev.customText ? `${prev.customText} ${emoji}` : emoji
    }));
    showToast(`Sticker ${emoji} agregado al diseño.`, 'info');
  };

  return (
    <section className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Estudio de Diseño & Sublimación Térmica</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Personaliza tu Producto en Tiempo Real
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Sube tus fotos, logos, dedicatorias o elige plantillas con simulación visual instantánea.
            </p>
          </div>

          {/* Product Switcher Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Artículo:</span>
            <select
              value={currentProduct.id}
              onChange={(e) => {
                const found = products.find(p => p.id === e.target.value);
                if (found) {
                  setCurrentProduct(found);
                  setSelectedProductForCustomizer(found);
                }
              }}
              className="bg-white border border-slate-300 rounded-xl px-4 py-2 text-sm font-semibold text-slate-800 shadow-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({settings.currency}{p.basePrice.toFixed(2)})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Grid: Left Mockup Stage | Right Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Mockup Canvas Preview */}
          <div className="lg:col-span-6 xl:col-span-7 space-y-4">
            <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm relative">
              <MockupCanvas
                mockupType={currentProduct.mockupType || 'mug'}
                baseColor={getSelectedColorHex()}
                customDesign={customDesign}
                productName={currentProduct.name}
                showGuides={showGuides}
              />

              {/* Quick Canvas Controls Bar */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowGuides(!showGuides)}
                    className={`px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                      showGuides ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {showGuides ? 'Ocultar Guías' : 'Mostrar Guías'}
                  </button>

                  <button
                    onClick={() => setCustomDesign(prev => ({ ...prev, scale: 1, rotation: 0, offsetX: 0, offsetY: 0 }))}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 font-medium text-slate-600 transition-colors cursor-pointer"
                  >
                    Centrar Arte
                  </button>

                  <button
                    onClick={() => {
                      if (customDesign.uploadedImageUrl) {
                        window.open(customDesign.uploadedImageUrl, '_blank');
                      } else {
                        showToast("Sube una imagen o selecciona plantilla para abrir el arte.", "info");
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 font-medium text-slate-600 transition-colors flex items-center gap-1 cursor-pointer"
                    title="Ver archivo de arte"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Ver Arte
                  </button>
                </div>

                <div className="text-[11px] text-slate-400">
                  Área: <strong className="text-slate-600">{currentProduct.sublimationAreaText}</strong>
                </div>
              </div>
            </div>

            {/* Product Highlights Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                <Info className="w-4 h-4 text-indigo-600" />
                <span>Especificaciones Técnicas de Sublimación</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-slate-600">
                {currentProduct.features?.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Customizer Controls Accordion / Tabs */}
          <div className="lg:col-span-6 xl:col-span-5 space-y-5">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
              
              {/* Tab Navigation */}
              <div className="grid grid-cols-5 gap-1 p-1 bg-slate-100 rounded-2xl text-[11px] font-semibold">
                <button
                  onClick={() => setActiveTab('image')}
                  className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    activeTab === 'image' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>Arte</span>
                </button>

                <button
                  onClick={() => setActiveTab('text')}
                  className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    activeTab === 'text' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Type className="w-4 h-4" />
                  <span>Texto</span>
                </button>

                <button
                  onClick={() => setActiveTab('ai')}
                  className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    activeTab === 'ai' ? 'bg-white text-pink-600 shadow-xs' : 'text-slate-600 hover:text-pink-600'
                  }`}
                >
                  <Wand2 className="w-4 h-4 text-pink-500" />
                  <span>Ideas IA</span>
                </button>

                <button
                  onClick={() => setActiveTab('adjust')}
                  className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    activeTab === 'adjust' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sliders className="w-4 h-4" />
                  <span>Posición</span>
                </button>

                <button
                  onClick={() => setActiveTab('variants')}
                  className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    activeTab === 'variants' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Palette className="w-4 h-4" />
                  <span>Opciones</span>
                </button>
              </div>

              {/* Tab 1: Image & Design Upload */}
              {activeTab === 'image' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Sube tu Foto, Logo o Ilustración
                    </label>
                    <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-indigo-300 hover:border-indigo-500 bg-indigo-50/40 hover:bg-indigo-50/80 rounded-2xl cursor-pointer transition-all">
                      <Upload className="w-8 h-8 text-indigo-600 mb-2" />
                      <span className="text-xs font-semibold text-indigo-900">Haz clic o arrastra tu archivo</span>
                      <span className="text-[11px] text-slate-500 mt-0.5">PNG, JPG, WebP (Hasta 10MB)</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="hidden" 
                      />
                    </label>
                  </div>

                  {/* Pre-made Templates Quick Picker */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        O Elige una Plantilla de Catálogo
                      </span>
                      <button
                        onClick={() => setActiveView('designs')}
                        className="text-xs text-indigo-600 hover:underline font-semibold"
                      >
                        Ver todas
                      </button>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {designTemplates.slice(0, 8).map(tpl => (
                        <button
                          key={tpl.id}
                          onClick={() => {
                            setCustomDesign(prev => ({
                              ...prev,
                              uploadedImageUrl: tpl.imageUrl,
                              selectedTemplateId: tpl.id
                            }));
                            showToast(`Plantilla "${tpl.title}" aplicada.`, 'info');
                          }}
                          className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                            customDesign.selectedTemplateId === tpl.id
                              ? 'border-indigo-600 ring-2 ring-indigo-300'
                              : 'border-slate-200 hover:border-indigo-400'
                          }`}
                        >
                          <img 
                            src={tpl.imageUrl} 
                            alt={tpl.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1">
                            <span className="text-[10px] text-white font-medium text-center leading-tight">
                              {tpl.title}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Stickers */}
                  <div>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                      Añadir Stickers / Emojis Rápidos
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {STICKER_PRESETS.map((stk, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleAddSticker(stk.emoji)}
                          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-indigo-50 border border-slate-200 flex items-center justify-center text-base hover:scale-110 transition-all cursor-pointer"
                          title={stk.name}
                        >
                          {stk.emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {customDesign.uploadedImageUrl && (
                    <button
                      onClick={() => setCustomDesign(prev => ({ ...prev, uploadedImageUrl: undefined, selectedTemplateId: undefined }))}
                      className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1.5 font-medium pt-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Quitar imagen actual
                    </button>
                  )}
                </div>
              )}

              {/* Tab 2: Custom Text */}
              {activeTab === 'text' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Dedicatoria, Frase o Nombre
                    </label>
                    <input
                      type="text"
                      placeholder="Escribe aquí tu frase..."
                      value={customDesign.customText || ''}
                      onChange={(e) => setCustomDesign(prev => ({ ...prev, customText: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  {/* Font Choice */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Estilo de Tipografía
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'sans', label: 'Moderna Sans', preview: 'Aa Sans' },
                        { id: 'serif', label: 'Elegante Serif', preview: 'Aa Serif' },
                        { id: 'script', label: 'Cursiva Script', preview: 'Aa Script' },
                        { id: 'black', label: 'Impact / Gamer', preview: 'AA BOLD' },
                        { id: 'mono', label: 'Máquina / Mono', preview: 'Aa Mono' }
                      ].map(font => (
                        <button
                          key={font.id}
                          onClick={() => setCustomDesign(prev => ({ ...prev, fontFamily: font.id }))}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            customDesign.fontFamily === font.id
                              ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-semibold'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="text-xs">{font.label}</div>
                          <div className="text-[11px] text-slate-400">{font.preview}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color picker */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Color del Texto
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      {[
                        '#000000', '#FFFFFF', '#DC2626', '#EA580C', '#EAB308', 
                        '#16A34A', '#0284C7', '#4F46E5', '#9333EA', '#DB2777'
                      ].map(color => (
                        <button
                          key={color}
                          onClick={() => setCustomDesign(prev => ({ ...prev, textColor: color }))}
                          style={{ backgroundColor: color }}
                          className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                            customDesign.textColor === color ? 'scale-125 border-indigo-600 shadow-md ring-2 ring-indigo-300' : 'border-slate-300'
                          }`}
                          aria-label={`Color ${color}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Font Size slider */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Tamaño de Letra</span>
                      <span>{customDesign.fontSize || 16}px</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={32}
                      value={customDesign.fontSize || 16}
                      onChange={(e) => setCustomDesign(prev => ({ ...prev, fontSize: Number(e.target.value) }))}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                </div>
              )}

              {/* Tab 3: AI Ideas Assistant */}
              {activeTab === 'ai' && (
                <div className="space-y-4">
                  <div className="p-3.5 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border border-pink-200/80">
                    <div className="flex items-center gap-2 text-xs font-bold text-pink-700 mb-1">
                      <Sparkles className="w-4 h-4 text-pink-600" />
                      <span>Asistente de Frases & Dedicatorias Creativas</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Haz clic en cualquier dedicatoria sugerida para aplicarla de inmediato a tu producto personalizado.
                    </p>
                  </div>

                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {AI_OCCASION_IDEAS.map((group, gIdx) => (
                      <div key={gIdx} className="space-y-1.5">
                        <span className="text-xs font-bold text-slate-800 block">
                          {group.category}
                        </span>
                        <div className="space-y-1">
                          {group.ideas.map((phrase, pIdx) => (
                            <button
                              key={pIdx}
                              onClick={() => handleApplyAiIdea(phrase)}
                              className="w-full p-2 text-left text-xs bg-slate-50 hover:bg-indigo-50 hover:text-indigo-900 border border-slate-200 hover:border-indigo-300 rounded-xl transition-all flex items-center justify-between group cursor-pointer"
                            >
                              <span>{phrase}</span>
                              <Sparkles className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Adjust position, scale & rotation */}
              {activeTab === 'adjust' && (
                <div className="space-y-4">
                  {/* Print Zone Position */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Ubicación del Estampado
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'frente', label: 'Frente / Frontal', extra: 0 },
                        { id: 'espalda', label: 'Espalda / Trasero', extra: 0 },
                        { id: 'ambos', label: 'Ambos Lados', extra: 2.50 },
                        { id: 'panoramico', label: 'Panorámico 360°', extra: 1.00 }
                      ].map(pos => (
                        <button
                          key={pos.id}
                          onClick={() => setCustomDesign(prev => ({ ...prev, position: pos.id as any }))}
                          className={`p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                            customDesign.position === pos.id
                              ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-semibold'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div>{pos.label}</div>
                          {pos.extra > 0 && (
                            <span className="text-[10px] text-amber-600 font-bold">+{settings.currency}{pos.extra.toFixed(2)}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Scale Slider */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span className="flex items-center gap-1"><ZoomIn className="w-3.5 h-3.5" /> Escala / Zoom</span>
                      <span>{Math.round((customDesign.scale || 1) * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0.5}
                      max={2.0}
                      step={0.05}
                      value={customDesign.scale || 1}
                      onChange={(e) => setCustomDesign(prev => ({ ...prev, scale: parseFloat(e.target.value) }))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  {/* Rotation Slider */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span className="flex items-center gap-1"><RotateCw className="w-3.5 h-3.5" /> Rotación</span>
                      <span>{customDesign.rotation || 0}°</span>
                    </div>
                    <input
                      type="range"
                      min={-180}
                      max={180}
                      step={5}
                      value={customDesign.rotation || 0}
                      onChange={(e) => setCustomDesign(prev => ({ ...prev, rotation: parseInt(e.target.value) }))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  {/* Offsets X / Y */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span>Desplazar X</span>
                        <span>{customDesign.offsetX || 0}px</span>
                      </div>
                      <input
                        type="range"
                        min={-60}
                        max={60}
                        value={customDesign.offsetX || 0}
                        onChange={(e) => setCustomDesign(prev => ({ ...prev, offsetX: parseInt(e.target.value) }))}
                        className="w-full accent-indigo-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span>Desplazar Y</span>
                        <span>{customDesign.offsetY || 0}px</span>
                      </div>
                      <input
                        type="range"
                        min={-60}
                        max={60}
                        value={customDesign.offsetY || 0}
                        onChange={(e) => setCustomDesign(prev => ({ ...prev, offsetY: parseInt(e.target.value) }))}
                        className="w-full accent-indigo-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: Variants & Product Options & Finishes */}
              {activeTab === 'variants' && (
                <div className="space-y-4">
                  {/* Print Finish Options */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Acabado de Sublimación
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'brillante', label: 'Brillante Clásico', extra: 0 },
                        { id: 'mate', label: 'Mate Sedoso', extra: 0 },
                        { id: 'metalizado', label: 'Metalizado Glaseado', extra: 1.50 }
                      ].map(f => (
                        <button
                          key={f.id}
                          onClick={() => setCustomDesign(prev => ({ ...prev, printFinish: f.id as any }))}
                          className={`p-2.5 rounded-xl border text-xs text-center transition-all cursor-pointer ${
                            customDesign.printFinish === f.id
                              ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 font-bold'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div>{f.label}</div>
                          {f.extra > 0 && <span className="text-[10px] text-amber-600 font-bold">+{settings.currency}{f.extra.toFixed(2)}</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {currentProduct.variants && currentProduct.variants.length > 0 ? (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Opciones del Producto
                      </label>
                      <div className="space-y-3">
                        {/* Group variants by type */}
                        {(Array.from(new Set(currentProduct.variants.map(v => v.type))) as string[]).map((typeKey: string) => (
                          <div key={typeKey}>
                            <span className="text-xs font-semibold text-slate-600 capitalize block mb-1">
                              {typeKey === 'color' ? 'Color' : typeKey === 'size' ? 'Talla' : typeKey === 'finish' ? 'Acabado' : 'Variante'}:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {currentProduct.variants
                                .filter(v => v.type === typeKey)
                                .map(variant => (
                                   <button
                                    key={variant.id}
                                    onClick={() => setSelectedVariants(prev => ({ ...prev, [typeKey]: variant.name }))}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                                      selectedVariants[typeKey] === variant.name
                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                                    }`}
                                  >
                                    {variant.name}
                                    {variant.priceModifier > 0 && ` (+${settings.currency}${variant.priceModifier.toFixed(2)})`}
                                  </button>
                                ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">Este producto no cuenta con variantes adicionales.</p>
                  )}

                  {/* Special instructions */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Instrucciones Especiales para el Taller
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ej: Alinear el logo al centro exacto, empaque para regalo..."
                      value={customDesign.specialInstructions || ''}
                      onChange={(e) => setCustomDesign(prev => ({ ...prev, specialInstructions: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Price Breakdown & Purchase Actions */}
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500">Precio Unitario</div>
                    <div className="text-2xl font-black text-slate-900">
                      {settings.currency}{unitPrice.toFixed(2)}
                    </div>
                  </div>

                  {/* Quantity Counter */}
                  <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-slate-600 hover:bg-slate-200 text-sm font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-sm font-black text-slate-900 bg-white min-w-10 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-slate-600 hover:bg-slate-200 text-sm font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
                  <span>Subtotal ({quantity} {quantity === 1 ? 'unidad' : 'unidades'}):</span>
                  <span className="font-bold text-slate-900 text-sm">{settings.currency}{totalPrice.toFixed(2)}</span>
                </div>

                {/* Main Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    id="add-custom-to-cart-btn"
                    className="py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Añadir al Carrito
                  </button>

                  <button
                    onClick={handleWhatsAppOrder}
                    id="order-via-whatsapp-btn"
                    className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Pedir por WhatsApp
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
