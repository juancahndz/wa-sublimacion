import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { DesignTemplate, ProductMockupType } from '../../types';
import { 
  Palette, 
  Plus, 
  Trash2, 
  Search, 
  Star, 
  X, 
  Upload, 
  Check, 
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const AdminDesigns: React.FC = () => {
  const { designTemplates, addDesignTemplate, deleteDesignTemplate, updateDesignTemplate, showToast } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<DesignTemplate | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DesignTemplate['category']>('anime');
  const [imageUrl, setImageUrl] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [isPopular, setIsPopular] = useState(false);
  const [compatibleMockups, setCompatibleMockups] = useState<ProductMockupType[]>(['mug', 'tshirt', 'bottle', 'mousepad']);

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'anime', label: '🌸 Anime' },
    { id: 'gaming', label: '🎮 Gaming' },
    { id: 'parejas', label: '❤️ Parejas' },
    { id: 'frases', label: '☕ Frases' },
    { id: 'mascotas', label: '🐾 Mascotas' },
    { id: 'musica', label: '🎸 Música' },
    { id: 'empresas', label: '💼 Empresas' },
    { id: 'festividades', label: '🎓 Fechas' }
  ];

  const mockupOptions: { id: ProductMockupType; label: string }[] = [
    { id: 'mug', label: 'Taza' },
    { id: 'tshirt', label: 'Playera' },
    { id: 'hoodie', label: 'Hoodie' },
    { id: 'bottle', label: 'Botella' },
    { id: 'cap', label: 'Gorra' },
    { id: 'mousepad', label: 'Mousepad' },
    { id: 'pillow', label: 'Cojín' },
    { id: 'puzzle', label: 'Rompecabezas' },
    { id: 'keychain', label: 'Llavero' },
    { id: 'phonecase', label: 'Funda Celular' }
  ];

  const filtered = designTemplates.filter(d => {
    const matchesCat = categoryFilter === 'all' || d.category === categoryFilter;
    const matchesSearch = 
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingTemplate(null);
    setTitle('');
    setCategory('anime');
    setImageUrl('');
    setTagsText('');
    setIsPopular(false);
    setCompatibleMockups(['mug', 'tshirt', 'bottle', 'mousepad']);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: DesignTemplate) => {
    setEditingTemplate(t);
    setTitle(t.title);
    setCategory(t.category);
    setImageUrl(t.imageUrl);
    setTagsText(t.tags.join(', '));
    setIsPopular(!!t.popular);
    setCompatibleMockups(t.compatibleMockups || ['mug', 'tshirt', 'bottle']);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`¿Eliminar la plantilla "${name}" de la galería?`)) {
      deleteDesignTemplate(id);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImageUrl(ev.target?.result as string);
        showToast("Arte cargado con éxito.", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      showToast("Título e imagen son requeridos.", "warning");
      return;
    }

    const tagsArray = tagsText
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);

    const templateData: DesignTemplate = {
      id: editingTemplate ? editingTemplate.id : `des-${Date.now()}`,
      title: title.trim(),
      category,
      imageUrl,
      tags: tagsArray.length ? tagsArray : ['sublimacion', category],
      compatibleMockups,
      popular: isPopular
    };

    if (editingTemplate) {
      updateDesignTemplate(templateData);
    } else {
      addDesignTemplate(templateData);
    }
    setIsModalOpen(false);
  };

  const toggleMockupCompat = (m: ProductMockupType) => {
    setCompatibleMockups(prev => 
      prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 w-full sm:w-auto no-scrollbar">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setCategoryFilter(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                categoryFilter === c.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar plantilla o etiqueta..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="py-2 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            Nueva Plantilla
          </button>
        </div>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(tpl => (
          <div 
            key={tpl.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all"
          >
            <div className="relative aspect-square bg-slate-900 overflow-hidden">
              <img 
                src={tpl.imageUrl} 
                alt={tpl.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-md">
                {tpl.category}
              </span>
              {tpl.popular && (
                <span className="absolute top-2 right-2 bg-pink-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                  ★ Popular
                </span>
              )}
            </div>

            <div className="p-3.5 space-y-2">
              <h4 className="font-bold text-slate-900 text-xs truncate">
                {tpl.title}
              </h4>
              <div className="flex flex-wrap gap-1">
                {tpl.tags.slice(0, 3).map((t, idx) => (
                  <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                    #{t}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleOpenEdit(tpl)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(tpl.id, tpl.title)}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded"
                  title="Eliminar plantilla"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingTemplate ? 'Editar Plantilla de Diseño' : 'Nueva Plantilla de Galería'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Título del Arte / Diseño *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Cyberpunk Neon Samurai"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Categoría</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="anime">Anime & Manga</option>
                    <option value="gaming">Gamer & Arcade</option>
                    <option value="parejas">Parejas & Amor</option>
                    <option value="frases">Frases & Humor</option>
                    <option value="mascotas">Mascotas</option>
                    <option value="musica">Música & Rock</option>
                    <option value="empresas">Empresas & Logos</option>
                    <option value="festividades">Festividades & Fechas</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPopular}
                      onChange={e => setIsPopular(e.target.checked)}
                      className="rounded text-indigo-600"
                    />
                    <span>Destacar como Popular</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">URL de la Imagen o Vector *</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl mb-2"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 file:font-semibold cursor-pointer"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Etiquetas (Separadas por comas)</label>
                <input
                  type="text"
                  placeholder="anime, samurai, cyberpunk, tokyo"
                  value={tagsText}
                  onChange={e => setTagsText(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Artículos Compatibles</label>
                <div className="flex flex-wrap gap-1.5">
                  {mockupOptions.map(m => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => toggleMockupCompat(m.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                        compatibleMockups.includes(m.id)
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md"
                >
                  {editingTemplate ? 'Guardar Cambios' : 'Publicar Plantilla'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
