/* Traduce el HTML al compilar: así cada URL (/, /en/, /it/) llega ya en su idioma,
   sin esperar al JavaScript. Usa los mismos diccionarios que el navegador. */
import { LANGS, route } from './routes.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const FILES = { 'index.html': 'home', 'portafolio.html': 'portafolio', 'nosotros.html': 'nosotros', 'casos.html': 'casos', 'igaming.html': 'igaming', 'software.html': 'software', 'hosting.html': 'hosting', 'diseno-web.html': 'disenoweb', 'automatizacion-ia.html': 'ia', 'contacto.html': 'contacto' };

export function ssrTranslate(html, dict, lang) {
  const L = Math.max(0, LANGS.indexOf(lang));
  const get = (k) => { const v = dict[k]; return v == null ? null : Array.isArray(v) ? v[L] : v; };

  // <x data-i18n="clave">texto</x>  → texto traducido
  html = html.replace(/(<([a-z0-9]+)\b[^>]*?\sdata-i18n="([^"]+)"[^>]*>)([^<]*)(<\/\2>)/gi,
    (m, open, tag, key, inner, close) => { const v = get(key); return v == null ? m : open + esc(v) + close; });

  // <x data-i18n-html="clave">texto con <b>negritas</b></x>
  html = html.replace(/(<([a-z0-9]+)\b[^>]*?\sdata-i18n-html="([^"]+)"[^>]*>)([\s\S]*?)(<\/\2>)/gi,
    (m, open, tag, key, inner, close) => { const v = get(key); return v == null ? m : open + v + close; });

  // títulos que el JS anima palabra por palabra: se dejan escritos para buscadores y sin JS
  html = html.replace(/(<([a-z0-9]+)\b[^>]*?\sdata-ssr-split="([^"]+)"[^>]*)(>)(<\/\2>)/gi,
    (m, open, tag, spec, gt, close) => {
      let i = 0;
      const words = spec.split('|').flatMap((p) => {
        const [k, cls] = p.split(':');
        return String(get(k) ?? '').split(' ').filter(Boolean).map((w) =>
          `<span class="w${cls ? ' ' + cls : ''}" style="animation-delay:${(0.15 + 0.08 * i++).toFixed(2)}s">${esc(w)}</span>`);
      });
      return open + ' data-split' + gt + words.join(' ') + close;
    });

  // enlaces entre páginas → URL del idioma actual
  html = html.replace(/href="(index|portafolio|nosotros|casos|igaming|software|hosting|diseno-web|automatizacion-ia|contacto)\.html(\?[^"#]*)?(#[^"]*)?"/g,
    (m, file, q, hash) => `href="${route(FILES[file + '.html'], lang)}${q || ''}${hash || ''}"`);

  return html;
}
