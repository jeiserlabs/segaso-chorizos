// db.js — Fachada de Base de Datos SQLite para Segaso Chorizos (SRP < 45L)
const path = require('node:path');

// Permite que tests con bases desechables (SEGASO_DB_PATH) refresquen la conexión
const srcDbDir = path.join(__dirname, 'src', 'db');
for (const key of Object.keys(require.cache)) {
  if (key.startsWith(srcDbDir)) {
    delete require.cache[key];
  }
}

const { db } = require('./src/db/connection');
const ordersRepo = require('./src/db/orders_repo');
const inventoryRepo = require('./src/db/inventory_repo');
const usersRepo = require('./src/db/users_repo');

module.exports = {
  db,
  ...ordersRepo,
  ...inventoryRepo,
  ...usersRepo
};
