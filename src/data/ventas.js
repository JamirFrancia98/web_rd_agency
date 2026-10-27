/* ============================================================
   VENTAS REALES DE TIENDAS WOOCOMMERCE CONSTRUIDAS POR RD
   Fuente: reportes "Ventas brutas" de WooCommerce (soles, S/).
   Los totales anuales son exactos; los meses se leyeron de los gráficos
   y se ajustaron para que sumen el total de cada año.
   ============================================================ */

const scale = (months, total) => { const s = months.reduce((a, b) => a + b, 0); return months.map((m) => Math.round((m / s) * total)); };

export const STORES = [
  {
    id: 'c01',
    name: { es: 'Cliente 01 · Retail', en: 'Client 01 · Retail', it: 'Cliente 01 · Retail' },
    since: 2021,
    years: {
      2022: { total: 343582.60, months: scale([25.8, 29.7, 28.9, 40.0, 28.9, 19.7, 30.8, 29.7, 19.7, 21.1, 31.1, 39.1], 343582.60) },
      2023: { total: 433698.70, months: scale([35.9, 37.5, 39.8, 36.3, 29.4, 35.7, 30.1, 37.0, 30.8, 31.3, 40.9, 49.9], 433698.70) },
      2024: { total: 318392.60, months: scale([22.9, 19.3, 29.2, 31.8, 24.9, 18.6, 9.3, 29.0, 23.3, 22.3, 35.3, 53.8], 318392.60) },
      2025: { total: 292861.70, months: scale([32.8, 31.2, 30.7, 22.0, 18.6, 24.3, 15.9, 13.6, 22.2, 21.8, 29.1, 31.5], 292861.70) },
    },
    highlight: { value: '+234%', label: { es: 'de crecimiento en su primer año completo con nosotros (2022 vs 2021)', en: 'growth in its first full year with us (2022 vs 2021)', it: 'di crescita nel primo anno completo con noi (2022 vs 2021)' } },
  },
  {
    id: 'c02',
    name: { es: 'Cliente 02 · Lanzamiento', en: 'Client 02 · Launch', it: 'Cliente 02 · Lancio' },
    since: 2023,
    years: {
      2023: { total: 343726.90, months: [0, 0, 0, 0, 0, 0, 0, 0, 0, ...scale([66.2, 247.5, 31.8], 343726.90)] },
      2024: { total: 483777.90, months: scale([34.8, 4.6, 26.5, 46.9, 12.9, 27.6, 97.2, 10.1, 40.5, 71.9, 99.2, 12.9], 483777.90) },
      2025: { total: 207660.30, months: scale([20.8, 21.6, 25.3, 53.2, 9.9, 5.2, 48.6, 0.9, 0.4, 6.1, 6.7, 10.8], 207660.30) },
    },
    highlight: { value: 'S/ 343K', label: { es: 'vendidos en sus primeros 90 días tras el lanzamiento', en: 'sold in its first 90 days after launch', it: 'venduti nei primi 90 giorni dopo il lancio' } },
  },
];

export const TOTAL = STORES.reduce((a, s) => a + Object.values(s.years).reduce((b, y) => b + y.total, 0), 0); // ≈ S/ 2,422,219

/* ⚠️ MÉTRICAS POR CONFIRMAR: valores de referencia ("casi 89% de mejora").
   Reemplázalos por los reales cuando los tengas. */
export const IMPROVE = [
  { k: 'load',  before: '6.8 s', after: '0.9 s', delta: '-87%' },
  { k: 'conv',  before: '0.9 %', after: '1.7 %', delta: '+89%' },
  { k: 'seo',   before: '1,240', after: '2,350', delta: '+89%' },
  { k: 'mob',   before: '38',    after: '96',    delta: '+152%' },
];
