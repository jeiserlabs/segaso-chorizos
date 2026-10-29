# Prompt maestro — Video promocional Segaso con Gemini/Veo

> **Uso:** sube a Gemini los assets de `SELECCION/` (o los de `media/social/`) y pega el prompt que corresponda. No pidas un video de 30 s en una sola generación: genera por escenas y edita.

---

## 1. Assets que debes subir

### Contact sheets (para el análisis)
- `contact_sheets/tiktok.jpg`
- `contact_sheets/instagram.jpg`
- `contact_sheets/facebook.jpg`

### Fotos reales
- `photos/photo_01.jpg` — empaque y rótulo.
- `photos/photo_02.jpg` — parrilla y color.
- `photos/photo_03.jpg` — Santarrosano en la mano.
- `photos/photo_04.jpg` — carne y elaboración.
- `photos/photo_05.jpg` — Picante y Argentino.

### Keyframes recomendados
- `keyframes/7128213952567315718_01.jpg` — parrilla con chorizo.
- `keyframes/7332557830999919877_02.jpg` — producción/corte.
- `keyframes/7470531437788155141_01.jpg` — choripanes con chimichurri.
- `keyframes/7128213952567315718_03.jpg` — cuchillo y choripán.
- `keyframes/7137390171976109317_02.jpg` — chicharrón con plátano.
- `keyframes/7674733063032540437_02.jpg` — chorizo en la mano.
- `CAPTURAS/01_vitrina.png` — vitrina real.
- `CAPTURAS/03_carrito.png` — carrito real.

### Clips de referencia
- `clips/7128213952567315718.mp4`
- `clips/7332557830999919877.mp4`
- `clips/7470531437788155141.mp4`
- `clips/7137390171976109317.mp4`

---

## 2. Prompt de análisis (Gemini)

~~~text
Eres editor senior de video gastronómico y director de arte. Analiza los contact sheets, clips y keyframes adjuntos de Segaso Chorizos.

Objetivo: seleccionar los 8 mejores planos para un comercial vertical de 30 segundos, con tono premium, cálido y artesanal.

Devuelve una tabla con:
1. Archivo y timecode del clip (si aplica).
2. Qué se ve exactamente.
3. Por qué funciona para el comercial.
4. Lugar en la estructura: hook, origen, empaque, héroe, textura, mesa, digital o cierre.
5. Riesgo: menores de edad, manos deformes, desenfoque, texto encima, comida poco apetitosa o marca ilegible.

Reglas:
- No inventes planos que no estén en los archivos.
- Descarta cualquier primer plano de menores de edad.
- Prioriza producto visible, fuego, textura, empaque real y mesa.
- No propongas texto generado dentro de la imagen; el texto se agrega en edición.
- Al final, recomienda un orden de 8 planos y un plan B para cada uno.
~~~

---

## 3. Brief creativo (para Gemini o para el editor)

~~~text
Crea un comercial de 30 segundos para Segaso Chorizos, empresa artesanal de Envigado, Antioquia.

Concepto: “El fuego se hereda”. La tradición no se inventa; se transmite.
Tono: premium, cálido, familiar, real. Nada de estética de supermercado.
Formato master: 9:16, 1080x1920, 24 fps, 30 s. Versión secundaria 16:9.
Paleta: tinto #A61828, dorado #E5A93C, crema #F3ECDA, carbón #120C0E.
Luz: ámbar cálida, sombras tinto, altas luces crema.
Cámara: push-in lento, poca profundidad de campo, grano suave, sin cortes rápidos.
Audio: cumbia/porro moderna con guitarra y percusión, sin voz ni samples con copyright; brasas y sizzle.
Voz: adulto cálido, español de Colombia, ritmo pausado.

Estructura:
0–3 s: parrilla y brasas; “No es un chorizo. Es una tradición.”
3–7 s: producción y carne; “Carne de cerdo seleccionada. Sin harinas ni extensores.”
7–12 s: empaque real; “9 referencias · 450 g netos · 60 días al vacío.”
12–18 s: choripanes y chicharrón; “Del barril a tu mesa.”
18–23 s: mesa y familia; “Asados, recetas y familia.”
23–27 s: vitrina y carrito reales; “Pide fácil: catálogo, carrito y WhatsApp.”
27–30 s: logo y CTA; “Segaso Chorizos. Tradición que se comparte.”

No inventes el empaque, los precios ni los ingredientes. Usa las fotos reales como referencia exacta.
No incluyas menores de edad. No escribas texto dentro de la imagen; se agrega en edición.
~~~

---

## 4. Prompts por escena (Veo image-to-video)

### Escena 1 — Hook (3 s)
~~~text
Vertical 9:16, 3 segundos. Macro de chorizo y costilla sobre parrilla de carbón, mano tostando un pan, brasas, humo y jugos chisporroteando. Push-in lento. Luz ámbar cálida, sombras tinto, 24 fps, poca profundidad de campo. Usa como referencia visual exacta el keyframe 7128213952567315718_01.jpg. Sin texto, sin logo, sin caras.
~~~

