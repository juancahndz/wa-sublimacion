export interface VideoEmbedInfo {
  type: 'youtube' | 'vimeo' | 'tiktok' | 'mp4' | 'drive' | 'iframe' | 'unknown';
  embedUrl: string;
  originalUrl: string;
  platformName: string;
  directLink: string;
  isShortenedTikTok?: boolean;
}

export function getVideoEmbedUrl(url?: string): VideoEmbedInfo {
  if (!url || !url.trim()) {
    return { 
      type: 'unknown', 
      embedUrl: '', 
      originalUrl: '', 
      platformName: 'Video', 
      directLink: '' 
    };
  }

  const clean = url.trim();

  // YouTube Shorts: youtube.com/shorts/ID
  const shortsMatch = clean.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/i);
  if (shortsMatch && shortsMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${shortsMatch[1]}?autoplay=1&rel=0`,
      originalUrl: clean,
      platformName: 'YouTube Shorts',
      directLink: clean
    };
  }

  // YouTube Standard: youtube.com/watch?v=ID or youtu.be/ID or youtube.com/embed/ID
  const ytMatch = clean.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
      originalUrl: clean,
      platformName: 'YouTube',
      directLink: clean
    };
  }

  // Vimeo: vimeo.com/ID
  const vimeoMatch = clean.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/i);
  if (vimeoMatch && vimeoMatch[3]) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[3]}?autoplay=1`,
      originalUrl: clean,
      platformName: 'Vimeo',
      directLink: clean
    };
  }

  // Google Drive: drive.google.com/file/d/ID/view -> drive.google.com/file/d/ID/preview
  const driveMatch = clean.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (driveMatch && driveMatch[1]) {
    return {
      type: 'drive',
      embedUrl: `https://drive.google.com/file/d/${driveMatch[1]}/preview`,
      originalUrl: clean,
      platformName: 'Google Drive',
      directLink: clean
    };
  }

  // TikTok: tiktok.com/@.../video/ID or tiktok.com/v/ID
  const tiktokMatch = clean.match(/tiktok\.com\/(?:@[^\/]+\/video\/|v\/)(\d+)/i);
  if (tiktokMatch && tiktokMatch[1]) {
    return {
      type: 'tiktok',
      embedUrl: `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`,
      originalUrl: clean,
      platformName: 'TikTok',
      directLink: clean,
      isShortenedTikTok: false
    };
  }

  // TikTok Shortened or profile link: vm.tiktok.com/..., vt.tiktok.com/..., tiktok.com/t/...
  if (clean.includes('tiktok.com')) {
    return {
      type: 'tiktok',
      embedUrl: clean,
      originalUrl: clean,
      platformName: 'TikTok',
      directLink: clean,
      isShortenedTikTok: true
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
      embedUrl: clean,
      originalUrl: clean,
      platformName: 'Video MP4',
      directLink: clean
    };
  }

  // Generic fallback iframe
  return {
    type: 'iframe',
    embedUrl: clean,
    originalUrl: clean,
    platformName: 'Video',
    directLink: clean
  };
}
