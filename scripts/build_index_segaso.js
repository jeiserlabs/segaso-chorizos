/**
 * @file scripts/build_index_segaso.js
 * @description Genera el ABRIR_AQUI.html y las galerías del paquete Segaso.
 * Uso: node scripts/build_index_segaso.js <ruta-del-paquete>
 */

const fs = require('node:fs');
const path = require('node:path');

const ROOT = process.argv[2] ? path.resolve(process.argv[2]) : path.join(__dirname, '..');
const OUT = ROOT;
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, '02_GUIAS_PDF/manifest.json'), 'utf8'));

const enc = (p) => encodeURI(p.split(path.sep).join('/'));
const writePage = (file, html) => {
  const needsPrefix = file.startsWith('04_FOTOS/') || file.startsWith('05_CAPTURAS/');
  const fixed = needsPrefix
    ? html.replace(/(href|src)="((?:0[1-8]_)[^"]*)"/g, (m, a, p) => `${a}="../${p}"`)
    : html;
  fs.writeFileSync(path.join(OUT, file), fixed, 'utf8');
};
const rel = (p) => p.split(path.sep).join('/');
const exists = (p) => fs.existsSync(path.join(ROOT, p));
const list = (dir, filter = () => true) => {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs).filter(filter).sort().map((f) => rel(path.join(dir, f)));
};
const PRODUCT_NAMES = {
  '01_caserito': 'Caserito Paisa', '02_antioqueno': 'Antioqueño', '03_santarrosano': 'Santarrosano',
  '04_tocineta': 'Tocineta', '05_parrillero': 'Parrillero', '06_picante': 'Picante',
  '07_argentino': 'Argentino', '08_morcilla': 'Morcilla', '09_chimichurri': 'Chimichurri'
};
const productName = (f) => PRODUCT_NAMES[path.basename(f, path.extname(f))] || titleOf(f);
const titleOf = (f) => path.basename(f, path.extname(f)).replace(/^\d+[_-]?/, '').replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const CAT_ORDER = ['Sustentación', 'Académico', 'Técnico', 'Diseño', 'Estrategia', 'Contenido', 'Video', 'ODD'];
const pdfByCat = CAT_ORDER.map((cat) => ({ cat, items: manifest.filter((m) => m.cat === cat) })).filter((g) => g.items.length);

