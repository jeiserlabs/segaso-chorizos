# Kit de video promocional — Segaso Chorizos

> **Objetivo:** producir un video promocional profesional de 30 segundos con contenido audiovisual real de las cuentas oficiales de Segaso, usando Gemini/Veo como motor de generación y un editor para el ensamble final.

---

## 1. Qué contiene el kit

| Componente | Contenido | Ubicación local |
|---|---|---|
| Biblioteca TikTok | 24 videos reales, 72 keyframes | `media/social/tiktok/` |
| Biblioteca Instagram | 2 reels públicos, 6 keyframes | `media/social/instagram/` |
| Biblioteca Facebook | 2 videos públicos, 6 keyframes | `media/social/facebook/` |
| Fotos de marca | 5 fotos del post oficial | `media/social/tiktok/photos/` |
| Contact sheets | 3 hojas de contacto para revisión rápida | `media/social/*/contact_sheet.jpg` |
| Manifiesto | IDs, títulos, views, duración, archivos y keyframes | `media/social/manifest.json` |
| Storyboard | Guion visual de 30 s, texto y voz en off | `docs/promo/STORYBOARD_30S.md` |
| Prompt Gemini/Veo | Prompt maestro, prompts por escena y prompt de análisis | `docs/promo/PROMPT_GEMINI_VIDEO.md` |
| Subtítulos | SRT de 30 s | `docs/promo/VOICEOVER_30S.srt` |
| Logo | Logo corporativo SVG | `logo_segaso.svg` |

Los binarios no se versionan en GitHub. El paquete de entrega en el Escritorio incluye una selección de clips, keyframes y fotos para subir a Gemini.

---

## 2. Cómo usarlo con Gemini

### Paso 1 — Análisis
1. Sube a Gemini los 3 contact sheets y los clips seleccionados.
2. Pega el **prompt de análisis** de `PROMPT_GEMINI_VIDEO.md`.
3. Pide que elija 8 planos, con timecode y motivo. Debe descartar tomas con menores o comida poco apetitosa.

### Paso 2 — Generación por escena
1. Genera cada escena por separado con Veo (image-to-video) usando el keyframe indicado.
2. No pidas un video de 30 s en una sola generación: la consistencia de producto se pierde.
3. Respeta la referencia real del empaque y del producto; no dejes que la IA invente otra marca.

### Paso 3 — Ensamble
1. Une las escenas en un editor (CapCut, Premiere o similar).
2. Agrega la voz en off, la música y los textos del storyboard.
3. Usa la captura real de la página para el plano digital; no generes una interfaz falsa.
4. Exporta 9:16 y 16:9.

### Paso 4 — Control
- Verifica que el empaque diga 450 g y que el producto no haya cambiado de forma.
- Revisa que no aparezcan menores de edad en el corte final.
- Revisa que no haya texto generado por IA con errores.
- Exporta una versión con subtítulos quemados y otra con SRT separado.

---

## 3. Selección recomendada para el corte de 30 s

| Escena | Clip / keyframe | Uso |
|---|---|---|
| 1. Hook | `7137390171976109317` / `7128213952567315718_01.jpg` | Fuego, parrilla, chorizo. |
| 2. Origen | `7332557830999919877` / `7647508434874649877_02.jpg` | Producción y carne. |
| 3. Empaque | `photos/photo_01.jpg` / `photos/photo_03.jpg` | Rótulo real, 450 g. |
| 4. Héroe | `7470531437788155141_01.jpg` | Choripanes con chimichurri. |
| 5. Textura | `7128213952567315718_03.jpg` / `7470531437788155141_03.jpg` | Corte y close-up. |
| 6. Mesa | `7137390171976109317_02.jpg` / `7674733063032540437_02.jpg` | Chicharrón, plátano, familia (solo comida/manos). |
| 7. Digital | `CAPTURAS/01_vitrina.png` / `03_carrito.png` | UI real, no generada. |
| 8. Cierre | `logo_segaso.svg` + `photos/photo_05.jpg` | Marca y CTA. |

Los archivos `CAPTURAS/` están en el paquete local de sustentación; no se versionan en Git.

---

## 4. Especificaciones de entrega

- **Master vertical:** 1080 × 1920, 30 s, 24/30 fps, H.264, AAC, 9:16.
- **Versión horizontal:** 1920 × 1080, 30 s, 16:9.
- **Corte corto:** 15 s para Stories/Reels.
- **Bumper:** 6 s para YouTube.
- **Subtítulos:** SRT + versión con subtítulos quemados.
- **Miniatura:** 1080 × 1920 con producto y logo.
- **Audio:** voz en off clara, música sin copyright, sizzle de parrilla.

---

## 5. Reglas de contenido

- Producto: **450 g netos / 5 unidades**. No decir 500 g.
- Ingredientes: **carne de cerdo seleccionada, sin harinas ni extensores**. No decir “100% carne magra”.
- Precios: no inventar; si se muestran, usar la lista oficial 2026.
- Backoffice: no decir “bot 24/7”; la conversación la atiende Harold.
- CTA: `@segaso.chorizos`, Envigado, Antioquia, WhatsApp 312 210 7979 (línea del empaque).
- La página usa el WhatsApp 300 236 7180; unificar antes de publicar.
- No usar música, fotos o videos de terceros sin licencia.
- No usar primeros planos de menores de edad sin autorización expresa.

---

## 6. Limitaciones de la fuente

- TikTok: 150 videos inventariados; 24 descargados por selección editorial.
- Instagram: listado de perfil con HTTP 429; 2 reels públicos descargados.
- Facebook: página con login; 2 videos públicos descargados.
- Si se necesita el archivo completo de Instagram/Facebook, exportarlo desde Meta Business Suite o autorizar una sesión dedicada.

---

## 7. Derechos

El contenido pertenece a Segaso Chorizos. El uso está limitado a la promoción de la empresa y al proyecto académico. No se revende ni se atribuye a terceros.
