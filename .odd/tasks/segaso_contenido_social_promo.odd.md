# [ODD] Contenido social, video promocional y repositorio profesional

> **Metodología:** ODD (One-Document-Driven Development / Gentle-AI).
> **Proyecto:** Segaso Chorizos de Tradición · CESDE 2026.
> **Fecha:** 2026-10-29 | **Estado:** Completado.
> **Alcance:** auditoría de redes, biblioteca audiovisual local, kit Gemini/Veo, organización del repo y publicación en GitHub.

---

## 1. Objetivo y problema

- **Problema:** el repo `jeiserlabs/segaso-chorizos` tenía 25 archivos, documentación desalineada (500 g, PIN/localStorage, bot 24/7) y no existía una biblioteca audiovisual organizada de las cuentas oficiales. El contenido para un video promocional estaba disperso entre TikTok, Instagram y Facebook, sin manifiesto ni criterios de uso.
- **Objetivo:** auditar las cuentas oficiales, descargar una biblioteca real, preparar un kit de video para Gemini/Veo, profesionalizar el repositorio y publicar los cambios con tests en verde.

---

## 2. Scope Rule

- **Touchables:**
  - `docs/social/**`, `docs/promo/**`, `docs/README.md`, `docs/ARCHITECTURE.md`, `docs/API.md`.
  - `scripts/fetch_tiktok_assets.js`, `scripts/social_manifest.js`.
  - `README.md`, `AGENTS.md`, `GEMINI.md`, `.gitignore`, `.gitattributes`, `package.json`.
  - `index.html`, `admin.html`, `server.js`, `tests/e2e_segaso_playwright.js`.
  - `media/social/**` (local, gitignored).
- **Forbidden:**
  - Subir fotos, videos, capturas, bases, `.env` o ZIP a Git.
  - Usar cuentas no oficiales o primeros planos de menores sin autorización.
  - Afirmar 500 g, “100% carne magra”, “bot 24/7” o métricas no medidas.
  - Inventar precios, ventas, clientes o audiencia.

---

## 3. Guardrails

- **Cero binarios en GitHub:** la biblioteca vive en `media/social/` y en el Escritorio; el repo recibe manifiestos y documentación.
- **Cero secretos:** no se copió `.env`; el token del `.env` estaba vencido y se usó la sesión válida de `gh`, sin exponerla.
- **Contenido real:** solo cuentas oficiales; los títulos, views y URLs salen del perfil público.
- **Seguridad de marca:** no usar menores en el corte final; no generar UI falsa; conservar el rótulo real.
- **Trazabilidad:** cada asset tiene ID, plataforma, URL, duración, views (cuando existe), archivo y keyframes.

---

## 4. Tareas

- [x] **T1:** Verificar repo y credenciales. `jeiserlabs/segaso-chorizos` existe, es público y `gh` está autenticado como `jeiserlabs`. El `GITHUB_API_KEY` del `.env` devolvió 401; no se usó.
- [x] **T2:** Clonar y auditar el repo: 25 archivos, sin binarios ni secretos estrictos; documentación desalineada.
- [x] **T3:** Inventariar TikTok (150 videos) y descargar 24 videos H.264/AAC; 2 reels de Instagram; 2 videos públicos de Facebook; 5 fotos; 84 keyframes; 3 contact sheets.
- [x] **T4:** Generar `media/social/manifest.json` y `docs/social/{REDES_SEGASO,MEDIA_MANIFEST,TIKTOK_INVENTORY}.md`.
- [x] **T5:** Crear `docs/promo/{README_PROMO,PROMPT_GEMINI_VIDEO,STORYBOARD_30S,VOICEOVER_30S.srt}`.
- [x] **T6:** Profesionalizar repo: README, arquitectura, API, docs index, `.gitattributes`, `.gitignore`, logo SVG, rutas relativas y fallback de imágenes legacy.
- [x] **T7:** Verificar: typecheck OK; 13/13 tests; E2E de 4 fases; FSM inválida 400; base restaurada con 3 pedidos reales.
- [x] **T8:** Commit `5d9c4b4` y push a `main`; paquete `Desktop/Segaso/PROMO_VIDEO` (47 MB, 31 archivos) y biblioteca completa `Desktop/Segaso/BIBLIOTECA_MEDIA` (242 MB).

---

## 5. Acceptance Criteria

- 24 TikTok + 2 Instagram + 2 Facebook + 5 fotos + 84 keyframes + 3 contact sheets.
- Manifiesto con IDs, URLs, títulos, duración, views, archivos y keyframes.
- Prompt de análisis, prompts por escena para Veo, voz en off, SRT y negative prompt.
- Repo en GitHub con README, arquitectura, API y docs de redes/promo.
- Tests: `npm run typecheck`, `npm test` (13/13) y `npm run test:e2e` (4 fases).
- Sin binarios, `.env`, bases ni secretos en Git.
- Base `segaso.db` restaurada con 3 pedidos reales.

---

## 6. Baseline y limitaciones

- Instagram devolvió HTTP 429 al listar perfiles; no se forzó sesión ni cookies personales. Se descargaron reels públicos individuales.
- Facebook exige login para listar la página; solo se descargaron videos públicos con URL directa.
- TikTok respondió “overload-protect” en una prueba de embed; yt-dlp permitió descargar los videos seleccionados.
- La cuenta principal de Instagram es `@chorizos.segaso`; `@segaso.chorizos` es alterna. La web enlaza la alterna y debe unificarse.
- La página usa WhatsApp 300 236 7180; el empaque/redes usan 312 210 7979. Unificar antes de publicar.

---

## 7. Progreso

- **2026-10-29:** Repo clonado y auditado; sin secretos ni binarios. Se detectó documentación con 500 g/PIN/bot 24/7.
- **2026-10-29:** TikTok 150 inventariados; 24 videos descargados; Instagram 2 reels; Facebook 2 videos; 84 keyframes y 3 contact sheets.
- **2026-10-29:** Manifiesto, auditoría social y kit Gemini/Veo creados; README/arquitectura/API y docs index.
- **2026-10-29:** Tests en verde; FSM inválida 400; commit `5d9c4b4` publicado.
- **2026-10-29:** Paquete curado en `Desktop/Segaso/PROMO_VIDEO` y biblioteca completa en `Desktop/Segaso/BIBLIOTECA_MEDIA`.