const CSS = `:root{--carbon:#120C0E;--tinto:#A61828;--gold:#E5A93C;--cream:#F3ECDA;--line:rgba(243,236,218,.14);--muted:#b9ab97}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--carbon);color:var(--cream);font-family:'Segoe UI',system-ui,-apple-system,sans-serif;line-height:1.55}
img{display:block;max-width:100%}
a{color:inherit;text-decoration:none}
.top{position:sticky;top:0;z-index:40;display:flex;align-items:center;justify-content:space-between;gap:18px;padding:14px 28px;background:rgba(18,12,14,.92);backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}
.brand{display:flex;align-items:center;gap:10px;font-weight:800;letter-spacing:.18em;font-size:13px;text-transform:uppercase}
.brand img{width:34px;height:34px}
.top nav{display:flex;gap:4px;flex-wrap:wrap}
.top nav a{font-size:13px;padding:8px 12px;border-radius:99px;color:var(--muted)}
.top nav a:hover{color:var(--cream);background:rgba(243,236,218,.08)}
.hero{position:relative;min-height:480px;display:flex;align-items:center;overflow:hidden;border-bottom:1px solid var(--line)}
.hero-bg{position:absolute;inset:0;background-size:cover;background-position:center;filter:saturate(.9);transform:scale(1.06)}
.hero::after{content:'';position:absolute;inset:0;background:linear-gradient(100deg,rgba(18,12,14,.96) 20%,rgba(18,12,14,.72) 55%,rgba(18,12,14,.35) 100%)}
.hero-inner{position:relative;z-index:2;max-width:1080px;margin:0 auto;padding:72px 28px;width:100%}
.eyebrow{display:inline-block;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:var(--gold);border:1px solid rgba(229,169,60,.45);padding:7px 14px;border-radius:99px}
.hero h1{font-family:Georgia,'Times New Roman',serif;font-size:clamp(34px,5vw,58px);line-height:1.06;margin:20px 0 14px;max-width:760px}
.hero p{max-width:620px;color:#d9cdb8;font-size:17px;margin:0 0 26px}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:26px}
.chip{font-size:12px;color:#e8dcc4;border:1px solid var(--line);background:rgba(243,236,218,.06);padding:6px 12px;border-radius:99px}
.cta{display:flex;flex-wrap:wrap;gap:12px}
.btn{display:inline-flex;align-items:center;gap:8px;padding:13px 22px;border-radius:12px;font-weight:700;font-size:14px;border:1px solid var(--line);background:rgba(243,236,218,.06)}
.btn:hover{background:rgba(243,236,218,.12)}
.btn.primary{background:var(--tinto);border-color:transparent;color:#fff}
.btn.primary:hover{background:#8f1423}
.btn.gold{background:var(--gold);color:#231a10;border-color:transparent}
main{max-width:1180px;margin:0 auto;padding:56px 28px 90px}
section{margin-bottom:70px;scroll-margin-top:84px}
.sec-head{display:flex;align-items:baseline;justify-content:space-between;gap:18px;flex-wrap:wrap;margin-bottom:22px}
.sec-head h2{font-family:Georgia,serif;font-size:30px;margin:0}
.sec-head .hint{color:var(--muted);font-size:14px}
.sec-head .more{color:var(--gold);font-size:13px;font-weight:700;border-bottom:1px solid rgba(229,169,60,.4)}
.grid{display:grid;gap:16px}
.g3{grid-template-columns:repeat(3,minmax(0,1fr))}
.g2{grid-template-columns:repeat(2,minmax(0,1fr))}
.g4{grid-template-columns:repeat(4,minmax(0,1fr))}
.card{background:#1a1315;border:1px solid var(--line);border-radius:16px;padding:20px;transition:.18s}
.card:hover{border-color:rgba(229,169,60,.45);transform:translateY(-2px)}
.card h3{margin:0 0 6px;font-size:17px;color:var(--cream)}
.card p{margin:0;color:var(--muted);font-size:13.5px}
.card .tag{display:inline-block;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);margin-bottom:10px}
.steps{counter-reset:s;margin:0;padding:0;list-style:none}
.steps li{position:relative;padding-left:38px;margin-bottom:10px;color:#d9cdb8;font-size:14px}
.steps li::before{counter-increment:s;content:counter(s);position:absolute;left:0;top:0;width:26px;height:26px;border-radius:50%;background:rgba(229,169,60,.16);color:var(--gold);font-weight:700;font-size:13px;display:grid;place-items:center}
.code{font-family:Consolas,monospace;font-size:12.5px;background:#0d0809;border:1px solid var(--line);border-radius:10px;padding:10px 12px;color:#e8dcc4;display:block;margin-top:10px;word-break:break-all}
.pdf-card{display:flex;gap:16px;align-items:flex-start;background:#1a1315;border:1px solid var(--line);border-radius:14px;padding:16px 18px}
.pdf-card:hover{border-color:rgba(229,169,60,.45);background:#20181a}
.pdf-num{font-family:Georgia,serif;font-size:26px;color:rgba(229,169,60,.75);min-width:44px;line-height:1}
.pdf-card strong{display:block;font-size:15px;margin-bottom:2px}
.pdf-card span{font-size:12.5px;color:var(--muted)}
.pdf-card .pages{margin-left:auto;font-size:12px;color:var(--gold);white-space:nowrap}
.mosaic{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.mosaic a{position:relative;display:block;border-radius:14px;overflow:hidden;border:1px solid var(--line);background:#1a1315;aspect-ratio:1/1}
.mosaic img{width:100%;height:100%;object-fit:cover;transition:.3s}
.mosaic a:hover img{transform:scale(1.05)}
.mosaic .cap{position:absolute;left:0;right:0;bottom:0;padding:18px 12px 10px;font-size:12px;background:linear-gradient(to top,rgba(18,12,14,.92),transparent)}
.video-wrap{display:grid;grid-template-columns:320px 1fr;gap:26px;align-items:start;background:#1a1315;border:1px solid var(--line);border-radius:18px;padding:22px}
.video-wrap video{width:100%;max-height:560px;border-radius:12px;background:#000}
.video-meta h3{margin:0 0 8px;font-family:Georgia,serif;font-size:24px}
.video-meta p{color:var(--muted);font-size:14px;margin:0 0 16px}
.links{display:flex;flex-direction:column;gap:8px}
.links a{display:flex;justify-content:space-between;gap:12px;padding:11px 14px;border-radius:10px;background:rgba(243,236,218,.05);border:1px solid var(--line);font-size:13.5px}
.links a:hover{border-color:rgba(229,169,60,.45)}
.links a span{color:var(--muted);font-size:12px}
.folders{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.folder{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:14px;background:#1a1315;border:1px solid var(--line)}
.folder:hover{border-color:rgba(229,169,60,.45)}
.folder .ico{width:38px;height:38px;border-radius:10px;background:rgba(229,169,60,.14);display:grid;place-items:center;color:var(--gold);font-size:18px}
.folder strong{display:block;font-size:14px}
.folder span{font-size:12.5px;color:var(--muted)}
details{border:1px solid var(--line);border-radius:14px;padding:16px 18px;background:#1a1315}
details summary{cursor:pointer;font-weight:700;font-size:15px}
details ul{margin:14px 0 0;padding-left:18px;color:var(--muted);font-size:13.5px;columns:2;column-gap:34px}
details li{margin-bottom:6px;break-inside:avoid}
details a:hover{color:var(--gold)}
footer{border-top:1px solid var(--line);padding:30px 28px 50px;text-align:center;color:var(--muted);font-size:13px}
.lightbox{position:fixed;inset:0;z-index:90;background:rgba(8,5,6,.94);display:none;align-items:center;justify-content:center;padding:30px}
.lightbox.open{display:flex}
.lightbox img{max-width:94vw;max-height:92vh;border-radius:12px;box-shadow:0 30px 90px rgba(0,0,0,.7)}
.lightbox button{position:absolute;top:18px;right:22px;background:rgba(243,236,218,.12);color:var(--cream);border:1px solid var(--line);width:42px;height:42px;border-radius:50%;font-size:20px;cursor:pointer}
@media(max-width:980px){.g3,.g4{grid-template-columns:repeat(2,minmax(0,1fr))}.mosaic{grid-template-columns:repeat(3,minmax(0,1fr))}.video-wrap{grid-template-columns:1fr}.video-wrap video{max-height:460px;width:auto;margin:0 auto}}
@media(max-width:640px){.top{padding:12px 16px;flex-direction:column;align-items:stretch;gap:10px}.top nav{display:flex;overflow-x:auto;flex-wrap:nowrap;gap:2px;padding-bottom:2px}.top nav a{white-space:nowrap;font-size:12px;padding:6px 10px}main{padding:40px 16px 70px}.g3,.g4,.g2,.folders{grid-template-columns:1fr}.mosaic{grid-template-columns:repeat(2,minmax(0,1fr))}details ul{columns:1}.hero-inner{padding:54px 18px}}
`;

