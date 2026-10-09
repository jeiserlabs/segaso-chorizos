// db.js — Base de datos SQLite local para Segaso Chorizos (Harold Back Office + Pedidos)
const Database = require('better-sqlite3');
const path = require('node:path');
const { hashPassword } = require('./auth');

const DB_PATH = path.join(__dirname, 'segaso.db');
const db = new Database(DB_PATH);

// Configuración WAL para alto rendimiento y lecturas concurrentes
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Inicializar esquema de tablas
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
    items_json TEXT NOT NULL,
    total_cop INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendiente', -- pendiente, preparando, camino, entregado, cancelado
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'curso', -- curso, catering
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed inicial de Harold García si no existe
const userCount = db.prepare('SELECT COUNT(*) as count FROM admin_users').get().count;
if (userCount === 0) {
  const defaultHash = hashPassword('segaso2026');
  db.prepare(`
    INSERT INTO admin_users (email, password_hash, role)
    VALUES (?, ?, 'admin')
  `).run('harold@segasochorizos.com', defaultHash);
}

// Seed inicial de inventario si está vacío
const invCount = db.prepare('SELECT COUNT(*) as count FROM inventory').get().count;
if (invCount === 0) {
  const insertInv = db.prepare(`
    INSERT INTO inventory (code, name, stock, price_cop, min_stock)
    VALUES (?, ?, ?, ?, ?)
  `);
  const products = [
    ['caserito', 'Chorizo Caserito Paisa (x5)', 35, 19900, 10],
    ['antioqueno', 'Chorizo Antioqueño Tradicional (x5)', 40, 23600, 10],
    ['santarrosano', 'Chorizo Santarrosano (x5)', 30, 23800, 8],
    ['tocineta', 'Chorizo con Tocineta Ahumada (x5)', 25, 23800, 8],
    ['parrillero', 'Chorizo Parrillero Especial (x5)', 20, 23800, 5],
    ['picante', 'Chorizo Picante Artesanal (x5)', 18, 24200, 5],
    ['argentino', 'Chorizo Argentino con Vino Blanco (x5)', 22, 24600, 5],
    ['morcilla', 'Morcilla Paisa Artesanal (x5)', 15, 15000, 5],
    ['chimichurri', 'Chimichurri Artesanal de la Casa (250ml)', 28, 14500, 6]
  ];
  for (const p of products) {
    insertInv.run(...p);
  }
}

// Seed inicial de pedidos demo si está vacío
const orderCount = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
if (orderCount === 0) {
  const insertOrder = db.prepare(`
    INSERT INTO orders (code, customer_name, customer_phone, address, neighborhood, items_json, total_cop, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertOrder.run('SEG-1001', 'Carlos Mario Restrepo', '3124567890', 'Cra 43A # 34-12 Apto 402', 'Envigado (Jardines)', JSON.stringify([{ name: 'Chorizo Caserito Paisa (x5)', qty: 2, price: 19900 }]), 39800, 'pendiente');
  insertOrder.run('SEG-1002', 'Mateo Arango', '3009876543', 'Calle 50 # 42-18', 'Sabaneta (Parque)', JSON.stringify([{ name: 'Chorizo Argentino (x5)', qty: 1, price: 24600 }, { name: 'Chimichurri de la Casa', qty: 1, price: 14500 }]), 39100, 'preparando');
  insertOrder.run('SEG-1003', 'Valeria Gómez', '3157891234', 'Transversal 32 Sur # 32D-15', 'Envigado (Primavera)', JSON.stringify([{ name: 'Chorizo Parrillero (x5)', qty: 3, price: 23800 }]), 71400, 'entregado');
}

module.exports = {
  db,
  getUserByEmail: (email) => db.prepare('SELECT * FROM admin_users WHERE email = ?').get(email),
  getOrders: () => db.prepare('SELECT * FROM orders ORDER BY id DESC').all(),
  updateOrderStatus: (id, status) => db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id),
  createOrder: (order) => {
    return db.prepare(`
      INSERT INTO orders (code, customer_name, customer_phone, address, neighborhood, items_json, total_cop, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pendiente')
    `).run(order.code, order.customer_name, order.customer_phone, order.address, order.neighborhood, order.items_json, order.total_cop);
  },
  getInventory: () => db.prepare('SELECT * FROM inventory ORDER BY name ASC').all(),
  updateStock: (code, stock) => db.prepare('UPDATE inventory SET stock = ?, updated_at = CURRENT_TIMESTAMP WHERE code = ?').run(stock, code),
  getLeads: () => db.prepare('SELECT * FROM leads ORDER BY id DESC').all(),
  createLead: (lead) => db.prepare('INSERT INTO leads (name, phone, type) VALUES (?, ?, ?)').run(lead.name, lead.phone, lead.type || 'curso'),
  getKPIs: () => {
    const todaySales = db.prepare("SELECT COALESCE(SUM(total_cop), 0) as total, COUNT(*) as count FROM orders WHERE status = 'entregado'").get();
    const activeOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status IN ('pendiente', 'preparando', 'camino')").get();
    const lowStock = db.prepare("SELECT COUNT(*) as count FROM inventory WHERE stock <= min_stock").get();
    return {
      salesDelivered: todaySales.total,
      salesCount: todaySales.count,
      activeOrders: activeOrders.count,
      avgTicket: todaySales.count > 0 ? Math.round(todaySales.total / todaySales.count) : 0,
      lowStockAlerts: lowStock.count
    };
  }
};
