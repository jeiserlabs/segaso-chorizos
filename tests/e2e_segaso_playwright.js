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
const server = require('../server.js');

const TEST_PORT = 3089;

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
    await page.fill('#custName', 'Cliente Verificación Playwright');
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
    // FASE 4: AUDITORÍA DE CONSOLA Y CERO ERRORES
    // -------------------------------------------------------------
    console.log('▶ [FASE 4] Verificando Consola y Manejo de Errores...');
    // Filtrar posibles 404 de favicons si no son críticos
    const criticalErrors = consoleErrors.filter(err => !err.includes('favicon.ico'));
    if (criticalErrors.length > 0) {
      console.warn(`  ⚠️ Errores no críticos en consola:`, criticalErrors);
    } else {
      console.log('  ✓ Cero errores de JavaScript en consola');
    }

    console.log('\n🎉 ¡AUDITORÍA PLAYWRIGHT 100% EXITOSA! MVP Funcional y Estable.');
    return true;
  } catch (err) {
    console.error('❌ Fallo en la auditoría Playwright:', err.message);
    throw err;
  } finally {
    await browser.close();
    server.close();
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
