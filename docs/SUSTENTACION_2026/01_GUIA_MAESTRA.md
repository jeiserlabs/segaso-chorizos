# Guía maestra de sustentación — Segaso Chorizos

> **Para:** Angelina, Brayan, Edison, María e Isabel.
> **Evento:** CESDE, 14-nov-2026.
> **Objetivo:** presentar el MVP real, con datos verificables, sin inventar cifras y con una demo que funcione.

---

## 1. La historia en una frase

**“Segaso no necesitaba una plataforma costosa: necesitaba ordenar el proceso. El MVP convierte el catálogo, el pedido y el control en un solo flujo digital, con 0 COP de licencias.”**

---

## 2. Flujo de 10 minutos

| Minuto | Qué pasa | Quién |
|---|---|---|
| 0:00–0:40 | Portada, empresa real, problema y pregunta | Angelina |
| 0:40–1:00 | Objetivo general literal | Angelina |
| 1:00–1:30 | DOFA resumida | María |
| 1:30–2:00 | EFI/EFE: solo resultados | María |
| 2:00–2:30 | PESTEL tecnológica | María |
| 2:30–2:45 | Equipo y cronograma | Brayan |
| 2:45–3:25 | Angelina: vitrina | Angelina |
| 3:25–4:25 | Brayan: backoffice | Brayan |
| 4:25–5:05 | Edison: WhatsApp | Edison |
| 5:05–5:35 | María: control y ROI | María |
| 5:35–6:05 | Isabel: pruebas y calidad | Isabel |
| 6:05–8:05 | Demo en vivo | Brayan + Edison |
| 8:05–8:45 | Cierre y gracias | Angelina |

**Margen:** 1 minuto para imprevistos.

---

## 3. Apertura (Angelina, 40 s)

> “Buenos días. Somos el equipo de Segaso Chorizos: Angelina, Brayan, Edison, María e Isabel. Segaso es una empresa real de Envigado, con NIT 1037619618-5, reconocida por Antójate de Antioquia, y una comunidad de 29.2K seguidores en TikTok.
>
> El problema no era el producto: era el proceso. Los pedidos llegaban por WhatsApp en conversaciones dispersas, sin control de stock y sin un canal digital propio. Por eso construimos un MVP con vitrina, carrito, backoffice y WhatsApp. Hoy les mostramos cómo quedó.”

---

## 4. Objetivo general (cita literal, no cambiar)

> **“Establecer un sistema de seguimiento a los clientes mediante una estructura informática, que permita almacenar la información de una manera ágil para la empresa Segaso Chorizo S.A.S.”**

---

## 5. Bloque estratégico (María, 90 s)

> “La DOFA se resume en cuatro ideas: producto y marca fuertes; equipo pequeño y procesos débiles; oportunidad en HORECA, asados y canal digital; amenazas de competencia, costo de la carne y normativa.
>
> La EFI quedó en 2.49, cerca del neutro: el producto es fuerte, pero los procesos y la liquidez pesan. La EFE quedó en 2.70: el entorno es favorable. La PESTEL la enfocamos en la variable tecnológica: digitalización de canales, automatización de pedidos, marketing georreferenciado y riesgos de internet y seguridad.
>
> La conclusión: el proyecto ataca la debilidad interna —procesos manuales— con una herramienta digital de costo 0.”

Las tablas completas están en `09_ANEXO_MATRICES_EFI_EFE.md`. En el bloque solo van los resultados.

---

## 6. Resumen de cada estudiante (para el bloque y la transición)

### Angelina — Mercadeo, identidad y vitrina (semana 1)
> “Ordené el catálogo de 9 referencias con precios oficiales y 450 g netos, y construí la vitrina responsive con fotos reales, carrito y conexión a WhatsApp. El cliente arma el pedido antes de escribir.”

### Brayan — Tecnología líder, backoffice (semana 2)
> “Construí el backoffice con Node.js nativo, SQLite WAL, JWT y scrypt. El panel muestra KPIs, pedidos e inventario, y la FSM ordena el ciclo del pedido. Son 23/23 pruebas de dominio y un E2E de 5 fases.”

### Edison — Auxiliar de tecnología, WhatsApp (semana 3)
> “Diseñé el mensaje estructurado de WhatsApp con código, detalle, descuento y total. El pedido llega completo y Harold no tiene que perseguir datos. El cupón SEGASO10 aplica 10%.”

### María — Control y verificación de datos / ROI (semana 4)
> “Comparé el costo con Shopify y Wix: 75k–120k COP/mes frente a 0 COP del MVP. Definí los KPIs y verifiqué el objetivo general. El ahorro de tiempo es una estimación; las licencias son 0.”

### Isabel — Departamento de control (semana 4)
> “Ejecuté el E2E de 5 fases: catálogo 9/9, carrito, backoffice, gate de calidad de página, inventario 9/9 y consola limpia. Validé datos obligatorios, stock y cadena de frío. En el flujo E2E no hubo errores críticos.”

---

## 7. Demo (Brayan + Edison, 2 min)

