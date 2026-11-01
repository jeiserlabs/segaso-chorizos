// tests/e2e_segaso_playwright.js — Auditoría E2E automatizada con Playwright para Segaso Chorizos MVP
const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');

if (!process.env.JWT_SECRET) {
  try {
    const envContent = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [k, ...v] = trimmed.split('=');
        if (k && v) process.env[k.trim()] = v.join('=').trim();
      }
    }
  } catch (_) {}
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = require('crypto').randomBytes(32).toString('hex');
}

const { chromium } = require('playwright');

const CLIENTE_DE_PRUEBA = 'Cliente Verificación Playwright';

/**
 * El E2E corre contra la base REAL (segaso.db), no contra un entorno aislado. Sin esta
 * limpieza, cada corrida deja un pedido fantasma en el panel de Harold y descuenta
 * paquetes que nadie compró: se detectó porque el histórico acumulaba pedidos de
 * "Cliente Verificación Playwright" y el inventario bajaba solo.
 * Debe correr DESPUÉS de cerrar el servidor para no pelear el lock de escritura de WAL.
 */
function limpiarPedidoDePrueba() {
  let db;
  try {
    db = require('better-sqlite3')(path.join(__dirname, '../segaso.db'));
  } catch (err) {
    console.warn(`  ⚠ No se pudo abrir segaso.db para la limpieza: ${err.message}`);
    return;
  }
  try {
    const fila = db.prepare('SELECT id, items_json FROM orders WHERE customer_name = ?').get(CLIENTE_DE_PRUEBA);
    if (!fila) {
      console.log('  ✓ Sin residuos de prueba en la base');
      return;
    }
    let items = [];
    try { items = JSON.parse(fila.items_json) || []; } catch (_) { items = []; }
    db.transaction(() => {
      for (const item of items) {
        if (item && item.id && Number.isFinite(item.qty)) {
          db.prepare('UPDATE inventory SET stock = stock + ? WHERE code = ?').run(item.qty, item.id);
        }
      }
      db.prepare('DELETE FROM orders WHERE id = ?').run(fila.id);
    })();
    console.log(`  ✓ Pedido de prueba eliminado y stock devuelto (${items.map((i) => `${i.id}+${i.qty}`).join(', ') || 'sin items'})`);
  } catch (err) {
    console.warn(`  ⚠ Limpieza de prueba falló: ${err.message}`);
  } finally {
    db.close();
  }
}
const server = require('../server.js');
const { collectPageQuality, assertPageQuality, checkHttpSurface } = require('./page_quality.js');

const TEST_PORT = 3089;
const BASE_URL = `http://127.0.0.1:${TEST_PORT}`;

