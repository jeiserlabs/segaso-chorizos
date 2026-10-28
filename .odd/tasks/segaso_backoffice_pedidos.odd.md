# [ODD] Segaso Back Office & FSM de Pedidos (Harold García)

> **Metodología:** ODD (One-Document-Driven Development / Gentle-AI).  
> **Abolición SDD:** Sustituye la burocracia de especificaciones multi-documento por este único documento vivo.  
> **Proyecto:** Segaso Chorizos de Tradición · Back Office & Control de Producción  
> **Fecha:** 2026-10-25 | **Estado:** Operativo y Testeado

---

## 1. Objetivo y Problema (Why & What)
- **Problema:** Harold García administraba los pedidos de chorizos y eventos de catering de forma informal vía chats dispersos de WhatsApp, generando descontrol en el stock de producto terminado, incertidumbre sobre pagos recibidos y falta de visibilidad del LTV de clientes recurrentes.
- **Objetivo:** Disponer de un panel gerencial privado y determinista (`admin.html` + `server.js`):
  1. Autenticación robusta basada en JWT HS256 firmado con `node:crypto` y hash scrypt (RFC 7519).
  2. Máquina de estados finitos (FSM) estricta para pedidos: `pendiente` ➔ `confirmado` ➔ `en_preparacion` ➔ `despachado` ➔ `entregado` (o `cancelado`).
  3. Dashboard reactivo con KPIs en tiempo real (ingresos totales, ticket promedio, clientes únicos y producto más vendido) con actualización directa de stock.

---

## 2. Scope Rule Estricto (Gentleman Scope)
- **Touchables:**
  - `admin.html`
  - `auth.js`
  - `db.js`
  - `src/domain/orders_fsm.ts`
  - `tests/*.ts`, `tests/*.js`
  - `.odd/tasks/*`
- **Forbidden:**
  - Modificar precios de catálogo sin confirmación de Harold.
  - Hardcodear credenciales o tokens en archivos públicos.

---

## 3. Guardrails Anti-Sobreingeniería (Anti-Overengineering)
- **Cero Dependencias Auth Externas:** Todo el manejo criptográfico utiliza la biblioteca nativa `node:crypto`.
- **Transiciones FSM Validadas:** Prohibido saltar de `pendiente` directamente a `entregado` sin confirmación previa de pago/preparación.

---

## 4. Tareas Atómicas Secuenciales (Tasks)
- [x] **T1: FSM de Pedidos:** Implementación de transiciones válidas en `src/domain/orders_fsm.ts`.
- [x] **T2: Back Office UI:** Panel responsive en `admin.html` con tarjetas Bento, filtros de pedidos y modal de edición.
- [x] **T3: Endpoints de Administración:** Rutas protegidas `/api/admin/*` con middleware JWT.
- [x] **T4: Suite de Pruebas Unitarias:** 13/13 tests de dominio en verde (`npm test`).
- [x] **T5: Auditoría Playwright E2E:** 4 fases completadas exitosamente (`npm run test:e2e`).

---

## 5. Acceptance Criteria & Oráculo Determinista
- **Tests de Dominio:** `npm test` ➔ 13/13 PASS.
- **E2E Playwright:** `npm run test:e2e` ➔ Exit code 0 ("¡AUDITORÍA PLAYWRIGHT 100% EXITOSA!").
- **Typecheck:** `npm run typecheck` ➔ 0 errores.

---

## 6. Baseline de Errores Conocidos (Known Baseline)
- Ninguno activo tras la corrección del password hash seed en `db.js`.

---

## 7. Progreso y Evidencia In-Place
- **2026-10-25:** FSM y Back Office consolidados bajo la metodología ODD. Suite de pruebas E2E validada.
- **2026-10-28:** Re-verificación: login JWT de Harold OK, KPIs, FSM a `preparando`, inventario 9/9 y consola limpia en E2E. Sin cambios de código.
