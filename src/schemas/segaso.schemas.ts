/**
 * Segaso Chorizos S.A.S. — Esquemas de Validación en Runtime (Zod 4)
 * @author Jeiser Abraham Gutiérrez (Tech Lead & QA Architect)
 * @version 1.0.0 (Fail-Closed / Zero-Any)
 */

import { z } from 'zod';

export const CodigoProductoSchema = z.enum([
  'caserito',
  'antioqueno',
  'santarrosano',
  'tocineta',
  'parrillero',
  'picante',
  'argentino',
  'morcilla',
  'chimichurri',
], { message: 'Código de producto no reconocido en el catálogo oficial de Segaso' });

export const EstadoPedidoSchema = z.enum([
  'pendiente',
  'confirmado',
  'preparando',
  'camino',
  'entregado',
  'cancelado',
], { message: 'Estado de pedido inválido' });

export const MetodoPagoSchema = z.enum([
  'Transferencia Nequi/Bancolombia',
  'Contra Entrega (Efectivo)',
  'Tarjeta Débito/Crédito',
  'no especificado',
], { message: 'Método de pago no autorizado' });

/** Formato de teléfono colombiano: 10 dígitos (ej: 3001234567) o con prefijo +57 */
const REGEX_TEL_COLOMBIA = /^(\+?57)?3\d{9}$/;

export const ItemPedidoInputSchema = z.object({
  id: CodigoProductoSchema,
  name: z.string().min(2, 'Nombre de producto requerido').max(100),
  qty: z.number().int('La cantidad debe ser un número entero').positive('La cantidad mínima es 1 paquete'),
  price_cop: z.number().int().positive('El precio debe ser un valor positivo en COP'),
});

export const CrearPedidoSchema = z.object({
  customer_name: z.string().trim().min(3, 'El nombre del cliente debe tener al menos 3 caracteres').max(100),
  customer_phone: z.string().trim().regex(REGEX_TEL_COLOMBIA, 'Número de celular inválido (debe ser línea móvil de 10 dígitos, ej: 3002367180)'),
  address: z.string().trim().min(5, 'La dirección debe ser clara y contener al menos 5 caracteres').max(150),
  neighborhood: z.string().trim().min(2, 'Barrio o municipio obligatorio (ej: Envigado Primavera, Sabaneta)').max(100),
  items: z.array(ItemPedidoInputSchema).min(1, 'El pedido debe contener al menos un producto'),
  payment_method: MetodoPagoSchema.default('Transferencia Nequi/Bancolombia'),
});

export const ActualizarEstadoSchema = z.object({
  id: z.number().int().positive('ID de pedido inválido'),
  status: EstadoPedidoSchema,
});

export const CotizacionCateringSchema = z.object({
  attendees: z.number().int().min(5, 'El servicio de Asados al Barril se atiende a partir de 5 personas'),
  include_chimichurri: z.boolean().default(true),
  premium_cuts_selection: z.array(z.enum(['punta_de_anca', 'bondiola', 'chicharron_ahumado'])).optional(),
});
