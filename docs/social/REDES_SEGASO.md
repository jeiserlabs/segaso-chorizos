# Redes oficiales de Segaso Chorizos — auditoría

> **Fecha:** 29-oct-2026.
> **Objetivo:** inventariar las cuentas reales, el contenido disponible y las limitaciones de acceso antes de producir el video promocional.

---

## 1. Cuentas oficiales

| Plataforma | Cuenta | Audiencia | Enlace | Acceso |
|---|---|---:|---|---|
| TikTok | `@segaso.chorizos` | 29.2K seguidores · 189.5K me gusta · 150 videos | https://www.tiktok.com/@segaso.chorizos | Público. Inventario completo de 150 videos. |
| Instagram principal | `@chorizos.segaso` | 173 seguidores · 15 posts | https://www.instagram.com/chorizos.segaso/ | Listado de perfil con HTTP 429; reels públicos individuales. |
| Instagram alterna | `@segaso.chorizos` | No visible por rate limit | https://www.instagram.com/segaso.chorizos/ | Cuenta alterna; reels públicos individuales. |
| Facebook | Segaso Chorizos | 124 seguidores · 1 visita | https://www.facebook.com/Segasochorizos/ | Página y listado con login; videos públicos individuales. |

**Hallazgo importante:** la cuenta principal de Instagram es `@chorizos.segaso`; `@segaso.chorizos` se presenta como cuenta alterna. La página web actual enlaza la alterna. Antes de publicar el video, conviene unificar el enlace del sitio y del material promocional hacia la cuenta principal, o enlazar ambas con una etiqueta clara.

---

## 2. Pilares de contenido

1. **Tradición e historia:** Harold, Giseth, la familia y el origen de Segaso.
2. **Producto y calidad:** carne de cerdo seleccionada, sin harinas ni extensores, empaque al vacío, 450 g netos.
3. **Asados y catering:** barril, choripanes, chicharrón, picadas, eventos.
4. **Recetas:** arepizza, cazuelita, domingo de asado, chimichurri.
5. **B2B:** restaurantes, puestos de comida, distribuidores.
6. **Detrás de cámaras:** producción, empaque, equipo.

---

## 3. Top 10 por views en TikTok

| # | ID | Título | Views | Estado local |
|---:|---|---|---:|---|
| 1 | `7137390171976109317` | Ella siempre preocupada cuando el papá se queja | 3.4M | Descargado |
| 2 | `7385581625276501254` | Aprendamos a hacer chorizos caseros | 711.6K | No descargado |
| 3 | `7057648885900086534` | ¿Sabías este dato? | 418.9K | No descargado |
| 4 | `7600166734527614228` | Chorizo de 24 cms | 342.3K | Solo audio (carrusel) |
| 5 | `7333765833010826501` | Trabajando todos los días con más ganas | 280.5K | Descargado |
| 6 | `6970150131517639941` | Cazuelita para el alma | 247.5K | No descargado |
| 7 | `7128213952567315718` | ¿Inicias tus asados con choripanes? | 233.1K | Descargado |
| 8 | `7332557830999919877` | Un poco de nuestra producción | 223.2K | Descargado |
| 9 | `7059445412544924933` | Picadita en casa para ver Netflix | 208.1K | Descargado |
| 10 | `6966719482140036358` | Arepizza con Segaso chorizos | 187.3K | Descargado |

El inventario completo (150 videos) está en `docs/social/TIKTOK_INVENTORY.md` y el JSON local en `media/social/tiktok/profile.json`.

---

## 4. Contenido descargado

| Plataforma | Videos | Keyframes | Notas |
|---|---:|---:|---|
| TikTok | 24 | 72 | Producto, producción, asado, recetas, B2B e historia. |
| Instagram | 2 | 6 | Reels públicos de receta y asado. |
| Facebook | 2 | 6 | Videos públicos de receta y reel. |
| Fotos | 5 | — | Post oficial de ingredientes, empaque y confianza. |

Los binarios viven en `media/social/` (gitignored). GitHub solo recibe el manifiesto y esta documentación.

---

## 5. Limitaciones de acceso

- **Instagram:** el listado de perfil devolvió HTTP 429. No se forzó una sesión ni se usaron cookies personales. Los reels públicos individuales sí se descargaron.
- **Facebook:** la página y su listado de medios exigen login. Se descargaron dos videos públicos con URL directa. Para el archivo completo, exportar desde Meta Business Suite o autorizar una sesión dedicada.
- **TikTok:** el perfil público se inventarió completo; el endpoint embed respondió “overload-protect” en una prueba, pero yt-dlp permitió descargar los videos seleccionados en H.264/AAC.

---

## 6. Recomendaciones para el video promocional

1. **Fuente principal:** TikTok, por volumen y variedad de producto, asado y producción.
2. **Refuerzo:** Instagram y Facebook para recetas y cocina.
3. **Seguridad de marca:** no usar primeros planos de menores de edad en el corte final; preferir producto, fuego, manos, adultos y mesa.
4. **Datos:** 450 g netos, 9 referencias, 60 días congelado, sin harinas ni extensores. No decir 500 g ni “100% carne magra”.
5. **CTA:** `@segaso.chorizos`, Envigado, Antioquia y WhatsApp 312 210 7979 (línea del empaque y los videos). La página usa 300 236 7180; unificar antes de publicar.
6. **Cuenta principal de Instagram:** `@chorizos.segaso`; la alterna es `@segaso.chorizos`.

---

## 7. Fuentes de la auditoría

- [TikTok @segaso.chorizos](https://www.tiktok.com/@segaso.chorizos)
- [Instagram @chorizos.segaso](https://www.instagram.com/chorizos.segaso/)
- [Instagram @segaso.chorizos](https://www.instagram.com/segaso.chorizos/)
- [Facebook Segaso Chorizos](https://www.facebook.com/Segasochorizos/)
- [Facebook Reels](https://www.facebook.com/Segasochorizos/reels/)
- [Video público de Facebook](https://www.facebook.com/Segasochorizos/videos/1274562314615791/)
- [Reel de Instagram: receta](https://www.instagram.com/reel/DMItIfmx4SH/)
- [Reel de Instagram: asado](https://www.instagram.com/reel/DMdG2I3Riac/)
