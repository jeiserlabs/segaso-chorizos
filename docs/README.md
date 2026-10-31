# Documentación — Segaso Chorizos

Índice de la documentación técnica, académica y de contenido del proyecto.

> **SSOT de rutas, repos, Drive y timeline:** [`../SSOT_Y_TIMELINE.md`](../SSOT_Y_TIMELINE.md).
> **Formato:** el guion tiene 15 bloques orales; el pitch HTML es un pitch comercial de 10 diapositivas.

## Técnica

| Documento | Contenido |
|---|---|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Stack, componentes, datos, seguridad, rendimiento y FSM. |
| [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) | Paleta canónica, contraste, tipografía, componentes, movimiento y reglas de accesibilidad. |
| [API.md](API.md) | Endpoints, autenticación, ejemplos y errores. |
| [social/PRODUCT_PHOTOS.md](social/PRODUCT_PHOTOS.md) | Procedencia real de las 9 fotos de producto y cómo regenerarlas. |
| [../GEMINI.md](../GEMINI.md) | Contrato operativo para agentes de IA. |
| [../AGENTS.md](../AGENTS.md) | Reglas inmutables del repositorio. |

## Académica

| Documento | Contenido |
|---|---|
| [../PROYECTO_SEGASO_CHORIZOS_ENTREGABLE.md](../PROYECTO_SEGASO_CHORIZOS_ENTREGABLE.md) | Entregable CESDE: empresa, DOFA, PESTEL, EFI/EFE, arquitectura e impacto. |
| [SUSTENTACION_2026/01_GUIA_MAESTRA.md](SUSTENTACION_2026/01_GUIA_MAESTRA.md) | Flujo de sustentación, transiciones y banco de preguntas. |
| [SUSTENTACION_2026/02_GUIA_ANGELINA.md](SUSTENTACION_2026/02_GUIA_ANGELINA.md) | Guía de Angelina. |
| [SUSTENTACION_2026/03_GUIA_BRAYAN.md](SUSTENTACION_2026/03_GUIA_BRAYAN.md) | Guía de Brayan. |
| [SUSTENTACION_2026/04_GUIA_EDISON.md](SUSTENTACION_2026/04_GUIA_EDISON.md) | Guía de Edison. |
| [SUSTENTACION_2026/05_GUIA_MARIA.md](SUSTENTACION_2026/05_GUIA_MARIA.md) | Guía de María. |
| [SUSTENTACION_2026/06_GUIA_ISABEL.md](SUSTENTACION_2026/06_GUIA_ISABEL.md) | Guía de Isabel. |
| [SUSTENTACION_2026/07_DEMO_MVP.md](SUSTENTACION_2026/07_DEMO_MVP.md) | Demo paso a paso y plan B. |
| [SUSTENTACION_2026/08_CRONOGRAMA_Y_ROLES.md](SUSTENTACION_2026/08_CRONOGRAMA_Y_ROLES.md) | Roles, semanas y mapa de bloques del guion. |
| [SUSTENTACION_2026/09_ANEXO_MATRICES_EFI_EFE.md](SUSTENTACION_2026/09_ANEXO_MATRICES_EFI_EFE.md) | Tablas y cálculos EFI/EFE. |
| [SUSTENTACION_2026/00_PROMPT_GLM.md](SUSTENTACION_2026/00_PROMPT_GLM.md) | Prompt maestro para GLM/z.ai. |

## Guías actualizadas del equipo (octubre 2026)

| Documento | Contenido |
|---|---|
| [guias_actualizadas/00_GUIA_MAESTRA_SUSTENTACION.md](guias_actualizadas/00_GUIA_MAESTRA_SUSTENTACION.md) | Guion de 15 bloques, tiempos y respuestas. |
| [guias_actualizadas/01_GUIA_ANGELINA_ROJAS.md](guias_actualizadas/01_GUIA_ANGELINA_ROJAS.md) | Guía de Angelina. |
| [guias_actualizadas/02_GUIA_BRAYAN_ALVAREZ.md](guias_actualizadas/02_GUIA_BRAYAN_ALVAREZ.md) | Guía de Brayan. |
| [guias_actualizadas/03_GUIA_EDISON_GALVAN.md](guias_actualizadas/03_GUIA_EDISON_GALVAN.md) | Guía de Edison. |
| [guias_actualizadas/04_GUIA_MARIA_VAHOS.md](guias_actualizadas/04_GUIA_MARIA_VAHOS.md) | Guía de María. |
| [guias_actualizadas/05_GUIA_ISABEL_REY.md](guias_actualizadas/05_GUIA_ISABEL_REY.md) | Guía de Isabel. |

Estas son las guías fuente que alimentan los PDFs 01–06 del paquete de Drive. Los PDFs se regeneran; no se editan a mano.

## Redes y contenido

| Documento | Contenido |
|---|---|
| [social/REDES_SEGASO.md](social/REDES_SEGASO.md) | Auditoría de TikTok, Instagram y Facebook. |
| [social/MEDIA_MANIFEST.md](social/MEDIA_MANIFEST.md) | Biblioteca audiovisual descargada y limitaciones. |
| [social/TIKTOK_INVENTORY.md](social/TIKTOK_INVENTORY.md) | Top 40 por views + 20 recientes. |
| [promo/README_PROMO.md](promo/README_PROMO.md) | Kit del video promocional. |
| [promo/PROMPT_GEMINI_VIDEO.md](promo/PROMPT_GEMINI_VIDEO.md) | Prompts para Gemini/Veo y edición. |
| [promo/STORYBOARD_30S.md](promo/STORYBOARD_30S.md) | Guion visual de 30 segundos. |

## Calidad

| Documento | Contenido |
|---|---|
| [../.odd/tasks/segaso_calidad_pagina.odd.md](../.odd/tasks/segaso_calidad_pagina.odd.md) | ODD de la auditoría de página, fotos reales, accesibilidad y performance. |
| `npm run audit:page` | Gate reproducible de peso, imágenes, metadatos, accesibilidad, galería y superficie HTTP. |
| `npm run verify` | Typecheck + unitarias + E2E 5 fases + auditoría de página. |

## Legado

- `entregables/` — brochure y entregable académico en HTML.
- `presentacion_y_diagramas/` — pitch comercial y diagramas interactivos.
- `diagramas/` — arquitectura D2/HTML.
- `ESCANER_*.md` — transcripciones de planeación CESDE.

## Nota sobre binarios

Las fotos, videos, capturas y bases de datos no se versionan en Git. Viven en `videos/`, `media/`, `docs/SUSTENTACION_2026/CAPTURAS/` o en el paquete local/Drive. Los documentos de este repositorio explican cómo regenerarlos o dónde encontrarlos.
