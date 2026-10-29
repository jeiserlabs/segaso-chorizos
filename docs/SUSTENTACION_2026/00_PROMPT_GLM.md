# Prompt maestro para GLM / z.ai — Sustentación Segaso

> **Cómo usarlo:** adjunta las 5 fotos de `videos/tiktok_fotos/` (o de `IMAGENES_TIKTOK/` en el paquete) y pega todo el bloque de abajo en z.ai. Si GLM se desvía, usa el prompt de corrección del final.
>
> **Antes de generar:** verifica que las fotos adjuntas sean las reales de Segaso. No uses fotos de stock.

---

~~~text
Actúa como diseñador senior de presentaciones académicas y editor de contenido. Vas a construir una presentación de 15 diapositivas para la sustentación del proyecto Segaso Chorizos en CESDE, el 14 de noviembre de 2026.

IDIOMA Y AUDIENCIA
- Español de Colombia, claro y profesional.
- Audiencia: profesor y compañeros de CESDE.
- Duración: 10 minutos. El equipo expone con sus palabras; las diapositivas no se leen.
- Tono: seguro, concreto, sin adornos.

MISIÓN
- Crear una presentación sencilla, elegante y legible, con los puntos más importantes.
- Cada estudiante tiene una diapositiva propia; las diapositivas comunes son contexto, estrategia y cierre.
- La demo se hace en vivo con la app local; la diapositiva 14 solo guía la demo.

DATOS QUE DEBES USAR (NO INVENTES NADA)
- Empresa: Segaso Chorizos de Tradición, Envigado, Antioquia. NIT 1037619618-5. Cámara de Comercio Aburrá Sur. Reconocimiento Antójate de Antioquia, Renglón 1288.
- Producto: 9 referencias de chorizo artesanal, paquetes x5 unidades, 450 g netos, 60 días de vida útil en congelación, sin harinas, almidones, féculas ni extensores de soya.
- Precios: rango oficial de 19.9k a 24.6k COP por paquete; el chimichurri cuesta 14.5k COP. No cambies precios.
- Comunidad: TikTok @segaso.chorizos con 29.2K seguidores, 189.5K me gusta y 150 videos. Instagram @segaso.chorizos.
- Equipo: Angelina Rojas (mercadeo, identidad y vitrina, semana 1), Brayan Álvarez (tecnología líder y back office, semana 2), Edison Galván (auxiliar de tecnología y WhatsApp, semana 3), María Vahos Villa (control y verificación de datos, semana 4), Isabel Rey (departamento de control, semana 4).
- Problema: pedidos por WhatsApp en conversaciones dispersas; 15 a 20 minutos por cliente; inventario en libreta; 29.2K seguidores en TikTok sin un canal propio de compra.
- Solución: vitrina web con 9 productos, carrito, cupón SEGASO10 (10% en la primera compra), mensaje estructurado a WhatsApp y back office para Harold.
- Tecnología: Node.js nativo (sin Express), SQLite en modo WAL con better-sqlite3, autenticación con scrypt y JWT HS256, contratos Zod v4 y TypeScript, pruebas de dominio 13/13 y E2E de 4 fases (catálogo, carrito, backoffice y consola). 0 errores críticos de consola en el E2E.
- Costos: 0 COP de licencias. Referencia de mercado: Shopify y Wix cuestan entre 75k y 120k COP al mes, más comisiones. El hardware y el internet ya existen en la empresa.
- DOFA resumida: fortalezas = producto artesanal sin harinas ni extensores, reconocimiento Antójate de Antioquia, 29.2K en TikTok; debilidades = equipo de 4 personas, procesos poco eficaces, 0 COP de capital de trabajo; oportunidades = canal HORECA, asados al barril, ventas digitales; amenazas = competencia industrial, costo de la carne, INVIMA e imitación.
- EFI: 2.49 sobre 4.00. Lectura: posición interna neutra; producto y marca fuertes, procesos y liquidez débiles.
- EFE: 2.70 sobre 4.00. Lectura: posición externa favorable; la demanda HORECA y el canal digital superan la competencia y los costos.
- PESTEL: enfocar SOLO la variable tecnológica: digitalización de canales, automatización de pedidos y stock, marketing georreferenciado y riesgos de internet/energía/seguridad.
- Objetivo general (cita literal, no modificar): “Establecer un sistema de seguimiento a los clientes mediante una estructura informática, que permita almacenar la información de una manera ágil para la empresa Segaso Chorizo S.A.S.”
- Resultados que puedes mostrar: catálogo 9/9, carrito con 2 unidades y 10% de descuento, pedido creado en SQLite, inventario 9/9, 13/13 pruebas de dominio, E2E de 4 fases, 0 errores críticos de consola.
- Estimaciones: el tiempo de respuesta de 15–20 minutos a menos de 30 segundos es una estimación; el ahorro de tiempo también. Marca estas cifras con “(estimado)”. No inventes ventas, clientes, porcentajes de crecimiento ni ROI.

