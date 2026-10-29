const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT, 'img', 'products');

const PHOTOS = {
  caserito: { source: 'media/social/tiktok/keyframes/7537739708575599928_01.jpg', crop: '576:576:0:100' },
  antioqueno: { source: 'media/social/tiktok/keyframes/7080148934731058437_02.jpg', crop: '576:576:0:280' },
  santarrosano: { source: 'videos/tiktok_fotos/photo_03.jpg', crop: '760:760:160:230' },
  tocineta: { source: 'media/social/tiktok/keyframes/7332557830999919877_03.jpg', crop: '576:576:0:0' },
  parrillero: { source: 'media/social/tiktok/keyframes/7080148934731058437_01.jpg', crop: '576:576:0:100' },
  picante: { source: 'videos/tiktok_fotos/photo_05.jpg', crop: '800:800:140:250' },
  argentino: { source: 'media/social/tiktok/keyframes/7128213952567315718_02.jpg', crop: '576:576:0:220' },
  morcilla: { source: 'media/social/tiktok/keyframes/7216504522657746181_06.jpg', crop: '720:720:0:500' },
  chimichurri: { source: 'media/social/tiktok/keyframes/7470531437788155141_01.jpg', crop: '576:576:0:300' }
};

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

for (const [id, { source, crop }] of Object.entries(PHOTOS)) {
  const sourcePath = path.join(ROOT, source);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Falta la fuente real de ${id}: ${source}`);
  }
  const outputPath = path.join(OUTPUT_DIR, `${id}.webp`);
  execFileSync('ffmpeg', [
    '-y', '-v', 'error',
    '-i', sourcePath,
    '-vf', `crop=${crop},scale=900:900:flags=lanczos`,
    '-c:v', 'libwebp',
    '-quality', '82',
    '-compression_level', '6',
    '-an',
    outputPath
  ], { stdio: 'inherit' });
  const thumbPath = path.join(OUTPUT_DIR, `${id}-480.webp`);
  execFileSync('ffmpeg', [
    '-y', '-v', 'error',
    '-i', outputPath,
    '-vf', 'scale=480:480:flags=lanczos',
    '-c:v', 'libwebp',
    '-quality', '80',
    '-compression_level', '6',
    '-an',
    thumbPath
  ], { stdio: 'inherit' });
  console.log(`✓ ${id}.webp + ${id}-480.webp`);
}
