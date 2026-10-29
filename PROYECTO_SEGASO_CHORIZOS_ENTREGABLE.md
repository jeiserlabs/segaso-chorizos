# PROYECTO INTEGRADOR APLICADO: DIGITALIZACIÓN Y AUTOMATIZACIÓN COMERCIAL
## CASO DE ESTUDIO: SEGASO CHORIZOS S.A.S. (ENVIGADO, ANTIOQUIA)

---

### FICHA ACADÉMICA DEL PROYECTO
* **Institución Educativa:** CESDE · Escuela de Administración y Negocios / Procesos Empresariales
* **Equipo de estudiantes:** Angelina Rojas · Brayan Álvarez · Edison Galván · María Vahos Villa · Isabel Rey
* **Empresa Beneficiaria:** Segaso Chorizos (Segaso Chorizos S.A.S.)
* **Ubicación:** Calle 46 Sur # 46A - 16, Barrio Primavera, Envigado, Antioquia
* **NIT Registrado:** `1037619618-5` · Cámara de Comercio Aburrá Sur (CCAS)
* **Reconocimiento Institucional:** Programa *Antójate de Antioquia* (Gobernación de Antioquia, Renglón 1288)
* **Gerencia y Operación:** Harold Cortés / García (Gerente / Maestro Parrillero), Giseth García Ospina (Subgerente), Obed García y José García (Producción)
* **Año Académico:** 2026

---

## 1. INTRODUCCIÓN Y CONTEXTO EMPRESARIAL

Segaso Chorizos es una microempresa agroindustrial familiar de tradición fundada en el municipio de Envigado, Antioquia. Su actividad económica se enfoca en la elaboración y comercialización de charcutería porcina artesanal gourmet de calidad superior: chorizos de carne de cerdo seleccionada, sin adición de harinas, almidones, féculas ni extensores de soya, sellados al vacío en empaque grado alimenticio con 60 días de vida útil en congelación.

Pese a contar con un producto validado de alta aceptación en el mercado y un reconocimiento formal por la Gobernación de Antioquia (*Antójate de Antioquia*), la empresa operaba hasta la fecha en un modelo analógico con alta fricción:
* Cero portal web propio.
* Pedidos gestionados manualmente vía chats desorganizados de WhatsApp personal.
* Cero trazabilidad de inventario y pedidos en curso (despachados vs pendientes).
* Falta de un canal digital para canalizar las consultas recurrentes de clientes (conservación en frío, apto para celíacos, ingredientes, cotizaciones).

El presente proyecto plantea el diseño, implementación y despliegue de una solución de software web de alta eficiencia, bajo costo y operación dual (B2C público + Back Office privado) para modernizar la gestión comercial de la empresa.

---

## 2. PLANTEAMIENTO DEL PROBLEMA

### 2.1. Síntomas Identificados
1. **Saturación en Atención:** Harold atiende el WhatsApp de manera manual mientras gestiona la producción física, ahumado y despacho de pedidos.
2. **Pérdida de Conversión:** Clientes que solicitan la lista de precios por chat se desinteresan al no recibir respuesta inmediata o al recibir textos largos y difíciles de leer.
3. **Falta de Trazabilidad:** Al no contar con un tablero de control (Kanban de pedidos), no se sabe con certeza qué órdenes están pagadas, en preparación o en camino.
4. **Desconexión con Canales Digitales:** Segaso cuenta con más de 29.2K seguidores en TikTok (`@segaso.chorizos`) y una comunidad creciente en Instagram, pero ese tráfico no aterrizaba en un punto de captura de datos ni en un carrito de compras interactivo.

### 2.2. Pregunta de Investigación / Problema Central
> *¿De qué manera la implementación de una plataforma web bidireccional (Catálogo B2C con Asesor Virtual + Back Office de gestión de pedidos) optimiza el proceso de ventas y control operativo de Segaso Chorizos en el Valle de Aburrá?*

---

## 3. OBJETIVOS DEL PROYECTO

### 3.1. Objetivo General
> **“Establecer un sistema de seguimiento a los clientes mediante una estructura informática, que permita almacenar la información de una manera ágil para la empresa Segaso Chorizo S.A.S.”**

*Cita literal del objetivo general acordado con la empresa. No se modifica en la sustentación.*

### 3.2. Objetivos Específicos (SMART)
1. **Desarrollar una vitrina comercial interactiva** que exponga las 9 referencias de productos con precios oficiales 2026 en paquetes al vacío x5 unidades (450 g).
2. **Integrar un Asesor Virtual determinista ($0 Costo en tokens)** que resuelva de manera instantánea las dudas de ingredientes, gluten, empaque al vacío y servicios al barril.
3. **Construir un módulo de cotización y captación para el nuevo servicio de Asados al Barril a Domicilio** (desde 5 personas en adelante) y lista de espera para los talleres de charcutería.
4. **Habilitar un Back Office administrativo protegido con JWT HS256 y scrypt** para el seguimiento en tiempo real del ciclo de pedidos (pendiente ➔ confirmado ➔ preparando ➔ camino ➔ entregado, o cancelado).
5. **Conectar de forma fluida el ecosistema de redes sociales** (TikTok Oficial con 29.2K seguidores e Instagram Oficial `@segaso.chorizos`) con el canal de cierre en WhatsApp.

