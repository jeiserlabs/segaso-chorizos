/**
 * @file projects/segaso-app/scripts/generar_guias_pdf.js
 * @description Genera 5 PDFs investigativos formateados para transcripción a cuaderno de notas (CESDE).
 * Utiliza Playwright para renderizado A4 de alta fidelidad ($0 costo).
 * SRP < 300 líneas.
 */

const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const { RESUMEN_TEMPORADA, INTEGRANTES } = require('./guias_data');

const OUT_DIR = path.join('C:', 'Users', 'dev', 'Desktop', 'Segaso', '01_GUIAS_INTEGRANTES_PDF');

function renderHtml(integ) {
  const investigacionHtml = integ.investigacion.map((item) => `
    <div class="invest-card">
      <div class="invest-subtitle">${item.subtitulo}</div>
      <div class="invest-text">${item.detalle.replace(/\n/g, '<br>')}</div>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Guía Investigativa — ${integ.nombre}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;1,600&display=swap');

    @page {
      size: A4;
      margin: 12mm 15mm 15mm 15mm;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      color: #1a1a1a;
      background: #ffffff;
      line-height: 1.45;
      font-size: 10pt;
    }

    .header {
      border-bottom: 2px solid #8B1E1E;
      padding-bottom: 8px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand-title {
      font-size: 16pt;
      font-weight: 800;
      color: #8B1E1E;
      letter-spacing: -0.5px;
    }
    .brand-sub {
      font-size: 8.5pt;
      font-weight: 600;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    .badge-cesde {
      background: #8B1E1E;
      color: #fff;
      font-size: 8pt;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 4px;
      text-transform: uppercase;
    }

    .hero-banner {
      background: #0F0A0C;
      color: #fff;
      padding: 12px 16px;
      border-radius: 6px;
      margin-bottom: 14px;
      border-left: 5px solid #D4AF37;
    }
    .hero-banner h1 {
      font-size: 14pt;
      font-weight: 800;
      color: #D4AF37;
      margin-bottom: 2px;
    }
    .hero-banner p {
      font-size: 9pt;
      color: #e0e0e0;
    }

    .section-title {
      font-size: 10.5pt;
      font-weight: 800;
      color: #8B1E1E;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1.5px solid #EADBCC;
      padding-bottom: 3px;
      margin-top: 12px;
      margin-bottom: 8px;
    }

    .box {
      background: #FAF8F5;
      border: 1px solid #EADBCC;
      border-radius: 5px;
      padding: 8px 12px;
      margin-bottom: 8px;
      font-size: 9pt;
    }
    .box-gold { border-left: 4px solid #D4AF37; background: #FFFDF7; }
    .box-crimson { border-left: 4px solid #8B1E1E; background: #FDF8F8; }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 8px;
    }

    .pill {
      display: inline-block;
      font-size: 7.5pt;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 3px;
      margin-right: 4px;
      background: #e5ded5;
      color: #333;
    }
    .pill-red { background: #8B1E1E; color: #fff; }
    .pill-gold { background: #D4AF37; color: #000; }

    .invest-card {
      background: #ffffff;
      border: 1px solid #d5c8b8;
      border-left: 3.5px solid #8B1E1E;
      border-radius: 5px;
      padding: 8px 12px;
      margin-bottom: 8px;
      page-break-inside: avoid;
    }
    .invest-subtitle {
      font-size: 9.5pt;
      font-weight: 800;
      color: #0F0A0C;
      margin-bottom: 3px;
    }
    .invest-text {
      font-size: 8.8pt;
      color: #2b2b2b;
      line-height: 1.4;
    }

    .footer {
      font-size: 7.5pt;
      color: #777;
      text-align: center;
      margin-top: 12px;
      border-top: 1px solid #e5e5e5;
      padding-top: 6px;
    }
  </style>
</head>
<body>

  <div class="header">
    <div>
      <div class="brand-title">SEGASO CHORIZOS S.A.S.</div>
      <div class="brand-sub">Proyecto Integrador · Asistencia Administrativa</div>
    </div>
    <div class="badge-cesde">CESDE · 2026</div>
  </div>

  <div class="hero-banner">
    <h1>GUÍA INVESTIGATIVA PARA CUADERNO — ${integ.nombre.toUpperCase()}</h1>
    <p><strong>Rol Oficial:</strong> ${integ.rolOficial} | <strong>Responsabilidad:</strong> ${integ.sprint}</p>
  </div>

  <!-- SECCIÓN 1: RESUMEN DE TEMPORADA -->
  <div class="section-title">SECCIÓN 1: RESUMEN DE TEMPORADA (MARCO EMPRESARIAL)</div>
  <div class="grid-2">
    <div class="box box-gold">
      <p><strong>Empresa & Liderazgo:</strong> ${RESUMEN_TEMPORADA.empresa} (NIT ${RESUMEN_TEMPORADA.nit}), Envigado. Fundada por ${RESUMEN_TEMPORADA.dueno}. ${RESUMEN_TEMPORADA.reconocimiento}.</p>
      <p style="margin-top:4px;"><strong>Producto Diferenciador:</strong> ${RESUMEN_TEMPORADA.producto}</p>
      <p style="margin-top:4px;"><strong>Líneas Comerciales:</strong> 1) Charcutería empacada al vacío (9 referencias). 2) Asados al Barril para eventos a domicilio.</p>
    </div>
    <div class="box box-crimson">
      <p><strong>Problemática Central:</strong> Debilidad interna de «Procesos poco eficaces» (calificada con 1/4). Atención manual y lenta por WhatsApp (15-20 min/cliente), inventario empírico en libreta de papel y restricción severa de <strong>0 COP de presupuesto</strong> ("No Hay Plata").</p>
      <p style="margin-top:4px;"><strong>Solución Implementada:</strong> Plataforma comercial integral local-first ($0 costo SaaS) con vitrina web, automatización a WhatsApp y Back Office de bodega.</p>
    </div>
  </div>

  <!-- SECCIÓN 2: DESARROLLO INVESTIGATIVO DEL SPRINT -->
  <div class="section-title">SECCIÓN 2: DESARROLLO INVESTIGATIVO — ${integ.tituloSeccion.toUpperCase()}</div>
  ${investigacionHtml}

  <div class="footer">
    Segaso Chorizos S.A.S. · Consultoría de Asistencia Administrativa · CESDE · Sustentación 14 de Noviembre de 2026
  </div>

</body>
</html>`;
}

async function main() {
  console.log('🚀 Generando las 5 Guías Investigativas en PDF para transcribir a cuaderno...');

  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const integ of INTEGRANTES) {
    const filename = `GUIA_SUSTENTACION_${integ.id.toUpperCase()}.pdf`;
    const targetPath = path.join(OUT_DIR, filename);

    console.log(`⏳ Compilando PDF: ${filename} (${integ.nombre})...`);
    const htmlContent = renderHtml(integ);
    await page.setContent(htmlContent, { waitUntil: 'networkidle' });

    await page.pdf({
      path: targetPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        bottom: '12mm',
        left: '12mm',
        right: '12mm'
      }
    });

    const size = (fs.statSync(targetPath).size / 1024).toFixed(1);
    console.log(`✅ Generado con éxito: ${filename} (${size} KB)`);
  }

  await browser.close();
  console.log(`\n🎉 Las 5 guías PDF fueron actualizadas correctamente en:\n📂 ${OUT_DIR}`);
}

main().catch((err) => {
  console.error('❌ Error generando PDFs:', err.message);
  process.exit(1);
});