const GAL_CSS = CSS + `.gal{grid-template-columns:repeat(5,minmax(0,1fr))}@media(max-width:980px){.gal{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:640px){.gal{grid-template-columns:repeat(2,minmax(0,1fr))}}`;

fs.writeFileSync(path.join(ROOT, '_assets/estilos.css'), CSS, 'utf8');

const LOGO = '_assets/logo_segaso.svg';

const shot = (src, cap) => `<a class="shot" href="${enc(src)}" data-cap="${cap || ''}"><img src="${enc(src)}" alt="${cap || ''}" loading="lazy" decoding="async"><span class="cap">${cap || ''}</span></a>`;

function page({ file, cssFile, title, nav, body, extraHead = '' }) {
  const base = file.includes('/') ? '../' : '';
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title><link rel="stylesheet" href="${cssFile}">${extraHead}</head><body>
<header class="top"><a class="brand" href="${file === 'ABRIR_AQUI.html' ? '#inicio' : base + 'ABRIR_AQUI.html'}"><img src="${base}${LOGO}" alt="Segaso">Segaso</a>${nav}</header>
${body}
<footer>Segaso Chorizos · Centro de presentación · 31 de octubre de 2026<br>Los archivos viven en esta carpeta. Nada depende de internet salvo las fuentes y los enlaces externos.</footer>
<div class="lightbox" id="lb"><button aria-label="Cerrar">×</button><img alt=""></div>
<script>
const lb=document.getElementById('lb');const lbi=lb.querySelector('img');
document.addEventListener('click',e=>{const a=e.target.closest('a.shot');if(a){e.preventDefault();lbi.src=a.getAttribute('href');lb.classList.add('open');}if(e.target===lb||e.target.closest('#lb button')){lb.classList.remove('open');lbi.src='';}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){lb.classList.remove('open');lbi.src='';}});
</script></body></html>`;
}

/* ---------- MASTER ---------- */
const products = list('04_FOTOS/PRODUCTOS', (f) => f.endsWith('.jpg'));
const tiktokGal = list('04_FOTOS/TIKTOK_GALERIA', (f) => f.endsWith('.jpg'));
const covers = list('04_FOTOS/TIKTOK_PORTADAS', (f) => f.endsWith('.jpg'));
const finalCaps = list('05_CAPTURAS/PAGINA_FINAL', (f) => f.endsWith('.png'));
const adminCaps = list('05_CAPTURAS/ADMIN_Y_FLUJO', (f) => f.endsWith('.png'));
const keyframes = list('04_FOTOS/TIKTOK_KEYFRAMES', (f) => f.endsWith('.jpg'));

const nav = `<nav><a href="#estudio">Estudio</a><a href="#pagina">Página</a><a href="#presentacion">Presentación</a><a href="#guias">Guías PDF</a><a href="#documentos">Documentos</a><a href="#fotos">Fotos</a><a href="#capturas">Capturas</a><a href="#video">Video</a><a href="#original">Media original</a><a href="#paquetes">Paquetes</a></nav>`;

const pdfTotalPages = manifest.reduce((s, m) => s + (m.pages || 0), 0);

const pdfGroupHtml = pdfByCat.map(({ cat, items }) => `
<div class="sec-head" style="margin-top:34px"><h2 style="font-size:21px">${cat}</h2><span class="hint">${items.length} documento(s)</span></div>
<div class="grid g2">${items.map((m) => `<a class="pdf-card" href="02_GUIAS_PDF/${enc(m.pdf)}"><span class="pdf-num">${m.n}</span><span><strong>${m.title}</strong><span>${m.sub}</span></span><span class="pages">${m.pages} pág.</span></a>`).join('')}</div>`).join('');

const mdRoot = list('03_DOCUMENTOS', (f) => f.endsWith('.md'));
const mdTech = list('03_DOCUMENTOS/TECNICO', (f) => f.endsWith('.md'));
const mdSocial = list('03_DOCUMENTOS/TECNICO/SOCIAL', (f) => f.endsWith('.md'));
const mdOdd = list('03_DOCUMENTOS/ODD', (f) => f.endsWith('.md'));
const htmlEnt = [
  ...list('03_DOCUMENTOS/ENTREGABLES', (f) => f.endsWith('.html')),
  ...list('01_PRESENTACION', (f) => f.endsWith('.html'))
];

const master = page({
  file: 'ABRIR_AQUI.html',
  cssFile: '_assets/estilos.css',
  title: 'Segaso · Centro de presentación',
  nav,
  body: `
