# Guía de exposición — María Vahos Villa

> **Rol:** Control y verificación de datos / ROI.
> **Semana:** 4 (14-nov).
> **Diapositiva propia:** 12. **También presentas:** 5 (DOFA), 6 (EFI/EFE) y 7 (PESTEL).
> **Tiempo:** 30 s en tu diapositiva; 90 s en las comunes.

---

## 1. Tu parte en una frase

**“El proyecto se sostiene con números: 0 COP de licencias, un objetivo general cumplido y un tablero de control.”**

---

## 2. Los 3 puntos que debes decir

1. **Costo:** el MVP no paga licencias mensuales; las referencias de mercado de Shopify y Wix están entre 75k y 120k COP al mes. El hardware y el internet ya existen en la empresa.
2. **Control:** el backoffice muestra ventas, ticket promedio, clientes únicos y producto más vendido; los pedidos y el inventario viven en SQLite.
3. **Cumplimiento:** el objetivo general se cumple porque el sistema almacena la información de clientes y pedidos de forma ágil; el ahorro de tiempo es una estimación, no una cifra inventada.

---

## 3. Guion de 90 segundos

> “Mi parte es el control y la verificación de datos. Lo primero fue comparar el costo: Shopify y Wix cobran entre 75k y 120k COP al mes, más comisiones. El MVP funciona con Node.js y SQLite, sin licencias recurrentes; el hardware y el internet ya los tiene la empresa.
>
> Lo segundo fue el control: el backoffice muestra ventas, ticket promedio, clientes únicos y producto más vendido. Cada pedido queda en SQLite y el inventario se descuenta. Eso le permite a Harold tomar decisiones con datos, no con memoria.
>
> Lo tercero es el objetivo general: ‘Establecer un sistema de seguimiento a los clientes mediante una estructura informática, que permita almacenar la información de una manera ágil para la empresa Segaso Chorizo S.A.S.’. El sistema lo cumple: guarda clientes, pedidos y stock en una estructura consultable.
>
> El ahorro de tiempo lo presentamos como estimación: antes eran 15 a 20 minutos por pedido; con el carrito, el pedido llega completo. No decimos que aumentamos las ventas un porcentaje que no hemos medido.”

---

## 4. La diapositiva 6: EFI/EFE en 30 segundos

> “La EFI quedó en 2.49: la empresa tiene producto y marca fuertes, pero procesos y liquidez débiles. La EFE quedó en 2.70: el entorno es favorable por la demanda de restaurantes, el canal digital y los asados a domicilio. El proyecto convierte la debilidad interna —procesos manuales— en una ventaja digital con costo 0.”

Las tablas completas están en `09_ANEXO_MATRICES_EFI_EFE.md`; no las pongas en la diapositiva.

---

## 5. La diapositiva 5: DOFA resumida

- **Fortalezas:** producto artesanal sin harinas ni extensores; reconocimiento Antójate de Antioquia; 29.2K seguidores en TikTok.
- **Debilidades:** equipo de 4 personas; procesos poco eficaces; 0 COP de capital de trabajo.
- **Oportunidades:** canal HORECA; asados al barril; ventas digitales.
- **Amenazas:** competencia industrial; costo de la carne; INVIMA e imitación.
- **Conclusión:** el problema es de proceso y distribución, no de producto; la plataforma ataca ese cuello de botella con costo 0.

---

## 6. La diapositiva 7: PESTEL tecnológica

- Digitalización de canales: TikTok e Instagram aterrizan en la vitrina.
- Automatización de pedidos y backoffice: menos trabajo manual.
- Marketing georreferenciado: Envigado, Sabaneta, Itagüí y Medellín.
- Riesgos: internet/energía, ciberseguridad y resistencia al cambio; se mitigan con operación local, respaldos y una interfaz simple.

**Idea de cierre:** “La tecnología es la variable que convierte la demanda de TikTok en pedidos medibles.”

---

## 7. Preguntas probables

1. **¿Cómo midieron el ahorro?**  
   Comparamos precios de referencia de Shopify y Wix y analizamos el proceso manual. El 0 COP de licencias es real; el ahorro de tiempo es una estimación.

2. **¿Cuál es el costo real?**  
   El hardware y el internet ya existen. El costo principal es el tiempo del equipo; no hay licencia mensual ni comisión por venta.

3. **¿Cómo escalaría?**  
   Primero se publica en un servidor con HTTPS y respaldos; si el volumen crece, SQLite se migra a PostgreSQL. El dominio y los contratos ya están separados.

4. **¿Cuál es el ROI?**  
   El retorno inmediato es evitar la mensualidad de una plataforma comercial. El ROI exacto depende del volumen de ventas; no inventamos un porcentaje.

5. **¿Por qué la EFI es 2.49 y la EFE 2.70?**  
   Las tablas están en el anexo. La EFI queda cerca del neutro por procesos y liquidez; la EFE es favorable por las oportunidades del entorno.

---

## 8. Lo que NO debes decir

- “Aumentamos las ventas X%”: no está medido.
- “El ROI es X%”: no hay una medición completa.
- “Costo 0” sin aclarar: el hardware, el internet y el tiempo del equipo existen.
- “3 horas diarias medidas”: es una estimación.
- “EFI 2.50 / EFE 2.80”: las cifras de esta versión son **2.49 / 2.70**.

---

## 9. Datos para memorizar

| Dato | Valor |
|---|---|
| Licencias del MVP | 0 COP |
| Referencia Shopify/Wix | 75k–120k COP/mes |
| EFI | 2.49 (neutra) |
| EFE | 2.70 (favorable) |
| Pruebas | 13/13 dominio + E2E 4 fases |
| Objetivo general | Cita literal de la diapositiva 4 |

---

## 10. Transición

> “Con los números claros, Isabel muestra cómo se auditó la calidad y qué pruebas respaldan el MVP.”
