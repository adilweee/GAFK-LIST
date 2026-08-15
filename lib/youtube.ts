export function youtubeThumbnail(url?: string | null) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    let id = parsed.searchParams.get('v');
    if (!id && parsed.hostname.includes('youtu.be')) id = parsed.pathname.split('/').filter(Boolean)[0];
    if (!id && parsed.pathname.startsWith('/shorts/')) id = parsed.pathname.split('/')[2];
    if (!id && parsed.pathname.startsWith('/embed/')) id = parsed.pathname.split('/')[2];
    return id && /^[\w-]{11}$/.test(id) ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
  } catch { return null; }
}
