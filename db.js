// db.js — Base de datos SQLite local para Segaso Chorizos (Harold Back Office + Pedidos)
const Database = require('better-sqlite3');
const path = require('node:path');
const { hashPassword } = require('./auth');

// `SEGASO_DB_PATH` permite apuntar el módulo a una base desechable en los tests:
// sin ese override, una prueba de KPIs leería y mutaría `segaso.db`, que es la
// única copia de los pedidos reales de la tienda.
const DB_PATH = process.env.SEGASO_DB_PATH
  ? path.resolve(process.env.SEGASO_DB_PATH)
  : path.join(__dirname, 'segaso.db');
const db = new Database(DB_PATH);

// Configuración WAL para alto rendimiento y lecturas concurrentes
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ------------------------------------------------------------------
// ESQUEMA DE TABLAS
// ------------------------------------------------------------------
db.exec(`
  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS inventory (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 20,
    price_cop INTEGER NOT NULL,
    min_stock INTEGER NOT NULL DEFAULT 5,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    address TEXT NOT NULL,
    neighborhood TEXT NOT NULL,
    items_json TEXT NOT NULL,         -- formato: [{ id, name, qty, price_cop, subtotal_cop }]
    subtotal_cop INTEGER NOT NULL DEFAULT 0,
    discount_cop INTEGER NOT NULL DEFAULT 0,
    total_cop INTEGER NOT NULL,
    payment_method TEXT DEFAULT 'no especificado',
    status TEXT NOT NULL DEFAULT 'pendiente', -- pendiente | confirmado | preparando | camino | entregado | cancelado
    es_demo INTEGER NOT NULL DEFAULT 0,       -- 1 = pedido sembrado para la demo; nunca cuenta como venta real
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT
  );

  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'curso', -- curso | catering
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// ------------------------------------------------------------------
// MIGRACIONES SEGURAS (idempotentes — fallan silenciosamente si
// la columna ya existe, lo cual es correcto en SQLite)
// ------------------------------------------------------------------
const migrations = [
  "ALTER TABLE orders ADD COLUMN payment_method TEXT DEFAULT 'no especificado'",
  "ALTER TABLE orders ADD COLUMN updated_at TEXT",
  "ALTER TABLE orders ADD COLUMN subtotal_cop INTEGER NOT NULL DEFAULT 0",
  "ALTER TABLE orders ADD COLUMN discount_cop INTEGER NOT NULL DEFAULT 0",
  "ALTER TABLE orders ADD COLUMN es_demo INTEGER NOT NULL DEFAULT 0",
];
for (const sql of migrations) {
  try { db.exec(sql); } catch (_) { /* columna ya existe */ }
}

// ------------------------------------------------------------------
// ÍNDICES PARA CONSULTAS DE KPIs Y PANEL
// ------------------------------------------------------------------
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_orders_status  ON orders(status);
  CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);
`);

// ------------------------------------------------------------------
// SEED: Harold García
// SEGURIDAD: La contraseña del seed es temporal y debe cambiarse en
// el primer login desde el panel de administración.
// Usuario: harold@segasochorizos.com | Password inicial: ver .env (ADMIN_SEED_PASSWORD)
// ------------------------------------------------------------------
const seedPassword = process.env.ADMIN_SEED_PASSWORD;
if (!seedPassword) {
  throw new Error('[db] ADMIN_SEED_PASSWORD no está definido en .env. El seed del admin es obligatorio.');
}
if (db.prepare('SELECT COUNT(*) as n FROM admin_users').get().n === 0) {
  db.prepare(
    "INSERT INTO admin_users (email, password_hash, role) VALUES (?, ?, 'admin')"
  ).run('harold@segasochorizos.com', hashPassword(seedPassword));
}

