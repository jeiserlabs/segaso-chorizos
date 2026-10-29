/**
 * Segaso Chorizos S.A.S. — Contratos y Tipos de Dominio Estrictos (TypeScript)
 * @author Jeiser Abraham Gutiérrez (Tech Lead & QA Architect)
 * @version 1.0.0 (Zero-Any Policy)
 */

export type CodigoProducto =
  | 'caserito'
  | 'antioqueno'
  | 'santarrosano'
  | 'tocineta'
  | 'parrillero'
  | 'picante'
  | 'argentino'
  | 'morcilla'
  | 'chimichurri';

export type EstadoPedido =
  | 'pendiente'
  | 'confirmado'
  | 'preparando'
  | 'camino'
  | 'entregado'
  | 'cancelado';

export type MetodoPago =
  | 'Transferencia Nequi/Bancolombia'
  | 'Contra Entrega (Efectivo)'
  | 'Tarjeta Débito/Crédito'
  | 'no especificado';

export type SegmentoCliente = 'NUEVO' | 'RECURRENTE' | 'VIP';

export interface Producto {
  readonly code: CodigoProducto;
  readonly name: string;
  readonly description: string;
  readonly price_cop: number;
  readonly stock: number;
  readonly min_stock: number;
  readonly presentation: string; // Ej: 'Paquete x 5 unidades (450 g)' o 'Frasco 250ml'
}

export interface ItemPedido {
  readonly id: CodigoProducto;
  readonly name: string;
  readonly qty: number;
  readonly price_cop: number;
  readonly subtotal_cop: number;
}

export interface Pedido {
  readonly id?: number;
  readonly code: string; // Ej: 'SEG-1001'
  readonly customer_name: string;
  readonly customer_phone: string;
  readonly address: string;
  readonly neighborhood: string;
  readonly items: readonly ItemPedido[];
  readonly total_cop: number;
  readonly payment_method: MetodoPago;
  readonly status: EstadoPedido;
  readonly created_at?: string;
  readonly updated_at?: string | null;
}

export interface Cliente {
  readonly phone: string; // Identificador único (WhatsApp)
  readonly name: string;
  readonly address: string;
  readonly neighborhood: string;
  readonly orders_count: number;
  readonly total_spent_cop: number;
  readonly average_ticket_cop: number;
  readonly segment: SegmentoCliente;
  readonly last_order_at?: string;
}

export interface CotizacionCateringInput {
  readonly attendees: number; // Mínimo 5
  readonly include_chimichurri: boolean;
  readonly premium_cuts_selection?: readonly ('punta_de_anca' | 'bondiola' | 'chicharron_ahumado')[];
}

export interface CotizacionCateringResultado {
  readonly attendees: number;
  readonly meat_total_kg: number;
  readonly sausages_count: number;
  readonly service_base_cop: number;
  readonly meat_cost_cop: number;
  readonly chimichurri_cost_cop: number;
  readonly total_cop: number;
  readonly price_per_person_cop: number;
}
