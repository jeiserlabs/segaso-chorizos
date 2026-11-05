// assets/js/modules/checkout.js — Envío de Órdenes a SQLite y WhatsApp (SRP < 140L)
import { PRODUCTS } from './catalog.js';
import { state, saveInventory, saveOrders } from './state.js';
import { updateCartBadge, closeCart } from './cart.js';
import { showToast } from './bot_ui.js';

export async function submitCustomerOrder(onOrderCompleted) {
  const itemsKeys = Object.keys(state.cart);
  if (itemsKeys.length === 0) {
    showToast('El pedido está vacío');
    return;
  }

  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const address = document.getElementById('custAddress').value.trim();
  const city = document.getElementById('custCity').value;
  const payment = document.getElementById('custPayment').value;

  if (!name || !phone || !address) {
    alert('Por favor completa tu nombre, teléfono y dirección de entrega.');
    return;
  }

  if (!/^\d{10}$/.test(phone)) {
    alert('El teléfono debe tener 10 dígitos (ejemplo: 3001234567).');
    return;
  }

  for (const [id, qty] of Object.entries(state.cart)) {
    if ((state.inventory[id] || 0) < qty) {
      alert('Lo sentimos, no hay suficiente stock de ' + PRODUCTS.find(p => p.id === id).name);
      return;
    }
  }

  let orderItems = [];
  let total = 0;
  for (const [id, qty] of Object.entries(state.cart)) {
    state.inventory[id] -= qty;
    const prod = PRODUCTS.find(p => p.id === id);
    const sub = prod.price * qty;
    total += sub;
    orderItems.push({ id, qty, price: prod.price });
  }
  saveInventory();

  let discount = total * (state.appliedDiscountPct / 100);
  let finalTotal = total - discount;

  const now = new Date();
  let orderId = 'SEG-' + (now.getFullYear() % 100) + Math.floor(1000 + Math.random() * 9000);

  let response = null;
  try {
    response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: name, customer_phone: phone, address: address,
        neighborhood: city, payment_method: payment, items: orderItems
      })
    });
  } catch (_) {
    console.log('Modo offline: orden guardada en almacenamiento local');
  }

  if (response && !response.ok) {
    let mensaje = 'No pudimos registrar el pedido. Intenta de nuevo.';
    try {
      const data = await response.json();
      if (data.error) mensaje = data.error;
    } catch (_) {}
    for (const it of orderItems) state.inventory[it.id] = (state.inventory[it.id] || 0) + it.qty;
    saveInventory();
    if (typeof onOrderCompleted === 'function') onOrderCompleted();
    alert(mensaje);
    return;
  }

  if (response) {
    try {
      const data = await response.json();
      if (data.success && data.code) orderId = data.code;
      if (data.success && Number.isFinite(data.total_cop)) {
        total = data.subtotal_cop / 1000;
        discount = data.discount_cop / 1000;
        finalTotal = data.total_cop / 1000;
        state.appliedDiscountPct = total > 0 ? Math.round((discount / total) * 100) : 0;
      }
    } catch (_) {}
  }

  const newOrder = {
    id: orderId,
    date: now.toLocaleDateString('es-CO') + ' ' + now.getHours() + ':' + String(now.getMinutes()).padStart(2,'0'),
    customer: name, phone: phone, address: address, city: city, payment: payment,
    items: orderItems, total: parseFloat(finalTotal.toFixed(1)), discount: parseFloat(discount.toFixed(1)), status: 'Pendiente'
  };

  state.orders.unshift(newOrder);
  saveOrders();

  state.cart = {};
  updateCartBadge();
  closeCart();
  if (typeof onOrderCompleted === 'function') onOrderCompleted();

  let msg = 'Hola Harold, acabo de hacer un pedido en la plataforma Segaso Chorizos:\n\n';
  msg += '📦 *Pedido:* ' + orderId + '\n';
  msg += '👤 *Cliente:* ' + name + '\n';
  msg += '📱 *Teléfono:* ' + phone + '\n';
  msg += '📍 *Dirección:* ' + address + ' (' + city + ')\n';
  msg += '💳 *Pago:* ' + payment + '\n\n';
  msg += '*Detalle de Chorizos:*\n';
  orderItems.forEach(it => {
    const prod = PRODUCTS.find(p => p.id === it.id);
    msg += '• ' + it.qty + 'x ' + prod.name + ' = ' + (it.price * it.qty).toFixed(1) + 'k COP\n';
  });

  if (state.appliedDiscountPct > 0) {
    msg += '\n*Subtotal:* ' + total.toFixed(1) + 'k COP\n';
    msg += '🏷️ *Descuento Especial (' + state.appliedDiscountPct + '% OFF):* -' + discount.toFixed(1) + 'k COP (Promoción Web/WhatsApp)\n';
    msg += '*TOTAL A PAGAR CON DESCUENTO:* ' + finalTotal.toFixed(1) + 'k COP\n\n';
  } else {
    msg += '\n*TOTAL A PAGAR:* ' + total.toFixed(1) + 'k COP\n\n';
  }
  msg += 'Por favor me confirmas el despacho. ¡Muchas gracias!';

  const waUrl = 'https://wa.me/573002367180?text=' + encodeURIComponent(msg);
  showToast('¡Pedido ' + orderId + ' creado con éxito!');

  setTimeout(() => {
    if (confirm('¡Pedido ' + orderId + ' registrado!\n\nTotal: ' + finalTotal.toFixed(1) + 'k COP\n\n¿Deseas abrir WhatsApp para enviar la confirmación inmediata a Harold?')) {
      window.open(waUrl, '_blank');
    }
  }, 300);
}
