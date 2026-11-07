// scripts/prepare_videos.js — Prepara y comprime los 4 videos de TikTok de Segaso para distribución offline
const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const SOURCE_DIR = 'C:/PROYECTOS/Mis_Proyectos/Asistente_Personal/projects/segaso-app/media/social/tiktok/videos';
const OUT_DIR = path.resolve(__dirname, '../videos');

const VIDEOS = [
  { num: 1, id: '7690072472544283924', crf: 31, aac: '48k' },
  { num: 2, id: '7678100505100356884', crf: 31, aac: '48k' },
  { num: 3, id: '7674733063032540437', crf: 32, aac: '48k' },
  { num: 4, id: '7671306377410678036', crf: 34, aac: '40k' }
];

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

console.log('--- Comprimiendo y optimizando videos para Segaso Offline ---');
let totalBytes = 0;

for (const v of VIDEOS) {
  const src = path.join(SOURCE_DIR, `${v.id}.mp4`);
  const dest = path.join(OUT_DIR, `video_${v.num}.mp4`);

  if (!fs.existsSync(src)) {
    console.error(`Error: No existe el video origen ${src}`);
    continue;
  }

  const srcSize = (fs.statSync(src).size / 1024 / 1024).toFixed(2);
  console.log(`Video ${v.num} (${v.id}): Origen ${srcSize} MB`);

  // Compresión con H.264 CRF + AAC stereo, compatible con todos los navegadores
  const cmd = `ffmpeg -y -i "${src}" -vf "scale=w=480:h=854:force_original_aspect_ratio=decrease,pad=480:854:(ow-iw)/2:(oh-ih)/2" -c:v libx264 -crf ${v.crf} -preset fast -c:a aac -b:a ${v.aac} -movflags +faststart "${dest}"`;
  execSync(cmd, { stdio: 'ignore' });

  const destSize = fs.statSync(dest).size;
  totalBytes += destSize;
  console.log(`  -> video_${v.num}.mp4 generado: ${(destSize / 1024 / 1024).toFixed(2)} MB`);
}

console.log(`\nPeso total de los 4 videos optimizados: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
