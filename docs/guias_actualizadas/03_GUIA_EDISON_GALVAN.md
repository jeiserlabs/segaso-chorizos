# Guía de Exposición Individual — Edison Galván

> **Estudiante:** Edison Galván
> **Rol Oficial:** Auxiliar de Tecnología, Integración de Canales Digitales y WhatsApp
> **Bloques a Cargo:** **11 (Canal WhatsApp Automatizado y Mensaje Estructurado)** y **14 (Apoyo en la Demo Interactiva del MVP)**
> **Tiempo Total en Tarima:** 160 segundos (Bloque 11: 40 s, Demo interactiva: 120 s compartidos con Brayan)
> **Foco Central:** Reducción de fricción comercial, Mensaje Estructurado con Código Único, Cupón SEGASO10 y Parametrización de Fletes

---

## 1. Tu Misión en una Sola Frase

**“Convertí las largas y desordenadas conversaciones de WhatsApp de 20 minutos en un mensaje formal estructurado que llega a la empresa con todos los datos necesarios para despachar de inmediato.”**

---

## 2. Tus 3 Mensajes de Poder

1. **Eliminación del Cuello de Botella Operativo:** Antes, el maestro chacinero Harold perdía entre 15 y 20 minutos por cliente en WhatsApp respondiendo qué productos había, cuánto costaban y pidiendo datos sueltos. Con la vitrina web, esa labor se traslada al cliente en un proceso guiado de menos de 30 segundos.
2. **Mensaje Estructurado Determinista:** El carrito genera automáticamente un enlace con codificación URI (`encodeURIComponent`) que inyecta en WhatsApp un mensaje completo con: código único del pedido, nombre, teléfono, dirección, municipio, desglose detallado de referencias, descuento aplicado y total a pagar.
3. **Cierre Comercial con Enfoque Humano:** No implementamos un bot frío e impersonal que frustra al comprador antioqueño; creamos un traspaso ordenado hacia el WhatsApp real de la empresa (312 210 7979), complementado con el cupón de fidelización `SEGASO10` (10% de descuento en la primera compra).

---

## 3. Guion de Intervención Paso a Paso

### Bloque 1: Canal de WhatsApp y Mensaje Estructurado (Bloque 11 — Minuto 4:45 a 5:25)

> *(Bloque 11 — Canal WhatsApp Automatizado)*
> “En el bloque 11 abordamos el canal que genera los ingresos diarios de Segaso: WhatsApp.
>
> El diagnóstico inicial demostró que la atención manual por chat consumía entre 15 y 20 minutos por cliente. Harold tenía que escribir una y otra vez los precios, enviar fotos, consultar si había existencias en la nevera y solicitar datos de entrega fragmentados.
>
> Nuestra solución trasladó todo ese esfuerzo a la vitrina interactiva. Ahora, cuando el cliente selecciona sus productos y llena sus datos básicos, el sistema genera automáticamente un **mensaje estructurado**.
>
> Este mensaje incluye: código único de la orden, datos del cliente, dirección exacta, municipio del Valle de Aburrá, método de pago seleccionado, resumen de productos, cupón de descuento y valor total.
>
> Para estimular la conversión comercial, creamos el cupón promocional **SEGASO10**, que descuenta el 10% en la primera compra. El flete se captura por municipio en el formulario y se ratifica de forma transparente por chat según la distancia del barrio. De esta manera, Harold recibe la orden lista y solo debe confirmar el despacho.”
>
> *(Transición a María)*:
> *“María presentará ahora la viabilidad financiera del proyecto y cómo medimos el retorno de inversión.”*

---

### Bloque 2: Ejecución del Carrito en la Demo en Vivo (Bloque 14 — Minuto 6:25 a 8:25)

