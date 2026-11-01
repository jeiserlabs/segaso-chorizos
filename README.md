# Segaso Chorizos — Plataforma Web y Back Office

Plataforma de comercio electrónico y gestión de pedidos para **Segaso Chorizos de Tradición**, una empresa artesanal de Envigado, Antioquia.

El proyecto combina una vitrina B2C, un carrito que genera un pedido estructurado para WhatsApp y un back office privado para Harold, con inventario, pedidos, KPIs y una máquina de estados.

---

## 0. Dónde se trabaja (SSOT)

| Qué | Dónde |
|---|---|
| Código y documentos | `C:\PROYECTOS\Mis_Proyectos\Segaso` |
| Repositorio | https://github.com/jeiserlabs/segaso-chorizos |
| PDFs, presentación, fotos, video y ZIP | https://drive.google.com/drive/folders/1X1AMmMNQegvkJc3yDEgMCye039Eogx2Y |
| Mapa de rutas y timeline | [`SSOT_Y_TIMELINE.md`](SSOT_Y_TIMELINE.md) |

**No trabajar en** `Asistente_Personal/projects/segaso-app`: es una copia histórica. **No crear copias de estudio en el Escritorio.**

> **Formato de la sustentación:** el guion oral tiene **15 bloques**; el pitch HTML es un **pitch comercial de 10 diapositivas**. No son lo mismo. Ver `docs/guias_actualizadas/` y `SSOT_Y_TIMELINE.md`.

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
| Pruebas de dominio | 23/23 |
| E2E Playwright | 5 fases, 0 errores críticos de consola |
| Producto | 450 g netos / 5 unidades, 60 días congelado |

---

## 2. Funcionalidades

- **Vitrina:** 9 referencias con precio oficial 2026, ficha de producto, filtros, lightbox y diseño responsive.
- **Carrito:** total en vivo, cupón SEGASO10 (10% primera compra) y persistencia en el navegador.
- **Pedido:** formulario con nombre, teléfono de 10 dígitos, dirección, ciudad y pago; mensaje estructurado a WhatsApp y registro en SQLite. El servidor calcula precio, descuento del 10% y total contra el inventario real: el cliente no puede imponerlos.
- **Back office:** login con correo y contraseña, JWT HS256, KPIs, pedidos, inventario y leads. Los datos se escapan antes de pintarse y todas las respuestas llevan CSP.
- **Defensas del API:** validación Zod de pedidos y leads, control de stock, rate limit de 10 pedidos y 5 leads por minuto por IP, y errores 400/429 con mensaje claro.
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

# 3. Verificación completa (typecheck + unit + E2E + auditoría de página)
npm run verify

# 4. Servidor
npm start
```

El gate `npm run verify` incluye `npm run audit:page`, que mide peso, imágenes rotas, metadatos, accesibilidad y la superficie HTTP (`.env`, código y base deben responder 404).

- Tienda: `http://localhost:3000`
- Back office: `http://localhost:3000/chorizos-segaso/admin`
- Credenciales: `harold@segasochorizos.com` + `ADMIN_SEED_PASSWORD` de `.env`. Para reemplazar esa semilla se usa `POST /api/admin/password` (pide la contraseña actual y exige mínimo 10 caracteres); no hay que volver a tocar `.env`.

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

### Medios de la página

```bash
npm run media:products   # 9 fotos reales + miniaturas 480/900 en img/products
npm run media:web        # galería, portadas y barril en WebP (assets/img)
```

Ambos scripts exigen `ffmpeg` y las fuentes locales. Si falta un archivo, fallan con el nombre exacto de la fuente: no inventan imágenes. La procedencia está en [`docs/social/PRODUCT_PHOTOS.md`](docs/social/PRODUCT_PHOTOS.md).

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
| `POST` | `/api/orders` | No | Crear pedido público y descontar stock (transacción atómica; `409` si un referencia se agota). |
| `POST` | `/api/leads` | No | Registrar interesado. |
| `GET` | `/api/inventory` | No | Stock público por referencia. |
| `GET` | `/api/admin/kpis` | JWT admin | KPIs del negocio, incluidos `uniqueCustomers` y `topProduct`. |
| `GET` | `/api/admin/orders` | JWT admin | Pedidos. |
| `PATCH` | `/api/admin/orders/:id` | JWT admin | Cambiar estado con validación FSM. |
| `GET` | `/api/admin/inventory` | JWT admin | Inventario completo. |
| `PATCH` | `/api/admin/inventory/:code` | JWT admin | Actualizar stock. |
| `GET` | `/api/admin/leads` | JWT admin | Leads de academia y catering. |
| `POST` | `/api/admin/password` | JWT admin | Cambiar la contraseña exigiendo la actual. Reemplaza la semilla de `.env`. |

