declare global {
  interface Window {
    /** Standalone single-file preview injects blob URLs here; the real site never sets these. */
    __PA_VIDEO_URLS__?: Record<string, string>;
    __PA_POSTERS__?: Record<string, string>;
  }
}

/** Resolve a video under public/videos/, e.g. videoSrc("loops/home-bottle.mp4"). */
export function videoSrc(file: string): string {
  return window.__PA_VIDEO_URLS__?.[file] ?? `${import.meta.env.BASE_URL}videos/${file}`;
}

/**
 * VP9/WebM fallback for browsers without an H.264 decoder.
 * Returns null when a blob override is active (the override is already mp4 bytes).
 */
export function videoWebm(file: string): string | null {
  if (window.__PA_VIDEO_URLS__?.[file]) return null;
  return `${import.meta.env.BASE_URL}videos/${file.replace(/\.mp4$/, ".webm")}`;
}

/** Resolve a poster frame by name, e.g. posterSrc("home-bottle"). */
export function posterSrc(name: string): string {
  return window.__PA_POSTERS__?.[name] ?? `${import.meta.env.BASE_URL}videos/posters/${name}.jpg`;
}