> *(Bloque 14 — Demo Interactiva — Tu rol en vivo)*
> 1. *“Para la demostración en vivo, voy a simular la compra de un cliente en la vitrina web.”*
> 2. *“Selecciono 2 paquetes de Caserito Paisa. El carrito marca de inmediato 39.8k COP.”*
> 3. *“En el campo de promociones, ingreso el cupón oficial `SEGASO10` y presiono aplicar: el sistema calcula automáticamente el 10% de descuento, dejando el subtotal en 35.8k COP.”*
> 4. *“Diligencio los datos de entrega de prueba: Nombre, Teléfono celular, Dirección y selecciono el municipio de Envigado.”*
> 5. *“Hago clic en 'Generar Pedido por WhatsApp'. En pantalla se despliega el mensaje estructurado oficial con el código de orden generado y todo el desglose listo para enviar.”*
> 6. *“Al mismo tiempo que se genera el enlace, el pedido se registra de forma transparente en la base de datos local SQLite para que aparezca de inmediato en el panel administrativo de Brayan.”*

---

## 4. Ejemplo del Mensaje Estructurado Oficial Generado

```text
🥩 *NUEVO PEDIDO — SEGASO CHORIZOS* 🥩
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 *Código de Pedido:* #SEG-202611-042
👤 *Cliente:* Juan Carlos Pérez
📱 *Teléfono:* 310 456 7890
📍 *Dirección:* Cra 43A # 38 Sur - 25, Apto 402
🏙️ *Municipio:* Envigado (Barrio Primavera)
💳 *Método de Pago:* Transferencia Bancolombia / Nequi

📦 *DETALLE DE LA COMPRA:*
• 2x Caserito Paisa (450g / x5 uds) ➔ 39.8k COP
🎟️ *Cupón Aplicado:* SEGASO10 (-10%) ➔ -3.98k COP

💰 *TOTAL A PAGAR:* 35.8k COP
*(Flete se coordina según barrio de entrega)*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
¡Gracias por elegir la tradición artesanal de Segaso!
```

---

## 5. Preguntas del Jurado Dirigidas a Ti y Cómo Responder

1. **¿Por qué no instalaron un Chatbot de Inteligencia Artificial como ManyChat o WhatsApp Cloud API?**
   *Respuesta:* “Por dos motivos clave: costo y perfil del cliente. Primero, la API oficial de WhatsApp cobra tarifas en dólares por cada conversación iniciada, lo cual viola el principio de 0 COP de licencias para esta microempresa. Segundo, en el negocio de alimentos artesanales de barrio, los clientes antioqueños rechazan los bots impersonales con menús automáticos; ellos prefieren la calidez de hablar con una persona real. La vitrina organiza los datos técnicos y la persona cierra la venta cordialmente.”

2. **¿Cómo calculan el valor del domicilio o flete?**
   *Respuesta:* “El formulario de la página web captura obligatoriamente el municipio (Envigado, Sabaneta, Itagüí o Medellín). El valor final del domicilio se confirma directamente en el chat de WhatsApp según la distancia exacta del barrio o si aplica flete gratis por compras superiores a cierto volumen. En una fase futura se integrará una tabla fija de tarifas zonales.”

3. **¿El cupón SEGASO10 no deteriora el margen de ganancia de la empresa?**
   *Respuesta:* “No. En la charcutería artesanal el margen bruto promedio supera el 35%. Un descuento del 10% exclusivo para la primera compra actúa como costo de adquisición de cliente (CAC), incentivando la prueba del producto y garantizando la posterior recompra a precio normal gracias a la alta calidad del chorizo.”

---

## 6. Prohibiciones Estrictas (Lo que NO debes decir)

- ❌ NUNCA digas **“es un bot inteligente que responde solo”** ➔ Di **“es un mensaje estructurado determinista que asiste al operador humano”**.
- ❌ NUNCA digas **“hacemos domicilios a toda Colombia”** ➔ Di **“despachamos en el Valle de Aburrá preservando la cadena de frío”**.
- ❌ NUNCA digas **“el flete se cobra automático con tarjeta”** ➔ Di **“el flete se valida por WhatsApp y los pagos son directos por transferencia o contraentrega”**.
- ❌ NUNCA digas **“redujimos el 95% del tiempo medido”** ➔ Di **“la reducción de 15 a 20 minutos a menos de 30 segundos es una estimación operativa comprobada en las pruebas del flujo”**.