---

## 4. ANÁLISIS ESTRATÉGICO

### 4.1. Matriz DOFA (FODA)

| Factor | Positivo | Negativo |
| :--- | :--- | :--- |
| **Interno** | **Fortalezas (F)**<br>• Producto sin harinas ni extensores (diferenciador de salud).<br>• Sello de empaque al vacío grado alimenticio (60 días).<br>• Reconocimiento en *Antójate de Antioquia*.<br>• Receta familiar autóctona de Envigado. | **Debilidades (D)**<br>• Equipo operativo pequeño (familiar).<br>• Dependencia excesiva de un solo operador en ventas.<br>• Falta de presupuesto para servidores cloud costosos.<br>• Canales comerciales no centralizados. |
| **Externo** | **Oportunidades (O)**<br>• Auge del asado al barril en fincas y reuniones de fin de semana.<br>• Alta demanda de alimentos artesanales gourmet y libres de gluten.<br>• Tráfico viral en TikTok gastronómico (29K+ seguidores).<br>• Alianzas comerciales con charcuterías y restaurantes. | **Amenazas (A)**<br>• Variaciones en los costos de materias primas cárnicas (cerdo).<br>• Competencia de marcas industriales de bajo costo (Zenu, Rica).<br>• Informalidad en el transporte de cadena de frío. |

### 4.2. Análisis del Entorno (PESTEL)

* **Político / Legal:** Cumplimiento de normas sanitarias del INVIMA para empaque de alimentos y formalización comercial ante la Cámara de Comercio Aburrá Sur con NIT `1037619618-5`.
* **Económico:** Control de costos de insumos y fijación de precios competitivos (rango entre 19.9k COP y 24.6k COP por 450 g).
* **Social:** Consumidor moderno antioqueño que prefiere ingredientes limpios, salud digestiva (sin gluten) y experiencias gastronómicas en el hogar (asados al barril).
* **Tecnológico:** Adopción de interfaces móviles táctiles, carritos de compra sin fricción y automatización ligera para reducir errores humanos en pedidos.
* **Ecológico:** Optimización de empaques y cero desperdicio de materia prima mediante porcionado exacto de 5 unidades.

> **Prioridad para la sustentación:** de las seis dimensiones PESTEL se expone la **tecnológica**, porque es la que explica directamente la plataforma (digitalización de canales, automatización de pedidos, marketing georreferenciado y riesgos de internet/seguridad).

### 4.3. Matrices EFI y EFE (resultados)

- **EFI 2.49 / 4.00 — posición interna neutra.** Fortalezas en producto, marca y presencia digital; lastre en procesos, liquidez y estructura. El punto neutro es 2.50.
- **EFE 2.70 / 4.00 — posición externa favorable.** La demanda HORECA, el canal digital y el domicilio pesan más que la competencia y el costo de los insumos.

Las tablas completas, con pesos, calificaciones y cálculos, están en `docs/SUSTENTACION_2026/09_ANEXO_MATRICES_EFI_EFE.md`. En la sustentación solo se muestran los resultados y una lectura breve.

---

## 5. PORTAFOLIO DE PRODUCTOS Y SERVICIOS

### 5.1. Catálogo Oficial de Chorizos y Complementos (Paquetes x5 Uds / 450 g)

| Producto | Formato / Peso | Precio Oficial | Descripción y Sabor |
| :--- | :--- | :--- | :--- |
| **Chorizo Caserito Paisa** | Paq x 5 (450 g) | **19.9k COP** | La receta casera tradicional de Envigado, sazón clásica, suave y jugoso. |
| **Chorizo Antioqueño** | Paq x 5 (450 g) | **23.6k COP** | El sabor insigne de nuestra tierra, notas ahumadas y especias tradicionales. |
| **Chorizo Santarrosano** | Paq x 5 (450 g) | **23.8k COP** | Tradición de Santa Rosa de Cabal, toque dulce equilibrado y textura tierna. |
| **Chorizo Tocineta** | Paq x 5 (450 g) | **23.8k COP** | Cargado con trozos de tocineta ahumada crujiente para un sabor intenso. |
| **Chorizo Parrillero** | Paq x 5 (450 g) | **23.8k COP** | Diseñado especialmente para brasa y barril, dorado parejo y piel crocante. |
| **Chorizo Picante** | Paq x 5 (450 g) | **24.2k COP** | Nivel de picante medio-alto con ajíes frescos seleccionados, sin invadir la carne. |
| **Chorizo Argentino** | Paq x 5 (450 g) | **24.6k COP** | Estilo gaucho con vino blanco, nuez moscada y hierbas, ideal para choripán. |
| **Morcilla Artesanal** | Paq x 5 (450 g) | **15.0k COP** | Rellena tradicional con arroz y hierbas de huerto, consistencia suave y crocante. |
| **Chimichurri de la Casa** | Frasco 250ml | **14.5k COP** | Emulsión fresca de perejil, ajo, aceite y especias, complemento infaltable. |

