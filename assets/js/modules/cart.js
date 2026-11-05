// assets/js/modules/cart.js — Operaciones de Carrito y Cupones WhatsApp (SRP < 140L)
import { PRODUCTS } from './catalog.js';
import { state, saveCart } from './state.js';
import { showToast } from './bot_ui.js';
import { setModalOpen } from './media_modal.js';

export function updateCartItemQty(prodId, delta, onCartChanged) {
  const maxStock = state.inventory[prodId] || 0;
  let current = state.cart[prodId] || 0;
  let next = current + delta;

  if (next > maxStock) {
    showToast('Stock máximo alcanzado (' + maxStock + ' paq)');
    return;
  }

  const prod = PRODUCTS.find(p => p.id === prodId);
  if (next <= 0) {
    delete state.cart[prodId];
    showToast('Eliminado del pedido: ' + (prod ? prod.name : prodId));
  } else {
    state.cart[prodId] = next;
    if (delta > 0 && current === 0) {
      showToast('Agregado: ' + (prod ? prod.name : prodId) + ' (1 paq)');
    }
  }

  updateCartBadge();
  if (typeof onCartChanged === 'function') onCartChanged();
  if (document.getElementById('cartDrawer') && document.getElementById('cartDrawer').classList.contains('open')) {
    openCart();
  }
}

export function updateCartBadge() {
  const totalUnits = Object.values(state.cart).reduce((a, b) => a + b, 0);
  const el = document.getElementById('cartCount');
  if (el) {
    el.textContent = totalUnits;
    el.classList.remove('badge-pop');
    void el.offsetWidth;
    el.classList.add('badge-pop');
  }
  saveCart();
}

export function openCart() {
  const drawer = document.getElementById('cartDrawer');
  const body = document.getElementById('cartDrawerBody');
  if (!drawer || !body) return;
  body.innerHTML = '';

  const items = Object.entries(state.cart);
  if (items.length === 0) {
    body.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
        <div style="font-size: 40px; margin-bottom: 12px;">🛒</div>
        <p style="font-weight: 600;">Tu pedido está vacío</p>
        <p style="font-size: 12px; margin-top: 6px;">Selecciona chorizos del catálogo para iniciar tu orden.</p>
      </div>
    `;
    document.getElementById('cartTotalAmount').textContent = '0.0k COP';
    setModalOpen(drawer, true);
    return;
  }

  let total = 0;
  items.forEach(([id, qty]) => {
    const prod = PRODUCTS.find(p => p.id === id);
    const subtotal = prod.price * qty;
    total += subtotal;

    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div style="flex: 1;">
        <div class="cart-item-title">${prod.name}</div>
        <div class="cart-item-price">${prod.price.toFixed(1)}k COP c/u</div>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <div class="qty-selector" style="gap: 4px;">
          <button class="qty-btn" onclick="updateCartItemQty('${id}', -1)" title="Restar 1" aria-label="Restar una unidad de ${prod.name}">-</button>
          <span class="qty-val" style="min-width: 20px; text-align: center; font-weight: 700;">${qty}</span>
          <button class="qty-btn" onclick="updateCartItemQty('${id}', 1)" title="Sumar 1" aria-label="Sumar una unidad de ${prod.name}">+</button>
        </div>
        <span style="font-weight: 800; color: var(--cream); min-width: 52px; text-align: right;">${subtotal.toFixed(1)}k</span>
        <button class="qty-btn" onclick="removeCartItem('${id}')" style="color: var(--danger); margin-left: 2px;" title="Eliminar del pedido" aria-label="Eliminar ${prod.name} del pedido">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5"/></svg>
        </button>
      </div>
    `;
    body.appendChild(row);
  });

  const discount = total * (state.appliedDiscountPct / 100);
  const finalTotal = total - discount;
  if (state.appliedDiscountPct > 0) {
    document.getElementById('cartTotalAmount').innerHTML = `
      <span style="text-decoration: line-through; color: var(--text-muted); font-size: 13px; margin-right: 6px;">${total.toFixed(1)}k</span>
      <span style="color: var(--gold);">${finalTotal.toFixed(1)}k COP</span>
      <span style="color: var(--success); font-size: 11px; display: block; font-weight: 600;">(-${discount.toFixed(1)}k COP de descuento aplicado)</span>
    `;
  } else {
    document.getElementById('cartTotalAmount').textContent = total.toFixed(1) + 'k COP';
  }
  drawer.classList.add('open');
}

export function closeCart() {
  setModalOpen(document.getElementById('cartDrawer'), false);
}

export function removeCartItem(prodId, onCartChanged) {
  delete state.cart[prodId];
  updateCartBadge();
  openCart();
  if (typeof onCartChanged === 'function') onCartChanged();
}

export function applyPromoCode() {
  const codeInput = document.getElementById('promoCodeInput');
  const code = (codeInput ? codeInput.value : '').trim().toUpperCase();
  const fb = document.getElementById('promoFeedback');
  if (code === 'SEGASO10') {
    state.appliedDiscountPct = 10;
    if (fb) {
      fb.style.color = 'var(--success)';
      fb.textContent = '✓ 10% de descuento automático de bienvenida activo';
    }
    showToast('¡Cupón SEGASO10 aplicado! 10% de descuento');
  } else if (!code) {
    state.appliedDiscountPct = 0;
    if (fb) {
      fb.style.color = 'var(--cream-muted)';
      fb.textContent = 'Sin código promocional aplicado';
    }
    showToast('Descuento removido');
  } else {
    state.appliedDiscountPct = 0;
    if (fb) {
      fb.style.color = 'var(--danger)';
      fb.textContent = '✕ Código no válido. Usa SEGASO10 para 10% OFF';
    }
    showToast('Código no válido');
  }
  openCart();
}
