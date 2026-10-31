# Segaso — SSOT de rutas, repositorios y timeline única

> **Este archivo manda.** Si otro documento dice una ruta, un repo o una fecha distinta, se corrige aquí y se actualiza el otro.
> Última actualización: 31-oct-2026.

## 1. Identidad del proyecto

- **Proyecto:** Segaso Chorizos de Tradición S.A.S. — plataforma B2C, back office y contenido social.
- **Curso:** CESDE, Proyecto Empresarial Integrador, 2026-2.
- **Defensa:** sábado **14 de noviembre de 2026**, 10 minutos + 5 de preguntas.
- **Equipo (5):** Angelina Rojas, Brayan Álvarez, Edison Galván, María Vahos e Isabel Rey.
- **Producto:** 450 g netos / 5 unidades, 60 días congelado, sin harinas ni extensores.

## 2. Dónde se trabaja cada cosa

| Qué | Ruta local canónica | Repositorio / destino |
|---|---|---|
| Código, SQLite, tests, docs | `C:\PROYECTOS\Mis_Proyectos\Segaso` | https://github.com/jeiserlabs/segaso-chorizos |
| Página y back office | La misma ruta (`npm start` o `Iniciar Segaso.bat`) | `jeiserlabs/segaso-chorizos` |
| PDFs, presentación, fotos, capturas, video, ZIP | — | Drive: https://drive.google.com/drive/folders/1X1AMmMNQegvkJc3yDEgMCye039Eogx2Y |
| Documentos fuente `.md` | `Segaso\docs\` y `Segaso\docs\SUSTENTACION_2026\` | GitHub `segaso-chorizos` |
| Guías actualizadas del equipo | `Segaso\docs\guias_actualizadas\` | GitHub `segaso-chorizos` |

**No trabajar en** `Asistente_Personal\projects\segaso-app`: es una copia histórica del mismo código. La copia canónica es `C:\PROYECTOS\Mis_Proyectos\Segaso`.

## 3. Regla de trabajo (local → GitHub → Drive)

1. **Local:** editar en la ruta canónica.
2. **Verificar:** `npm run verify` (typecheck + 23 unitarias + E2E 5 fases + auditoría de página).
3. **GitHub:** commit + push a `jeiserlabs/segaso-chorizos`.
4. **Drive:** subir el PDF/HTML/foto/ZIP actualizado y verificar tamaño/md5.
5. **Timeline:** anotar el hito en la sección 5.

Un cambio no está terminado hasta que está en GitHub (texto/código) y en Drive (binarios), o se declara por qué no aplica.

## 4. Qué vive en cada lugar

| Tipo | Lugar | Nunca |
|---|---|---|
| Código, tests, docs `.md` | GitHub `segaso-chorizos` | En Drive como código suelto. |
| PDFs, HTML, fotos, videos, ZIP | Drive | En GitHub (Regla 29). |
| `.env`, `segaso.db`, medios originales | Local, gitignoreado | En GitHub. |
| Capturas y evidencias | Drive `05_CAPTURAS/` | En el Escritorio. |

## 5. Timeline única

| Fecha | Hito | Evidencia |
|---|---|---|
| 2026-10-08 | Primera versión de la landing, catálogo, carrito WhatsApp y back office. | Repo `segaso-chorizos` |
| 2026-10-23 | Deep loop audit del MVP; se corrige el seed y se ejecuta E2E. | `.odd/tasks/segaso_mvp_core.odd.md` |
| 2026-10-28 | Correcciones de seguridad: total calculado en servidor, XSS, stock y rate limit. | Commit `a6599f2` |
| 2026-10-29 | Paquete de 32 PDFs y video promocional de 30 s. | Drive `02_GUIAS_PDF/` y `06_VIDEO/` |
| 2026-10-30 | Guías actualizadas de los 5 integrantes. | `docs/guias_actualizadas/` |
| 2026-10-31 | Auditoría end-to-end: 23/23 unitarias, E2E 5 fases, PDFs regenerados, Drive creado y copia local unificada. | Este documento |
| **2026-11-14** | **Sustentación CESDE.** | — |
| Después del 14-nov | Publicar la app (si el equipo lo decide), separar `segaso.db` de producción y ampliar pruebas. | Pendiente |

## 6. Deuda declarada

| Punto | Estado | Dueño |
|---|---|---|
| El guion tiene 15 bloques, pero el deck HTML es un pitch de 10 diapositivas | Abierto: etiquetado en `01_PRESENTACION/README_PRESENTACION.md` | Brayan / Angelina |
| La app no está publicada en internet; corre en local | Abierto: la demo es local | Brayan |
| `segaso.db` local puede contener pedidos reales | Abierto: no se sube a Git ni a Drive; para la demo usar datos de ejemplo | Jeiser |
| La copia `projects/segaso-app` sigue dentro de LifeOS | Abierto: marcada como histórica; no se trabaja allí | Jeiser |

## 7. Contacto y material

- Carpeta de estudio: https://drive.google.com/drive/folders/1X1AMmMNQegvkJc3yDEgMCye039Eogx2Y
- Repo: https://github.com/jeiserlabs/segaso-chorizos
- Guía maestra: `02_GUIAS_PDF/01_GUIA_MAESTRA_DE_SUSTENTACION.pdf`
- Plan y roles: `02_GUIAS_PDF/08_CRONOGRAMA_Y_ROLES.pdf`