// ------------------------------------------------------------------
// SEED: Inventario inicial
// ------------------------------------------------------------------
if (db.prepare('SELECT COUNT(*) as n FROM inventory').get().n === 0) {
  const ins = db.prepare(
    'INSERT INTO inventory (code, name, stock, price_cop, min_stock) VALUES (?, ?, ?, ?, ?)'
  );
  const productos = [
    ['caserito',    'Chorizo Caserito Paisa (x5)',          35, 19900, 10],
    ['antioqueno',  'Chorizo Antioqueño Tradicional (x5)',  40, 23600, 10],
    ['santarrosano','Chorizo Santarrosano (x5)',             30, 23800,  8],
    ['tocineta',    'Chorizo con Tocineta Ahumada (x5)',    25, 23800,  8],
    ['parrillero',  'Chorizo Parrillero Especial (x5)',     20, 23800,  5],
    ['picante',     'Chorizo Picante Artesanal (x5)',       18, 24200,  5],
    ['argentino',   'Chorizo Argentino con Vino Blanco (x5)',22,24600, 5],
    ['morcilla',    'Morcilla Paisa Artesanal (x5)',        15, 15000,  5],
    ['chimichurri', 'Chimichurri Artesanal de la Casa (250ml)',28,14500,6],
  ];
  for (const p of productos) ins.run(...p);
}

// ------------------------------------------------------------------
// SEED: Pedidos demo (formato normalizado)
// ------------------------------------------------------------------
if (db.prepare('SELECT COUNT(*) as n FROM orders').get().n === 0) {
  const ins = db.prepare(`
    INSERT INTO orders (code, customer_name, customer_phone, address, neighborhood,
                        items_json, total_cop, payment_method, status, es_demo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `);
  ins.run('SEG-1001', 'Carlos Mario Restrepo', '3124567890',
    'Cra 43A # 34-12 Apto 402', 'Envigado (Jardines)',
    JSON.stringify([{ id: 'caserito', name: 'Chorizo Caserito Paisa (x5)', qty: 2, price_cop: 19900 }]),
    39800, 'Transferencia Nequi/Bancolombia', 'pendiente');

  ins.run('SEG-1002', 'Mateo Arango', '3009876543',
    'Calle 50 # 42-18', 'Sabaneta (Parque)',
    JSON.stringify([
      { id: 'argentino',   name: 'Chorizo Argentino con Vino Blanco (x5)', qty: 1, price_cop: 24600 },
      { id: 'chimichurri', name: 'Chimichurri Artesanal de la Casa (250ml)', qty: 1, price_cop: 14500 },
    ]),
    39100, 'Contra Entrega (Efectivo)', 'preparando');

  ins.run('SEG-1003', 'Valeria Gómez', '3157891234',
    'Transversal 32 Sur # 32D-15', 'Envigado (Primavera)',
    JSON.stringify([{ id: 'parrillero', name: 'Chorizo Parrillero Especial (x5)', qty: 3, price_cop: 23800 }]),
    71400, 'Transferencia Nequi/Bancolombia', 'entregado');
}

// Los tres códigos anteriores ya estaban sembrados en bases viejas, cuando el
// esquema no tenía `es_demo`: sin este backfill el panel seguiría mostrando
// 71.4k COP de una venta que nunca ocurrió. Idempotente y limitado a los códigos
// del seed (el generador real emite `SEG-` + 6 dígitos del reloj, nunca 4).
db.prepare(
  "UPDATE orders SET es_demo = 1 WHERE code IN ('SEG-1001', 'SEG-1002', 'SEG-1003') AND es_demo = 0"
).run();

// ------------------------------------------------------------------
// OPERACIONES ATÓMICAS
// ------------------------------------------------------------------
const stmtInsertOrder = db.prepare(`
  INSERT INTO orders
    (code, customer_name, customer_phone, address, neighborhood,
     items_json, subtotal_cop, discount_cop, total_cop, payment_method, status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendiente')
`);

// El `AND stock >= ?` es la parte que antes no existía: con `MAX(0, stock - qty)`
// dos pedidos concurrentes podían llevarse el mismo paquete y el stock quedaba en 0
// sin ningún error (sobreventa silenciosa). Ahora la actualización simply no ocurre
// si no alcanza, y `changes` lo delata.
const stmtConsumeStock = db.prepare(
  'UPDATE inventory SET stock = stock - ?, updated_at = CURRENT_TIMESTAMP WHERE code = ? AND stock >= ?'
);

