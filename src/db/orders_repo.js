// src/db/orders_repo.js — Repositorio de Pedidos, Transacciones Atómicas y KPIs (SRP < 200L)
const { db } = require('./connection');

const stmtInsertOrder = db.prepare(`
  INSERT INTO orders
    (code, customer_name, customer_phone, address, neighborhood,
     items_json, subtotal_cop, discount_cop, total_cop, payment_method, status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendiente')
`);

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

function generarCodigoPedido() {
  for (let intento = 0; intento < 12; intento++) {
    const base = Date.now().toString().slice(-6);
    const candidato = intento === 0 ? `SEG-${base}` : `SEG-${base}-${intento}`;
    if (!stmtOrderCodeExists.get(candidato)) return candidato;
  }
  return `SEG-${Date.now().toString().slice(-9)}`;
}

function getOrders() {
  return db.prepare('SELECT * FROM orders ORDER BY id DESC').all();
}

function createOrder(order) {
  return stmtInsertOrder.run(
    order.code, order.customer_name, order.customer_phone,
    order.address, order.neighborhood,
    order.items_json, order.subtotal_cop, order.discount_cop, order.total_cop,
    order.payment_method || 'no especificado'
  );
}

function updateOrderStatus(id, status) {
  return db.prepare(
    "UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).run(status, id);
}

function getKPIs() {
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

  const clientesUnicos = db.prepare(
    'SELECT COUNT(DISTINCT customer_phone) as count FROM orders WHERE es_demo = 0'
  ).get().count;

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
    salesDelivered: allTime.total,
    salesCount:     allTime.count,
    avgTicket:      allTime.count > 0 ? Math.round(allTime.total / allTime.count) : 0,
    todaySales:     today.total,
    todayCount:     today.count,
    monthSales:     month.total,
    monthCount:     month.count,
    activeOrders:   active.count,
    lowStockAlerts: lowStock.count,
    canceledOrders: canceled.count,
    demoOrders:     demo.count,
    uniqueCustomers: clientesUnicos,
    topProduct: topProducto ? { name: topProducto, units: topUnidades } : null,
  };
}

module.exports = {
  StockInsuficiente,
  crearPedidoAtomico,
  generarCodigoPedido,
  getOrders,
  createOrder,
  updateOrderStatus,
  getKPIs
};
