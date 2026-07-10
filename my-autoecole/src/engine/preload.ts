/* Précharge des images en mémoire (cache navigateur) avec suivi de
   progression et garde-fou de délai. */
export function preloadImages(
  urls: string[],
  timeoutMs = 8000,
  onProgress?: (loaded: number, total: number) => void,
): Promise<void> {
  const total = urls.length;
  if (total === 0) {
    onProgress?.(0, 0);
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    let loaded = 0;
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve();
    };
    const tick = () => {
      loaded += 1;
      onProgress?.(loaded, total);
      if (loaded >= total) done();
    };
    const timer = setTimeout(done, timeoutMs);
    for (const url of urls) {
      const img = new Image();
      img.onload = tick;
      img.onerror = tick;
      img.src = url;
    }
  });
}
