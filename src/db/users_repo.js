// src/db/users_repo.js — Repositorio de Usuarios y Leads (SRP < 45L)
const { db } = require('./connection');

function getUserByEmail(email) {
  return db.prepare('SELECT * FROM admin_users WHERE email = ?').get(email);
}

function setPasswordHash(email, hash) {
  return db.prepare(
    'UPDATE admin_users SET password_hash = ? WHERE email = ?'
  ).run(hash, email).changes === 1;
}

function getLeads() {
  return db.prepare('SELECT * FROM leads ORDER BY id DESC').all();
}

function createLead(lead) {
  return db.prepare('INSERT INTO leads (name, phone, type) VALUES (?, ?, ?)')
    .run(lead.name, lead.phone, lead.type || 'curso');
}

module.exports = {
  getUserByEmail,
  setPasswordHash,
  getLeads,
  createLead
};
