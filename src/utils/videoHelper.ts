export interface VideoEmbedInfo {
  type: 'youtube' | 'vimeo' | 'mp4' | 'iframe' | 'unknown';
  embedUrl: string;
}

export function getVideoEmbedUrl(url?: string): VideoEmbedInfo {
  if (!url || !url.trim()) {
    return { type: 'unknown', embedUrl: '' };
  }

  const clean = url.trim();

  // YouTube Shorts: youtube.com/shorts/ID
  const shortsMatch = clean.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/i);
  if (shortsMatch && shortsMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${shortsMatch[1]}?autoplay=1&rel=0`
    };
  }

  // YouTube Standard: youtube.com/watch?v=ID or youtu.be/ID or youtube.com/embed/ID
  const ytMatch = clean.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0`
    };
  }

  // Vimeo: vimeo.com/ID
  const vimeoMatch = clean.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/i);
  if (vimeoMatch && vimeoMatch[3]) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[3]}?autoplay=1`
    };
  }

  // Google Drive: drive.google.com/file/d/ID/view -> drive.google.com/file/d/ID/preview
  const driveMatch = clean.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (driveMatch && driveMatch[1]) {
    return {
      type: 'iframe',
      embedUrl: `https://drive.google.com/file/d/${driveMatch[1]}/preview`
    };
  }

  // TikTok: tiktok.com/@.../video/ID
  const tiktokMatch = clean.match(/tiktok\.com\/@[^\/]+\/video\/(\d+)/i);
  if (tiktokMatch && tiktokMatch[1]) {
    return {
      type: 'iframe',
      embedUrl: `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`
    };
  }

  // Direct MP4 / WebM / Cloudinary / Firebase Storage
  if (
    clean.match(/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i) ||
    clean.includes('cloudinary.com') ||
    clean.includes('firebasestorage.googleapis.com')
  ) {
    return {
      type: 'mp4',
      embedUrl: clean
    };
  }

  // Generic fallback iframe
  return {
    type: 'iframe',
    embedUrl: clean
  };
}
