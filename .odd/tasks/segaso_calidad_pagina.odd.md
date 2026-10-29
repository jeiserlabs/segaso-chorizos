# [ODD] Auditoría y calidad de la página Segaso

> **Metodología:** ODD (One-Document-Driven Development / Gentle-AI).
> **Proyecto:** Segaso Chorizos de Tradición · Vitrina pública y experiencia MVP.
> **Fecha:** 2026-10-29 | **Estado:** Cerrado y verificado

---

## 1. Objetivo y problema

La vitrina funcionaba, pero la auditoría encontró defectos que afectaban la demo y la percepción profesional:

- 10 imágenes rotas: 9 productos sin foto y un lightbox con `src=""`.
- El servidor devolvía `index.html` con HTTP 200 para assets inexistentes y permitía descargar `.env`, `server.js` y `segaso.db`.
- 2 H1, 8 campos sin etiqueta, 29 divs clickeables sin semántica y 15 objetivos táctiles menores a 44 px.
- Sin description, Open Graph, canonical, favicon ni datos estructurados.
- 10.31 MB de transferencia por imágenes JPG sin optimizar y un logo SVG de 169 KB.

**Objetivo:** dejar la página lista para la sustentación del 2026-11-14: fotos reales, cero defectos medibles, carga rápida, accesible y con un gate reproducible.

---

## 2. Scope Rule

**Touchables:**

- `index.html`, `assets/styles.css`, `assets/app.js`
- `server.js` (solo enrutamiento estático y arranque)
- `scripts/build_product_photos.js`, `scripts/build_web_media.js`, `scripts/audit_page.js`
- `tests/page_quality.js`, `tests/e2e_segaso_playwright.js`
- `img/products/`, `assets/img/` (medios locales, gitignored)
- `README.md`, `docs/README.md`, `docs/ARCHITECTURE.md`, `docs/social/PRODUCT_PHOTOS.md`

**Forbidden:**

- Alterar precios, catálogo oficial o lógica de negocio.
- Introducir React, Next, Tailwind u otro framework.
- Commitear imágenes, videos, DB o `.env`.
- Inventar fotos de producto o usar imágenes generadas por IA.

---

## 3. Guardrails anti-sobreingeniería

- Vanilla JS y CSS; cero dependencias nuevas.
- Los medios se generan con `ffmpeg` y scripts reproducibles; si falta una fuente, fallan con el nombre exacto.
- La página debe seguir funcionando sin los medios locales: la tarjeta cae al ícono y el lightbox al placeholder.
- Un solo documento ODD; sin especificaciones paralelas.
- El gate no reemplaza la revisión humana: mide lo que puede probar de forma determinista.

---

## 4. Tareas atómicas

- [x] **T1:** Cerrar la exposición de archivos y devolver 404 real en assets; cabeceras de seguridad y cache.
- [x] **T2:** Sustituir los 9 placeholders por recortes de fotos/empaques reales de Segaso y documentar procedencia.
- [x] **T3:** Añadir description, Open Graph, Twitter Card, canonical, favicon, robots y JSON-LD con las 9 ofertas.
- [x] **T4:** Un H1, etiquetas de formulario, teclado en tarjetas/FAQ, diálogos accesibles, foco, 44 px y `prefers-reduced-motion`.
- [x] **T5:** Separar CSS/JS, convertir galería y portadas a WebP, `srcset`, dimensiones y logo optimizado.
- [x] **T6:** Gate `audit:page` + E2E de 5 fases + `npm run verify`; documentación y cierre.

---

## 5. Acceptance Criteria (oráculo determinista)

```bash
npm run verify
```

Debe terminar en verde y cumplir:

- `typecheck`: 0 errores.
- Unitarias: 13/13.
- E2E: 5 fases, 0 errores de consola.
- Gate de página: 0 imágenes rotas, 0 respuestas ≥400, H1 = 1, 0 campos sin etiqueta, 0 taps <44 px, 0 overflow.
- JSON-LD: `FoodEstablishment` con 9 ofertas.
- Superficie HTTP: 8/8 rutas con el status esperado; `.env`, código y DB responden 404.
- Transferencia: <3 MB desktop y <2.5 MB móvil.

---

## 6. Baseline (medido antes de intervenir)

| Métrica | Valor |
|---|---:|
| Transferencia | 10.31 MB desktop / 9.51 MB móvil |
| Imágenes rotas | 10 |
| H1 | 2 |
| Campos sin etiqueta | 8 |
| Divs clickeables | 29 |
| Objetivos táctiles <44 px | 15 |
| Errores de consola | 15 |
| Metadatos SEO | 0 |
| Archivos sensibles expuestos | `.env`, `server.js`, `segaso.db` |

---

## 7. Progreso y evidencia

| Commit | Entrega |
|---|---|
| `bfdfdda` | 404 real, whitelist de estáticos, cabeceras y lightbox sin `src` vacío. |
| `2722bc4` | 9 fotos reales WebP + script reproducible + procedencia. |
| `b8c57ee` | SEO, Open Graph, JSON-LD, favicon y robots; fix de logo en admin. |
| `a13d357` | Accesibilidad: H1, labels, teclado, diálogos, foco y 44 px. |
| `2044ff8` | CSS/JS separados, WebP responsive, logo 169→42 KB, 10.31→1.28 MB. |
| Cierre Fase 6 | Gate `audit:page`, E2E de 5 fases, `verify`, docs y este ODD. |

**Resultado medido:** 1.28 MB, 0 imágenes rotas, 1 H1, 0 campos sin etiqueta, 0 taps <44 px, 0 errores de consola, 8/8 rutas HTTP y `npm run verify` en verde.

**Límites declarados:**

- Los binarios de producto y redes no viven en Git; un clon limpio no muestra las fotos hasta ejecutar `npm run media:products` y `npm run media:web` con los medios locales.
- El video promocional final de Gemini/Veo no se genera en este repositorio; el kit de prompts y storyboard queda listo.
- La línea de WhatsApp y la cuenta principal de Instagram siguen pendientes de unificación con Harold.