<section class="hero" id="inicio"><div class="hero-bg" style="background-image:url('_assets/hero.jpg')"></div>
<div class="hero-inner">
  <span class="eyebrow">Centro de presentación · CESDE · 14 de noviembre de 2026</span>
  <h1>Todo Segaso, en una sola carpeta.</h1>
  <p>La página que funciona, las guías en PDF, las fotos reales de la marca, las capturas de pantalla y el video del promo. Sin buscar en diez sitios distintos.</p>
  <div class="chips"><span class="chip">${manifest.length} guías PDF · ${pdfTotalPages} páginas</span><span class="chip">9 referencias</span><span class="chip">${keyframes.length} keyframes</span><span class="chip">Video 30 s vertical y horizontal</span><span class="chip">Página de 1.29 MB</span></div>
  <div class="cta"><a class="btn primary" href="#pagina">Cómo abrir la página</a><a class="btn" href="06_VIDEO/RENDER/SEGASO_PROMO_30S_9x16.mp4">Ver el video</a><a class="btn gold" href="02_GUIAS_PDF/00_INDICE_GENERAL.pdf">Índice de guías</a></div>
</div></section>

<main>
<section id="estudio">
  <div class="sec-head"><h2>0 · Empieza aquí</h2><span class="hint">Ruta de estudio, rutas y reglas</span></div>
  <div class="grid g3">
    <a class="card" href="00_EMPIEZA_AQUI/COMO_ESTUDIAR.md"><span class="tag">Primer paso</span><h3>Cómo estudiar</h3><p>Ruta de 6 sesiones, datos canónicos y lo que NO se debe decir.</p></a>
    <a class="card" href="00_EMPIEZA_AQUI/SSOT_Y_TIMELINE.md"><span class="tag">Rutas</span><h3>Mapa y timeline</h3><p>Repo, Drive, rutas locales y la timeline única del proyecto.</p></a>
    <a class="card" href="01_PRESENTACION/README_PRESENTACION.md"><span class="tag">Formato</span><h3>Presentación</h3><p>Guion de 15 bloques vs. pitch de 10 diapositivas.</p></a>
  </div>
