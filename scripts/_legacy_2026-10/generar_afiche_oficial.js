/**
 * projects/segaso-app/scripts/generar_afiche_oficial.js
 * Genera el afiche publicitario oficial de Segaso Chorizos S.A.S. en alta resolución (PDF y PNG).
 * Incluye los 5 integrantes del equipo del CESDE, el catálogo y el QR escaneable a WhatsApp.
 * SRP < 300 líneas.
 */

const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const OUT_DIR = path.join('C:', 'Users', 'dev', 'Desktop', 'Segaso', '02_AFICHE_OFICIAL');
const LOGO_PATH = path.join(__dirname, '..', 'logo_segaso_transparent.png');

function buildHtml(logoBase64) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Afiche Oficial — Segaso Chorizos S.A.S.</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap');

    @page {
      size: A4;
      margin: 0;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      width: 1240px;
      height: 1754px;
      margin: 0;
      padding: 40px 50px;
      background: radial-gradient(circle at 50% 20%, #2A080E 0%, #0F0A0C 65%, #050304 100%);
      color: #FFFFFF;
      font-family: 'Plus Jakarta Sans', sans-serif;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* Borde decorativo dorado */
    .outer-border {
      position: absolute;
      top: 20px;
      left: 20px;
      right: 20px;
      bottom: 20px;
      border: 2px solid #D4AF37;
      border-radius: 12px;
      pointer-events: none;
      opacity: 0.6;
    }
    .inner-corner {
      position: absolute;
      width: 20px;
      height: 20px;
      border: 2px solid #E67E22;
      opacity: 0.8;
    }
    .c-tl { top: 26px; left: 26px; border-right: none; border-bottom: none; }
    .c-tr { top: 26px; right: 26px; border-left: none; border-bottom: none; }
    .c-bl { bottom: 26px; left: 26px; border-right: none; border-top: none; }
    .c-br { bottom: 26px; right: 26px; border-left: none; border-top: none; }

    /* HEADER */
    .header {
      text-align: center;
      margin-top: 10px;
    }
    .award-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(90deg, #A61828, #D4AF37);
      color: #FFFFFF;
      padding: 6px 20px;
      border-radius: 30px;
      font-size: 13pt;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
    }
    .logo-container {
      margin: 15px auto 10px;
    }
    .logo-img {
      max-height: 140px;
      filter: drop-shadow(0 6px 20px rgba(166, 24, 40, 0.6));
    }
    .main-title {
      font-family: 'Playfair Display', serif;
      font-size: 34pt;
      font-weight: 900;
      color: #F3ECDA;
      letter-spacing: -0.5px;
      margin-top: 5px;
    }
    .main-title span {
      color: #D4AF37;
      font-style: italic;
    }
    .tagline {
      font-size: 15pt;
      font-weight: 600;
      color: #E0D3C1;
      text-transform: uppercase;
      letter-spacing: 3px;
      margin-top: 4px;
    }

    /* BENEFICIOS / 3 PILARES */
    .pillars-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin: 20px 0;
    }
    .pillar-card {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(212, 175, 55, 0.3);
      border-radius: 10px;
      padding: 16px;
      text-align: center;
      backdrop-filter: blur(5px);
    }
    .pillar-icon {
      font-size: 24pt;
      color: #E67E22;
      margin-bottom: 6px;
    }
    .pillar-title {
      font-size: 13pt;
      font-weight: 800;
      color: #D4AF37;
      margin-bottom: 4px;
    }
    .pillar-desc {
      font-size: 10pt;
      color: #CCC;
      line-height: 1.3;
    }

    /* SECCIÓN DE PRODUCTOS (9 REFERENCIAS) */
    .catalog-section {
      background: rgba(15, 10, 12, 0.7);
      border: 1px solid rgba(166, 24, 40, 0.4);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 15px;
    }
    .catalog-title {
      font-family: 'Playfair Display', serif;
      font-size: 18pt;
      font-weight: 700;
      color: #D4AF37;
      text-align: center;
      margin-bottom: 15px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }
    .prod-item {
      background: rgba(255, 255, 255, 0.03);
      border-left: 3px solid #A61828;
      border-radius: 6px;
      padding: 10px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .prod-name {
      font-size: 11pt;
      font-weight: 700;
      color: #FFF;
    }
    .prod-note {
      font-size: 8.5pt;
      color: #AAA;
      margin-top: 2px;
    }
    .prod-badge {
      background: #D4AF37;
      color: #000;
      font-size: 8.5pt;
      font-weight: 800;
      padding: 3px 7px;
      border-radius: 4px;
      white-space: nowrap;
    }

    /* CTA Y ASADOS AL BARRIL */
    .cta-container {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 20px;
      align-items: center;
      background: linear-gradient(135deg, rgba(166, 24, 40, 0.25), rgba(15, 10, 12, 0.8));
      border: 1px solid #D4AF37;
      border-radius: 12px;
      padding: 20px 25px;
      margin-bottom: 15px;
    }
    .cta-text h3 {
      font-family: 'Playfair Display', serif;
      font-size: 18pt;
      color: #D4AF37;
      margin-bottom: 6px;
    }
    .cta-text p {
      font-size: 11pt;
      color: #DDD;
      line-height: 1.4;
    }
    .coupon-box {
      display: inline-block;
      margin-top: 8px;
      background: #A61828;
      color: #FFF;
      font-weight: 800;
      font-size: 11pt;
      padding: 4px 12px;
      border-radius: 5px;
      border: 1px dashed #D4AF37;
    }
    .qr-side {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .qr-box {
      background: #FFFFFF;
      padding: 10px;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.5);
      margin-bottom: 6px;
    }
    .qr-label {
      font-size: 9.5pt;
      font-weight: 700;
      color: #D4AF37;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* FOOTER INSTITUCIONAL (LOS 5 INTEGRANTES) */
    .institutional-footer {
      border-top: 1px solid rgba(212, 175, 55, 0.4);
      padding-top: 12px;
      margin-top: 5px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .inst-left {
      max-width: 65%;
    }
    .inst-program {
      font-size: 9pt;
      font-weight: 700;
      color: #D4AF37;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }
    .inst-team {
      font-size: 9.5pt;
      color: #EEE;
      line-height: 1.4;
    }
    .inst-team strong {
      color: #FFF;
    }
    .inst-right {
      text-align: right;
      font-size: 9pt;
      color: #AAA;
    }
    .inst-social {
      font-size: 11pt;
      font-weight: 800;
      color: #D4AF37;
      margin-bottom: 3px;
    }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
</head>
<body>

  <div class="outer-border"></div>
  <div class="inner-corner c-tl"></div>
  <div class="inner-corner c-tr"></div>
  <div class="inner-corner c-bl"></div>
  <div class="inner-corner c-br"></div>

  <!-- ENCABEZADO -->
  <div class="header">
    <div class="award-pill">🏛️ Antójate de Antioquia · Renglón 1288 (Cumple Requisitos)</div>
    <div class="logo-container">
      <img src="${logoBase64}" alt="Segaso Chorizos" class="logo-img">
    </div>
    <h1 class="main-title">El Auténtico Sabor del <span>Chorizo de Tradición</span></h1>
    <div class="tagline">Envigado · Antioquia · Artesanal y Gourmet</div>
  </div>

  <!-- 3 PILARES DE CALIDAD -->
  <div class="pillars-grid">
    <div class="pillar-card">
      <div class="pillar-icon">🥩</div>
      <div class="pillar-title">100% Cerdo Magro</div>
      <div class="pillar-desc">Cero harinas, almidones ni conservantes artificiales. Pura carne seleccionada.</div>
    </div>
    <div class="pillar-card">
      <div class="pillar-icon">🌾</div>
      <div class="pillar-title">Libre de Gluten</div>
      <div class="pillar-desc">Apto para personas celíacas. Sabor gourmet natural y digestión ligera.</div>
    </div>
    <div class="pillar-card">
      <div class="pillar-icon">🛡️</div>
      <div class="pillar-title">Empaque al Vacío</div>
      <div class="pillar-desc">60 días de vida útil en frío manteniendo la frescura de la charcutería.</div>
    </div>
  </div>

  <!-- CATÁLOGO OFICIAL 9 REFERENCIAS -->
  <div class="catalog-section">
    <div class="catalog-title">Nuestras 9 Referencias Oficiales de Charcutería</div>
    <div class="products-grid">
      <div class="prod-item">
        <div>
          <div class="prod-name">Caserito Paisa</div>
          <div class="prod-note">El clásico tradicional x 5 unidades</div>
        </div>
        <span class="prod-badge">Top Ventas</span>
      </div>
      <div class="prod-item">
        <div>
          <div class="prod-name">Antioqueño</div>
          <div class="prod-note">Sabor criollo ahumado al carbón</div>
        </div>
        <span class="prod-badge">Tradición</span>
      </div>
      <div class="prod-item">
        <div>
          <div class="prod-name">Santarrosano</div>
          <div class="prod-note">Receta insignia de corte fino</div>
        </div>
        <span class="prod-badge">Gourmet</span>
      </div>
      <div class="prod-item">
        <div>
          <div class="prod-name">Tocineta Ahumada</div>
          <div class="prod-note">Crocancia y notas dulces de leña</div>
        </div>
        <span class="prod-badge">Especial</span>
      </div>
      <div class="prod-item">
        <div>
          <div class="prod-name">Parrillero Mayor</div>
          <div class="prod-note">Calibre grueso ideal asados al barril</div>
        </div>
        <span class="prod-badge">Barril</span>
      </div>
      <div class="prod-item">
        <div>
          <div class="prod-name">Picante Habanero</div>
          <div class="prod-note">Toque equilibrado y picor gourmet</div>
        </div>
        <span class="prod-badge">Picante</span>
      </div>
      <div class="prod-item">
        <div>
          <div class="prod-name">Estilo Argentino</div>
          <div class="prod-note">Especiado con vino y hierbas finas</div>
        </div>
        <span class="prod-badge">Premium</span>
      </div>
      <div class="prod-item">
        <div>
          <div class="prod-name">Morcilla Paisa</div>
          <div class="prod-note">Arroz, verduras y hierbas campesinas</div>
        </div>
        <span class="prod-badge">Tradicional</span>
      </div>
      <div class="prod-item">
        <div>
          <div class="prod-name">Chimichurri Especial</div>
          <div class="prod-note">Elaboración propia de la casa</div>
        </div>
        <span class="prod-badge">Complemento</span>
      </div>
    </div>
  </div>

  <!-- SERVICIO DE ASADOS AL BARRIL Y PEDIDOS WHATSAPP -->
  <div class="cta-container">
    <div class="cta-text">
      <h3>🔥 Servicio de Asados al Barril a Domicilio</h3>
      <p>Llevamos el barril ahumador, maestro parrillero y el menú completo a tu casa, finca o evento corporativo en el Valle de Aburrá (desde 5 personas en adelante).</p>
      <div class="coupon-box">Cupón de Bienvenida: SEGASO10 (10% OFF en tu primer pedido)</div>
    </div>
    <div class="qr-side">
      <div class="qr-box" id="qrcode"></div>
      <div class="qr-label">📲 Escanea y Pide por WhatsApp</div>
      <div style="font-size: 8.5pt; color: #AAA; margin-top: 2px;">+57 300 236 7180</div>
    </div>
  </div>

  <!-- FOOTER INSTITUCIONAL CON LOS 5 INTEGRANTES -->
  <div class="institutional-footer">
    <div class="inst-left">
      <div class="inst-program">Proyecto Integrador de Asistencia Administrativa · CESDE 2026</div>
      <div class="inst-team">
        <strong>Equipo de Consultoría y Modernización:</strong><br>
        Angelina Rojas  ·  Brayan Álvarez  ·  Edison Galván  ·  María Vahos Villa  ·  Isabel Rey
      </div>
    </div>
    <div class="inst-right">
      <div class="inst-social">@segaso.chorizos · 29.2K TikTok</div>
      <div>Planta de Producción: Barrio Primavera, Envigado</div>
      <div style="color: #666; font-size: 8pt; margin-top: 2px;">Sustentación Oficial · Noviembre 2026</div>
    </div>
  </div>

  <script>
    window.addEventListener('load', () => {
      new QRCode(document.getElementById("qrcode"), {
        text: "https://wa.me/573002367180?text=Hola%20Segaso%20Chorizos,%20vengo%20del%20afiche%20oficial%20y%20quiero%20hacer%20un%20pedido%20con%20el%20cup%C3%B3n%20SEGASO10",
        width: 110,
        height: 110,
        colorDark: "#8B1E1E",
        colorLight: "#FFFFFF",
        correctLevel: QRCode.CorrectLevel.M
      });
    });
  </script>
</body>
</html>`;
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  console.log('🎨 Cargando logotipo y generando HTML del Afiche Oficial...');
  const logoBuffer = fs.readFileSync(LOGO_PATH);
  const logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;

  const htmlContent = buildHtml(logoBase64);
  const htmlPath = path.join(__dirname, '..', 'docs', 'afiche_preview.html');
  fs.writeFileSync(htmlPath, htmlContent, 'utf8');

  console.log('🚀 Lanzando Playwright para renderizar Afiche a 300 DPI (PNG y PDF)...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1240, height: 1754 },
    deviceScaleFactor: 2
  });

  await page.setContent(htmlContent, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000); // Esperar que cargue el script del QR

  const pngPath = path.join(OUT_DIR, 'AFICHE_SEGASO_OFICIAL.png');
  const pdfPath = path.join(OUT_DIR, 'AFICHE_SEGASO_OFICIAL.pdf');

  console.log('📸 Capturando imagen PNG de alta resolución...');
  await page.screenshot({ path: pngPath, fullPage: true });
  console.log(`  ✓ Guardado PNG: ${pngPath}`);

  console.log('📄 Generando documento PDF para imprenta (A4)...');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' }
  });
  console.log(`  ✓ Guardado PDF: ${pdfPath}`);

  await browser.close();
  console.log('🎉 ¡Afiche Oficial completado exitosamente en Desktop!');
}

main().catch(err => {
  console.error('❌ Error generando afiche oficial:', err);
  process.exit(1);
});
