# Guía de exposición — Brayan Álvarez

> **Rol:** Tecnología líder, creación del back office.
> **Semana:** 2.
> **Diapositiva propia:** 10. **También presentas:** 8 y la demo (14).
> **Tiempo:** 60 s en tu diapositiva; 20 s en la 8; 120 s en la demo.

---

## 1. Tu parte en una frase

**“El backoffice es el cerebro operativo: recibe el pedido, controla el stock y protege la información de Harold.”**

---

## 2. Los 3 puntos que debes decir

1. **Arquitectura:** Node.js nativo, sin frameworks pesados; rutas HTTP, archivos estáticos y límite de intentos de login.
2. **Datos y seguridad:** SQLite en modo WAL con `better-sqlite3`; contraseña con scrypt; sesión con JWT HS256; endpoints `/api/admin/*` protegidos.
3. **Operación:** pedidos con máquina de estados, KPIs y control de inventario; 13/13 pruebas de dominio y E2E de 4 fases.

---

## 3. Guion de 90 segundos

> “Mi parte fue la tecnología y el backoffice. El profesor preguntó cómo se desarrolló: lo hicimos con Node.js nativo, sin Express, para mantener el costo en 0 y el código auditable.
>
> El servidor recibe el login, valida la contraseña con scrypt y firma un token JWT HS256. Los endpoints de administración exigen ese token; si no está, responden 401. Los pedidos y el inventario viven en SQLite con modo WAL, usando consultas parametrizadas.
>
> El panel de Harold muestra los KPIs, la cola de pedidos y el inventario. Cada pedido avanza por una máquina de estados: pendiente, confirmado, preparando, camino y entregado, con cancelado como salida. Las pruebas de dominio son 13/13 y el E2E cubre 4 fases: catálogo, carrito, backoffice y consola.
>
> El resultado es un backoffice local, seguro y con datos reales, sin pagar licencias.”

---

## 4. Diagrama mental para el tablero

```text
Navegador (admin.html)
        |
        |  POST /api/auth/login  (email + contraseña)
        v
Node.js HTTP  --->  scrypt + JWT HS256
        |
        |  Authorization: Bearer <token>
        v
/api/admin/kpis | /orders | /inventory
        |
        v
SQLite WAL (segaso.db)
```

Si no hay tablero, dibuja tres cajas: **Navegador → Node.js → SQLite**, y escribe **JWT** sobre la flecha.

---

## 5. Qué muestras en pantalla

- Abre `/chorizos-segaso/admin`.
- Inicia sesión con el correo `harold@segasochorizos.com` y la contraseña de `.env`.
- Muestra los KPIs: ventas, ticket promedio, clientes únicos y producto más vendido.
- Abre un pedido y cambia el estado a `preparando` (o al siguiente estado válido).
- Muestra el inventario 9/9 y el stock actualizado.

---

## 6. Preguntas probables

1. **¿Por qué no usaron Express?**  
   Porque para este MVP bastan las rutas nativas de Node.js. Menos dependencias, menos superficie de ataque, 0 COP y un código que se puede auditar completo.

2. **¿Cómo protegen la contraseña?**  
   Se guarda con `scrypt` y una sal aleatoria; nunca en texto plano. La comparación usa `timingSafeEqual`. El login firma un JWT HS256 con expiración de 24 horas y hay límite de 5 intentos por 5 minutos.

3. **¿Cómo evitan que un pedido salte de pendiente a entregado?**  
   La regla está en el dominio: `pendiente → confirmado → preparando → camino → entregado`; `cancelado` es la salida. El endpoint de administración valida la transición y responde 400 si es inválida; el panel muestra el error y recarga el pedido. Las pruebas de dominio y el E2E validan el flujo.

4. **¿Dónde se despliega?**  
   Es un MVP local: Node.js y SQLite en el computador de la empresa. Para publicarlo, el siguiente paso es un servidor con HTTPS, respaldos y un proxy inverso. No decimos que ya está en la nube.

5. **¿Qué pasa si se cae el internet?**  
   La vitrina y el backoffice funcionan en local; las fotos y los videos de TikTok están descargados. El WhatsApp sí necesita internet o datos del celular.

6. **¿Soporta muchos pedidos?**  
   SQLite en WAL soporta el volumen actual de una microempresa. Si el negocio crece, se migra a PostgreSQL; el dominio y los contratos ya están separados.

7. **¿Cómo respaldan los datos?**  
   `segaso.db` se copia a un respaldo antes de cada prueba o demo. Para producción, el respaldo debe ser automático y externo.

---

## 7. Lo que NO debes decir

- “PIN 1234” o “localStorage”: la app real usa **JWT + scrypt + SQLite**.
- “Express”, “React” o “microservicios”: no se usaron.
- “Está desplegado en la nube”: es local.
- “Es 100% seguro”: di **“tiene las protecciones del MVP”**.
- “El panel permite cualquier cambio”: no; el endpoint rechaza las transiciones inválidas y el panel muestra el error.

---

## 8. Datos para memorizar

| Dato | Valor |
|---|---|
| Backend | Node.js nativo (sin Express) |
| Base de datos | SQLite WAL con `better-sqlite3` |
| Auth | scrypt + JWT HS256, 24 h |
| Límite de login | 5 intentos / 5 minutos |
| Rutas admin | `/api/admin/kpis`, `/orders`, `/inventory` |
| Estados | pendiente → confirmado → preparando → camino → entregado (o cancelado) |
| Pruebas | 13/13 dominio + E2E 4 fases |
| Consola | 0 errores críticos en E2E |

---

## 9. Transición

> “Con el backoffice claro, Edison explica cómo el pedido sale del carrito y llega completo al WhatsApp de Harold.”
