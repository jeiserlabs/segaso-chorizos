# API — Segaso Chorizos

Base local: `http://localhost:3000`

Formato de respuesta: JSON. Las rutas administrativas requieren `Authorization: Bearer <TOKEN>`.

---

## 1. Autenticación

### `POST /api/auth/login`

```json
{
  "email": "harold@segasochorizos.com",
  "password": "ADMIN_SEED_PASSWORD"
}
```

Respuesta `200`:

```json
{
  "success": true,
  "token": "<jwt>",
  "user": {
    "email": "harold@segasochorizos.com",
    "role": "admin"
  }
}
```

Errores:

- `400` si falta correo o contraseña.
- `401` si las credenciales son inválidas.
- `429` si se superan 5 intentos fallidos en 5 minutos.

### `GET /api/auth/me`

Requiere JWT. Devuelve el usuario del token.

---

## 2. Pedidos

### `POST /api/orders`

Público. Crea el pedido y descuenta stock.

```json
{
  "customer_name": "Cliente de prueba",
  "customer_phone": "3001234567",
  "address": "Calle 00 # 00-00",
  "neighborhood": "Envigado",
  "payment_method": "Transferencia Nequi/Bancolombia",
  "items": [
    { "id": "caserito", "qty": 2 }
  ]
}
```

El cliente solo envía producto y cantidad. `name`, `price_cop`, `subtotal_cop`, el descuento del 10% y el total se calculan en el servidor contra `inventory`; cualquier precio o total enviado por el cliente se ignora.

Respuesta `201`:

```json
{
  "success": true,
  "code": "SEG-123456",
  "subtotal_cop": 39800,
  "discount_cop": 3980,
  "total_cop": 35820
}
```

Errores:

- `400` si el producto no existe, la cantidad no es entera, supera 50, excede el stock real o un campo no cumple el contrato Zod.
- `429` si se superan 10 pedidos por minuto desde la misma IP.

### `GET /api/admin/orders`

Requiere JWT. Devuelve la lista de pedidos.

### `PATCH /api/admin/orders/:id`

Requiere JWT. Cambia el estado con validación FSM.

```json
{
  "status": "confirmado"
}
```

Respuesta `200`:

```json
{
  "success": true,
  "updated": "1",
  "status": "confirmado"
}
```

Salto inválido (`preparando → entregado`), respuesta `400`:

```json
{
  "success": false,
  "error": "Transición inválida: no se puede pasar un pedido de 'preparando' a 'entregado'. Transiciones válidas: [camino, cancelado]."
}
```

---

## 3. Inventario

### `GET /api/inventory`

Público. Solo devuelve `code` y `stock` para la vitrina.

### `GET /api/admin/inventory`

Requiere JWT. Devuelve nombre, stock, precio, mínimo y actualización.

### `PATCH /api/admin/inventory/:code`

Requiere JWT.

```json
{
  "stock": 25
}
```

Respuesta `200`:

```json
{
  "success": true,
  "code": "caserito",
  "stock": 25
}
```

---

## 4. KPIs

### `GET /api/admin/kpis`

Requiere JWT. Devuelve métricas de ventas, pedidos, ticket promedio, clientes y stock bajo.

Los pedidos del seed de demostración (`SEG-1001`, `SEG-1002`, `SEG-1003`) llevan
`es_demo = 1` y quedan excluidos de **todos** los agregados: `salesDelivered`,
`salesCount`, `avgTicket`, `todaySales`, `monthSales`, `activeOrders`,
`canceledOrders`, `uniqueCustomers` y `topProduct` solo cuentan ventas reales.
`demoOrders` informa cuántos hay excluidos, para que la exclusión sea visible y no
un silencio. El panel los muestra etiquetados `DEMO` en la tabla de pedidos.

---

## 5. Leads

### `POST /api/leads`

Público. Registra un interesado de academia o catering.

```json
{
  "name": "Cliente de prueba",
  "phone": "3001234567",
  "type": "Taller Charcutería"
}
```

`name` exige 3–100 caracteres, `phone` debe ser celular colombiano de 10 dígitos y `type` 3–60 caracteres (`curso` por defecto). Errores `400` por contrato y `429` tras 5 registros por minuto desde la misma IP.

### `GET /api/admin/leads`

Requiere JWT. Lista los interesados.

---

## 6. Errores

Formato general:

```json
{
  "success": false,
  "error": "Descripción del error"
}
```

Códigos usados:

| Código | Uso |
|---:|---|
| `400` | Datos inválidos o transición FSM inválida. |
| `401` | Token faltante, inválido o expirado. |
| `404` | Endpoint o pedido no encontrado. |
| `429` | Rate limit de login, pedidos o leads. |
| `500` | Error interno. |

---

## 7. Ejemplo rápido con curl

```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"harold@segasochorizos.com","password":"'"$ADMIN_SEED_PASSWORD"'"}' \
  | node -pe "JSON.parse(require('fs').readFileSync(0,'utf8')).token")

# KPIs
curl -s http://localhost:3000/api/admin/kpis \
  -H "Authorization: Bearer $TOKEN"
```

No guardes tokens en archivos versionados ni en capturas de pantalla.
