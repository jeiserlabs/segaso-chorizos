/**
 * Descarga los assets públicos de TikTok de Segaso a videos/ (gitignored).
 * Las URLs del CDN expiran; este script re-consulta el embed público antes de bajar.
 * Uso: node scripts/fetch_tiktok_assets.js [--force]
 */

const fs = require('node:fs');
const path = require('node:path');

const APP_ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(APP_ROOT, 'videos');
const PHOTO_DIR = path.join(OUT_DIR, 'tiktok_fotos');
const MANIFEST = path.join(OUT_DIR, 'tiktok_manifest.json');
const FORCE = process.argv.includes('--force');
const VIDEOS_ONLY = process.argv.includes('--videos-only');

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36';
const REFERER = 'https://www.tiktok.com/';

const PHOTO_POST = {
  id: '7701116193192561938',
  url: 'https://www.tiktok.com/@segaso.chorizos/photo/7701116193192561938',
  captions: [
    'Lo que debes saber antes de llevarlo a tu mesa',
    'El color no demuestra la calidad',
    'Siempre empieza por los ingredientes',
    'Conoce también quién lo hace',
    'La confianza empieza con saber qué eliges',
  ],
};

const VIDEOS = [
  {
    num: 1,
    id: '7690072472544283924',
    pageTitle: 'Cevichito de chicharrón en asados al barril',
  },
  {
    num: 2,
    id: '7678100505100356884',
    pageTitle: 'Información para restaurantes y negocios',
  },
  {
    num: 3,
    id: '7674733063032540437',
    pageTitle: 'Receta de domingo con chorizos Segaso',
  },
  {
    num: 4,
    id: '7671306377410678036',
    pageTitle: 'Harold y Giseth: Historia de Segaso Chorizos',
  },
];

const errors = [];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function request(url, options, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fetch(url, options);
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await sleep(800 * attempt);
    }
  }
  throw lastError;
}

