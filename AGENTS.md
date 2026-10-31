# Segaso Chorizos — Contrato Operativo para Agentes de IA

> SSOT: Segaso Chorizos de Tradición (Envigado).
> Proyecto académico y comercial: plataforma B2C y back office de Harold García.
> Repositorio: `jeiserlabs/segaso-chorizos`
> Copia local canónica: `C:\PROYECTOS\Mis_Proyectos\Segaso`
> Drive: https://drive.google.com/drive/folders/1X1AMmMNQegvkJc3yDEgMCye039Eogx2Y
> SSOT de rutas y timeline: `SSOT_Y_TIMELINE.md`
> **No trabajar en `projects/segaso-app`:** es una copia histórica dentro de LifeOS. La copia canónica es la de arriba.

---

## 1. Aislamiento de contexto

- Ámbito exclusivo: desarrollo, SQLite local, backend nativo, vitrina, back office, contenido social y material de sustentación de Segaso.
- Cero mezcla con finanzas personales, DIAN, tránsito, ProGanado o LifeOS.

---

## 2. Reglas técnicas inmutables

1. **Cero dependencias pesadas:** stdlib de Node.js + `better-sqlite3` + `zod`. Sin frameworks de backend innecesarios.
2. **Seguridad fail-closed:** JWT HS256 con `node:crypto` y scrypt (RFC 7519). Si falta `JWT_SECRET` o `ADMIN_SEED_PASSWORD`, el servidor/seed falla sin fallbacks inseguros.
3. **Cero secretos en Git:** contraseñas y tokens solo en `.env`; `.env.example` es el contrato público.
4. **Catálogo oficial inmutable:** 9 referencias, paquetes x5, **450 g netos**, 60 días congelado, sin harinas ni extensores. Precios SSOT en `db.js` y `GEMINI.md`; no inventar.
5. **ODD:** todo requerimiento sustancial vive en `.odd/tasks/<feature>.odd.md`. Un documento vivo por feature.
6. **Diseño gourmet y UX:** paleta carbón/borgoña/dorado/crema, Bento grid, lightbox, carrito reactivo, cupón SEGASO10 y responsive.
7. **Verificación obligatoria:** `npm run typecheck`, `npm test` (23/23) y `npm run test:e2e` (5 fases, 0 errores críticos) antes de cerrar un cambio.
8. **Medios y contenido social:** usar solo cuentas oficiales de Segaso. Fotos, videos, capturas, PDF y ZIP viven en `videos/`, `media/` o en el paquete local/Drive; nunca en Git. No usar primeros planos de menores sin autorización. No afirmar 500 g, “100% carne magra” ni “bot 24/7”.
9. **Documentación y enlaces:** README, `docs/README.md`, `docs/ARCHITECTURE.md` y `docs/API.md` deben reflejar el estado real. Prohibidas las rutas absolutas `C:/Users/...` en HTML o docs; usar rutas relativas o notas de “asset local”.

---

## 3. Carga de contexto

1. `README.md`
2. `docs/README.md`
3. `docs/ARCHITECTURE.md`
4. `docs/API.md`
5. `docs/social/REDES_SEGASO.md`
6. `docs/promo/README_PROMO.md`
7. `PROYECTO_SEGASO_CHORIZOS_ENTREGABLE.md`
8. `.env.example`

---

## 4. Comandos canónicos

```bash
npm install
npx playwright install chromium
npm run typecheck
npm test
npm run test:e2e
npm run dev
npm start
```

Contenido local:

```bash
node scripts/fetch_tiktok_assets.js
node scripts/social_manifest.js
```

---

## 5. Seguridad y datos

- `.env`, `*.db`, `videos/`, `media/` y capturas están gitignored.
- Password del admin con scrypt y `timingSafeEqual`; JWT de 24 h; rate limit de 5 intentos por 5 minutos.
- SQL parametrizado con `better-sqlite3`.
- El endpoint `PATCH /api/admin/orders/:id` valida la FSM y responde 400 ante saltos inválidos.

---

## 6. Contacto

- Empresa: Segaso Chorizos de Tradición, Envigado, Antioquia. NIT 1037619618-5.
- TikTok: `@segaso.chorizos`. Instagram principal: `@chorizos.segaso`. Instagram alterna: `@segaso.chorizos`. Facebook: `Segaso Chorizos`.
- Línea del empaque y redes: 312 210 7979. Línea configurada en la página: 300 236 7180.
