const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

const GROUPS = [
  {
    dir: 'assets/img/gallery',
    width: 960,
    items: [
      ['videos/tiktok_fotos/photo_01.jpg', 'photo_01.webp'],
      ['videos/tiktok_fotos/photo_02.jpg', 'photo_02.webp'],
      ['videos/tiktok_fotos/photo_03.jpg', 'photo_03.webp'],
      ['videos/tiktok_fotos/photo_04.jpg', 'photo_04.webp'],
      ['videos/tiktok_fotos/photo_05.jpg', 'photo_05.webp']
    ]
  },
  {
    dir: 'assets/img/thumbs',
    width: 540,
    items: [
      ['videos/thumb_1.jpg', 'thumb_1.webp'],
      ['videos/thumb_2.jpg', 'thumb_2.webp'],
      ['videos/thumb_3.jpg', 'thumb_3.webp'],
      ['videos/thumb_4.jpg', 'thumb_4.webp']
    ]
  },
  {
    dir: 'assets/img/barrel',
    width: null,
    items: [
      ['media/social/tiktok/keyframes/7128213952567315718_01.jpg', 'asador.webp'],
      ['media/social/tiktok/keyframes/7470531437788155141_01.jpg', 'parrillero.webp'],
      ['media/social/tiktok/keyframes/7137390171976109317_02.jpg', 'banquete.webp']
    ]
  }
];

for (const group of GROUPS) {
  const outputDir = path.join(ROOT, group.dir);
  fs.mkdirSync(outputDir, { recursive: true });
  for (const [source, name] of group.items) {
    const sourcePath = path.join(ROOT, source);
    if (!fs.existsSync(sourcePath)) {
      throw new Error(`Falta la fuente real: ${source}`);
    }
    const outputPath = path.join(outputDir, name);
    const filter = group.width
      ? `scale=${group.width}:-2:flags=lanczos`
      : 'scale=iw:ih';
    execFileSync('ffmpeg', [
      '-y', '-v', 'error',
      '-i', sourcePath,
      '-vf', filter,
      '-c:v', 'libwebp',
      '-quality', '80',
      '-compression_level', '6',
      '-an',
      outputPath
    ], { stdio: 'inherit' });
    const size = Math.round(fs.statSync(outputPath).size / 1024);
    console.log(`✓ ${group.dir}/${name} (${size} KB)`);
  }
}
