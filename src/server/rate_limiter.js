// src/server/rate_limiter.js — Rate Limiting en Memoria por IP (SRP < 55L)
const loginAttempts = new Map(); // ip -> { count, blockedUntil }
const MAX_ATTEMPTS = 5;
const BLOCK_MS = 5 * 60 * 1000; // 5 minutos

function isRateLimited(ip) {
  const entry = loginAttempts.get(ip);
  if (!entry) return false;
  if (entry.blockedUntil && Date.now() < entry.blockedUntil) return true;
  if (entry.blockedUntil && Date.now() >= entry.blockedUntil) {
    loginAttempts.delete(ip);
    return false;
  }
  return false;
}

function recordFailedLogin(ip) {
  const entry = loginAttempts.get(ip) || { count: 0, blockedUntil: null };
  entry.count += 1;
  if (entry.count >= MAX_ATTEMPTS) {
    entry.blockedUntil = Date.now() + BLOCK_MS;
    console.warn(`[SECURITY] IP ${ip} bloqueada por ${MAX_ATTEMPTS} intentos fallidos de login.`);
  }
  loginAttempts.set(ip, entry);
}

function clearLoginAttempts(ip) {
  loginAttempts.delete(ip);
}

const publicHits = new Map(); // `${scope}:${ip}` -> { count, resetAt }

function isPublicRateLimited(scope, ip, max, windowMs) {
  const key = `${scope}:${ip}`;
  const now = Date.now();
  const entry = publicHits.get(key);
  if (!entry || now >= entry.resetAt) {
    publicHits.set(key, { count: 1, resetAt: now + windowMs });
    if (publicHits.size > 500) {
      for (const [k, v] of publicHits) if (now >= v.resetAt) publicHits.delete(k);
    }
    return false;
  }
  entry.count += 1;
  return entry.count > max;
}

module.exports = {
  isRateLimited,
  recordFailedLogin,
  clearLoginAttempts,
  isPublicRateLimited
};
