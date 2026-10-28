/**
 * Segaso Chorizos S.A.S. — Máquina de Estados Finitos (FSM) de Pedidos
 * @author Jeiser Abraham Gutiérrez (Tech Lead & QA Architect)
 * @version 1.0.0 (Zero-Any / Domain-Driven)
 * 
 * Regla de Oro: Un pedido sigue un flujo determinista de producción y despacho.
 * Queda prohibido saltar de 'pendiente' a 'entregado' sin pasar por 'preparando' y 'camino'.
 */

import type { EstadoPedido, ItemPedido } from '../types/segaso.types.ts';

const TRANSICIONES_VALIDAS: Readonly<Record<EstadoPedido, readonly EstadoPedido[]>> = {
  pendiente: ['confirmado', 'cancelado'],
  confirmado: ['preparando', 'cancelado'],
  preparando: ['camino', 'cancelado'],
  camino: ['entregado', 'cancelado'],
  entregado: [], // Estado terminal inmutable
  cancelado: [], // Estado terminal inmutable
};

/**
 * Valida si una transición de estado es legal.
 */
export function validarTransicionEstado(
  estadoActual: EstadoPedido,
  nuevoEstado: EstadoPedido
): { readonly valida: boolean; readonly error?: string } {
  if (estadoActual === nuevoEstado) {
    return { valida: true };
  }

  const destinosPermitidos = TRANSICIONES_VALIDAS[estadoActual] ?? [];

  if (!destinosPermitidos.includes(nuevoEstado)) {
    return {
      valida: false,
      error: `Transición inválida: no se puede pasar un pedido de '${estadoActual}' a '${nuevoEstado}'. Transiciones válidas: [${destinosPermitidos.join(', ') || 'ninguna (estado terminal)'}].`,
    };
  }

  return { valida: true };
}

/**
 * Calcula el subtotal por ítem y el total consolidado del pedido.
 */
export function calcularTotalPedido(items: readonly Omit<ItemPedido, 'subtotal_cop'>[]): {
  readonly itemsNormalizados: readonly ItemPedido[];
  readonly totalCop: number;
} {
  if (items.length === 0) {
    throw new Error('El pedido no puede estar vacío');
  }

  let total = 0;
  const itemsNormalizados: ItemPedido[] = [];

  for (const it of items) {
    if (it.qty <= 0) {
      throw new Error(`Cantidad inválida para el producto ${it.id}: debe ser mayor a 0`);
    }
    if (it.price_cop <= 0) {
      throw new Error(`Precio inválido para el producto ${it.id}: debe ser positivo`);
    }

    const subtotal = it.qty * it.price_cop;
    total += subtotal;

    itemsNormalizados.push({
      ...it,
      subtotal_cop: subtotal,
    });
  }

  return {
    itemsNormalizados,
    totalCop: total,
  };
}

/**
 * Genera un código único de pedido human-readable (ej: SEG-1004).
 */
export function generarCodigoPedido(secuencia: number): string {
  const numeroFormateado = String(Math.max(1001, secuencia)).padStart(4, '0');
  return `SEG-${numeroFormateado}`;
}