### Escena 2 — Origen (4 s)
~~~text
Vertical 9:16, 4 segundos. Manos con guantes negros acomodando chorizos frescos en una bandeja de acero; carne de cerdo con pimentón y cebolla; cocina de producción real. Luz de ventana, tono documental cálido, cámara lenta. Referencia: keyframes 7332557830999919877_02.jpg y 7647508434874649877_02.jpg. Sin caras, sin texto.
~~~

### Escena 3 — Empaque (5 s)
~~~text
Vertical 9:16, 5 segundos. Empaque real de Segaso sobre tabla de madera, sello al vacío, rótulo legible, zoom lento al detalle. Usa como referencia exacta photo_01.jpg y photo_03.jpg. Conserva el rótulo, los colores y la tipografía; no inventes otra marca ni cambies el texto. Luz cálida lateral, fondo oscuro. Sin texto adicional.
~~~

### Escena 4 — Héroe (6 s)
~~~text
Vertical 9:16, 6 segundos. Bandeja de choripanes con chimichurri, chorizo brillante, vapor suave, cámara push-in. Referencia exacta: keyframe 7470531437788155141_01.jpg. Comida apetitosa, luz ámbar, 24 fps. Sin caras, sin texto.
~~~

### Escena 5 — Textura (5 s)
~~~text
Vertical 9:16, 5 segundos. Cuchillo cortando un choripán en tabla de madera, jugos y migas; corte a mano sosteniendo un chorizo. Referencia: keyframes 7128213952567315718_03.jpg y 7674733063032540437_02.jpg. Macro, cámara lenta, luz cálida. Sin texto, sin caras.
~~~

### Escena 6 — Mesa (5 s)
~~~text
Vertical 9:16, 5 segundos. Mesa de asado al atardecer: chicharrón con plátano, chorizo, manos sirviendo, ambiente familiar. Referencia: keyframe 7137390171976109317_02.jpg. Solo comida y manos adultas; no rostros de menores. Luz cálida, movimiento suave.
~~~

### Escena 7 — Digital (4 s)
~~~text
No generes una interfaz falsa. Usa la captura real 01_vitrina.png y 03_carrito.png. En edición, anima un push-in de teléfono sobre madera y muestra la pantalla real. Si necesitas una mano, que sea adulta y sostenga un teléfono; la pantalla debe ser la captura real. Sin texto generado.
~~~

### Escena 8 — Cierre (3 s)
~~~text
No generes texto ni logo. Usa el logo real logo_segaso.svg y la foto photo_05.jpg. Fondo de brasas suaves, movimiento mínimo, espacio limpio para el CTA que se agrega en edición. No deformes el logo.
~~~

---

## 5. Prompt para la voz en off

~~~text
Escribe una voz en off de 30 segundos en español de Colombia para Segaso Chorizos. Tono cálido, artesanal, seguro; sin exagerar el acento paisa. Usa exactamente estos datos: carne de cerdo seleccionada, sin harinas ni extensores; 9 referencias; 450 g netos; 60 días congelado; asados, recetas y familia; catálogo, carrito y WhatsApp. No digas 500 g, “100% carne magra”, “bot 24/7” ni precios no confirmados. Cierra con “Segaso Chorizos. Tradición que se comparte.” Entrega el texto con marcas de tiempo cada 4–5 segundos.
~~~

---

## 6. Prompt para el editor (CapCut/Premiere/Gemini)

~~~text
Ensambla un comercial vertical de 30 s con los clips y keyframes adjuntos, siguiendo el storyboard de Segaso Chorizos.
- 9:16, 1080x1920, 24 fps.
- Orden: hook de parrilla, origen/producción, empaque, choripanes, textura, mesa, vitrina real, cierre con logo.
- Agrega la voz en off y la música indicadas; no inventes tomas nuevas.
- Agrega los textos del storyboard en crema, con fondo tinto semitransparente y márgenes seguros.
- No uses primeros planos de menores.
- No generes una UI falsa: usa la captura real de la vitrina y el carrito.
- Exporta 9:16 y 16:9, con SRT y versión con subtítulos quemados.
~~~

---

## 7. Negative prompt

~~~text
No menores de edad, no rostros de niños, no manos deformes, no comida plástica, no empaque inventado, no marca distinta, no texto generado con errores, no logo deformado, no UI falsa, no “500 g”, no “100% carne magra”, no “bot 24/7”, no precios inventados, no música con copyright, no watermark, no saturación excesiva, no cortes rápidos, no estética de supermercado.
~~~

---

## 8. Especificaciones y control de calidad

- **Master:** 1080 × 1920, 30 s, 24 fps, H.264, AAC, 9:16.
- **Horizontal:** 1920 × 1080, 30 s, 16:9.
- **Cortes:** 15 s y 6 s.
- **Texto:** crema sobre tinto; máximo 6 palabras por línea; sin texto sobre caras.
- **Audio:** voz -14 LUFS, música -22 LUFS, efectos -24 LUFS; techo -2 dBFS.
- **Control:** empaque legible, 450 g correcto, sin menores, sin UI falsa, logo intacto, SRT incluido.
- **Entrega:** MP4 9:16, MP4 16:9, SRT, miniatura y versión con subtítulos quemados.