const stmtOrderCodeExists = db.prepare('SELECT 1 FROM orders WHERE code = ?');

class StockInsuficiente extends Error {
  constructor(code) {
    super(`Stock insuficiente para ${code}`);
    this.name = 'StockInsuficiente';
    this.code = 'STOCK_INSUFICIENTE';
    this.producto = code;
  }
}

/**
 * Inserta el pedido y descuenta el stock en UNA transacción.
 * Fail-closed: si algún paquete no alcanza, se revierte todo y no queda pedido fantasma.
 * `db.transaction` de better-sqlite3 es síncrona y atómica en SQLite.
 */
function crearPedidoAtomico(order, items) {
  const correr = db.transaction(() => {
    for (const item of items) {
      const info = stmtConsumeStock.run(item.qty, item.id, item.qty);
      if (info.changes !== 1) throw new StockInsuficiente(item.id);
    }
    return stmtInsertOrder.run(
      order.code, order.customer_name, order.customer_phone,
      order.address, order.neighborhood,
      order.items_json, order.subtotal_cop, order.discount_cop, order.total_cop,
      order.payment_method || 'no especificado'
    ).lastInsertRowid;
  });
  return correr();
}

/** Código de pedido único: `SEG-<6 dígitos del reloj>` colisiona si llegan dos en el
 *  mismo milisegundo y el INSERT reventaba contra el UNIQUE (500 en vivo). */
function generarCodigoPedido() {
  for (let intento = 0; intento < 12; intento++) {
    const base = Date.now().toString().slice(-6);
    const candidato = intento === 0 ? `SEG-${base}` : `SEG-${base}-${intento}`;
    if (!stmtOrderCodeExists.get(candidato)) return candidato;
  }
  return `SEG-${Date.now().toString().slice(-9)}`;
}

