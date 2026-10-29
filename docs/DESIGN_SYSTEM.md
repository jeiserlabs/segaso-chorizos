# Design System — Segaso Chorizos

> **SSOT visual del sitio.** Cualquier cambio de color, tipografía, radios o componentes se rige por este documento y por los tokens de `assets/styles.css`.
> Última medición: 2026-10-29.

---

## 1. Principios

1. **Gourmet oscuro, no carnicería genérica.** Fondo carbón cálido, fotografía real y acentos de brasa.
2. **Rojo para acción, oro para valor, crema para lectura.** El color semántico no se usa como decoración.
3. **Contraste primero.** Todo texto de interfaz debe pasar WCAG AA; el texto principal busca AAA.
4. **Una sola fuente.** Plus Jakarta Sans para títulos, cuerpo, precios y UI.
5. **Radios y sombras consistentes.** 8/14/20 px; sombras suaves multicapa, nunca bordes negros duros.

---

## 2. Paleta canónica

| Token | Hex | Uso |
|---|---|---|
| `--primary` | `#A61828` | Botón primario, filtros activos, badges de marca, foco de acción |
| `--primary-hover` | `#8C1320` | Hover del primario |
| `--primary-deep` | `#630C16` | Gradiente del botón flotante |
| `--primary-soft` | `#FFA3AD` | Texto sobre badge primario |
| `--cream` | `#F3ECDA` | Texto principal, wordmark, precios |
| `--cream-muted` | `#D8CEB8` | Descripciones y texto secundario |
| `--text-muted` | `#A39699` | Navegación, metadatos y placeholders |
| `--bg-deep` | `#120C0E` | Fondo global |
| `--bg-surface` | `#1B1215` | Superficie de controles |
| `--bg-card` | `#23171B` | Tarjetas |
| `--bg-card-hover` | `#2D1D22` | Hover de tarjetas |
| `--gold` | `#E5A93C` | Acento de valor, métricas, estrellas, iconos |
| `--gold-deep` | `#B47818` | Gradiente del botón dorado |
| `--success` | `#10B981` | Estado disponible |
| `--success-soft` | `#6EE7B7` | Texto de éxito |
| `--danger` | `#EF4444` | Eliminar / error |
| `--danger-soft` | `#FCA5A5` | Texto de error sobre fondo suave |
| `--warning` | `#F59E0B` | Advertencia operativa |
| `--brand-tiktok` | `#FE2C55` | Marca TikTok (solo icono/borde, nunca fondo de texto blanco) |
| `--brand-tiktok-soft` | `#FF6685` | Enlaces TikTok sobre oscuro |
| `--brand-instagram` | `#DD2A7B` | Marca Instagram (solo icono/gradiente) |
| `--instagram-gradient` | `linear-gradient(45deg, #F58529, #DD2A7B, #8134AF, #515BD4)` | Marca Instagram en el icono |

### Superficies de profundidad

| Token | Hex | Uso |
|---|---|---|
| `--surface-deep` | `#0E080A` | Fondo de imágenes, chat, lightbox |
| `--surface-base` | `#191013` | Tarjeta TikTok |
| `--surface-raised` | `#1C1216` | Tarjeta de curso / PIN |
| `--surface-elevated` | `#25161B` | Gradiente de tarjeta de curso |
| `--surface-overlay` | `#140E10` | Cabecera y pie del bot |
| `--surface-drawer` | `#181013` | Drawer de carrito |
| `--surface-input` | `#110B0D` | Inputs y selects |
| `--surface-footer` | `#0D080A` | Footer |
| `--surface-toast` | `#1F1518` | Toast |

### Contraste medido

| Combinación | Ratio | Nivel |
|---|---:|---|
| `--text-main` sobre `--bg-deep` | 16.43:1 | AAA |
| `--cream-muted` sobre `--bg-deep` | 12.39:1 | AAA |
| `--gold` sobre `--bg-deep` | 9.29:1 | AAA |
| Blanco sobre `--primary` | 7.55:1 | AAA |
| Negro sobre `--gold` | 10.07:1 | AAA |
| `--text-muted` sobre `--bg-card` | 6.10:1 | AA/AAA |
| Crema sobre superficie social oscura | 12.39:1 | AAA |

