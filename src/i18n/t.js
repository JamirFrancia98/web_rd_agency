/* Traductor para las vistas .astro: t('clave') devuelve el texto del idioma de la página. */
import { LANGS } from './routes.js';

export function useT(dict, lang) {
  const L = Math.max(0, LANGS.indexOf(lang));
  return (k) => {
    const v = dict[k];
    if (v == null) return k;
    return Array.isArray(v) ? (v[L] ?? v[0]) : v;
  };
}

/* lo mismo en el navegador (toma el idioma de <html lang>) */
export function clientT(dict) {
  const lang = typeof document !== 'undefined' ? document.documentElement.lang : 'es';
  return useT(dict, lang);
}

export const langIndex = () => Math.max(0, LANGS.indexOf(typeof document !== 'undefined' ? document.documentElement.lang : 'es'));
