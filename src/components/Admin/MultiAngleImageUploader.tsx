import React, { useState, useRef } from 'react';
import { ProductMockupType } from '../../types';
import { compressImageFile } from '../../utils/imageCompressor';
import { 
  Upload, 
  Trash2, 
  RotateCw, 
  Sparkles, 
  CheckCircle2, 
  Link as LinkIcon, 
  Plus, 
  Eye, 
  X,
  Layers,
  Shirt,
  HelpCircle,
  Image as ImageIcon
} from 'lucide-react';

export interface AngleSlotConfig {
  angleDegree: number;
  label: string;
  badge: string;
  badgeColor: string;
  description: string;
  placeholderText: string;
}

interface MultiAngleImageUploaderProps {
  mockupType: ProductMockupType;
  images: string[];
  onChange: (images: string[]) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

// Configuration of angles per mockup type
export const getAngleSlots = (type: ProductMockupType): AngleSlotConfig[] => {
  switch (type) {
    case 'tshirt':
    case 'hoodie':
      return [
        {
          angleDegree: 0,
          label: '1. Frente (0°)',
          badge: 'Frente Principal',
          badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          description: 'Foto frontal de la prenda con el estampado principal.',
          placeholderText: 'Subir Foto Frente'
        },
        {
          angleDegree: 180,
          label: '2. Espalda / Revés (180°)',
          badge: 'Espalda 360°',
          badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
          description: 'Foto trasera de la prenda (espalda o revés).',
          placeholderText: 'Subir Foto Espalda'
        },
        {
          angleDegree: 90,
          label: '3. Lateral / Manga (90°)',
          badge: 'Lateral / Manga',
          badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
          description: 'Vista de costado, manga o detalle de costura.',
          placeholderText: 'Subir Foto Lateral'
        },
        {
          angleDegree: 45,
          label: '4. En Modelo / Puesta',
          badge: 'Puesta / En Uso',
          badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
          description: 'Fotografía puesta en modelo o en contexto.',
          placeholderText: 'Subir Foto en Modelo'
        }
      ];

    case 'mug':
      return [
        {
          angleDegree: 0,
          label: '1. Frente / Diseño (0°)',
          badge: 'Frente Principal',
          badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          description: 'Diseño frontal centrado o vista frontal.',
          placeholderText: 'Subir Frente de la Taza'
        },
        {
          angleDegree: 90,
          label: '2. Lado Derecho / Asa (90°)',
          badge: 'Lado del Asa',
          badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
          description: 'Perspectiva con el asa a la derecha.',
          placeholderText: 'Subir Lado del Asa'
        },
        {
          angleDegree: 180,
          label: '3. Reverso (180°)',
          badge: 'Vista Posterior',
          badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
          description: 'Parte trasera de la taza o diseño continuo.',
          placeholderText: 'Subir Reverso de la Taza'
        },
        {
          angleDegree: 270,
          label: '4. Plantilla Plana / Lado Izq.',
          badge: 'Plantilla HD',
          badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          description: 'Plantilla extendida plana o perspectiva izquierda.',
          placeholderText: 'Subir Plantilla Plana'
        }
      ];

    case 'bottle':
      return [
        {
          angleDegree: 0,
          label: '1. Frente (0°)',
          badge: 'Frente Principal',
          badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          description: 'Vista frontal con estampado de la botella/termo.',
          placeholderText: 'Subir Frente de la Botella'
        },
        {
          angleDegree: 180,
          label: '2. Reverso / Espalda (180°)',
          badge: 'Reverso 360°',
          badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
          description: 'Vista trasera del cilindro o termo.',
          placeholderText: 'Subir Reverso de la Botella'
        },
        {
          angleDegree: 90,
          label: '3. Detalle de Tapa / Boquilla',
          badge: 'Detalle Tapa',
          badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
          description: 'Enfoque en la tapa hermética o boquilla.',
          placeholderText: 'Subir Detalle de Tapa'
        },
        {
          angleDegree: 45,
          label: '4. En Contexto / Uso',
          badge: 'Publicitaria',
          badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
          description: 'Fotografía en gimnasio, oficina o exteriores.',
          placeholderText: 'Subir Foto en Contexto'
        }
      ];

    case 'cap':
      return [
        {
          angleDegree: 0,
          label: '1. Frente / Corona (0°)',
          badge: 'Frente Principal',
          badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          description: 'Estampado o bordado en la corona frontal.',
          placeholderText: 'Subir Frente de la Gorra'
        },
        {
          angleDegree: 90,
          label: '2. Perfil Lateral (90°)',
          badge: 'Lateral',
          badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
          description: 'Vista del costado de la gorra.',
          placeholderText: 'Subir Lateral de la Gorra'
        },
        {
          angleDegree: 180,
          label: '3. Reverso / Cierre (180°)',
          badge: 'Broche Posterior',
          badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
          description: 'Hebilla, broche o malla trasera.',
          placeholderText: 'Subir Reverso de la Gorra'
        },
        {
          angleDegree: 45,
          label: '4. Visera / Superior',
          badge: 'Detalle Visera',
          badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          description: 'Vista cenital o detalle de la visera.',
          placeholderText: 'Subir Ángulo Superior'
        }
      ];

    case 'pillow':
      return [
        {
          angleDegree: 0,
          label: '1. Frente (0°)',
          badge: 'Frente Principal',
          badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          description: 'Estampado frontal del cojín o almohada.',
          placeholderText: 'Subir Frente del Cojín'
        },
        {
          angleDegree: 180,
          label: '2. Espalda / Reverso (180°)',
          badge: 'Reverso 360°',
          badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
          description: 'Color o estampado de la parte trasera.',
          placeholderText: 'Subir Reverso del Cojín'
        },
        {
          angleDegree: 90,
          label: '3. Textura / Cierre',
          badge: 'Detalle Cierre',
          badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
          description: 'Acercamiento a la tela o cremallera.',
          placeholderText: 'Subir Detalle de Tela'
        },
        {
          angleDegree: 45,
          label: '4. Ambientado en Sala/Cama',
          badge: 'Decorativo',
          badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
          description: 'Foto decorativa en un sofá o cama.',
          placeholderText: 'Subir Foto en Sala'
        }
      ];

    default:
      return [
        {
          angleDegree: 0,
          label: '1. Vista Frontal (0°)',
          badge: 'Frente Principal',
          badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          description: 'Diseño o superficie principal del producto.',
          placeholderText: 'Subir Vista Frontal'
        },
        {
          angleDegree: 180,
          label: '2. Vista Posterior / Reverso (180°)',
          badge: 'Reverso 360°',
          badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
          description: 'Parte trasera o reverso del producto.',
          placeholderText: 'Subir Vista Posterior'
        },
        {
          angleDegree: 90,
          label: '3. Vista Lateral o Acabado',
          badge: 'Perfil / Textura',
          badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
          description: 'Bordes, grosor o acabado del material.',
          placeholderText: 'Subir Detalle de Acabado'
        },
        {
          angleDegree: 45,
          label: '4. En Uso / Empaque',
          badge: 'Presentación',
          badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
          description: 'Presentación, empaque o demostración.',
          placeholderText: 'Subir Foto Adicional'
        }
      ];
  }
};

export const MultiAngleImageUploader: React.FC<MultiAngleImageUploaderProps> = ({
  mockupType,
  images = [],
  onChange,
  showToast
}) => {
  const [activeUrlSlot, setActiveUrlSlot] = useState<number | null>(null);
  const [urlInputValue, setUrlInputValue] = useState('');
  const [extraUrlInput, setExtraUrlInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const bulkFileInputRef = useRef<HTMLInputElement>(null);
  const extraFileInputRef = useRef<HTMLInputElement>(null);

  const slots = getAngleSlots(mockupType);

  // Clean default unsplash dummy placeholder if present
  const isDefaultUnsplash = (url: string) => url.includes('photo-1514432324607-a09d9b4aefdd');
  const cleanImages = images.filter(img => !isDefaultUnsplash(img));

  // Handle single slot file upload
  const handleSlotFileUpload = async (slotIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const compressedUrl = await compressImageFile(file, 1200, 0.8);
      
      const newImages = [...cleanImages];
      while (newImages.length < slotIndex) {
        newImages.push('');
      }
      newImages[slotIndex] = compressedUrl;
      const filtered = newImages.filter((img, i) => img !== '' || i < slotIndex);
      
      onChange(filtered.length > 0 ? filtered : [compressedUrl]);
      showToast?.(`Foto para "${slots[slotIndex]?.label || ('Lado ' + (slotIndex + 1))}" subida correctamente.`, 'success');
    } catch (err) {
      console.error(err);
      showToast?.("Error al procesar la imagen.", "error");
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  // Handle URL submit for a slot
  const handleSlotUrlSubmit = (slotIndex: number) => {
    if (!urlInputValue.trim()) {
      setActiveUrlSlot(null);
      return;
    }

    const newImages = [...cleanImages];
    while (newImages.length < slotIndex) {
      newImages.push('');
    }
    newImages[slotIndex] = urlInputValue.trim();
    const filtered = newImages.filter((img, i) => img !== '' || i < slotIndex);

    onChange(filtered.length > 0 ? filtered : [urlInputValue.trim()]);
    showToast?.(`Enlace para "${slots[slotIndex]?.label || ('Lado ' + (slotIndex + 1))}" asignado.`, 'success');
    setUrlInputValue('');
    setActiveUrlSlot(null);
  };

  // Handle removing image from a specific slot
  const handleRemoveSlot = (slotIndex: number) => {
    const newImages = [...cleanImages];
    newImages.splice(slotIndex, 1);
    onChange(newImages);
    showToast?.("Foto eliminada.", "info");
  };

  // Handle multi-file bulk upload (fills slots 1, 2, 3, 4 and extra in sequence)
  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsProcessing(true);
      const fileArray = Array.from(files);
      const compressedList = await Promise.all(
        fileArray.map(f => compressImageFile(f, 1200, 0.8))
      );

      const merged = [...cleanImages];
      compressedList.forEach((cImg, idx) => {
        if (idx < merged.length && !merged[idx]) {
          merged[idx] = cImg;
        } else if (idx >= merged.length) {
          merged.push(cImg);
        } else {
          merged.push(cImg);
        }
      });

      onChange(merged);
      showToast?.(`¡${compressedList.length} fotos cargadas exitosamente!`, 'success');
    } catch (err) {
      console.error(err);
      showToast?.("Error al subir las fotos.", "error");
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  // Handle adding extra photos
  const handleAddExtraPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsProcessing(true);
      const fileArray = Array.from(files);
      const compressedList = await Promise.all(
        fileArray.map(f => compressImageFile(f, 1200, 0.8))
      );

      onChange([...cleanImages, ...compressedList]);
      showToast?.(`${compressedList.length} foto(s) añadida(s) a la galería.`, 'success');
    } catch (err) {
      console.error(err);
      showToast?.("Error al subir foto extra.", "error");
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  const handleAddExtraUrl = () => {
    if (!extraUrlInput.trim()) return;
    onChange([...cleanImages, extraUrlInput.trim()]);
    setExtraUrlInput('');
    showToast?.("Foto añadida a la galería.", "success");
  };

  // Check if back image is missing for 360 preview
  const hasFront = !!cleanImages[0];
  const hasBack = !!cleanImages[1];
  const showBackReminder = hasFront && !hasBack && (mockupType === 'tshirt' || mockupType === 'hoodie' || mockupType === 'mug' || mockupType === 'bottle');

  return (
    <div className="space-y-4 bg-slate-50/90 p-4 sm:p-5 rounded-3xl border border-slate-200">
      
      {/* Header / Instructions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-indigo-600 text-white shadow-xs">
              <RotateCw className="w-4 h-4 animate-spin-slow" />
            </span>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
              Fotos del Producto por Lados (Frente, Espalda y Ángulos 360°)
            </h4>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Sube las fotos correspondientes a cada lado del producto para activar el simulador interactivo 360°.
          </p>
        </div>

        {/* Bulk Upload Button */}
        <div>
          <input
            ref={bulkFileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleBulkUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => bulkFileInputRef.current?.click()}
            disabled={isProcessing}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>⚡ Subir todas las fotos juntas</span>
          </button>
        </div>
      </div>

      {/* 360 Smart Advice Callout */}
      {showBackReminder && (
        <div className="p-3 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-transparent border border-purple-200/80 rounded-2xl flex items-start gap-2.5 text-slate-700 text-xs animate-fadeIn">
          <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold text-purple-900">
              💡 ¡Foto Frontal Lista! Sube ahora la foto de la Espalda / Reverso (Slot #2)
            </p>
            <p className="text-[11px] text-slate-600">
              Al colocar la foto de la espalda en el segundo espacio, el visor 360° mostrará automáticamente ambos lados al rotar.
            </p>
          </div>
        </div>
      )}

      {/* 4 Guided Angle Slots Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {slots.map((slot, index) => {
          const slotImage = cleanImages[index];
          const isSlotActiveUrl = activeUrlSlot === index;

          return (
            <div
              key={index}
              className={`relative rounded-2xl border-2 transition-all p-3 flex flex-col justify-between bg-white shadow-xs ${
                slotImage 
                  ? 'border-indigo-400/80 ring-2 ring-indigo-100' 
                  : index === 0
                  ? 'border-dashed border-indigo-300 bg-indigo-50/20'
                  : 'border-dashed border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Slot Top Header */}
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${slot.badgeColor}`}>
                  {slot.badge}
                </span>
                {slotImage ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Cargada</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-400">
                    Slot #{index + 1}
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div className="mb-2.5">
                <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <span>{slot.label}</span>
                </h5>
                <p className="text-[10px] text-slate-500 line-clamp-1">
                  {slot.description}
                </p>
              </div>

              {/* Image Preview or Upload Dropzone */}
              <div className="relative aspect-square rounded-xl bg-slate-100 border border-slate-200/80 overflow-hidden flex items-center justify-center group mb-2.5">
                {slotImage ? (
                  <>
                    <img
                      src={slotImage}
                      alt={slot.label}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    {/* Hover Actions Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2 backdrop-blur-2xs">
                      <label className="p-2 rounded-xl bg-white text-slate-800 hover:bg-slate-100 shadow-md cursor-pointer transition-transform hover:scale-110" title="Cambiar foto">
                        <Upload className="w-4 h-4 text-indigo-600" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleSlotFileUpload(index, e)}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => handleRemoveSlot(index)}
                        className="p-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 shadow-md cursor-pointer transition-transform hover:scale-110"
                        title="Eliminar foto de este ángulo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  /* Empty state dropzone */
                  <label className="w-full h-full flex flex-col items-center justify-center p-3 text-center space-y-1.5 cursor-pointer hover:bg-slate-200/50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-500">
                      <Upload className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-600">
                      {slot.placeholderText}
                    </span>
                    <span className="text-[9px] text-slate-400">
                      Toca para elegir archivo
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSlotFileUpload(index, e)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Slot Upload Controls */}
              <div className="space-y-1.5">
                {!isSlotActiveUrl ? (
                  <div className="flex items-center gap-1.5">
                    <label className="flex-1 py-1.5 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[11px] font-bold text-center transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>{slotImage ? 'Reemplazar' : 'Subir'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleSlotFileUpload(index, e)}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveUrlSlot(index);
                        setUrlInputValue(slotImage || '');
                      }}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                      title="Pegar URL de imagen"
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  /* Inline URL input */
                  <div className="space-y-1 bg-slate-100 p-1.5 rounded-xl border border-slate-300">
                    <input
                      type="url"
                      placeholder="https://..."
                      value={urlInputValue}
                      onChange={(e) => setUrlInputValue(e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-mono"
                      autoFocus
                    />
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setActiveUrlSlot(null)}
                        className="px-2 py-0.5 text-[10px] text-slate-500 hover:text-slate-800"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSlotUrlSubmit(index)}
                        className="px-2 py-0.5 bg-indigo-600 text-white rounded-md text-[10px] font-bold hover:bg-indigo-700 cursor-pointer"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Additional Photos / Extra Gallery Section */}
      <div className="pt-3 border-t border-slate-200 space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
              <span>Fotos Adicionales en Galería ({Math.max(0, cleanImages.length - 4)})</span>
            </h5>
            <p className="text-[10px] text-slate-500">
              ¿Quieres añadir más fotos extra del producto? Puedes agregar tantas como necesites.
            </p>
          </div>

          {/* Add extra photo button */}
          <div className="flex items-center gap-2">
            <input
              ref={extraFileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleAddExtraPhoto}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => extraFileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-600" />
              <span>Añadir foto extra</span>
            </button>
          </div>
        </div>

        {/* Extra photos list */}
        {cleanImages.length > 4 && (
          <div className="flex flex-wrap gap-2.5 pt-1">
            {cleanImages.slice(4).map((img, i) => {
              const actualIdx = i + 4;
              return (
                <div key={actualIdx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-300 group shadow-xs">
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <button
                    type="button"
                    onClick={() => handleRemoveSlot(actualIdx)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                    title="Eliminar foto"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
