/**
 * Inline init script that runs before paint to set the theme class on <html>.
 * Eliminates the flash-of-wrong-theme. Kept tiny to minify well.
 */
export const THEME_SCRIPT = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var resolved = stored && stored !== 'system'
      ? stored
      : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var root = document.documentElement;
    if (resolved === 'dark') root.classList.add('dark');
    root.dataset.theme = resolved;
    root.style.colorScheme = resolved;
  } catch (e) {}
})();
`.trim();
