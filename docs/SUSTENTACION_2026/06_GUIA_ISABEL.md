# Guía de exposición — Isabel Rey

> **Rol:** Departamento de control.
> **Semana:** 4 (14-nov).
> **Diapositiva propia:** 13.
> **Tiempo:** 30 s en tu diapositiva.

---

## 1. Tu parte en una frase

**“La calidad no es solo que la página se vea bien: es que los datos cuadren y el pedido llegue completo.”**

---

## 2. Los 3 puntos que debes decir

1. **Pruebas E2E:** se validaron 4 fases: catálogo 9/9, carrito con 2 unidades y 10% de descuento, backoffice con login/KPIs/FSM/inventario 9/9, y consola sin errores críticos.
2. **Datos:** el formulario exige nombre, teléfono y dirección; el pedido descuenta stock y queda con un código en SQLite. La validación busca que no se venda un producto agotado.
3. **Calidad:** rótulo de 450 g netos, 60 días en congelación, lote y vencimiento, y gel refrigerante para domicilios largos. El control es del flujo, no una auditoría externa.

---

## 3. Guion de 90 segundos

> “Mi parte fue el control de calidad y la verificación de datos. Ejecutamos una prueba E2E de cuatro fases: primero el catálogo, con las 9 referencias; segundo el carrito, con 2 unidades, el descuento del 10% y la creación del pedido; tercero el backoffice, con el login de Harold, los KPIs, el cambio de estado y el inventario 9/9; cuarto la consola, que quedó sin errores críticos.
>
> En los datos, el formulario exige nombre, teléfono y dirección; el pedido descuenta stock y queda con un código en SQLite. La idea es que no se venda un producto agotado y que el pedido llegue completo.
>
> En calidad, el rótulo dice 450 gramos netos, 60 días en congelación, lote y vencimiento. Para domicilios largos se usa gel refrigerante. Lo que validamos es el flujo del MVP; no decimos que todos los pedidos reales tengan 0% de error, porque eso requeriría una medición aparte.”

---

## 4. Qué muestras en pantalla

- El inventario 9/9 en el backoffice.
- Un pedido con su código y su estado.
- La consola del navegador sin errores críticos.
- Si tienes el reporte de la prueba, muestra el mensaje de las 4 fases.

---

## 5. Preguntas probables

1. **¿Qué pruebas hicieron?**  
   13 pruebas de dominio (FSM, totales, contratos) y una prueba E2E de 4 fases: catálogo, carrito, backoffice y consola.

2. **¿Cómo validan el stock?**  
   Cada pedido descuenta las unidades en SQLite; el backoffice muestra el inventario. En la prueba E2E el inventario quedó 9/9 después del flujo. No es una auditoría de todos los pedidos reales.

3. **¿Cómo garantizan la cadena de frío?**  
   El producto va sellado al vacío, con 60 días de vida útil en congelación. Para domicilios largos se usa gel refrigerante y se coordina la entrega. El rótulo muestra lote y vencimiento.

4. **¿Qué pasa si falta un dato?**  
   El formulario no deja continuar sin nombre, teléfono y dirección. El pedido no se genera incompleto.

5. **¿Tienen 0% de errores?**  
   En la prueba E2E no hubo errores críticos. La tasa de errores de todos los pedidos reales no está medida; sería una auditoría posterior.

6. **¿Qué pasa si se daña la base de datos?**  
   El MVP usa SQLite con respaldo manual antes de pruebas y demos. Para producción, el respaldo debe ser automático y externo.

---

## 6. Lo que NO debes decir

- “0% de errores en todos los pedidos reales”: no está medido.
- “Certificación INVIMA”: el empaque tiene registro sanitario; no es una certificación que estemos exhibiendo.
- “Auditoría externa”: la prueba es interna.
- “500 g” o “100% carne magra”: son **450 g netos** y **sin harinas ni extensores**.
- “El inventario es perfecto”: di **“en el flujo E2E quedó 9/9”**.

---

## 7. Datos para memorizar

| Dato | Valor |
|---|---|
| Pruebas de dominio | 13/13 |
| Fases E2E | 4 (catálogo, carrito, backoffice, consola) |
| Catálogo validado | 9/9 |
| Inventario E2E | 9/9 |
| Consola | 0 errores críticos |
| Producto | 450 g netos, 60 días congelado |
| Registro sanitario | RSA-0015432-2021 (visible en el empaque) |

---

## 8. Transición

> “Con las pruebas y el control claros, Brayan y Edison abren la página para mostrar el MVP en vivo.”
