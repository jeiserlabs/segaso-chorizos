# Guía de exposición — Edison Galván

> **Rol:** Auxiliar de tecnología, servicio de WhatsApp.
> **Semana:** 3.
> **Bloque propia:** 11. **También apoyas:** la demo (14).
> **Tiempo:** 40 s en tu bloque.

---

## 1. Tu parte en una frase

**“El pedido deja de ser una conversación de 20 minutos y se convierte en un mensaje completo.”**

---

## 2. Los 3 puntos que debes decir

1. **Mensaje estructurado:** el pedido sale con código, cliente, teléfono, dirección, ciudad, método de pago, detalle de productos, descuento y total.
2. **Cierre comercial:** el cupón SEGASO10 aplica 10% en la primera compra; el pedido se guarda en SQLite para el backoffice y en local para el modo offline.
3. **Resultado:** el cliente arma el pedido antes de escribir; Harold recibe la información completa y no tiene que perseguir datos por chat. La reducción de tiempo es una estimación, no una cifra medida.

---

## 3. Guion de 90 segundos

> “Mi parte fue el canal de WhatsApp. Antes, cerrar un pedido tomaba entre 15 y 20 minutos porque Harold tenía que preguntar uno por uno el producto, la cantidad, la dirección, el barrio y el pago.
>
> Lo que hicimos fue mover ese trabajo al carrito: el cliente elige, escribe sus datos y el sistema genera un mensaje estructurado con el código del pedido, el detalle, el descuento y el total. Ese mensaje llega a Harold con todo lo que necesita para despachar. El pedido también se guarda en SQLite para que aparezca en el backoffice.
>
> El cupón SEGASO10 aplica 10% en la primera compra. La ciudad se captura en el formulario; el valor exacto del flete se confirma por WhatsApp según la zona. No es un bot: es un traspaso ordenado a una conversación humana.”

---

## 4. Qué muestras en pantalla

- Agrega 2 Caserito Paisa al carrito.
- Aplica SEGASO10.
- Abre el formulario de datos: nombre, teléfono, dirección, ciudad, pago.
- Genera el pedido y muestra el mensaje de WhatsApp, sin enviarlo.
- Señala el código, el detalle, el descuento y el total.

---

## 5. Preguntas probables

1. **¿Es un bot automático?**  
   No. La página tiene un asesor determinista para preguntas frecuentes; el WhatsApp es un traspaso a Harold. El mensaje se genera automáticamente, pero la conversación y la confirmación las hace una persona.

2. **¿Cómo calculan el flete?**  
   La página captura la ciudad y la dirección; el valor exacto se confirma por WhatsApp según la zona. La parametrización automática de fletes es un siguiente paso, no la presentamos como terminada.

3. **¿El descuento es permanente?**  
   SEGASO10 es un cupón de primera compra del 10%. El margen de la charcutería lo permite; si cambia la política, se ajusta en la página.

4. **¿Qué pasa si el cliente no usa WhatsApp?**  
   Puede llamar o escribir al número de la empresa. El pedido queda registrado en la página; el canal de cierre sigue siendo humano.

5. **¿Cómo miden la reducción de tiempo?**  
   Es una estimación basada en el proceso manual anterior. Lo que sí está validado en la prueba E2E es la generación del mensaje, el descuento y la creación del pedido.

---

## 6. Lo que NO debes decir

- “Es un bot 24/7”: no lo es.
- “El flete se calcula automáticamente”: hoy se confirma por WhatsApp.
- “Respondemos solos todos los mensajes”: Harold atiende la conversación.
- “Enviamos a todo el país”: la cobertura es el Valle de Aburrá.
- “Redujimos 95% el tiempo”: es una estimación, no una medición.

---

## 7. Datos para memorizar

| Dato | Valor |
|---|---|
| Cupón | SEGASO10, 10% primera compra |
| Datos del pedido | Código, cliente, teléfono, dirección, ciudad, pago, detalle, total |
| Persistencia | SQLite para el backoffice + local para offline |
| Cobertura | Envigado, Sabaneta, Itagüí y Medellín |
| Tiempo manual anterior | 15–20 minutos por pedido |
| Tiempo estimado con el carrito | menos de 30 segundos |

---

## 8. Transición

> “Con el pedido en el backoffice, María muestra cómo se controlan los datos y el retorno del proyecto.”
