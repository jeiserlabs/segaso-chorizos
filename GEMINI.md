# GEMINI.md — Segaso Chorizos

Repositorio: `jeiserlabs/segaso-chorizos`
Copia local: `projects/segaso-app/`
Proyecto CESDE 2026: plataforma web y back office para Segaso Chorizos de Tradición (Envigado).

---

## Reglas de hierro

**R1 — Aislamiento:** este repositorio es solo Segaso. Cero mezcla con LifeOS, DIAN, tránsito o ProGanado.

**R2 — JWT fail-closed:** `auth.js` lanza error si falta `JWT_SECRET`. Prohibido agregar un fallback hardcodeado.

**R3 — Cero credenciales en Git:** contraseñas y secretos viven solo en `.env`. El contrato público es `.env.example`.

**R4 — SQLite WAL:** la base es `segaso.db` local, con `better-sqlite3`. Sin infraestructura cloud.

**R5 — Dependencias mínimas:** stdlib de Node.js + `better-sqlite3` + `zod`. No agregar frameworks de backend ni auth sin justificación.

**R6 — Repo público:** todo lo que se commitea es visible. Revisar el diff antes de push. Nunca commitear `.env`.

**R7 — ODD:** todo requerimiento sustancial vive en un único documento en `.odd/tasks/<feature>.odd.md`.

**R8 — Medios fuera de Git:** fotos, videos, capturas, PDF y ZIP viven en `videos/`, `media/` o en el paquete local/Drive. GitHub solo recibe texto, código y SVG.

**R9 — Contenido social:** usar solo cuentas oficiales de Segaso. No usar primeros planos de menores sin autorización. No afirmar 500 g, “100% carne magra” ni “bot 24/7”.

---

## Protocolo de carga

1. `README.md` — propuesta de valor, inicio rápido, API y estado.
2. `docs/README.md` — índice de documentación.
3. `docs/ARCHITECTURE.md` — stack, datos, seguridad y FSM.
4. `docs/API.md` — endpoints y ejemplos.
5. `docs/social/REDES_SEGASO.md` — cuentas y contenido real.
6. `docs/promo/README_PROMO.md` — kit del video promocional.
7. `PROYECTO_SEGASO_CHORIZOS_ENTREGABLE.md` — entregable CESDE.
8. `.env.example` — variables requeridas.

---

## Stack

- Runtime: Node.js 24+ con type stripping.
- HTTP: `node:http`.
- Datos: SQLite WAL + `better-sqlite3`.
- Auth: scrypt + JWT HS256 con `node:crypto`.
- Contratos: Zod v4 + TypeScript.
- Frontend: HTML5 + CSS3 + JavaScript vanilla.
- Pruebas: `node:test` + Playwright.

---

## Variables de entorno

| Variable | Requerida | Descripción |
|---|---|---|
| `JWT_SECRET` | Sí | Firma JWT HS256; el servidor falla si falta. |
| `ADMIN_SEED_PASSWORD` | Sí | Contraseña inicial del admin; el seed falla si falta. |
| `PORT` | No | Puerto HTTP; por defecto 3000. |

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Estructura

```text
.
├── index.html
├── admin.html
├── server.js
├── db.js
├── auth.js
├── src/domain, src/schemas, src/types
├── tests/
├── scripts/
│   ├── fetch_tiktok_assets.js
│   └── social_manifest.js
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── social/
│   ├── promo/
│   └── SUSTENTACION_2026/
├── .odd/tasks/
├── logo_segaso.svg
├── README.md
├── AGENTS.md
└── GEMINI.md
```

---

## API

La tabla completa está en `docs/API.md`. Resumen:

| Método | Ruta | Auth |
|---|---|---|
| `POST` | `/api/auth/login` | No |
| `GET` | `/api/auth/me` | JWT |
| `POST` | `/api/orders` | No |
| `POST` | `/api/leads` | No |
| `GET` | `/api/inventory` | No |
| `GET` | `/api/admin/kpis` | JWT |
| `GET` | `/api/admin/orders` | JWT |
| `PATCH` | `/api/admin/orders/:id` | JWT + FSM |
| `GET` | `/api/admin/inventory` | JWT |
| `PATCH` | `/api/admin/inventory/:code` | JWT |
| `GET` | `/api/admin/leads` | JWT |

---

## Catálogo oficial

9 referencias, paquetes x5, **450 g netos**, 60 días congelado, sin harinas ni extensores. Los precios son el SSOT de `db.js` y no se inventan.

| id | Producto | Precio |
|---|---|---:|
| `caserito` | Chorizo Caserito Paisa | 19.9k COP |
| `antioqueno` | Chorizo Antioqueño Tradicional | 23.6k COP |
| `santarrosano` | Chorizo Santarrosano | 23.8k COP |
| `tocineta` | Chorizo Tocineta Ahumada | 23.8k COP |
| `parrillero` | Chorizo Parrillero Especial | 23.8k COP |
| `picante` | Chorizo Picante Artesanal | 24.2k COP |
| `argentino` | Chorizo Argentino con Vino Blanco | 24.6k COP |
| `morcilla` | Morcilla Paisa Artesanal | 15.0k COP |
| `chimichurri` | Chimichurri Artesanal de la Casa (250 ml) | 14.5k COP |

---

## Verificación

```bash
npm run typecheck
npm test
npm run test:e2e
```

Estado: typecheck limpio, 23/23 pruebas (dominio + validación de pedidos), E2E de 5 fases y FSM inválida con HTTP 400.

---

## Roadmap

### Fase 1 — completada
- Vitrina responsive y catálogo de 9 referencias.
- Carrito y cupón SEGASO10.
- Pedido a WhatsApp + SQLite.
- Back office JWT + scrypt con KPIs, pedidos, inventario y leads.
- FSM con validación en el endpoint.
- Pruebas de dominio y E2E.

### Fase 2 — decisión de Harold
- Notificaciones Telegram al entrar un pedido.
- Pasarela de pago (Wompi/Nequi QR).
- Deploy con HTTPS y respaldos.
- Reportes semanales y alertas de stock.

### Fase 3 — si escala
- Multi-negocio.
- PWA offline-first.

---

## Contacto y redes

- Empresa: Segaso Chorizos de Tradición, Envigado, Antioquia. NIT 1037619618-5.
- TikTok: `@segaso.chorizos`.
- Instagram principal: `@chorizos.segaso`.
- Instagram alterna: `@segaso.chorizos`.
- Facebook: `Segaso Chorizos`.
- Línea del empaque y redes: 312 210 7979.
- Línea configurada en la página: 300 236 7180.

Unificar la línea de contacto antes de una campaña pública.