PROHIBIDO
- No digas PIN 1234 ni localStorage: la app real usa JWT HS256, scrypt y SQLite WAL.
- No digas 500 g: son 450 g netos.
- No digas “100% carne magra”: el rótulo incluye tocino. Di “sin harinas ni extensores”.
- No digas “bot 24/7”, “nube”, “microservicios”, “React” ni “Express”.
- No inventes cifras, clientes, ventas, premios ni fechas.
- No incluyas las tablas completas de DOFA, EFI, EFE o PESTEL: solo los resultados y los puntos clave.
- No uses emojis, clipart, fotos de stock, gradientes fuertes ni sombras.
- No uses el símbolo de pesos con números; escribe “COP” o “k COP”.

ESTILO VISUAL
- Formato 16:9, 13.333 x 7.5 pulgadas.
- Fondo crema cálido #F7F4EE; texto carbón #1D1B18; acento borgoña #7C101C; acento dorado #C8A24A; gris #6B6560.
- Tipografía: Inter o Manrope para todo el cuerpo; Fraunces o Playfair Display solo para el título de la portada. Si no están disponibles, usa Arial o Georgia.
- Títulos de 36 a 44 pt; cuerpo de 18 a 22 pt; números grandes de 64 a 80 pt; pies de foto de 12 a 14 pt.
- Márgenes de 0.6 pulgadas; texto alineado a la izquierda; una idea por diapositiva.
- Máximo 5 viñetas por diapositiva; ideal 3. Sin párrafos largos.
- Línea fina dorada como separador y pie de página: “Segaso Chorizos · CESDE 2026 · [número]”.
- Usa SOLO las 5 fotos reales adjuntas. Recórtalas en 4:5, con esquinas redondeadas de 12 px, sin estirarlas y sin texto encima. Si una foto no encaja, usa un panel borgoña liso con una frase corta, no una foto de stock.
- Las fotos son:
  1. Empaque con el rótulo “Lo que debes saber antes de llevarlo a tu mesa”.
  2. Parrilla con la frase “El color no demuestra la calidad”.
  3. Empaque Santarrosano en la mano con “Siempre empieza por los ingredientes”.
  4. Carne molida con “Conoce también quién lo hace”.
  5. Empaques Picante y Argentino con “La confianza empieza con saber qué eliges”.

ESTRUCTURA EXACTA (15 DIAPOSITIVAS)
1. Portada.
   Título: “Segaso Chorizos: del WhatsApp al pedido digital”.
   Subtítulo: “Vitrina, carrito y backoffice para una empresa real de Envigado”.
   Equipo: los 5 nombres. Fecha: 14 de noviembre de 2026. CESDE.
   Imagen: foto 1 o foto 5, a la derecha. Pie: “Foto real del TikTok @segaso.chorizos”.

2. La empresa.
   Título: “Una empresa real, no un caso inventado”.
   Cuatro datos en una cuadrícula: “Envigado, Antioquia · NIT 1037619618-5”; “Antójate de Antioquia · Renglón 1288”; “29.2K seguidores · 189.5K me gusta · 150 videos”; “9 referencias · 450 g netos · 60 días congelado”.
   Imagen: foto 3. Pie: “Fotos reales del TikTok @segaso.chorizos”.

3. El problema.
   Título: “El producto era bueno; el proceso no”.
   Tres viñetas: “Pedidos por WhatsApp en conversaciones dispersas: 15–20 min por cliente”; “Inventario en libreta: se prometían productos agotados”; “29.2K seguidores en TikTok sin un canal propio de compra”.
   Pregunta al pie, en borgoña: “¿Cómo ordenar el catálogo, el pedido y el stock sin pagar una plataforma costosa?”.

