# [ODD] Sustentación Segaso Chorizos — 14-nov-2026

> **Metodología:** ODD (One-Document-Driven Development / Gentle-AI).
> **Proyecto:** Segaso Chorizos de Tradición · CESDE 2026.
> **Equipo:** Angelina Rojas · Brayan Álvarez · Edison Galván · María Vahos Villa · Isabel Rey.
> **Fecha:** 2026-10-29 | **Estado:** En ejecución.

---

## 1. Objetivo y Problema (Why & What)

- **Problema:** La sustentación del 14-nov tiene que mostrar la empresa real, el MVP funcionando y una explicación técnica defendible. El material actual está desalineado: el documento académico habla de PIN 1234 y localStorage, la app real usa JWT + scrypt + SQLite WAL; el rótulo del producto dice 450 g y los documentos dicen ~500 g; la EFE del documento suma 2.70 pero el deck anterior usó 2.80 y no hay tabla EFI en disco; la sección TikTok de la página apunta a imágenes que no existen.
- **Objetivo:** Producir un paquete de sustentación coherente y verificable:
  1. Prompt maestro para GLM/z.ai con el contenido exacto de 15 diapositivas.
  2. Una guía de exposición por estudiante (5) y una guía maestra con el flujo de 5 minutos.
  3. Página con las 5 fotos reales del TikTok, portadas de videos y estadísticas reales.
  4. Documento académico alineado con la app real (JWT/SQLite) y con el rótulo de 450 g.
  5. Matrices EFI/EFE recalculadas y anexo defendible; en las diapositivas solo van los resultados.
  6. Demo MVP con la app real Node + SQLite + JWT y respaldo en capturas.

---

## 2. Scope Rule Estricto (Gentleman Scope)

- **Touchables:**
  - `docs/SUSTENTACION_2026/**` (nuevo paquete textual).
  - `scripts/fetch_tiktok_assets.js` (nuevo, descarga assets locales).
  - `index.html` (sección TikTok, galería, 450 g, claim de ingredientes).
  - `PROYECTO_SEGASO_CHORIZOS_ENTREGABLE.md` (arquitectura, equipo, 450 g, anexo EFI/EFE).
  - `README.md`, `scripts/guias_data.js`, `docs/entregables/**`, `docs/diagramas/**`, `docs/presentacion_y_diagramas/**` (solo corrección 450 g y claims).
  - `.odd/tasks/segaso_sustentacion.odd.md` (este documento).
- **Forbidden:**
  - Cambiar precios, catálogo, lógica de negocio, auth o esquema SQLite sin confirmación.
  - Inventar clientes, ventas, ahorros o métricas no medidas.
  - Commitear binarios, imágenes, videos o ZIP (Regla 29).
  - Hardcodear credenciales o secretos en documentos públicos.
  - Usar PIN 1234 o localStorage como arquitectura vigente.

---

## 3. Guardrails Anti-Sobreingeniería

- **$0 costo:** descargas y renderizado con Node/Playwright locales; cero SaaS.
- **Datos duros:** cada cifra sale del documento, del rótulo real, de la app o de una prueba ejecutada. Las estimaciones se marcan como “estimado”.
- **Una sola fuente:** este ODD + `docs/SUSTENTACION_2026/`; no duplicar guiones en otros archivos.
- **Assets locales:** `videos/` está gitignored; el script re-descarga si las URLs de TikTok expiran.
- **Demo fail-safe:** app real + capturas de respaldo; no depender de internet para la vitrina ni el backoffice.

---

## 4. Tareas Atómicas Secuenciales

- [x] **T1:** ODD inicializado con decisiones del usuario (recalcular EFI/EFE, 450 g, app real, PESTEL tecnológica).
- [x] **T2:** Recalcular EFI/EFE y escribir `09_ANEXO_MATRICES_EFI_EFE.md`.
- [x] **T3:** Unificar 450 g en app, README, documento, brochure, guías y diagramas. No tocar precios.
- [x] **T4:** Crear `scripts/fetch_tiktok_assets.js` y descargar 5 fotos + 4 portadas + 4 videos 720p.
- [x] **T5:** Escribir `00_PROMPT_GLM.md`, `01_GUIA_MAESTRA.md`, 5 guías individuales, `07_DEMO_MVP.md` y `08_CRONOGRAMA_Y_ROLES.md`.
- [x] **T6:** Ajustar `index.html`: galería real, portadas, stats 29.2K/189.5K/150, fallback de video, 450 g.
- [x] **T7:** Alinear `PROYECTO_SEGASO_CHORIZOS_ENTREGABLE.md` a JWT/scrypt/SQLite, equipo de 5 y 450 g.
- [x] **T8:** Verificar typecheck, 23/23 tests, E2E 5 fases, demo local y consola limpia.
- [x] **T9:** Empaquetar ZIP local en Desktop/Segaso y dejar backup.

