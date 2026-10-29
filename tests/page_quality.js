function collectPageQuality(page, extra = {}) {
  return page.evaluate(() => {
    const q = (selector) => Array.from(document.querySelectorAll(selector));
    const text = (el) => (el.innerText || el.textContent || '').trim();
    const nameOf = (el) =>
      (el.getAttribute('aria-label') || el.getAttribute('title') || text(el) || el.getAttribute('value') || '').trim();
    const hasLabel = (el) => {
      if (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby')) return true;
      if (el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`)) return true;
      return Boolean(el.closest('label'));
    };

    const images = q('img');
    const visibleImages = images.filter((img) => img.getClientRects().length > 0);
    const brokenImages = visibleImages
      .filter((img) => img.hasAttribute('src') && img.complete && img.naturalWidth === 0)
      .map((img) => ({ src: img.currentSrc || img.getAttribute('src'), alt: img.alt || '' }));
    const imagesNoAlt = visibleImages.filter((img) => !img.hasAttribute('alt') || !img.getAttribute('alt').trim()).length;
    const emptySrc = images.filter((img) => img.hasAttribute('src') && !img.getAttribute('src').trim()).length;

    const fields = q('input, select, textarea');
    const fieldsNoLabel = fields.filter((el) => !hasLabel(el)).length;

    const clickable = q('[onclick]').filter(
      (el) => !['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName)
    );
    const clickableNoRole = clickable.filter(
      (el) => el.getAttribute('role') !== 'button' || el.getAttribute('tabindex') === null
    ).map((el) => ({ tag: el.tagName, cls: el.className || '', text: text(el).slice(0, 50) }));

    const smallTapTargets = q('button, a[href]')
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44);
      })
      .map((el) => ({ text: text(el).slice(0, 40), w: Math.round(el.getBoundingClientRect().width), h: Math.round(el.getBoundingClientRect().height) }));

    const galleryImages = q('.tiktok-photo-card img').map((img) => {
      const rect = img.getBoundingClientRect();
      return { w: Math.round(rect.width), h: Math.round(rect.height), ratio: rect.width && rect.height ? Number((rect.width / rect.height).toFixed(2)) : 0 };
    });
    const badGalleryAspect = galleryImages.filter((item) => item.w > 0 && (item.ratio < 0.7 || item.ratio > 0.9));
    const nestedInteractive = q('[role="button"] a[href], [role="button"] button, [role="button"] input, [role="button"] select, [role="button"] textarea').length;

    const resources = performance.getEntriesByType('resource');
    const totalTransfer = resources.reduce((sum, item) => sum + (item.transferSize || 0), 0);
    const ids = q('[id]').map((el) => el.id);
    const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];

    let jsonLd = null;
    try {
      const node = document.querySelector('script[type="application/ld+json"]');
      if (node) {
        const data = JSON.parse(node.textContent);
        jsonLd = {
          type: data['@type'] || null,
          offers: data.hasOfferCatalog?.itemListElement?.length || 0
        };
      }
    } catch (_) {
      jsonLd = { type: 'invalid', offers: 0 };
    }

    const headings = q('h1, h2, h3, h4');
    return {
      title: document.title,
      lang: document.documentElement.lang || null,
      metaDescription: document.querySelector('meta[name="description"]')?.content || null,
      canonical: document.querySelector('link[rel="canonical"]')?.href || null,
      ogTitle: document.querySelector('meta[property="og:title"]')?.content || null,
      ogImage: document.querySelector('meta[property="og:image"]')?.content || null,
      favicon: document.querySelector('link[rel="icon"]')?.href || null,
      h1Count: headings.filter((h) => h.tagName === 'H1').length,
      brokenImages,
      imagesNoAlt,
      emptySrc,
      fieldsNoLabel,
      clickableNoRole,
      smallTapTargets,
      galleryImages,
      badGalleryAspect,
      nestedInteractive,
      duplicateIds,
      dialogs: q('[role="dialog"][aria-modal="true"]').length,
      landmarks: {
        header: q('header').length,
        main: q('main').length,
        footer: q('footer').length,
        nav: q('nav').length
      },
      jsonLd,
      totalTransfer,
      horizontalOverflow: document.documentElement.scrollWidth - window.innerWidth
    };
  }).then((metrics) => ({
    ...metrics,
    consoleErrors: extra.consoleErrors || [],
    pageErrors: extra.pageErrors || [],
    badResponses: extra.badResponses || [],
    failedRequests: extra.failedRequests || []
  }));
}

function assertPageQuality(metrics, options = {}) {
  const maxTransferBytes = options.maxTransferBytes || 3 * 1024 * 1024;
  const failures = [];
  if (!metrics.title.includes('Segaso')) failures.push(`Título inesperado: ${metrics.title}`);
  if (metrics.lang !== 'es') failures.push(`Idioma inesperado: ${metrics.lang}`);
  if (metrics.h1Count !== 1) failures.push(`H1 debe ser 1, hay ${metrics.h1Count}`);
  if (!metrics.metaDescription) failures.push('Falta meta description');
  if (!metrics.canonical) failures.push('Falta canonical');
  if (!metrics.ogTitle || !metrics.ogImage) failures.push('Faltan Open Graph title/image');
  if (!metrics.favicon) failures.push('Falta favicon');
  if (metrics.brokenImages.length) failures.push(`Imágenes rotas: ${JSON.stringify(metrics.brokenImages)}`);
  if (metrics.imagesNoAlt) failures.push(`Imágenes sin alt: ${metrics.imagesNoAlt}`);
  if (metrics.emptySrc) failures.push(`Imágenes con src vacío: ${metrics.emptySrc}`);
  if (metrics.fieldsNoLabel) failures.push(`Campos sin etiqueta: ${metrics.fieldsNoLabel}`);
  if (metrics.clickableNoRole.length) failures.push(`Clickeables sin role/teclado: ${JSON.stringify(metrics.clickableNoRole)}`);
  if (metrics.smallTapTargets.length) failures.push(`Objetivos táctiles <44px: ${JSON.stringify(metrics.smallTapTargets)}`);
  if (metrics.galleryImages.length !== 5) failures.push(`Galería TikTok incompleta: ${metrics.galleryImages.length}/5`);
  if (metrics.badGalleryAspect.length) failures.push(`Galería con aspect ratio roto: ${JSON.stringify(metrics.badGalleryAspect)}`);
  if (metrics.nestedInteractive > 0) failures.push(`Controles interactivos anidados: ${metrics.nestedInteractive}`);
  if (metrics.duplicateIds.length) failures.push(`IDs duplicados: ${metrics.duplicateIds.join(', ')}`);
  if (metrics.dialogs < 4) failures.push(`Diálogos accesibles insuficientes: ${metrics.dialogs}`);
  if (metrics.landmarks.main < 1 || metrics.landmarks.header < 1 || metrics.landmarks.footer < 1) failures.push('Faltan landmarks');
  if (!metrics.jsonLd || metrics.jsonLd.offers !== 9) failures.push('JSON-LD inválido o sin las 9 ofertas');
  if (metrics.horizontalOverflow > 0) failures.push(`Desbordamiento horizontal: ${metrics.horizontalOverflow}px`);
  if (metrics.totalTransfer > maxTransferBytes) failures.push(`Peso excedido: ${(metrics.totalTransfer / 1048576).toFixed(2)} MB`);
  if (metrics.consoleErrors.length) failures.push(`Errores de consola: ${JSON.stringify(metrics.consoleErrors)}`);
  if (metrics.pageErrors.length) failures.push(`Errores de página: ${JSON.stringify(metrics.pageErrors)}`);
  if (metrics.badResponses.length) failures.push(`Respuestas >=400: ${JSON.stringify(metrics.badResponses)}`);
  if (metrics.failedRequests.length) failures.push(`Peticiones fallidas: ${JSON.stringify(metrics.failedRequests)}`);
  if (failures.length) {
    throw new Error(`Gate de calidad falló:\n- ${failures.join('\n- ')}`);
  }
  return true;
}

async function checkHttpSurface(request, baseUrl) {
  const checks = [
    ['/', 200],
    ['/img/no-existe.jpg', 404],
    ['/assets/no-existe.css', 404],
    ['/.env', 404],
    ['/server.js', 404],
    ['/segaso.db', 404],
    ['/ruta-cliente', 200],
    ['/chorizos-segaso/admin', 200]
  ];
  const failures = [];
  for (const [route, expected] of checks) {
    const response = await request.get(`${baseUrl}${route}`);
    if (response.status() !== expected) {
      failures.push(`${route}: esperado ${expected}, recibido ${response.status()}`);
    }
  }
  if (failures.length) throw new Error(`Superficie HTTP falló:\n- ${failures.join('\n- ')}`);
  return true;
}

module.exports = { collectPageQuality, assertPageQuality, checkHttpSurface };
