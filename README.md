# Segaso Chorizos — Plataforma Web & Sistema de Gestión (Envigado)

Plataforma integral de comercio electrónico, gestión de pedidos y marketing digital para **Segaso Chorizos de Tradición** (Envigado, Antioquia).

---

## 🥩 Propuesta de Valor y Características

- **Landing Page & Catálogo:** Interfaz rápida y responsiva con paleta de colores corporativa (Borgoña `#7C101C`, Dorado Brasas `#E5A93C`, Carbón `#0E080A`).
- **Carrito de Compras 1-Click:** Validación y cálculo en vivo sin recargas, con despacho estructurado directo al WhatsApp de Harold.
- **Asados al Barril (Catering):** Sección para cotización de eventos desde 5 comensales en adelante con maestro parrillero.
- **Bot Asesor Virtual 24/7:** Respuestas instantáneas a preguntas frecuentes (gluten, conservación, tiempos de cocción, etc.).
- **Integración TikTok:** Reproductor nativo HTML5 H.264 de alta velocidad (60 fps) con videos reales y miniaturas de alta definición sin bloqueos de cookies de terceros.
- **Back Office Administrativo Seguro:** Endpoint privado `/chorizos-segaso/admin` protegido con autenticación JWT (RFC 7519) y contraseñas cifradas con `scrypt`.
- **Base de Datos SQLite (WAL):** Persistencia transaccional local sin depender de servicios pagos.

---

## 📋 Catálogo Oficial de Productos

| Referencia | Características | Presentación | Precio |
| :--- | :--- | :--- | :--- |
| **Chorizo Caserito Paisa** | Sabor tradicional casero, cebolla junca y comino | x 5 und (500g) | 19.9k COP |
| **Chorizo Antioqueño** 🇳🇬 | El rey paisa con trozos enteros de tocino | x 5 und (500g) | 23.6k COP |
| **Chorizo Santarrosano** 🇨🇴 | Receta típica risaraldense con hierbas finas | x 5 und (500g) | 23.8k COP |
| **Chorizo Tocineta** 🥓 | Tocineta ahumada entreverada | x 5 und (500g) | 23.8k COP |
| **Chorizo Parrillero** 🍴 | Calibre grueso para brasa abierta | x 5 und (500g) | 23.8k COP |
| **Chorizo Picante** 🌶️ | Ají criollo fermentado equilibrado | x 5 und (500g) | 24.2k COP |
| **Chorizo Argentino** 🇦🇷 | Especias australes, pimentón dulce y ajo | x 5 und (500g) | 24.6k COP |
| **Morcilla Artesanal** | Arroz seleccionado y hierbabuena | x 5 und (500g) | 15.0k COP |
| **Chimichurri de la Casa** 🌿 | Frasco artesanal con aceite de oliva y hierbas | Frasco 250g | 14.5k COP |

*Todos los paquetes se entregan sellados al vacío x 5 unidades con un peso aproximado de 500 gramos.*

---

## 🚀 Inicio Rápido Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor
npm start
```

La plataforma estará disponible en:
- **Tienda Pública:** `http://localhost:3000`
- **Panel Administrativo:** `http://localhost:3000/chorizos-segaso/admin`
  - *Credenciales:* definidas en `.env` (`ADMIN_SEED_PASSWORD`). Ver `.env.example`.

---

## 📄 Documentación y Entregables

- **Brochure Comercial y Técnico:** `SEGASO_CHORIZOS_BROCHURE_PRESENTACION.pdf` (disponible en la carpeta de escritorio).
- **Código Limpio:** Arquitectura modular desacoplada ($0 costo en licencias o infraestructura).
