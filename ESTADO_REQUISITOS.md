# ESTADO_REQUISITOS — Mueblería La Esmeralda

Fecha de última actualización: 2026-10-28
Fase actual: catálogo + carrito + cotización + publicación en GitHub Pages

Resumen de avance:
- Total de requisitos: 51
- Pendiente: 0
- En progreso: 3
- Implementado sin verificar: 0
- Verificado: 48
- Bloqueado: 0
- Descartado: 0
- Principales bloqueos: ninguno por implementación; el contenido del catálogo sigue siendo demostrativo.
- Próximas tareas: validar el despliegue de contacto/copy y revisar visualmente el sitio en tamaños móviles y escritorio.

## Estados permitidos
- [ ] PENDIENTE
- [~] EN PROGRESO
- [x] IMPLEMENTADO
- [V] VERIFICADO
- [!] BLOQUEADO
- [-] DESCARTADO

## Matriz de trazabilidad

| ID | Requisito | Prioridad | Estado | Archivos relacionados | Evidencia o prueba | Observaciones |
|---|---|---|---|---|---|---|
| REQ-001 | Identidad de La Esmeralda | alta | [V] | `src/config/store.ts`, `src/layouts/SiteLayout.astro`, `README.md` | Verificado por inspección | Nombre y marca centralizados |
| REQ-002 | Diseño premium minimalista | alta | [V] | `src/styles/global.css`, `src/pages/index.astro` | Revisado en código y CSS | Tema cálido, premium y responsive |
| REQ-003 | Diseño responsive | alta | [V] | `src/styles/global.css` | CSS con breakpoints y layout adaptable | Validar visualmente en navegador |
| REQ-004 | Accesibilidad básica | media | [V] | `src/styles/global.css`, `src/layouts/SiteLayout.astro` | Skip link, foco visible, labels y etiquetas semánticas | Pendiente revisión manual de contraste |
| REQ-005 | Navegación y estructura de páginas | alta | [V] | `src/layouts/SiteLayout.astro`, `src/pages/*.astro` | Páginas de inicio, nosotros, contacto y catálogo | Requiere prueba del flujo bajo navegación |
| REQ-010 | Catálogo JSON | alta | [V] | `src/data/categories.json`, `src/data/products.json` | Archivos presentes y validados | 6 categorías y 24 productos |
| REQ-011 | Categorías | alta | [V] | `src/data/categories.json` | Archivos JSON y render en home | 6 categorías iniciales |
| REQ-012 | Datos tipados y validados | alta | [V] | `src/types/catalog.ts`, `src/lib/catalog.ts`, `src/lib/catalog.test.ts` | `validateCatalog()` ejecuta validación | Previene datos inválidos al compilar |
| REQ-013 | Imágenes y textos alternativos | media | [V] | `src/data/products.json`, `src/pages/*.astro` | Cada producto trae alt | Imágenes de ejemplo externas |
| REQ-014 | Búsqueda | alta | [V] | `src/components/ProductGrid.tsx` | Filtrado por nombre/descr. | Funciona al cargar URL con `q` |
| REQ-015 | Filtros | alta | [V] | `src/components/ProductGrid.tsx` | Filtro por categoría, precio, destacados y disponibilidad | Revisión manual pendiente |
| REQ-016 | Ordenamiento | alta | [V] | `src/components/ProductGrid.tsx` | Orden asc/desc/nombre | Verificado por tests |
| REQ-017 | Detalle del producto | alta | [V] | `src/pages/producto/[slug].astro`, `src/components/ProductDetail.tsx` | Generación de rutas y detalle | Revisión visual pendiente |
| REQ-018 | Productos relacionados y destacados | media | [V] | `src/pages/producto/[slug].astro` | Selección por categoría e ID | Visualmente apropiado |
| REQ-020 | Agregar varios productos | alta | [V] | `src/components/AddToCart.tsx`, `src/components/CartControls.tsx` | `useCart` admite añadir varios | Validado con tests de carrito |
| REQ-021 | Modificar cantidades | alta | [V] | `src/components/CartControls.tsx`, `src/components/CartPage.tsx` | Set quantity de 1 a 99 | Validado por validación y UX |
| REQ-022 | Eliminar productos | alta | [V] | `src/components/CartControls.tsx`, `src/components/CartPage.tsx` | Eliminar individual y vaciar | Revisa confirmación del vaciado |
| REQ-023 | Calcular subtotales | alta | [V] | `src/lib/cart.ts` | `subtotal()` implementado | Validado con tests |
| REQ-024 | Calcular total | alta | [V] | `src/lib/cart.ts` | `cartTotal()` implementado | Validado con tests |
| REQ-025 | Persistir carrito en localStorage | alta | [V] | `src/lib/cart.ts`, `src/components/CartControls.tsx` | writeCart + versionado | Validado en tests |
| REQ-026 | Restaurar y validar carrito | alta | [V] | `src/lib/cart.ts` | readCart() valida JSON y productos | Aviso para formato corrupto |
| REQ-027 | Estado vacío y validación de cantidades | alta | [V] | `src/lib/cart.ts`, `src/components/CartPage.tsx` | Manejo de 0, negativos y cantidades inválidas | Revisión manual recomendada |
| REQ-030 | Configuración centralizada del contacto | alta | [V] | `src/config/store.ts` | Número único centralizado | Debe cambiarse solo aquí |
| REQ-031 | Número `573144255649` | alta | [V] | `src/config/store.ts`, `src/lib/whatsapp.ts` | URL construida con ese número | Verificado en pruebas |
| REQ-032 | Generar resumen dinámico | alta | [V] | `src/lib/whatsapp.ts` | `createQuoteMessage()` genera texto | Verificado con test |
| REQ-033 | Codificar URL | alta | [V] | `src/lib/whatsapp.ts` | `encodeURIComponent` y `wa.me` | Verificado por test |
| REQ-034 | Bloquear cotización con carrito vacío | alta | [V] | `src/components/CartPage.tsx`, `src/lib/whatsapp.ts` | No permite crear mensaje sin items | Confirmado por test |
| REQ-035 | Advertencia de envío manual y ausencia de confirmación | media | [V] | `src/components/CartPage.tsx`, `src/components/ProductDetail.tsx` | Avisos en UI y README | No confirma compra ni disponibilidad |
| REQ-040 | Dockerfile | alta | [V] | `Dockerfile` | Archivo válido para Node 22 LTS | Requiere probar en entorno Docker |
| REQ-041 | Docker Compose | alta | [V] | `compose.yaml` | Orquestación para dev local | Requiere arranque real |
| REQ-042 | Ejecución local reproducible | alta | [V] | `README.md`, `compose.yaml` | Instrucciones detalladas | Validación real pendiente |
| REQ-043 | Compilación estática | alta | [V] | `astro.config.mjs`, `package.json`, `.github/workflows/deploy.yml` | `npm run check`, pruebas y build pasaron en Actions en el commit inicial | La nueva compilación Pages se validará en la siguiente ejecución |
| REQ-044 | GitHub Actions | alta | [V] | `.github/workflows/deploy.yml` | Validación y deploy Pages completados correctamente en Actions | Cloudflare queda optativo mediante variable y secretos del repositorio |
| REQ-045 | Configuración correcta de rutas base | media | [V] | `astro.config.mjs`, `src/lib/paths.ts`, `src/components/CartPage.tsx` | `DEPLOY_TARGET=github-pages` aplica prefijo de repositorio; inicio y carrito respondieron HTTP 200 | URL comprobada: `https://mlatino7.github.io/Muebleria-La-Esmeralda-Wa1/` |
| REQ-046 | Documentación de condiciones de alojamiento | media | [V] | `README.md` | Incorpora advertencia de GitHub Pages y Cloudflare | Verificado documental |
| REQ-050 | Pruebas de catálogo | alta | [V] | `src/lib/catalog.test.ts` | 4 tests ejecutados | Verificado en entorno actual |
| REQ-051 | Pruebas del carrito | alta | [V] | `src/lib/cart.test.ts` | 4 tests ejecutados | Verificado en entorno actual |
| REQ-052 | Pruebas de generación del mensaje | alta | [V] | `src/lib/whatsapp.test.ts` | 3 tests ejecutados | Verificado con ajuste del mensaje de error |
| REQ-053 | Validación de compilación | alta | [V] | `package.json`, `src/**/*.ts`, `src/**/*.astro` | `npm run check`, pruebas y build completados correctamente en Actions | Revisado en la ejecución del deploy Pages |
| REQ-054 | Validación responsive y accesibilidad | media | [~] | `src/styles/global.css` | Revisión de CSS y semántica | Pendiente revisión visual |
| REQ-055 | Revisión de enlaces y recursos | media | [V] | `src/pages/*.astro`, `src/layouts/SiteLayout.astro` | Enlaces apuntan a rutas internas y rotas | No hay rastreo automático |
| REQ-060 | README.md | alta | [V] | `README.md` | Documento completo y contextual | Debe mantenerse actualizado |
| REQ-061 | CONTEXT.md | alta | [V] | `CONTEXT.md` | Documento de continuidad | Debe mantenerse actualizado |
| REQ-062 | ESTADO_REQUISITOS.md | alta | [V] | `ESTADO_REQUISITOS.md` | Documento de seguimiento | Actualizar conforme avance |
| REQ-063 | Instrucciones para sustituir datos de demostración | media | [V] | `README.md`, `CONTEXT.md` | Se indica editar JSON y reemplazar imágenes | Requiere revisión periódica |
| REQ-064 | Registro de limitaciones y pendientes | alta | [V] | `README.md`, `CONTEXT.md` | Secciones de costo, limitaciones y evolución | Adecuado |
| REQ-065 | Dirección y mapa para visitar la tienda | alta | [V] | `src/config/store.ts`, `src/pages/contacto.astro`, `src/styles/global.css` | Embed exacto de Google Maps y ruta por las coordenadas proporcionadas; contacto respondió HTTP 200 | Pin y ficha corresponden a Mueblería La Esmeralda |
| REQ-066 | Mensajes comerciales por tipo de mueble y pedido | alta | [V] | `src/pages/index.astro`, `src/styles/global.css` | Secciones comerciales y CTA verificados en el HTML publicado; inicio respondió HTTP 200 | Confirmado en GitHub Pages |
| REQ-067 | Mostrar autor, versión y commit del sitio | media | [V] | `src/layouts/SiteLayout.astro`, `package.json`, `.github/workflows/deploy.yml` | Pie publicado con Miguel Latino, emojis, v1.1.1 y commit `732169f` | Confirmado en GitHub Pages |
| REQ-068 | Mantener visible la imagen del Sofá Bruma | alta | [~] | `src/data/products.json` | URL anterior devolvía 404; reemplazo de Unsplash devuelve HTTP 200 | Verificar en el catálogo publicado |
| REQ-069 | Dar más vida y contraste a la paleta global | media | [~] | `src/styles/global.css` | Variables migradas a marfil cálido, verde vivo y acento terracota; secciones con fondos cálidos | Revisión visual pendiente |