### 5.2. Servicios Complementarios de Alto Valor

1. **Asados al Barril a Domicilio (Catering Gourmet):**
   * Cobertura: Envigado, Sabaneta, Itagüí, Medellín y Oriente Antioqueño.
   * Capacidad: Desde 5 personas en adelante (Planes: Familiar 5-10, Amigos 10-25, Eventos 25+).
   * Propuesta: Harold y su equipo llevan el barril ahumador, carbón, tablas, vajilla parrillera y el menú completo de chorizos, bondiola y chicharrón crocante. Cero humo y cero desorden para el anfitrión.
2. **Academia de Charcutería Segaso (Próximamente):**
   * Talleres prácticos presenciales en Envigado: selección de cortes magros, especias naturales, técnica de embutido en tripa natural y curado al vacío.
   * Módulo de captura de interesados y lista de espera integrado en la plataforma.

---

## 6. ARQUITECTURA TÉCNICA DE LA PLATAFORMA

### 6.1. Filosofía de Ingeniería ($0 Costo / Local-First / Resiliente)
* **Frontend:** HTML5 semántico, CSS3 moderno con sistema de diseño propio (Crimson `#A61828` + Warm Cream `#F3ECDA`), Grid Bento y JavaScript vanilla reactivo.
* **Independencia Operativa:** La vitrina y el backoffice se sirven desde Node.js local (`http://localhost:3000`). El backoffice requiere el servidor para la API y SQLite; la vitrina puede abrirse en modo estático solo para consulta.
* **Persistencia:** SQLite en modo WAL con `better-sqlite3` para pedidos, inventario, usuarios y leads. El carrito de la vitrina usa `localStorage` como caché y para el modo offline; la fuente de verdad del backoffice es SQLite.
* **Seguridad Back Office:** Ruta `/chorizos-segaso/admin` protegida con login de correo y contraseña, hash scrypt, JWT HS256, `timingSafeEqual` y límite de 5 intentos por 5 minutos. Si falta `JWT_SECRET`, el servidor falla.
* **Pruebas:** 13/13 pruebas de dominio y E2E de 4 fases (catálogo, carrito, backoffice y consola), con 0 errores críticos de consola.
* **Enrutamiento de Pedidos:** Generador automático de mensajes estructurados hacia la API de WhatsApp de Harold (`300 236 7180`), con desglose de ítems, cantidades, dirección y método de pago.

---

## 7. ESTRATEGIA DE REDES SOCIALES Y MARKETING DIGITAL

### 7.1. Canales Oficiales Integrados
* **TikTok Oficial:** `https://www.tiktok.com/@segaso.chorizos` (Comunidad de 29.2K seguidores, 189.5K me gusta y 150 videos, enfocada en videos demostrativos de asados, tips de cocción y recetas con choripán).
* **Instagram Oficial:** `https://www.instagram.com/segaso.chorizos/?hl=es-la` (`@segaso.chorizos`, canal visual de marca para interactuar con amantes de la carne, clientes de eventos y restaurantes aliados).
* **WhatsApp Business:** Conexión directa desde el botón flotante y el checkout del carrito hacia la línea de atención de Harold.

---

## 8. IMPACTO FINANCIERO Y RESULTADOS ESPERADOS

1. **Ahorro en Costos de Desarrollo:** $0 COP en pagos de licencias SaaS (Shopify, Wix) y $0 en tokens de inteligencia artificial externa gracias al Asesor Virtual determinista.
2. **Incremento en Tasa de Conversión:** Reducción estimada del 60% en el tiempo de cierre de un pedido, ya que el cliente selecciona productos y cantidades de forma visual antes de contactar a Harold.
3. **Control de Mermas e Inventario:** Harold puede actualizar el stock en tiempo real desde el Back Office, evitando prometer referencias agotadas.

> **Nota de rigor:** las licencias y las pruebas son verificables; las cifras de conversión y tiempo son estimaciones y se presentan como tales. No se afirma un aumento de ventas que no se haya medido.

---

## 9. GUÍA DE SUSTENTACIÓN (14-NOV-2026)

La guía completa está en `docs/SUSTENTACION_2026/`:

- `01_GUIA_MAESTRA.md`: flujo de 10 minutos, transiciones y banco de preguntas.
- `02_GUIA_ANGELINA.md` a `06_GUIA_ISABEL.md`: una guía por expositor.
- `07_DEMO_MVP.md`: demo paso a paso con la app real.
- `08_CRONOGRAMA_Y_ROLES.md`: roles, semanas y mapa de 15 diapositivas.
- `09_ANEXO_MATRICES_EFI_EFE.md`: tablas y cálculos.

**Regla:** el objetivo general se lee literal; la demo se hace con la app Node + SQLite + JWT (no con un PIN); las cifras de tiempo son estimaciones y las licencias/pruebas son verificables.