// ------------------------------------------------------------------
// API DE DATOS
// ------------------------------------------------------------------
module.exports = {
  db,
  StockInsuficiente,
  crearPedidoAtomico,
  generarCodigoPedido,

  // Autenticación
  getUserByEmail: (email) =>
    db.prepare('SELECT * FROM admin_users WHERE email = ?').get(email),

  // Cambio de contraseña del panel (el seed de .env ya no es permanente)
  setPasswordHash: (email, hash) =>
    db.prepare(
      'UPDATE admin_users SET password_hash = ? WHERE email = ?'
    ).run(hash, email).changes === 1,

  // Inventario (admin)
  getInventory: () =>
    db.prepare('SELECT * FROM inventory ORDER BY name ASC').all(),

  // Inventario (público — solo code + stock, sin datos sensibles)
  getPublicInventory: () =>
    db.prepare('SELECT code, stock FROM inventory ORDER BY code ASC').all(),

  // Descontar stock al crear un pedido (usa MAX(0, ...) para evitar negativos)
  decrementStock: (code, qty) =>
    db.prepare(
      'UPDATE inventory SET stock = MAX(0, stock - ?), updated_at = CURRENT_TIMESTAMP WHERE code = ?'
    ).run(qty, code),

  // Actualizar stock manualmente (panel de Harold)
  updateStock: (code, stock) =>
    db.prepare(
      'UPDATE inventory SET stock = ?, updated_at = CURRENT_TIMESTAMP WHERE code = ?'
    ).run(stock, code),

  // Pedidos
  getOrders: () =>
    db.prepare('SELECT * FROM orders ORDER BY id DESC').all(),

  createOrder: (order) =>
    stmtInsertOrder.run(
      order.code, order.customer_name, order.customer_phone,
      order.address, order.neighborhood,
      order.items_json, order.subtotal_cop, order.discount_cop, order.total_cop,
      order.payment_method || 'no especificado'
    ),

  // Cambiar estado + registrar timestamp de cuándo ocurrió
  updateOrderStatus: (id, status) =>
    db.prepare(
      "UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    ).run(status, id),

  // Leads (academia / catering)
  getLeads: () =>
    db.prepare('SELECT * FROM leads ORDER BY id DESC').all(),

  createLead: (lead) =>
    db.prepare('INSERT INTO leads (name, phone, type) VALUES (?, ?, ?)')
      .run(lead.name, lead.phone, lead.type || 'curso'),

  // KPIs con filtros temporales
  // `es_demo = 0` en cada agregado: el seed de la demo (SEG-1001..1003) tiene nombres,
  // celulares y una venta de 71.4k COP inventados. Mezclarlos con ventas reales haría
  // que el panel muestre plata que no entró, que es justo lo que el guion prohíbe.
  getKPIs: () => {
    const allTime = db.prepare(
      "SELECT COALESCE(SUM(total_cop), 0) as total, COUNT(*) as count FROM orders WHERE status = 'entregado' AND es_demo = 0"
    ).get();

    const today = db.prepare(
      "SELECT COALESCE(SUM(total_cop), 0) as total, COUNT(*) as count FROM orders WHERE status = 'entregado' AND es_demo = 0 AND date(created_at) = date('now', 'localtime')"
    ).get();

    const month = db.prepare(
      "SELECT COALESCE(SUM(total_cop), 0) as total, COUNT(*) as count FROM orders WHERE status = 'entregado' AND es_demo = 0 AND strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now', 'localtime')"
    ).get();

    const active = db.prepare(
      "SELECT COUNT(*) as count FROM orders WHERE status IN ('pendiente', 'preparando', 'camino') AND es_demo = 0"
    ).get();

    const lowStock = db.prepare(
      'SELECT COUNT(*) as count FROM inventory WHERE stock <= min_stock'
    ).get();

    const canceled = db.prepare(
      "SELECT COUNT(*) as count FROM orders WHERE status = 'cancelado' AND es_demo = 0"
    ).get();

    const demo = db.prepare(
      'SELECT COUNT(*) as count FROM orders WHERE es_demo = 1'
    ).get();

    // Los dos KPIs que el guion de sustentación promete y el panel no calculaba.
    const clientesUnicos = db.prepare(
      'SELECT COUNT(DISTINCT customer_phone) as count FROM orders WHERE es_demo = 0'
    ).get().count;

    // "Producto más vendido" vive dentro de items_json (texto), no en una tabla
    // normalizada: se agrega en JS sobre el histórico entregado. Con miles de pedidos
    // esto debería ser una tabla order_items; para el volumen actual es suficiente y
    // no abre una migración antes de la defensa.
    const unidadesPorProducto = new Map();
    for (const fila of db.prepare("SELECT items_json FROM orders WHERE status = 'entregado' AND es_demo = 0").all()) {
      let items = [];
      try { items = JSON.parse(fila.items_json) || []; } catch { continue; }
      for (const item of items) {
        const nombre = item && item.name ? item.name : (item && item.id) || '—';
        const qty = Number.isFinite(item && item.qty) ? item.qty : 0;
        unidadesPorProducto.set(nombre, (unidadesPorProducto.get(nombre) || 0) + qty);
      }
    }
    let topProducto = null, topUnidades = 0;
    for (const [nombre, unidades] of unidadesPorProducto) {
      if (unidades > topUnidades) { topProducto = nombre; topUnidades = unidades; }
    }

    return {
      // Histórico total
      salesDelivered: allTime.total,
      salesCount:     allTime.count,
      avgTicket:      allTime.count > 0 ? Math.round(allTime.total / allTime.count) : 0,
      // Hoy
      todaySales:     today.total,
      todayCount:     today.count,
      // Mes actual
      monthSales:     month.total,
      monthCount:     month.count,
      // En curso
      activeOrders:   active.count,
      // Alertas
      lowStockAlerts: lowStock.count,
      canceledOrders: canceled.count,
      // Datos de demostración excluidos de todo lo anterior (visibilidad, no silencio)
      demoOrders:     demo.count,
      // Promesa del guion 07_DEMO_MVP: clientes únicos y producto más vendido
      uniqueCustomers: clientesUnicos,
      topProduct: topProducto ? { name: topProducto, units: topUnidades } : null,
    };
  },
};
