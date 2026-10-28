# Segaso Chorizos — Contrato Operativo para Agentes de IA

> **SSOT (Single Source of Truth) — Segaso Chorizos de Tradición (Envigado)**  
> **Proyecto Académico & Comercial:** Plataforma E-Commerce B2C y Back Office Harold García.  
> **Repositorio:** `jeiserlabs/segaso-chorizos` (vía `projects/segaso-app/`)

---

## 📌 1. Principio de Aislamiento de Contexto (Zero Context Bleed)
- Ámbito exclusivo: desarrollo, base de datos local SQLite, backend nativo, interfaz web B2C y panel gerencial de **Segaso Chorizos**.
- Cero mezcla con finanzas personales, DIAN, tránsito o ProGanado.

---

## 📐 2. Reglas Técnicas Inmutables
1. **$0 Dependencias Pesadas:** Stdlib Node.js + `better-sqlite3`. Sin frameworks de backend innecesarios.
2. **Seguridad y Criptografía Fail-Closed:** JWT HS256 manual con `node:crypto` HMAC-SHA256 y hashing scrypt (RFC 7519). Si falta `JWT_SECRET`, el sistema falla de inmediato sin fallbacks inseguros.
3. **Cero Secretos en Git:** Todo secret/password reside en `.env`. El `.env.example` define el contrato público.
4. **Catálogo Oficial Inmutable:** 9 referencias oficiales con precios y empaque x5 (SSOT de precios en GEMINI.md y `db.js`).
5. **Metodología ODD (Gentle-AI / One-Document-Driven):** Se abole la burocracia documental de SDD (Spec-Driven Development). Cualquier requerimiento sustancial se rige por un documento único y vivo en `.odd/tasks/<feature>.odd.md`.
6. **Diseño Visual Gourmet & UX:** Estética oscura premium (Dark #120C0E, Tinto #A61828, Oro #E5A93C, Crema #F3ECDA) con Bento grid, lightbox interactivo, carrito reactivo con cupón WhatsApp (-10% OFF) y responsive design.
7. **Verificación Automatizada E2E:** Cada cambio debe validar `npm test` (contratos de dominio Zod y FSM) y `npm run test:e2e` (Playwright E2E en 4 fases sin errores de consola).
