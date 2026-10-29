# Segaso Chorizos — Plataforma Web y Back Office

Plataforma de comercio electrónico y gestión de pedidos para **Segaso Chorizos de Tradición**, una empresa artesanal de Envigado, Antioquia.

El proyecto combina una vitrina B2C, un carrito que genera un pedido estructurado para WhatsApp y un back office privado para Harold, con inventario, pedidos, KPIs y una máquina de estados.

---

## 1. Estado del proyecto

| Elemento | Estado |
|---|---|
| Vitrina y catálogo de 9 referencias | Operativo |
| Carrito y cupón SEGASO10 | Operativo |
| Pedido a WhatsApp + persistencia SQLite | Operativo |
| Back office con JWT y scrypt | Operativo |
| FSM de pedidos y validación en el endpoint | Operativo |
| Inventario y KPIs | Operativo |
| Pruebas de dominio | 13/13 |
| E2E Playwright | 4 fases, 0 errores críticos de consola |
| Producto | 450 g netos / 5 unidades, 60 días congelado |

---

## 2. Funcionalidades

- **Vitrina:** 9 referencias con precio oficial 2026, ficha de producto, filtros, lightbox y diseño responsive.
- **Carrito:** total en vivo, cupón SEGASO10 (10% primera compra) y persistencia en el navegador.
- **Pedido:** formulario con nombre, teléfono de 10 dígitos, dirección, ciudad y pago; mensaje estructurado a WhatsApp y registro en SQLite.
- **Back office:** login con correo y contraseña, JWT HS256, KPIs, pedidos, inventario y leads.
- **FSM:** `pendiente → confirmado → preparando → camino → entregado` (o `cancelado`); el endpoint rechaza saltos inválidos con HTTP 400.
- **Contenido real:** galería con las 5 fotos del TikTok oficial y videos locales de la marca.
- **Asesor virtual determinista:** respuestas FAQ sin costo de tokens.

---

## 3. Stack

- **Runtime:** Node.js 24+ (type stripping nativo para `src/domain/*.ts`).
- **Backend:** `node:http`, `node:crypto`, `node:fs`; sin Express.
- **Base de datos:** SQLite en modo WAL con `better-sqlite3`.
- **Autenticación:** scrypt + JWT HS256 (RFC 7519), `timingSafeEqual`, rate limiting.
- **Contratos:** Zod v4 + TypeScript.
- **Frontend:** HTML5, CSS3 y JavaScript vanilla.
- **Pruebas:** `node:test` + Playwright.

---

## 4. Arquitectura

```text
Navegador (index.html / admin.html)
        |
        |  HTTP
        v
Node.js HTTP server (server.js)
        |
        +--> SQLite WAL (better-sqlite3)  ->  pedidos, inventario, usuarios, leads
        +--> JWT HS256 + scrypt           ->  sesión del back office
        +--> WhatsApp deep link           ->  cierre humano del pedido
```

