// assets/js/modules/bot_ui.js — Asesor Virtual, Notificaciones Toast y Navegación Móvil (SRP < 110L)
import { setModalOpen } from './media_modal.js';

export function openBotModal() { setModalOpen(document.getElementById('botModal'), true); }
export function closeBotModal() { setModalOpen(document.getElementById('botModal'), false); }

export function handleBotQuery(type) {
  const chat = document.getElementById('botChatMessages');
  if (!chat) return;
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

export function toggleFaq(el) {
  const isOpen = el.parentElement.classList.toggle('open');
  el.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

export function showToast(msg) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
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

export function toggleMobileNav() {
  const nav = document.getElementById('mobileNav');
  const btn = document.getElementById('hamburgerBtn');
  const backdrop = document.getElementById('mobileNavBackdrop');
  if (!nav || !btn) return;
  const isOpen = nav.classList.toggle('open');
  btn.textContent = isOpen ? '✕' : '☰';
  btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  btn.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  if (backdrop) backdrop.classList.toggle('open', isOpen);
  document.body.classList.toggle('menu-open', isOpen);
}

export function closeMobileNav() {
  const nav = document.getElementById('mobileNav');
  const btn = document.getElementById('hamburgerBtn');
  const backdrop = document.getElementById('mobileNavBackdrop');
  if (!nav || !btn) return;
  nav.classList.remove('open');
  btn.textContent = '☰';
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-label', 'Abrir menú');
  if (backdrop) backdrop.classList.remove('open');
  document.body.classList.remove('menu-open');
}
