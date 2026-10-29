/**
 * Construye el manifiesto de la biblioteca social local y los inventarios de docs/social.
 * Requiere que los videos ya estén descargados en media/social/<plataforma>/videos.
 * Uso: node scripts/social_manifest.js
 */

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const APP_ROOT = path.resolve(__dirname, '..');
const MEDIA = path.join(APP_ROOT, 'media', 'social');
const DOCS = path.join(APP_ROOT, 'docs', 'social');
const MANIFEST = path.join(MEDIA, 'manifest.json');

const EXTERNAL = {
  instagram: [
    {
      id: 'DMItIfmx4SH',
      url: 'https://www.instagram.com/reel/DMItIfmx4SH/',
      account: '@segaso.chorizos',
      title: 'Receta con chorizo, queso y guacamole',
      description: 'Receta fácil con chorizo artesanal, queso y guacamole.',
    },
    {
      id: 'DMdG2I3Riac',
      url: 'https://www.instagram.com/reel/DMdG2I3Riac/',
      account: '@segaso.chorizos',
      title: 'Asado, chimichurri y chicharrón',
      description: 'Asados, chorizo, chimichurri y chicharrón.',
    },
  ],
  facebook: [
    {
      id: '1274562314615791',
      url: 'https://www.facebook.com/Segasochorizos/videos/1274562314615791/',
      account: 'Segaso Chorizos',
      title: 'Segaso Chorizos on Reels',
      description: 'Reel público de la página de Facebook.',
    },
    {
      id: '900034726486567',
      url: 'https://www.facebook.com/Segasochorizos/videos/900034726486567/',
      account: 'Segaso Chorizos',
      title: 'Esta receta es deliciosa, pero con Segaso es otro nivel',
      description: 'Receta con chorizo, queso y guacamole.',
    },
  ],
};

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function duration(file) {
  try {
    const value = execFileSync(
      'ffprobe',
      ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file],
      { encoding: 'utf8' },
    ).trim();
    return Number.isFinite(Number(value)) ? Number(Number(value).toFixed(1)) : null;
  } catch {
    return null;
  }
}

function listFiles(dir, extension) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(extension))
    .sort();
}

function keyframesFor(platform, id) {
  const dir = path.join(MEDIA, platform, 'keyframes');
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.startsWith(`${id}_`) && name.endsWith('.jpg'))
    .sort()
    .map((name) => `${platform}/keyframes/${name}`);
}

function md(value, max = 90) {
  return String(value || '')
    .replace(/\|/g, '\\|')
    .replace(/\s+/g, ' ')
    .slice(0, max);
}

function displayMetric(asset) {
  if (asset.views !== null && asset.views !== undefined) return `${asset.views} views`;
  if (asset.likes !== null && asset.likes !== undefined) return `${asset.likes} likes`;
  return '-';
}

function buildTikTok(profile) {
  const entries = Array.isArray(profile.entries) ? profile.entries : [];
  const byId = new Map(entries.map((entry) => [String(entry.id), entry]));
  const videos = listFiles(path.join(MEDIA, 'tiktok', 'videos'), '.mp4');

  return videos.map((name) => {
    const id = name.replace(/\.mp4$/, '');
    const entry = byId.get(id) || {};
    return {
      id,
      platform: 'tiktok',
      account: '@segaso.chorizos',
      type: 'video',
      sourceUrl: `https://www.tiktok.com/@segaso.chorizos/video/${id}`,
      title: entry.title || '(sin título)',
      durationSeconds: entry.duration ? Number(entry.duration) : duration(path.join(MEDIA, 'tiktok', 'videos', name)),
      views: entry.view_count ?? null,
      likes: null,
      file: `tiktok/videos/${name}`,
      keyframes: keyframesFor('tiktok', id),
      rights: 'Contenido oficial de Segaso Chorizos; uso autorizado para su promoción.',
    };
  });
}

function buildExternal(platform) {
  const videos = listFiles(path.join(MEDIA, platform, 'videos'), '.mp4');
  const byId = new Map(EXTERNAL[platform].map((source) => [source.id, source]));

  return videos.map((name) => {
    const id = name.replace(/\.mp4$/, '');
    const source = byId.get(id) || {};
    return {
      id,
      platform,
      account: source.account || '',
      type: 'video',
      sourceUrl: source.url || '',
      title: source.title || '(sin título)',
      description: source.description || '',
      durationSeconds: duration(path.join(MEDIA, platform, 'videos', name)),
      views: null,
      likes: null,
      file: `${platform}/videos/${name}`,
      keyframes: keyframesFor(platform, id),
      rights: 'Contenido oficial de Segaso Chorizos; uso autorizado para su promoción.',
    };
  });
}

