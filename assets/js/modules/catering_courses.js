// assets/js/modules/catering_courses.js — Planes de Catering y Talleres (SRP < 60L)
import { state, saveLeads } from './state.js';
import { showToast } from './bot_ui.js';

export function contactBarrilPlan(planName) {
  const msg = `Hola Harold, me interesa cotizar el servicio de Asado al Barril Segaso: Plan ${planName}. ¿Qué fechas tienen disponibles?`;
  window.open(`https://wa.me/573002367180?text=${encodeURIComponent(msg)}`, '_blank');
}

export function joinCourseWaitlist() {
  const nameEl = document.getElementById('courseName');
  const phoneEl = document.getElementById('coursePhone');
  if (!nameEl || !phoneEl) return;

  const name = nameEl.value.trim();
  const phone = phoneEl.value.trim();
  if (!name || !phone) {
    alert('Por favor ingresa tu nombre y número de celular.');
    return;
  }

  state.waitlistLeads.unshift({
    date: new Date().toLocaleDateString('es-CO'),
    name: name,
    phone: phone,
    interest: 'Taller Charcutería (Lista de Espera)'
  });
  saveLeads();

  fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, phone, type: 'Taller Charcutería' })
  }).catch(() => console.log('Modo offline: lead guardado'));

  nameEl.value = '';
  phoneEl.value = '';
  showToast('¡Inscrito en la lista de espera! Te contactaremos pronto.');
}
