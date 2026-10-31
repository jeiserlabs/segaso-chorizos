/**
 * @file scripts/build_guias_pdf.js
 * @description Genera los 32 PDFs de estudio desde un paquete que tenga 03_DOCUMENTOS/.
 * Uso: node scripts/build_guias_pdf.js <ruta-del-paquete> [solo-numero]
 * El paquete se arma copiando docs/ del repo a 03_DOCUMENTOS/ (ver SSOT_Y_TIMELINE.md).
 * SRP: orquesta render; el contenido vive en Markdown.
 */

const fs = require('node:fs');
const path = require('node:path');
const { marked } = require('marked');
const { chromium } = require('playwright');

const ROOT = process.argv[2] ? path.resolve(process.argv[2]) : path.join(__dirname, '..');
const OUT = path.join(ROOT, '02_GUIAS_PDF');
const LOGO = path.join(ROOT, '_assets', 'logo_segaso.svg');
const ONLY = process.argv[3] || null;

const DOCS = [
  { n: '01', file: '03_DOCUMENTOS/01_GUIA_MAESTRA.md', title: 'Guía maestra de sustentación', sub: 'Guion completo, tiempos, preguntas y plan B', cat: 'Sustentación' },
  { n: '02', file: '03_DOCUMENTOS/02_GUIA_ANGELINA.md', title: 'Guía de Angelina Rojas', sub: 'Mercadeo, identidad y vitrina', cat: 'Sustentación' },
  { n: '03', file: '03_DOCUMENTOS/03_GUIA_BRAYAN.md', title: 'Guía de Brayan', sub: 'Tecnología líder y backoffice', cat: 'Sustentación' },
  { n: '04', file: '03_DOCUMENTOS/04_GUIA_EDISON.md', title: 'Guía de Edison', sub: 'Auxiliar de tecnología y WhatsApp', cat: 'Sustentación' },
  { n: '05', file: '03_DOCUMENTOS/05_GUIA_MARIA.md', title: 'Guía de María', sub: 'Control, datos y ROI', cat: 'Sustentación' },
  { n: '06', file: '03_DOCUMENTOS/06_GUIA_ISABEL.md', title: 'Guía de Isabel', sub: 'Control de calidad y pruebas', cat: 'Sustentación' },
  { n: '07', file: '03_DOCUMENTOS/07_DEMO_MVP.md', title: 'Demo del MVP paso a paso', sub: 'Recorrido de vitrina, carrito y backoffice', cat: 'Sustentación' },
  { n: '08', file: '03_DOCUMENTOS/08_CRONOGRAMA_Y_ROLES.md', title: 'Cronograma y roles', sub: 'Reparto de trabajo y fechas del equipo', cat: 'Sustentación' },
  { n: '09', file: '03_DOCUMENTOS/09_ANEXO_MATRICES_EFI_EFE.md', title: 'Anexo: matrices EFI y EFE', sub: 'Cálculo completo de los factores internos y externos', cat: 'Sustentación' },
  { n: '10', file: '03_DOCUMENTOS/PROYECTO_SEGASO_CHORIZOS_ENTREGABLE.md', title: 'Documento entregable CESDE', sub: 'Informe académico del proyecto Segaso Chorizos', cat: 'Académico' },
  { n: '11', file: '03_DOCUMENTOS/README.md', title: 'README técnico', sub: 'Instalación, comandos y estructura del proyecto', cat: 'Técnico' },
  { n: '12', file: '03_DOCUMENTOS/TECNICO/ARCHITECTURE.md', title: 'Arquitectura del sistema', sub: 'Capas, flujo de pedidos y decisiones técnicas', cat: 'Técnico' },
  { n: '13', file: '03_DOCUMENTOS/TECNICO/API.md', title: 'API del backoffice', sub: 'Endpoints, autenticación y contratos', cat: 'Técnico' },
  { n: '14', file: '03_DOCUMENTOS/TECNICO/DESIGN_SYSTEM.md', title: 'Sistema de diseño', sub: 'Paleta, tipografía, componentes y accesibilidad', cat: 'Diseño' },
  { n: '15', file: '03_DOCUMENTOS/TECNICO/ESCANER_ESTRATEGIA_Y_CRONOGRAMA_OCT2026.md', title: 'Escáner estratégico', sub: 'Lectura del negocio y cronograma', cat: 'Estrategia' },
  { n: '16', file: '03_DOCUMENTOS/TECNICO/ESCANER_AJUSTES_CESDE_OCT2026.md', title: 'Escáner de ajustes CESDE', sub: 'Hallazgos y correcciones del proyecto', cat: 'Académico' },
  { n: '17', file: '03_DOCUMENTOS/TECNICO/SOCIAL/PRODUCT_PHOTOS.md', title: 'Fotos de producto', sub: 'Inventario visual de las 9 referencias', cat: 'Contenido' },
  { n: '18', file: '03_DOCUMENTOS/TECNICO/SOCIAL/TIKTOK_INVENTORY.md', title: 'Inventario de TikTok', sub: 'Videos, fotos y métricas de la cuenta', cat: 'Contenido' },
  { n: '19', file: '03_DOCUMENTOS/TECNICO/SOCIAL/REDES_SEGASO.md', title: 'Redes sociales', sub: 'TikTok, Instagram, Facebook y WhatsApp', cat: 'Contenido' },
  { n: '20', file: '03_DOCUMENTOS/TECNICO/SOCIAL/MEDIA_MANIFEST.md', title: 'Manifiesto de medios', sub: 'Archivos descargados y su origen', cat: 'Contenido' },
  { n: '21', file: '06_VIDEO/PROMPT_GEMINI_VIDEO.md', title: 'Prompt de video con IA', sub: 'Instrucciones para Gemini o Veo', cat: 'Video' },
  { n: '22', file: '06_VIDEO/STORYBOARD_30S.md', title: 'Storyboard del promo 30 s', sub: 'Planos, textos y mezcla de audio', cat: 'Video' },
  { n: '23', file: '06_VIDEO/README_PROMO.md', title: 'Kit de promoción', sub: 'Uso de los archivos de video y redes', cat: 'Video' },
  { n: '24', file: '03_DOCUMENTOS/AGENTS.md', title: 'Contrato operativo para agentes', sub: 'Reglas del repositorio Segaso', cat: 'Técnico' },
  { n: '25', file: '03_DOCUMENTOS/GEMINI.md', title: 'Contexto para Gemini', sub: 'Resumen de proyecto para asistentes IA', cat: 'Técnico' },
  { n: '26', file: '03_DOCUMENTOS/ODD/segaso_mvp_core.odd.md', title: 'ODD: núcleo del MVP', sub: 'Objetivo, alcance y criterios de aceptación', cat: 'ODD' },
  { n: '27', file: '03_DOCUMENTOS/ODD/segaso_backoffice_pedidos.odd.md', title: 'ODD: backoffice de pedidos', sub: 'Alcance del panel administrativo', cat: 'ODD' },
  { n: '28', file: '03_DOCUMENTOS/ODD/segaso_calidad_pagina.odd.md', title: 'ODD: calidad de página', sub: 'Accesibilidad, performance y pruebas', cat: 'ODD' },
  { n: '29', file: '03_DOCUMENTOS/ODD/segaso_contenido_social_promo.odd.md', title: 'ODD: contenido social y promo', sub: 'Estrategia de fotos, videos y redes', cat: 'ODD' },
  { n: '30', file: '03_DOCUMENTOS/ODD/segaso_sustentacion.odd.md', title: 'ODD: sustentación', sub: 'Plan de la presentación del 14-nov-2026', cat: 'ODD' },
  { n: '31', file: '03_DOCUMENTOS/00_PROMPT_GLM.md', title: 'Prompt para GLM', sub: 'Contexto completo para generar la presentación', cat: 'Académico' },
  { n: '32', file: '03_DOCUMENTOS/ENTREGABLES/PRESENTACION/DESIGN.md', title: 'Diseño de la presentación', sub: 'Criterios visuales de las diapositivas', cat: 'Diseño' }
];

