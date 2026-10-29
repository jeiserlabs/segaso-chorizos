# Arquitectura — Segaso Chorizos

## 1. Resumen

Aplicación web monolítica local, sin frameworks de backend, con dos superficies:

- **Vitrina pública** (`index.html`): catálogo, carrito, pedido y WhatsApp.
- **Back office** (`admin.html`): autenticación, KPIs, pedidos, inventario y leads.

El servidor es Node.js nativo. La persistencia es SQLite en modo WAL. La autenticación usa `node:crypto` con scrypt y JWT HS256.

---

## 2. Stack

| Capa | Tecnología | Motivo |
|---|---|---|
| Runtime | Node.js 24+ | Type stripping nativo para TypeScript; `fetch` global. |
| HTTP | `node:http` | Cero dependencias de framework; superficie pequeña. |
| Datos | SQLite WAL + `better-sqlite3` | Transaccional, local, sin servidor de BD. |
| Auth | `node:crypto` scrypt + JWT HS256 | Sin librerías externas de autenticación. |
| Contratos | Zod v4 + TypeScript | Validación y tipos en dominio. |
| Frontend | HTML5 + CSS3 + JS vanilla | Sin build; portable. |
| Pruebas | `node:test` + Playwright | Unitarias de dominio y E2E real. |

---

## 3. Componentes

| Archivo | Responsabilidad |
|---|---|
| `server.js` | Router HTTP, API, archivos estáticos, rate limiting, validación FSM. |
| `db.js` | Schema, migraciones, seed, consultas parametrizadas. |
| `auth.js` | Hash scrypt, verificación, firma y validación JWT. |
| `index.html` | Vitrina, carrito, checkout, asesor FAQ, TikTok y asados. |
| `admin.html` | Login, dashboard, pedidos, inventario y leads. |
| `src/domain/pedido.fsm.ts` | Estados y transiciones válidas. |
| `src/domain/catering.calculator.ts` | Cálculo de catering. |
| `src/domain/cliente.metrics.ts` | LTV y segmentación. |
| `src/schemas/segaso.schemas.ts` | Contratos Zod v4. |
| `tests/` | Dominio y E2E. |

---

## 4. Flujos

### Login

```text
admin.html
  -> POST /api/auth/login { email, password }
  -> rate limit por IP
  -> db.getUserByEmail()
  -> verifyPassword(scrypt + timingSafeEqual)
  -> signJWT(HS256, 24 h)
  -> localStorage/sessionStorage del navegador
  -> Authorization: Bearer <token> en /api/admin/*
```

### Pedido público

```text
index.html
  -> POST /api/orders { customer, items, total, payment }
  -> server normaliza items contra inventory
  -> db.createOrder()
  -> db.decrementStock() por cada item
  -> responde { success, code: SEG-XXXXXX }
  -> la página usa ese código en el mensaje de WhatsApp
```

### Cambio de estado

```text
admin.html
  -> PATCH /api/admin/orders/:id { status }
  -> requireAuth(JWT)
  -> server busca el pedido actual
  -> validarTransicionEstado(actual, nuevo)
  -> si es inválida: HTTP 400 con el detalle
  -> si es válida: db.updateOrderStatus()
```

---

## 5. Modelo de datos

### `admin_users`

| Campo | Tipo | Nota |
|---|---|---|
| `id` | INTEGER PK | Auto. |
| `email` | TEXT UNIQUE | `harold@segasochorizos.com`. |
| `password_hash` | TEXT | `salt:derivedKey` con scrypt. |
| `role` | TEXT | `admin`. |
| `created_at` | TEXT | Timestamp. |

### `inventory`

| Campo | Tipo | Nota |
|---|---|---|
| `code` | TEXT PK | `caserito`, `antioqueno`, etc. |
| `name` | TEXT | Nombre comercial. |
| `stock` | INTEGER | Unidades disponibles. |
| `price_cop` | INTEGER | Precio oficial. |
| `min_stock` | INTEGER | Umbral de alerta. |
| `updated_at` | TEXT | Timestamp. |

### `orders`

| Campo | Tipo | Nota |
|---|---|---|
| `id` | INTEGER PK | Auto. |
| `code` | TEXT UNIQUE | `SEG-XXXXXX`. |
| `customer_name` | TEXT | Nombre. |
| `customer_phone` | TEXT | 10 dígitos. |
| `address` | TEXT | Dirección. |
| `neighborhood` | TEXT | Ciudad/barrio. |
| `items_json` | TEXT | JSON de items. |
| `total_cop` | INTEGER | Total. |
| `payment_method` | TEXT | Efectivo/transferencia. |
| `status` | TEXT | Estado FSM. |
| `created_at` | TEXT | Timestamp. |
| `updated_at` | TEXT | Timestamp. |

### `leads`

| Campo | Tipo | Nota |
|---|---|---|
| `id` | INTEGER PK | Auto. |
| `name` | TEXT | Interesado. |
| `phone` | TEXT | Teléfono. |
| `type` | TEXT | `curso` o `catering`. |
| `created_at` | TEXT | Timestamp. |

---

## 6. FSM de pedidos

| Estado | Transiciones válidas |
|---|---|
| `pendiente` | `confirmado`, `cancelado` |
| `confirmado` | `preparando`, `cancelado` |
| `preparando` | `camino`, `cancelado` |
| `camino` | `entregado`, `cancelado` |
| `entregado` | ninguna (terminal) |
| `cancelado` | ninguna (terminal) |

El dominio vive en `src/domain/pedido.fsm.ts`. El endpoint `PATCH /api/admin/orders/:id` aplica la misma regla y responde 400 si el salto es inválido.

---

## 7. Seguridad

- `JWT_SECRET` obligatorio; el servidor falla si falta.
- `ADMIN_SEED_PASSWORD` obligatorio; el seed falla si falta.
- Contraseñas con scrypt (sal aleatoria de 16 bytes, clave de 64 bytes) y `timingSafeEqual`.
- JWT HS256 con expiración de 24 horas.
- Rate limiting de login: 5 intentos por 5 minutos por IP.
- Consultas SQL parametrizadas con `better-sqlite3`.
- Rutas administrativas protegidas con `Authorization: Bearer`.
- `.env`, `*.db`, `videos/`, `media/` y capturas fuera de Git.

---

## 8. Pruebas

- **Dominio:** 13/13 (`npm test`), incluye contratos Zod, FSM, catering, LTV y totales.
- **E2E:** 4 fases (`npm run test:e2e`): catálogo 9/9, carrito con 2 unidades y 10%, pedido en SQLite, login JWT, KPIs, FSM, inventario 9/9 y consola limpia.
- **Typecheck:** `npm run typecheck` sin errores.

---

## 9. Límites y siguientes pasos

- El MVP es local; no está publicado en la nube.
- No hay pasarela de pago; el cierre es por WhatsApp.
- El rate limiting es en memoria; para varios procesos se necesita un store compartido.
- SQLite es suficiente para una microempresa; si el volumen crece, migrar a PostgreSQL.
- El envío de fletes se confirma por WhatsApp; la parametrización automática es un siguiente paso.
