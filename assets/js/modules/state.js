// assets/js/modules/state.js — Almacén de Estado Reactivo y Persistencia Local (SRP < 100L)
import { PRODUCTS } from './catalog.js';

export const state = {
  currentMode: 'client',
  currentCategoryFilter: 'all',
  cart: {},
  appliedDiscountPct: 10, // Descuento de bienvenida automático del 10%
  inventory: {},
  orders: [],
  waitlistLeads: [],
  lastFocusedElement: null
};

export function saveInventory() {
  try { localStorage.setItem('segaso_inventory', JSON.stringify(state.inventory)); } catch (_) {}
}

export function saveOrders() {
  try { localStorage.setItem('segaso_orders', JSON.stringify(state.orders)); } catch (_) {}
}

export function saveLeads() {
  try { localStorage.setItem('segaso_leads', JSON.stringify(state.waitlistLeads)); } catch (_) {}
}

export function saveCart() {
  try { localStorage.setItem('segaso_cart', JSON.stringify(state.cart)); } catch (_) {}
}

export function loadCart() {
  try {
    const saved = localStorage.getItem('segaso_cart');
    if (saved) {
      const parsed = JSON.parse(saved);
      const validIds = new Set(PRODUCTS.map(p => p.id));
      Object.keys(parsed).forEach(id => {
        if (validIds.has(id) && parsed[id] > 0) state.cart[id] = parsed[id];
      });
    }
  } catch (_) {}
}

export function initData() {
  const savedInv = localStorage.getItem('segaso_inventory');
  if (savedInv) {
    state.inventory = JSON.parse(savedInv);
  } else {
    PRODUCTS.forEach(p => {
      state.inventory[p.id] = (p.id === 'caserito') ? 45 : (p.id === 'morcilla') ? 30 : 25;
    });
    saveInventory();
  }

  const savedOrders = localStorage.getItem('segaso_orders');
  if (savedOrders) {
    state.orders = JSON.parse(savedOrders);
  } else {
    seedInitialDemoOrders();
  }

  const savedLeads = localStorage.getItem('segaso_leads');
  if (savedLeads) {
    state.waitlistLeads = JSON.parse(savedLeads);
  } else {
    state.waitlistLeads = [
      { date: '08/10/2026', name: 'Santiago Montoya', phone: '311 234 5678', interest: 'Taller de Charcutería' },
      { date: '08/10/2026', name: 'Laura Ochoa', phone: '300 876 5432', interest: 'Asado al Barril (15 pers)' }
    ];
    saveLeads();
  }
}

function seedInitialDemoOrders() {
  state.orders = [
    {
      id: 'SEG-2601', date: '08/10/2026 14:20', customer: 'Mateo Gómez', phone: '312 458 9201',
      address: 'Cra 43A # 32 Sur - 15', city: 'Envigado', payment: 'Transferencia Nequi/Bancolombia',
      items: [ { id: 'caserito', qty: 2, price: 19.9 }, { id: 'chimichurri', qty: 1, price: 14.5 } ],
      total: 54.3, status: 'Entregado'
    },
    {
      id: 'SEG-2602', date: '08/10/2026 15:45', customer: 'Valentina Restrepo', phone: '300 789 1122',
      address: 'Calle 50 # 40 - 22, Primavera', city: 'Envigado', payment: 'Contra Entrega (Efectivo)',
      items: [ { id: 'antioqueno', qty: 2, price: 23.6 }, { id: 'morcilla', qty: 2, price: 15.0 } ],
      total: 77.2, status: 'En Camino'
    }
  ];
  saveOrders();
}

export async function syncInventoryFromServer(onUpdateCallback) {
  try {
    const res = await fetch('/api/inventory');
    if (!res.ok) return;
    const data = await res.json();
    if (!data.success || !Array.isArray(data.inventory)) return;

    let updated = false;
    data.inventory.forEach(({ code, stock }) => {
      if (state.inventory[code] !== stock) {
        state.inventory[code] = stock;
        updated = true;
      }
    });

    if (updated) {
      saveInventory();
      if (typeof onUpdateCallback === 'function') onUpdateCallback();
    }
  } catch (_) {}
}
