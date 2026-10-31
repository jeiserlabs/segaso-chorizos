/**
 * Segaso Chorizos S.A.S. — Normalización y validación de pedidos entrantes.
 * El precio y el total SIEMPRE se resuelven contra el inventario del servidor:
 * el cliente no puede imponerlos.
 */

import type { ZodError } from 'zod';
import { CrearLeadSchema, PedidoEntradaSchema } from '../schemas/segaso.schemas.ts';
import type { ItemPedido, MetodoPago } from '../types/segaso.types.ts';

export interface InventarioProducto {
  readonly code: string;
  readonly name: string;
  readonly price_cop: number;
  readonly stock: number;
}

export interface PedidoNormalizado {
  readonly customer_name: string;
  readonly customer_phone: string;
  readonly address: string;
  readonly neighborhood: string;
  readonly payment_method: MetodoPago;
  readonly items: readonly ItemPedido[];
  readonly subtotal_cop: number;
  readonly discount_cop: number;
  readonly total_cop: number;
}

/** Descuento oficial de bienvenida que la página aplica a todo pedido. */
export const DESCUENTO_BIENVENIDA_PCT = 10;

export interface LeadNormalizado {
  readonly name: string;
  readonly phone: string;
  readonly type: string;
}

export class ErrorDeValidacion extends Error {
  readonly statusCode = 400;

  constructor(mensaje: string) {
    super(mensaje);
    this.name = 'ErrorDeValidacion';
  }
}

function describir(error: ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.map(String).join('.') || 'pedido'}: ${issue.message}`)
    .join('; ');
}

function rechazar(mensaje: string): never {
  throw new ErrorDeValidacion(mensaje);
}

export function normalizarPedido(
  entrada: unknown,
  inventario: readonly InventarioProducto[],
): PedidoNormalizado {
  const parsed = PedidoEntradaSchema.safeParse(entrada);
  if (!parsed.success) rechazar(`Pedido inválido: ${describir(parsed.error)}`);

  const catalogo = new Map(inventario.map((producto) => [producto.code, producto]));
  const items: ItemPedido[] = [];
  let subtotalCop = 0;

  for (const solicitado of parsed.data.items) {
    const producto = catalogo.get(solicitado.id);
    if (!producto) rechazar(`Producto no disponible en el catálogo: ${solicitado.id}`);
    if (producto.stock < solicitado.qty) {
      rechazar(`Stock insuficiente para ${producto.name}: quedan ${producto.stock} paquetes`);
    }

    const subtotalCopItem = solicitado.qty * producto.price_cop;
    if (!Number.isSafeInteger(subtotalCopItem) || subtotalCopItem <= 0) {
      rechazar(`Precio inválido para el producto ${solicitado.id}`);
    }

    subtotalCop += subtotalCopItem;
    items.push({
      id: solicitado.id,
      name: producto.name,
      qty: solicitado.qty,
      price_cop: producto.price_cop,
      subtotal_cop: subtotalCopItem,
    });
  }

  if (!Number.isSafeInteger(subtotalCop) || subtotalCop <= 0) {
    rechazar('El subtotal del pedido no es válido');
  }

  const discountCop = Math.round(subtotalCop * (DESCUENTO_BIENVENIDA_PCT / 100));
  const totalCop = subtotalCop - discountCop;
  if (!Number.isSafeInteger(totalCop) || totalCop <= 0) {
    rechazar('El total del pedido no es válido');
  }

  return {
    customer_name: parsed.data.customer_name,
    customer_phone: parsed.data.customer_phone,
    address: parsed.data.address,
    neighborhood: parsed.data.neighborhood,
    payment_method: parsed.data.payment_method,
    items,
    subtotal_cop: subtotalCop,
    discount_cop: discountCop,
    total_cop: totalCop,
  };
}

export function normalizarLead(entrada: unknown): LeadNormalizado {
  const parsed = CrearLeadSchema.safeParse(entrada);
  if (!parsed.success) rechazar(`Interesado inválido: ${describir(parsed.error)}`);
  return { name: parsed.data.name, phone: parsed.data.phone, type: parsed.data.type };
}
