// server.js — Servidor HTTP seguro con Autenticación JWT y SQLite para Segaso Chorizos
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { verifyPassword, signJWT, verifyJWT, extractBearerToken } = require('./auth');
const db = require('./db');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm'
};

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

  // -------------------------------------------------------------
  // 1. ENDPOINTS DE API (Autenticación & Datos)
  // -------------------------------------------------------------
  if (pathname.startsWith('/api/')) {
    try {
      // POST /api/auth/login
      if (pathname === '/api/auth/login' && method === 'POST') {
        const { email, password } = await readJsonBody(req);
        if (!email || !password) {
          return sendJson(res, 400, { success: false, error: 'Correo y contraseña requeridos' });
        }
        const user = db.getUserByEmail(email.toLowerCase().trim());
        if (!user || !verifyPassword(password, user.password_hash)) {
          return sendJson(res, 401, { success: false, error: 'Credenciales inválidas. Verifica tu correo o contraseña.' });
        }
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
        const code = `SEG-${Date.now().toString().slice(-4)}`;
        db.createOrder({
          code,
          customer_name: body.customer_name || 'Cliente Segaso',
          customer_phone: body.customer_phone || '',
          address: body.address || 'Recoge en sede',
          neighborhood: body.neighborhood || 'Envigado',
          items_json: JSON.stringify(body.items || []),
          total_cop: Number(body.total_cop) || 0
        });
        return sendJson(res, 201, { success: true, code });
      }

      // POST /api/leads (Captura de interesados para academia / cursos)
      if (pathname === '/api/leads' && method === 'POST') {
        const body = await readJsonBody(req);
        db.createLead(body);
        return sendJson(res, 201, { success: true, message: 'Interesado registrado' });
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
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');

  // Ruta secreta de administración para Harold: servir admin.html
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

  const fullPath = path.join(PUBLIC_DIR, safePath);

  fs.stat(fullPath, (err, stats) => {
    if (!err && stats.isFile()) {
      const ext = path.extname(fullPath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(fullPath).pipe(res);
      return;
    }

    // Fallback: Servir index.html para rutas del cliente
    const fallbackPath = path.join(PUBLIC_DIR, 'index.html');
    fs.readFile(fallbackPath, (fallbackErr, data) => {
      if (fallbackErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Error al cargar la plataforma Segaso Chorizos.');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Segaso Chorizos Server activo en http://localhost:${PORT}`);
  console.log(`🔒 Panel Back Office Harold: http://localhost:${PORT}/chorizos-segaso/admin`);
});

module.exports = server;
