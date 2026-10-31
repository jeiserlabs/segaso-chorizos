const PRODUCTS = [
      { id: 'caserito', name: 'Chorizo Caserito Paisa', price: 19.9, category: 'tradicional', icon: '🥓', tag: '⭐ Más Vendido', desc: 'El sabor tradicional de la casa. Carne seleccionada y sazón paisa suave para el desayuno o la arepa.' },
      { id: 'antioqueno', name: 'Chorizo Antioqueño', price: 23.6, category: 'tradicional', icon: '🇳🇬', tag: 'Tradicional', desc: 'Sabor auténtico antioqueño con picado fino, ahumado natural y el balance perfecto de grasa natural.' },
      { id: 'santarrosano', name: 'Chorizo Santarrosano', price: 23.8, category: 'tradicional', icon: '🇨🇴', tag: 'Tradicional', desc: 'Inspirado en la receta típica de Santa Rosa de Cabal. Trozos jugosos y especias de montaña.' },
      { id: 'tocineta', name: 'Chorizo con Tocineta', price: 23.8, category: 'especial', icon: '🥓', tag: 'Especial', desc: 'Fusión irresistible de cerdo seleccionado con crujiente tocineta ahumada. Explosión de sabor a la parrilla.' },
      { id: 'parrillero', name: 'Chorizo Parrillero al Ajo', price: 23.8, category: 'especial', icon: '🍴', tag: 'Parrillero', desc: 'Toque gourmet de ajo macerado y pimienta suave. Ideal para asados de fin de semana con amigos.' },
      { id: 'picante', name: 'Chorizo Picante Artesanal', price: 24.2, category: 'especial', icon: '🌶️', tag: 'Especial', desc: 'Intensidad media con ají casero y páprika. Pica lo justo sin opacar la calidad de la carne.' },
      { id: 'argentino', name: 'Chorizo Estilo Argentino', price: 24.6, category: 'especial', icon: '🇦🇷', tag: 'Parrillero', desc: 'Picado grueso, vino tinto y nuez moscada. Especial para choripán con abundante chimichurri.' },
      { id: 'morcilla', name: 'Morcilla Paisa Tradicional', price: 15.0, category: 'complemento', icon: '🥩', tag: 'Tradicional', desc: 'Arroz esponjoso, especias de huerta y sangre fresca seleccionada. Crujiente por fuera y suave por dentro.' },
      { id: 'chimichurri', name: 'Chimichurri Especial de la Casa', price: 14.5, category: 'complemento', icon: '🌿', tag: 'Acompañamiento', desc: 'Frasco artesanal con perejil fresco, ajo, aceite de oliva virgen y orégano. El maridaje perfecto.' }
    ];

    const LIGHTBOX_PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221%22 height=%221%22/%3E';

    const PRODUCT_PHOTOS = {
      caserito: 'img/products/caserito.webp',
      antioqueno: 'img/products/antioqueno.webp',
      santarrosano: 'img/products/santarrosano.webp',
      tocineta: 'img/products/tocineta.webp',
      parrillero: 'img/products/parrillero.webp',
      picante: 'img/products/picante.webp',
      argentino: 'img/products/argentino.webp',
      morcilla: 'img/products/morcilla.webp',
      chimichurri: 'img/products/chimichurri.webp'
    };

    let currentMode = 'client';
    let currentCategoryFilter = 'all';
    let cart = {};
    let appliedDiscountPct = 10; // Descuento de bienvenida automático del 10%
    let inventory = {};
    let orders = [];
    let waitlistLeads = [];
    let lastFocusedElement = null;

    window.addEventListener('DOMContentLoaded', () => {
      initData();
      checkAdminRoute();
      renderProducts('all');
    });

    // DETECCIÓN DE RUTA DE ADMINISTRACIÓN OCULTA
    function checkAdminRoute() {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('admin') || hash.includes('admin')) {
        if (sessionStorage.getItem('segaso_admin_auth') === 'true') {
          switchMode('admin');
        } else {
          promptAdminPin();
        }
      }
    }

    function promptAdminPin() {
      window.location.href = '/chorizos-segaso/admin';
    }

    function closeAdminPinModal() {
      if (window.location.hash.includes('admin')) {
        history.replaceState(null, null, ' ');
      }
    }

    function verifyAdminPin() {
      // Redirigir siempre al panel real con JWT en admin.html
      // No se usa PIN client-side: el acceso está protegido por JWT en server.js
      closeAdminPinModal();
      window.location.href = '/chorizos-segaso/admin';
    }

    function exitAdminMode() {
      sessionStorage.removeItem('segaso_admin_auth');
      switchMode('client');
      if (window.location.pathname.includes('admin')) {
        window.location.href = '/';
      } else {
        history.replaceState(null, null, ' ');
      }
    }

    function goHome() {
      switchMode('client');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function initData() {
      const savedInv = localStorage.getItem('segaso_inventory');
      if (savedInv) {
        inventory = JSON.parse(savedInv);
      } else {
        PRODUCTS.forEach(p => {
          inventory[p.id] = (p.id === 'caserito') ? 45 : (p.id === 'morcilla') ? 30 : 25;
        });
        saveInventory();
      }

      const savedOrders = localStorage.getItem('segaso_orders');
      if (savedOrders) {
        orders = JSON.parse(savedOrders);
      } else {
        seedInitialDemoOrders();
      }

      const savedLeads = localStorage.getItem('segaso_leads');
      if (savedLeads) {
        waitlistLeads = JSON.parse(savedLeads);
      } else {
        waitlistLeads = [
          { date: '08/10/2026', name: 'Santiago Montoya', phone: '311 234 5678', interest: 'Taller de Charcutería' },
          { date: '08/10/2026', name: 'Laura Ochoa', phone: '300 876 5432', interest: 'Asado al Barril (15 pers)' }
        ];
        saveLeads();
      }
    }

    function seedInitialDemoOrders() {
      orders = [
        {
          id: 'SEG-2601',
          date: '08/10/2026 14:20',
          customer: 'Mateo Gómez',
          phone: '312 458 9201',
          address: 'Cra 43A # 32 Sur - 15',
          city: 'Envigado',
          payment: 'Transferencia Nequi/Bancolombia',
          items: [ { id: 'caserito', qty: 2, price: 19.9 }, { id: 'chimichurri', qty: 1, price: 14.5 } ],
          total: 54.3,
          status: 'Entregado'
        },
        {
          id: 'SEG-2602',
          date: '08/10/2026 15:45',
          customer: 'Valentina Restrepo',
          phone: '300 789 1122',
          address: 'Calle 50 # 40 - 22, Primavera',
          city: 'Envigado',
          payment: 'Contra Entrega (Efectivo)',
          items: [ { id: 'antioqueno', qty: 2, price: 23.6 }, { id: 'morcilla', qty: 2, price: 15.0 } ],
          total: 77.2,
          status: 'En Camino'
        },
        {
          id: 'SEG-2603',
          date: '08/10/2026 16:30',
          customer: 'Andrés Henao',
          phone: '314 620 4455',
          address: 'Transversal 39 # 72 - 10',
          city: 'Sabaneta',
          payment: 'Transferencia Nequi/Bancolombia',
          items: [ { id: 'argentino', qty: 3, price: 24.6 }, { id: 'tocineta', qty: 2, price: 23.8 } ],
          total: 121.4,
          status: 'En Preparación'
        },
        {
          id: 'SEG-2604',
          date: '08/10/2026 17:05',
          customer: 'Camila Morales',
          phone: '310 998 3344',
          address: 'Circular 4ta # 73 - 48',
          city: 'Medellín',
          payment: 'Contra Entrega (Efectivo)',
          items: [ { id: 'caserito', qty: 2, price: 19.9 } ],
          total: 39.8,
          status: 'Pendiente'
        }
      ];
      saveOrders();
    }

    function saveInventory() { localStorage.setItem('segaso_inventory', JSON.stringify(inventory)); }
    function saveOrders() { localStorage.setItem('segaso_orders', JSON.stringify(orders)); }
    function saveLeads() { localStorage.setItem('segaso_leads', JSON.stringify(waitlistLeads)); }

    function switchMode(mode) {
      currentMode = mode;
      const clientView = document.getElementById('clientView');
      const adminView = document.getElementById('adminView');
      const clientNavLinks = document.getElementById('clientNavLinks');
      const clientCartBtn = document.getElementById('clientCartBtn');

      if (mode === 'admin') {
        window.location.href = '/chorizos-segaso/admin';
        return;
      } else {
        adminView.classList.remove('active');
        clientView.classList.add('active');
        if (clientNavLinks) clientNavLinks.style.display = 'flex';
        if (clientCartBtn) clientCartBtn.style.display = 'flex';
        renderProducts(currentCategoryFilter);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    function getCardActionHtml(p, isOutOfStock, currentQty) {
      if (isOutOfStock) {
        return '<span class="badge badge-danger">Sin Stock</span>';
      }
      if (currentQty === 0) {
        return '<button class="add-to-cart-btn" onclick="updateCartItemQty(\'' + p.id + '\', 1)">➕ Pedir</button>';
      }
      return '<div class="qty-selector" style="background: rgba(166,24,40,0.2); border: 1px solid var(--primary); border-radius: 8px; padding: 2px 6px;">' +
        '<button class="qty-btn" onclick="updateCartItemQty(\'' + p.id + '\', -1)" title="Quitar 1">-</button>' +
        '<span class="qty-val" style="min-width: 22px; text-align: center; font-weight: 800; color: #fff;">' + currentQty + '</span>' +
        '<button class="qty-btn" onclick="updateCartItemQty(\'' + p.id + '\', 1)" title="Sumar 1">+</button>' +
      '</div>';
    }

    function renderProducts(filterCategory) {
      const container = document.getElementById('productsContainer');
      container.innerHTML = '';

      const filtered = (filterCategory === 'all')
        ? PRODUCTS
        : PRODUCTS.filter(p => p.category === filterCategory);

      filtered.forEach(p => {
        const stock = inventory[p.id] !== undefined ? inventory[p.id] : 0;
        const isOutOfStock = stock <= 0;
        const currentQty = cart[p.id] || 0;

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
        container.appendChild(card);
      });
    }

    function filterCatalog(category, btn) {
      currentCategoryFilter = category;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts(category);
    }

    function updateCartItemQty(prodId, delta) {
      const maxStock = inventory[prodId] || 0;
      let current = cart[prodId] || 0;
      let next = current + delta;

      if (next > maxStock) {
        showToast('Stock máximo alcanzado (' + maxStock + ' paq)');
        return;
      }

      const prod = PRODUCTS.find(p => p.id === prodId);
      if (next <= 0) {
        delete cart[prodId];
        showToast('Eliminado del pedido: ' + (prod ? prod.name : prodId));
      } else {
        cart[prodId] = next;
        if (delta > 0 && current === 0) {
          showToast('Agregado: ' + (prod ? prod.name : prodId) + ' (1 paq)');
        }
      }

      updateCartBadge();
      renderProducts(currentCategoryFilter);
      if (document.getElementById('cartDrawer').classList.contains('open')) {
        openCart();
      }
    }

    function updateCartBadge() {
      const totalUnits = Object.values(cart).reduce((a, b) => a + b, 0);
      document.getElementById('cartCount').textContent = totalUnits;
      if (typeof saveCart === 'function') saveCart();
    }

    function setModalOpen(modal, isOpen) {
      if (!modal) return;
      const wasOpen = modal.classList.contains('open');
      modal.classList.toggle('open', isOpen);
      modal.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      if (isOpen && !wasOpen) {
        lastFocusedElement = document.activeElement;
        setTimeout(() => {
          const focusable = modal.querySelector('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
          if (focusable) focusable.focus();
        }, 60);
      } else if (!isOpen && wasOpen) {
        if (lastFocusedElement && document.contains(lastFocusedElement)) lastFocusedElement.focus();
        lastFocusedElement = null;
      }
    }

    function openCart() {
      const drawer = document.getElementById('cartDrawer');
      const body = document.getElementById('cartDrawerBody');
      body.innerHTML = '';

      const items = Object.entries(cart);
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

      const discount = total * (appliedDiscountPct / 100);
      const finalTotal = total - discount;
      if (appliedDiscountPct > 0) {
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

    function applyPromoCode() {
      const codeInput = document.getElementById('promoCodeInput');
      const code = (codeInput ? codeInput.value : '').trim().toUpperCase();
      const fb = document.getElementById('promoFeedback');
      if (code === 'SEGASO10') {
        appliedDiscountPct = 10;
        if (fb) {
          fb.style.color = 'var(--success)';
          fb.textContent = '✓ 10% de descuento automático de bienvenida activo';
        }
        showToast('¡Cupón SEGASO10 aplicado! 10% de descuento');
      } else if (!code) {
        appliedDiscountPct = 0;
        if (fb) {
          fb.style.color = 'var(--cream-muted)';
          fb.textContent = 'Sin código promocional aplicado';
        }
        showToast('Descuento removido');
      } else {
        appliedDiscountPct = 0;
        if (fb) {
          fb.style.color = 'var(--danger)';
          fb.textContent = '✕ Código no válido. Usa SEGASO10 para 10% OFF';
        }
        showToast('Código no válido');
      }
      openCart();
    }

    function closeCart() { setModalOpen(document.getElementById('cartDrawer'), false); }
    function removeCartItem(prodId) {
      delete cart[prodId];
      updateCartBadge();
      openCart();
      renderProducts(currentCategoryFilter);
    }

    async function submitCustomerOrder() {
      const itemsKeys = Object.keys(cart);
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

      for (const [id, qty] of Object.entries(cart)) {
        if ((inventory[id] || 0) < qty) {
          alert('Lo sentimos, no hay suficiente stock de ' + PRODUCTS.find(p=>p.id===id).name);
          return;
        }
      }

      let orderItems = [];
      let total = 0;
      for (const [id, qty] of Object.entries(cart)) {
        inventory[id] -= qty;
        const prod = PRODUCTS.find(p=>p.id===id);
        const sub = prod.price * qty;
        total += sub;
        orderItems.push({ id, qty, price: prod.price });
      }
      saveInventory();

      const discount = total * (appliedDiscountPct / 100);
      const finalTotal = total - discount;

      const now = new Date();
      let orderId = 'SEG-' + (now.getFullYear() % 100) + Math.floor(1000 + Math.random() * 9000);

      let response = null;
      try {
        response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_name: name,
            customer_phone: phone,
            address: address,
            neighborhood: city,
            payment_method: payment,
            items: orderItems
          })
        });
      } catch (_) {
        console.log('Modo offline: orden guardada en almacenamiento local');
      }

      // Si el servidor rechaza el pedido, se devuelve el stock local y no se
      // muestra una confirmación falsa: la base es la fuente de verdad.
      if (response && !response.ok) {
        let mensaje = 'No pudimos registrar el pedido. Intenta de nuevo.';
        try {
          const data = await response.json();
          if (data.error) mensaje = data.error;
        } catch (_) {}
        for (const it of orderItems) inventory[it.id] = (inventory[it.id] || 0) + it.qty;
        saveInventory();
        renderProducts(currentCategoryFilter);
        alert(mensaje);
        return;
      }

      if (response) {
        try {
          const data = await response.json();
          if (data.success && data.code) orderId = data.code;
        } catch (_) {}
      }

      const newOrder = {
        id: orderId,
        date: now.toLocaleDateString('es-CO') + ' ' + now.getHours() + ':' + String(now.getMinutes()).padStart(2,'0'),
        customer: name,
        phone: phone,
        address: address,
        city: city,
        payment: payment,
        items: orderItems,
        total: parseFloat(finalTotal.toFixed(1)),
        discount: parseFloat(discount.toFixed(1)),
        status: 'Pendiente'
      };

      orders.unshift(newOrder);
      saveOrders();

      cart = {};
      updateCartBadge();
      closeCart();
      renderProducts(currentCategoryFilter);

      let msg = 'Hola Harold, acabo de hacer un pedido en la plataforma Segaso Chorizos:\n\n';
      msg += '📦 *Pedido:* ' + orderId + '\n';
      msg += '👤 *Cliente:* ' + name + '\n';
      msg += '📱 *Teléfono:* ' + phone + '\n';
      msg += '📍 *Dirección:* ' + address + ' (' + city + ')\n';
      msg += '💳 *Pago:* ' + payment + '\n\n';
      msg += '*Detalle de Chorizos:*\n';
      orderItems.forEach(it => {
        const prod = PRODUCTS.find(p=>p.id===it.id);
        msg += '• ' + it.qty + 'x ' + prod.name + ' = ' + (it.price * it.qty).toFixed(1) + 'k COP\n';
      });

      if (appliedDiscountPct > 0) {
        msg += '\n*Subtotal:* ' + total.toFixed(1) + 'k COP\n';
        msg += '🏷️ *Descuento Especial (' + appliedDiscountPct + '% OFF):* -' + discount.toFixed(1) + 'k COP (Promoción Web/WhatsApp)\n';
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

    function contactBarrilPlan(planName) {
      const msg = `Hola Harold, me interesa cotizar el servicio de Asado al Barril Segaso: Plan ${planName}. ¿Qué fechas tienen disponibles?`;
      window.open(`https://wa.me/573002367180?text=${encodeURIComponent(msg)}`, '_blank');
    }

    function joinCourseWaitlist() {
      const name = document.getElementById('courseName').value.trim();
      const phone = document.getElementById('coursePhone').value.trim();
      if (!name || !phone) {
        alert('Por favor ingresa tu nombre y número de celular.');
        return;
      }
      waitlistLeads.unshift({
        date: new Date().toLocaleDateString('es-CO'),
        name: name,
        phone: phone,
        interest: 'Taller Charcutería (Lista de Espera)'
      });
      saveLeads();

      // Persistir en SQLite de Harold
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          phone: phone,
          type: 'Taller Charcutería'
        })
      }).catch(() => console.log('Modo offline: lead guardado'));

      document.getElementById('courseName').value = '';
      document.getElementById('coursePhone').value = '';
      showToast('¡Inscrito en la lista de espera! Te contactaremos pronto.');
    }

    const TIKTOK_VIDEOS_MAP = {
      '7690072472544283924': { num: 1, title: 'Cevichito de chicharrón en asados al barril' },
      '7678100505100356884': { num: 2, title: 'Información para restaurantes y negocios' },
      '7674733063032540437': { num: 3, title: 'Receta de domingo con chorizos Segaso' },
      '7671306377410678036': { num: 4, title: 'Harold y Giseth: Historia de Segaso Chorizos' }
    };

    // REPRODUCTOR TIKTOK EMBEBIDO ($0 Tokens / Video Específico HTML5 H.264)
    function playTikTokVideo(videoId, title) {
      const modal = document.getElementById('tiktokPlayerModal');
      const titleEl = document.getElementById('tiktokModalTitle');
      const container = document.getElementById('tiktokEmbedContainer');
      const directLink = document.getElementById('tiktokDirectLink');

      const info = TIKTOK_VIDEOS_MAP[videoId] || { num: 1, title };
      titleEl.textContent = title || info.title;
      directLink.href = `https://www.tiktok.com/@segaso.chorizos/video/${videoId}`;
      
      // Renderizar reproductor de video nativo HTML5 (H.264 / AAC)
      container.innerHTML = `
        <video id="activeTikTokPlayer" controls autoplay playsinline poster="assets/img/thumbs/thumb_${info.num}.webp" style="width: 100%; max-height: 480px; border-radius: 8px; background: #000; outline: none; object-fit: contain;">
          <source src="videos/video_${info.num}.mp4" type="video/mp4">
          Tu navegador no soporta reproducción de video HTML5.
        </video>
      `;

      const source = container.querySelector('source');
      if (source) {
        source.addEventListener('error', () => {
          container.innerHTML = `<div style="padding: 28px; text-align: center; color: var(--cream-muted); font-size: 13px;">El video local no está disponible en este equipo.<br><a href="https://www.tiktok.com/@segaso.chorizos/video/${videoId}" target="_blank" rel="noopener" style="color: var(--gold); font-weight: 700;">Verlo en TikTok</a></div>`;
        }, { once: true });
      }

      setModalOpen(modal, true);
    }

    function closeTikTokModal() {
      const modal = document.getElementById('tiktokPlayerModal');
      setModalOpen(modal, false);
      const video = document.getElementById('activeTikTokPlayer');
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
      const container = document.getElementById('tiktokEmbedContainer');
      container.innerHTML = '<div style="color: var(--cream-muted); font-size: 13px;">Cargando video de TikTok...</div>';
    }

    // LIGHTBOX GOURMET & QUICK VIEW ($0 Tokens / Vanilla JS)
    function openProductDetail(productId) {
      const p = PRODUCTS.find(x => x.id === productId);
      if (!p) return;
      
      const modal = document.getElementById('imageLightboxModal');
      const img = document.getElementById('lightboxImg');
      const title = document.getElementById('lightboxTitle');
      const subtitle = document.getElementById('lightboxSubtitle');
      const price = document.getElementById('lightboxPrice');
      const desc = document.getElementById('lightboxDesc');
      const badgeWrap = document.getElementById('lightboxBadgeWrap');
      const btnContainer = document.getElementById('lightboxBtnContainer');

      img.src = PRODUCT_PHOTOS[p.id];
      img.alt = `${p.name} — presentación real Segaso`;
      title.textContent = p.name;
      subtitle.textContent = p.id === 'chimichurri' ? 'Frasco de vidrio hermético x 250g' : 'Paquete sellado al vacío x 5 unidades (450 g)';
      price.innerHTML = `${p.price.toFixed(1)}k <small style="font-size: 12px; color: var(--text-muted);">COP</small>`;
      desc.textContent = p.desc;

      badgeWrap.innerHTML = `<span class="badge ${p.id === 'caserito' ? 'badge-gold' : 'badge-primary'}">${p.tag}</span>`;

      const stock = inventory[p.id] !== undefined ? inventory[p.id] : 0;
      if (stock <= 0) {
        btnContainer.innerHTML = `<button class="btn-primary" disabled style="opacity: 0.5; cursor: not-allowed;">Agotado</button>`;
      } else {
        btnContainer.innerHTML = `<button class="btn-primary" onclick="updateCartItemQty('${p.id}', 1); closeLightbox(); showToast('¡${p.name} agregado al carrito!');">🛒 Agregar al Carrito</button>`;
      }

      setModalOpen(modal, true);
    }

    function openLightbox(imgSrc, titleText, descText) {
      const modal = document.getElementById('imageLightboxModal');
      const img = document.getElementById('lightboxImg');
      const title = document.getElementById('lightboxTitle');
      const subtitle = document.getElementById('lightboxSubtitle');
      const price = document.getElementById('lightboxPrice');
      const desc = document.getElementById('lightboxDesc');
      const badgeWrap = document.getElementById('lightboxBadgeWrap');
      const btnContainer = document.getElementById('lightboxBtnContainer');

      img.src = imgSrc;
      img.alt = titleText;
      title.textContent = titleText;
      subtitle.textContent = 'Servicio de Catering Parrillero Segaso · Envigado';
      price.innerHTML = '';
      desc.textContent = descText;
      badgeWrap.innerHTML = `<span class="badge badge-gold">🔥 Asados al Barril</span>`;
      btnContainer.innerHTML = `<a href="https://wa.me/573002367180?text=Hola%20Harold,%20estoy%20interesado%20en%20el%20servicio%20de%20asado%20al%20barril." target="_blank" class="btn-gold" style="text-decoration: none;">📲 Cotizar por WhatsApp</a>`;

      setModalOpen(modal, true);
    }

    function closeLightbox() {
      const modal = document.getElementById('imageLightboxModal');
      setModalOpen(modal, false);
      const img = document.getElementById('lightboxImg');
      if (img) {
        img.src = LIGHTBOX_PLACEHOLDER;
        img.alt = '';
      }
    }

    document.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role="button"][onclick]')) {
        e.preventDefault();
        e.target.click();
        return;
      }
      if (e.key === 'Escape') {
        closeLightbox();
        closeTikTokModal();
        closeCart();
        closeBotModal();
        closeMobileNav();
        return;
      }
      if (e.key !== 'Tab') return;
      const modal = document.querySelector('.modal-center.open, .drawer-overlay.open');
      if (!modal) return;
      const focusables = Array.from(
        modal.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')
      ).filter((el) => el.getClientRects().length > 0);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && (document.activeElement === first || !modal.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !modal.contains(document.activeElement))) {
        e.preventDefault();
        first.focus();
      }
    });

    document.querySelectorAll('.modal-center, .drawer-overlay').forEach((modal) => {
      modal.addEventListener('click', (e) => {
        if (e.target !== modal) return;
        if (modal.id === 'cartDrawer') closeCart();
        else if (modal.id === 'botModal') closeBotModal();
        else if (modal.id === 'imageLightboxModal') closeLightbox();
        else if (modal.id === 'tiktokPlayerModal') closeTikTokModal();
      });
    });

    // ASESOR VIRTUAL ($0 Tokens / Determinista)
    function openBotModal() { setModalOpen(document.getElementById('botModal'), true); }
    function closeBotModal() { setModalOpen(document.getElementById('botModal'), false); }

    function handleBotQuery(type) {
      const chat = document.getElementById('botChatMessages');
      let userQ = '';
      let botA = '';

      if (type === 'gluten') {
        userQ = '¿Los chorizos tienen harina o gluten?';
        botA = '🌾 <strong>100% Libres de Gluten y Harina.</strong> En Segaso usamos carne de cerdo seleccionada y condimentos naturales. Cero fécula, cero soya, cero almidón.';
      } else if (type === 'asados') {
        userQ = '¿Cómo funciona el asado al barril a domicilio?';
        botA = '🔥 <strong>Catering al Barril:</strong> Vamos a tu casa o finca desde 5 personas en adelante. Llevamos el barril ahumador, carbón, maestro parrillero y el menú completo de chorizos, carnes al barril y arepitas.';
      } else if (type === 'frio') {
        userQ = '¿Cómo conservarlos y cuánto duran?';
        botA = '❄️ <strong>Conservación:</strong> Duran hasta 60 días congelados (-18°C) y hasta 15 días refrigerados (0-4°C). Para asar, baja a la nevera 2 horas antes.';
      } else if (type === 'precios') {
        userQ = '¿Cuáles son los precios oficiales?';
        botA = '📋 <strong>Catálogo x 5 unidades (450 g):</strong><br>• Caserito Paisa: 19.9k COP<br>• Morcilla Tradicional: 15.0k COP<br>• Antioqueño: 23.6k COP<br>• Santarrosano / Tocineta / Parrillero: 23.8k COP<br>• Picante: 24.2k COP<br>• Argentino: 24.6k COP<br>• Chimichurri: 14.5k COP';
      } else if (type === 'asesor') {
        userQ = 'Quiero hablar directo con Harold';
        botA = '📞 <strong>Contacto Directo Gerencia:</strong> Escríbele al WhatsApp <a href="https://wa.me/573002367180" target="_blank" style="color: var(--success-soft); font-weight: 700;">300 236 7180</a>. ¡Te atenderá de inmediato!';
      }

      const userBubble = document.createElement('div');
      userBubble.style.cssText = 'background: var(--primary); color: #fff; padding: 10px 14px; border-radius: 12px; font-size: 13px; align-self: flex-end; margin-top: 10px; margin-left: 40px;';
      userBubble.innerHTML = userQ;
      chat.appendChild(userBubble);

      setTimeout(() => {
        const botBubble = document.createElement('div');
        botBubble.style.cssText = 'background: var(--bg-card); color: var(--cream); padding: 12px 14px; border-radius: 12px; font-size: 13px; border: 1px solid var(--border-subtle); margin-top: 8px; margin-right: 30px; line-height: 1.45;';
        botBubble.innerHTML = botA;
        chat.appendChild(botBubble);
        chat.scrollTop = chat.scrollHeight;
      }, 250);
    }

    function toggleFaq(el) {
      const isOpen = el.parentElement.classList.toggle('open');
      el.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }

    function showToast(msg) {
      const container = document.getElementById('toastContainer');
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = msg;
      container.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
      }, 2600);
    }

    // ============================================================
    // HAMBURGER MENU MOBILE
    // ============================================================
    function toggleMobileNav() {
      const nav = document.getElementById('mobileNav');
      const btn = document.getElementById('hamburgerBtn');
      const backdrop = document.getElementById('mobileNavBackdrop');
      const isOpen = nav.classList.toggle('open');
      btn.textContent = isOpen ? '✕' : '☰';
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      btn.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
      if (backdrop) backdrop.classList.toggle('open', isOpen);
      document.body.classList.toggle('menu-open', isOpen);
    }

    function closeMobileNav() {
      const nav = document.getElementById('mobileNav');
      const btn = document.getElementById('hamburgerBtn');
      const backdrop = document.getElementById('mobileNavBackdrop');
      nav.classList.remove('open');
      btn.textContent = '☰';
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Abrir menú');
      if (backdrop) backdrop.classList.remove('open');
      document.body.classList.remove('menu-open');
    }

    const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');
    if (mobileNavBackdrop) mobileNavBackdrop.addEventListener('click', closeMobileNav);

    // Cerrar el menú mobile al hacer clic fuera
    document.addEventListener('click', (e) => {
      const nav = document.getElementById('mobileNav');
      const btn = document.getElementById('hamburgerBtn');
      if (nav.classList.contains('open') && !nav.contains(e.target) && e.target !== btn) {
        closeMobileNav();
      }
    });

    // ============================================================
    // CARRITO PERSISTENTE (localStorage)
    // ============================================================
    function saveCart() {
      try { localStorage.setItem('segaso_cart', JSON.stringify(cart)); } catch (_) {}
    }

    function loadCart() {
      try {
        const saved = localStorage.getItem('segaso_cart');
        if (saved) {
          const parsed = JSON.parse(saved);
          // Validar que las claves del carrito guardado existan en PRODUCTS
          const validIds = new Set(PRODUCTS.map(p => p.id));
          Object.keys(parsed).forEach(id => {
            if (validIds.has(id) && parsed[id] > 0) cart[id] = parsed[id];
          });
        }
      } catch (_) {}
    }

    // Cargar carrito guardado en DOMContentLoaded (antes de renderProducts)
    document.addEventListener('DOMContentLoaded', () => {
      loadCart();
      updateCartBadge();
    }, { once: true });

    // ============================================================
    // SYNC STOCK DESDE API AL CARGAR (stock real de SQLite de Harold)
    // ============================================================
    async function syncInventoryFromServer() {
      try {
        const res = await fetch('/api/inventory');
        if (!res.ok) return;
        const data = await res.json();
        if (!data.success || !Array.isArray(data.inventory)) return;

        // Aplicar stock real de SQLite al inventario local
        let updated = false;
        data.inventory.forEach(({ code, stock }) => {
          if (inventory[code] !== undefined && inventory[code] !== stock) {
            inventory[code] = stock;
            updated = true;
          } else if (inventory[code] === undefined) {
            inventory[code] = stock;
            updated = true;
          }
        });

        if (updated) {
          saveInventory();
          renderProducts(currentCategoryFilter);
        }
      } catch (_) {
        // Offline o servidor no iniciado — localStorage sigue como fuente
      }
    }

    // Ejecutar sync al cargar la página (sin bloquear el render inicial)
    window.addEventListener('DOMContentLoaded', () => {
      syncInventoryFromServer();
    }, { once: true });

  