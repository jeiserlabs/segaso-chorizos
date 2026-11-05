// src/db/connection.js — Conexión SQLite, Esquema, Migraciones y Seeds (SRP < 160L)
const Database = require('better-sqlite3');
const path = require('node:path');
const { hashPassword } = require('../../auth');

const DB_PATH = process.env.SEGASO_DB_PATH
  ? path.resolve(process.env.SEGASO_DB_PATH)
  : path.join(__dirname, '../../segaso.db');

const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Esquema de tablas
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
    subtotal_cop INTEGER NOT NULL DEFAULT 0,
    discount_cop INTEGER NOT NULL DEFAULT 0,
    total_cop INTEGER NOT NULL,
    payment_method TEXT DEFAULT 'no especificado',
    status TEXT NOT NULL DEFAULT 'pendiente',
    es_demo INTEGER NOT NULL DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT
  );

  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'curso',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// Migraciones seguras e idempotentes
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

// Índices para consultas de KPIs y Panel
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_orders_status  ON orders(status);
  CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);
`);

// Seed Admin: Harold García
const seedPassword = process.env.ADMIN_SEED_PASSWORD;
if (!seedPassword) {
  throw new Error('[db] ADMIN_SEED_PASSWORD no está definido en .env. El seed del admin es obligatorio.');
}
if (db.prepare('SELECT COUNT(*) as n FROM admin_users').get().n === 0) {
  db.prepare(
    "INSERT INTO admin_users (email, password_hash, role) VALUES (?, ?, 'admin')"
  ).run('harold@segasochorizos.com', hashPassword(seedPassword));
}

// Seed Inventario inicial
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

// Seed Pedidos demo
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

db.prepare(
  "UPDATE orders SET es_demo = 1 WHERE code IN ('SEG-1001', 'SEG-1002', 'SEG-1003') AND es_demo = 0"
).run();

module.exports = { db };
