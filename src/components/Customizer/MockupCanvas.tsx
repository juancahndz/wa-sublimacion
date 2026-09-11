import React, { useRef, useEffect } from 'react';
import { ProductMockupType, CustomDesignData } from '../../types';
import { RotateCw, ZoomIn, Move, Eye, Sparkles } from 'lucide-react';

interface MockupCanvasProps {
  mockupType: ProductMockupType;
  baseColor?: string;
  customDesign: CustomDesignData;
  productName?: string;
  showGuides?: boolean;
  className?: string;
}

export const MockupCanvas: React.FC<MockupCanvasProps> = ({
  mockupType,
  baseColor = '#FFFFFF',
  customDesign,
  productName = 'Producto Personalizado',
  showGuides = true,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Render text styling
  const getFontFamilyStyle = (font?: string) => {
    switch (font) {
      case 'serif':
        return 'font-serif';
      case 'mono':
        return 'font-mono';
      case 'script':
        return 'italic font-serif';
      case 'black':
        return 'font-black tracking-tighter uppercase';
      case 'handwriting':
        return 'italic font-sans';
      default:
        return 'font-sans font-bold';
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative select-none overflow-hidden flex items-center justify-center bg-radial from-slate-100 to-slate-200 rounded-3xl p-6 sm:p-10 border border-slate-300/80 shadow-inner ${className}`}
      style={{ minHeight: '380px' }}
    >
      {/* Background Soft Studio Lighting */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />
      <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 bg-white/80 backdrop-blur-md rounded-full border border-slate-200 shadow-xs text-xs font-semibold text-slate-700">
        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
        <span>Previsualización 2D / 3D en Vivo</span>
      </div>

      {/* Guides indicator */}
      {showGuides && (
        <div className="absolute bottom-4 left-4 text-[10px] bg-slate-900/70 backdrop-blur-xs text-white px-2.5 py-1 rounded-md">
          Área de estampado delimitada
        </div>
      )}

      {/* Dynamic Product Mockup Containers */}
      <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center">
        
        {/* ===================== 1. MUG (TAZA) ===================== */}
        {mockupType === 'mug' && (
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Ceramic Mug Shadow */}
            <div className="absolute -bottom-4 w-52 h-7 bg-slate-800/25 rounded-full blur-md" />
            
            {/* Handle on the right */}
            <div 
              className="absolute right-0 top-14 w-16 h-36 rounded-r-3xl border-8 border-l-0 shadow-md"
              style={{ borderColor: baseColor, backgroundColor: 'transparent' }}
            />

            {/* Mug Body Cylinder */}
            <div 
              className="relative w-48 h-56 rounded-b-3xl rounded-t-lg shadow-2xl overflow-hidden border border-slate-300/40 flex items-center justify-center transition-colors duration-300"
              style={{ backgroundColor: baseColor }}
            >
              {/* Inner Rim Top */}
              <div 
                className="absolute top-0 left-0 right-0 h-4 rounded-t-lg bg-gradient-to-b from-slate-400/40 to-transparent z-20 pointer-events-none"
              />

              {/* Sublimation Printable Area Wrapper */}
              <div className={`relative w-[88%] h-[80%] rounded-xl flex items-center justify-center overflow-hidden transition-all ${
                showGuides ? 'border-2 border-dashed border-indigo-400/70 bg-indigo-50/10' : ''
              }`}>
                {/* Artwork Layer */}
                <div 
                  className="absolute flex flex-col items-center justify-center text-center transition-transform duration-75"
                  style={{
                    transform: `translate(${customDesign.offsetX || 0}px, ${customDesign.offsetY || 0}px) scale(${customDesign.scale || 1}) rotate(${customDesign.rotation || 0}deg)`,
                  }}
                >
                  {customDesign.uploadedImageUrl && (
                    <img 
                      src={customDesign.uploadedImageUrl} 
                      alt="Diseño personalizado" 
                      className="max-w-[140px] max-h-[140px] object-contain drop-shadow-sm rounded-sm"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  {customDesign.customText && (
                    <p 
                      className={`mt-1.5 leading-tight select-none ${getFontFamilyStyle(customDesign.fontFamily)}`}
                      style={{
                        color: customDesign.textColor || '#000000',
                        fontSize: `${customDesign.fontSize || 18}px`,
                        textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                      }}
                    >
                      {customDesign.customText}
                    </p>
                  )}
                </div>
              </div>

              {/* Ceramic Surface Cylindrical Lighting Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-white/30 to-black/35 pointer-events-none z-10 mix-blend-overlay" />
              <div className="absolute left-3 inset-y-0 w-4 bg-white/40 blur-xs pointer-events-none z-10" />
            </div>
          </div>
        )}

        {/* ===================== 2. T-SHIRT (CAMISETA) ===================== */}
        {mockupType === 'tshirt' && (
          <div className="relative w-72 h-72 flex items-center justify-center">
            <div className="absolute -bottom-3 w-56 h-6 bg-slate-800/20 rounded-full blur-md" />

            {/* T-Shirt SVG Shape */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
                {/* Shirt Base Path */}
                <path 
                  d="M 60 20 Q 80 35 100 35 Q 120 35 140 20 L 180 50 L 155 75 L 140 65 L 140 180 L 60 180 L 60 65 L 45 75 L 20 50 Z" 
                  fill={baseColor} 
                  stroke="#CBD5E1" 
                  strokeWidth="1.5"
                />
                {/* Collar */}
                <path 
                  d="M 60 20 Q 80 35 100 35 Q 120 35 140 20 Q 120 42 100 42 Q 80 42 60 20 Z" 
                  fill="#000000" 
                  fillOpacity="0.08"
                />
              </svg>

              {/* Chest Print Safe Zone */}
              <div className={`absolute top-16 w-32 h-36 flex items-center justify-center rounded-lg overflow-hidden ${
                showGuides ? 'border-2 border-dashed border-indigo-400/80 bg-indigo-50/20' : ''
              }`}>
                <div 
                  className="flex flex-col items-center justify-center text-center transition-transform"
                  style={{
                    transform: `translate(${customDesign.offsetX || 0}px, ${customDesign.offsetY || 0}px) scale(${customDesign.scale || 1}) rotate(${customDesign.rotation || 0}deg)`,
                  }}
                >
                  {customDesign.uploadedImageUrl && (
                    <img 
                      src={customDesign.uploadedImageUrl} 
                      alt="Diseño personalizado" 
                      className="max-w-[110px] max-h-[110px] object-contain rounded-xs"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  {customDesign.customText && (
                    <p 
                      className={`mt-1 leading-tight select-none ${getFontFamilyStyle(customDesign.fontFamily)}`}
                      style={{
                        color: customDesign.textColor || '#000000',
                        fontSize: `${customDesign.fontSize || 16}px`,
                      }}
                    >
                      {customDesign.customText}
                    </p>
                  )}
                </div>
              </div>

              {/* Fabric Crease Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10 pointer-events-none rounded-2xl mix-blend-multiply" />
            </div>
          </div>
        )}

        {/* ===================== 3. HOODIE (SUDADERA) ===================== */}
        {mockupType === 'hoodie' && (
          <div className="relative w-72 h-72 flex items-center justify-center">
            <div className="absolute -bottom-3 w-56 h-6 bg-slate-800/20 rounded-full blur-md" />
            
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
              {/* Hoodie Body & Hood */}
              <path 
                d="M 50 15 Q 100 5 150 15 L 185 60 L 160 85 L 145 75 L 145 185 L 55 185 L 55 75 L 40 85 L 15 60 Z" 
                fill={baseColor} 
                stroke="#CBD5E1" 
                strokeWidth="1.5"
              />
              {/* Hood opening */}
              <ellipse cx="100" cy="30" rx="30" ry="16" fill="#000000" fillOpacity="0.12" />
              {/* Kangaroo pocket */}
              <path d="M 70 140 L 130 140 L 125 175 L 75 175 Z" fill="#000000" fillOpacity="0.06" stroke="#94A3B8" strokeWidth="0.8" />
            </svg>

            {/* Chest Print Zone */}
            <div className={`absolute top-18 w-28 h-28 flex items-center justify-center rounded-lg overflow-hidden ${
              showGuides ? 'border-2 border-dashed border-indigo-400/80 bg-indigo-50/20' : ''
            }`}>
              <div 
                className="flex flex-col items-center justify-center text-center transition-transform"
                style={{
                  transform: `translate(${customDesign.offsetX || 0}px, ${customDesign.offsetY || 0}px) scale(${customDesign.scale || 1}) rotate(${customDesign.rotation || 0}deg)`,
                }}
              >
                {customDesign.uploadedImageUrl && (
                  <img 
                    src={customDesign.uploadedImageUrl} 
                    alt="Diseño personalizado" 
                    className="max-w-[90px] max-h-[90px] object-contain"
                    referrerPolicy="no-referrer"
                  />
                )}
                {customDesign.customText && (
                  <p 
                    className={`mt-1 leading-tight ${getFontFamilyStyle(customDesign.fontFamily)}`}
                    style={{
                      color: customDesign.textColor || '#000000',
                      fontSize: `${customDesign.fontSize || 14}px`,
                    }}
                  >
                    {customDesign.customText}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================== 4. BOTTLE (BOTELLA ALUMINIO) ===================== */}
        {mockupType === 'bottle' && (
          <div className="relative w-64 h-64 flex items-center justify-center">
            <div className="absolute -bottom-3 w-32 h-5 bg-slate-800/25 rounded-full blur-md" />

            {/* Bottle cap & hook */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full border-4 border-slate-700 bg-slate-800 shadow-sm mb-1" />
              <div className="w-12 h-6 bg-slate-700 rounded-t-md border-b-2 border-slate-900" />
              
              {/* Bottle Cylinder */}
              <div 
                className="relative w-28 h-52 rounded-b-3xl rounded-t-xl shadow-xl overflow-hidden flex items-center justify-center border border-slate-300"
                style={{ backgroundColor: baseColor }}
              >
                <div className={`relative w-[85%] h-[80%] flex items-center justify-center overflow-hidden ${
                  showGuides ? 'border-2 border-dashed border-indigo-400/80' : ''
                }`}>
                  <div 
                    className="flex flex-col items-center justify-center text-center transition-transform"
                    style={{
                      transform: `translate(${customDesign.offsetX || 0}px, ${customDesign.offsetY || 0}px) scale(${customDesign.scale || 1}) rotate(${customDesign.rotation || 0}deg)`,
                    }}
                  >
                    {customDesign.uploadedImageUrl && (
                      <img 
                        src={customDesign.uploadedImageUrl} 
                        alt="Diseño personalizado" 
                        className="max-w-[75px] max-h-[110px] object-contain"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    {customDesign.customText && (
                      <p 
                        className={`mt-1 leading-tight ${getFontFamilyStyle(customDesign.fontFamily)}`}
                        style={{
                          color: customDesign.textColor || '#000000',
                          fontSize: `${customDesign.fontSize || 13}px`,
                        }}
                      >
                        {customDesign.customText}
                      </p>
                    )}
                  </div>
                </div>

                {/* Metallic shine reflection */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-white/30 to-black/30 pointer-events-none mix-blend-overlay" />
              </div>
            </div>
          </div>
        )}

        {/* ===================== 5. CAP (GORRA TRUCKER) ===================== */}
        {mockupType === 'cap' && (
          <div className="relative w-64 h-64 flex items-center justify-center">
            <div className="absolute -bottom-2 w-56 h-6 bg-slate-800/20 rounded-full blur-md" />

            <div className="relative w-60 h-52 flex items-center justify-center">
              {/* Back Mesh Cap */}
              <div 
                className="absolute inset-x-4 top-2 h-36 rounded-t-full shadow-lg border border-slate-700/30"
                style={{ backgroundColor: baseColor === '#FFFFFF' ? '#1E293B' : baseColor }}
              />
              
              {/* Front White Foam Panel for Sublimation */}
              <div className="absolute inset-x-8 top-6 h-28 bg-white rounded-t-3xl border border-slate-300 shadow-md flex items-center justify-center overflow-hidden">
                <div className={`relative w-[90%] h-[80%] flex items-center justify-center overflow-hidden ${
                  showGuides ? 'border-2 border-dashed border-indigo-400/80' : ''
                }`}>
                  <div 
                    className="flex flex-col items-center justify-center text-center transition-transform"
                    style={{
                      transform: `translate(${customDesign.offsetX || 0}px, ${customDesign.offsetY || 0}px) scale(${customDesign.scale || 1}) rotate(${customDesign.rotation || 0}deg)`,
                    }}
                  >
                    {customDesign.uploadedImageUrl && (
                      <img 
                        src={customDesign.uploadedImageUrl} 
                        alt="Diseño personalizado" 
                        className="max-w-[70px] max-h-[60px] object-contain"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    {customDesign.customText && (
                      <p 
                        className={`mt-0.5 leading-tight ${getFontFamilyStyle(customDesign.fontFamily)}`}
                        style={{
                          color: customDesign.textColor || '#000000',
                          fontSize: `${customDesign.fontSize || 12}px`,
                        }}
                      >
                        {customDesign.customText}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Visor / Brim */}
              <div 
                className="absolute -bottom-1 inset-x-0 h-14 rounded-b-full shadow-xl border-t-2 border-black/20"
                style={{ backgroundColor: baseColor === '#FFFFFF' ? '#0F172A' : baseColor }}
              />
            </div>
          </div>
        )}

        {/* ===================== 6. MOUSEPAD GAMER ===================== */}
        {mockupType === 'mousepad' && (
          <div className="relative w-72 h-60 flex items-center justify-center">
            <div className="absolute -bottom-2 w-64 h-6 bg-slate-800/25 rounded-full blur-md" />

            <div 
              className="relative w-64 h-48 bg-slate-900 rounded-2xl p-2 shadow-2xl border-4 border-slate-800 flex items-center justify-center overflow-hidden transition-all"
            >
              {/* White Printable Surface */}
              <div className="relative w-full h-full bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-inner">
                <div 
                  className="flex flex-col items-center justify-center text-center transition-transform"
                  style={{
                    transform: `translate(${customDesign.offsetX || 0}px, ${customDesign.offsetY || 0}px) scale(${customDesign.scale || 1}) rotate(${customDesign.rotation || 0}deg)`,
                  }}
                >
                  {customDesign.uploadedImageUrl && (
                    <img 
                      src={customDesign.uploadedImageUrl} 
                      alt="Diseño personalizado" 
                      className="max-w-[170px] max-h-[120px] object-contain"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  {customDesign.customText && (
                    <p 
                      className={`mt-1.5 leading-tight ${getFontFamilyStyle(customDesign.fontFamily)}`}
                      style={{
                        color: customDesign.textColor || '#000000',
                        fontSize: `${customDesign.fontSize || 16}px`,
                      }}
                    >
                      {customDesign.customText}
                    </p>
                  )}
                </div>

                {/* Fabric texture overlay */}
                <div className="absolute inset-0 bg-radial from-white/10 to-black/10 pointer-events-none" />
              </div>
            </div>
          </div>
        )}

        {/* ===================== 7. PILLOW (COJÍN) ===================== */}
        {mockupType === 'pillow' && (
          <div className="relative w-64 h-64 flex items-center justify-center">
            <div className="absolute -bottom-2 w-56 h-6 bg-slate-800/20 rounded-full blur-md" />

            <div 
              className="relative w-56 h-56 rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden border border-slate-200"
              style={{ backgroundColor: baseColor }}
            >
              <div className={`relative w-[85%] h-[85%] flex items-center justify-center overflow-hidden ${
                showGuides ? 'border-2 border-dashed border-indigo-400/80' : ''
              }`}>
                <div 
                  className="flex flex-col items-center justify-center text-center transition-transform"
                  style={{
                    transform: `translate(${customDesign.offsetX || 0}px, ${customDesign.offsetY || 0}px) scale(${customDesign.scale || 1}) rotate(${customDesign.rotation || 0}deg)`,
                  }}
                >
                  {customDesign.uploadedImageUrl && (
                    <img 
                      src={customDesign.uploadedImageUrl} 
                      alt="Diseño personalizado" 
                      className="max-w-[130px] max-h-[130px] object-contain"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  {customDesign.customText && (
                    <p 
                      className={`mt-1.5 leading-tight ${getFontFamilyStyle(customDesign.fontFamily)}`}
                      style={{
                        color: customDesign.textColor || '#000000',
                        fontSize: `${customDesign.fontSize || 16}px`,
                      }}
                    >
                      {customDesign.customText}
                    </p>
                  )}
                </div>
              </div>

              {/* Plump Cushion Shadow & Light */}
              <div className="absolute inset-0 bg-radial from-transparent via-black/5 to-black/25 pointer-events-none rounded-3xl" />
            </div>
          </div>
        )}

        {/* ===================== 8. PUZZLE / KEYCHAIN / OTHER ===================== */}
        {(mockupType === 'puzzle' || mockupType === 'keychain' || mockupType === 'phonecase') && (
          <div className="relative w-64 h-64 flex items-center justify-center">
            <div className="absolute -bottom-2 w-52 h-5 bg-slate-800/20 rounded-full blur-md" />

            <div 
              className={`relative shadow-2xl overflow-hidden border border-slate-300 flex items-center justify-center ${
                mockupType === 'puzzle'
                  ? 'w-56 h-44 rounded-xl bg-white'
                  : mockupType === 'keychain'
                  ? 'w-36 h-52 rounded-2xl bg-white'
                  : 'w-36 h-60 rounded-3xl bg-slate-900 p-1.5'
              }`}
            >
              <div className="relative w-full h-full bg-white rounded-lg flex items-center justify-center overflow-hidden">
                <div 
                  className="flex flex-col items-center justify-center text-center transition-transform"
                  style={{
                    transform: `translate(${customDesign.offsetX || 0}px, ${customDesign.offsetY || 0}px) scale(${customDesign.scale || 1}) rotate(${customDesign.rotation || 0}deg)`,
                  }}
                >
                  {customDesign.uploadedImageUrl && (
                    <img 
                      src={customDesign.uploadedImageUrl} 
                      alt="Diseño personalizado" 
                      className="max-w-[110px] max-h-[110px] object-contain"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  {customDesign.customText && (
                    <p 
                      className={`mt-1 leading-tight ${getFontFamilyStyle(customDesign.fontFamily)}`}
                      style={{
                        color: customDesign.textColor || '#000000',
                        fontSize: `${customDesign.fontSize || 14}px`,
                      }}
                    >
                      {customDesign.customText}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