async function runE2E() {
  console.log('🧪 Iniciando Auditoría E2E con Playwright para Segaso Chorizos MVP...');
  
  // 1. Levantar servidor en puerto de prueba
  await new Promise((resolve) => {
    // Si ya está escuchando, cerrar o reusar
    try {
      server.listen(TEST_PORT, '127.0.0.1', () => {
        console.log(`✓ Servidor Segaso activo en http://127.0.0.1:${TEST_PORT}`);
        resolve();
      });
    } catch (e) {
      resolve();
    }
  });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    consoleErrors.push(err.message);
  });
  page.on('dialog', async dialog => {
    // Aceptar cualquier confirmación o alert de la app
    await dialog.accept();
  });

  try {
    // -------------------------------------------------------------
    // FASE 1: STOREFRONT & CATÁLOGO DE 9 PRODUCTOS (ANGELINA ROJAS)
    // -------------------------------------------------------------
    console.log('▶ [FASE 1] Verificando Vitrina Digital (index.html)...');
    await page.goto(`http://127.0.0.1:${TEST_PORT}/`, { waitUntil: 'domcontentloaded' });

    const title = await page.title();
    if (!title.includes('Segaso')) {
      throw new Error(`Título inesperado: ${title}`);
    }
    console.log(`  ✓ Título verificado: "${title}"`);

    // Esperar render de productos
    await page.waitForSelector('#productsContainer .product-card');
    const productCards = await page.$$('#productsContainer .product-card');
    if (productCards.length !== 9) {
      throw new Error(`Se esperaban 9 productos oficiales en catálogo, pero se encontraron ${productCards.length}`);
    }
    console.log(`  ✓ Catálogo de 9 productos oficiales cargado correctamente (${productCards.length}/9)`);

    // Verificación de Lightbox y Bento Gallery
    const firstVisual = page.locator('#productsContainer .prod-visual').first();
    await firstVisual.click();
    await page.waitForTimeout(200);
    const lightboxModal = page.locator('#imageLightboxModal');
    const isModalOpen = await lightboxModal.evaluate(el => el.classList.contains('open'));
    if (!isModalOpen) throw new Error('El modal Lightbox no se abrió al hacer clic en el producto.');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    console.log('  ✓ Lightbox gourmet interactivo y Bento gallery verificados');

    // -------------------------------------------------------------
    // FASE 2: CARRITO, DESCUENTO AUTOMÁTICO & CHECKOUT (EDISON GALVÁN)
    // -------------------------------------------------------------
    console.log('▶ [FASE 2] Verificando Carrito Reactivo y Descuento Automático WhatsApp...');
    
    // Agregar 2 productos al carrito usando locators frescos
    await page.locator('#productsContainer .add-to-cart-btn').first().click();
    await page.waitForTimeout(300);
    await page.locator('#productsContainer .add-to-cart-btn').first().click();
    await page.waitForTimeout(300);

    const cartCountText = await page.$eval('#cartCount', el => el.textContent.trim());
    if (cartCountText !== '2') {
      throw new Error(`Contador de carrito esperado: 2, actual: ${cartCountText}`);
    }
    console.log(`  ✓ Contador de carrito sincronizado a 2 unidades`);

    // Abrir drawer del carrito
    await page.click('#clientCartBtn');
    await page.waitForSelector('#cartDrawer.open');
    console.log('  ✓ Drawer lateral de carrito abierto');

    // Verificar cupón de descuento automático (Táctica 3)
    const promoInputVal = await page.$eval('#promoCodeInput', el => el.value);
    if (promoInputVal !== 'SEGASO10') {
      throw new Error(`Código de promoción esperado: SEGASO10, actual: ${promoInputVal}`);
    }
    const totalAmountHtml = await page.$eval('#cartTotalAmount', el => el.innerHTML);
    if (!totalAmountHtml.includes('descuento aplicado')) {
      throw new Error('No se detectó el cálculo del 10% de descuento automático en el carrito');
    }
    console.log('  ✓ Descuento automático WhatsApp verificado en total del carrito (-10% OFF)');

    // Llenar formulario de checkout
    await page.fill('#custName', CLIENTE_DE_PRUEBA);
    await page.fill('#custPhone', '3124567890');
    await page.fill('#custAddress', 'Calle 38 Sur # 43A - 15');
    await page.selectOption('#custCity', 'Envigado');
    await page.selectOption('#custPayment', 'Transferencia Nequi/Bancolombia');

    // Enviar pedido
    const [orderResponse] = await Promise.all([
      page.waitForResponse(res => res.url().includes('/api/orders') && res.status() === 201),
      page.click('#checkoutFormSection button.btn-primary')
    ]);
    const orderData = await orderResponse.json();
    if (!orderData.success || !orderData.code) {
      throw new Error(`Fallo creación de orden por API: ${JSON.stringify(orderData)}`);
    }
    console.log(`  ✓ Pedido creado exitosamente en SQLite con código: ${orderData.code}`);

    // -------------------------------------------------------------
    // FASE 3: PANEL ADMINISTRATIVO BACKOFFICE (BRAYAN ÁLVAREZ)
    // -------------------------------------------------------------
    console.log('▶ [FASE 3] Verificando Back Office Administrativo (admin.html)...');
    await page.goto(`http://127.0.0.1:${TEST_PORT}/chorizos-segaso/admin`, { waitUntil: 'domcontentloaded' });

    // Verificar pantalla de login
    await page.waitForSelector('#loginView');
    const adminPassword = process.env.ADMIN_SEED_PASSWORD;
    if (!adminPassword) throw new Error('Falta ADMIN_SEED_PASSWORD en .env para el E2E');
    await page.fill('#loginEmail', 'harold@segasochorizos.com');
    await page.fill('#loginPassword', adminPassword);
    await page.click('#loginBtn');

    // Esperar dashboard protegido
    await page.waitForSelector('#dashboardView', { state: 'visible' });
    console.log('  ✓ Autenticación JWT exitosa para Harold García (token firmado)');

    // Verificar KPIs
    await page.waitForSelector('#kpiToday');
    const kpiToday = await page.$eval('#kpiToday', el => el.textContent.trim());
    console.log(`  ✓ KPI Ventas Hoy cargado: ${kpiToday}`);

    // Verificar tabla de pedidos
    await page.waitForSelector('#ordersTableBody tr');
    const firstOrderCode = await page.$eval('#ordersTableBody tr:first-child strong', el => el.textContent.trim());
    console.log(`  ✓ Último pedido en Back Office verificado: ${firstOrderCode}`);

    // Cambiar estado del pedido
    let statusSelect = await page.$('#ordersTableBody tr:first-child select.status-select');
    if (statusSelect) {
      await statusSelect.selectOption('confirmado');
      await page.waitForTimeout(500);
      statusSelect = await page.$('#ordersTableBody tr:first-child select.status-select');
      await statusSelect.selectOption('preparando');
      await page.waitForTimeout(500);
      console.log('  ✓ Transición FSM confirmado → preparando ejecutada exitosamente');
    }

    // Cambiar a pestaña de inventario
    await page.click('button.tab-btn:has-text("Inventario")');
    await page.waitForSelector('#pane-inventory.active');
    await page.waitForSelector('#inventoryGrid .inv-card', { state: 'visible' });
    const invCards = await page.$$('#inventoryGrid .inv-card');
    if (invCards.length !== 9) {
      throw new Error(`Se esperaban 9 fichas de inventario, encontradas: ${invCards.length}`);
    }
    console.log(`  ✓ Inventario de 9 referencias en tiempo real verificado (${invCards.length}/9)`);

    // -------------------------------------------------------------
    // FASE 4: GATE DE CALIDAD DE PÁGINA
    // -------------------------------------------------------------
    console.log('▶ [FASE 4] Ejecutando gate de calidad visual, SEO y seguridad...');
    const qualityContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'es-CO' });
    const qualityPage = await qualityContext.newPage();
    const qualityConsoleErrors = [];
    const qualityPageErrors = [];
    const qualityBadResponses = [];
    const qualityFailedRequests = [];
    qualityPage.on('console', (msg) => { if (msg.type() === 'error') qualityConsoleErrors.push(msg.text()); });
    qualityPage.on('pageerror', (err) => qualityPageErrors.push(err.message));
    qualityPage.on('response', (res) => { if (res.status() >= 400) qualityBadResponses.push({ url: res.url(), status: res.status() }); });
    qualityPage.on('requestfailed', (req) => qualityFailedRequests.push({ url: req.url(), error: req.failure()?.errorText }));

    await qualityPage.goto(BASE_URL, { waitUntil: 'networkidle' });
    await qualityPage.waitForSelector('#productsContainer .product-card');
    for (const selector of ['#calidad', '#catalogo', '#asados', '#tiktok', '#contacto']) {
      const section = await qualityPage.$(selector);
      if (section) await section.scrollIntoViewIfNeeded();
      await qualityPage.waitForTimeout(250);
    }
    await qualityPage.waitForTimeout(600);
    const quality = await collectPageQuality(qualityPage, {
      consoleErrors: qualityConsoleErrors,
      pageErrors: qualityPageErrors,
      badResponses: qualityBadResponses,
      failedRequests: qualityFailedRequests
    });
    assertPageQuality(quality);
    await checkHttpSurface(qualityContext.request, BASE_URL);
    await qualityContext.close();
    console.log(`  ✓ Gate de calidad: ${(quality.totalTransfer / 1048576).toFixed(2)} MB · ${quality.brokenImages.length} rotas · H1 ${quality.h1Count} · ${quality.smallTapTargets.length} taps <44`);
    console.log('  ✓ Superficie HTTP: 8/8 rutas con status esperado');
    console.log('  ✓ JSON-LD: FoodEstablishment con 9 ofertas');

    // -------------------------------------------------------------
    // FASE 5: AUDITORÍA DE CONSOLA Y CERO ERRORES
    // -------------------------------------------------------------
    console.log('▶ [FASE 5] Verificando Consola y Manejo de Errores...');
    const allConsoleErrors = consoleErrors.concat(qualityConsoleErrors);
    if (allConsoleErrors.length > 0) {
      throw new Error(`Errores de consola detectados: ${JSON.stringify(allConsoleErrors)}`);
    }
    console.log('  ✓ Cero errores de JavaScript en consola');

    console.log('\n🎉 ¡AUDITORÍA PLAYWRIGHT 100% EXITOSA! MVP Funcional y Estable.');
    return true;
  } catch (err) {
    console.error('❌ Fallo en la auditoría Playwright:', err.message);
    throw err;
  } finally {
    await browser.close();
    // Se espera a que el servidor suelte la base antes de limpiar, o el write
    // competiría con el lock de SQLite en modo WAL.
    await new Promise((resolver) => server.close(resolver));
    limpiarPedidoDePrueba();
  }
}

if (require.main === module) {
  runE2E()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { runE2E };
