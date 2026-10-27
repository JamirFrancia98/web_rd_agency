# Revolution Digital — Sitio web

Sitio de RD (software, diseño web, marcas e iGaming) construido con **[Astro](https://astro.build)**.
El resultado es un sitio **estático**: HTML, CSS y JS que se suben a cualquier hosting, sin servidor Node.

## Páginas y URLs

| Página | Español | English | Italiano |
| --- | --- | --- | --- |
| Home ("La señal RD") | `/` | `/en/` | `/it/` |
| Portafolio 3D | `/portafolio/` | `/en/portfolio/` | `/it/portfolio/` |
| Nosotros | `/nosotros/` | `/en/about/` | `/it/chi-siamo/` |
| Casos de éxito | `/casos/` | `/en/cases/` | `/it/casi/` |
| iGaming | `/igaming/` | `/en/igaming/` | `/it/igaming/` |
| Diseño web & e-commerce | `/diseno-web/` | `/en/web-design/` | `/it/web-design/` |
| Software a medida | `/software/` | `/en/software/` | `/it/software/` |
| Hosting & correo | `/hosting/` | `/en/hosting/` | `/it/hosting/` |
| Automatización IA | `/automatizacion-ia/` | `/en/ai-automation/` | `/it/automazione-ia/` |
| Contacto | `/contacto/` | `/en/contact/` | `/it/contatti/` |

Cada idioma se genera ya traducido al compilar (mejor SEO), con `hreflang`, `canonical` y `sitemap.xml`.

## Empezar

Requisitos: **Node.js 22.12 o superior**.

```bash
npm install        # instala dependencias
npm run dev        # http://localhost:4321 con recarga automática
npm run build      # genera la web final en dist/
npm run preview    # revisa dist/ en local
```

## Estructura

```
src/
  config.js            ← WhatsApp, correo y ciudad (un solo lugar)
  layouts/Base.astro   ← <head>, header, línea de luz, footer
  components/          ← Header.astro · Footer.astro · Spine.astro
  views/               ← una vista por página (Home, Portafolio, Nosotros, Casos, Igaming)
  pages/               ← rutas por idioma (archivos de 3 líneas que usan las vistas)
  markup/*.html        ← HTML de cada página
  styles/*.css         ← estilos (global.css = header, footer, fuentes)
  scripts/*.js         ← animaciones e interacción de cada página
  i18n/
    ui.js              ← textos del header, footer y SEO
    routes.js          ← URL de cada página en cada idioma
    ssr.js             ← traduce el HTML al compilar
    home.js, casos.js… ← textos y datos de cada página (ES / EN / IT)
public/
  .htaccess            ← seguridad y caché para Apache / cPanel
  fonts/               ← Geist y Geist Mono servidas desde tu dominio
```

## Tareas frecuentes

- **Cambiar el WhatsApp o el correo:** `src/config.js`.
- **Cambiar un texto:** busca la clave en `src/i18n/<página>.js`; cada clave tiene `[es, en, it]`.
- **Header o footer:** `src/components/Header.astro` y `Footer.astro` (cambian en todas las páginas).
- **Añadir un proyecto al portafolio:** array `PROJECTS` en `src/i18n/portafolio.js`
  (pon la imagen en `public/img/` y usa `image: '/img/mi-proyecto.jpg'`).
- **Añadir o cambiar casos de éxito:** array `CASES` en `src/scripts/casos.js` (los actuales son ejemplos).
- **Dominio:** cambia `site` en `astro.config.mjs` y la línea `Sitemap` de `public/robots.txt`.

## Formulario de contacto

`public/api/contacto.php` recibe el formulario y lo envía por correo **desde tu propio hosting** (sin servicios externos).

1. Abre el archivo y revisa `MAIL_TO` (a dónde llegan) y `MAIL_FROM`.
2. En cPanel crea la cuenta de `MAIL_FROM` (ej. `no-reply@revolutiondigital.agency`) para que los correos no caigan en spam.
3. Si tu dominio es otro, añádelo en `SITE_HOSTS`.

Protecciones: solo acepta envíos desde tu dominio, campo trampa y tiempo mínimo contra bots,
límite de 5 envíos por hora por IP, validación de todos los campos y bloqueo de inyección de cabeceras.
En `npm run dev` el PHP no se ejecuta: el formulario mostrará el aviso de error con el enlace a WhatsApp. Es normal.

## Datos que conviene revisar

- `src/data/ventas.js`: ventas reales de WooCommerce (Diseño web). Las métricas de "antes / después" (`IMPROVE`) son de referencia.
- `src/data/hosting.js`: precios base del proveedor, margen y características de cada plan.

## Seguridad

- **Sin recursos externos:** Three.js se instala con npm y las fuentes viven en `public/fonts`.
  Nada se carga desde CDNs de terceros.
- **Sin scripts incrustados:** todo el JS sale en archivos, lo que permite una **CSP estricta** (`script-src 'self'`).
- **`public/.htaccess`** activa HTTPS obligatorio, HSTS, CSP, protección contra clickjacking (`X-Frame-Options`),
  `nosniff`, `Referrer-Policy`, `Permissions-Policy`, bloqueo de archivos ocultos (`.git`, `.env`) y caché.
- **Dependabot** (`.github/dependabot.yml`) abre un Pull Request cuando una librería tiene una actualización de seguridad.
- El despliegue ejecuta `npm audit` y se detiene si hay vulnerabilidades altas.

## Despliegue automático (opcional)

`.github/workflows/deploy.yml` compila y sube `dist/` a tu hosting por FTPS en cada `git push` a `main`.
Configura en GitHub → **Settings → Secrets and variables → Actions**:

| Secreto | Ejemplo |
| --- | --- |
| `FTP_SERVER` | `ftp.revolutiondigital.agency` |
| `FTP_USERNAME` | usuario FTP de cPanel |
| `FTP_PASSWORD` | contraseña de esa cuenta |

Si prefieres subir a mano: `npm run build` y copia el **contenido** de `dist/` a `public_html/`.
