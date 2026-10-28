# Contexto del proyecto

## Identidad y objetivo

Mueblería La Esmeralda es una demo de catálogo de muebles en español para Colombia, precios de referencia en COP y experiencia visual premium minimalista. Su objetivo es explorar productos y preparar una consulta/cotización para WhatsApp. No es una plataforma transaccional.

## Estado al 2026-10-28

### Implementado en este repositorio

- Proyecto Astro estático con integración React y TypeScript.
- Inicio, catálogo, páginas de detalle generadas estáticamente, carrito, nosotros y contacto.
- Seis categorías y 24 productos ilustrativos en JSON; catálogo validado al importar.
- Búsqueda, categoría, intervalo de precio, orden, destacados y disponibilidad.
- Formateo COP, carrito en `localStorage` versionado, cantidad, eliminación, vaciado confirmado y restauración validada.
- Resumen dinámico de cotización y enlace al número único `573144255649`.
- Estilos responsive, navegación semántica, texto alternativo, metadatos Open Graph, favicon y robots.
- Docker, Compose, pruebas unitarias, workflow de validación y despliegue opcional Cloudflare Pages.
- Documentación y matriz de requisitos.

### Por validar o pendiente

- Instalación limpia, `astro check`, pruebas y build deben ejecutarse en entorno con Node/Docker; el entorno de creación no incluye Node/npm.
- No se ha hecho revisión visual manual en navegador ni prueba de contraste automatizada.
- No se ha desplegado Cloudflare Pages y no existe dominio de producción para sitemap/canonical definitivo.
- Las fotos externas son placeholders ilustrativos; hace falta sustituirlas por activos autorizados antes del uso comercial.

## Arquitectura

Astro genera HTML estático desde `src/pages`. `src/pages/producto/[slug].astro` crea rutas mediante `getStaticPaths()` usando el catálogo JSON. React se hidrata en pequeñas islas para filtros, badge y carrito. Las funciones comunes viven en `src/lib`, y los datos de tienda/contacto en `src/config/store.ts`.

La base de publicación predeterminada es `/` (alojamiento en raíz, por ejemplo Cloudflare Pages). Para un sitio de proyecto compatible con GitHub Pages, Astro admite `DEPLOY_TARGET=github-pages` y utiliza el nombre de repositorio de `GITHUB_REPOSITORY`; el workflow no habilita ese despliegue y GitHub Pages no se recomienda para el propósito comercial de esta demo.

### Estructura

- `src/components/`: islas React y controles.
- `src/config/`: nombre de tienda, moneda y único WhatsApp.
- `src/data/`: catálogo y categorías JSON.
- `src/layouts/`: shell HTML compartido.
- `src/lib/`: catálogo, moneda, paths, carrito y WhatsApp.
- `src/pages/`: páginas estáticas.
- `src/styles/`: diseño global.
- `src/types/`: interfaces de dominio.
- `public/`: favicon y robots.
- `.github/workflows/`: verificación/build y despliegue opcional.

## Tecnologías y comandos

Node.js 22 LTS; Astro 5; React 19; TypeScript 5; Vitest 3. Versiones exactas de dependencias en `package-lock.json`.

```bash
npm ci
npm run dev
npm run check
npm test
npm run build
docker compose up --build
```

## Modelo y reglas

`Product` contiene id/slug/SKU/nombre/categoría/descripciones/precio/imágenes/alt/destacado/disponible y propiedades opcionales; `Category` identifica cada agrupación. `validateCatalog()` revisa unicidad, campos, precios, categoría e imágenes. El catálogo debe conservar al menos una imagen y ruta navegable.

El carrito persiste `{ version: 1, items: [{ productId, quantity }] }` en `localStorage`. Cantidad válida: entero de 1 a 99. Productos no disponibles o inexistentes se descartan al restaurar y se muestra aviso. Totales y subtotales se derivan de precios actuales del JSON. El navegador no representa una fuente autoritativa.

`createQuoteMessage()` calcula la solicitud a partir de los items actuales, incluye SKU, unidades, precio, subtotal, total, campos del cliente opcionales y solicita confirmar disponibilidad/envío/tiempos. `createWhatsAppUrl()` codifica el texto con `encodeURIComponent` y usa el número único en configuración. Abrir la app no envía el mensaje.

## Decisiones que requieren justificación para cambiarse

- Mantener Astro estático y sin servidor, usuarios, pagos, DB ni inventario central.
- Mantener el número de contacto en un único punto (`src/config/store.ts`).
- No afirmar recepción, reserva ni confirmación automática.
- Tratar precios, productos, disponibilidad y fotos como datos de demostración hasta reemplazarlos/autorizarlos.
- Mantener la publicación raíz compatible con Cloudflare Pages; no publicar en GitHub Pages sin revisar sus condiciones vigentes.

## Riesgos y evolución futura

Riesgos: dependencia de imágenes externas, costos/condiciones de alojamiento y dominio, cambios del catálogo requieren build, cotización no queda almacenada, carrito local solo para este navegador, fallos de almacenamiento del navegador. Se puede evaluar contenido CMS o backend posteriormente; requeriría nuevo alcance y controles.
