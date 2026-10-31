# Guía de Exposición Individual — Brayan Álvarez

> **Estudiante:** Brayan Álvarez
> **Rol Oficial:** Tecnología Líder y Desarrollador del Backoffice Administrativo
> **Bloques a Cargo:** 8 (Cronograma y Roles), **10 (Tecnología Líder y Arquitectura Backend)** y **14 (Demo Interactiva del MVP)**
> **Tiempo Total en Tarima:** 195 segundos (Bloque 8: 15 s, Bloque 10: 60 s, Demo interactiva: 120 s compartidos con Edison)
> **Foco Central:** Arquitectura Node.js nativo, Base de Datos SQLite WAL, Seguridad Criptográfica scrypt/JWT y Trazabilidad FSM

---

## 1. Tu Misión en una Sola Frase

**“Diseñé y programé el cerebro operativo de Segaso: un backoffice administrativo seguro y liviano que procesa pedidos en tiempo real, descuenta inventario automáticamente y protege los datos de la empresa sin pagar licencias de software.”**

---

## 2. Tus 3 Mensajes de Poder

1. **Arquitectura Limpia y Liviana:** Backend desarrollado en Node.js nativo (sin Express ni frameworks sobredimensionados) para asegurar 0 COP de costo, mínima huella de memoria y cero vulnerabilidades de librerías de terceros.
2. **Seguridad y Persistencia Robusta:** Base de datos relacional SQLite en modo WAL (`better-sqlite3`), almacenamiento de contraseñas mediante función derivadora de clave `scrypt` con sal aleatoria, verificación en tiempo constante (`timingSafeEqual`) y sesiones protegidas con tokens JWT HS256.
3. **Flujo de Operación Determinista:** Máquina de Estados Finitos (FSM) estricta de 5 fases para control de pedidos (`pendiente` ➔ `confirmado` ➔ `preparando` ➔ `camino` ➔ `entregado`), validada con 23 pruebas de dominio y suite E2E de 5 fases.

---

## 3. Guion de Intervención Paso a Paso

### Bloque 1: Cronograma y Roles del Proyecto (Bloque 8 — Minuto 2:30 a 2:45)

> *(Bloque 8 — Cronograma y Metodología)*
> “El desarrollo de la solución se ejecutó a lo largo de 4 semanas secuenciales de trabajo técnico:
> - **Semana 1:** Angelina lideró el catálogo comercial, la vitrina web responsive y la producción del video promocional.
> - **Semana 2:** Diseñé la arquitectura del servidor en Node.js, la base de datos relacional SQLite y el panel administrativo.
> - **Semana 3:** Edison implementó la estructura de pedidos y la automatización del canal de WhatsApp.
> - **Semana 4:** María e Isabel auditaron la coherencia de datos, el retorno financiero y la suite de pruebas E2E.
>
> *A continuación, Angelina presenta el catálogo comercial y nuestra pieza publicitaria oficial.”*

---

### Bloque 2: Tecnología Líder y Arquitectura Backend (Bloque 10 — Minuto 3:45 a 4:45)

> *(Bloque 10 — Tecnología Líder y Backoffice)*
> “En el bloque 10 presentamos el núcleo informático del sistema.
>
> Primero, optamos por **Node.js nativo**, prescindiendo deliberadamente de frameworks pesados como Express o NestJS. Esto nos permitió mantener el sistema 100% auditable, liviano y con una superficie de ataque mínima.
>
> Segundo, la persistencia de datos descansa sobre **SQLite en modo WAL** (Write-Ahead Logging). Esto permite lecturas ultra-rápidas y escrituras concurrentes seguras sin colapsar la memoria de la máquina local.
>
> Tercero, la seguridad: las contraseñas administrativas no se guardan en texto plano; se cifran con el algoritmo criptográfico **scrypt con sal aleatoria**. La comparación durante el login utiliza `timingSafeEqual` para bloquear ataques de tiempo, y las sesiones se autorizan mediante un token firmado **JWT HS256** con expiración de 24 horas y límite de 5 intentos fallidos cada 5 minutos.
>
> Cuarto, la lógica del pedido se gobierna por una **Máquina de Estados Finitos**: ningún pedido puede pasar de 'pendiente' a 'entregado' sin haber sido confirmado, preparado y despachado. El sistema rechaza cualquier salto inválido y actualiza el inventario en el acto.”
>
> *(Transición a Edison)*:
> *“Edison explicará ahora cómo este backend se comunica de forma transparente con el cliente a través de WhatsApp.”*

