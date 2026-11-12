// assets/js/modules/media_modal.js — Lightbox Gourmet y Reproductor TikTok (SRP < 140L)
import { PRODUCTS, PRODUCT_PHOTOS, LIGHTBOX_PLACEHOLDER } from './catalog.js';
import { state } from './state.js';
import { showToast } from './bot_ui.js';

const TIKTOK_VIDEOS_MAP = {
  '7690072472544283924': { num: 1, title: 'Cevichito de chicharrón en asados al barril' },
  '7678100505100356884': { num: 2, title: 'Información para restaurantes y negocios' },
  '7674733063032540437': { num: 3, title: 'Receta de domingo con chorizos Segaso' },
  '7671306377410678036': { num: 4, title: 'Harold y Giseth: Historia de Segaso Chorizos' }
};

// Reproductor oficial de TikTok: el video lo sirve TikTok desde la cuenta de Segaso.
const TIKTOK_PLAYER = 'https://www.tiktok.com/player/v1/';
const TIKTOK_PLAYER_QUERY = '?autoplay=1&muted=1&loop=0&rel=0&music_info=0&description=0';

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
      Tu navegador no soporta reproducción de video HTML5.
    </video>`;
}

export function setModalOpen(modal, isOpen) {
  if (!modal) return;
  const wasOpen = modal.classList.contains('open');
  modal.classList.toggle('open', isOpen);
  modal.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
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

export function openProductDetail(productId) {
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

  const stock = state.inventory[p.id] !== undefined ? state.inventory[p.id] : 0;
  if (stock <= 0) {
    btnContainer.innerHTML = `<button class="btn-primary" disabled style="opacity: 0.5; cursor: not-allowed;">Agotado</button>`;
  } else {
    btnContainer.innerHTML = `<button class="btn-primary" onclick="updateCartItemQty('${p.id}', 1); closeLightbox(); showToast('¡${p.name} agregado al carrito!');">🛒 Agregar al Carrito</button>`;
  }

  setModalOpen(modal, true);
}

export function openLightbox(imgSrc, titleText, descText) {
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

export function closeLightbox() {
  const modal = document.getElementById('imageLightboxModal');
  setModalOpen(modal, false);
  const img = document.getElementById('lightboxImg');
  if (img) {
    img.src = LIGHTBOX_PLACEHOLDER;
    img.alt = '';
  }
}

export function playTikTokVideo(videoId, title) {
  const modal = document.getElementById('tiktokPlayerModal');
  const titleEl = document.getElementById('tiktokModalTitle');
  const container = document.getElementById('tiktokEmbedContainer');
  const directLink = document.getElementById('tiktokDirectLink');

  const info = TIKTOK_VIDEOS_MAP[videoId] || { num: 1, title };
  titleEl.textContent = title || info.title;
  directLink.href = `https://www.tiktok.com/@segaso.chorizos/video/${videoId}`;

  // Cadena de 3 capas: si está en local/offline usa MP4; en GitHub Pages/Web incrusta directo el player oficial de TikTok.
  const isLocalEnv = typeof window !== 'undefined' && (
    window.location.protocol === 'file:' ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  );

  if (isLocalEnv) {
    container.innerHTML = localVideoMarkup(info);
    const source = container.querySelector('source');
    if (source) {
      source.addEventListener('error', () => {
        container.innerHTML = tiktokEmbedMarkup(videoId);
        const frame = container.querySelector('iframe');
        if (frame) {
          frame.addEventListener('error', () => {
            container.innerHTML = tiktokLinkFallbackMarkup(videoId);
          }, { once: true });
        }
      }, { once: true });
    }
  } else {
    // En despliegue público (GitHub Pages): embeber directo el reproductor oficial de TikTok ($0 almacenamiento)
    container.innerHTML = tiktokEmbedMarkup(videoId);
    const frame = container.querySelector('iframe');
    if (frame) {
      frame.addEventListener('error', () => {
        container.innerHTML = tiktokLinkFallbackMarkup(videoId);
      }, { once: true });
    }
  }

  setModalOpen(modal, true);
}

export function closeTikTokModal() {
  const modal = document.getElementById('tiktokPlayerModal');
  setModalOpen(modal, false);
  const video = document.getElementById('activeTikTokPlayer');
  if (video) {
    video.pause();
    video.currentTime = 0;
  }
  const container = document.getElementById('tiktokEmbedContainer');
  if (container) container.innerHTML = '<div style="color: var(--cream-muted); font-size: 13px;">Cargando video de TikTok...</div>';
}
