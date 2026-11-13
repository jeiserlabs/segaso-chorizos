const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

function getBase64(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mime = ext === '.svg' ? 'image/svg+xml' : ext === '.webp' ? 'image/webp' : 'image/png';
  const data = fs.readFileSync(filePath);
  return `data:${mime};base64,${data.toString('base64')}`;
}

async function buildDossier() {
  console.log('Cargando assets para el dossier profesional...');
  const logoB64 = getBase64('C:/PROYECTOS/Mis_Proyectos/Segaso/logo_segaso.svg');
  const qrB64 = getBase64('C:/PROYECTOS/Mis_Proyectos/Segaso/assets/qr_segaso_web.png');
  const desktopB64 = getBase64('C:/Users/dev/Downloads/mockup_desktop_segaso.png');
  const mobileB64 = getBase64('C:/Users/dev/Downloads/mockup_mobile_segaso.png');

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Segaso Chorizos — Plataforma Web & Dossier Profesional</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap');

  @page {
    size: A4 portrait;
    margin: 0;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #0d090b;
    color: #f5ede6;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .page {
    width: 210mm;
    height: 297mm;
    position: relative;
    padding: 16mm 18mm;
    page-break-after: always;
    overflow: hidden;
    background: radial-gradient(circle at 85% 15%, rgba(229,169,60,0.08) 0%, #0d090b 60%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  /* Decorative Header Bar */
  .top-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(229,169,60,0.25);
    margin-bottom: 16px;
  }

  .brand-badge {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .brand-badge img {
    height: 38px;
    width: auto;
  }

  .brand-tag {
    font-size: 11px;
    font-weight: 700;
    color: #e5a93c;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  .doc-label {
    font-size: 10px;
    color: #a3958f;
    font-family: 'JetBrains Mono', monospace;
    background: rgba(255,255,255,0.04);
    padding: 4px 10px;
    border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.08);
  }

  /* Typography */
  h1 {
    font-size: 26px;
    font-weight: 900;
    line-height: 1.15;
    color: #ffffff;
    letter-spacing: -0.5px;
    margin-bottom: 6px;
  }

  h1 span {
    color: #e5a93c;
  }

  .subtitle {
    font-size: 13px;
    color: #c9bcad;
    line-height: 1.5;
    margin-bottom: 18px;
  }

  /* Bento Cards */
  .bento-grid {
    display: grid;
    gap: 12px;
  }

  .grid-2 { grid-template-columns: 1fr 1fr; }
  .grid-3 { grid-template-columns: 1fr 1fr 1fr; }

  .card {
    background: rgba(24, 18, 20, 0.75);
    border: 1px solid rgba(229,169,60,0.2);
    border-radius: 12px;
    padding: 14px;
    position: relative;
  }

  .card-gold {
    border-color: rgba(229,169,60,0.45);
    background: linear-gradient(135deg, rgba(229,169,60,0.12) 0%, rgba(24, 18, 20, 0.85) 100%);
  }

  .card-title {
    font-size: 12px;
    font-weight: 800;
    color: #e5a93c;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .card-p {
    font-size: 11px;
    color: #d1c5bb;
    line-height: 1.5;
  }

  /* KPI Counter Box */
  .kpi-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 16px;
  }

  .kpi-box {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(229,169,60,0.25);
    border-radius: 10px;
    padding: 12px 10px;
    text-align: center;
  }

  .kpi-val {
    font-family: 'JetBrains Mono', monospace;
    font-size: 22px;
    font-weight: 900;
    color: #fb923c;
    line-height: 1;
    margin-bottom: 4px;
  }

  .kpi-sub {
    font-size: 10px;
    color: #a3958f;
    font-weight: 600;
  }

  /* Mockup Frame */
  .mockup-container {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.15);
    box-shadow: 0 16px 36px rgba(0,0,0,0.8);
    background: #000;
  }

  .mockup-container img {
    display: block;
    width: 100%;
    height: auto;
  }

  /* Bottom Footer */
  .footer-meta {
    padding-top: 10px;
    border-top: 1px solid rgba(255,255,255,0.08);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 9.5px;
    color: #8c7e77;
  }

  .footer-meta a {
    color: #e5a93c;
    text-decoration: none;
    font-weight: 700;
  }

  /* Highlights & Pills */
  .pill {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 12px;
    background: rgba(229,169,60,0.15);
    color: #f7b955;
    font-size: 9.5px;
    font-weight: 700;
    margin-right: 4px;
    margin-bottom: 4px;
  }

  .contact-hero {
    background: radial-gradient(circle at center, rgba(229,169,60,0.15) 0%, rgba(20,14,16,0.95) 70%);
    border: 1px solid rgba(229,169,60,0.45);
    border-radius: 14px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 12px 30px rgba(0,0,0,0.6);
  }

  .contact-btn {
    display: inline-block;
    background: linear-gradient(135deg, #e5a93c 0%, #d48b28 100%);
    color: #140e10;
    font-weight: 900;
    font-size: 14px;
    padding: 10px 24px;
    border-radius: 30px;
    text-decoration: none;
    box-shadow: 0 6px 18px rgba(229,169,60,0.35);
    margin-top: 10px;
  }

  .service-card {
    background: rgba(24, 18, 20, 0.7);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    padding: 12px;
  }

  .service-card h4 {
    color: #ffffff;
    font-size: 12px;
    font-weight: 800;
    margin-bottom: 4px;
  }
</style>
</head>
<body>

  <!-- ==================== PÁGINA 1: CASO DE ÉXITO & PORTADA ==================== -->
  <div class="page">
    <div>
      <div class="top-meta">
        <div class="brand-badge">
          <img src="${logoB64}" alt="Segaso Logo">
          <div>
            <div class="brand-tag">Segaso Chorizos S.A.S.</div>
            <div style="font-size: 9.5px; color: #a3958f;">Transformación Digital & E-Commerce</div>
          </div>
        </div>
        <div class="doc-label">CASO DE ÉXITO // 2026</div>
      </div>

      <h1>Plataforma E-Commerce & <span>Control Operativo</span></h1>
      <p class="subtitle">
        Desarrollo de vitrina digital de alta velocidad, automatización de pedidos a WhatsApp y panel administrativo en tiempo real para marca de alimentos gourmet en Envigado, Antioquia.
      </p>

      <div class="kpi-row">
        <div class="kpi-box">
          <div class="kpi-val">97.5%</div>
          <div class="kpi-sub">Ahorro de Tiempo en Pedidos</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-val">0 COP</div>
          <div class="kpi-sub">Costos Mensuales de Licencias SaaS</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-val">&lt; 1.3 MB</div>
          <div class="kpi-sub">Peso Total · Carga Ultrarrápida</div>
        </div>
      </div>

      <div class="mockup-container" style="margin-bottom: 14px;">
        <img src="${desktopB64}" alt="Vitrina Web Segaso Desktop" style="max-height: 270px; object-fit: cover; object-position: top;">
      </div>

      <div class="bento-grid grid-2">
        <div class="card">
          <div class="card-title">🚨 Problemática Inicial</div>
          <p class="card-p">
            La empresa captaba prospectos por redes sociales pero carecía de canal web. La atención se hacía 100% manual por chat privado (15-20 minutos por cliente explicando precios y referencias), inventario en libretas con riesgo de agotados y cero registro histórico de clientes.
          </p>
        </div>
        <div class="card card-gold">
          <div class="card-title">💡 Solución Implementada</div>
          <p class="card-p">
            Desarrollo de plataforma web integral: vitrina B2C con catálogo de 9 referencias oficiales, carrito de compras reactivo con descuento dinámico, checkout directo a WhatsApp Business y Back Office administrativo con base de datos SQLite WAL local.
          </p>
        </div>
      </div>
    </div>

    <div class="footer-meta">
      <div>Desarrollado y Diseñado por <b>Jeiser Gutiérrez</b> · Software Architect & Full Stack</div>
      <div>Página 1 de 3</div>
    </div>
  </div>

  <!-- ==================== PÁGINA 2: ARQUITECTURA & DEMO EN VIVO CON QR ==================== -->
  <div class="page">
    <div>
      <div class="top-meta">
        <div class="brand-badge">
          <img src="${logoB64}" alt="Segaso Logo" style="height: 30px;">
          <div class="brand-tag">Ecosistema Tecnológico</div>
        </div>
        <div class="doc-label">INGENIERÍA & DEMO EN VIVO</div>
      </div>

      <h1 style="font-size: 22px;">Arquitectura Omnicanal & <span>Prueba en Vivo</span></h1>
      <p class="subtitle" style="margin-bottom: 14px;">
        Arquitectura moderna Local-First con despliegue en CDN mundial, cero dependencias pesadas y máxima resiliencia operativa.
      </p>

      <!-- Bento Grid de Módulos -->
      <div class="bento-grid grid-2" style="margin-bottom: 14px;">
        <div class="card">
          <div class="card-title">🛒 Vitrina Gourmet & Carrito Reactivo</div>
          <p class="card-p">
            Catálogo fotográfico de 9 referencias empacadas al vacío con lightbox interactivo. Carrito con cálculo automático de totales y 10% OFF de bienvenida sin fricción.
          </p>
          <div style="margin-top: 8px;">
            <span class="pill">HTML5 / CSS3</span>
            <span class="pill">ESBuild Modular</span>
            <span class="pill">0 Errores Consola</span>
          </div>
        </div>

        <div class="card">
          <div class="card-title">⚡ Despacho Directo a WhatsApp</div>
          <p class="card-p">
            El cliente arma su pedido y al presionar comprar se genera un enlace cifrado que abre WhatsApp con el pedido estructurado, cantidades, subtotal y descuento aplicado.
          </p>
          <div style="margin-top: 8px;">
            <span class="pill">WhatsApp Business</span>
            <span class="pill">30s por Pedido</span>
            <span class="pill">Cero Comisiones</span>
          </div>
        </div>

        <div class="card">
          <div class="card-title">🎥 Social Media & TikTok Streaming</div>
          <p class="card-p">
            Integración del reproductor oficial de TikTok embebido directamente en la tienda web, permitiendo a los clientes ver las recetas sin ralentizar el servidor ni subir videos a Git.
          </p>
          <div style="margin-top: 8px;">
            <span class="pill">TikTok Player API</span>
            <span class="pill">0 Storage Cost</span>
            <span class="pill">Streaming Oficial</span>
          </div>
        </div>

        <div class="card">
          <div class="card-title">🛡️ Back Office con SQLite WAL</div>
          <p class="card-p">
            Panel administrativo privado con autenticación JWT segura (scrypt), control de pedidos mediante Máquina de Estados Finitos (FSM) y separación estricta de métricas reales vs pruebas.
          </p>
          <div style="margin-top: 8px;">
            <span class="pill">Node.js 24</span>
            <span class="pill">better-sqlite3</span>
            <span class="pill">FSM Transaccional</span>
          </div>
        </div>
      </div>

      <!-- Tarjeta QR Destacada -->
      <div class="card card-gold" style="display: flex; gap: 18px; align-items: center; padding: 18px;">
        <div style="background: #ffffff; padding: 8px; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.5); flex-shrink: 0;">
          <img src="${qrB64}" alt="QR Web Segaso" style="width: 140px; height: 140px; display: block;">
        </div>
        <div>
          <div class="card-title" style="font-size: 14px; margin-bottom: 4px;">📲 Escanea y Prueba la Plataforma en Vivo</div>
          <p style="font-size: 11.5px; color: #fff; line-height: 1.5; margin-bottom: 8px;">
            Apunta la cámara de tu smartphone para navegar la vitrina web real, probar el carrito interactivo y ver la integración completa en producción.
          </p>
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #fb923c; background: rgba(0,0,0,0.4); padding: 5px 10px; border-radius: 6px; display: inline-block;">
            https://jeiserlabs.github.io/segaso-chorizos/
          </div>
          <div style="margin-top: 8px; font-size: 10px; color: #a3958f;">
            ✓ 100% Responsivo en iOS y Android &nbsp;·&nbsp; ✓ Certificado SSL Seguro HTTPS
          </div>
        </div>
      </div>
    </div>

    <div class="footer-meta">
      <div>Desarrollado y Diseñado por <b>Jeiser Gutiérrez</b> · Software Architect & Full Stack</div>
      <div>Página 2 de 3</div>
    </div>
  </div>

  <!-- ==================== PÁGINA 3: SERVICIOS PROFESIONALES & CONTACTO ==================== -->
  <div class="page">
    <div>
      <div class="top-meta">
        <div class="brand-badge">
          <div style="font-size: 14px; font-weight: 900; color: #e5a93c; letter-spacing: 1px;">JEISER GUTIÉRREZ</div>
        </div>
        <div class="doc-label">INGENIERÍA & ASESORÍAS</div>
      </div>

      <h1>Lleva tu Negocio al <span>Siguiente Nivel Digital</span></h1>
      <p class="subtitle">
        Desarrollo de software a la medida, automatización de procesos comerciales y plataformas web de alto rendimiento diseñadas para vender más y operar sin fricción.
      </p>

      <!-- Servicios Grid -->
      <div class="bento-grid grid-2" style="margin-bottom: 16px;">
        <div class="service-card">
          <div style="font-size: 18px; margin-bottom: 4px;">🛒</div>
          <h4>Tiendas Web & E-Commerce a la Medida</h4>
          <p class="card-p">
            Vitrina comercial personalizada, ultrarrápida y optimizada para ventas. Sin pagar comisiones mensuales a plataformas externas (Shopify o WooCommerce). Tú eres dueño absoluto de tu tecnología.
          </p>
        </div>

        <div class="service-card">
          <div style="font-size: 18px; margin-bottom: 4px;">⚡</div>
          <h4>Automatizaciones & Bots Comerciales</h4>
          <p class="card-p">
            Integración de catálogos y pedidos estructurados directo a WhatsApp Business. Ahorra hasta el 95% del tiempo de atención de tu equipo y evita la pérdida de clientes por demoras.
          </p>
        </div>

        <div class="service-card">
          <div style="font-size: 18px; margin-bottom: 4px;">📊</div>
          <h4>Paneles de Gestión & Back Office (ERP Local)</h4>
          <p class="card-p">
            Sistemas privados para control de inventario en tiempo real, registro de ventas, métricas de clientes (LTV) y estados de pedidos sin depender de conexiones a nubes costosas.
          </p>
        </div>

        <div class="service-card">
          <div style="font-size: 18px; margin-bottom: 4px;">🛡️</div>
          <h4>Aseguramiento de Calidad (QA) & Auditorías</h4>
          <p class="card-p">
            Pruebas automatizadas Playwright / End-to-End, optimización de velocidad de carga y auditorías técnicas para garantizar que tu sistema nunca falle en días de alto volumen de ventas.
          </p>
        </div>
      </div>

      <!-- Hero Contact Box -->
      <div class="contact-hero">
        <h3 style="font-size: 18px; color: #fff; font-weight: 900; margin-bottom: 4px;">
          ¿Listo para digitalizar o automatizar tu empresa?
        </h3>
        <p style="font-size: 12px; color: #d1c5bb; max-width: 500px; margin: 0 auto 12px auto; line-height: 1.5;">
          Cotiza tu proyecto sin costo. Asesoría técnica directa, soluciones robustas y entrega garantizada con código limpio y altos estándares de producción.
        </p>

        <div style="background: rgba(0,0,0,0.5); border: 1px solid rgba(229,169,60,0.3); border-radius: 10px; padding: 12px; max-width: 480px; margin: 0 auto 12px auto; text-align: left; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div>
            <div style="font-size: 10px; color: #a3958f; text-transform: uppercase; font-weight: 700;">WhatsApp Directo</div>
            <div style="font-size: 13px; font-weight: 800; color: #fff;">+57 304 461 5613</div>
          </div>
          <div>
            <div style="font-size: 10px; color: #a3958f; text-transform: uppercase; font-weight: 700;">Correo Electrónico</div>
            <div style="font-size: 12px; font-weight: 700; color: #fff;">jeiser270997@gmail.com</div>
          </div>
          <div>
            <div style="font-size: 10px; color: #a3958f; text-transform: uppercase; font-weight: 700;">Portafolio & GitHub</div>
            <div style="font-size: 12px; font-weight: 700; color: #e5a93c;">github.com/jeiserlabs</div>
          </div>
          <div>
            <div style="font-size: 10px; color: #a3958f; text-transform: uppercase; font-weight: 700;">Ubicación & Modalidad</div>
            <div style="font-size: 12px; font-weight: 700; color: #fff;">Medellín · Remoto Global</div>
          </div>
        </div>

        <a href="https://wa.me/573044615613?text=Hola%20Jeiser,%20vi%20la%20plataforma%20de%20Segaso%20y%20me%20gustar%C3%ADa%20cotizar%20un%20proyecto." class="contact-btn">
          💬 Iniciar Conversación por WhatsApp
        </a>
      </div>
    </div>

    <div class="footer-meta">
      <div><b>Jeiser Abraham Gutiérrez Torres</b> · Ingeniero de Software & SDET · Medellín, Colombia</div>
      <div>Página 3 de 3</div>
    </div>
  </div>

</body>
</html>`;

  const htmlPath = 'C:/Users/dev/Downloads/dossier_segaso_preview.html';
  fs.writeFileSync(htmlPath, html, 'utf-8');
  console.log('HTML generado en:', htmlPath);

  console.log('Compilando PDF profesional con Playwright...');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file:///' + htmlPath.replace(/\\\\/g, '/'), { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const outPdf = 'C:/Users/dev/Downloads/SEGASO_Dossier_Presentacion_Jeiser_Gutierrez.pdf';
  await page.pdf({
    path: outPdf,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, bottom: 0, left: 0, right: 0 }
  });

  await browser.close();
  console.log('PDF profesional generado exitosamente en:', outPdf, 'Tamaño:', (fs.statSync(outPdf).size / 1024).toFixed(1), 'KB');
}

buildDossier().catch(console.error);
