/* Genera /sitemap.xml con todas las páginas en los 3 idiomas */
import { ROUTES, LANGS } from '../i18n/routes.js';

export function GET({ site }) {
  const urls = Object.values(ROUTES).map((r) => {
    const alts = LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${new URL(r[l], site)}"/>`).join('\n');
    return LANGS.map((l) => `  <url>\n    <loc>${new URL(r[l], site)}</loc>\n${alts}\n  </url>`).join('\n');
  }).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