4. Objetivo general.
   Título: “Objetivo general”.
   Cita literal en un recuadro grande, sin cambiar ni una palabra: “Establecer un sistema de seguimiento a los clientes mediante una estructura informática, que permita almacenar la información de una manera ágil para la empresa Segaso Chorizo S.A.S.”.
   Nota pequeña: “Cita literal del documento académico”.

5. DOFA.
   Título: “DOFA: producto fuerte, procesos débiles”.
   Matriz 2x2 con máximo 3 viñetas por cuadrante:
   Fortalezas: producto sin harinas ni extensores; Antójate de Antioquia; 29.2K en TikTok.
   Debilidades: equipo de 4 personas; procesos poco eficaces; 0 COP de capital de trabajo.
   Oportunidades: canal HORECA; asados al barril; ventas digitales.
   Amenazas: competencia industrial; costo de la carne; INVIMA e imitación.
   Conclusión al pie: “El cuello de botella es el proceso, no el producto”.

6. EFI y EFE.
   Título: “EFI y EFE: los resultados”.
   Dos tarjetas grandes:
   EFI 2.49 / 4.00. “Posición interna neutra. Producto y marca fuertes; procesos y liquidez débiles”.
   EFE 2.70 / 4.00. “Posición externa favorable. La demanda HORECA y el canal digital superan la competencia y los costos”.
   Nota: “Punto neutro: 2.50. Tablas completas en el anexo”. No pongas las tablas.

7. PESTEL.
   Título: “PESTEL: la variable tecnológica”.
   Cuatro viñetas: “Digitalización de canales: TikTok e Instagram aterrizan en la vitrina”; “Automatización: pedidos, stock y KPIs en un solo panel”; “Marketing georreferenciado: Envigado, Sabaneta, Itagüí y Medellín”; “Riesgos: internet/energía, seguridad y resistencia al cambio”.
   Cierre: “La tecnología convierte la demanda de TikTok en pedidos medibles”.

8. Equipo y cronograma.
   Título: “Un equipo, cinco frentes”.
   Tabla de 5 filas: Angelina — Mercadeo, identidad y vitrina — Semana 1 (1-sep); Brayan — Tecnología líder, back office — Semana 2; Edison — Auxiliar de tecnología, WhatsApp — Semana 3; María — Control y verificación de datos — Semana 4 (14-nov); Isabel — Departamento de control — Semana 4 (14-nov).
   Sin foto.

9. Angelina.
   Etiqueta: “Semana 1 · Mercadeo, identidad y vitrina”.
   Título: “La vitrina convierte el catálogo en una experiencia”.
   Tres viñetas: “9 referencias con precio oficial 2026, 450 g netos y ficha de producto”; “Vitrina responsive con fotos reales, carrito y total en vivo”; “TikTok e Instagram aterrizan en la web; el pedido sigue por WhatsApp”.
   Métrica: “9/9 productos · carrito validado en E2E”.
   Imagen: foto 3. Pie: “Foto real de @segaso.chorizos”.

10. Brayan.
    Etiqueta: “Semana 2 · Tecnología líder, back office”.
    Título: “El backoffice es el cerebro operativo”.
    Tres viñetas: “Node.js nativo + SQLite WAL: sin frameworks pesados, 0 COP de licencias”; “JWT HS256 + scrypt: el panel de Harold queda protegido”; “FSM de pedidos, KPIs e inventario en tiempo real”.
    Diagrama simple de 3 cajas: “Navegador → Node.js → SQLite”, con “JWT” sobre la flecha.
    Métrica: “13/13 pruebas de dominio · E2E 4 fases”.

11. Edison.
    Etiqueta: “Semana 3 · Auxiliar de tecnología, WhatsApp”.
    Título: “El pedido llega completo, no en 20 mensajes”.
    Tres viñetas: “Mensaje estructurado: código, cliente, dirección, pago, detalle y total”; “Cupón SEGASO10: 10% en la primera compra”; “El cliente arma el pedido antes de escribir; Harold recibe todo listo”.
    Métrica: “15–20 min → menos de 30 s (estimado)”.
    Puedes usar una burbuja de chat simple con los campos del pedido; sin logo de WhatsApp.

12. María.
    Etiqueta: “Semana 4 · Control y verificación de datos”.
    Título: “Números que se sostienen”.
    Tres viñetas: “0 COP de licencias vs 75k–120k COP/mes de Shopify/Wix (referencia)”; “KPIs: ventas, ticket promedio, clientes únicos y producto más vendido”; “Objetivo general cumplido: clientes y pedidos en una estructura ágil”.
    Números grandes: “0 COP” y “2.49 / 2.70”.
    Sin foto.

