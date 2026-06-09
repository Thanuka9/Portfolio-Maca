/**
 * Extract YouTube video ID from various URL formats.
 */
export function getYouTubeId(url) {
  if (!url) return null;
  const match =
    url.match(/[?&]v=([a-zA-Z0-9_-]{11})/) ||
    url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/) ||
    url.match(/embed\/([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export function getPreviewEmbedUrl(url) {
  const id = getYouTubeId(url);
  if (!id) return null;
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&loop=1&playlist=${id}&iv_load_policy=3`;
}

/**
 * Converts any video share URL to an embeddable URL with autoplay.
 */
export function getEmbedUrl(url) {
  if (!url) return '';

  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const id = getYouTubeId(url);
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : url;
  }

  if (url.includes('vimeo.com')) {
    const idMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return idMatch
      ? `https://player.vimeo.com/video/${idMatch[1]}?autoplay=1`
      : url;
  }

  if (url.includes('drive.google.com')) {
    const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return idMatch
      ? `https://drive.google.com/file/d/${idMatch[1]}/preview`
      : url;
  }

  return url;
}

export function isDirectVideo(url) {
  return (
    !url.includes('youtube') &&
    !url.includes('youtu.be') &&
    !url.includes('vimeo') &&
    !url.includes('drive.google.com')
  );
}
