// src/utils/init.jsx

export function initSite() {
  // image error fallback
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y4ZmFmYyIvPiA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0PiA8L3N2Zz4=';
      this.alt = 'Image not available';
    });
  });

  // focus outlines
  document.querySelectorAll('button, a, input, textarea, select').forEach(el => {
    el.addEventListener('focus', () => { el.style.outline = '2px solid var(--primary-color)'; el.style.outlineOffset = '2px'; });
    el.addEventListener('blur', () => { el.style.outline = ''; el.style.outlineOffset = ''; });
  });

  // global show-success handler for accessibility if needed (legacy fallback)
  window.addEventListener('show-success', (e) => {
    const enabled = localStorage.getItem('notifySound') === 'true';
    if (!enabled) return;
    try {
      // tiny beep (no-op if not supported)
      const a = new Audio('data:audio/wav;base64,UklGRlgAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YVgAAAAA');
      a.play().catch(()=>{});
    } catch {}
    try { navigator.vibrate?.(120); } catch {}
  });
}
