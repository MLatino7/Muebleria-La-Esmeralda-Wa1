# Mueblería La Esmeralda

Demo de tienda estática para descubrir muebles y decoración, guardar productos en un carrito local y preparar una solicitud de cotización por WhatsApp. Está dirigida al mercado colombiano; todos los precios, referencias, productos y disponibilidades del catálogo son ilustrativos, no son una oferta comercial confirmada.

## Alcance

- Inicio, catálogo con búsqueda/filtros/orden, fichas estáticas por producto, nosotros, contacto y carrito.
- Seis categorías con cuatro productos de muestra cada una.
- Carrito en el navegador, cantidades de 1 a 99, subtotales y total estimado en COP.
- Cotización por enlace de WhatsApp al único número configurado: `573144255649`.
- Sitio generado estáticamente con Astro y componentes interactivos React.
- Pruebas unitarias para catálogo, carrito y generación de mensajes.

No procesa pagos, no tiene cuentas, servidor, base de datos, gestión remota de inventario ni registro de pedidos. El mensaje se prepara en WhatsApp, pero el visitante debe enviarlo; no se confirma la recepción ni se reserva producto.

## Tecnologías

- Node.js 22 LTS, Astro 5, React 19 y TypeScript 5.
- JSON para categorías/productos, `localStorage` versionado para el carrito.
- Vitest para pruebas, Docker Compose para desarrollo.
- GitHub Actions para comprobaciones/compilación y despliegue opcional a Cloudflare Pages.

## Requisitos

- Node.js 22 y npm (para desarrollo directo), o Docker con Docker Compose.
- La red es necesaria para instalar las dependencias y cargar las imágenes tipográficas/fotográficas externas.

## Instalación y comandos

```bash
npm ci
npm run dev
```

Visita `http://localhost:4321`.

```bash
npm run check  # comprobación Astro/TypeScript
npm test       # pruebas unitarias
npm run build  # compilación estática en dist/
npm run preview
```

### Docker Compose

```bash
docker compose up --build
```

Abre `http://localhost:4321`. Para detener: `Ctrl+C`, luego `docker compose down`. Si cambias `package.json` o `package-lock.json`, reconstruye también el volumen de dependencias del contenedor:

```bash
docker compose down -v
docker compose up --build
```

La opción `-v` elimina únicamente los volúmenes del proyecto Compose, incluido el volumen local `node_modules`.

## Estructura principal

```text
src/
  components/   Islas React: catálogo, detalle, carrito y controles
  config/       Datos centrales de la tienda/contacto
  data/         Catálogo JSON
  layouts/      Estructura Astro compartida
  lib/          Validación, formato de moneda, carrito, WhatsApp y rutas
  pages/        Páginas Astro; las rutas de producto se generan del JSON
  styles/       Diseño responsive y accesible
  types/        Modelos TypeScript
```

## Catálogo de demostración

Edita `src/data/categories.json` y `src/data/products.json`. Cada producto debe tener ID y slug únicos, SKU, nombre, categoría existente, descripciones, precio COP no negativo, al menos una imagen HTTPS o ruta pública absoluta, texto alternativo, indicador `featured` y `available`. Los opcionales incluyen precio anterior, dimensiones, materiales y colores. `src/lib/catalog.ts` valida los datos en compilación y contiene los filtros.

Para cambiar imágenes, usa archivos con licencia autorizada en `public/images/` y rutas como `/images/products/sofa.webp`, o URLs que tengas derecho a utilizar. Actualmente las imágenes de muestra son URLs de images.unsplash.com; pueden cambiar, tener condiciones propias, consumir datos y desaparecer. No se incluyen archivos de imagen locales.

Antes de una publicación comercial, reemplaza todos los nombres, textos, fotos, precios y estados de disponibilidad por información real autorizada y verifica cualquier obligación de información al consumidor. Las rutas Astro se generan con el campo `slug` durante la compilación.

## Carrito y WhatsApp

El carrito se guarda únicamente en el navegador con clave versionada `la-esmeralda-cart-v1`. Al restaurarse se valida su formato, cantidades y presencia/disponibilidad del producto; si cambió el catálogo, se informa y se retiran registros inválidos. Si el navegador bloquea `localStorage`, se informa que el carrito no persistirá.

El contacto está centralizado en `src/config/store.ts`; allí se cambia el número una sola vez. No agregues otro número ni dupliques la configuración. Los mensajes contienen referencias y precios ilustrativos calculados del estado actual; el enlace abre `https://wa.me/573144255649`. El visitante revisa y envía el mensaje manualmente.

## Despliegue

`npm run build` genera una web estática en `dist/`. El workflow `.github/workflows/deploy.yml` ejecuta `npm ci`, `npm run check`, `npm test` y `npm run build` al actualizar `main` o manualmente. El paso de publicación a Cloudflare Pages se activa en una subida a `main` solo si existen estos secretos de GitHub Actions:

- `CLOUDFLARE_API_TOKEN` (permisos necesarios para publicar en Pages).
- `CLOUDFLARE_ACCOUNT_ID`.
- `CLOUDFLARE_PAGES_PROJECT`.

El workflow solicita solo `contents: read` de GitHub; los secretos no se incorporan al frontend. Para una configuración inicial, crea un proyecto de Cloudflare Pages y limita el token al recurso/permisos de Pages requeridos. El despliegue no se ha ejecutado desde este entorno.

### GitHub Pages

No se configura publicación a GitHub Pages para esta demo. La documentación oficial dice que Pages aloja sitios estáticos personales, organizacionales o de proyecto, y GitHub restringe los usos que convierten GitHub en alojamiento gratuito para sitios comerciales/operaciones comerciales. Como el propósito aquí es catálogo y cotización comercial, verifica siempre las condiciones vigentes antes de publicarla allí; se recomienda Cloudflare Pages u otro proveedor apropiado. Enlaces oficiales: [About GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) y [GitHub Acceptable Use Policies](https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies).

La compilación usa rutas raíz para Cloudflare. Si se decide usar un sitio de proyecto de GitHub Pages tras verificar que el uso sea admisible, `DEPLOY_TARGET=github-pages` usa `GITHUB_REPOSITORY` para generar la ruta base del repositorio. Esa configuración no publica en Pages por sí sola.

## Costos, límites y evolución

- No necesita base de datos ni tiene comisiones por transacción porque no acepta pagos.
- WhatsApp funciona por enlace, no con la API Business.
- Alojamiento estático puede tener un costo inicial cero según proveedor/uso/condiciones actuales; no se promete gratuidad permanente. Un dominio propio suele requerir compra y renovación.
- Imágenes externas pueden desaparecer o tener restricciones de licencia.
- Cambios del catálogo requieren recompilar y volver a publicar.
- El carrito no se sincroniza entre dispositivos; no existe administración remota, inventario central ni almacenamiento de pedidos.
- Los datos y cálculos son del cliente: no existe validación transaccional en servidor, reserva ni confirmación de solicitud.
- Una evolución futura podría incorporar un CMS o backend solo si se justifica y se especifica aparte; ambos están fuera del alcance actual.

## Continuidad

- Estado detallado y evidencia: [ESTADO_REQUISITOS.md](./ESTADO_REQUISITOS.md).
- Arquitectura y decisiones para continuar: [CONTEXT.md](./CONTEXT.md).
