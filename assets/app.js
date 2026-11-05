// assets/app.js — Orquestador Principal Segaso (Modular Facade SRP < 115L)
import { PRODUCTS, PRODUCT_PHOTOS, LIGHTBOX_PLACEHOLDER } from './js/modules/catalog.js';
import { state, initData, loadCart, syncInventoryFromServer } from './js/modules/state.js';
import { renderProducts, filterCatalog } from './js/modules/renderer.js';
import { updateCartItemQty, updateCartBadge, openCart, closeCart, removeCartItem, applyPromoCode } from './js/modules/cart.js';
import { submitCustomerOrder } from './js/modules/checkout.js';
import { contactBarrilPlan, joinCourseWaitlist } from './js/modules/catering_courses.js';
import { openProductDetail, openLightbox, closeLightbox, playTikTokVideo, closeTikTokModal, setModalOpen } from './js/modules/media_modal.js';
import { openBotModal, closeBotModal, handleBotQuery, toggleFaq, showToast, toggleMobileNav, closeMobileNav } from './js/modules/bot_ui.js';
import { checkAdminRoute, promptAdminPin, closeAdminPinModal, verifyAdminPin, exitAdminMode, goHome, switchMode } from './js/modules/admin_nav.js';

// Exposición en window para retrocompatibilidad con atributos inline en el DOM (onclick)
Object.assign(window, {
  PRODUCTS, PRODUCT_PHOTOS, LIGHTBOX_PLACEHOLDER, state,
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

// Event Listeners Globales: Teclado y Cierre de Modales
document.addEventListener('keydown', (e) => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('[role="button"][onclick]')) {
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

const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');
if (mobileNavBackdrop) mobileNavBackdrop.addEventListener('click', closeMobileNav);

document.addEventListener('click', (e) => {
  const nav = document.getElementById('mobileNav');
  const btn = document.getElementById('hamburgerBtn');
  if (nav && nav.classList.contains('open') && !nav.contains(e.target) && e.target !== btn) {
    closeMobileNav();
  }
});

// Inicialización de Ciclo de Vida
function bootstrap() {
  initData();
  loadCart();
  updateCartBadge();
  checkAdminRoute();
  renderProducts('all');
  syncInventoryFromServer(() => renderProducts(state.currentCategoryFilter));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
  bootstrap();
}
