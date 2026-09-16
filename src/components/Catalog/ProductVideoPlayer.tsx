import React from 'react';
import { Film, Play } from 'lucide-react';
import { getVideoEmbedUrl } from '../../utils/videoHelper';

interface ProductVideoPlayerProps {
  videoUrl: string;
  title?: string;
}

export const ProductVideoPlayer: React.FC<ProductVideoPlayerProps> = ({ videoUrl, title }) => {
  const { type, embedUrl } = getVideoEmbedUrl(videoUrl);

  if (!videoUrl || !embedUrl) {
    return null;
  }

  if (type === 'youtube' || type === 'vimeo') {
    return (
      <div className="w-full h-full aspect-square bg-slate-950 rounded-2xl overflow-hidden relative shadow-inner flex items-center justify-center">
        <iframe
          src={embedUrl}
          title={title || "Video Demostrativo del Producto"}
          className="w-full h-full border-0 rounded-2xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

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

  return (
    <div className="w-full h-full aspect-square bg-slate-950 rounded-2xl overflow-hidden relative shadow-inner flex flex-col items-center justify-center p-2 text-white">
      <iframe
        src={embedUrl}
        title={title || "Video Demostrativo"}
        className="w-full h-full border-0 rounded-xl"
        allowFullScreen
      />
    </div>
  );
};
