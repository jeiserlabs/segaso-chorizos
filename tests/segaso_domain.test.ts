/**
 * Segaso Chorizos S.A.S. — Suite de Pruebas Unitarias de Dominio y Contratos (SSD)
 * @author Jeiser Abraham Gutiérrez (Tech Lead & QA Architect)
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  validarTransicionEstado,
  calcularTotalPedido,
  generarCodigoPedido,
} from '../src/domain/pedido.fsm.ts';
import { calcularCotizacionCatering } from '../src/domain/catering.calculator.ts';
import {
  normalizarTelefono,
  calcularMetricasCliente,
} from '../src/domain/cliente.metrics.ts';
import {
  CrearPedidoSchema,
  CodigoProductoSchema,
} from '../src/schemas/segaso.schemas.ts';
import type { Pedido } from '../src/types/segaso.types.ts';

describe('Contratos Zod: Validación de Entrada de Pedidos', () => {
  test('Acepta un pedido válido con celular colombiano y productos oficiales', () => {
    const payload = {
      customer_name: 'Harold Cortés',
      customer_phone: '3002367180',
      address: 'Calle 46 Sur # 46A - 16',
      neighborhood: 'Envigado (Primavera)',
      items: [
        { id: 'caserito', name: 'Chorizo Caserito Paisa (x5)', qty: 2, price_cop: 19900 },
        { id: 'chimichurri', name: 'Chimichurri de la Casa', qty: 1, price_cop: 14500 },
      ],
      payment_method: 'Transferencia Nequi/Bancolombia' as const,
    };

    const res = CrearPedidoSchema.safeParse(payload);
    assert.equal(res.success, true);
  });

  test('Rechaza número de teléfono inválido o extranjero sin formato 10 dígitos', () => {
    const payloadInvalido = {
      customer_name: 'Cliente Prueba',
      customer_phone: '12345', // Inválido
      address: 'Calle 10 # 20-30',
      neighborhood: 'Medellín',
      items: [{ id: 'argentino', name: 'Chorizo Argentino', qty: 1, price_cop: 24600 }],
    };

    const res = CrearPedidoSchema.safeParse(payloadInvalido);
    assert.equal(res.success, false);
  });

  test('Rechaza producto inexistente fuera de las 9 referencias oficiales', () => {
    const res = CodigoProductoSchema.safeParse('chorizo_de_soya');
    assert.equal(res.success, false);
  });
});

describe('FSM de Pedidos: Ciclo de Vida y Transiciones', () => {
  test('Permite transiciones legales paso a paso', () => {
    assert.equal(validarTransicionEstado('pendiente', 'confirmado').valida, true);
    assert.equal(validarTransicionEstado('confirmado', 'preparando').valida, true);
    assert.equal(validarTransicionEstado('preparando', 'camino').valida, true);
    assert.equal(validarTransicionEstado('camino', 'entregado').valida, true);
  });

  test('Prohíbe saltos ilegales (ej: pendiente -> entregado)', () => {
    const res = validarTransicionEstado('pendiente', 'entregado');
    assert.equal(res.valida, false);
    assert.ok(res.error?.includes("Transición inválida"));
  });

  test('Permite cancelación desde pendiente, confirmado o preparando', () => {
    assert.equal(validarTransicionEstado('pendiente', 'cancelado').valida, true);
    assert.equal(validarTransicionEstado('confirmado', 'cancelado').valida, true);
    assert.equal(validarTransicionEstado('preparando', 'cancelado').valida, true);
  });

  test('Prohíbe modificar un pedido entregado (estado terminal)', () => {
    const res = validarTransicionEstado('entregado', 'cancelado');
    assert.equal(res.valida, false);
  });

  test('Cálculo de totales consolida subtotales por producto', () => {
    const calculo = calcularTotalPedido([
      { id: 'caserito', name: 'Caserito (x5)', qty: 2, price_cop: 19900 },
      { id: 'argentino', name: 'Argentino (x5)', qty: 1, price_cop: 24600 },
    ]);

    assert.equal(calculo.totalCop, 39800 + 24600); // 64.4k COP
    assert.equal(calculo.itemsNormalizados[0]?.subtotal_cop, 39800);
    assert.equal(calculo.itemsNormalizados[1]?.subtotal_cop, 24600);
  });

  test('Generación de código formatea número consecutivo con prefijo SEG-', () => {
    assert.equal(generarCodigoPedido(1), 'SEG-1001');
    assert.equal(generarCodigoPedido(1005), 'SEG-1005');
  });
});

describe('Calculadora de Catering: Asados al Barril', () => {
  test('Rechaza cotización con menos de 5 personas', () => {
    assert.throws(() => {
      calcularCotizacionCatering({ attendees: 4, include_chimichurri: true });
    }, /mínimo de 5 personas/);
  });

  test('Calcula porciones e insumos exactos para 10 personas', () => {
    const cot = calcularCotizacionCatering({
      attendees: 10,
      include_chimichurri: true,
    });

    assert.equal(cot.attendees, 10);
    assert.equal(cot.meat_total_kg, 3.5); // 10 * 350g = 3.5 kg
    assert.equal(cot.sausages_count, 20); // 2 chorizos por persona
    assert.equal(cot.service_base_cop, 120000); // 120k COP base
    assert.equal(cot.meat_cost_cop, 220000); // 22k * 10 = 220k COP
    assert.equal(cot.chimichurri_cost_cop, 14500); // 1 frasco
    assert.equal(cot.total_cop, 120000 + 220000 + 14500); // 354.5k COP
    assert.equal(cot.price_per_person_cop, 35450); // ~35.5k COP por persona
  });
});

describe('Métricas de Clientes y LTV', () => {
  test('Normaliza teléfono con o sin prefijo 57', () => {
    assert.equal(normalizarTelefono('+57 300 236 7180'), '3002367180');
    assert.equal(normalizarTelefono('573002367180'), '3002367180');
    assert.equal(normalizarTelefono('3002367180'), '3002367180');
  });

  test('Calcula LTV y segmenta como VIP a cliente con compras acumuladas >= 250k COP', () => {
    const pedidosCliente: Pedido[] = [
      {
        code: 'SEG-1001',
        customer_name: 'Mateo Arango',
        customer_phone: '3009876543',
        address: 'Calle 50 # 42-18',
        neighborhood: 'Sabaneta',
        items: [{ id: 'parrillero', name: 'Parrillero (x5)', qty: 4, price_cop: 23800, subtotal_cop: 95200 }],
        total_cop: 95200,
        payment_method: 'Transferencia Nequi/Bancolombia',
        status: 'entregado',
        created_at: '2026-10-01 14:00:00',
      },
      {
        code: 'SEG-1002',
        customer_name: 'Mateo Arango',
        customer_phone: '3009876543',
        address: 'Calle 50 # 42-18',
        neighborhood: 'Sabaneta',
        items: [{ id: 'parrillero', name: 'Parrillero (x5)', qty: 7, price_cop: 23800, subtotal_cop: 166600 }],
        total_cop: 166600,
        payment_method: 'Transferencia Nequi/Bancolombia',
        status: 'entregado',
        created_at: '2026-10-10 18:00:00',
      },
    ];

    const cliente = calcularMetricasCliente(
      '3009876543',
      'Mateo Arango',
      'Calle 50 # 42-18',
      'Sabaneta',
      pedidosCliente
    );

    assert.equal(cliente.orders_count, 2);
    assert.equal(cliente.total_spent_cop, 95200 + 166600); // 261.8k COP
    assert.equal(cliente.segment, 'VIP'); // Total >= 250k COP -> VIP
  });
});
