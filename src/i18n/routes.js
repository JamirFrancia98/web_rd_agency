/* URL de cada página en cada idioma. Español es el idioma principal (sin prefijo). */
export const LANGS = ['es', 'en', 'it'];

export const ROUTES = {
  home:       { es: '/',            en: '/en/',            it: '/it/' },
  portafolio: { es: '/portafolio/', en: '/en/portfolio/',  it: '/it/portfolio/' },
  nosotros:   { es: '/nosotros/',   en: '/en/about/',      it: '/it/chi-siamo/' },
  casos:      { es: '/casos/',      en: '/en/cases/',      it: '/it/casi/' },
  igaming:    { es: '/igaming/',    en: '/en/igaming/',    it: '/it/igaming/' },
  disenoweb:  { es: '/diseno-web/', en: '/en/web-design/', it: '/it/web-design/' },
  software:   { es: '/software/',   en: '/en/software/',   it: '/it/software/' },
  hosting:    { es: '/hosting/',    en: '/en/hosting/',    it: '/it/hosting/' },
  ia:         { es: '/automatizacion-ia/', en: '/en/ai-automation/', it: '/it/automazione-ia/' },
  contacto:   { es: '/contacto/',   en: '/en/contact/',    it: '/it/contatti/' },
};

/** Devuelve la URL de una página en el idioma pedido (o en el de la página actual). */
export function route(page, lang) {
  const l = lang || (typeof document !== 'undefined' ? document.documentElement.lang : 'es');
  const r = ROUTES[page] || ROUTES.home;
  return r[l] || r.es;
}
