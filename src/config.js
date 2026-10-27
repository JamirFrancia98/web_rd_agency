/* ============================================================
   CONFIGURACIÓN GENERAL DEL SITIO
   Cambia aquí y se actualiza en todas las páginas.
   ============================================================ */

// WhatsApp con código de país, sin "+" ni espacios
export const WA_NUMBER = '51913466762';
export const PHONE = '+51 913 466 762';
export const PHONE_HREF = '+51913466762';

// Correo y ubicación (footer y contacto)
export const EMAIL = 'contact@revolutiondigital.pe';
export const CITY = { es: 'Lima, Perú', en: 'Lima, Peru', it: 'Lima, Perù' };

// Horario de atención (GMT-5)
export const HOURS = { open: '8:00', close: '20:00', tz: 'GMT-5' };

export const waLink = (msg) => 'https://wa.me/' + WA_NUMBER + (msg ? '?text=' + encodeURIComponent(msg) : '');
