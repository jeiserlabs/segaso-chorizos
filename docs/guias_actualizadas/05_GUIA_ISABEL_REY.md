# Guía de Exposición Individual — Isabel Rey

> **Estudiante:** Isabel Rey
> **Rol Oficial:** Departamento de Control y Aseguramiento de Calidad del Software (QA)
> **Bloque a Cargo:** **13 (Departamento de Control: QA, 23 Pruebas de Dominio y Suite E2E de 5 Fases)**
> **Tiempo Total en Tarima:** 30 segundos de exposición central + rol protagónico en preguntas técnicas de calidad
> **Foco Central:** Validación determinista del software, Suite E2E de 5 Fases, Cero Errores Críticos y Trazabilidad Sanitaria del Producto

---

## 1. Tu Misión en una Sola Frase

**“Garantice que el sistema funcione a la perfección antes de la sustentación: audité los flujos de datos con 23 pruebas de dominio y una suite E2E de 5 fases que confirmó cero errores críticos en consola y stock sincronizado.”**

---

## 2. Tus 3 Mensajes de Poder

1. **Aseguramiento Determinista del Software:** Ejecutamos 23 pruebas unitarias de dominio para garantizar la exactitud de los cálculos matemáticos del carrito y la validez de los estados de la FSM, blindando el sistema contra errores humanos.
2. **Suite End-to-End (E2E) en 5 Fases:** Simulamos el recorrido completo del usuario y del administrador: Fase 1 (catálogo 9/9), Fase 2 (carrito con cupón SEGASO10 y validación de campos), Fase 3 (panel administrativo con login scrypt/JWT e inventario sincronizado) y Fase 4 (verificación de consola limpia sin excepciones críticas).
3. **Calidad y Trazabilidad del Producto Físico:** Verifiqué que la información digital corresponda con el rótulo sanitario real: 450 gramos netos (5 unidades x 90 g), registro RSA-0015432-2021, vida útil de 60 días en congelación y protocolo de gel refrigerante para despachos.

---

## 3. Guion de Intervención Paso a Paso

### Bloque 1: Aseguramiento de Calidad y Pruebas (Bloque 13 — Minuto 5:55 a 6:25)

> *(Bloque 13 — Departamento de Control y Aseguramiento de Calidad — 30 s)*
> “En el bloque 13 presentamos el aseguramiento de calidad del sistema desde el departamento de control.
>
> Para comprobar que el MVP es estable y confiable, ejecutamos dos baterías de pruebas:
>
> Primero, **23 pruebas unitarias de dominio** que validan la matemática del carrito, la aplicación del cupón SEGASO10 y las transiciones de la máquina de estados.
>
> Segundo, una **prueba End-to-End en 5 fases**:
> 1. Verificamos que las 9 tarjetas del catálogo carguen con fotos y precios oficiales.
> 2. Comprobamos la adición al carrito, el bloqueo de formularios si faltan datos obligatorios y la generación del pedido.
> 3. Ingresamos al backoffice con JWT, auditamos la lectura de pedidos y confirmamos que las 9 referencias de inventario descuenten unidades de forma correcta.
> 4. Ejecutamos el gate de calidad de página: 0 imágenes rotas, un solo H1, tap targets de al menos 44 px y 8/8 rutas HTTP con el status esperado.
> 5. Monitoreamos la consola del navegador y del servidor, registrando **cero errores críticos**.
>
> En cuanto al producto físico, auditamos la ficha técnica: presentación de 450 gramos netos, registro RSA-0015432-2021 y protocolo de cadena de frío con 60 días de vida útil en congelación.”
>
> *(Transición a la Demo en Vivo)*:
> *“Con la calidad y estabilidad demostradas, Brayan y Edison abren el sistema para mostrar la demo en vivo.”*

---

## 4. Estructura de la Batería de Pruebas Ejecutadas