marked.use({ gfm: true, breaks: false });

const escapeHtml = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const CSS = `
@font-face { font-family: 'SegasoSerif'; src: local('Georgia'); }
@font-face { font-family: 'SegasoSans'; src: local('Segoe UI'); }
* { box-sizing: border-box; }
body { margin:0; font-family:'SegasoSerif', Georgia, serif; color:#1b1416; font-size:10.6pt; line-height:1.62; }
.cover { height:245mm; background:#120C0E; color:#F3ECDA; border-radius:5mm; padding:20mm 18mm; position:relative; page-break-after:always; overflow:hidden; }
.cover::before { content:''; position:absolute; top:-40mm; right:-40mm; width:130mm; height:130mm; border-radius:50%; background:radial-gradient(circle, rgba(166,24,40,.55), rgba(166,24,40,0) 70%); }
.cover::after { content:''; position:absolute; left:0; bottom:0; width:100%; height:6mm; background:linear-gradient(90deg,#A61828,#E5A93C); }
.cover .brand { display:flex; align-items:center; gap:5mm; position:relative; }
.cover .brand img { width:22mm; height:22mm; }
.cover .brand span { font-family:'SegasoSans',sans-serif; font-size:9pt; letter-spacing:.32em; text-transform:uppercase; color:#E5A93C; }
.cover h1 { font-family:'SegasoSans',sans-serif; font-weight:700; font-size:34pt; line-height:1.08; letter-spacing:-.01em; margin:34mm 0 5mm; color:#F3ECDA; position:relative; }
.cover .sub { font-family:'SegasoSans',sans-serif; font-size:12pt; color:#d9cdb8; max-width:135mm; position:relative; }
.cover .rule { width:38mm; height:1.6mm; background:#E5A93C; margin:9mm 0; position:relative; }
.cover .meta { position:absolute; bottom:20mm; left:18mm; right:18mm; font-family:'SegasoSans',sans-serif; font-size:9pt; color:#b9ab97; display:flex; justify-content:space-between; }
.cover .cat { display:inline-block; font-family:'SegasoSans',sans-serif; font-size:8.5pt; letter-spacing:.18em; text-transform:uppercase; color:#120C0E; background:#E5A93C; padding:1.6mm 4mm; border-radius:1mm; margin-top:6mm; position:relative; }
h1,h2,h3,h4 { font-family:'SegasoSans',sans-serif; color:#8f1423; line-height:1.22; page-break-after:avoid; }
h1 { font-size:19pt; margin:0 0 4mm; padding-bottom:3mm; border-bottom:.5mm solid #e8dcc4; }
h2 { font-size:14pt; margin:8mm 0 2.5mm; }
h3 { font-size:11.6pt; margin:6mm 0 2mm; color:#120C0E; }
h4 { font-size:10.5pt; margin:4mm 0 1.5mm; color:#120C0E; }
p { margin:0 0 2.6mm; text-align:justify; }
ul,ol { margin:0 0 3mm; padding-left:6mm; }
li { margin-bottom:1.2mm; }
strong { color:#120C0E; }
a { color:#8f1423; text-decoration:none; border-bottom:.2mm solid rgba(143,20,35,.35); }
blockquote { margin:3mm 0; padding:3mm 5mm; background:#faf5ea; border-left:1.2mm solid #E5A93C; color:#4a3a2c; font-style:italic; }
blockquote p:last-child { margin-bottom:0; }
table { width:100%; border-collapse:collapse; margin:3mm 0 5mm; font-family:'SegasoSans',sans-serif; font-size:8.6pt; page-break-inside:avoid; }
thead { display:table-header-group; }
th { background:#120C0E; color:#F3ECDA; text-align:left; padding:2.2mm 2.4mm; font-weight:600; }
td { padding:1.9mm 2.4mm; border-bottom:.2mm solid #e6dccb; vertical-align:top; }
tbody tr:nth-child(even) { background:#faf6ee; }
code { font-family:Consolas,'Courier New',monospace; font-size:8.8pt; background:#f1ece2; padding:.4mm 1.2mm; border-radius:1mm; color:#7a1120; }
pre { background:#120C0E; color:#f0e6d2; padding:4mm; border-radius:2mm; overflow:hidden; page-break-inside:avoid; margin:3mm 0 4mm; }
pre code { background:none; color:inherit; padding:0; font-size:8.2pt; line-height:1.45; }
hr { border:0; border-top:.3mm solid #e0d4bf; margin:6mm 0; }
img { max-width:100%; }
.doc-head { display:flex; align-items:center; gap:4mm; margin-bottom:6mm; padding-bottom:4mm; border-bottom:.4mm solid #e8dcc4; }
.doc-head img { width:14mm; }
.doc-head div { font-family:'SegasoSans',sans-serif; font-size:8pt; letter-spacing:.22em; text-transform:uppercase; color:#8a7a68; }
`;