async function fetchText(url) {
  const res = await request(url, {
    headers: { 'User-Agent': UA, Referer: REFERER, Accept: 'text/html,application/xhtml+xml' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} al pedir ${url}`);
  return res.text();
}

function parseEmbed(html, marker) {
  const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const script = scripts.find((text) => text.includes(marker));
  if (!script) throw new Error(`No se encontró el JSON del embed (${marker})`);
  const start = script.indexOf('{');
  const json = script.slice(start).replace(/;\s*$/, '');
  return JSON.parse(json);
}

function findNode(node, predicate) {
  if (!node || typeof node !== 'object') return null;
  if (predicate(node)) return node;
  for (const value of Object.values(node)) {
    const found = findNode(value, predicate);
    if (found) return found;
  }
  return null;
}

async function download(url, dest) {
  if (!FORCE && fs.existsSync(dest) && fs.statSync(dest).size > 1024) {
    return { skipped: true, bytes: fs.statSync(dest).size };
  }
  const res = await request(url, {
    headers: { 'User-Agent': UA, Referer: REFERER, Accept: '*/*' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} al bajar ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.length < 1024) throw new Error(`Archivo demasiado pequeño (${buffer.length} bytes)`);
  const tmp = `${dest}.part`;
  fs.writeFileSync(tmp, buffer);
  fs.renameSync(tmp, dest);
  return { skipped: false, bytes: buffer.length };
}

function kb(bytes) {
  return `${(bytes / 1024).toFixed(0)} KB`;
}

function loadLocalPhotoFiles() {
  if (!fs.existsSync(PHOTO_DIR)) return [];
  return fs
    .readdirSync(PHOTO_DIR)
    .filter((name) => /^photo_\d+\.jpg$/.test(name))
    .sort()
    .map((name, index) => ({
      file: path.relative(OUT_DIR, path.join(PHOTO_DIR, name)).replace(/\\/g, '/'),
      caption: PHOTO_POST.captions[index] || '',
      bytes: fs.statSync(path.join(PHOTO_DIR, name)).size,
      skipped: true,
    }));
}

async function getPhotoPost() {
  console.log('TikTok: consultando post de fotos...');
  const html = await fetchText(`https://www.tiktok.com/embed/v2/${PHOTO_POST.id}`);
  const root = parseEmbed(html, 'imagePostInfo');
  const item = findNode(root, (node) => Boolean(node.imagePostInfo));
  if (!item) throw new Error('No se encontró imagePostInfo en el embed');

  const images = item.imagePostInfo.displayImages.map((image) => image.urlList[0]);
  const author = item.authorInfos || {};
  const stats = item.authorStats || {};
  const account = {
    handle: author.uniqueId || 'segaso.chorizos',
    nickname: author.nickName || 'SEGASO CHORIZOS',
    followers: stats.followerCount ?? null,
    hearts: stats.heartCount ? Number(stats.heartCount) : null,
    videos: stats.videoCount ?? null,
  };

  const files = [];
  for (let index = 0; index < images.length; index += 1) {
    const file = path.join(PHOTO_DIR, `photo_${String(index + 1).padStart(2, '0')}.jpg`);
    try {
      const result = await download(images[index], file);
      files.push({
        file: path.relative(OUT_DIR, file).replace(/\\/g, '/'),
        caption: PHOTO_POST.captions[index] || '',
        bytes: result.bytes,
        skipped: result.skipped,
      });
      console.log(`  foto ${index + 1}/${images.length}: ${kb(result.bytes)}${result.skipped ? ' (ya existía)' : ''}`);
    } catch (error) {
      errors.push({ kind: 'photo', index: index + 1, error: error.message });
      console.log(`  ERROR foto ${index + 1}: ${error.message}`);
      files.push({ file: null, caption: PHOTO_POST.captions[index] || '', error: error.message });
    }
  }

  return { account, files };
}

async function getVideo(video) {
  console.log(`TikTok: consultando video ${video.num}...`);
  const html = await fetchText(`https://www.tiktok.com/embed/v2/${video.id}`);
  const root = parseEmbed(html, 'itemInfos');
  const item = findNode(root, (node) => Boolean(node.video && node.text && node.id));
  if (!item) throw new Error(`No se encontró itemInfos para el video ${video.id}`);

  const cover = item.coversOrigin?.[0] || item.covers?.[0];
  const source = item.video?.urls?.[0];
  if (!cover) throw new Error(`Video ${video.id} sin cover`);

  const coverFile = path.join(OUT_DIR, `thumb_${video.num}.jpg`);
  const videoFile = path.join(OUT_DIR, `video_${video.num}.mp4`);
  const coverResult = await download(cover, coverFile);

  let videoResult = null;
  if (source) {
    try {
      videoResult = await download(source, videoFile);
    } catch (error) {
      errors.push({ kind: 'video-file', id: video.id, num: video.num, error: error.message });
      console.log(`  ERROR mp4 ${video.num}: ${error.message}`);
    }
  } else {
    errors.push({ kind: 'video-url', id: video.id, num: video.num, error: 'Sin URL de reproducción' });
  }

  console.log(
    `  video ${video.num}: cover ${kb(coverResult.bytes)}${videoResult ? `, mp4 ${kb(videoResult.bytes)}` : ', mp4 pendiente'}${
      videoResult?.skipped ? ' (ya existía)' : ''
    }`,
  );

  return {
    id: video.id,
    num: video.num,
    title: item.text.trim(),
    pageTitle: video.pageTitle,
    cover: path.relative(OUT_DIR, coverFile).replace(/\\/g, '/'),
    file: videoResult ? path.relative(OUT_DIR, videoFile).replace(/\\/g, '/') : null,
    durationSeconds: item.video?.videoMeta?.duration ?? null,
    stats: {
      plays: item.playCount ?? null,
      likes: item.diggCount ?? null,
      comments: item.commentCount ?? null,
    },
    bytes: { cover: coverResult.bytes, video: videoResult?.bytes ?? 0 },
    skipped: { cover: coverResult.skipped, video: videoResult?.skipped ?? null },
  };
}

async function main() {
  fs.mkdirSync(PHOTO_DIR, { recursive: true });

  const previous = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : null;

  let photo;
  if (VIDEOS_ONLY) {
    photo = {
      account:
        previous?.account || {
          handle: 'segaso.chorizos',
          nickname: 'SEGASO CHORIZOS',
          followers: 29200,
          hearts: 189500,
          videos: 150,
        },
      files: previous?.photoPost?.images?.length ? previous.photoPost.images : loadLocalPhotoFiles(),
    };
    console.log('Modo --videos-only: se conservan las fotos locales.');
  } else {
    photo = await getPhotoPost();
  }

  const videos = [];
  for (const video of VIDEOS) {
    const coverPath = path.join(OUT_DIR, `thumb_${video.num}.jpg`);
    const videoPath = path.join(OUT_DIR, `video_${video.num}.mp4`);

    if (!FORCE && fs.existsSync(coverPath) && fs.existsSync(videoPath)) {
      const previousEntry = previous?.videos?.find((item) => item.id === video.id);
      videos.push({
        id: video.id,
        num: video.num,
        pageTitle: video.pageTitle,
        title: previousEntry?.title || video.pageTitle,
        durationSeconds: previousEntry?.durationSeconds ?? null,
        stats: previousEntry?.stats || { plays: null, likes: null, comments: null },
        cover: path.relative(OUT_DIR, coverPath).replace(/\\/g, '/'),
        file: path.relative(OUT_DIR, videoPath).replace(/\\/g, '/'),
        bytes: { cover: fs.statSync(coverPath).size, video: fs.statSync(videoPath).size },
        skipped: { cover: true, video: true },
      });
      console.log(`  video ${video.num}: ya existe, se omite.`);
      continue;
    }

    try {
      videos.push(await getVideo(video));
    } catch (error) {
      errors.push({ kind: 'video', id: video.id, num: video.num, error: error.message });
      console.log(`  ERROR video ${video.num}: ${error.message}`);
      videos.push({
        id: video.id,
        num: video.num,
        pageTitle: video.pageTitle,
        cover: null,
        file: null,
        error: error.message,
      });
    }
    await sleep(2000);
  }

  const manifest = {
    fetchedAt: new Date().toISOString(),
    source: 'TikTok embed público',
    expirationNote: 'Las URLs del CDN expiran; volver a ejecutar este script para refrescarlas.',
    account: photo.account,
    photoPost: {
      id: PHOTO_POST.id,
      url: PHOTO_POST.url,
      images: photo.files,
    },
    videos,
    errors,
  };

  fs.writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(`Manifiesto: ${path.relative(APP_ROOT, MANIFEST)}`);
  console.log(
    `Listo: ${photo.files.filter((file) => file.file).length} fotos, ${
      videos.filter((video) => video.file).length
    } videos. Cuenta: ${photo.account.followers ?? '?'} seguidores, ${photo.account.hearts ?? '?'} me gusta, ${
      photo.account.videos ?? '?'
    } videos.`,
  );

  if (errors.length) {
    console.error(`Completado con ${errors.length} error(es).`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('ERROR:', error.message);
  process.exitCode = 1;
});
