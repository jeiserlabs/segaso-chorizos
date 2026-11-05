// src/server/static_handler.js — Despachador de Archivos Estáticos y SPA (SRP < 95L)
const fs = require('node:fs');
const path = require('node:path');

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
  'index.html', 'admin.html', 'logo_segaso.svg',
  'favicon.svg', 'favicon.ico', 'robots.txt',
  'sitemap.xml', 'manifest.webmanifest'
]);
const PUBLIC_DIRS = ['assets/', 'img/', 'media/', 'videos/'];

function handleStaticRequest(req, res, pathname, publicDir) {
  let requestedPath;
  try {
    requestedPath = decodeURIComponent(pathname);
  } catch (_) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
    return res.end('Ruta inválida');
  }

  let safePath = path.normalize(requestedPath);
  if (
    safePath === '/chorizos-segaso/admin' || safePath === '\\chorizos-segaso\\admin' ||
    safePath === '/admin' || safePath === '\\admin'
  ) {
    safePath = '/admin.html';
  } else if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const relativeSafePath = safePath.replace(/^[\\/]+/, '');
  const normalizedRelative = relativeSafePath.split(path.sep).join('/');
  const fullPath = path.resolve(publicDir, relativeSafePath);
  const relativePath = path.relative(publicDir, fullPath);
  const isInsidePublic = relativePath && !relativePath.startsWith('..') && !path.isAbsolute(relativePath);
  const hasHiddenSegment = normalizedRelative.split('/').some(segment => segment.startsWith('.'));
  const ext = path.extname(fullPath).toLowerCase();
  const isPublicStatic = isInsidePublic && !hasHiddenSegment &&
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
      const cacheControl = NO_CACHE_EXTENSIONS.has(ext) ? 'no-cache' : 'public, max-age=86400';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': stats.size,
        'Last-Modified': stats.mtime.toUTCString(),
        'Cache-Control': cacheControl
      });
      if (req.method === 'HEAD') return res.end();
      fs.createReadStream(fullPath)
        .on('error', () => { if (!res.headersSent) res.writeHead(500); res.end(); })
        .pipe(res);
      return;
    }

    if (isAssetRequest) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
      return res.end('Archivo no encontrado');
    }

    const fallbackPath = path.join(publicDir, 'index.html');
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
      if (req.method === 'HEAD') return res.end();
      res.end(data);
    });
  });
}

module.exports = { handleStaticRequest };