**Regla social:** los botones de TikTok e Instagram usan superficie oscura y texto crema. El color de marca vive en el icono y el borde. Nunca texto blanco sobre `#FE2C55` (3.68:1) ni sobre el naranja del gradiente de Instagram (2.54:1).

---

## 3. Tipografía

- **Familia:** Plus Jakarta Sans (400, 500, 600, 700, 800).
- **Escala:**
  - Hero: 46 px desktop / 32 px tablet / 26 px móvil, peso 800, tracking -1.2 px.
  - Título de sección: 30 px, peso 800, tracking -0.6 px.
  - Título de tarjeta: 17–20 px, peso 700/800.
  - Cuerpo: 13–16 px, line-height 1.5.
  - Metadatos: 11–12.5 px, peso 600/700.
- **Precios:** misma familia, peso 800; no se carga una fuente mono adicional.

---

## 4. Espaciado, radios y sombras

- **Espaciado:** múltiplos de 4; secciones 54–64 px verticales; contenedor máximo 1200 px con 20 px laterales.
- **Radios:** `--radius-sm: 8px`, `--radius-md: 14px`, `--radius-lg: 20px`; píldoras 20–30 px solo en badges y botones sociales.
- **Sombras:** tarjetas en hover `0 12px 30px rgba(0,0,0,.5)`; primario `0 6px 20px var(--primary-glow)`; nunca una sombra dura única.
- **Bordes:** siempre semitransparentes (`--border-subtle`), nunca negro puro.

---

## 5. Componentes

### Botones

| Variante | Fondo | Texto | Uso |
|---|---|---|---|
| Primario | `--primary` | Blanco | Acción principal |
| Dorado | Gradiente `--gold` → `--gold-deep` | Negro | Catering / valor |
| Outline | Transparente | `--cream` | Acción terciaria |
| Social | `--bg-surface` | `--cream` | TikTok / Instagram |
| Peligro | Transparente | `--danger` | Eliminar |

Todos: altura mínima 44 px, `:focus-visible` con outline oro de 2 px, hover con elevación de 1–2 px.

### Tarjetas

- Fondo `--bg-card` o superficie tokenizada; borde `--border-subtle`; radio 14 px.
- Hover: elevación 4 px, borde `--border-strong` o acento de marca.
- Imagen: `object-fit: cover`, dimensiones declaradas, `loading="lazy"`, `decoding="async"`.

### Diálogos

- `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, foco inicial, trampa de Tab, Escape y retorno de foco.
- Fondo con blur y overlay oscuro; cierre por botón, backdrop y Escape.

### Galería TikTok

- Tarjetas 4:5 con `height: auto`; 3 columnas desktop, 2 tablet, 1 móvil.
- Sin captions duplicados: el texto vive dentro de la imagen y en el `alt`.
- El enlace externo va fuera del botón de reproducción; nunca se anidan controles.

---

## 6. Movimiento

- Transiciones 0.2–0.3 s, `ease-out`.
- Hover de tarjetas: `translateY(-3px/-4px)`; botones: `translateY(-1px/-2px)`.
- Respetar `prefers-reduced-motion: reduce` (desactivar animaciones y scroll suave).

---

## 7. Accesibilidad

- Un solo H1 por vista.
- Todos los campos con `label` visible o `sr-only` y `for`.
- Todos los controles con nombre accesible.
- Objetivos táctiles mínimos de 44×44 px.
- Imágenes de contenido con `alt`; decorativas con `alt=""` y `aria-hidden`.
- Contraste mínimo AA en texto; botones sociales sobre superficie oscura.
- Gate reproducible: `npm run audit:page` y `npm run verify`.

---

## 8. Prohibido

- Texto blanco sobre TikTok rosa o sobre el gradiente de Instagram.
- Emojis como iconos de beneficios cuando el sistema operativo no los renderiza (por ejemplo, banderas).
- Superficies nuevas con hex fuera de tokens.
- Captions duplicados debajo de imágenes que ya contienen el texto.
- Copy interno de clase, sprint o proyecto académico en la vitrina pública.
- Declarar “60 días” sin especificar que es en congelación.