---

### Bloque 3: Conducción de la Demo Interactiva en Vivo (Bloque 14 — Minuto 6:25 a 8:25)

> *(Bloque 14 — Demo en Vivo — Coordinado con Edison)*
> 1. *“Abrimos el navegador en `localhost:3000`. Como pueden ver, la vitrina carga al instante las 9 referencias oficiales de Segaso con fotos reales.”*
> 2. *(Edison simula la compra en el carrito, aplica el cupón `SEGASO10` y genera el mensaje estructurado de WhatsApp).*
> 3. *“Ahora ingreso a la ruta administrativa `/chorizos-segaso/admin`. El sistema solicita credenciales seguras. Iniciamos sesión con el usuario de gerencia.”*
> 4. *“Aquí observamos el panel de control: se reflejan de inmediato los KPIs de ventas totales, ticket promedio y producto más demandado.”*
> 5. *“Ingresamos a la pestaña de pedidos: vemos la orden recién generada por Edison en estado 'pendiente'. Procedo a avanzar su estado a 'confirmado' y luego a 'preparando'. Si intentáramos saltar directamente a 'entregado', el sistema emitiría un error 400 por violación de la FSM.”*
> 6. *“Por último, abrimos la tabla de inventario: verificamos que el stock de Caserito Paisa se descontó en 2 unidades de forma inmediata en SQLite WAL.”*

---

## 4. Diagrama Mental de la Arquitectura (Para Explicar en Tablero o Preguntas)

```text
[ Cliente / Navegador ] (vitrina responsive)
        │
        │  POST /api/orders  (datos del pedido)
        ▼
[ Servidor Node.js Nativo ] ──── (Rate Limit: 5 intentos / 5 min)
        │
        ├─► [ Autenticación ] (scrypt + salt + JWT HS256)
        ├─► [ Máquina FSM ]   (pendiente ➔ confirmado ➔ preparando ➔ camino ➔ entregado)
        │
        ▼
[ Base de Datos SQLite WAL ] (segaso.db: tablas orders, inventory, kpis)
```

---

## 5. Preguntas del Jurado Dirigidas a Ti y Cómo Responder

1. **¿Por qué decidieron no usar Express si es el estándar más común en la industria?**
   *Respuesta:* “Para este MVP no necesitábamos la sobrecarga de 50 dependencias en `node_modules`. El módulo `node:http` nativo maneja perfectamente el ruteo REST, servir los archivos estáticos y parsear JSON. Esto garantiza que el sistema sea inmune a vulnerabilidades de dependencias externas (cero deuda técnica) y corra a costo cero en hardware existente.”

2. **¿Por qué SQLite y no MySQL o PostgreSQL?**
   *Respuesta:* “Porque Segaso es una microempresa con un solo punto de venta y despacho. SQLite en modo WAL es un motor ACID embebido de altísimo rendimiento, no requiere instalar ni mantener un servidor de base de datos independiente (cero daemons en segundo plano) y todo el estado viaja en un solo archivo respaldable `segaso.db`. Si la empresa escala a franquicias, la separación de capas permite migrar a PostgreSQL con mínimo esfuerzo.”

3. **¿Cómo validan que la seguridad no sea vulnerable a inyecciones SQL?**
   *Respuesta:* “Todas las consultas a SQLite se ejecutan mediante declaraciones preparadas (`prepared statements`) con parámetros tipados a través del driver `better-sqlite3`. Nunca concatenamos cadenas de texto directamente en las sentencias SQL.”

---

## 6. Prohibiciones Estrictas (Lo que NO debes decir)

- ❌ NUNCA digas **“PIN 1234”** ni **“localStorage”** ➔ Di **“credenciales con hash scrypt y sesión autorizada por JWT HS256”**.
- ❌ NUNCA digas **“React”**, **“Angular”** o **“Express”** ➔ Di **“HTML5/JavaScript nativo y servidor Node.js puro”**.
- ❌ NUNCA digas **“microservicios”** ni **“despliegue en AWS/GCP”** ➔ Di **“arquitectura modular monolítica local-first para máxima estabilidad y costo cero”**.
- ❌ NUNCA improvises la demo: el flujo debe ser exactamente el acordado con Edison.