El detalle está en [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## 5. Inicio rápido

Requisitos: Node.js 24+, npm y Git.

```bash
# 1. Variables de entorno
cp .env.example .env
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Pega el resultado en JWT_SECRET y define ADMIN_SEED_PASSWORD.

# 2. Dependencias
npm install
npx playwright install chromium

# 3. Verificación
npm run typecheck
npm test
npm run test:e2e

# 4. Servidor
npm start
```

- Tienda: `http://localhost:3000`
- Back office: `http://localhost:3000/chorizos-segaso/admin`
- Credenciales: `harold@segasochorizos.com` + `ADMIN_SEED_PASSWORD` de `.env`.

### Contenido local de TikTok

```bash
node scripts/fetch_tiktok_assets.js
```

Descarga las 5 fotos, 4 portadas y 4 videos de la página a `videos/` (gitignored). Si TikTok devuelve 503, esperar y repetir.

Para la biblioteca social completa:

```bash
node scripts/social_manifest.js
```

Genera `media/social/manifest.json` y la documentación de `docs/social/`. Los binarios no se versionan.

---

## 6. Variables de entorno

| Variable | Requerida | Descripción |
|---|---|---|
| `JWT_SECRET` | Sí | Firma JWT HS256; el servidor falla si falta. |
| `ADMIN_SEED_PASSWORD` | Sí | Contraseña inicial del admin; el seed falla si falta. |
| `PORT` | No | Puerto HTTP; por defecto 3000. |

Nunca subir `.env` al repositorio. El contrato público es `.env.example`.

---

## 7. API

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/api/auth/login` | No | Login; devuelve JWT. |
| `GET` | `/api/auth/me` | JWT | Verificar sesión. |
| `POST` | `/api/orders` | No | Crear pedido público y descontar stock. |
| `POST` | `/api/leads` | No | Registrar interesado. |
| `GET` | `/api/inventory` | No | Stock público por referencia. |
| `GET` | `/api/admin/kpis` | JWT | KPIs del negocio. |
| `GET` | `/api/admin/orders` | JWT | Pedidos. |
| `PATCH` | `/api/admin/orders/:id` | JWT | Cambiar estado con validación FSM. |
| `GET` | `/api/admin/inventory` | JWT | Inventario completo. |
| `PATCH` | `/api/admin/inventory/:code` | JWT | Actualizar stock. |
| `GET` | `/api/admin/leads` | JWT | Leads de academia y catering. |

El detalle y ejemplos están en [`docs/API.md`](docs/API.md).

---

## 8. Estructura

```text
.
├── index.html                  # Vitrina pública
├── admin.html                  # Back office
├── server.js                   # HTTP server y rutas
├── db.js                       # SQLite, schema, seed, queries
├── auth.js                     # scrypt + JWT
├── src/
│   ├── domain/                 # FSM, catering, métricas
│   ├── schemas/                # Contratos Zod v4
│   └── types/                  # Tipos TypeScript
├── tests/                      # Unitarias + E2E Playwright
├── scripts/
│   ├── fetch_tiktok_assets.js  # Assets locales de la página
│   └── social_manifest.js      # Manifiesto de la biblioteca social
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── social/                 # Auditoría de redes y manifiesto
│   ├── promo/                  # Storyboard y prompts para Gemini/Veo
│   └── SUSTENTACION_2026/      # Guías y prompt de la sustentación CESDE
├── .odd/tasks/                 # Documentos ODD
├── logo_segaso.svg
└── README.md
```

Los binarios de la página (`videos/`), de la biblioteca social (`media/`), la base (`*.db`) y `.env` están gitignored.

---

## 9. Pruebas y calidad

```bash
npm run typecheck   # 0 errores
npm test            # 13/13
npm run test:e2e    # 4 fases: catálogo, carrito, backoffice, consola
```

El E2E valida el catálogo de 9 productos, el carrito con 2 unidades y 10% de descuento, la creación del pedido en SQLite, el login JWT, los KPIs, la transición FSM `confirmado → preparando`, el inventario 9/9 y la consola sin errores críticos.

---

## 10. Documentación

- [`docs/README.md`](docs/README.md) — índice de documentación.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — arquitectura, datos y seguridad.
- [`docs/API.md`](docs/API.md) — endpoints y ejemplos.
- [`docs/social/REDES_SEGASO.md`](docs/social/REDES_SEGASO.md) — auditoría de TikTok, Instagram y Facebook.
- [`docs/social/MEDIA_MANIFEST.md`](docs/social/MEDIA_MANIFEST.md) — biblioteca audiovisual y limitaciones.
- [`docs/promo/README_PROMO.md`](docs/promo/README_PROMO.md) — kit del video promocional.
- [`docs/promo/PROMPT_GEMINI_VIDEO.md`](docs/promo/PROMPT_GEMINI_VIDEO.md) — prompts para Gemini/Veo.
- [`docs/promo/STORYBOARD_30S.md`](docs/promo/STORYBOARD_30S.md) — guion visual de 30 segundos.
- [`docs/SUSTENTACION_2026/01_GUIA_MAESTRA.md`](docs/SUSTENTACION_2026/01_GUIA_MAESTRA.md) — guía de la sustentación CESDE.
- [`PROYECTO_SEGASO_CHORIZOS_ENTREGABLE.md`](PROYECTO_SEGASO_CHORIZOS_ENTREGABLE.md) — entregable académico.

---

## 11. Redes oficiales

- TikTok: [@segaso.chorizos](https://www.tiktok.com/@segaso.chorizos)
- Instagram principal: [@chorizos.segaso](https://www.instagram.com/chorizos.segaso/)
- Instagram alterna: [@segaso.chorizos](https://www.instagram.com/segaso.chorizos/)
- Facebook: [Segaso Chorizos](https://www.facebook.com/Segasochorizos/)

**Datos de contacto:** Envigado, Antioquia. Línea del empaque y redes: 312 210 7979. La página configura la línea de Harold: 300 236 7180. Unificar antes de una campaña pública.

---

## 12. Seguridad y contenido

- Sin credenciales en Git; `.env` y `*.db` están gitignored.
- JWT HS256 + scrypt + rate limiting.
- El endpoint de pedidos valida la FSM y rechaza transiciones inválidas.
- No se versionan fotos, videos, PDF ni ZIP; viven en `videos/`, `media/` o en el paquete local/Drive.
- El contenido social es de las cuentas oficiales de Segaso; no se usan primeros planos de menores en el corte promocional.

---

## 13. Licencia y uso

Proyecto privado de Segaso Chorizos y trabajo académico CESDE 2026. El código no se publica como paquete npm. El contenido de marca, las fotos y los videos pertenecen a Segaso Chorizos; su uso se limita a la promoción de la empresa y al proyecto académico.
