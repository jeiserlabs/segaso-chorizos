/**
 * Segaso Chorizos S.A.S. — Aislamiento de datos de demostración frente a ventas reales.
 *
 * El seed siembra tres pedidos con nombres, celulares y direcciones inventados, uno de
 * ellos 'entregado' por 71.4k COP. Si el panel los agrega junto a los pedidos reales,
 * la pantalla de KPIs muestra plata que nunca entró — y el guion de sustentación
 * prohíbe expresamente inventar ventas. Estas pruebas vigilan esa frontera.
 *
 * Es .js (CommonJS) a propósito: db.js y auth.js son módulos CJS y `import.meta`
 * no compila bajo el tsconfig del repo. Mismo patrón que e2e_segaso_playwright.js.
 */
'use strict';

const { test, describe, after } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const Database = require('better-sqlite3');

const DB_MOD = require.resolve('../db.js');
const AUTH_MOD = require.resolve('../auth.js');
const TMP_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'segaso-demo-isolation-'));

/** Carga db.js contra una base desechable y limpia el require.cache para que el
 *  módulo vuelva a ejecutar migraciones y seeds sobre esa copia. */
function cargarDb(dbPath) {
  process.env.SEGASO_DB_PATH = dbPath;
  // Generados, no escritos: un literal con forma de contraseña en un test se lee como
  // credencial real en cualquier barrido de secretos (Regla 49.6).
  process.env.JWT_SECRET = crypto.randomBytes(32).toString('hex');
  process.env.ADMIN_SEED_PASSWORD = crypto.randomBytes(12).toString('hex');
  delete require.cache[DB_MOD];
  delete require.cache[AUTH_MOD];
  return require(DB_MOD);
}

function borrarBase(dbPath) {
  for (const sufijo of ['', '-wal', '-shm']) {
    fs.rmSync(`${dbPath}${sufijo}`, { force: true });
  }
}

after(() => {
  fs.rmSync(TMP_DIR, { recursive: true, force: true });
});

describe('Seed de demostración: marcado y exclusión de KPIs', () => {
  test('los tres pedidos sembrados nacen marcados como demo', () => {
    const dbPath = path.join(TMP_DIR, 'seed-marcado.db');
    borrarBase(dbPath);
    const mod = cargarDb(dbPath);
    const filas = mod.db.prepare('SELECT code, es_demo FROM orders ORDER BY code').all();
    assert.equal(filas.length, 3, 'el seed inserta exactamente tres pedidos');
    for (const fila of filas) {
      assert.equal(Number(fila.es_demo), 1, `${fila.code} debe estar marcado como demostración`);
    }
    mod.db.close();
  });

  test('una base recién sembrada reporta cero ventas reales y tres de demo', () => {
    const dbPath = path.join(TMP_DIR, 'kpis-cero.db');
    borrarBase(dbPath);
    const mod = cargarDb(dbPath);
    const kpis = mod.getKPIs();
    assert.equal(kpis.salesDelivered, 0, 'SEG-1003 entregado no puede contar como venta');
    assert.equal(kpis.salesCount, 0);
    assert.equal(kpis.avgTicket, 0);
    assert.equal(kpis.activeOrders, 0, 'los pedidos demo no aparecen como trabajo pendiente');
    assert.equal(kpis.uniqueCustomers, 0, 'los tres celulares inventados no son clientes');
    assert.equal(kpis.topProduct, null, 'el producto líder no puede salir del seed');
    assert.equal(kpis.demoOrders, 3, 'la exclusión es visible, no silenciosa');
    mod.db.close();
  });

  test('un pedido real sí suma, sin contaminarse con la demo', () => {
    const dbPath = path.join(TMP_DIR, 'real-suma.db');
    borrarBase(dbPath);
    const mod = cargarDb(dbPath);
    mod.createOrder({
      code: 'SEG-999001',
      customer_name: 'Cliente Real',
      customer_phone: '3100000111',
      address: 'Calle Real # 1-1',
      neighborhood: 'Envigado',
      items_json: JSON.stringify([{ id: 'morcilla', name: 'Morcilla Paisa Artesanal (x5)', qty: 2, price_cop: 15000 }]),
      subtotal_cop: 30000,
      discount_cop: 0,
      total_cop: 30000,
      payment_method: 'Contra Entrega (Efectivo)',
    });
    mod.db.prepare("UPDATE orders SET status = 'entregado' WHERE code = 'SEG-999001'").run();

    const kpis = mod.getKPIs();
    assert.equal(kpis.salesDelivered, 30000, 'solo el pedido real cuenta en la facturación');
    assert.equal(kpis.salesCount, 1);
    assert.equal(kpis.uniqueCustomers, 1);
    assert.equal(kpis.demoOrders, 3, 'la demo sigue excluida y visible');
    assert.equal(kpis.topProduct.name, 'Morcilla Paisa Artesanal (x5)');
    mod.db.close();
  });
});

describe('Base vieja sin la columna es_demo: el backfill cierra el hueco', () => {
  test('los seeds anteriores al cambio quedan marcados al abrir el panel', () => {
    const dbPath = path.join(TMP_DIR, 'base-vieja.db');
    borrarBase(dbPath);

    // Se reconstruye la base anterior al cambio: tabla `orders` sin la columna
    // `es_demo` y ya poblada con el seed viejo. Ese es exactamente el estado de
    // `segaso.db` en una máquina que corrió la app antes de esta corrección.
    const vieja = new Database(dbPath);
    vieja.exec(`
      CREATE TABLE orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        address TEXT NOT NULL,
        neighborhood TEXT NOT NULL,
        items_json TEXT NOT NULL,
        total_cop INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'pendiente',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
      INSERT INTO orders (code, customer_name, customer_phone, address, neighborhood, items_json, total_cop, status)
      VALUES
        ('SEG-1001', 'Carlos Mario Restrepo', '3124567890', 'Cra 43A # 34-12', 'Envigado (Jardines)', '[]', 39800, 'pendiente'),
        ('SEG-1002', 'Mateo Arango', '3009876543', 'Calle 50 # 42-18', 'Sabaneta (Parque)', '[]', 39100, 'preparando'),
        ('SEG-1003', 'Valeria Gómez', '3157891234', 'Transversal 32 Sur # 32D-15', 'Envigado (Primavera)', '[]', 71400, 'entregado');
    `);
    vieja.close();

    const mod = cargarDb(dbPath);
    const kpis = mod.getKPIs();
    assert.equal(kpis.salesDelivered, 0, 'el backfill evita que los 71.4k del seed vuelvan a aparecer');
    assert.equal(kpis.demoOrders, 3, 'las tres filas anteriores quedan marcadas como demo');

    const reabierta = mod.db.prepare('SELECT code, es_demo FROM orders ORDER BY code').all();
    assert.deepEqual(reabierta.map((f) => Number(f.es_demo)), [1, 1, 1]);
    mod.db.close();
  });
});
