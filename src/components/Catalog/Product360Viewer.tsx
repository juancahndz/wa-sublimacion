import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ProductMockupType } from '../../types';
import { 
  RotateCw, 
  Play, 
  Pause, 
  Compass, 
  Sparkles, 
  Hand, 
  Palette,
  Eye,
  Check
} from 'lucide-react';

interface Product360ViewerProps {
  productName: string;
  mockupType?: ProductMockupType;
  category?: string;
  activeImage?: string;
  initialBaseColor?: string;
  className?: string;
}

const COLOR_OPTIONS = [
  { name: 'Blanco', value: '#FFFFFF', border: '#E2E8F0' },
  { name: 'Negro', value: '#1E293B', border: '#0F172A' },
  { name: 'Azul Marino', value: '#1E3A8A', border: '#172554' },
  { name: 'Rojo Pasión', value: '#DC2626', border: '#991B1B' },
  { name: 'Rosa Pastel', value: '#F472B6', border: '#DB2777' },
  { name: 'Amarillo', value: '#FBBF24', border: '#D97706' }
];

export const Product360Viewer: React.FC<Product360ViewerProps> = ({
  productName,
  mockupType = 'mug',
  category = '',
  activeImage,
  initialBaseColor = '#FFFFFF',
  className = ''
}) => {
  const [angle, setAngle] = useState(0);
  const [isAutoSpinning, setIsAutoSpinning] = useState(true);
  const [baseColor, setBaseColor] = useState(initialBaseColor);
  const [isDragging, setIsDragging] = useState(false);
  const [showDragHint, setShowDragHint] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartXRef = useRef(0);
  const dragStartAngleRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  // Normalize mockup type if not provided explicitly
  const resolvedType = useCallback((): ProductMockupType => {
    if (mockupType) return mockupType;
    const cat = category.toLowerCase();
    if (cat.includes('taza') || cat.includes('mug')) return 'mug';
    if (cat.includes('botella') || cat.includes('termo') || cat.includes('vaso')) return 'bottle';
    if (cat.includes('playera') || cat.includes('camiseta') || cat.includes('textil')) return 'tshirt';
    if (cat.includes('sudadera') || cat.includes('hoodie')) return 'hoodie';
    if (cat.includes('gorra') || cat.includes('cap')) return 'cap';
    if (cat.includes('cojin') || cat.includes('almohada')) return 'pillow';
    if (cat.includes('mousepad')) return 'mousepad';
    return 'mug';
  }, [mockupType, category])();

  // Auto-spin animation loop
  useEffect(() => {
    if (!isAutoSpinning || isDragging) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      return;
    }

    let lastTime = performance.now();
    const spinLoop = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      
      // Rotate ~35 degrees per second
      setAngle(prev => (prev + delta * 35) % 360);
      animFrameRef.current = requestAnimationFrame(spinLoop);
    };

    animFrameRef.current = requestAnimationFrame(spinLoop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isAutoSpinning, isDragging]);

  // Touch and Mouse Drag handlers
  const handlePointerDown = (clientX: number) => {
    setIsDragging(true);
    setIsAutoSpinning(false);
    setShowDragHint(false);
    dragStartXRef.current = clientX;
    dragStartAngleRef.current = angle;
  };

  const handlePointerMove = (clientX: number) => {
    if (!isDragging) return;
    const deltaX = clientX - dragStartXRef.current;
    // 1 pixel drag = 0.8 degrees of rotation
    let newAngle = (dragStartAngleRef.current + deltaX * 0.8) % 360;
    if (newAngle < 0) newAngle += 360;
    setAngle(newAngle);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Quick Angle Presets
  const setPresetAngle = (targetAngle: number) => {
    setIsAutoSpinning(false);
    setShowDragHint(false);
    setAngle(targetAngle % 360);
  };

  // Angle view label
  const getAngleLabel = (deg: number) => {
    const norm = Math.round(deg) % 360;
    if (norm >= 330 || norm < 30) return 'Vista Frontal (0°)';
    if (norm >= 30 && norm < 120) return 'Perfil Derecho (90°)';
    if (norm >= 120 && norm < 210) return 'Vista Posterior (180°)';
    if (norm >= 210 && norm < 300) return 'Perfil Izquierdo (270°)';
    return 'Vista Frontal';
  };

  // Cylindrical calculations for Mugs & Bottles
  const rad = (angle * Math.PI) / 180;
  const handleX = Math.cos(rad);
  const handleZ = Math.sin(rad);
  const isHandleInFront = handleZ > 0;
  
  const artworkOffsetPercent = ((angle % 360) / 360) * 100;

  return (
    <div 
      className={`relative w-full h-full min-h-[340px] sm:min-h-[380px] bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden select-none flex flex-col justify-between border border-slate-800 shadow-2xl ${className}`}
      ref={containerRef}
      onMouseDown={(e) => handlePointerDown(e.clientX)}
      onMouseMove={(e) => handlePointerMove(e.clientX)}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchStart={(e) => {
        if (e.touches[0]) handlePointerDown(e.touches[0].clientX);
      }}
      onTouchMove={(e) => {
        if (e.touches[0]) handlePointerMove(e.touches[0].clientX);
      }}
      onTouchEnd={handlePointerUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Dynamic 3D Studio Lighting Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/15 via-transparent to-black pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Status Bar */}
      <div className="relative z-20 p-2.5 sm:p-3.5 flex items-center justify-between gap-2 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-400/40 text-indigo-400 text-xs shadow-xs font-black">
            <Compass className="w-3.5 h-3.5 animate-spin-slow" />
          </span>
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-xs font-bold text-white flex items-center gap-1">
              <span>Simulador 3D 360°</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                {Math.round(angle)}°
              </span>
            </span>
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium">
              {getAngleLabel(angle)}
            </span>
          </div>
        </div>

        {/* Auto-Spin Toggle Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsAutoSpinning(!isAutoSpinning);
            setShowDragHint(false);
          }}
          className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[10px] sm:text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
            isAutoSpinning 
              ? 'bg-indigo-600 text-white hover:bg-indigo-500' 
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
          title={isAutoSpinning ? "Pausar giro automático" : "Activar giro automático"}
        >
          {isAutoSpinning ? (
            <>
              <Pause className="w-3 h-3 fill-white" />
              <span>Pausar</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 fill-white ml-0.5" />
              <span>Auto-Girar</span>
            </>
          )}
        </button>
      </div>

      {/* Center 3D Interactive Stage */}
      <div className="relative flex-1 flex items-center justify-center p-4 min-h-[220px]">
        
        {/* Floor Pedestal Glow & Shadow */}
        <div className="absolute bottom-6 w-48 sm:w-56 h-8 bg-black/60 rounded-full blur-md" />
        <div className="absolute bottom-8 w-40 sm:w-48 h-3 bg-indigo-500/20 rounded-full blur-sm" />

        {/* ======================= 1. TAZA / MUG 3D CILÍNDRICA ======================= */}
        {resolvedType === 'mug' && (
          <div className="relative w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center transition-transform duration-75">
            
            {/* Mug Handle with true 3D spatial rotation */}
            <div 
              className="absolute top-12 w-14 sm:w-16 h-28 sm:h-32 rounded-r-3xl border-[7px] sm:border-[8px] border-l-0 transition-all duration-75 pointer-events-none"
              style={{
                borderColor: baseColor,
                backgroundColor: 'transparent',
                transform: `translateX(${handleX * 85}px) scaleX(${Math.abs(handleX) > 0.15 ? Math.sign(handleX) * Math.min(1, Math.abs(handleX) * 1.2) : 0.05}) scaleY(${0.9 + Math.abs(handleX) * 0.1})`,
                zIndex: isHandleInFront ? 25 : 2,
                opacity: Math.abs(handleX) < 0.1 ? 0.2 : 1,
                filter: isHandleInFront 
                  ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' 
                  : 'brightness(0.65) drop-shadow(0 1px 2px rgba(0,0,0,0.5))'
              }}
            />

            {/* Mug Ceramic Cylinder Body */}
            <div 
              className="relative w-36 sm:w-44 h-44 sm:h-52 rounded-b-3xl rounded-t-lg shadow-2xl overflow-hidden border border-slate-400/30 flex items-center justify-center transition-colors duration-300 z-10"
              style={{ backgroundColor: baseColor }}
            >
              {/* Inner Rim Top */}
              <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-slate-900/30 to-transparent z-20 pointer-events-none" />

              {/* Sublimation Wrap-Around Print Layer */}
              <div className="relative w-[92%] h-[82%] rounded-xl overflow-hidden flex items-center justify-center">
                {activeImage ? (
                  <div 
                    className="absolute inset-y-0 w-[240%] flex items-center justify-around pointer-events-none"
                    style={{
                      transform: `translateX(${-artworkOffsetPercent * 0.8 + 20}%)`,
                      transition: isDragging ? 'none' : 'transform 0.05s linear'
                    }}
                  >
                    {/* Repeated panoramic wrap for seamless 360° turn */}
                    <img 
                      src={activeImage} 
                      alt={productName}
                      className="h-[80%] max-w-[130px] object-contain drop-shadow-md rounded-md shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <img 
                      src={activeImage} 
                      alt={productName}
                      className="h-[80%] max-w-[130px] object-contain drop-shadow-md rounded-md shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <img 
                      src={activeImage} 
                      alt={productName}
                      className="h-[80%] max-w-[130px] object-contain drop-shadow-md rounded-md shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className="text-center p-2 text-slate-400 text-xs">
                    <Sparkles className="w-6 h-6 mx-auto mb-1 text-indigo-400" />
                    <span>Área de Sublimación</span>
                  </div>
                )}
              </div>

              {/* Cylindrical Curvature Shading & Dynamic Light Stripe */}
              <div 
                className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay"
                style={{
                  background: `linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(255,255,255,${0.25 + Math.sin(rad) * 0.15}) ${40 + Math.cos(rad) * 20}%, rgba(0,0,0,0.6) 100%)`
                }}
              />
              <div className="absolute inset-y-0 left-2 w-3 bg-white/30 blur-xs pointer-events-none z-20" />
              <div className="absolute inset-y-0 right-2 w-3 bg-black/40 blur-xs pointer-events-none z-20" />
            </div>
          </div>
        )}

        {/* ======================= 2. BOTELLA / TERMO 3D ======================= */}
        {resolvedType === 'bottle' && (
          <div className="relative w-52 h-52 sm:w-60 sm:h-60 flex flex-col items-center justify-center">
            {/* Cap */}
            <div className="w-10 h-7 bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 rounded-t-lg border border-slate-600 shadow-md z-20" />
            
            {/* Bottle Body */}
            <div 
              className="relative w-28 sm:w-32 h-44 sm:h-52 rounded-b-3xl rounded-t-md shadow-2xl overflow-hidden border border-slate-400/40 flex items-center justify-center transition-colors duration-300 z-10"
              style={{ backgroundColor: baseColor }}
            >
              {/* Printed Artwork Wrap */}
              <div className="relative w-[90%] h-[80%] overflow-hidden flex items-center justify-center">
                {activeImage && (
                  <div 
                    className="absolute inset-y-0 w-[240%] flex items-center justify-around pointer-events-none"
                    style={{
                      transform: `translateX(${-artworkOffsetPercent * 0.8 + 20}%)`,
                      transition: isDragging ? 'none' : 'transform 0.05s linear'
                    }}
                  >
                    <img src={activeImage} alt="" className="h-[75%] max-w-[90px] object-contain rounded shrink-0" referrerPolicy="no-referrer" />
                    <img src={activeImage} alt="" className="h-[75%] max-w-[90px] object-contain rounded shrink-0" referrerPolicy="no-referrer" />
                  </div>
                )}
              </div>

              {/* Metallic Cylindrical Sheen */}
              <div 
                className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay"
                style={{
                  background: `linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(255,255,255,0.4) ${50 + Math.sin(rad) * 30}%, rgba(0,0,0,0.65) 100%)`
                }}
              />
            </div>
          </div>
        )}

        {/* ======================= 3. TEXTIL / PLAYERA / OTROS 3D ======================= */}
        {(resolvedType === 'tshirt' || resolvedType === 'hoodie' || resolvedType === 'cap' || resolvedType === 'pillow' || resolvedType === 'mousepad' || resolvedType === 'puzzle' || resolvedType === 'keychain' || resolvedType === 'phonecase') && (
          <div 
            className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center"
            style={{
              perspective: '1000px',
            }}
          >
            <div 
              className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center transition-transform duration-75"
              style={{
                transform: `rotateY(${angle}deg)`,
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Card Surface with 3D Depth */}
              <div 
                className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center border border-slate-300/40"
                style={{ backgroundColor: baseColor }}
              >
                {/* Front Side View (0° to 90° and 270° to 360°) */}
                {(angle <= 90 || angle >= 270) ? (
                  <div className="relative w-full h-full p-4 flex flex-col items-center justify-center">
                    {activeImage ? (
                      <img 
                        src={activeImage} 
                        alt={productName}
                        className="max-w-[75%] max-h-[75%] object-contain drop-shadow-md rounded-lg"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="text-center text-slate-400 text-xs">
                        <Sparkles className="w-6 h-6 mx-auto mb-1 text-indigo-400" />
                        <span>Frente del Producto</span>
                      </div>
                    )}
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-2">
                      Frente (Estampado HD)
                    </span>
                  </div>
                ) : (
                  /* Back Side View (90° to 270°) */
                  <div className="relative w-full h-full p-4 flex flex-col items-center justify-center bg-slate-100/50">
                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs font-bold">
                      Reverso
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-2">
                      Vista Posterior
                    </span>
                  </div>
                )}

                {/* Fabric Texture Shading */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-white/10 to-black/20 pointer-events-none" />
              </div>
            </div>
          </div>
        )}

        {/* Floating Hint to Drag on First View */}
        {showDragHint && (
          <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none animate-bounce">
            <div className="px-3 py-1 bg-slate-900/90 backdrop-blur-md rounded-full text-white text-[10px] font-bold flex items-center gap-1.5 border border-slate-700 shadow-lg">
              <Hand className="w-3 h-3 text-cyan-400" />
              <span>Desliza para rotar 360°</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Control Bar: Quick Angles & Color Selector */}
      <div className="relative z-20 p-2 sm:p-3 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 space-y-2">
        
        {/* Quick Angle Preset Buttons */}
        <div className="flex items-center justify-between gap-1 sm:gap-1.5 overflow-x-auto">
          <span className="text-[10px] font-bold text-slate-400 hidden sm:inline pl-1">
            Ángulo:
          </span>
          <div className="flex items-center gap-1 flex-1 justify-around sm:justify-start">
            <button
              type="button"
              onClick={() => setPresetAngle(0)}
              className={`px-2 sm:px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                Math.abs((angle % 360) - 0) < 20 || Math.abs((angle % 360) - 360) < 20
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Frente (0°)
            </button>
            <button
              type="button"
              onClick={() => setPresetAngle(90)}
              className={`px-2 sm:px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                Math.abs((angle % 360) - 90) < 20
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Derecha (90°)
            </button>
            <button
              type="button"
              onClick={() => setPresetAngle(180)}
              className={`px-2 sm:px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                Math.abs((angle % 360) - 180) < 20
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Reverso (180°)
            </button>
            <button
              type="button"
              onClick={() => setPresetAngle(270)}
              className={`px-2 sm:px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                Math.abs((angle % 360) - 270) < 20
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Izquierda (270°)
            </button>
          </div>
        </div>

        {/* Color Palette Selector */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
            <Palette className="w-3 h-3 text-indigo-400" />
            <span>Color base:</span>
          </span>
          <div className="flex items-center gap-1.5">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setBaseColor(c.value)}
                className={`w-5 h-5 rounded-full border-2 transition-transform cursor-pointer flex items-center justify-center ${
                  baseColor === c.value 
                    ? 'scale-110 ring-2 ring-indigo-400 border-white' 
                    : 'opacity-70 hover:opacity-100 hover:scale-105'
                }`}
                style={{ backgroundColor: c.value, borderColor: c.border }}
                title={c.name}
              >
                {baseColor === c.value && (
                  <Check className={`w-2.5 h-2.5 ${c.value === '#FFFFFF' ? 'text-black' : 'text-white'}`} />
                )}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
