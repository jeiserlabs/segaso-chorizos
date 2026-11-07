// scripts/build_offline_zip.js — Genera el paquete ZIP autónomo y completo para Angelina
const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT, 'dist_offline_angelina');
const ZIP_PATH = path.join(ROOT, 'Segaso_Web_Offline_Angelina.zip');

console.log('=== Generando Paquete Offline de Segaso para Angelina ===\n');

// 1. Asegurar bundles actualizados
console.log('1. Compilando bundles...');
require('./bundle_assets.js');

// 2. Limpiar carpeta temporal de empaque
if (fs.existsSync(DIST_DIR)) {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
}
fs.mkdirSync(DIST_DIR, { recursive: true });

// 3. Función auxiliar de copia
function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
      copyRecursive(path.join(src, item), path.join(dest, item));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

// 4. Copiar archivos web fundamentales
console.log('2. Copiando archivos web...');
copyRecursive(path.join(ROOT, 'index.html'), path.join(DIST_DIR, 'index.html'));
copyRecursive(path.join(ROOT, 'logo_segaso.svg'), path.join(DIST_DIR, 'logo_segaso.svg'));

// Bundles
copyRecursive(path.join(ROOT, 'assets/styles.bundle.css'), path.join(DIST_DIR, 'assets/styles.bundle.css'));
copyRecursive(path.join(ROOT, 'assets/app.bundle.js'), path.join(DIST_DIR, 'assets/app.bundle.js'));

// Imágenes
console.log('3. Copiando imágenes...');
copyRecursive(path.join(ROOT, 'img'), path.join(DIST_DIR, 'img'));
copyRecursive(path.join(ROOT, 'assets/img'), path.join(DIST_DIR, 'assets/img'));

// Videos
console.log('4. Copiando videos de TikTok...');
if (fs.existsSync(path.join(ROOT, 'videos'))) {
  copyRecursive(path.join(ROOT, 'videos'), path.join(DIST_DIR, 'videos'));
} else {
  console.warn('Advertencia: No existe la carpeta videos/. Ejecuta scripts/prepare_videos.js primero.');
}

// 5. Crear lanzador y manual amigable para Angelina
const leeme = `=====================================================
SEGASO CHORIZOS — VITRINA DIGITAL AUTÓNOMA (OFFLINE)
=====================================================

¡Hola, Angelina!

Este paquete contiene la página web completa de Segaso Chorizos de Tradición con todos sus recursos integrados para que puedas abrirla directamente en tu computador sin depender de internet ni de servidores externos.

¿CÓMO ABRIR LA PÁGINA?
-----------------------
Opción 1 (Recomendada):
   Haz doble clic sobre el archivo "ABRIR_SEGASO.bat".
   Se abrirá automáticamente en tu navegador predeterminado (Chrome, Edge, Firefox, etc.).

Opción 2:
   Haz doble clic directamente sobre el archivo "index.html".

¿QUÉ INCLUYE ESTE PAQUETE?
---------------------------
✓ Las 9 referencias oficiales de chorizos con fotos reales en alta calidad.
✓ Catálogo interactivo con precios actualizados y etiquetas.
✓ Carrito de compras con cálculo del 10% de descuento automático de bienvenida.
✓ Galería fotográfica de asados al barril y maestros parrilleros.
✓ Los 4 videos oficiales de TikTok (@segaso.chorizos) listos para reproducir al hacer clic.
✓ Asesor virtual con preguntas frecuentes y respuestas inmediatas.
✓ Enlaces directos a WhatsApp para pedidos a domicilio.

¡Listo para revisar y disfrutar!
`;
fs.writeFileSync(path.join(DIST_DIR, 'LEEME_ANGELINA.txt'), leeme, 'utf8');

const launcher = `@echo off
title Segaso Chorizos de Tradicion
echo Abriendo Segaso Chorizos en tu navegador...
start "" "index.html"
exit
`;
fs.writeFileSync(path.join(DIST_DIR, 'ABRIR_SEGASO.bat'), launcher, 'utf8');

// 6. Comprimir en archivo ZIP usando PowerShell
console.log('\n5. Comprimiendo en archivo ZIP...');
if (fs.existsSync(ZIP_PATH)) {
  fs.unlinkSync(ZIP_PATH);
}

const psCmd = `powershell -Command "Compress-Archive -Path '${DIST_DIR}\\*' -DestinationPath '${ZIP_PATH}' -Force"`;
execSync(psCmd);

const zipBytes = fs.statSync(ZIP_PATH).size;
const zipMB = (zipBytes / 1024 / 1024).toFixed(2);

console.log(`\n=====================================================`);
console.log(`✓ Archivo ZIP generado exitosamente:`);
console.log(`  Ruta: ${ZIP_PATH}`);
console.log(`  Peso total: ${zipMB} MB (Apto para envío por correo < 25 MB)`);
console.log(`=====================================================\n`);

// Limpiar carpeta temporal dist
fs.rmSync(DIST_DIR, { recursive: true, force: true });