</section>

<section id="pagina">
  <div class="sec-head"><h2>1 · La página</h2><span class="hint">Funciona en local, sin internet</span></div>
  <div class="grid g2">
    <div class="card">
      <span class="tag">Cómo abrirla</span>
      <ol class="steps">
        <li>Entra a <strong>01_PAGINA</strong> y haz doble clic en <strong>ABRIR_PAGINA.bat</strong>.</li>
        <li>Espera 4 segundos: el servidor arranca y el navegador abre la tienda.</li>
        <li>Para el panel de administración, abre <strong>ABRIR_ADMIN.bat</strong>.</li>
      </ol>
      <span class="code">01_PAGINA\\ABRIR_PAGINA.bat</span>
    </div>
    <div class="card">
      <span class="tag">Si ya está corriendo</span>
      <h3>Tienda y backoffice</h3>
      <p>Abre directo en el navegador cuando el servidor ya está encendido.</p>
      <div class="links" style="margin-top:14px">
        <a href="http://localhost:3000">Tienda en local <span>localhost:3000</span></a>
        <a href="http://localhost:3000/chorizos-segaso/admin">Administración <span>/admin</span></a>
        <a href="01_PAGINA/LEEME_PAGINA.txt">Instrucciones completas <span>LEEME_PAGINA.txt</span></a>
      </div>
    </div>
  </div>
</section>

<section id="guias">
  <div class="sec-head"><h2>2 · Guías y documentos en PDF</h2><a class="more" href="02_GUIAS_PDF/INDICE_PDF.html">Ver las ${manifest.length} guías</a></div>
  <p class="hint" style="margin:-10px 0 18px;color:var(--muted);font-size:14px">Cada documento abre en el navegador y se puede imprimir. El .md queda solo como fuente de trabajo.</p>
  <div class="grid g3">
    <a class="card" href="02_GUIAS_PDF/01_GUIA_MAESTRA_DE_SUSTENTACION.pdf"><span class="tag">Empieza aquí</span><h3>Guía maestra</h3><p>Guion de 10 minutos, reparto, preguntas del jurado y plan B.</p></a>
    <a class="card" href="02_GUIAS_PDF/07_DEMO_DEL_MVP_PASO_A_PASO.pdf"><span class="tag">Demo</span><h3>Demo paso a paso</h3><p>Qué mostrar en pantalla, en qué orden y qué decir en cada clic.</p></a>
    <a class="card" href="02_GUIAS_PDF/10_DOCUMENTO_ENTREGABLE_CESDE.pdf"><span class="tag">Académico</span><h3>Documento entregable</h3><p>El informe del proyecto para entregar al instructor.</p></a>
  </div>
  ${pdfGroupHtml}
</section>

