// scripts/bundle_assets.js — Empaqueta JS modular y CSS modular en bundles unificados compatibles con file:/// y web
const path = require('node:path');
const fs = require('node:fs');

let esbuild;
try {
  esbuild = require('esbuild');
} catch (_) {
  console.error('Falta esbuild (dependencia de build). Ejecuta: npm install');
  process.exit(1);
}

const ROOT = path.resolve(__dirname, '..');

console.log('Compilando assets de Segaso...');

// 1. Bundle JS
esbuild.buildSync({
  entryPoints: [path.join(ROOT, 'assets/app.js')],
  bundle: true,
  outfile: path.join(ROOT, 'assets/app.bundle.js'),
  format: 'iife',
  target: 'es2020',
  sourcemap: false
});
console.log('✓ JS bundle generado: assets/app.bundle.js');

// 2. Bundle CSS
esbuild.buildSync({
  entryPoints: [path.join(ROOT, 'assets/styles.css')],
  bundle: true,
  outfile: path.join(ROOT, 'assets/styles.bundle.css'),
  sourcemap: false
});
console.log('✓ CSS bundle generado: assets/styles.bundle.css');
