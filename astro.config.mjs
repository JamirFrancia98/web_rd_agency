import { defineConfig } from 'astro/config';

export default defineConfig({
  // ⚠️ Cambia por tu dominio real: se usa para canonical, hreflang y sitemap
  site: 'https://revolutiondigital.agency',
  trailingSlash: 'always',
  build: {
    format: 'directory',          // /nosotros/index.html → URL /nosotros/
    inlineStylesheets: 'never',   // CSS siempre en archivos: permite una CSP estricta
  },
  vite: {
    build: { assetsInlineLimit: 0 }, // nada de scripts/recursos incrustados en el HTML
  },
  devToolbar: { enabled: false },
});
