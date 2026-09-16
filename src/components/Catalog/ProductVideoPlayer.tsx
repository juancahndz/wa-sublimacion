import React from 'react';
import { Film, Play, ExternalLink, Sparkles } from 'lucide-react';
import { getVideoEmbedUrl } from '../../utils/videoHelper';

interface ProductVideoPlayerProps {
  videoUrl: string;
  title?: string;
}

export const ProductVideoPlayer: React.FC<ProductVideoPlayerProps> = ({ videoUrl, title }) => {
  const videoInfo = getVideoEmbedUrl(videoUrl);
  const { type, embedUrl, directLink, platformName, isShortenedTikTok } = videoInfo;

  if (!videoUrl) {
    return null;
  }

  const handleOpenDirect = () => {
    if (directLink) {
      window.open(directLink, '_blank', 'noopener,noreferrer');
    }
  };

  // TikTok special handling
  if (type === 'tiktok') {
    if (!isShortenedTikTok && embedUrl.startsWith('https://www.tiktok.com/embed/v2/')) {
      return (
        <div className="w-full h-full aspect-square bg-slate-950 rounded-2xl overflow-hidden relative shadow-inner flex flex-col justify-between p-1">
          <div className="flex-1 w-full h-full relative rounded-xl overflow-hidden bg-black flex items-center justify-center">
            <iframe
              src={embedUrl}
              title={title || "Video TikTok"}
              className="w-full h-full border-0 rounded-xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {/* Quick link to open in TikTok */}
          <div className="p-2 bg-slate-900/90 backdrop-blur-md rounded-xl mt-1 flex items-center justify-between gap-2 border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-black text-cyan-400 font-black text-xs flex items-center justify-center border border-pink-500/40">
                🎵
              </span>
              <span className="text-[11px] font-bold text-white truncate max-w-[130px]">
                TikTok Demostrativo
              </span>
            </div>
            <button
              type="button"
              onClick={handleOpenDirect}
              className="px-3 py-1 bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer hover:scale-105 active:scale-95"
            >
              <span>Abrir en TikTok</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      );
    }

    // Shortened TikTok or preview card
    return (
      <div 
        onClick={handleOpenDirect}
        className="w-full h-full aspect-square bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-2xl overflow-hidden relative shadow-inner flex flex-col items-center justify-center p-6 text-center text-white group cursor-pointer border border-indigo-500/30 hover:border-pink-500/60 transition-all"
      >
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Big TikTok Play Badge */}
        <div className="w-16 h-16 rounded-3xl bg-black border-2 border-pink-500/60 shadow-xl shadow-pink-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform relative">
          <span className="text-2xl">🎵</span>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-pink-600 flex items-center justify-center shadow">
            <Play className="w-3 h-3 fill-white text-white ml-0.5" />
          </div>
        </div>

        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-bold text-[10px] border border-pink-500/30 mb-2">
          <Sparkles className="w-3 h-3" />
          Video en TikTok
        </span>

        <h4 className="text-sm font-bold text-white mb-1 leading-snug line-clamp-2">
          {title || "Demostración de Sublimación en TikTok"}
        </h4>
        <p className="text-[11px] text-slate-300 mb-4 max-w-[220px]">
          Haz clic para abrir y reproducir el video en TikTok directamente.
        </p>

        <button
          type="button"
          onClick={handleOpenDirect}
          className="px-5 py-2.5 bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 hover:from-pink-500 hover:to-cyan-500 text-white rounded-xl text-xs font-black shadow-lg shadow-pink-600/30 flex items-center gap-2 cursor-pointer transition-transform group-hover:scale-105"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Ver Video en TikTok</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // YouTube and Vimeo
  if (type === 'youtube' || type === 'vimeo') {
    return (
      <div className="w-full h-full aspect-square bg-slate-950 rounded-2xl overflow-hidden relative shadow-inner flex flex-col justify-between p-1">
        <div className="flex-1 w-full h-full relative rounded-xl overflow-hidden bg-black flex items-center justify-center">
          <iframe
            src={embedUrl}
            title={title || "Video Demostrativo del Producto"}
            className="w-full h-full border-0 rounded-xl"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        <div className="p-2 bg-slate-900/90 backdrop-blur-md rounded-xl mt-1 flex items-center justify-between gap-2 border border-slate-800">
          <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 pl-1">
            <Film className="w-3.5 h-3.5 text-indigo-400" />
            {platformName}
          </span>
          <button
            type="button"
            onClick={handleOpenDirect}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Abrir enlace</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  // Direct MP4 / WebM
  if (type === 'mp4') {
    return (
      <div className="w-full h-full aspect-square bg-slate-950 rounded-2xl overflow-hidden relative shadow-inner flex items-center justify-center">
        <video
          src={embedUrl}
          controls
          autoPlay
          playsInline
          className="w-full h-full object-contain rounded-2xl"
        >
          Tu navegador no soporta la reproducción de video.
        </video>
      </div>
    );
  }

  // Google Drive & Generic iframes
  return (
    <div className="w-full h-full aspect-square bg-slate-950 rounded-2xl overflow-hidden relative shadow-inner flex flex-col justify-between p-1">
      <div className="flex-1 w-full h-full relative rounded-xl overflow-hidden bg-black flex items-center justify-center">
        <iframe
          src={embedUrl}
          title={title || "Video Demostrativo"}
          className="w-full h-full border-0 rounded-xl"
          allowFullScreen
        />
      </div>

      <div className="p-2 bg-slate-900/90 backdrop-blur-md rounded-xl mt-1 flex items-center justify-between gap-2 border border-slate-800">
        <span className="text-[11px] font-bold text-slate-300 pl-1">{platformName}</span>
        <button
          type="button"
          onClick={handleOpenDirect}
          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>Abrir video</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