13. Isabel.
    Etiqueta: “Semana 4 · Departamento de control”.
    Título: “La calidad se prueba, no se promete”.
    Tres viñetas: “E2E de 4 fases: catálogo, carrito, backoffice y consola”; “Inventario 9/9 y stock descontado en el flujo”; “Rótulo 450 g, 60 días congelado, lote/vencimiento y cadena de frío”.
    Métricas: “0 errores críticos en consola · 9/9 inventario”.
    Sin foto.

14. Demo.
    Título: “Demo: el MVP en vivo”.
    Cuatro pasos: “Vitrina: 9 productos y fotos reales”; “Carrito: 2 Caserito Paisa + SEGASO10”; “Backoffice: login, KPIs, FSM e inventario”; “Cierre: 0 COP de licencias”.
    Nota: “Se abre en el portátil; no es un QR de internet”.
    Imagen: foto 5 pequeña.

15. Cierre.
    Título: “De chats dispersos a un negocio ordenado”.
    Tres viñetas: “El problema era el proceso, no el producto”; “El MVP funciona en local, con datos reales y 0 COP de licencias”; “Siguiente paso: HTTPS, respaldos y pagos en línea”.
    “Gracias” + nombres del equipo + @segaso.chorizos.
    Imagen: collage de las 5 fotos o foto 5.

FORMATO DE SALIDA
1. Primero entrega una tabla de 15 filas con: número, título, contenido exacto, imagen y nota breve del expositor.
2. Después genera la presentación editable en 16:9 (PPTX o Google Slides), con texto editable y sin texto dentro de las imágenes.
3. No agregues diapositivas extra. Si necesitas más espacio, usa el anexo, no la presentación.
4. No uses animaciones ni transiciones; debe verse bien exportada a PDF.
5. Incluye notas del expositor breves en cada diapositiva, basadas en el contenido; no las pongas en el cuerpo de la diapositiva.

CHECKLIST FINAL
- 15 diapositivas, 16:9.
- Ninguna diapositiva con más de 5 viñetas.
- El objetivo general está literal.
- EFI 2.49 y EFE 2.70, sin tablas completas.
- 450 g netos, no 500 g.
- Sin PIN 1234, sin localStorage, sin “100% carne magra”, sin “bot 24/7”, sin “nube”.
- Solo las 5 fotos reales adjuntas.
- Texto legible en proyector: contraste alto y cuerpo de 18 pt o más.
- Exporta también un PDF de respaldo.
~~~

---

## Prompt de corrección (si GLM se desvía)

~~~text
Revisa la presentación contra el brief anterior y corrige:
1. Cualquier cifra que no esté en el brief (ventas, clientes, ROI, porcentajes, fechas).
2. Cualquier mención a PIN 1234, localStorage, 500 g, “100% carne magra”, “bot 24/7”, “nube”, “microservicios”, “React” o “Express”.
3. Cualquier diapositiva con más de 5 viñetas o párrafos largos.
4. El objetivo general debe quedar literal, sin cambios.
5. Las únicas imágenes permitidas son las 5 fotos reales adjuntas.
6. EFI debe decir 2.49 y EFE 2.70; no incluyas las tablas completas.
Devuelve la tabla de 15 diapositivas corregida y el PPTX editable en 16:9.
~~~

---

## Checklist para Jeiser antes de dar el visto bueno

- [ ] La portada tiene los 5 nombres y la fecha 14-nov-2026.
- [ ] La empresa muestra NIT, Antójate de Antioquia y 29.2K/189.5K/150.
- [ ] El problema habla de WhatsApp, stock y canal digital, no de “falta de página” solamente.
- [ ] El objetivo general está literal.
- [ ] La DOFA tiene máximo 3 puntos por cuadrante.
- [ ] EFI/EFE solo muestran 2.49 y 2.70 con una lectura corta.
- [ ] La PESTEL es tecnológica y tiene 4 puntos.
- [ ] Hay una diapositiva por estudiante (9 a 13).
- [ ] Brayan explica el backoffice real (JWT/SQLite), no el PIN.
- [ ] La demo tiene 4 pasos y no promete un QR de internet.
- [ ] No aparece “500 g”, “100% magra”, “PIN 1234” ni “nube”.
- [ ] Las fotos son las reales y no están deformadas.
- [ ] El PDF de respaldo se ve bien.