function template(doc, bodyHtml) {
  const logo = fs.existsSync(LOGO) ? 'file:///' + LOGO.replace(/\\/g, '/') : '';
  const date = '31 de octubre de 2026';
  return `<!doctype html><html lang="es"><head><meta charset="utf-8">
<title>${escapeHtml(doc.title)} — Segaso Chorizos</title>
<style>${CSS}</style></head><body>
<section class="cover">
  <div class="brand">${logo ? `<img src="${logo}" alt="Segaso">` : ''}<span>Segaso Chorizos</span></div>
  <h1>${escapeHtml(doc.title)}</h1>
  <div class="sub">${escapeHtml(doc.sub)}</div>
  <div class="rule"></div>
  <div class="cat">${escapeHtml(doc.cat)}</div>
  <div class="meta"><span>Documento ${doc.n} · ${escapeHtml(doc.cat)}</span><span>${date}</span></div>
</section>
<main>
  <div class="doc-head">${logo ? `<img src="${logo}" alt="">` : ''}<div>Segaso Chorizos · ${escapeHtml(doc.cat)}</div></div>
  ${bodyHtml}
</main>
</body></html>`;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const targets = ONLY ? DOCS.filter((d) => d.n === ONLY || d.file.includes(ONLY)) : DOCS;
  if (!targets.length) throw new Error('Sin documentos que coincidan con ' + ONLY);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  const results = [];

  for (const doc of targets) {
    const src = path.join(ROOT, doc.file);
    if (!fs.existsSync(src)) { console.warn('FALTA', doc.file); continue; }
    const md = fs.readFileSync(src, 'utf8').replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
    const body = marked.parse(md);
    const html = template(doc, body);
    const htmlDir = path.join(__dirname, 'html');
    fs.mkdirSync(htmlDir, { recursive: true });
    fs.writeFileSync(path.join(htmlDir, `${doc.n}.html`), html, 'utf8');
    await page.setContent(html, { waitUntil: 'load' });
    const pdfName = `${doc.n}_${doc.title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '').toUpperCase()}.pdf`;
    const pdfPath = path.join(OUT, pdfName);
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '16mm', bottom: '18mm', left: '16mm', right: '16mm' },
      displayHeaderFooter: true,
      headerTemplate: '<div style="width:100%"></div>',
      footerTemplate: `<div style="width:100%;padding:0 16mm;font-family:Segoe UI,Arial,sans-serif;font-size:7.5pt;color:#8a7a68;display:flex;justify-content:space-between;border-top:.3mm solid #e8dcc4;padding-top:2mm;">
        <span>${escapeHtml(doc.title)}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`
    });
    const kb = Math.round(fs.statSync(pdfPath).size / 1024);
    const pages = (fs.readFileSync(pdfPath).toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
    results.push({ n: doc.n, pdf: pdfName, cat: doc.cat, title: doc.title, sub: doc.sub, kb, pages });
    console.log(`OK ${pdfName} (${kb} KB, ${pages} pág.)`);
  }

  await browser.close();
  const manifestPath = path.join(OUT, 'manifest.json');
  const previous = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : [];
  const merged = [...previous.filter((p) => !results.some((r) => r.n === p.n)), ...results].sort((a, b) => a.n.localeCompare(b.n));
  fs.writeFileSync(manifestPath, JSON.stringify(merged, null, 2), 'utf8');
  console.log(`TOTAL ${results.length} PDF(s) en ${OUT}`);

  if (!ONLY) await buildIndex(merged);
}

