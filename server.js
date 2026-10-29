// server.js — Servidor HTTP seguro con Autenticación JWT y SQLite para Segaso Chorizos
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { verifyPassword, signJWT, verifyJWT, extractBearerToken } = require('./auth');
const db = require('./db');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

// -------------------------------------------------------------
// RATE LIMITING — Login: 5 intentos / 5 min por IP
// -------------------------------------------------------------
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

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm'
};

const ASSET_EXTENSIONS = new Set(Object.keys(MIME_TYPES));
const NO_CACHE_EXTENSIONS = new Set(['.html', '.css', '.js', '.json']);
const PUBLIC_FILES = new Set([
  'index.html',
  'admin.html',
  'logo_segaso.svg',
  'favicon.svg',
  'favicon.ico',
  'robots.txt',
  'sitemap.xml',
  'manifest.webmanifest'
]);
const PUBLIC_DIRS = ['assets/', 'img/', 'media/', 'videos/'];

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1e6) { // 1MB max
        req.destroy();
        reject(new Error('Payload demasiado grande'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

function requireAuth(req, res) {
  const token = extractBearerToken(req);
  const payload = verifyJWT(token);
  if (!payload) {
    sendJson(res, 401, { success: false, error: 'No autorizado. Token JWT inválido o expirado.' });
    return null;
  }
  return payload;
}

const server = http.createServer(async (req, res) => {
  const [pathname, queryString] = req.url.split('?');
  const method = req.method.toUpperCase();

  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  // -------------------------------------------------------------
  // 1. ENDPOINTS DE API (Autenticación & Datos)
  // -------------------------------------------------------------
  if (pathname.startsWith('/api/')) {
    try {
      // POST /api/auth/login
      if (pathname === '/api/auth/login' && method === 'POST') {
        const ip = req.socket.remoteAddress || 'unknown';
        if (isRateLimited(ip)) {
          return sendJson(res, 429, { success: false, error: 'Demasiados intentos fallidos. Intenta de nuevo en 5 minutos.' });
        }
        const { email, password } = await readJsonBody(req);
        if (!email || !password) {
          return sendJson(res, 400, { success: false, error: 'Correo y contraseña requeridos' });
        }
        const user = db.getUserByEmail(email.toLowerCase().trim());
        if (!user || !verifyPassword(password, user.password_hash)) {
          recordFailedLogin(ip);
          return sendJson(res, 401, { success: false, error: 'Credenciales inválidas. Verifica tu correo o contraseña.' });
        }
        clearLoginAttempts(ip);
        const token = signJWT({ id: user.id, email: user.email, role: user.role });
        return sendJson(res, 200, {
          success: true,
          token,
          user: { email: user.email, role: user.role }
        });
      }

      // GET /api/auth/me (Verificar sesión)
      if (pathname === '/api/auth/me' && method === 'GET') {
        const user = requireAuth(req, res);
        if (!user) return;
        return sendJson(res, 200, { success: true, user });
      }

      // POST /api/orders (Creación pública de pedido desde el carrito)
      if (pathname === '/api/orders' && method === 'POST') {
        const body = await readJsonBody(req);

        // Normalizar items: resolver nombre y precio_cop desde inventario real
        const invAll = db.getInventory();
        const invMap = Object.fromEntries(invAll.map(p => [p.code, p]));

        const normalizedItems = (body.items || []).map(it => {
          const product = invMap[it.id] || {};
          return {
            id:        it.id,
            name:      product.name || it.id,
            qty:       Number(it.qty) || 1,
            price_cop: product.price_cop || Math.round((Number(it.price) || 0) * 1000),
          };
        }).filter(it => it.id && it.qty > 0);

        const code = `SEG-${Date.now().toString().slice(-6)}`;

        // Guardar pedido con formato normalizado y método de pago
        db.createOrder({
          code,
          customer_name:   body.customer_name  || 'Cliente Segaso',
          customer_phone:  body.customer_phone || '',
          address:         body.address        || 'Recoge en sede',
          neighborhood:    body.neighborhood   || 'Envigado',
          items_json:      JSON.stringify(normalizedItems),
          total_cop:       Number(body.total_cop) || 0,
          payment_method:  body.payment_method || 'no especificado',
        });

        // Descontar stock de SQLite por cada ítem del pedido
        for (const item of normalizedItems) {
          db.decrementStock(item.id, item.qty);
        }

        return sendJson(res, 201, { success: true, code });
      }

      // POST /api/leads (Captura de interesados para academia / cursos)
      if (pathname === '/api/leads' && method === 'POST') {
        const body = await readJsonBody(req);
        db.createLead(body);
        return sendJson(res, 201, { success: true, message: 'Interesado registrado' });
      }

      // GET /api/inventory (PÚBLICO — solo code + stock, sin JWT ni datos sensibles)
      if (pathname === '/api/inventory' && method === 'GET') {
        return sendJson(res, 200, { success: true, inventory: db.getPublicInventory() });
      }

      // --- ENDPOINTS PROTEGIDOS CON JWT ---
      if (pathname.startsWith('/api/admin/')) {
        const authUser = requireAuth(req, res);
        if (!authUser) return; // Ya respondió 401

        if (pathname === '/api/admin/kpis' && method === 'GET') {
          return sendJson(res, 200, { success: true, kpis: db.getKPIs() });
        }

        if (pathname === '/api/admin/orders' && method === 'GET') {
          return sendJson(res, 200, { success: true, orders: db.getOrders() });
        }

        if (pathname.startsWith('/api/admin/orders/') && method === 'PATCH') {
          const id = pathname.split('/').pop();
          const { status } = await readJsonBody(req);
          const order = db.getOrders().find((item) => String(item.id) === String(id));
          if (!order) {
            return sendJson(res, 404, { success: false, error: 'Pedido no encontrado' });
          }
          const { validarTransicionEstado } = await import('./src/domain/pedido.fsm.ts');
          const check = validarTransicionEstado(order.status, status);
          if (!check.valida) {
            return sendJson(res, 400, { success: false, error: check.error });
          }
          db.updateOrderStatus(id, status);
          return sendJson(res, 200, { success: true, updated: id, status });
        }

        if (pathname === '/api/admin/inventory' && method === 'GET') {
          return sendJson(res, 200, { success: true, inventory: db.getInventory() });
        }

        if (pathname.startsWith('/api/admin/inventory/') && method === 'PATCH') {
          const code = pathname.split('/').pop();
          const { stock } = await readJsonBody(req);
          db.updateStock(code, Number(stock));
          return sendJson(res, 200, { success: true, code, stock });
        }

        if (pathname === '/api/admin/leads' && method === 'GET') {
          return sendJson(res, 200, { success: true, leads: db.getLeads() });
        }
      }

      return sendJson(res, 404, { success: false, error: 'Endpoint no encontrado' });
    } catch (apiErr) {
      console.error('Error en API:', apiErr);
      return sendJson(res, 500, { success: false, error: apiErr.message });
    }
  }

  // -------------------------------------------------------------
  // 2. ENRUTAMIENTO DE VISTAS Y ARCHIVOS ESTÁTICOS
  // -------------------------------------------------------------
  let requestedPath;
  try {
    requestedPath = decodeURIComponent(pathname);
  } catch (_) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
    return res.end('Ruta inválida');
  }

  let safePath = path.normalize(requestedPath);

  // Ruta de administración para Harold: servir admin.html
  if (
    safePath === '/chorizos-segaso/admin' ||
    safePath === '\\chorizos-segaso\\admin' ||
    safePath === '/admin' ||
    safePath === '\\admin'
  ) {
    safePath = '/admin.html';
  } else if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const relativeSafePath = safePath.replace(/^[\\/]+/, '');
  const normalizedRelative = relativeSafePath.split(path.sep).join('/');
  const fullPath = path.resolve(PUBLIC_DIR, relativeSafePath);
  const relativePath = path.relative(PUBLIC_DIR, fullPath);
  const isInsidePublic = relativePath && !relativePath.startsWith('..') && !path.isAbsolute(relativePath);
  const hasHiddenSegment = normalizedRelative.split('/').some(segment => segment.startsWith('.'));
  const ext = path.extname(fullPath).toLowerCase();
  const isPublicStatic =
    isInsidePublic &&
    !hasHiddenSegment &&
    (PUBLIC_FILES.has(normalizedRelative) || PUBLIC_DIRS.some(dir => normalizedRelative.startsWith(dir)));
  const isSpaRoute = isInsidePublic && !hasHiddenSegment && !ext;

  if (!isPublicStatic && !isSpaRoute) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
    return res.end('Recurso no encontrado');
  }

  const isAssetRequest = ASSET_EXTENSIONS.has(ext);

  fs.stat(fullPath, (err, stats) => {
    if (!err && stats.isFile()) {
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      const cacheControl = NO_CACHE_EXTENSIONS.has(ext)
        ? 'no-cache'
        : 'public, max-age=86400';
      const headers = {
        'Content-Type': contentType,
        'Content-Length': stats.size,
        'Last-Modified': stats.mtime.toUTCString(),
        'Cache-Control': cacheControl
      };
      res.writeHead(200, headers);
      if (method === 'HEAD') return res.end();
      fs.createReadStream(fullPath)
        .on('error', () => {
          if (!res.headersSent) res.writeHead(500);
          res.end();
        })
        .pipe(res);
      return;
    }

    // Un asset inexistente es 404 real: nunca devolver HTML con status 200.
    if (isAssetRequest) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
      return res.end('Archivo no encontrado');
    }

    // Fallback solo para rutas de vista sin extensión (SPA).
    const fallbackPath = path.join(PUBLIC_DIR, 'index.html');
    fs.readFile(fallbackPath, (fallbackErr, data) => {
      if (fallbackErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
        return res.end('Error al cargar la plataforma Segaso Chorizos.');
      }
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Length': data.length,
        'Cache-Control': 'no-cache'
      });
      if (method === 'HEAD') return res.end();
      res.end(data);
    });
  });
});

if (require.main === module) {
  server.listen(PORT, '0.0.0.0', () => {
    const address = server.address();
    const activePort = typeof address === 'object' && address ? address.port : PORT;
    console.log(`🚀 Segaso Chorizos Server activo en http://localhost:${activePort}`);
    console.log(`🔒 Panel Back Office Harold: http://localhost:${activePort}/chorizos-segaso/admin`);
  });
}

module.exports = server;
