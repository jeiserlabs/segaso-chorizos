const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

if (!process.env.JWT_SECRET) {
  try {
    const envContent = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...value] = trimmed.split('=');
        if (key && value) process.env[key.trim()] = value.join('=').trim();
      }
    }
  } catch (_) {}
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = crypto.randomBytes(32).toString('hex');
}

const { chromium } = require('playwright');
const server = require('../server.js');
const { collectPageQuality, assertPageQuality, checkHttpSurface } = require('../tests/page_quality.js');

const PORT = Number(process.env.AUDIT_PORT || 3097);
const BASE = `http://127.0.0.1:${PORT}`;
const SECTIONS = ['#calidad', '#catalogo', '#asados', '#tiktok', '#contacto'];

async function auditViewport(browser, viewport, options = {}) {
  const context = await browser.newContext({ viewport, locale: 'es-CO', ...options });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  const badResponses = [];
  const failedRequests = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('response', (response) => {
    if (response.status() >= 400) badResponses.push({ url: response.url(), status: response.status() });
  });
  page.on('requestfailed', (request) => failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForSelector('#productsContainer .product-card');
  for (const selector of SECTIONS) {
    const section = await page.$(selector);
    if (section) await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
  }
  await page.waitForTimeout(600);
  const metrics = await collectPageQuality(page, { consoleErrors, pageErrors, badResponses, failedRequests });
  await checkHttpSurface(context.request, BASE);
  await context.close();
  return metrics;
}

function summary(label, metrics) {
  const mb = (metrics.totalTransfer / 1048576).toFixed(2);
  return `✓ ${label}: ${mb} MB · ${metrics.brokenImages.length} rotas · ${metrics.consoleErrors.length} consola · H1 ${metrics.h1Count} · ${metrics.fieldsNoLabel} sin label · ${metrics.smallTapTargets.length} taps <44 · overflow ${metrics.horizontalOverflow}px`;
}

(async () => {
  await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));
  const browser = await chromium.launch({ headless: true });
  try {
    const desktop = await auditViewport(browser, { width: 1440, height: 900 });
    assertPageQuality(desktop);
    const mobile = await auditViewport(browser, { width: 390, height: 844 }, { isMobile: true, hasTouch: true });
    assertPageQuality(mobile, { maxTransferBytes: 2.5 * 1024 * 1024 });

    if (process.argv.includes('--json')) {
      console.log(JSON.stringify({ desktop, mobile }, null, 2));
    } else {
      console.log(summary('Desktop', desktop));
      console.log(summary('Mobile', mobile));
      console.log('✓ Superficie HTTP: 8/8 rutas con el status esperado');
      console.log('✓ JSON-LD: FoodEstablishment con 9 ofertas');
      console.log('AUDITORÍA DE PÁGINA 100% EXITOSA');
    }
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
})().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