function writeManifest(assets) {
  const manifest = {
    generatedAt: new Date().toISOString(),
    localOnly: true,
    note: 'Los binarios viven en media/ (gitignored). GitHub solo recibe el manifiesto y la documentación.',
    accounts: {
      tiktok: {
        handle: '@segaso.chorizos',
        followers: 29200,
        likes: 189500,
        videos: 150,
        access: 'Perfil público; inventario completo de 150 videos.',
      },
      instagramMain: {
        handle: '@chorizos.segaso',
        followers: 173,
        posts: 15,
        access: 'Cuenta principal. El listado de perfil devolvió HTTP 429; los reels públicos se descargaron individualmente.',
      },
      instagramAlternate: {
        handle: '@segaso.chorizos',
        access: 'Cuenta alterna. Reels públicos accesibles individualmente; listado de perfil bloqueado por rate limit.',
      },
      facebook: {
        page: 'Segaso Chorizos',
        followers: 124,
        access: 'La página y su listado de medios exigen login; los videos públicos individuales se descargaron por URL directa.',
      },
    },
    counts: assets.reduce((acc, asset) => {
      acc[asset.platform] = (acc[asset.platform] || 0) + 1;
      return acc;
    }, {}),
    assets,
  };

  fs.writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  return manifest;
}

function writeMediaDocs(assets) {
  fs.mkdirSync(DOCS, { recursive: true });

  const rows = assets
    .map(
      (asset, index) =>
        `| ${index + 1} | ${asset.platform} | \`${asset.id}\` | ${md(asset.title)} | ${
          asset.durationSeconds ?? '-'
        } s | ${displayMetric(asset)} | \`${asset.file}\` | ${asset.keyframes.length} |`,
    )
    .join('\n');

  const mediaDoc = `# Biblioteca audiovisual — Segaso Chorizos

> **Generado:** ${new Date().toISOString().slice(0, 10)}.
> **Ubicación local:** \`media/social/\` (gitignored). GitHub solo recibe este documento y el manifiesto.
> **Uso:** contenido oficial de la empresa para el video promocional y el material de sustentación.

## Cuentas auditadas

| Plataforma | Cuenta | Audiencia | Acceso |
|---|---|---:|---|
| TikTok | @segaso.chorizos | 29.2K seguidores · 189.5K me gusta · 150 videos | Público; inventario completo |
| Instagram principal | @chorizos.segaso | 173 seguidores · 15 posts | Listado con HTTP 429; reels públicos individuales |
| Instagram alterna | @segaso.chorizos | No visible por rate limit | Reels públicos individuales |
| Facebook | Segaso Chorizos | 124 seguidores | Página con login; videos públicos individuales |

## Assets descargados

| # | Plataforma | ID | Título | Duración | Métrica | Archivo local | Keyframes |
|---:|---|---|---|---:|---|---|---:|
${rows}

## Criterio de selección

- Videos con producto, fuego, parrilla, empaque, producción o asado real.
- Se evitó usar primeros planos de menores de edad para el corte final.
- Se priorizaron piezas con el producto visible y buena iluminación.
- El material de Instagram y Facebook se usa como refuerzo; TikTok es la fuente principal.

## Limitaciones de acceso

- Instagram devolvió HTTP 429 al listar los perfiles; no se forzó una sesión ni se usaron cookies personales.
- Facebook exige login para listar la página; solo se bajaron videos públicos con URL directa.
- Si se necesita el archivo completo de Instagram/Facebook, se debe exportar desde Meta Business Suite o autorizar una sesión dedicada.

## Derechos

Contenido publicado por las cuentas oficiales de Segaso Chorizos. El uso está limitado a la promoción de la empresa y al proyecto académico. No se revende ni se atribuye a terceros.
`;

  fs.writeFileSync(path.join(DOCS, 'MEDIA_MANIFEST.md'), mediaDoc, 'utf8');

  const profile = readJson(path.join(MEDIA, 'tiktok', 'profile.json'), { entries: [] });
  const entries = Array.isArray(profile.entries) ? profile.entries : [];
  const top = [...entries]
    .sort((a, b) => (Number(b.view_count) || 0) - (Number(a.view_count) || 0))
    .slice(0, 40);
  const newest = entries.slice(0, 20);
  const seen = new Set(top.map((entry) => String(entry.id)));
  const rowsInventory = [...top, ...newest.filter((entry) => !seen.has(String(entry.id)))]
    .map(
      (entry) =>
        `| \`${entry.id}\` | ${md(entry.title || '(sin título)', 80)} | ${entry.duration ?? '-'} s | ${
          entry.view_count ?? '-'
        } | https://www.tiktok.com/@segaso.chorizos/video/${entry.id} |`,
    )
    .join('\n');

  const inventoryDoc = `# Inventario TikTok — @segaso.chorizos

> **Total inventariado:** ${entries.length} videos.
> **Criterio:** top 40 por views + 20 más recientes (sin duplicados).
> El JSON completo está en \`media/social/tiktok/profile.json\` (local, gitignored).

| ID | Título | Duración | Views | URL |
|---|---|---|---:|---|
${rowsInventory}
`;

  fs.writeFileSync(path.join(DOCS, 'TIKTOK_INVENTORY.md'), inventoryDoc, 'utf8');
}

function main() {
  const profile = readJson(path.join(MEDIA, 'tiktok', 'profile.json'), { entries: [] });
  const assets = [
    ...buildTikTok(profile),
    ...buildExternal('instagram'),
    ...buildExternal('facebook'),
  ].sort((a, b) => a.platform.localeCompare(b.platform) || a.id.localeCompare(b.id));

  const manifest = writeManifest(assets);
  writeMediaDocs(assets);

  console.log(`Manifiesto: ${path.relative(APP_ROOT, MANIFEST)}`);
  console.log(`Assets: ${assets.length}`, manifest.counts);
  console.log(`Docs: ${path.relative(APP_ROOT, DOCS)}`);
}

main();