| Tipo de Prueba | Cobertura | Resultado Obtenido |
|---|---|---|
| **23 Pruebas de Dominio** | Cálculo de totales, cupón 10%, sanitización de datos, transiciones válidas de la FSM (pendiente ➔ entregado). | **23 / 23 APROBADAS (100%)** |
| **E2E — Fase 1 (Catálogo)** | Renderizado de las 9 referencias oficiales, fichas técnicas y carga de fotos reales descargadas. | **9 / 9 referencias validadas** |
| **E2E — Fase 2 (Carrito)** | Adición de 2 Caseritos (39.8k), cupón SEGASO10 (-3.98k), validación de campos obligatorios y generación de URI WhatsApp. | **Flujo completado con éxito** |
| **E2E — Fase 3 (Backoffice)** | Autenticación con scrypt/JWT, lectura de KPIs, avance de orden en FSM y deducción de stock en SQLite WAL. | **Inventario 9/9 sincronizado** |
| **E2E — Fase 4 (Estabilidad)** | Inspección de logs de red, verificación de códigos HTTP 200/201 y ausencia de excepciones en consola. | **0 Errores Críticos** |

---

## 5. Preguntas del Jurado Dirigidas a Ti y Cómo Responder

1. **¿Qué tipo de pruebas realizaron y cómo garantizan que el sistema no se caiga en medio de un pedido?**
   *Respuesta:* “Realizamos pruebas automatizadas en dos niveles: pruebas unitarias de dominio para las reglas de negocio (cálculo de subtotales, descuentos y transiciones de la FSM) y pruebas End-to-End simulando un navegador real mediante Playwright. Esto garantiza que todos los formularios validen los datos antes de enviarse y que el backend rechace cualquier solicitud mal formada, impidiendo caídas del servidor.”

2. **¿Qué pasa si un usuario intenta enviar el formulario de pedido sin escribir la dirección o el teléfono?**
   *Respuesta:* “El sistema cuenta con validaciones estrictas en el cliente y en el servidor. Si el cliente omite el nombre, el teléfono celular o la dirección, el formulario bloquea la acción, resalta el campo en rojo y no permite generar el enlace de WhatsApp ni la orden en SQLite. Esto asegura que Harold jamás reciba pedidos incompletos.”

3. **¿Tienen 'cero por ciento de errores' en la empresa real?**
   *Respuesta:* “No afirmamos tener cero por ciento de errores en la operación física del negocio porque factores humanos como el tráfico de los domiciliarios o la disponibilidad de materia prima cárnica están fuera del software. Lo que auditamos y garantizamos técnicamente es que la suite de pruebas End-to-End arrojó **cero errores críticos en el flujo digital**, asegurando que el software no sea una fuente de fallas para la empresa.”

4. **¿Cómo se asegura la calidad sanitaria de los chorizos durante la entrega?**
   *Respuesta:* “El chorizo es un producto cárnico que requiere cadena de frío estricta. Segaso utiliza empaque al vacío de grado alimenticio que otorga 60 días de vida útil en congelación a menos 18 grados Celsius. Para las entregas en el Valle de Aburrá, los pedidos se despachan en cavas térmicas con gel refrigerante, y la entrega se coordina en una ventana horaria menor a 90 minutos para evitar la descongelación.”

---

## 6. Prohibiciones Estrictas (Lo que NO debes decir)

- ❌ NUNCA digas **“hicimos una auditoría externa certificada”** ➔ Di **“auditoría interna de calidad con pruebas E2E automatizadas”**.
- ❌ NUNCA digas **“el sistema no tiene ni un solo error en el mundo real”** ➔ Di **“la suite de pruebas E2E finalizó con cero errores críticos en consola”**.
- ❌ NUNCA digas **“500 gramos”** ➔ Di **“450 gramos netos (5 unidades de 90 g)”**.
- ❌ NUNCA digas **“tenemos certificación INVIMA propia”** ➔ Di **“el producto cuenta con registro sanitario RSA-0015432-2021 impreso en el rótulo oficial”**.
