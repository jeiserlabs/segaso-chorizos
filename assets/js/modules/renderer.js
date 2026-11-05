// assets/js/modules/renderer.js — Renderizado del Grid de Productos y Spotlight (SRP < 80L)
import { PRODUCTS, PRODUCT_PHOTOS, getCardActionHtml } from './catalog.js';
import { state } from './state.js';

export function renderProducts(filterCategory) {
  const container = document.getElementById('productsContainer');
  if (!container) return;
  container.innerHTML = '';

  const filtered = (filterCategory === 'all')
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === filterCategory);

  filtered.forEach(p => {
    const stock = state.inventory[p.id] !== undefined ? state.inventory[p.id] : 0;
    const isOutOfStock = stock <= 0;
    const currentQty = state.cart[p.id] || 0;

    const card = document.createElement('div');
    card.className = 'product-card ' + (isOutOfStock ? 'out-of-stock' : '');
    card.innerHTML = `
      <div class="prod-visual" role="button" tabindex="0" aria-label="Ver detalle de ${p.name}" onclick="openProductDetail('${p.id}')" title="Clic para ver fotografía en alta definición y detalles">
        <img src="img/products/${p.id}-480.webp" srcset="img/products/${p.id}-480.webp 480w, ${PRODUCT_PHOTOS[p.id]} 900w" sizes="(max-width: 700px) 90vw, 310px" class="prod-real-img" alt="${p.name} — presentación real Segaso" width="480" height="480" loading="lazy" decoding="async" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
        <div class="prod-placeholder-icon" style="display: none;">${p.icon}</div>
        <div class="prod-badge-pos">
          <span class="badge ${p.id === 'caserito' ? 'badge-gold' : 'badge-primary'}">${p.tag}</span>
        </div>
        <div class="prod-zoom-hint">
          <span>🔍 Ver detalle</span>
        </div>
      </div>
      <div class="prod-body">
        <h3 class="prod-name">${p.name}</h3>
        <div class="prod-pack">Paquete x 5 unidades (450 g)</div>
        <p class="prod-desc">${p.desc}</p>
        <div style="font-size: 11.5px; margin-bottom: 6px;">
          ${isOutOfStock 
            ? '<span style="color: var(--danger); font-weight: 700;">🔴 Agotado momentáneamente</span>' 
            : '<span style="color: var(--success); font-weight: 600;">🟢 Disponible · ' + stock + ' paq</span>'}
        </div>
      </div>
      <div class="prod-footer">
        <div class="prod-price">
          ${p.price.toFixed(1)}k <small>COP</small>
        </div>
        ${getCardActionHtml(p, isOutOfStock, currentQty)}
      </div>
    `;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
      card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
    });
    container.appendChild(card);
  });
}

export function filterCatalog(category, btn) {
  state.currentCategoryFilter = category;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderProducts(category);
}
