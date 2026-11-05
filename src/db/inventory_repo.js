// src/db/inventory_repo.js — Repositorio de Inventario y Stock (SRP < 45L)
const { db } = require('./connection');

function getInventory() {
  return db.prepare('SELECT * FROM inventory ORDER BY name ASC').all();
}

function getPublicInventory() {
  return db.prepare('SELECT code, stock FROM inventory ORDER BY code ASC').all();
}

function decrementStock(code, qty) {
  return db.prepare(
    'UPDATE inventory SET stock = MAX(0, stock - ?), updated_at = CURRENT_TIMESTAMP WHERE code = ?'
  ).run(qty, code);
}

function updateStock(code, stock) {
  return db.prepare(
    'UPDATE inventory SET stock = ?, updated_at = CURRENT_TIMESTAMP WHERE code = ?'
  ).run(stock, code);
}

module.exports = {
  getInventory,
  getPublicInventory,
  decrementStock,
  updateStock
};
