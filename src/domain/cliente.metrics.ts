/**
 * Segaso Chorizos S.A.S. — Métricas de Clientes, LTV y Segmentación
 * @author Jeiser Abraham Gutiérrez (Tech Lead & QA Architect)
 * @version 1.0.0 (Zero-Any / Domain-Driven)
 * 
 * Regla de Oro: Separar Pedidos de Clientes para medir el Lifetime Value (LTV)
 * y premiar a los comensales recurrentes en Envigado y el Valle de Aburrá.
 */

import type { Cliente, SegmentoCliente, Pedido } from '../types/segaso.types.ts';

/**
 * Normaliza el número de teléfono celular colombiano eliminando espacios y prefijos.
 */
export function normalizarTelefono(telefono: string): string {
  const limpio = telefono.replace(/\D/g, '');
  if (limpio.startsWith('57') && limpio.length === 12) {
    return limpio.slice(2);
  }
  return limpio;
}

/**
 * Calcula las métricas acumuladas de un cliente a partir de su historial de pedidos entregados.
 */
export function calcularMetricasCliente(
  phone: string,
  nombre: string,
  direccion: string,
  barrio: string,
  historialPedidos: readonly Pedido[]
): Cliente {
  const telefonoNormalizado = normalizarTelefono(phone);
  
  // Solo se contabilizan pedidos que llegaron a estado 'entregado'
  const pedidosEfectivos = historialPedidos.filter(
    (p) => normalizarTelefono(p.customer_phone) === telefonoNormalizado && p.status === 'entregado'
  );

  const ordersCount = pedidosEfectivos.length;
  const totalSpentCop = pedidosEfectivos.reduce((acc, p) => acc + p.total_cop, 0);
  const averageTicketCop = ordersCount > 0 ? Math.round(totalSpentCop / ordersCount) : 0;

  let segment: SegmentoCliente = 'NUEVO';
  if (ordersCount >= 5 || totalSpentCop >= 250000) {
    segment = 'VIP';
  } else if (ordersCount >= 2) {
    segment = 'RECURRENTE';
  }

  // Último pedido
  const ultimosPedidosOrdenados = [...pedidosEfectivos].sort((a, b) => {
    const tsA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const tsB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return tsB - tsA;
  });

  const lastOrderAt = ultimosPedidosOrdenados[0]?.created_at;

  return {
    phone: telefonoNormalizado,
    name: nombre,
    address: direccion,
    neighborhood: barrio,
    orders_count: ordersCount,
    total_spent_cop: totalSpentCop,
    average_ticket_cop: averageTicketCop,
    segment,
    ...(lastOrderAt ? { last_order_at: lastOrderAt } : {}),
  };
}
