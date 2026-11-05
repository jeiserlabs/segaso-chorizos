// assets/js/modules/catalog.js — Catálogo maestro de productos Segaso (SRP < 60L)
export const PRODUCTS = [
  { id: 'caserito', name: 'Chorizo Caserito Paisa', price: 19.9, category: 'tradicional', icon: '🥓', tag: '⭐ Más Vendido', desc: 'El sabor tradicional de la casa. Carne seleccionada y sazón paisa suave para el desayuno o la arepa.' },
  { id: 'antioqueno', name: 'Chorizo Antioqueño', price: 23.6, category: 'tradicional', icon: '🇳🇬', tag: 'Tradicional', desc: 'Sabor auténtico antioqueño con picado fino, ahumado natural y el balance perfecto de grasa natural.' },
  { id: 'santarrosano', name: 'Chorizo Santarrosano', price: 23.8, category: 'tradicional', icon: '🇨🇴', tag: 'Tradicional', desc: 'Inspirado en la receta típica de Santa Rosa de Cabal. Trozos jugosos y especias de montaña.' },
  { id: 'tocineta', name: 'Chorizo con Tocineta', price: 23.8, category: 'especial', icon: '🥓', tag: 'Especial', desc: 'Fusión irresistible de cerdo seleccionado con crujiente tocineta ahumada. Explosión de sabor a la parrilla.' },
  { id: 'parrillero', name: 'Chorizo Parrillero al Ajo', price: 23.8, category: 'especial', icon: '🍴', tag: 'Parrillero', desc: 'Toque gourmet de ajo macerado y pimienta suave. Ideal para asados de fin de semana con amigos.' },
  { id: 'picante', name: 'Chorizo Picante Artesanal', price: 24.2, category: 'especial', icon: '🌶️', tag: 'Especial', desc: 'Intensidad media con ají casero y páprika. Pica lo justo sin opacar la calidad de la carne.' },
  { id: 'argentino', name: 'Chorizo Estilo Argentino', price: 24.6, category: 'especial', icon: '🇦🇷', tag: 'Parrillero', desc: 'Picado grueso, vino tinto y nuez moscada. Especial para choripán con abundante chimichurri.' },
  { id: 'morcilla', name: 'Morcilla Paisa Tradicional', price: 15.0, category: 'complemento', icon: '🥩', tag: 'Tradicional', desc: 'Arroz esponjoso, especias de huerta y sangre fresca seleccionada. Crujiente por fuera y suave por dentro.' },
  { id: 'chimichurri', name: 'Chimichurri Especial de la Casa', price: 14.5, category: 'complemento', icon: '🌿', tag: 'Acompañamiento', desc: 'Frasco artesanal con perejil fresco, ajo, aceite de oliva virgen y orégano. El maridaje perfecto.' }
];

export const LIGHTBOX_PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221%22 height=%221%22/%3E';

export const PRODUCT_PHOTOS = {
  caserito: 'img/products/caserito.webp',
  antioqueno: 'img/products/antioqueno.webp',
  santarrosano: 'img/products/santarrosano.webp',
  tocineta: 'img/products/tocineta.webp',
  parrillero: 'img/products/parrillero.webp',
  picante: 'img/products/picante.webp',
  argentino: 'img/products/argentino.webp',
  morcilla: 'img/products/morcilla.webp',
  chimichurri: 'img/products/chimichurri.webp'
};

export function getCardActionHtml(p, isOutOfStock, currentQty) {
  if (isOutOfStock) {
    return '<span class="badge badge-danger">Sin Stock</span>';
  }
  if (currentQty === 0) {
    return '<button class="add-to-cart-btn" onclick="updateCartItemQty(\'' + p.id + '\', 1)">➕ Pedir</button>';
  }
  return '<div class="qty-selector" style="background: rgba(166,24,40,0.2); border: 1px solid var(--primary); border-radius: 8px; padding: 2px 6px;">' +
    '<button class="qty-btn" onclick="updateCartItemQty(\'' + p.id + '\', -1)" title="Quitar 1">-</button>' +
    '<span class="qty-val" style="min-width: 22px; text-align: center; font-weight: 800; color: #fff;">' + currentQty + '</span>' +
    '<button class="qty-btn" onclick="updateCartItemQty(\'' + p.id + '\', 1)" title="Sumar 1">+</button>' +
  '</div>';
}