async function buildIndex(list) {
  const groups = ['Sustentación', 'Académico', 'Técnico', 'Diseño', 'Estrategia', 'Contenido', 'Video', 'ODD'];
  const totalPages = list.reduce((s, d) => s + (d.pages || 0), 0);
  const rows = groups.map((g) => {
    const items = list.filter((d) => d.cat === g);
    if (!items.length) return '';
    return `<h2>${escapeHtml(g)}</h2><table><thead><tr><th style="width:12mm">N°</th><th>Documento</th><th style="width:20mm">Págs.</th></tr></thead><tbody>` +
      items.map((d) => `<tr><td><strong>${d.n}</strong></td><td><strong>${escapeHtml(d.title)}</strong><br><span style="color:#6b5a4a">${escapeHtml(d.sub)}</span></td><td>${d.pages}</td></tr>`).join('') +
      `</tbody></table>`;
  }).join('');
  const doc = { n: '00', title: 'Índice general de guías y documentos', sub: `${list.length} documentos en PDF · ${totalPages} páginas en total`, cat: 'Índice' };
  const body = `<p>Todos los documentos del proyecto Segaso Chorizos, listos para leer o imprimir. Cada archivo conserva su número en el nombre: <code>01_…pdf</code> es la guía maestra de sustentación.</p>
  <h2>Resumen</h2>
  <table><thead><tr><th>Categoría</th><th>Documentos</th><th>Páginas</th></tr></thead><tbody>
  ${groups.map((g) => { const it = list.filter((d) => d.cat === g); return it.length ? `<tr><td><strong>${g}</strong></td><td>${it.length}</td><td>${it.reduce((s, d) => s + (d.pages || 0), 0)}</td></tr>` : ''; }).join('')}
  <tr><td><strong>Total</strong></td><td><strong>${list.length}</strong></td><td><strong>${totalPages}</strong></td></tr>
  </tbody></table>${rows}`;
  const html = template(doc, body);
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  const out = path.join(OUT, '00_INDICE_GENERAL.pdf');
  await page.pdf({
    path: out,
    format: 'A4',
    printBackground: true,
    margin: { top: '16mm', bottom: '18mm', left: '16mm', right: '16mm' },
    displayHeaderFooter: true,
    headerTemplate: '<div style="width:100%"></div>',
    footerTemplate: '<div style="width:100%;padding:0 16mm;font-family:Segoe UI,Arial,sans-serif;font-size:7.5pt;color:#8a7a68;display:flex;justify-content:space-between;border-top:.3mm solid #e8dcc4;padding-top:2mm;"><span>Índice general</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>'
  });
  await browser.close();
  console.log('OK 00_INDICE_GENERAL.pdf');
}

main().catch((e) => { console.error(e); process.exit(1); });