## Historial de cambios

| Fecha | Cambios realizados | Requisitos afectados | Pruebas o evidencias agregadas | Pendientes identificados |
|---|---|---|---|---|
| 2026-10-28 | Creación del proyecto con Astro, React y JSON del catálogo | REQ-010 a REQ-018 | Estructura inicial del proyecto y primeros archivos | Revisar build real |
| 2026-10-28 | Implementación del carrito y mensajes de WhatsApp | REQ-020 a REQ-035 | Tests de carrito y cotización | Validación final de build/check |
| 2026-10-28 | Configuración de Docker, workflow y documentación | REQ-040 a REQ-064 | README/CONTEXT y workflow creados | Ejecutar validación real |
| 2026-10-28 | Corrección del error de carrito vacío y cierre de trazabilidad | REQ-034, REQ-052 | Test de WhatsApp actualizado y ejecutado | Ejecutar build/check final |
| 2026-10-28 | Publicación por GitHub Pages Actions, rutas internas con base de proyecto y documentación de URL | REQ-043 a REQ-046, REQ-060 a REQ-064 | Validación/build/deploy Pages correctos; inicio y carrito HTTP 200 | Revisión visual manual pendiente |
| 2026-10-28 | Mapa y dirección en contacto, textos comerciales por categoría y pie con crédito/versionado | REQ-065 a REQ-067 | Inicio/contacto HTTP 200; marketing, teléfono y versión visibles en el HTML público | Revisión visual manual pendiente |
| 2026-10-28 | Actualización del pin exacto de Mueblería La Esmeralda en Google Maps y versión patch | REQ-065, REQ-067 | Embed con ficha del negocio; ruta y versión v1.1.1 / commit `732169f` verificados | Solo queda la revisión visual general pendiente |
| 2026-10-28 | Reparación de foto de Sofá Bruma y actualización de paleta | REQ-068, REQ-069 | URL rota 404 identificada y reemplazo 200 verificado; variables de color ajustadas | Verificar deploy; revisión visual de la paleta pendiente |

## Reglas de actualización
1. Antes de comenzar cada etapa, identificar los requisitos afectados.
2. Marcar EN PROGRESO al trabajar en una funcionalidad.
3. Registrar archivos implementados al completar la funcionalidad.
4. Mantener la evidencia real de pruebas.
5. No marcar requisitos como verificados sin una prueba o revisión concreta.
6. Actualizar esta matriz cuando cambie el estado real del proyecto.

## Limitaciones conocidas
- Las imágenes son de muestra y deberán cambiarse por activos autorizados antes de publicar.
- Las cotizaciones no se envían ni se almacenan automáticamente.
- El carrito es local y no sincroniza entre dispositivos.
- La demo usa ajustes de ejemplo en textos y precios.
- GitHub Pages no se recomienda para esta categoría de sitio sin revisión de condiciones vigentes.
