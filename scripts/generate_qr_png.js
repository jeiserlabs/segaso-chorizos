const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 600, height: 600 } });
  const svgPath = path.resolve(__dirname, '../assets/qr_segaso_web.svg');
  const svgContent = fs.readFileSync(svgPath, 'utf-8');
  await page.setContent(`<!DOCTYPE html>
<html>
<head>
<style>
  body { margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; width: 600px; height: 600px; background: #ffffff; }
  svg { width: 520px; height: 520px; }
</style>
</head>
<body>${svgContent}</body>
</html>`);
  const pngPath = path.resolve(__dirname, '../assets/qr_segaso_web.png');
  await page.screenshot({ path: pngPath, type: 'png' });
  await browser.close();
  console.log('PNG QR generado exitosamente:', pngPath, 'Size:', fs.statSync(pngPath).size);
})();