<section id="documentos">
  <div class="sec-head"><h2>3 · Entregables y fuentes</h2><span class="hint">Presentación, diagramas y archivos de trabajo</span></div>
  <div class="grid g2" style="margin-bottom:16px">
    ${htmlEnt.map((f) => `<a class="folder" href="${enc(f)}"><span class="ico">◧</span><span><strong>${titleOf(f)}</strong><span>${rel(f)}</span></span></a>`).join('')}
  </div>
  <details><summary>Archivos fuente en Markdown (${mdRoot.length + mdTech.length + mdSocial.length + mdOdd.length})</summary><ul>
    ${[...mdRoot, ...mdTech, ...mdSocial, ...mdOdd].map((f) => `<li><a href="${enc(f)}">${titleOf(f)}</a></li>`).join('')}
  </ul></details>
</section>

<section id="fotos">
  <div class="sec-head"><h2>4 · Fotos reales de la marca</h2><a class="more" href="04_FOTOS/GALERIA_FOTOS.html">Abrir la galería completa</a></div>
  <div class="mosaic">
    ${products.slice(0, 8).map((f) => shot(f, productName(f))).join('')}
    ${finalCaps.slice(0, 4).map((f) => shot(f, 'Página final · ' + titleOf(f))).join('')}
  </div>
</section>

<section id="capturas">
  <div class="sec-head"><h2>5 · Capturas de la página</h2><a class="more" href="05_CAPTURAS/GALERIA_CAPTURAS.html">Ver todas las capturas</a></div>
  <div class="mosaic">
    ${finalCaps.slice(0, 6).map((f) => shot(f, 'Página final')).join('')}
    ${adminCaps.slice(0, 2).map((f) => shot(f, 'Backoffice')).join('')}
  </div>
</section>

<section id="video">
  <div class="sec-head"><h2>6 · Video del promo</h2><span class="hint">Hecho con clips reales de la marca y voz local</span></div>
  <div class="video-wrap">
    <video controls playsinline preload="metadata" poster="06_VIDEO/RENDER/SEGASO_PROMO_MINIATURA.jpg">
      <source src="06_VIDEO/RENDER/SEGASO_PROMO_30S_9x16.mp4" type="video/mp4">
    </video>
    <div class="video-meta">
      <h3>“El fuego se hereda”</h3>
      <p>30 segundos, 1080 × 1920, voz de ElevenLabs y música original compuesta para el video. La versión horizontal sirve para la sustentación; la vertical, para TikTok, Reels y Estados.</p>
      <div class="links">
        <a href="06_VIDEO/RENDER/SEGASO_PROMO_30S_9x16.mp4">Vertical 9:16 · 30 s <span>MP4</span></a>
        <a href="06_VIDEO/RENDER/SEGASO_PROMO_30S_16x9.mp4">Horizontal 16:9 · 30 s <span>MP4</span></a>
        <a href="06_VIDEO/RENDER/SEGASO_PROMO_30S_ES.srt">Subtítulos <span>SRT</span></a>
        <a href="06_VIDEO/RENDER/SEGASO_PROMO_MINIATURA.jpg">Miniatura <span>JPG</span></a>
        <a href="06_VIDEO/STORYBOARD_30S.md">Storyboard y guion <span>MD</span></a>
      </div>
    </div>
  </div>
</section>

<section id="original">
  <div class="sec-head"><h2>7 · Media original y biblioteca</h2><span class="hint">Videos, fotos y portadas descargadas de la marca</span></div>
  <div class="folders">
    <a class="folder" href="07_MEDIA_ORIGINAL/BIBLIOTECA_MEDIA"><span class="ico">▶</span><span><strong>Biblioteca de videos</strong><span>TikTok, Instagram y Facebook con sus keyframes</span></span></a>
    <a class="folder" href="07_MEDIA_ORIGINAL/PROMO_VIDEO_KIT"><span class="ico">◫</span><span><strong>Kit de promo anterior</strong><span>Selección de clips, contact sheets y prompt para IA</span></span></a>
    <a class="folder" href="04_FOTOS/TIKTOK_ORIGINALES"><span class="ico">▣</span><span><strong>Fotos originales de TikTok</strong><span>Las 5 fotos de la marca</span></span></a>
    <a class="folder" href="04_FOTOS/PORTADAS_VIDEOS"><span class="ico">▤</span><span><strong>Portadas de video</strong><span>Miniaturas de los clips</span></span></a>
  </div>
</section>

