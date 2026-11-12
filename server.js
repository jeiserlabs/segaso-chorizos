// server.js — Servidor HTTP Seguro Segaso Chorizos (Modular Facade SRP < 70L)
const http = require('node:http');
const { handleApiRequest } = require('./src/server/api_routes');
const { handleStaticRequest } = require('./src/server/static_handler');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const server = http.createServer(async (req, res) => {
  const [pathname] = req.url.split('?');
  const method = req.method.toUpperCase();

  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    "img-src 'self' data:",
    "media-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "script-src 'self' 'unsafe-inline'",
    "connect-src 'self'",
    "frame-src https://www.tiktok.com",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join('; '));

  if (pathname.startsWith('/api/')) {
    return handleApiRequest(req, res, pathname, method);
  }

  return handleStaticRequest(req, res, pathname, PUBLIC_DIR);
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
