# Demo MVP — Segaso Chorizos

> **Objetivo:** abrir la página y mostrar el flujo completo en 2 minutos, sin depender de internet.
> **Regla:** si algo falla, no improvisar; usar el plan B.

---

## 1. Antes del día (hazlo una vez)

Abre una terminal en:

```text
C:\PROYECTOS\Mis_Proyectos\Segaso
```

Verifica Node y dependencias:

```bash
node -v
npm install
```

Verifica que `.env` exista y tenga valores reales:

```text
JWT_SECRET=<cadena de 32 bytes en hex>
ADMIN_SEED_PASSWORD=<contraseña de Harold>
PORT=3000
```

Si `.env` no existe, copia `.env.example` y genera un secreto:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

No uses los placeholders `CAMBIAR_POR...`; el servidor falla a propósito si el secreto no es real.

---

## 2. Respaldo de la base de datos

Detén el servidor antes de copiar. Luego:

```bash
copy segaso.db segaso.db.bak
```

Si existen `segaso.db-wal` y `segaso.db-shm`, cópialos también. El respaldo se restaura solo si creaste pedidos de prueba durante el ensayo o la demo.

**Advertencia:** restaurar `segaso.db.bak` borra los pedidos creados después del respaldo. Hazlo solo si son de prueba.

---

## 3. Encender la página

Opción recomendada:

```text
Doble clic en: Iniciar Segaso.bat
```

Abre:

- Vitrina: `http://localhost:3000`
- Backoffice: `http://localhost:3000/chorizos-segaso/admin`

Credenciales del backoffice:

- Correo: `harold@segasochorizos.com`
- Contraseña: el valor de `ADMIN_SEED_PASSWORD` en `.env` (no la escribas en el bloque)

Si el puerto 3000 está ocupado, cambia `PORT` en `.env` o cierra el otro servidor. No mates procesos a ciegas.

---

## 4. Verificación previa (5 minutos)

- [ ] La vitrina muestra las 9 tarjetas y las fotos reales de TikTok.
- [ ] La sección de TikTok muestra las 5 fotos y las 4 portadas.
- [ ] El carrito suma 2 Caserito Paisa en 39.8k COP.
- [ ] El cupón SEGASO10 aplica 10%.
- [ ] El backoffice abre el login y entra con la contraseña de `.env`.
- [ ] Los KPIs cargan y el inventario muestra 9/9.
- [ ] Un pedido se puede cambiar de estado.
- [ ] La consola del navegador no tiene errores críticos.
- [ ] Si desconectas internet, la vitrina y el backoffice siguen funcionando; los videos locales también.

Si faltan fotos o videos:

```bash
node scripts/fetch_tiktok_assets.js
```

Requiere internet; si TikTok devuelve 503, espera unos minutos y reintenta. Los archivos ya descargados no se tocan.

---

## 5. Guion de la demo (2 minutos)

### 0:00–0:30 — Vitrina
- Abre `http://localhost:3000`.
- Muestra las 9 tarjetas y las fotos reales.
- “Este es el catálogo oficial: 9 referencias, 450 g netos, precios 2026.”

### 0:30–1:00 — Carrito y pedido
- Agrega 2 Caserito Paisa.
- Abre el carrito: total 39.8k COP.
- Aplica SEGASO10: 10% de descuento.
- Llena nombre, teléfono, dirección y ciudad con datos de prueba.
- Genera el pedido.
- Si aparece el diálogo de WhatsApp, muestra el mensaje y no lo envíes (o cancela).

### 1:00–1:40 — Backoffice
- Abre `/chorizos-segaso/admin`.
- Inicia sesión con `harold@segasochorizos.com` y la contraseña de `.env`.
- Muestra los KPIs: ventas, ticket promedio, clientes únicos, producto más vendido.
- Abre el pedido recién creado.
- Si el pedido está pendiente, primero cámbialo a `confirmado` y luego a `preparando`; el servidor rechaza los saltos inválidos.
- Muestra el inventario 9/9 y el stock descontado.

### 1:40–2:00 — Cierre
- “Todo corre en local, con SQLite, JWT y 0 COP de licencias.”
- “El siguiente paso es publicarlo con HTTPS, respaldos y pagos en línea.”

---

## 6. Plan B

| Falla | Qué hacer |
|---|---|
| El servidor no arranca | Revisa `.env` (`JWT_SECRET`, `ADMIN_SEED_PASSWORD`), el puerto 3000 y la consola. |
| El login falla | Usa la contraseña actual de `.env`; si no la recuerdas, restablécelas con el equipo antes de la demo. |
| Las fotos/videos no cargan | Ejecuta `node scripts/fetch_tiktok_assets.js`; si no hay internet, usa las capturas de `CAPTURAS/`. |
| El proyector falla | Usa la pantalla del portátil y el PDF de la presentación. |
| El internet falla | La vitrina y el backoffice son locales; los videos también. El WhatsApp se muestra sin enviar. |
| El pedido no aparece | Revisa que el POST a `/api/orders` haya funcionado; si estás offline, el pedido queda en local. |

Las capturas de respaldo se generan con la app real antes del 14-nov y se guardan en `CAPTURAS/`.

---

## 7. Después de la demo

Si creaste pedidos de prueba y quieres dejar la base como estaba:

1. Detén el servidor.
2. Restaura `segaso.db.bak` sobre `segaso.db`.
3. Vuelve a iniciar el servidor.

Si los pedidos de la demo son útiles para Harold, déjalos y anótalos como prueba.

---

## 8. Lo que no se hace en la demo

- No se envían mensajes reales a clientes.
- No se usan datos personales de clientes reales.
- No se promete que la página está publicada en internet.
- No se cambian precios ni stock real sin avisar a Harold.
- No se muestra la contraseña en pantalla.
