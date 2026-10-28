# [ODD] Segaso Chorizos — Plataforma E-Commerce & Back Office Harold (Envigado)

> **Metodología:** ODD (One-Document-Driven Development / Gentle-AI).  
> **Abolición SDD:** Sustituye la burocracia documental de SDD por este único documento vivo y atómico.  
> **Proyecto:** Segaso Chorizos de Tradición (Harold García · Envigado)  
> **Fecha:** 2026-10-23 | **Entrega CESDE:** Octubre/Noviembre 2026

---

## 1. Objetivo y Problema (Why & What)
- **Problema:** Segaso operaba su venta artesanal de chorizos sin canal digital propio ni trazabilidad en tiempo real de inventarios ni de pedidos, dependiendo de chats dispersos de WhatsApp sin confirmación inmediata ni cálculo de catering ni panel de control para Harold.
- **Objetivo:** Disponer de una plataforma web integral ($0 dependencias externas pesadas) con:
  1. Vitrina B2C con catálogo oficial de 9 referencias, lightbox interactivo, cálculo de catering para eventos al barril y carrito reactivo con cupón WhatsApp directo.
  2. Back Office gerencial protegido con JWT HS256 + scrypt (RFC 7519) con KPIs en tiempo real, gestión de estados de pedidos (FSM) e inventario editable.

---

## 2. Scope Rule Estricto (Gentleman Scope)
- **Touchables (Archivos Permitidos):**
  - `server.js` (HTTP server nativo + router + rate limiting + static)
  - `db.js` (SQLite WAL con better-sqlite3 + queries parametrizadas)
  - `auth.js` (JWT y scrypt nativos de node:crypto)
  - `index.html` (Vitrina B2C gourmet con diseño responsive oscuro)
  - `admin.html` (Panel Back Office privado)
  - `src/domain/*.ts` (FSM de pedidos, cálculo de catering, métricas LTV)
  - `src/schemas/*.ts` (contratos Zod v4)
  - `src/types/*.ts` (tipos TypeScript)
  - `tests/*.ts`, `tests/*.js` (unit tests y E2E Playwright)
  - `.odd/tasks/*` (seguimiento vivo)
- **Forbidden:**
  - Agregar frameworks pesados de backend (Express/Nest/Fastify) innecesarios que violen la regla de $0 dependencias y stdlib Node.js.
  - Hardcodear credenciales en código (prohibido por R3).

---

## 3. Guardrails Anti-Sobreingeniería (Anti-Overengineering)
- **$0 Dependencias Cloud:** SQLite local con modo WAL (`segaso.db`). Sin Postgres ni servicios externos pagados.
- **Nativo Node.js:** Auth con `node:crypto` (`scryptSync` + `timingSafeEqual` + HMAC-SHA256). Cero librerías npm de autenticación vulnerables.
- **Fail-Closed de Seguridad:** El servidor arroja Error fatal si `JWT_SECRET` no está presente en el entorno.

---

## 4. Tareas Atómicas Secuenciales (Tasks)
- [x] Tarea 1: Base de datos SQLite normalizada (`db.js`) con catálogo oficial de 9 referencias y pedidos.
- [x] Tarea 2: Módulo de autenticación seguro (`auth.js`) con hash scrypt y firma JWT.
- [x] Tarea 3: Servidor HTTP nativo con rate limiting (5 intentos / 5 min) y endpoints REST (`server.js`).
- [x] Tarea 4: Vitrina B2C con UI moderna, Bento grid, Lightbox, Carrito y Descuento WhatsApp (`index.html`).
- [x] Tarea 5: Back Office gerencial para Harold con KPIs, FSM y control de stock (`admin.html`).
- [x] Tarea 6: Contratos Zod v4 y lógica de dominio con tests unitarios (`tests/segaso_domain.test.ts` 13/13 PASS).
- [x] Tarea 7: Fix de contraseña seed (`[seed temporal rotada 28-oct-2026]`) y suite E2E Playwright completa (`tests/e2e_segaso_playwright.js` 100% PASS).
- [x] Tarea 8: Script de arranque sin configuración previa (`Iniciar Segaso.bat`).

---

## 5. Acceptance Criteria & Oráculo Determinista
- Typecheck: `npm run typecheck` $\rightarrow$ Exit 0 (0 errores de tipos).
- Tests de Dominio: `npm test` $\rightarrow$ 13/13 PASS.
- E2E Playwright: `npm run test:e2e` $\rightarrow$ "¡AUDITORÍA PLAYWRIGHT 100% EXITOSA! MVP Funcional y Estable".
- Calidad: 0 errores de consola en browser (Storefront y Back Office).

---

## 6. Baseline de Errores Conocidos (Known Baseline)
- Cero errores activos. El bug de desajuste de password en seed (`[seed temporal rotada 28-oct-2026]`) fue corregido y verificado en tiempo de ejecución.

---

## 7. Progreso y Evidencia In-Place
- **2026-10-23:** Deep loop audit completado. Bug de seed resuelto. Suite E2E Playwright ejecutada con éxito en 4 fases (Catálogo, Carrito, Back Office y Consola).
- **2026-10-28:** Re-verificación completa: typecheck 0 errores, 13/13 unit, E2E 4 fases 100% (catálogo 9/9, carrito, backoffice, consola limpia). Se limpiaron 5 pedidos de prueba de la SQLite; quedan 3 pedidos reales. Pendiente: repo público `segaso-chorizos` desactualizado.
