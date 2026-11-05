// src/server/api_routes.js — Enrutador de Endpoints Públicos y Protegidos (SRP < 200L)
const { verifyPassword, hashPassword, signJWT, verifyJWT, extractBearerToken } = require('../../auth');
const db = require('../../db');
const { ErrorDeValidacion, normalizarLead, normalizarPedido } = require('../domain/pedido.validation.ts');
const { isRateLimited, recordFailedLogin, clearLoginAttempts, isPublicRateLimited } = require('./rate_limiter');

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1e6) {
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

async function handleApiRequest(req, res, pathname, method) {
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
      return sendJson(res, 200, { success: true, token, user: { email: user.email, role: user.role } });
    }

    // GET /api/auth/me
    if (pathname === '/api/auth/me' && method === 'GET') {
      const user = requireAuth(req, res);
      if (!user) return;
      return sendJson(res, 200, { success: true, user });
    }

    // POST /api/orders (Creación pública de pedido)
    if (pathname === '/api/orders' && method === 'POST') {
      const ip = req.socket.remoteAddress || 'unknown';
      if (isPublicRateLimited('orders', ip, 10, 60 * 1000)) {
        return sendJson(res, 429, { success: false, error: 'Demasiados pedidos en poco tiempo. Intenta de nuevo en un minuto.' });
      }
      const body = await readJsonBody(req);
      const pedido = normalizarPedido(body, db.getInventory());
      const code = db.generarCodigoPedido();

      try {
        db.crearPedidoAtomico({
          code,
          customer_name: pedido.customer_name,
          customer_phone: pedido.customer_phone,
          address: pedido.address,
          neighborhood: pedido.neighborhood,
          items_json: JSON.stringify(pedido.items),
          subtotal_cop: pedido.subtotal_cop,
          discount_cop: pedido.discount_cop,
          total_cop: pedido.total_cop,
          payment_method: pedido.payment_method,
        }, pedido.items);
      } catch (err) {
        if (err && err.code === 'STOCK_INSUFICIENTE') {
          return sendJson(res, 409, { success: false, error: `Se acabó el stock de ${err.producto}. Vuelve a armar el pedido.` });
        }
        throw err;
      }

      return sendJson(res, 201, {
        success: true, code,
        subtotal_cop: pedido.subtotal_cop,
        discount_cop: pedido.discount_cop,
        total_cop: pedido.total_cop,
      });
    }

    // POST /api/leads
    if (pathname === '/api/leads' && method === 'POST') {
      const ip = req.socket.remoteAddress || 'unknown';
      if (isPublicRateLimited('leads', ip, 5, 60 * 1000)) {
        return sendJson(res, 429, { success: false, error: 'Demasiados registros en poco tiempo. Intenta de nuevo en un minuto.' });
      }
      const body = await readJsonBody(req);
      db.createLead(normalizarLead(body));
      return sendJson(res, 201, { success: true, message: 'Interesado registrado' });
    }

    // GET /api/inventory (Público)
    if (pathname === '/api/inventory' && method === 'GET') {
      return sendJson(res, 200, { success: true, inventory: db.getPublicInventory() });
    }

    // Endpoints protegidos de Back Office
    if (pathname.startsWith('/api/admin/')) {
      const authUser = requireAuth(req, res);
      if (!authUser) return;
      if (authUser.role !== 'admin') {
        return sendJson(res, 403, { success: false, error: 'Token sin privilegios de administración.' });
      }

      if (pathname === '/api/admin/password' && method === 'POST') {
        const cuerpo = await readJsonBody(req);
        const actual = typeof cuerpo.actual === 'string' ? cuerpo.actual : '';
        const nueva = typeof cuerpo.nueva === 'string' ? cuerpo.nueva : '';
        if (nueva.length < 10) {
          return sendJson(res, 400, { success: false, error: 'La nueva contraseña debe tener al menos 10 caracteres.' });
        }
        const usuario = db.getUserByEmail(authUser.email);
        if (!usuario || !verifyPassword(actual, usuario.password_hash)) {
          return sendJson(res, 403, { success: false, error: 'La contraseña actual no es correcta.' });
        }
        db.setPasswordHash(usuario.email, hashPassword(nueva));
        return sendJson(res, 200, { success: true, message: 'Contraseña actualizada.' });
      }

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
        const { validarTransicionEstado } = await import('../domain/pedido.fsm.ts');
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
        const stockValue = Number(stock);
        if (!Number.isInteger(stockValue) || stockValue < 0) {
          return sendJson(res, 400, { success: false, error: 'El stock debe ser un entero mayor o igual a 0' });
        }
        db.updateStock(code, stockValue);
        return sendJson(res, 200, { success: true, code, stock: stockValue });
      }

      if (pathname === '/api/admin/leads' && method === 'GET') {
        return sendJson(res, 200, { success: true, leads: db.getLeads() });
      }
    }

    return sendJson(res, 404, { success: false, error: 'Endpoint no encontrado' });
  } catch (apiErr) {
    if (apiErr instanceof ErrorDeValidacion) {
      return sendJson(res, apiErr.statusCode, { success: false, error: apiErr.message });
    }
    if (apiErr instanceof SyntaxError) {
      return sendJson(res, 400, { success: false, error: 'JSON inválido en el cuerpo de la solicitud' });
    }
    console.error('Error en API:', apiErr);
    return sendJson(res, 500, { success: false, error: 'Error interno del servidor' });
  }
}

module.exports = { handleApiRequest, readJsonBody, sendJson };