> Todas las rutas `/api/admin/*` verifican además `role === 'admin'` en el JWT (desde el
> 01-nov-2026). Antes bastaba un token firmado válido; hoy solo `/api/auth/login` emite
> tokens de `admin_users`, pero la autorización no puede depender de que no exista otra
> fuente de tokens.

> **Regla del descuento:** el 10 % de bienvenida aplica a **todo** pedido y lo fija el
> servidor (`DESCUENTO_BIENVENIDA_PCT`), nunca el cliente. La vitrina toma los montos de
> la respuesta del servidor para armar el mensaje de WhatsApp, así que lo que se cotiza
> y lo que se archiva son el mismo número. Para quitar el descuento general se cambia
> esa constante y se convierte en cupón real (el campo ya existe en la UI); es decisión
> de negocio de Harold, no un bug.

El detalle y ejemplos están en [`docs/API.md`](docs/API.md).

---

## 8. Estructura

```text
.
├── index.html                  # Vitrina pública (estructura)
├── assets/
│   ├── styles.css              # Estilos de la vitrina
│   ├── app.js                  # Carrito, catálogo, modales y FAQ
│   └── img/                    # WebP de galería, portadas y barril (local)
├── img/products/               # 9 fotos reales + miniaturas (local)
├── admin.html                  # Back office
├── server.js                   # HTTP server, API y estáticos con whitelist
├── db.js                       # SQLite, schema, seed, queries
├── auth.js                     # scrypt + JWT
├── src/
│   ├── domain/                 # FSM, catering, métricas
│   ├── schemas/                # Contratos Zod v4
│   └── types/                  # Tipos TypeScript
├── tests/                      # Unitarias, helper de calidad y E2E Playwright
├── scripts/
│   ├── fetch_tiktok_assets.js  # Assets locales de la página
│   ├── build_product_photos.js # Fotos reales de producto + miniaturas
│   ├── build_web_media.js      # WebP de galería, portadas y barril
│   ├── audit_page.js           # Gate de calidad de la página
│   └── social_manifest.js      # Manifiesto de la biblioteca social
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── social/                 # Auditoría de redes, manifiesto y fotos
│   ├── promo/                  # Storyboard y prompts para Gemini/Veo
│   └── SUSTENTACION_2026/      # Guías y prompt de la sustentación CESDE
├── .odd/tasks/                 # Documentos ODD
├── logo_segaso.svg             # Logo vectorial optimizado
└── README.md
```

Los binarios de la página (`videos/`), de la biblioteca social (`media/`), la base (`*.db`) y `.env` están gitignored.

---

## 9. Pruebas y calidad

```bash
npm run verify      # typecheck + unit + E2E 5 fases + auditoría de página
npm run audit:page  # solo el gate de calidad visual, SEO y seguridad
```

El E2E valida el catálogo de 9 productos, el carrito con 2 unidades y 10% de descuento, la creación del pedido en SQLite, el login JWT, los KPIs, la transición FSM `confirmado → preparando`, el inventario 9/9, el gate de calidad y la consola sin errores.

Estado medido el 2026-10-29:

| Métrica | Antes | Después |
|---|---:|---:|
| Peso de la página (desktop/móvil) | 10.31 MB | 1.29 MB |
| Imágenes rotas | 10 | 0 |
| H1 en la página | 2 | 1 |
| Campos sin etiqueta | 8 | 0 |
| Objetivos táctiles <44 px | 15 | 0 |
| Errores de consola | 15 (assets faltantes) | 0 |
| Rutas sensibles expuestas | `.env`, código y BD descargables | 404 |
| Galería TikTok | recortada 219×1350 | 4:5 completa, 3/2/1 columnas |
| Controles interactivos anidados | 4 | 0 |
| Violaciones axe WCAG 2.1 AA | 2 reglas / 7 nodos | 0 |

El gate exige además 0 imágenes rotas, 0 respuestas ≥400, JSON-LD con 9 ofertas, 4 diálogos accesibles, galería 4:5, 0 controles anidados, 0 desbordamiento horizontal y menos de 3 MB de transferencia.

---

## 10. Documentación

- [`docs/README.md`](docs/README.md) — índice de documentación.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — arquitectura, datos y seguridad.
- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) — paleta canónica, contraste, componentes y accesibilidad.
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