1. **Vitrina:** abre `http://localhost:3000`, muestra las 9 tarjetas y las fotos reales de TikTok.
2. **Carrito:** agrega 2 Caserito Paisa, muestra el total 39.8k COP y aplica SEGASO10.
3. **Pedido:** llena nombre, teléfono, dirección y ciudad; genera el mensaje de WhatsApp y muéstralo sin enviarlo.
4. **Backoffice:** abre `/chorizos-segaso/admin`, inicia sesión, muestra KPIs, un pedido, el cambio de estado y el inventario 9/9.
   - Los tres pedidos que trae la base al sembrarla están marcados `DEMO` y **no suman** en los KPIs. Por eso, antes de hacer el pedido en vivo del paso 3, las ventas dicen 0 COP. Es el punto fuerte, no un fallo: si preguntan por las cifras, la respuesta es que el panel separa datos de demostración de ventas reales y que el pedido que ustedes acaban de crear es el primero que aparece en la facturación.
5. **Cierre de demo:** “Todo esto corre en local, con 0 COP de licencias y datos en SQLite.”

El paso a paso detallado está en `07_DEMO_MVP.md`.

---

## 8. Cierre (Angelina, 30 s)

> “En resumen: Segaso no necesitaba una plataforma costosa; necesitaba ordenar el proceso. Con un MVP local, 0 COP de licencias y datos reales, la empresa pasa de chats dispersos a un catálogo, un pedido estructurado y un backoffice con control.
>
> El siguiente paso es publicarlo con HTTPS, respaldos y pagos en línea. Gracias.”

---

## 9. Banco de preguntas

| Pregunta | Quién responde | Respuesta corta |
|---|---|---|
| ¿Por qué no Shopify o Wix? | María / Angelina | 75k–120k COP/mes vs 0 COP; control y datos propios. |
| ¿Cómo se desarrolló el backoffice? | Brayan | Node.js nativo, SQLite WAL, JWT + scrypt, FSM y KPIs. |
| ¿Cómo protegen la contraseña? | Brayan | scrypt con sal + `timingSafeEqual`; JWT HS256 de 24 h; límite de intentos. |
| ¿Qué pasa si se cae el internet? | Brayan / Edison | La vitrina y el backoffice son locales; WhatsApp sí necesita internet. |
| ¿Es un bot automático? | Edison | No; la página tiene un asesor determinista y WhatsApp es un traspaso humano. |
| ¿Cómo calculan el flete? | Edison | Se captura la ciudad y se confirma por WhatsApp; la automatización es el siguiente paso. |
| ¿Cómo midieron el ahorro o el ROI? | María | Precios de referencia + análisis del proceso; el 0 COP de licencias es real, el tiempo es estimación. |
| ¿Qué pruebas hicieron? | Isabel | 23/23 dominio + E2E de 5 fases; 0 errores críticos en consola. |
| ¿Cómo garantizan la cadena de frío? | Isabel | Sellado al vacío, 60 días congelado, lote/vencimiento y gel refrigerante. |
| ¿Cómo escalaría? | Brayan / María | Servidor con HTTPS y respaldos; SQLite a PostgreSQL si crece el volumen. |
| ¿Por qué 450 g? | Angelina | Es el peso neto del rótulo real: 450 g / 5 unidades. |
| ¿Por qué EFI 2.49 y EFE 2.70? | María | Tablas en el anexo; interna neutra, externa favorable. |

**Si no saben una respuesta:** “No lo medimos; lo tenemos como estimación. Lo verificamos y te lo compartimos.” Nunca inventen.

---

## 10. Reglas de oro

- No decir **PIN 1234** ni **localStorage**: la app real usa JWT + scrypt + SQLite.
- No decir **500 g**: son **450 g netos**.
- No decir **100% carne magra**: el rótulo incluye tocino; digan **sin harinas ni extensores**.
- No decir **bot 24/7**, **nube** o **microservicios**.
- No decir **“0% de errores”** como si fuera una medición de todos los pedidos reales; digan **“0 errores críticos en el E2E”**.
- No leer los bloques: cada uno cuenta su parte con sus palabras.
- El objetivo general se lee literal; no se parafrasea.

---

## 11. Versión de 5 minutos

| Bloque | Tiempo |
|---|---|
| Portada, empresa, problema y objetivo | 40 s |
| DOFA + EFI/EFE + PESTEL | 50 s |
| Equipo y cronograma | 15 s |
| Una frase por estudiante | 75 s |
| Demo express (vitrina + admin + FSM) | 120 s |
| Cierre | 20 s |

Si el tiempo aprieta, las matrices y el detalle quedan para las preguntas.

---

## 12. Plan B

- **Si falla el servidor:** abrir las capturas de `CAPTURAS/` y explicar el flujo con ellas.
- **Si falla el internet:** la vitrina, el backoffice y los videos locales siguen funcionando; el WhatsApp se muestra sin enviar.
- **Si falla el proyector:** usar la pantalla del portátil y el PDF de la presentación.
- **Si el profesor pide otra cosa:** respirar, escuchar y responder con los datos del anexo; no improvisar cifras.

---

## 13. Checklist del día

- [ ] Portátil cargado y cargador.
- [ ] Servidor corriendo y pestañas de vitrina/admin abiertas.
- [ ] `.env` con `JWT_SECRET` y `ADMIN_SEED_PASSWORD`.
- [ ] `videos/` con las 5 fotos, 4 portadas y 4 videos.
- [ ] Respaldo `segaso.db.bak`.
- [ ] Capturas de respaldo en `CAPTURAS/`.
- [ ] PDF de la presentación.
- [ ] Celular con internet para WhatsApp (opcional).
- [ ] Llegar 15 minutos antes y probar el proyector.
