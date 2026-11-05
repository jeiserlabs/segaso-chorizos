// assets/js/modules/admin_nav.js — Ruteo Administrativo y Navegación Principal (SRP < 70L)
import { state } from './state.js';

export function checkAdminRoute() {
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

export function promptAdminPin() {
  window.location.href = '/chorizos-segaso/admin';
}

export function closeAdminPinModal() {
  if (window.location.hash.includes('admin')) {
    history.replaceState(null, null, ' ');
  }
}

export function verifyAdminPin() {
  closeAdminPinModal();
  window.location.href = '/chorizos-segaso/admin';
}

export function exitAdminMode() {
  sessionStorage.removeItem('segaso_admin_auth');
  switchMode('client');
  if (window.location.pathname.includes('admin')) {
    window.location.href = '/';
  } else {
    history.replaceState(null, null, ' ');
  }
}

export function goHome() {
  switchMode('client');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function switchMode(mode, onModeChanged) {
  state.currentMode = mode;
  const clientView = document.getElementById('clientView');
  const adminView = document.getElementById('adminView');
  const clientNavLinks = document.getElementById('clientNavLinks');
  const clientCartBtn = document.getElementById('clientCartBtn');

  if (mode === 'admin') {
    window.location.href = '/chorizos-segaso/admin';
  } else {
    if (adminView) adminView.classList.remove('active');
    if (clientView) clientView.classList.add('active');
    if (clientNavLinks) clientNavLinks.style.display = 'flex';
    if (clientCartBtn) clientCartBtn.style.display = 'flex';
    if (typeof onModeChanged === 'function') onModeChanged();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
