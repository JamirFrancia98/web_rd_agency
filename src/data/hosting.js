/* ============================================================
   PLANES DE HOSTING
   base = precio del proveedor (USD / mes). Se muestra base × (1 + MARKUP).
   ⚠️ Revisa precios y características con tu proveedor antes de publicar.
   ============================================================ */
export const MARKUP = 0.30;          // margen RD (no se muestra en la web)
export const ANNUAL_DISCOUNT = 0.15; // descuento si se paga al año
export const CURRENCY = 'US$';

const price = (base) => Math.ceil(base * (1 + MARKUP) * 10) / 10 - 0.01;

export const PLANS = [
  {
    id: 'starter', base: 4.95, featured: false,
    name: { es: 'Emprende', en: 'Starter', it: 'Starter' },
    for: { es: 'Para tu primera web o landing', en: 'For your first site or landing page', it: 'Per il tuo primo sito o landing' },
    feats: {
      es: ['1 sitio web', '10 GB SSD', '10 cuentas de correo', 'SSL gratis', 'Backups diarios'],
      en: ['1 website', '10 GB SSD', '10 email accounts', 'Free SSL', 'Daily backups'],
      it: ['1 sito web', '10 GB SSD', '10 caselle email', 'SSL gratuito', 'Backup giornalieri'],
    },
  },
  {
    id: 'pro', base: 6.95, featured: true,
    name: { es: 'Profesional', en: 'Professional', it: 'Professional' },
    for: { es: 'Para empresas y tiendas online', en: 'For businesses and online stores', it: 'Per aziende e store online' },
    feats: {
      es: ['Sitios ilimitados', '50 GB SSD', 'Correos ilimitados', 'SSL gratis', 'Backups diarios', 'Migración gratis'],
      en: ['Unlimited websites', '50 GB SSD', 'Unlimited email', 'Free SSL', 'Daily backups', 'Free migration'],
      it: ['Siti illimitati', '50 GB SSD', 'Email illimitate', 'SSL gratuito', 'Backup giornalieri', 'Migrazione gratuita'],
    },
  },
  {
    id: 'corp', base: 9.95, featured: false,
    name: { es: 'Corporativo', en: 'Business', it: 'Business' },
    for: { es: 'Para webs con mucho tráfico', en: 'For high-traffic websites', it: 'Per siti ad alto traffico' },
    feats: {
      es: ['Sitios ilimitados', '100 GB SSD', 'Correos ilimitados', 'SSL gratis', 'Backups diarios', 'Recursos dedicados', 'Soporte prioritario'],
      en: ['Unlimited websites', '100 GB SSD', 'Unlimited email', 'Free SSL', 'Daily backups', 'Dedicated resources', 'Priority support'],
      it: ['Siti illimitati', '100 GB SSD', 'Email illimitate', 'SSL gratuito', 'Backup giornalieri', 'Risorse dedicate', 'Supporto prioritario'],
    },
  },
].map((p) => ({ ...p, monthly: price(p.base), yearly: Math.round(price(p.base) * (1 - ANNUAL_DISCOUNT) * 100) / 100 }));