---

## 5. Acceptance Criteria & Oráculo Determinista

- `npm run typecheck` → Exit 0.
- `npm test` → 23/23 PASS.
- `npm run test:e2e` → 5 fases, 0 errores críticos de consola.
- `index.html` muestra las 5 fotos reales y las 4 portadas; ninguna ruta `videos/` rota.
- El documento y las guías no presentan PIN 1234, localStorage ni 500 g como arquitectura o dato vigente.
- EFI/EFE: tablas con pesos que suman 100%, cálculos verificables y lectura de resultados.
- Demo: vitrina, carrito, login de Harold, KPIs, FSM e inventario funcionando en local.
- Paquete local con prompt, 5 guías, runbook, anexo e imágenes.

---

## 6. Baseline de Errores Conocidos

- La sección TikTok de `index.html` referencia `videos/thumb_1.jpg` … `thumb_4.jpg`, que no existen en disco.
- `PROYECTO_SEGASO_CHORIZOS_ENTREGABLE.md` describe PIN 1234 y localStorage; la app real usa JWT HS256 + scrypt + SQLite WAL.
- `guias_data.js` repite PIN 1234 y ~500 g.
- La EFE del documento suma 2.70; el checkpoint del 15-oct menciona 2.80 y una EFI 2.50 sin tabla.
- El rótulo real dice 450 g netos / 5 unidades; el material dice ~500 g.

---

## 7. Progreso y Evidencia In-Place

- **2026-10-29:** ODD creado. Decisiones del usuario: recalcular EFI/EFE, unificar 450 g, demo con app real Node + SQLite + JWT, PESTEL tecnológica. TikTok scrapeado: post de 5 fotos, 29.2K seguidores, 189.5K me gusta, 150 videos; URLs de CDN expiran el 31-oct-2026.
- **2026-10-29:** EFI/EFE recalculadas: EFI 2.49 (neutra) y EFE 2.70 (favorable), con tablas verificables en `09_ANEXO_MATRICES_EFI_EFE.md`.
- **2026-10-29:** 450 g netos unificado en 15 archivos (65 reemplazos); claims “100% magro” corregidos a “cerdo seleccionado / sin harinas ni extensores”. Precios intactos.
- **2026-10-29:** Assets reales descargados: 5 fotos 1080×1350, 4 portadas y 4 videos H.264/AAC (576×1024, 27–179 s). `videos/tiktok_manifest.json` con cuenta y fuentes. `thumb_1` corregida con el cover real.
- **2026-10-29:** Paquete textual creado: prompt GLM de 15 diapositivas, guía maestra, 5 guías individuales, cronograma y runbook de demo.
- **2026-10-29:** Página ajustada: galería “Confianza y trazabilidad” con 5 fotos, stats 29.2K/189.5K/150, fallback de video, teléfono de 10 dígitos, código de pedido unificado con SQLite y claims alineados al rótulo.
- **2026-10-29:** Documento académico alineado: objetivo literal, JWT/scrypt/SQLite, equipo de 5, EFI/EFE y 450 g. Se eliminó la guía oral con PIN 1234.
- **2026-10-29:** Backoffice endurecido: el endpoint PATCH valida la FSM y responde 400 ante saltos inválidos; el panel muestra el error. E2E actualizado a confirmado → preparando.
- **2026-10-29:** Verificación: `npm run typecheck` OK; 23/23 tests; E2E 5 fases OK; FSM inválida 400; capturas reales en `docs/SUSTENTACION_2026/CAPTURAS/`. Base `segaso.db` restaurada a sus 3 pedidos reales y stock original.
- **2026-10-29:** Paquete final en `C:\Users\dev\Desktop\Segaso`: 10 documentos, 5 fotos, 4 portadas, 7 capturas, LEEME y ZIP de 12 MB (27 archivos). Prompt GLM listo para z.ai; guías por expositor y demo runbook incluidos.
