/**
 * @file projects/segaso-app/scripts/compilar_guias_desktop.js
 * @description Compila las 6 guias Markdown a PDFs de alta fidelidad ejecutiva con Playwright.
 * Carpeta destino: C:\Users\dev\Desktop\Chorizos Segaso\
 * SRP < 300 lineas.
 */

const fs = require('node:fs');
const path = require('node:path');
const { marked } = require('marked');
const { chromium } = require('playwright');

const DESKTOP_DIR = path.join('C:', 'Users', 'dev', 'Desktop', 'Chorizos Segaso');

const FILES = [
  '00_GUIA_MAESTRA_SUSTENTACION.md',
  '01_GUIA_ANGELINA_ROJAS.md',
  '02_GUIA_BRAYAN_ALVAREZ.md',
  '03_GUIA_EDISON_GALVAN.md',
  '04_GUIA_MARIA_VAHOS.md',
  '05_GUIA_ISABEL_REY.md'
];

function buildHtml(title, rawHtml) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    @page {
      size: A4;
      margin: 15mm 15mm 15mm 15mm;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1f2937;
      background: #ffffff;
      line-height: 1.5;
      font-size: 9.5pt;
    }
    .header-bar {
      border-bottom: 2.5px solid #8B1E1E;
      padding-bottom: 8px;
      margin-bottom: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand-box {
      display: flex;
      flex-direction: column;
    }
    .brand-name {
      font-size: 14pt;
      font-weight: 800;
      color: #8B1E1E;
      letter-spacing: -0.3px;
      text-transform: uppercase;
    }
    .brand-sub {
      font-size: 8pt;
      color: #6b7280;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .badge-tag {
      background: #8B1E1E;
      color: #ffffff;
      font-size: 7.5pt;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    h1 {
      font-size: 16pt;
      font-weight: 800;
      color: #111827;
      margin: 12px 0 10px 0;
      line-height: 1.25;
      border-bottom: 1.5px solid #E5E7EB;
      padding-bottom: 6px;
    }
    h2 {
      font-size: 11.5pt;
      font-weight: 700;
      color: #8B1E1E;
      margin: 14px 0 6px 0;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      border-left: 3px solid #8B1E1E;
      padding-left: 8px;
    }
    h3 {
      font-size: 10pt;
      font-weight: 700;
      color: #1f2937;
      margin: 10px 0 4px 0;
    }
    p {
      margin-bottom: 8px;
      color: #374151;
      text-align: justify;
    }
    ul, ol {
      margin: 6px 0 10px 20px;
    }
    li {
      margin-bottom: 4px;
      color: #374151;
    }
    blockquote {
      background: #FFFBEB;
      border-left: 4px solid #D97706;
      padding: 8px 12px;
      margin: 10px 0;
      border-radius: 0 4px 4px 0;
      font-style: normal;
      color: #78350F;
    }
    blockquote p {
      color: #78350F;
      margin-bottom: 4px;
    }
    blockquote p:last-child {
      margin-bottom: 0;
    }
    strong {
      color: #111827;
      font-weight: 700;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0 14px 0;
      font-size: 8.5pt;
      page-break-inside: avoid;
    }
    th {
      background: #8B1E1E;
      color: #ffffff;
      text-align: left;
      padding: 6px 8px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      border: 1px solid #781818;
    }
    td {
      padding: 6px 8px;
      border: 1px solid #E5E7EB;
      color: #374151;
      vertical-align: top;
    }
    tr:nth-child(even) td {
      background: #F9FAFB;
    }
    pre {
      background: #111827;
      color: #10B981;
      padding: 10px 12px;
      border-radius: 6px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 8pt;
      line-height: 1.4;
      margin: 10px 0;
      overflow-x: auto;
      white-space: pre-wrap;
    }
    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 8.5pt;
      background: #F3F4F6;
      color: #8B1E1E;
      padding: 1px 4px;
      border-radius: 3px;
    }
    hr {
      border: none;
      border-top: 1px solid #E5E7EB;
      margin: 14px 0;
    }
    .footer {
      margin-top: 16px;
      border-top: 1px solid #E5E7EB;
      padding-top: 6px;
      display: flex;
      justify-content: space-between;
      font-size: 7.5pt;
      color: #9CA3AF;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div class="header-bar">
    <div class="brand-box">
      <div class="brand-name">Segaso Chorizos S.A.S.</div>
      <div class="brand-sub">Sustentación Oficial — CESDE 14-Nov-2026</div>
    </div>
    <div class="badge-tag">Guía de Exposición</div>
  </div>

  <main>
    ${rawHtml}
  </main>

  <div class="footer">
    <div>Envigado, Antioquia · NIT 1037619618-5 · Antójate de Antioquia</div>
    <div>Documento de Control y Sustentación</div>
  </div>
</body>
</html>`;
}

async function main() {
  console.log('🚀 Iniciando compilación de Guías de Sustentación para Chorizos Segaso...');
  console.log(`📁 Directorio destino: ${DESKTOP_DIR}`);

  if (!fs.existsSync(DESKTOP_DIR)) {
    fs.mkdirSync(DESKTOP_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  for (const filename of FILES) {
    const mdPath = path.join(DESKTOP_DIR, filename);
    if (!fs.existsSync(mdPath)) {
      console.warn(`⚠️ Archivo no encontrado: ${mdPath}`);
      continue;
    }

    const mdContent = fs.readFileSync(mdPath, 'utf-8');
    const titleMatch = mdContent.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : filename.replace(/\.md$/, '');

    const rawHtml = marked(mdContent);
    const finalHtml = buildHtml(title, rawHtml);

    await page.setContent(finalHtml, { waitUntil: 'load' });

    const pdfName = filename.replace(/\.md$/, '.pdf');
    const pdfPath = path.join(DESKTOP_DIR, pdfName);

    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '12mm',
        right: '12mm',
        bottom: '12mm',
        left: '12mm'
      }
    });

    const stat = fs.statSync(pdfPath);
    console.log(`✅ [PDF Generado] ${pdfName} (${Math.round(stat.size / 1024)} KB)`);
  }

  await browser.close();
  console.log('🎉 Todas las guías en PDF han sido generadas exitosamente.');
}

main().catch((err) => {
  console.error('❌ Error en compilación de guías:', err);
  process.exit(1);
});