<section id="paquetes">
  <div class="sec-head"><h2>8 · Paquetes para compartir</h2><span class="hint">ZIP listos para enviar</span></div>
  <div class="folders">
    <a class="folder" href="08_PAQUETES/PAQUETE_SUSTENTACION_SEGASO.zip"><span class="ico">▼</span><span><strong>Paquete de sustentación</strong><span>Documentos y capturas · ZIP</span></span></a>
    <a class="folder" href="07_MEDIA_ORIGINAL/PROMO_VIDEO_KIT/PAQUETE_PROMO_GEMINI_SEGASO.zip"><span class="ico">▼</span><span><strong>Paquete de promo</strong><span>Media y prompt para generar video · ZIP</span></span></a>
  </div>
</section>
<section id="presentacion">
  <div class="sec-head"><h2>Presentación</h2><span class="hint">Pitch comercial de 10 diapositivas + apoyo visual</span></div>
  <div class="grid g2">
    <a class="card" href="01_PRESENTACION/1_PRESENTACION_PITCH.html"><span class="tag">Pitch</span><h3>Abrir presentación</h3><p>10 diapositivas interactivas. No es un PPTX de 15; el guion oral sí tiene 15 bloques.</p></a>
    <a class="card" href="01_PRESENTACION/README_PRESENTACION.md"><span class="tag">Leer</span><h3>Qué hay en presentación</h3><p>Cómo usar el pitch, el studio de diagramas y el dashboard.</p></a>
  </div>
