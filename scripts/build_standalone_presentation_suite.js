const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function toBase64(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mime = ext === '.svg' ? 'image/svg+xml' : ext === '.webp' ? 'image/webp' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
  const data = fs.readFileSync(filePath);
  return `data:${mime};base64,${data.toString('base64')}`;
}

async function main() {
  console.log('🚀 Iniciando compilación de la suite de presentación Segaso...');

  // 1. Cargar y preparar HTML autónomo
  const sourceHtmlPath = 'C:/PROYECTOS/Mis_Proyectos/Segaso/docs/presentacion_y_diagramas/1_PRESENTACION_PITCH.html';
  let htmlContent = fs.readFileSync(sourceHtmlPath, 'utf-8');

  // Cargar assets en Base64
  console.log('📦 Codificando imágenes a Base64 para autonomía total...');
  const logoB64 = toBase64('C:/PROYECTOS/Mis_Proyectos/Segaso/logo_segaso.svg');
  const qrB64 = toBase64('C:/PROYECTOS/Mis_Proyectos/Segaso/assets/qr_segaso_web.svg');
  const vitrinaB64 = toBase64('C:/PROYECTOS/Mis_Proyectos/Segaso/docs/SUSTENTACION_2026/CAPTURAS/01_vitrina.png');
  const adminB64 = toBase64('C:/PROYECTOS/Mis_Proyectos/Segaso/docs/SUSTENTACION_2026/CAPTURAS/05_admin_dashboard.png');

  // Reemplazar referencias externas
  htmlContent = htmlContent.replace(/\.\.\/_assets\/logo_segaso\.svg/g, logoB64);
  htmlContent = htmlContent.replace(/src="qr_segaso_web\.svg"/g, `src="${qrB64}"`);
  htmlContent = htmlContent.replace(/\.\.\/05_CAPTURAS\/ADMIN_Y_FLUJO\/01_vitrina\.png/g, vitrinaB64);
  htmlContent = htmlContent.replace(/\.\.\/05_CAPTURAS\/ADMIN_Y_FLUJO\/05_admin_dashboard\.png/g, adminB64);

  // Guardar HTML Autónomo Compacto
  const outHtmlPath = 'C:/Users/dev/Downloads/SEGASO_Presentacion_Autonoma_Completa.html';
  fs.writeFileSync(outHtmlPath, htmlContent, 'utf-8');
  console.log(`✅ [1/3] HTML Autónomo generado en: ${outHtmlPath} (${(fs.statSync(outHtmlPath).size / 1024).toFixed(1)} KB)`);

  // 2. Renderizar cada diapositiva en alta resolución (1920x1080) con Playwright
  console.log('📸 Renderizando diapositivas con Playwright (1920x1080 16:9)...');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('file:///' + outHtmlPath.replace(/\\\\/g, '/'), { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const totalSlides = 11;
  const slideImages = [];
  const slidesDir = 'C:/Users/dev/Downloads/segaso_slides_temp';
  if (!fs.existsSync(slidesDir)) fs.mkdirSync(slidesDir, { recursive: true });

  for (let s = 1; s <= totalSlides; s++) {
    await page.evaluate((idx) => updateSlide(idx), s);
    await page.waitForTimeout(400);
    const imgPath = path.join(slidesDir, `slide_${s.toString().padStart(2, '0')}.png`);
    await page.screenshot({ path: imgPath });
    slideImages.push(imgPath);
    console.log(`   ✓ Diapositiva ${s}/${totalSlides} capturada`);
  }

  await browser.close();

  // 3. Generar PDF oficial a partir de las imágenes 16:9
  console.log('📄 [2/3] Generando PDF oficial de sustentación...');
  const outPdfPath = 'C:/Users/dev/Downloads/SEGASO_CHORIZOS_Sustentacion_Final_Oficial.pdf';
  const pyPdfScript = `
import pypdf
from PIL import Image
import io, glob, os

slide_imgs = sorted(glob.glob(r'${slidesDir}/slide_*.png'))
writer = pypdf.PdfWriter()

for img_path in slide_imgs:
    img = Image.open(img_path).convert('RGB')
    byte_arr = io.BytesIO()
    img.save(byte_arr, format='PDF')
    byte_arr.seek(0)
    pdf_page = pypdf.PdfReader(byte_arr).pages[0]
    writer.add_page(pdf_page)

with open(r'${outPdfPath}', 'wb') as f:
    writer.write(f)

print('PDF guardado exitosamente con', len(writer.pages), 'paginas.')
`;
  fs.writeFileSync('C:/Users/dev/Downloads/gen_pdf_temp.py', pyPdfScript, 'utf-8');
  execSync('python C:/Users/dev/Downloads/gen_pdf_temp.py', { stdio: 'inherit' });
  console.log(`✅ [2/3] PDF Oficial generado en: ${outPdfPath} (${(fs.statSync(outPdfPath).size / 1024).toFixed(1)} KB)`);

  // 4. Generar PPTX oficial a partir de las imágenes 16:9
  console.log('📊 [3/3] Generando PPTX oficial de sustentación...');
  const outPptxPath = 'C:/Users/dev/Downloads/SEGASO_CHORIZOS_Sustentacion_Final_Oficial.pptx';
  const pyPptxScript = `
from pptx import Presentation
from pptx.util import Inches
import glob, os

prs = Presentation()
prs.slide_width = Inches(13.333)  # 16:9 standard width
prs.slide_height = Inches(7.5)    # 16:9 standard height

blank_layout = prs.slide_layouts[6]
slide_imgs = sorted(glob.glob(r'${slidesDir}/slide_*.png'))

for img_path in slide_imgs:
    slide = prs.slides.add_slide(blank_layout)
    slide.shapes.add_picture(img_path, 0, 0, width=prs.slide_width, height=prs.slide_height)

prs.save(r'${outPptxPath}')
print('PPTX guardado exitosamente con', len(prs.slides), 'diapositivas.')
`;
  fs.writeFileSync('C:/Users/dev/Downloads/gen_pptx_temp.py', pyPptxScript, 'utf-8');
  execSync('python C:/Users/dev/Downloads/gen_pptx_temp.py', { stdio: 'inherit' });
  console.log(`✅ [3/3] PPTX Oficial generado en: ${outPptxPath} (${(fs.statSync(outPptxPath).size / 1024).toFixed(1)} KB)`);

  // Limpiar temporales
  fs.unlinkSync('C:/Users/dev/Downloads/gen_pdf_temp.py');
  fs.unlinkSync('C:/Users/dev/Downloads/gen_pptx_temp.py');
  console.log('🎉 ¡Suite de presentación compilada al 100% en los 3 formatos!');
}

main().catch(console.error);
