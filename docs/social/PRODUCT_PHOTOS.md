# Fotos reales de producto — Segaso Chorizos

> **Regla:** ninguna foto de producto es generada por IA. Todas salen de videos, carruseles o empaques reales de Segaso Chorizos (`@segaso.chorizos`).
> Los binarios viven en `img/products/*.webp` y están gitignoreados (Regla 29: GitHub solo texto/código). En un clon limpio la tarjeta cae al ícono de respaldo.

## Mapa SKU → fuente

| SKU | Archivo | Fuente real | Recorte | Nota |
|---|---|---|---|---|
| `caserito` | `img/products/caserito.webp` | TikTok `7537739708575599928` — "Así suena la buena vida… chorizos premium" | keyframe 01, 576×576 | Chorizos frescos en plato, producto real sin texto |
| `antioqueno` | `img/products/antioqueno.webp` | TikTok `7080148934731058437` — "¿Antioqueño o Santarosano?" | keyframe 02, 576×576 | Chorizo asado rebanado |
| `santarrosano` | `img/products/santarrosano.webp` | Carrusel TikTok, foto 03 — "Siempre empieza por los ingredientes" | 760×760 desde (160, 230) | Empaque oficial con etiqueta `CHORIZO SANTARROSANO`, 450 g / 5 unidades |
| `tocineta` | `img/products/tocineta.webp` | TikTok `7332557830999919877` — "Un poco de nuestra producción" | keyframe 03, 576×576 | Chorizo crudo con veta de tocineta; no hay empaque aislado |
| `parrillero` | `img/products/parrillero.webp` | TikTok `7080148934731058437` | keyframe 01, 576×576 | Chorizo a la parrilla con pinzas y rebanadas |
| `picante` | `img/products/picante.webp` | Carrusel TikTok, foto 05 — "La confianza empieza con saber qué eliges" | 800×800 desde (140, 250) | Empaque oficial con etiqueta `CHORIZO PICANTE`, 450 g / 5 unidades |
| `argentino` | `img/products/argentino.webp` | TikTok `7128213952567315718` — "¿Inicias tus asados con choripanes?" | keyframe 02, 576×576 | Choripán real con chimichurri; no hay foto aislada del empaque Argentino |
| `morcilla` | `img/products/morcilla.webp` | TikTok `7216504522657746181` — "Del 1 al 10, ¿cuánto te gusta la morcilla?" | frame a 6 s, 720×720 | Morcilla enrollada en parrilla; texto del video fuera del recorte |
| `chimichurri` | `img/products/chimichurri.webp` | TikTok `7470531437788155141` — "Asados en casa" | keyframe 01, 576×576 | Choripanes con chimichurri verde; producto en uso |

## Regenerar

Requisitos: `ffmpeg` en el PATH y los medios locales (`videos/` y `media/`) presentes.

```bash
npm run media:products
```

El script `scripts/build_product_photos.js` valida que cada fuente exista y falla si falta: no inventa ni sustituye imágenes.

## Tratamiento aplicado

- Recorte cuadrado con foco en el producto.
- Escalado Lanczos a 900×900.
- WebP calidad 82, sin audio, ~40–110 KB por archivo (644 KB total para las 9 referencias).

## Fuentes que no se usaron

- No se encontró una foto aislada del empaque de **Tocineta**, **Parrillero** ni **Argentino**; se usan fotos reales del producto en preparación/uso y se declara en esta tabla.
- La foto de **Morcilla** proviene de un video adicional descargado el 2026-10-29 y su keyframe quedó en `media/social/tiktok/keyframes/7216504522657746181_06.jpg`.
