/**
 * Segaso Chorizos S.A.S. — Calculadora Determinista de Catering (Asados al Barril)
 * @author Jeiser Abraham Gutiérrez (Tech Lead & QA Architect)
 * @version 1.0.0 (Zero-Any / Domain-Driven)
 * 
 * Regla de Oro: El servicio de Asados al Barril a domicilio parte de un mínimo
 * de 5 personas. Garantiza porciones estándar de 350g de proteína por comensal,
 * carbón vegetal seleccionado y servicio de maestro parrillero.
 */

import type {
  CotizacionCateringInput,
  CotizacionCateringResultado,
} from '../types/segaso.types.ts';

const GRAMOS_POR_PERSONA = 350; // 0.35 kg
const CHORIZOS_POR_PERSONA = 2; // Unidades
const PRECIO_BASE_PROTEINA_POR_PERSONA_COP = 22000; // 22k COP
const PRECIO_FRASCO_CHIMICHURRI_COP = 14500; // 14.5k COP (rinde para 10 personas)

/**
 * Determina el costo base logístico y operativo del ahumador y maestro parrillero.
 */
function calcularCostoBaseServicio(personas: number): number {
  if (personas <= 10) {
    return 120000; // 120k COP (Barril estándar + carbón)
  }
  if (personas <= 25) {
    return 200000; // 200k COP (Barril grande + parrillero asistido)
  }
  return 320000; // 320k COP (Equipo doble de barriles para eventos grandes)
}

/**
 * Calcula la cotización completa y transparente para un servicio de asado al barril.
 */
export function calcularCotizacionCatering(
  input: CotizacionCateringInput
): CotizacionCateringResultado {
  if (input.attendees < 5) {
    throw new Error('El servicio de Asados al Barril requiere un mínimo de 5 personas');
  }

  const personas = input.attendees;
  const meatTotalKg = Number(((personas * GRAMOS_POR_PERSONA) / 1000).toFixed(2));
  const sausagesCount = personas * CHORIZOS_POR_PERSONA;

  const serviceBaseCop = calcularCostoBaseServicio(personas);
  const meatCostCop = personas * PRECIO_BASE_PROTEINA_POR_PERSONA_COP;

  // 1 frasco de chimichurri por cada 10 comensales (redondeo hacia arriba)
  const frascosChimichurri = input.include_chimichurri ? Math.max(1, Math.ceil(personas / 10)) : 0;
  const chimichurriCostCop = frascosChimichurri * PRECIO_FRASCO_CHIMICHURRI_COP;

  const totalCop = serviceBaseCop + meatCostCop + chimichurriCostCop;
  const pricePerPersonCop = Math.round(totalCop / personas);

  return {
    attendees: personas,
    meat_total_kg: meatTotalKg,
    sausages_count: sausagesCount,
    service_base_cop: serviceBaseCop,
    meat_cost_cop: meatCostCop,
    chimichurri_cost_cop: chimichurriCostCop,
    total_cop: totalCop,
    price_per_person_cop: pricePerPersonCop,
  };
}
