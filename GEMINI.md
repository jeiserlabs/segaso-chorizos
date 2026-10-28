# GEMINI.md — Segaso Chorizos (Antigravity / Gemini Flash)

Repo público: `jeiserlabs/segaso-chorizos` | Local: `projects/segaso-app/`
Proyecto CESDE — plataforma web de chorizos artesanales para Harold García (Envigado).

---

## ⚡ REGLAS DE HIERRO

**R1 — Aislamiento:** Este repo es SOLO Segaso. Cero mezcla con LifeOS o ProGanado.
**R2 — Fail-Closed JWT:** `auth.js` lanza Error si `JWT_SECRET` no está en env. NUNCA agregar fallback hardcodeado.
**R3 — Cero credenciales en código:** Passwords y secrets van SOLO en `.env`. El `.env.example` es el contrato público.
**R4 — SQLite WAL:** BD es `segaso.db` local. Sin dependencias cloud. Cero infraestructura externa.
**R5 — $0 dependencias externas:** Stdlib Node.js únicamente (`node:crypto`, `node:http`, `node:fs`, `better-sqlite3`). No agregar npm packages sin justificación.
**R6 — Repo público:** Todo lo que se commitea es visible. Revisar antes de push. Nunca commitear `.env`.
**R7 — Metodología ODD:** Rige One-Document-Driven Development (.odd/tasks/<feature>.odd.md). Burocracia SDD multi-archivo abolida.

---

## Protocolo de Carga al Iniciar Sesión

1. `README.md` → propuesta de valor, catálogo, quick start
2. `PROYECTO_SEGASO_CHORIZOS_ENTREGABLE.md` → entregable CESDE completo
3. `auth.js` → módulo JWT + scrypt (sin dependencias npm)
4. `db.js` → schema SQLite + seed + todas las queries
5. `server.js` → router HTTP, endpoints API, servidor de archivos estáticos
6. `.env.example` → variables de entorno requeridas

---

## Stack actual (FASE 1 — COMPLETADA ✅)

- **Runtime:** Node.js stdlib + `better-sqlite3`
- **Auth:** JWT HS256 manual + scrypt (RFC 7519, cero npm de auth)
- **BD:** SQLite WAL (`segaso.db`)
- **Frontend:** HTML5 + CSS3 + JS vanilla (sin frameworks)

---

## Variables de entorno

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `JWT_SECRET` | **SÍ** | Firma JWT ≥32 bytes hex. Sin esto el server no arranca. |
| `ADMIN_SEED_PASSWORD` | No | Password inicial admin en seed. Cambiar en primer login. |
| `PORT` | No | Puerto HTTP. Default: `3000`. |

Generar JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Estructura

```
segaso-app/
├── auth.js          ← JWT HS256 + scrypt (fail-closed si no hay JWT_SECRET)
├── db.js            ← Schema + seed + queries (SSOT de BD)
├── server.js        ← HTTP server, rutas API, archivos estáticos
├── index.html       ← Tienda pública (carrito, catálogo, bot FAQ, catering)
├── admin.html       ← Back office Harold (pedidos + inventario + KPIs)
├── brochure_segaso.html  ← Brochure comercial/técnico
├── logo_segaso.svg  ← Identidad visual corporativa
├── .env.example     ← Variables requeridas (JWT_SECRET, ADMIN_SEED_PASSWORD, PORT)
└── GEMINI.md        ← Este archivo
```

---

## Endpoints API

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/api/auth/login` | No | Login → JWT (email + password) |
| `GET` | `/api/auth/me` | JWT | Verificar sesión activa |
| `POST` | `/api/orders` | No | Crear pedido desde carrito público |
| `POST` | `/api/leads` | No | Capturar interesado (academia/catering) |
| `GET` | `/api/admin/kpis` | JWT | KPIs Harold: ventas, pedidos activos, stock bajo |
| `GET` | `/api/admin/orders` | JWT | Listado pedidos |
| `PATCH` | `/api/admin/orders/:id` | JWT | Cambiar estado pedido |
| `GET` | `/api/admin/inventory` | JWT | Inventario con alertas stock |
| `PATCH` | `/api/admin/inventory/:code` | JWT | Actualizar stock |
| `GET` | `/api/admin/leads` | JWT | Leads de academia y catering |

---

## Catálogo oficial (SSOT de precios — no inventar)

| id | Producto | Precio |
|----|----------|--------|
| `caserito` | Chorizo Caserito Paisa (x5) | 19.9k COP |
| `antioqueno` | Chorizo Antioqueño Tradicional (x5) | 23.6k COP |
| `santarrosano` | Chorizo Santarrosano (x5) | 23.8k COP |
| `tocineta` | Chorizo Tocineta Ahumada (x5) | 23.8k COP |
| `parrillero` | Chorizo Parrillero Especial (x5) | 23.8k COP |
| `picante` | Chorizo Picante Artesanal (x5) | 24.2k COP |
| `argentino` | Chorizo Argentino con Vino Blanco (x5) | 24.6k COP |
| `morcilla` | Morcilla Paisa Artesanal (x5) | 15.0k COP |
| `chimichurri` | Chimichurri Artesanal de la Casa (250ml) | 14.5k COP |

---

## Roadmap

### FASE 1 — COMPLETADA ✅
- [x] Landing + catálogo responsive (paleta: Borgoña #7C101C, Dorado #E5A93C)
- [x] Carrito 1-click → checkout WhatsApp Harold (`300 236 7180`)
- [x] Auth JWT HS256 + scrypt (cero dependencias npm de auth)
- [x] Back office Harold: pedidos Kanban + inventario + KPIs + leads
- [x] SQLite WAL persistente (`segaso.db`)
- [x] Bot FAQ HTML5 determinista (gluten, conservación, tiempos de cocción)
- [x] Sección Asados al Barril (catering)
- [x] Brochure comercial/técnico

### FASE 2 — Post-CESDE (Harold decide)
- [ ] Notificaciones Telegram cuando entra pedido nuevo
- [ ] Pasarela de pago: Wompi / Nequi QR (link de cobro)
- [ ] Deploy gratuito: Railway / Render con `JWT_SECRET` en dashboard de env vars
- [ ] Reportes: ventas por semana, producto más vendido, ticket promedio
- [ ] Alerta stock mínimo automática a Harold

### FASE 3 — SaaS (si escala)
- [ ] Multi-negocio (otras chorizeras / tiendas de Envigado)
- [ ] PWA offline-first con sync

---

## Inicio rápido

```bash
# 1. Copiar y configurar variables de entorno
cp .env.example .env
# Editar .env: poner JWT_SECRET real (mínimo 32 bytes hex)

# 2. Instalar dependencias
npm install

# 3. Arrancar servidor
npm start
# Tienda: http://localhost:3000
# Admin:  http://localhost:3000/chorizos-segaso/admin
#   (credenciales iniciales en .env → ADMIN_SEED_PASSWORD)
```

---

## Contacto empresa
- Harold Cortés (Gerente): WhatsApp `300 236 7180`
- Ubicación: Calle 46 Sur # 46A-16, Barrio Primavera, Envigado
- TikTok: `@segaso.chorizos` (29.2K seguidores)
- NIT: `1037619618-5`
