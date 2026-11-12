"use strict";
(() => {
  // assets/js/modules/catalog.js
  var PRODUCTS = [
    { id: "caserito", name: "Chorizo Caserito Paisa", price: 19.9, category: "tradicional", icon: "\u{1F953}", tag: "\u2B50 M\xE1s Vendido", desc: "El sabor tradicional de la casa. Carne seleccionada y saz\xF3n paisa suave para el desayuno o la arepa." },
    { id: "antioqueno", name: "Chorizo Antioque\xF1o", price: 23.6, category: "tradicional", icon: "\u{1F1F3}\u{1F1EC}", tag: "Tradicional", desc: "Sabor aut\xE9ntico antioque\xF1o con picado fino, ahumado natural y el balance perfecto de grasa natural." },
    { id: "santarrosano", name: "Chorizo Santarrosano", price: 23.8, category: "tradicional", icon: "\u{1F1E8}\u{1F1F4}", tag: "Tradicional", desc: "Inspirado en la receta t\xEDpica de Santa Rosa de Cabal. Trozos jugosos y especias de monta\xF1a." },
    { id: "tocineta", name: "Chorizo con Tocineta", price: 23.8, category: "especial", icon: "\u{1F953}", tag: "Especial", desc: "Fusi\xF3n irresistible de cerdo seleccionado con crujiente tocineta ahumada. Explosi\xF3n de sabor a la parrilla." },
    { id: "parrillero", name: "Chorizo Parrillero al Ajo", price: 23.8, category: "especial", icon: "\u{1F374}", tag: "Parrillero", desc: "Toque gourmet de ajo macerado y pimienta suave. Ideal para asados de fin de semana con amigos." },
    { id: "picante", name: "Chorizo Picante Artesanal", price: 24.2, category: "especial", icon: "\u{1F336}\uFE0F", tag: "Especial", desc: "Intensidad media con aj\xED casero y p\xE1prika. Pica lo justo sin opacar la calidad de la carne." },
    { id: "argentino", name: "Chorizo Estilo Argentino", price: 24.6, category: "especial", icon: "\u{1F1E6}\u{1F1F7}", tag: "Parrillero", desc: "Picado grueso, vino tinto y nuez moscada. Especial para chorip\xE1n con abundante chimichurri." },
    { id: "morcilla", name: "Morcilla Paisa Tradicional", price: 15, category: "complemento", icon: "\u{1F969}", tag: "Tradicional", desc: "Arroz esponjoso, especias de huerta y sangre fresca seleccionada. Crujiente por fuera y suave por dentro." },
    { id: "chimichurri", name: "Chimichurri Especial de la Casa", price: 14.5, category: "complemento", icon: "\u{1F33F}", tag: "Acompa\xF1amiento", desc: "Frasco artesanal con perejil fresco, ajo, aceite de oliva virgen y or\xE9gano. El maridaje perfecto." }
  ];
  var LIGHTBOX_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221%22 height=%221%22/%3E";
  var PRODUCT_PHOTOS = {
    caserito: "img/products/caserito.webp",
    antioqueno: "img/products/antioqueno.webp",
    santarrosano: "img/products/santarrosano.webp",
    tocineta: "img/products/tocineta.webp",
    parrillero: "img/products/parrillero.webp",
    picante: "img/products/picante.webp",
    argentino: "img/products/argentino.webp",
    morcilla: "img/products/morcilla.webp",
    chimichurri: "img/products/chimichurri.webp"
  };
  function getCardActionHtml(p, isOutOfStock, currentQty) {
    if (isOutOfStock) {
      return '<span class="badge badge-danger">Sin Stock</span>';
    }
    if (currentQty === 0) {
      return `<button class="add-to-cart-btn" onclick="updateCartItemQty('` + p.id + `', 1)">\u2795 Pedir</button>`;
    }
    return `<div class="qty-selector" style="background: rgba(166,24,40,0.2); border: 1px solid var(--primary); border-radius: 8px; padding: 2px 6px;"><button class="qty-btn" onclick="updateCartItemQty('` + p.id + `', -1)" title="Quitar 1">-</button><span class="qty-val" style="min-width: 22px; text-align: center; font-weight: 800; color: #fff;">` + currentQty + `</span><button class="qty-btn" onclick="updateCartItemQty('` + p.id + `', 1)" title="Sumar 1">+</button></div>`;
  }

  // assets/js/modules/state.js
  var state = {
    currentMode: "client",
    currentCategoryFilter: "all",
    cart: {},
    appliedDiscountPct: 10,
    // Descuento de bienvenida automático del 10%
    inventory: {},
    orders: [],
    waitlistLeads: [],
    lastFocusedElement: null
  };
  function saveInventory() {
    try {
      localStorage.setItem("segaso_inventory", JSON.stringify(state.inventory));
    } catch (_) {
    }
  }
  function saveOrders() {
    try {
      localStorage.setItem("segaso_orders", JSON.stringify(state.orders));
    } catch (_) {
    }
  }
  function saveLeads() {
    try {
      localStorage.setItem("segaso_leads", JSON.stringify(state.waitlistLeads));
    } catch (_) {
    }
  }
  function saveCart() {
    try {
      localStorage.setItem("segaso_cart", JSON.stringify(state.cart));
    } catch (_) {
    }
  }
  function loadCart() {
    try {
      const saved = localStorage.getItem("segaso_cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        const validIds = new Set(PRODUCTS.map((p) => p.id));
        Object.keys(parsed).forEach((id) => {
          if (validIds.has(id) && parsed[id] > 0) state.cart[id] = parsed[id];
        });
      }
    } catch (_) {
    }
  }
  function initData() {
    const savedInv = localStorage.getItem("segaso_inventory");
    if (savedInv) {
      state.inventory = JSON.parse(savedInv);
    } else {
      PRODUCTS.forEach((p) => {
        state.inventory[p.id] = p.id === "caserito" ? 45 : p.id === "morcilla" ? 30 : 25;
      });
      saveInventory();
    }
    const savedOrders = localStorage.getItem("segaso_orders");
    if (savedOrders) {
      state.orders = JSON.parse(savedOrders);
    } else {
      seedInitialDemoOrders();
    }
    const savedLeads = localStorage.getItem("segaso_leads");
    if (savedLeads) {
      state.waitlistLeads = JSON.parse(savedLeads);
    } else {
      state.waitlistLeads = [
        { date: "08/10/2026", name: "Santiago Montoya", phone: "311 234 5678", interest: "Taller de Charcuter\xEDa" },
        { date: "08/10/2026", name: "Laura Ochoa", phone: "300 876 5432", interest: "Asado al Barril (15 pers)" }
      ];
      saveLeads();
    }
  }
  function seedInitialDemoOrders() {
    state.orders = [
      {
        id: "SEG-2601",
        date: "08/10/2026 14:20",
        customer: "Mateo G\xF3mez",
        phone: "312 458 9201",
        address: "Cra 43A # 32 Sur - 15",
        city: "Envigado",
        payment: "Transferencia Nequi/Bancolombia",
        items: [{ id: "caserito", qty: 2, price: 19.9 }, { id: "chimichurri", qty: 1, price: 14.5 }],
        total: 54.3,
        status: "Entregado"
      },
      {
        id: "SEG-2602",
        date: "08/10/2026 15:45",
        customer: "Valentina Restrepo",
        phone: "300 789 1122",
        address: "Calle 50 # 40 - 22, Primavera",
        city: "Envigado",
        payment: "Contra Entrega (Efectivo)",
        items: [{ id: "antioqueno", qty: 2, price: 23.6 }, { id: "morcilla", qty: 2, price: 15 }],
        total: 77.2,
        status: "En Camino"
      }
    ];
    saveOrders();
  }
  async function syncInventoryFromServer(onUpdateCallback) {
    if (typeof window !== "undefined" && window.location.protocol === "file:") return;
    try {
      const res = await fetch("/api/inventory");
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
        if (typeof onUpdateCallback === "function") onUpdateCallback();
      }
    } catch (_) {
    }
  }

  // assets/js/modules/renderer.js
  function renderProducts(filterCategory) {
    const container = document.getElementById("productsContainer");
    if (!container) return;
    container.innerHTML = "";
    const filtered = filterCategory === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filterCategory);
    filtered.forEach((p) => {
      const stock = state.inventory[p.id] !== void 0 ? state.inventory[p.id] : 0;
      const isOutOfStock = stock <= 0;
      const currentQty = state.cart[p.id] || 0;
      const card = document.createElement("div");
      card.className = "product-card " + (isOutOfStock ? "out-of-stock" : "");
      card.innerHTML = `
      <div class="prod-visual" role="button" tabindex="0" aria-label="Ver detalle de ${p.name}" onclick="openProductDetail('${p.id}')" title="Clic para ver fotograf\xEDa en alta definici\xF3n y detalles">
        <img src="img/products/${p.id}-480.webp" srcset="img/products/${p.id}-480.webp 480w, ${PRODUCT_PHOTOS[p.id]} 900w" sizes="(max-width: 700px) 90vw, 310px" class="prod-real-img" alt="${p.name} \u2014 presentaci\xF3n real Segaso" width="480" height="480" loading="lazy" decoding="async" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
        <div class="prod-placeholder-icon" style="display: none;">${p.icon}</div>
        <div class="prod-badge-pos">
          <span class="badge ${p.id === "caserito" ? "badge-gold" : "badge-primary"}">${p.tag}</span>
        </div>
        <div class="prod-zoom-hint">
          <span>\u{1F50D} Ver detalle</span>
        </div>
      </div>
      <div class="prod-body">
        <h3 class="prod-name">${p.name}</h3>
        <div class="prod-pack">Paquete x 5 unidades (450 g)</div>
        <p class="prod-desc">${p.desc}</p>
        <div style="font-size: 11.5px; margin-bottom: 6px;">
          ${isOutOfStock ? '<span style="color: var(--danger); font-weight: 700;">\u{1F534} Agotado moment\xE1neamente</span>' : '<span style="color: var(--success); font-weight: 600;">\u{1F7E2} Disponible \xB7 ' + stock + " paq</span>"}
        </div>
      </div>
      <div class="prod-footer">
        <div class="prod-price">
          ${p.price.toFixed(1)}k <small>COP</small>
        </div>
        ${getCardActionHtml(p, isOutOfStock, currentQty)}
      </div>
    `;
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mouse-x", e.clientX - rect.left + "px");
        card.style.setProperty("--mouse-y", e.clientY - rect.top + "px");
      });
      container.appendChild(card);
    });
  }
  function filterCatalog(category, btn) {
    state.currentCategoryFilter = category;
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    if (btn) btn.classList.add("active");
    renderProducts(category);
  }

  // assets/js/modules/media_modal.js
  var TIKTOK_VIDEOS_MAP = {
    "7690072472544283924": { num: 1, title: "Cevichito de chicharr\xF3n en asados al barril" },
    "7678100505100356884": { num: 2, title: "Informaci\xF3n para restaurantes y negocios" },
    "7674733063032540437": { num: 3, title: "Receta de domingo con chorizos Segaso" },
    "7671306377410678036": { num: 4, title: "Harold y Giseth: Historia de Segaso Chorizos" }
  };
  var TIKTOK_PLAYER = "https://www.tiktok.com/player/v1/";
  var TIKTOK_PLAYER_QUERY = "?autoplay=1&muted=1&loop=0&rel=0&music_info=0&description=0";
  function tiktokEmbedMarkup(videoId) {
    return `<iframe
    src="${TIKTOK_PLAYER}${videoId}${TIKTOK_PLAYER_QUERY}"
    title="Video oficial de Segaso Chorizos en TikTok"
    style="width: 100%; height: 100%; border: 0; display: block; background: #000;"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen></iframe>`;
  }
  function tiktokLinkFallbackMarkup(videoId) {
    return `<div style="padding: 28px; text-align: center; color: var(--cream-muted); font-size: 13px; line-height: 1.6;">
    El video no se pudo cargar en este equipo.<br>
    <a href="https://www.tiktok.com/@segaso.chorizos/video/${videoId}" target="_blank" rel="noopener" style="color: var(--gold); font-weight: 700;">Verlo en TikTok</a>
  </div>`;
  }
  function localVideoMarkup(info) {
    return `<video id="activeTikTokPlayer" controls autoplay playsinline poster="assets/img/thumbs/thumb_${info.num}.webp" style="width: 100%; height: 100%; background: #000; object-fit: contain;">
      <source src="videos/video_${info.num}.mp4" type="video/mp4">
      Tu navegador no soporta reproducci\xF3n de video HTML5.
    </video>`;
  }
  function setModalOpen(modal, isOpen) {
    if (!modal) return;
    const wasOpen = modal.classList.contains("open");
    modal.classList.toggle("open", isOpen);
    modal.setAttribute("aria-hidden", isOpen ? "false" : "true");
    if (isOpen && !wasOpen) {
      state.lastFocusedElement = document.activeElement;
      setTimeout(() => {
        const focusable = modal.querySelector('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
        if (focusable) focusable.focus();
      }, 60);
    } else if (!isOpen && wasOpen) {
      if (state.lastFocusedElement && document.contains(state.lastFocusedElement)) state.lastFocusedElement.focus();
      state.lastFocusedElement = null;
    }
  }
  function openProductDetail(productId) {
    const p = PRODUCTS.find((x) => x.id === productId);
    if (!p) return;
    const modal = document.getElementById("imageLightboxModal");
    const img = document.getElementById("lightboxImg");
    const title = document.getElementById("lightboxTitle");
    const subtitle = document.getElementById("lightboxSubtitle");
    const price = document.getElementById("lightboxPrice");
    const desc = document.getElementById("lightboxDesc");
    const badgeWrap = document.getElementById("lightboxBadgeWrap");
    const btnContainer = document.getElementById("lightboxBtnContainer");
    img.src = PRODUCT_PHOTOS[p.id];
    img.alt = `${p.name} \u2014 presentaci\xF3n real Segaso`;
    title.textContent = p.name;
    subtitle.textContent = p.id === "chimichurri" ? "Frasco de vidrio herm\xE9tico x 250g" : "Paquete sellado al vac\xEDo x 5 unidades (450 g)";
    price.innerHTML = `${p.price.toFixed(1)}k <small style="font-size: 12px; color: var(--text-muted);">COP</small>`;
    desc.textContent = p.desc;
    badgeWrap.innerHTML = `<span class="badge ${p.id === "caserito" ? "badge-gold" : "badge-primary"}">${p.tag}</span>`;
    const stock = state.inventory[p.id] !== void 0 ? state.inventory[p.id] : 0;
    if (stock <= 0) {
      btnContainer.innerHTML = `<button class="btn-primary" disabled style="opacity: 0.5; cursor: not-allowed;">Agotado</button>`;
    } else {
      btnContainer.innerHTML = `<button class="btn-primary" onclick="updateCartItemQty('${p.id}', 1); closeLightbox(); showToast('\xA1${p.name} agregado al carrito!');">\u{1F6D2} Agregar al Carrito</button>`;
    }
    setModalOpen(modal, true);
  }
  function openLightbox(imgSrc, titleText, descText) {
    const modal = document.getElementById("imageLightboxModal");
    const img = document.getElementById("lightboxImg");
    const title = document.getElementById("lightboxTitle");
    const subtitle = document.getElementById("lightboxSubtitle");
    const price = document.getElementById("lightboxPrice");
    const desc = document.getElementById("lightboxDesc");
    const badgeWrap = document.getElementById("lightboxBadgeWrap");
    const btnContainer = document.getElementById("lightboxBtnContainer");
    img.src = imgSrc;
    img.alt = titleText;
    title.textContent = titleText;
    subtitle.textContent = "Servicio de Catering Parrillero Segaso \xB7 Envigado";
    price.innerHTML = "";
    desc.textContent = descText;
    badgeWrap.innerHTML = `<span class="badge badge-gold">\u{1F525} Asados al Barril</span>`;
    btnContainer.innerHTML = `<a href="https://wa.me/573002367180?text=Hola%20Harold,%20estoy%20interesado%20en%20el%20servicio%20de%20asado%20al%20barril." target="_blank" class="btn-gold" style="text-decoration: none;">\u{1F4F2} Cotizar por WhatsApp</a>`;
    setModalOpen(modal, true);
  }
  function closeLightbox() {
    const modal = document.getElementById("imageLightboxModal");
    setModalOpen(modal, false);
    const img = document.getElementById("lightboxImg");
    if (img) {
      img.src = LIGHTBOX_PLACEHOLDER;
      img.alt = "";
    }
  }
  function playTikTokVideo(videoId, title) {
    const modal = document.getElementById("tiktokPlayerModal");
    const titleEl = document.getElementById("tiktokModalTitle");
    const container = document.getElementById("tiktokEmbedContainer");
    const directLink = document.getElementById("tiktokDirectLink");
    const info = TIKTOK_VIDEOS_MAP[videoId] || { num: 1, title };
    titleEl.textContent = title || info.title;
    directLink.href = `https://www.tiktok.com/@segaso.chorizos/video/${videoId}`;
    const isLocalEnv = typeof window !== "undefined" && (window.location.protocol === "file:" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
    if (isLocalEnv) {
      container.innerHTML = localVideoMarkup(info);
      const source = container.querySelector("source");
      if (source) {
        source.addEventListener("error", () => {
          container.innerHTML = tiktokEmbedMarkup(videoId);
          const frame = container.querySelector("iframe");
          if (frame) {
            frame.addEventListener("error", () => {
              container.innerHTML = tiktokLinkFallbackMarkup(videoId);
            }, { once: true });
          }
        }, { once: true });
      }
    } else {
      container.innerHTML = tiktokEmbedMarkup(videoId);
      const frame = container.querySelector("iframe");
      if (frame) {
        frame.addEventListener("error", () => {
          container.innerHTML = tiktokLinkFallbackMarkup(videoId);
        }, { once: true });
      }
    }
    setModalOpen(modal, true);
  }
  function closeTikTokModal() {
    const modal = document.getElementById("tiktokPlayerModal");
    setModalOpen(modal, false);
    const video = document.getElementById("activeTikTokPlayer");
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    const container = document.getElementById("tiktokEmbedContainer");
    if (container) container.innerHTML = '<div style="color: var(--cream-muted); font-size: 13px;">Cargando video de TikTok...</div>';
  }

  // assets/js/modules/bot_ui.js
  function openBotModal() {
    setModalOpen(document.getElementById("botModal"), true);
  }
  function closeBotModal() {
    setModalOpen(document.getElementById("botModal"), false);
  }
  function handleBotQuery(type) {
    const chat = document.getElementById("botChatMessages");
    if (!chat) return;
    let userQ = "";
    let botA = "";
    if (type === "gluten") {
      userQ = "\xBFLos chorizos tienen harina o gluten?";
      botA = "\u{1F33E} <strong>100% Libres de Gluten y Harina.</strong> En Segaso usamos carne de cerdo seleccionada y condimentos naturales. Cero f\xE9cula, cero soya, cero almid\xF3n.";
    } else if (type === "asados") {
      userQ = "\xBFC\xF3mo funciona el asado al barril a domicilio?";
      botA = "\u{1F525} <strong>Catering al Barril:</strong> Vamos a tu casa o finca desde 5 personas en adelante. Llevamos el barril ahumador, carb\xF3n, maestro parrillero y el men\xFA completo de chorizos, carnes al barril y arepitas.";
    } else if (type === "frio") {
      userQ = "\xBFC\xF3mo conservarlos y cu\xE1nto duran?";
      botA = "\u2744\uFE0F <strong>Conservaci\xF3n:</strong> Duran hasta 60 d\xEDas congelados (-18\xB0C) y hasta 15 d\xEDas refrigerados (0-4\xB0C). Para asar, baja a la nevera 2 horas antes.";
    } else if (type === "precios") {
      userQ = "\xBFCu\xE1les son los precios oficiales?";
      botA = "\u{1F4CB} <strong>Cat\xE1logo x 5 unidades (450 g):</strong><br>\u2022 Caserito Paisa: 19.9k COP<br>\u2022 Morcilla Tradicional: 15.0k COP<br>\u2022 Antioque\xF1o: 23.6k COP<br>\u2022 Santarrosano / Tocineta / Parrillero: 23.8k COP<br>\u2022 Picante: 24.2k COP<br>\u2022 Argentino: 24.6k COP<br>\u2022 Chimichurri: 14.5k COP";
    } else if (type === "asesor") {
      userQ = "Quiero hablar directo con Harold";
      botA = '\u{1F4DE} <strong>Contacto Directo Gerencia:</strong> Escr\xEDbele al WhatsApp <a href="https://wa.me/573002367180" target="_blank" style="color: var(--success-soft); font-weight: 700;">300 236 7180</a>. \xA1Te atender\xE1 de inmediato!';
    }
    const userBubble = document.createElement("div");
    userBubble.style.cssText = "background: var(--primary); color: #fff; padding: 10px 14px; border-radius: 12px; font-size: 13px; align-self: flex-end; margin-top: 10px; margin-left: 40px;";
    userBubble.innerHTML = userQ;
    chat.appendChild(userBubble);
    setTimeout(() => {
      const botBubble = document.createElement("div");
      botBubble.style.cssText = "background: var(--bg-card); color: var(--cream); padding: 12px 14px; border-radius: 12px; font-size: 13px; border: 1px solid var(--border-subtle); margin-top: 8px; margin-right: 30px; line-height: 1.45;";
      botBubble.innerHTML = botA;
      chat.appendChild(botBubble);
      chat.scrollTop = chat.scrollHeight;
    }, 250);
  }
  function toggleFaq(el) {
    const isOpen = el.parentElement.classList.toggle("open");
    el.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }
  function showToast(msg) {
    const container = document.getElementById("toastContainer");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.3s";
      setTimeout(() => toast.remove(), 300);
    }, 2600);
  }
  function toggleMobileNav() {
    const nav = document.getElementById("mobileNav");
    const btn = document.getElementById("hamburgerBtn");
    const backdrop = document.getElementById("mobileNavBackdrop");
    if (!nav || !btn) return;
    const isOpen = nav.classList.toggle("open");
    btn.textContent = isOpen ? "\u2715" : "\u2630";
    btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    btn.setAttribute("aria-label", isOpen ? "Cerrar men\xFA" : "Abrir men\xFA");
    if (backdrop) backdrop.classList.toggle("open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
  }
  function closeMobileNav() {
    const nav = document.getElementById("mobileNav");
    const btn = document.getElementById("hamburgerBtn");
    const backdrop = document.getElementById("mobileNavBackdrop");
    if (!nav || !btn) return;
    nav.classList.remove("open");
    btn.textContent = "\u2630";
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Abrir men\xFA");
    if (backdrop) backdrop.classList.remove("open");
    document.body.classList.remove("menu-open");
  }

  // assets/js/modules/cart.js
  function updateCartItemQty(prodId, delta, onCartChanged) {
    const maxStock = state.inventory[prodId] || 0;
    let current = state.cart[prodId] || 0;
    let next = current + delta;
    if (next > maxStock) {
      showToast("Stock m\xE1ximo alcanzado (" + maxStock + " paq)");
      return;
    }
    const prod = PRODUCTS.find((p) => p.id === prodId);
    if (next <= 0) {
      delete state.cart[prodId];
      showToast("Eliminado del pedido: " + (prod ? prod.name : prodId));
    } else {
      state.cart[prodId] = next;
      if (delta > 0 && current === 0) {
        showToast("Agregado: " + (prod ? prod.name : prodId) + " (1 paq)");
      }
    }
    updateCartBadge();
    if (typeof onCartChanged === "function") onCartChanged();
    if (document.getElementById("cartDrawer") && document.getElementById("cartDrawer").classList.contains("open")) {
      openCart();
    }
  }
  function updateCartBadge() {
    const totalUnits = Object.values(state.cart).reduce((a, b) => a + b, 0);
    const el = document.getElementById("cartCount");
    if (el) {
      el.textContent = totalUnits;
      el.classList.remove("badge-pop");
      void el.offsetWidth;
      el.classList.add("badge-pop");
    }
    saveCart();
  }
  function openCart() {
    const drawer = document.getElementById("cartDrawer");
    const body = document.getElementById("cartDrawerBody");
    if (!drawer || !body) return;
    body.innerHTML = "";
    const items = Object.entries(state.cart);
    if (items.length === 0) {
      body.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
        <div style="font-size: 40px; margin-bottom: 12px;">\u{1F6D2}</div>
        <p style="font-weight: 600;">Tu pedido est\xE1 vac\xEDo</p>
        <p style="font-size: 12px; margin-top: 6px;">Selecciona chorizos del cat\xE1logo para iniciar tu orden.</p>
      </div>
    `;
      document.getElementById("cartTotalAmount").textContent = "0.0k COP";
      setModalOpen(drawer, true);
      return;
    }
    let total = 0;
    items.forEach(([id, qty]) => {
      const prod = PRODUCTS.find((p) => p.id === id);
      const subtotal = prod.price * qty;
      total += subtotal;
      const row = document.createElement("div");
      row.className = "cart-item";
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
      document.getElementById("cartTotalAmount").innerHTML = `
      <span style="text-decoration: line-through; color: var(--text-muted); font-size: 13px; margin-right: 6px;">${total.toFixed(1)}k</span>
      <span style="color: var(--gold);">${finalTotal.toFixed(1)}k COP</span>
      <span style="color: var(--success); font-size: 11px; display: block; font-weight: 600;">(-${discount.toFixed(1)}k COP de descuento aplicado)</span>
    `;
    } else {
      document.getElementById("cartTotalAmount").textContent = total.toFixed(1) + "k COP";
    }
    drawer.classList.add("open");
  }
  function closeCart() {
    setModalOpen(document.getElementById("cartDrawer"), false);
  }
  function removeCartItem(prodId, onCartChanged) {
    delete state.cart[prodId];
    updateCartBadge();
    openCart();
    if (typeof onCartChanged === "function") onCartChanged();
  }
  function applyPromoCode() {
    const codeInput = document.getElementById("promoCodeInput");
    const code = (codeInput ? codeInput.value : "").trim().toUpperCase();
    const fb = document.getElementById("promoFeedback");
    if (code === "SEGASO10") {
      state.appliedDiscountPct = 10;
      if (fb) {
        fb.style.color = "var(--success)";
        fb.textContent = "\u2713 10% de descuento autom\xE1tico de bienvenida activo";
      }
      showToast("\xA1Cup\xF3n SEGASO10 aplicado! 10% de descuento");
    } else if (!code) {
      state.appliedDiscountPct = 0;
      if (fb) {
        fb.style.color = "var(--cream-muted)";
        fb.textContent = "Sin c\xF3digo promocional aplicado";
      }
      showToast("Descuento removido");
    } else {
      state.appliedDiscountPct = 0;
      if (fb) {
        fb.style.color = "var(--danger)";
        fb.textContent = "\u2715 C\xF3digo no v\xE1lido. Usa SEGASO10 para 10% OFF";
      }
      showToast("C\xF3digo no v\xE1lido");
    }
    openCart();
  }

  // assets/js/modules/checkout.js
  async function submitCustomerOrder(onOrderCompleted) {
    const itemsKeys = Object.keys(state.cart);
    if (itemsKeys.length === 0) {
      showToast("El pedido est\xE1 vac\xEDo");
      return;
    }
    const name = document.getElementById("custName").value.trim();
    const phone = document.getElementById("custPhone").value.trim();
    const address = document.getElementById("custAddress").value.trim();
    const city = document.getElementById("custCity").value;
    const payment = document.getElementById("custPayment").value;
    if (!name || !phone || !address) {
      alert("Por favor completa tu nombre, tel\xE9fono y direcci\xF3n de entrega.");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      alert("El tel\xE9fono debe tener 10 d\xEDgitos (ejemplo: 3001234567).");
      return;
    }
    for (const [id, qty] of Object.entries(state.cart)) {
      if ((state.inventory[id] || 0) < qty) {
        alert("Lo sentimos, no hay suficiente stock de " + PRODUCTS.find((p) => p.id === id).name);
        return;
      }
    }
    let orderItems = [];
    let total = 0;
    for (const [id, qty] of Object.entries(state.cart)) {
      state.inventory[id] -= qty;
      const prod = PRODUCTS.find((p) => p.id === id);
      const sub = prod.price * qty;
      total += sub;
      orderItems.push({ id, qty, price: prod.price });
    }
    saveInventory();
    let discount = total * (state.appliedDiscountPct / 100);
    let finalTotal = total - discount;
    const now = /* @__PURE__ */ new Date();
    let orderId = "SEG-" + now.getFullYear() % 100 + Math.floor(1e3 + Math.random() * 9e3);
    let response = null;
    try {
      response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name,
          customer_phone: phone,
          address,
          neighborhood: city,
          payment_method: payment,
          items: orderItems
        })
      });
    } catch (_) {
      console.log("Modo offline: orden guardada en almacenamiento local");
    }
    if (response && !response.ok) {
      let mensaje = "No pudimos registrar el pedido. Intenta de nuevo.";
      try {
        const data = await response.json();
        if (data.error) mensaje = data.error;
      } catch (_) {
      }
      for (const it of orderItems) state.inventory[it.id] = (state.inventory[it.id] || 0) + it.qty;
      saveInventory();
      if (typeof onOrderCompleted === "function") onOrderCompleted();
      alert(mensaje);
      return;
    }
    if (response) {
      try {
        const data = await response.json();
        if (data.success && data.code) orderId = data.code;
        if (data.success && Number.isFinite(data.total_cop)) {
          total = data.subtotal_cop / 1e3;
          discount = data.discount_cop / 1e3;
          finalTotal = data.total_cop / 1e3;
          state.appliedDiscountPct = total > 0 ? Math.round(discount / total * 100) : 0;
        }
      } catch (_) {
      }
    }
    const newOrder = {
      id: orderId,
      date: now.toLocaleDateString("es-CO") + " " + now.getHours() + ":" + String(now.getMinutes()).padStart(2, "0"),
      customer: name,
      phone,
      address,
      city,
      payment,
      items: orderItems,
      total: parseFloat(finalTotal.toFixed(1)),
      discount: parseFloat(discount.toFixed(1)),
      status: "Pendiente"
    };
    state.orders.unshift(newOrder);
    saveOrders();
    state.cart = {};
    updateCartBadge();
    closeCart();
    if (typeof onOrderCompleted === "function") onOrderCompleted();
    let msg = "Hola Harold, acabo de hacer un pedido en la plataforma Segaso Chorizos:\n\n";
    msg += "\u{1F4E6} *Pedido:* " + orderId + "\n";
    msg += "\u{1F464} *Cliente:* " + name + "\n";
    msg += "\u{1F4F1} *Tel\xE9fono:* " + phone + "\n";
    msg += "\u{1F4CD} *Direcci\xF3n:* " + address + " (" + city + ")\n";
    msg += "\u{1F4B3} *Pago:* " + payment + "\n\n";
    msg += "*Detalle de Chorizos:*\n";
    orderItems.forEach((it) => {
      const prod = PRODUCTS.find((p) => p.id === it.id);
      msg += "\u2022 " + it.qty + "x " + prod.name + " = " + (it.price * it.qty).toFixed(1) + "k COP\n";
    });
    if (state.appliedDiscountPct > 0) {
      msg += "\n*Subtotal:* " + total.toFixed(1) + "k COP\n";
      msg += "\u{1F3F7}\uFE0F *Descuento Especial (" + state.appliedDiscountPct + "% OFF):* -" + discount.toFixed(1) + "k COP (Promoci\xF3n Web/WhatsApp)\n";
      msg += "*TOTAL A PAGAR CON DESCUENTO:* " + finalTotal.toFixed(1) + "k COP\n\n";
    } else {
      msg += "\n*TOTAL A PAGAR:* " + total.toFixed(1) + "k COP\n\n";
    }
    msg += "Por favor me confirmas el despacho. \xA1Muchas gracias!";
    const waUrl = "https://wa.me/573002367180?text=" + encodeURIComponent(msg);
    showToast("\xA1Pedido " + orderId + " creado con \xE9xito!");
    setTimeout(() => {
      if (confirm("\xA1Pedido " + orderId + " registrado!\n\nTotal: " + finalTotal.toFixed(1) + "k COP\n\n\xBFDeseas abrir WhatsApp para enviar la confirmaci\xF3n inmediata a Harold?")) {
        window.open(waUrl, "_blank");
      }
    }, 300);
  }

  // assets/js/modules/catering_courses.js
  function contactBarrilPlan(planName) {
    const msg = `Hola Harold, me interesa cotizar el servicio de Asado al Barril Segaso: Plan ${planName}. \xBFQu\xE9 fechas tienen disponibles?`;
    window.open(`https://wa.me/573002367180?text=${encodeURIComponent(msg)}`, "_blank");
  }
  function joinCourseWaitlist() {
    const nameEl = document.getElementById("courseName");
    const phoneEl = document.getElementById("coursePhone");
    if (!nameEl || !phoneEl) return;
    const name = nameEl.value.trim();
    const phone = phoneEl.value.trim();
    if (!name || !phone) {
      alert("Por favor ingresa tu nombre y n\xFAmero de celular.");
      return;
    }
    state.waitlistLeads.unshift({
      date: (/* @__PURE__ */ new Date()).toLocaleDateString("es-CO"),
      name,
      phone,
      interest: "Taller Charcuter\xEDa (Lista de Espera)"
    });
    saveLeads();
    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, type: "Taller Charcuter\xEDa" })
    }).catch(() => console.log("Modo offline: lead guardado"));
    nameEl.value = "";
    phoneEl.value = "";
    showToast("\xA1Inscrito en la lista de espera! Te contactaremos pronto.");
  }

  // assets/js/modules/admin_nav.js
  function checkAdminRoute() {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path.includes("admin") || hash.includes("admin")) {
      if (sessionStorage.getItem("segaso_admin_auth") === "true") {
        switchMode("admin");
      } else {
        promptAdminPin();
      }
    }
  }
  function promptAdminPin() {
    window.location.href = "/chorizos-segaso/admin";
  }
  function closeAdminPinModal() {
    if (window.location.hash.includes("admin")) {
      history.replaceState(null, null, " ");
    }
  }
  function verifyAdminPin() {
    closeAdminPinModal();
    window.location.href = "/chorizos-segaso/admin";
  }
  function exitAdminMode() {
    sessionStorage.removeItem("segaso_admin_auth");
    switchMode("client");
    if (window.location.pathname.includes("admin")) {
      window.location.href = "/";
    } else {
      history.replaceState(null, null, " ");
    }
  }
  function goHome() {
    switchMode("client");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function switchMode(mode, onModeChanged) {
    state.currentMode = mode;
    const clientView = document.getElementById("clientView");
    const adminView = document.getElementById("adminView");
    const clientNavLinks = document.getElementById("clientNavLinks");
    const clientCartBtn = document.getElementById("clientCartBtn");
    if (mode === "admin") {
      window.location.href = "/chorizos-segaso/admin";
    } else {
      if (adminView) adminView.classList.remove("active");
      if (clientView) clientView.classList.add("active");
      if (clientNavLinks) clientNavLinks.style.display = "flex";
      if (clientCartBtn) clientCartBtn.style.display = "flex";
      if (typeof onModeChanged === "function") onModeChanged();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // assets/app.js
  Object.assign(window, {
    PRODUCTS,
    PRODUCT_PHOTOS,
    LIGHTBOX_PLACEHOLDER,
    state,
    renderProducts: (cat) => renderProducts(cat || state.currentCategoryFilter),
    filterCatalog,
    updateCartItemQty: (id, delta) => updateCartItemQty(id, delta, () => renderProducts(state.currentCategoryFilter)),
    updateCartBadge,
    openCart,
    closeCart,
    removeCartItem: (id) => removeCartItem(id, () => renderProducts(state.currentCategoryFilter)),
    applyPromoCode,
    submitCustomerOrder: () => submitCustomerOrder(() => renderProducts(state.currentCategoryFilter)),
    contactBarrilPlan,
    joinCourseWaitlist,
    openProductDetail,
    openLightbox,
    closeLightbox,
    playTikTokVideo,
    closeTikTokModal,
    setModalOpen,
    openBotModal,
    closeBotModal,
    handleBotQuery,
    toggleFaq,
    showToast,
    toggleMobileNav,
    closeMobileNav,
    checkAdminRoute,
    promptAdminPin,
    closeAdminPinModal,
    verifyAdminPin,
    exitAdminMode,
    goHome,
    switchMode: (m) => switchMode(m, () => renderProducts(state.currentCategoryFilter))
  });
  document.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches && e.target.matches('[role="button"][onclick]')) {
      e.preventDefault();
      e.target.click();
      return;
    }
    if (e.key === "Escape") {
      closeLightbox();
      closeTikTokModal();
      closeCart();
      closeBotModal();
      closeMobileNav();
      return;
    }
    if (e.key !== "Tab") return;
    const modal = document.querySelector(".modal-center.open, .drawer-overlay.open");
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
  document.querySelectorAll(".modal-center, .drawer-overlay").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target !== modal) return;
      if (modal.id === "cartDrawer") closeCart();
      else if (modal.id === "botModal") closeBotModal();
      else if (modal.id === "imageLightboxModal") closeLightbox();
      else if (modal.id === "tiktokPlayerModal") closeTikTokModal();
    });
  });
  var mobileNavBackdrop = document.getElementById("mobileNavBackdrop");
  if (mobileNavBackdrop) mobileNavBackdrop.addEventListener("click", closeMobileNav);
  document.addEventListener("click", (e) => {
    const nav = document.getElementById("mobileNav");
    const btn = document.getElementById("hamburgerBtn");
    if (nav && nav.classList.contains("open") && !nav.contains(e.target) && e.target !== btn) {
      closeMobileNav();
    }
  });
  function bootstrap() {
    initData();
    loadCart();
    updateCartBadge();
    checkAdminRoute();
    renderProducts("all");
    syncInventoryFromServer(() => renderProducts(state.currentCategoryFilter));
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
  } else {
    bootstrap();
  }
})();