</section>
</main>`
});

writePage('ABRIR_AQUI.html', master);

/* ---------- PDF INDEX ---------- */
const pdfIndex = page({
  file: '02_GUIAS_PDF/INDICE_PDF.html',
  cssFile: '../_assets/estilos.css',
  title: 'Segaso · Guías en PDF',
  nav: `<nav><a href="../ABRIR_AQUI.html">← Volver al inicio</a></nav>`,
  body: `<main><section><div class="sec-head"><h2>Guías y documentos en PDF</h2><span class="hint">${manifest.length} documentos · ${pdfTotalPages} páginas</span></div>
  <div class="grid g3" style="margin-bottom:26px">
    <a class="card" href="00_INDICE_GENERAL.pdf"><span class="tag">Índice</span><h3>Índice general</h3><p>Todos los documentos con su número y número de páginas.</p></a>
    <a class="card" href="01_GUIA_MAESTRA_DE_SUSTENTACION.pdf"><span class="tag">Sustentación</span><h3>Guía maestra</h3><p>El documento que ordena la presentación completa.</p></a>
    <a class="card" href="07_DEMO_DEL_MVP_PASO_A_PASO.pdf"><span class="tag">Demo</span><h3>Demo paso a paso</h3><p>Qué hacer en pantalla durante la presentación.</p></a>
  </div>
  ${pdfByCat.map(({ cat, items }) => `<div class="sec-head" style="margin-top:30px"><h2 style="font-size:21px">${cat}</h2><span class="hint">${items.length}</span></div><div class="grid g2">${items.map((m) => `<a class="pdf-card" href="${enc(m.pdf)}"><span class="pdf-num">${m.n}</span><span><strong>${m.title}</strong><span>${m.sub}</span></span><span class="pages">${m.pages} pág.</span></a>`).join('')}</div>`).join('')}
  </section></main>`
});
writePage('02_GUIAS_PDF/INDICE_PDF.html', pdfIndex);

/* ---------- PHOTO GALLERY ---------- */
const igFb = [
  ...list('04_FOTOS/INSTAGRAM_FACEBOOK', (f) => /\.(jpg|jpeg|png)$/i.test(f)),
  ...list('04_FOTOS/INSTAGRAM_FACEBOOK/instagram', (f) => /\.(jpg|jpeg|png)$/i.test(f)),
  ...list('04_FOTOS/INSTAGRAM_FACEBOOK/facebook', (f) => /\.(jpg|jpeg|png)$/i.test(f)),
  ...list('04_FOTOS/INSTAGRAM_FACEBOOK/instagram/keyframes', (f) => /\.(jpg|jpeg|png)$/i.test(f)),
  ...list('04_FOTOS/INSTAGRAM_FACEBOOK/facebook/keyframes', (f) => /\.(jpg|jpeg|png)$/i.test(f))
];
const barrel = list('04_FOTOS/BARRIL', (f) => /\.(jpg|jpeg|png|webp)$/i.test(f));
const contact = list('04_FOTOS', (f) => f.endsWith('CONTACT_SHEET_TIKTOK.jpg'));

const gallerySection = (title, files, note) => { const items = files.map((f) => Array.isArray(f) ? f : [f, titleOf(f)]); return `<section><div class="sec-head"><h2>${title}</h2><span class="hint">${items.length} imagen(es)${note ? ' · ' + note : ''}</span></div><div class="mosaic gal">${items.map(([f, c]) => shot(f, c)).join('')}</div></section>`; };

const photos = page({
  file: '04_FOTOS/GALERIA_FOTOS.html',
  cssFile: '../_assets/estilos.css',
  title: 'Segaso · Galería de fotos',
  nav: `<nav><a href="../ABRIR_AQUI.html">← Volver al inicio</a></nav>`,
  body: `<main>
  ${gallerySection('Productos (9 referencias)', products.map((f) => [f, productName(f)]), 'JPG 900×900')}
  ${gallerySection('Galería de TikTok', tiktokGal, 'fotos reales de la marca')}
  ${gallerySection('Portadas de video', covers)}
  ${gallerySection('Fotos originales de TikTok', list('04_FOTOS/TIKTOK_ORIGINALES', (f) => /\.(jpg|jpeg|png|webp)$/i.test(f)))}
  ${gallerySection('Barril y asados', barrel)}
  ${gallerySection('Instagram y Facebook', igFb)}
  ${gallerySection('Contact sheets', contact)}
  ${gallerySection('Keyframes de TikTok', keyframes, 'un fotograma por corte')}
  </main>`
});
writePage('04_FOTOS/GALERIA_FOTOS.html', photos);

/* ---------- CAPTURES GALLERY ---------- */
const qaCaps = list('05_CAPTURAS/QA', (f) => f.endsWith('.png'));
const uxCaps = list('05_CAPTURAS/UX_AUDITORIA', (f) => f.endsWith('.png'));

const caps = page({
  file: '05_CAPTURAS/GALERIA_CAPTURAS.html',
  cssFile: '../_assets/estilos.css',
  title: 'Segaso · Capturas',
  nav: `<nav><a href="../ABRIR_AQUI.html">← Volver al inicio</a></nav>`,
  body: `<main>
  ${gallerySection('Página final (escritorio y móvil)', finalCaps)}
  ${gallerySection('Backoffice y flujo de pedido', adminCaps)}
  ${gallerySection('QA final', qaCaps)}
  ${gallerySection('Auditoría UX/UI', uxCaps, 'revisión de galería, carrito y móvil')}
  </main>`
});
writePage('05_CAPTURAS/GALERIA_CAPTURAS.html', caps);

/* ---------- LINK CHECK ---------- */
const pages = ['ABRIR_AQUI.html', '02_GUIAS_PDF/INDICE_PDF.html', '04_FOTOS/GALERIA_FOTOS.html', '05_CAPTURAS/GALERIA_CAPTURAS.html'];
let checked = 0;
const missing = [];
for (const p of pages) {
  const abs = path.join(ROOT, p);
  const html = fs.readFileSync(abs, 'utf8');
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (/^(https?:|#|mailto:|data:)/.test(url)) continue;
    const clean = decodeURI(url.split('#')[0]);
    const target = path.resolve(path.dirname(abs), clean);
    checked++;
    if (!fs.existsSync(target)) missing.push(`${p} -> ${url}`);
  }
}
console.log('enlaces verificados:', checked, '| faltantes:', missing.length);
missing.slice(0, 30).forEach((m) => console.log('  FALTA', m));

const stats = {
  generated: new Date().toISOString(),
  pdfs: manifest.length,
  pdfPages: pdfTotalPages,
  photos: products.length + tiktokGal.length + covers.length + keyframes.length + barrel.length + igFb.length,
  captures: finalCaps.length + adminCaps.length + qaCaps.length + uxCaps.length,
  linksChecked: checked,
  missing
};
fs.writeFileSync(path.join(ROOT, '_assets/indice_stats.json'), JSON.stringify(stats, null, 2), 'utf8');
console.log(JSON.stringify(stats, null, 2));
