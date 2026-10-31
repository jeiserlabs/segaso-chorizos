/**
 * Segaso Chorizos S.A.S. — Pruebas del blindaje de pedidos entrantes.
 * El cliente NO puede imponer precio ni total: se resuelven contra inventario.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  ErrorDeValidacion,
  normalizarLead,
  normalizarPedido,
} from '../src/domain/pedido.validation.ts';

const INVENTARIO = [
  { code: 'caserito', name: 'Chorizo Caserito Paisa (x5)', price_cop: 19900, stock: 100 },
  { code: 'chimichurri', name: 'Chimichurri Artesanal de la Casa (250ml)', price_cop: 14500, stock: 100 },
];

const PEDIDO_BASE = {
  customer_name: 'Harold Cortés',
  customer_phone: '3002367180',
  address: 'Calle 46 Sur # 46A - 16',
  neighborhood: 'Envigado (Primavera)',
  items: [{ id: 'caserito', qty: 1 }],
};

describe('normalizarPedido: el servidor manda en precio y total', () => {
  test('ignora el total y el precio enviados por el cliente', () => {
    const pedido = normalizarPedido(
      { ...PEDIDO_BASE, total_cop: 1, items: [{ id: 'caserito', qty: 2, name: 'HACKEADO', price_cop: 1 }] },
      INVENTARIO,
    );

    assert.equal(pedido.subtotal_cop, 39800);
    assert.equal(pedido.discount_cop, 3980);
    assert.equal(pedido.total_cop, 35820);
    assert.equal(pedido.items[0]?.price_cop, 19900);
    assert.equal(pedido.items[0]?.name, 'Chorizo Caserito Paisa (x5)');
    assert.equal(pedido.items[0]?.subtotal_cop, 39800);
  });

  test('suma varios productos con los precios del catálogo y aplica el 10% oficial', () => {
    const pedido = normalizarPedido(
      {
        ...PEDIDO_BASE,
        items: [
          { id: 'caserito', qty: 1 },
          { id: 'chimichurri', qty: 2 },
        ],
      },
      INVENTARIO,
    );

    assert.equal(pedido.subtotal_cop, 19900 + 14500 * 2);
    assert.equal(pedido.discount_cop, 4890);
    assert.equal(pedido.total_cop, 44010);
    assert.equal(pedido.items.length, 2);
  });

  test('rechaza una cantidad mayor al stock real del inventario', () => {
    assert.throws(
      () => normalizarPedido(
        { ...PEDIDO_BASE, items: [{ id: 'caserito', qty: 2 }] },
        [{ code: 'caserito', name: 'Caserito', price_cop: 19900, stock: 1 }],
      ),
      (error) => error instanceof ErrorDeValidacion && /Stock insuficiente/.test(error.message),
    );
  });

  test('aplica el método de pago por defecto cuando no viene', () => {
    const pedido = normalizarPedido(PEDIDO_BASE, INVENTARIO);
    assert.equal(pedido.payment_method, 'Transferencia Nequi/Bancolombia');
  });

  test('rechaza un producto que no existe en el catálogo oficial', () => {
    assert.throws(
      () => normalizarPedido({ ...PEDIDO_BASE, items: [{ id: 'chorizo_de_soya', qty: 1 }] }, INVENTARIO),
      (error) => error instanceof ErrorDeValidacion && error.statusCode === 400,
    );
  });

  test('rechaza cantidades fuera de rango', () => {
    assert.throws(() => normalizarPedido({ ...PEDIDO_BASE, items: [{ id: 'caserito', qty: 0 }] }, INVENTARIO), ErrorDeValidacion);
    assert.throws(() => normalizarPedido({ ...PEDIDO_BASE, items: [{ id: 'caserito', qty: 51 }] }, INVENTARIO), ErrorDeValidacion);
    assert.throws(() => normalizarPedido({ ...PEDIDO_BASE, items: [{ id: 'caserito', qty: 1.5 }] }, INVENTARIO), ErrorDeValidacion);
  });

  test('rechaza teléfono inválido y campos faltantes', () => {
    assert.throws(() => normalizarPedido({ ...PEDIDO_BASE, customer_phone: '12345' }, INVENTARIO), ErrorDeValidacion);
    assert.throws(() => normalizarPedido({ customer_name: 'X' }, INVENTARIO), ErrorDeValidacion);
    assert.throws(() => normalizarPedido(null, INVENTARIO), ErrorDeValidacion);
  });

  test('rechaza un inventario sin el producto solicitado aunque el schema sea válido', () => {
    assert.throws(
      () => normalizarPedido(PEDIDO_BASE, [{ code: 'chimichurri', name: 'Chimichurri', price_cop: 14500, stock: 100 }]),
      (error) => error instanceof ErrorDeValidacion && /no disponible/.test(error.message),
    );
  });
});

describe('normalizarLead: captura de interesados validada', () => {
  test('acepta el tipo que envía la página (Taller Charcutería)', () => {
    const lead = normalizarLead({ name: 'Ana María', phone: '3001234567', type: 'Taller Charcutería' });
    assert.equal(lead.type, 'Taller Charcutería');
  });

  test('usa "curso" por defecto y rechaza teléfonos inválidos', () => {
    assert.equal(normalizarLead({ name: 'Ana María', phone: '3001234567' }).type, 'curso');
    assert.throws(() => normalizarLead({ name: 'Ana', phone: 'abc' }), ErrorDeValidacion);
  });
});
