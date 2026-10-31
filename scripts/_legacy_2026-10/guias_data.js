/**
 * @file projects/segaso-app/scripts/guias_data.js
 * @description Datos maestros de trabajo investigativo y roles oficiales para los 5 estudiantes de Segaso.
 * Formato informe técnico para transcripción a cuaderno de notas (CESDE).
 * SRP < 300 líneas.
 */

const RESUMEN_TEMPORADA = {
  empresa: 'Segaso Chorizos S.A.S.',
  ubicacion: 'Envigado, Antioquia (Barrio Primavera)',
  nit: '1037619618-5',
  dueno: 'Harold Cortés / García (Maestro chacinero tradicional y fundador)',
  reconocimiento: 'Clasificada con cumplimiento de requisitos (Renglón 1288) en la convocatoria departamental Antójate de Antioquia (Gobernación de Antioquia)',
  comunidad: '29.2K seguidores orgánicos en TikTok (@segaso.chorizos)',
  producto: 'Chorizo artesanal gourmet de carne de cerdo seleccionada, embutido en tripa natural con especias de huerto. Cero harinas, cero almidones, libre de gluten (apto para celíacos). Empacado al vacío grado alimenticio con 60 días de vida útil en frío.',
  referencias: '9 referencias oficiales (paquetes x5 uds / 450 g): Caserito Paisa (19.9k), Antioqueño (23.6k), Santarrosano (23.8k), Tocineta (23.8k), Parrillero (23.8k), Picante (24.2k), Argentino (24.6k), Morcilla Artesanal (15.0k) y Chimichurri Especial (14.5k).',
  lineasNegocio: [
    'Venta y distribución de charcutería artesanal empacada al vacío al detal y por mayor para asados familiares y aliados comerciales.',
    'Servicio de Asados al Barril a domicilio para eventos privados, cumpleaños y reuniones corporativas en todo el Valle de Aburrá.'
  ],
  problemática: [
    'Debilidad central identificada en diagnóstico: «Procesos poco eficaces» (calificación 1/4, menor puntaje posible).',
    'Atención al cliente lenta y manual por WhatsApp: entre 15 y 20 minutos por cliente resolviendo preguntas repetitivas de precios y disponibilidad.',
    'Manejo de inventario empírico en libreta de papel y memoria: riesgo frecuente de vender referencias agotadas y descuadres de bodega.',
    'Restricción financiera absoluta de 0 COP ("No Hay Plata"): imposibilidad de pagar suscripciones mensuales de software comercial (Shopify, Wix, ERPs).'
  ],
  solucion: [
    'Sprint 1 (Angelina Rojas): Vitrina web comercial con las 9 referencias oficiales, fichas técnicas y carrito de compra reactivo.',
    'Sprint 2 (Brayan Álvarez): Panel Back Office administrativo privado con control de inventario en tiempo real y flujo de pedidos FSM.',
    'Sprint 3 (Edison Galván): Automatización del canal WhatsApp con mensaje estructurado y cupón SEGASO10; el flete se confirma por WhatsApp según la zona.',
    'Sprint 4 (María Vahos Villa & Isabel Rey): Auditoría de calidad de datos, verificación de stock bodega y comprobación de ROI a $0 costo.'
  ]
};

const INTEGRANTES = [
  {
    id: 'angelina',
    nombre: 'Angelina Rojas',
    rolOficial: 'Administradora de Vitrina Digital y Catálogo Comercial',
    sprint: 'Sprint 1 — Identidad y Vitrina Comercial',
    semana: 'Semana 1 (1 de Septiembre)',
    tituloSeccion: 'Estructuración de Identidad Comercial y Vitrina Web Reactiva',
    investigacion: [
      {
        subtitulo: '1. Diagnóstico del Canal Comercial Informal',
        detalle: 'La microempresa recibía clientes por recomendaciones y redes sociales (29.2k en TikTok), pero carecía de una vitrina estructurada. Los usuarios escribían al chat privado preguntando precios, presentaciones y fotos una y otra vez, ocupando tiempo valioso del personal de cocina.'
      },
      {
        subtitulo: '2. Estandarización de las 9 Referencias Oficiales',
        detalle: 'Se investigó y formuló la ficha técnica de cada producto: Caserito Paisa (19.9k COP), Antioqueño (23.6k COP), Santarrosano (23.8k COP), Tocineta (23.8k COP), Parrillero (23.8k COP), Picante (24.2k COP), Estilo Argentino (24.6k COP), Morcilla Artesanal (15.0k COP) y Chimichurri (14.5k COP). Cada ficha detalla peso (450 g), ingredientes libres de gluten y vida útil de 60 días al vacío.'
      },
      {
        subtitulo: '3. Desarrollo de la Vitrina Web Reactiva',
        detalle: 'Se construyó una interfaz comercial táctil y responsiva donde el cliente visualiza fotos reales, añade productos a un carrito dinámico y calcula el subtotal exacto antes de contactar a la empresa. Funciona en cualquier navegador sin descargas pesadas.'
      },
      {
        subtitulo: '4. Canalización de Tráfico Orgánico y Resultados',
        detalle: 'Se integró el enlace de la vitrina en la biografía de TikTok e Instagram. Se logró reducir en un 90% las consultas repetitivas de precios, estandarizando el catálogo para todo el Valle de Aburrá.'
      }
    ]
  },
  {
    id: 'brayan',
    nombre: 'Brayan Álvarez',
    rolOficial: 'Administrador de Back Office y Control de Bodega',
    sprint: 'Sprint 2 — Creación del Back Office Administrativo',
    semana: 'Semana 2',
    tituloSeccion: 'Implementación del Panel Administrativo y Control de Existencias',
    investigacion: [
      {
        subtitulo: '1. Diagnóstico del Control de Stock Tradicional',
        detalle: 'El inventario de Segaso se llevaba en libreta de papel y de memoria por parte del fundador. Cuando entraban múltiples pedidos el fin de semana, se prometían productos agotados, obligando a llamar al cliente para cambiar el pedido o cancelar la venta.'
      },
      {
        subtitulo: '2. Creación del Panel Administrativo (Back Office)',
        detalle: 'Se desarrolló un módulo gerencial interno con acceso protegido por correo y contraseña, hash scrypt y JWT HS256, accesible desde computadores o teléfonos autorizados, garantizando la confidencialidad de las ventas y márgenes comerciales.'
      },
      {
        subtitulo: '3. Control Dinámico de Inventario y Alertas',
        detalle: 'El sistema descuenta automáticamente las unidades vendidas de la bodega digital al registrarse cada pedido. Cuenta con indicadores visuales de stock mínimo (menos de 5 unidades) que alertan al maestro chacinero para programar la producción de embutido.'
      },
      {
        subtitulo: '4. Máquina de Estados Finitos (FSM) para Trazabilidad',
        detalle: 'Se formalizó el flujo de trabajo de cada orden mediante cinco estados: pendiente ➔ confirmado ➔ preparando ➔ camino ➔ entregado (o cancelado). Esto permite saber con exactitud en qué punto de la cadena operativa está cada solicitud.'
      },
      {
        subtitulo: '5. Resultados Administrativos Obtenidos',
        detalle: 'El sistema evita vender productos agotados, elimina el cuaderno de papel y ordena la administración con almacenamiento local-first sin costo de servidores cloud.'
      }
    ]
  },
  {
    id: 'edison',
    nombre: 'Edison Galván',
    rolOficial: 'Gestor de Canales Digitales y Atención Comercial',
    sprint: 'Sprint 3 — Servicio de WhatsApp y Conversión',
    semana: 'Semana 3',
    tituloSeccion: 'Automatización del Canal de Ventas y Tácticas de Conversión',
    investigacion: [
      {
        subtitulo: '1. Diagnóstico del Cuello de Botella en Atención',
        detalle: 'Cerrar una venta tomaba entre 15 y 20 minutos por chat manual debido a la solicitud paulatina de datos: qué producto deseaba, cuántos paquetes, dirección exacta, barrio, municipio y método de pago. Esto provocaba abandono de compras.'
      },
      {
        subtitulo: '2. Generador Automatizado de Pedidos a WhatsApp',
        detalle: 'Al finalizar la selección en la vitrina, el sistema genera automáticamente un enlace hacia la API oficial de WhatsApp de Harold (+57 300 236 7180), despachando un mensaje estructurado con código consecutivo (SEG-XXXX), lista de productos, cantidades, dirección y método de pago (Efectivo o Transferencia).'
      },
      {
        subtitulo: '3. Módulo Dinámico de Tarifas de Domicilio',
        detalle: 'La página captura la ciudad y la dirección; el valor exacto del flete se confirma por WhatsApp según la zona. La parametrización automática de fletes queda como siguiente paso, no como funcionalidad terminada.'
      },
      {
        subtitulo: '4. Táctica Promocional de Cierre (Cupón SEGASO10)',
        detalle: 'Se incorporó el cupón comercial automático SEGASO10 que aplica un 10% de descuento en la primera compra. El descuento se sustenta sobre el margen bruto de charcutería (superior al 40%) e incrementa el volumen de rotación del producto.'
      },
      {
        subtitulo: '5. Resultados Cuantitativos',
        detalle: 'El tiempo de atención comercial se estima en menos de 30 segundos por cliente (antes: 15–20 minutos), con pedidos recibidos de forma clara y listos para empacar. Es una estimación, no una medición.'
      }
    ]
  },
  {
    id: 'isabel',
    nombre: 'Isabel Rey',
    rolOficial: 'Auditora de Procesos y Control de Calidad Operativa',
    sprint: 'Sprint 4 — Control y Verificación de Datos (Parte A)',
    semana: 'Semana 4 (14-nov)',
    tituloSeccion: 'Auditoría de Consistencia de Datos, Validación y Calidad Operativa',
    investigacion: [
      {
        subtitulo: '1. Diagnóstico de la Calidad y Errores en Pedidos',
        detalle: 'En el esquema manual informal, era frecuente el error humano en transcripción de números de contacto, omisiones de número de torre o apartamento y confusiones en el tipo de producto, lo que generaba devoluciones y afectaba la cadena de frío.'
      },
      {
        subtitulo: '2. Pruebas de Integración y Validación de Extremo a Extremo (E2E)',
        detalle: 'Se ejecutó una batería de pruebas de auditoría simulando múltiples compras simultáneas. Se comprobó que el formulario valide campos obligatorios (teléfono de 10 dígitos, dirección y municipio) antes de habilitar el botón de compra.'
      },
      {
        subtitulo: '3. Auditoría de Conciliación de Bodega',
        detalle: 'Se verificó que cada unidad restada en la vitrina coincida con el inventario remanente en el Back Office. En el flujo E2E el inventario quedó 9/9; la tasa de descuadre de todos los pedidos reales no está medida.'
      },
      {
        subtitulo: '4. Control de Trazabilidad y Cadena de Frío',
        detalle: 'Verificación del rotulado de los empaques: fecha de elaboración, lote y fecha de vencimiento (60 días). Se estandarizó el protocolo de empaque con gel refrigerante para domicilios con tiempos de traslado superiores a 30 minutos.'
      },
      {
        subtitulo: '5. Resultados de Auditoría',
        detalle: 'En el flujo E2E no hubo errores críticos y el flujo logístico quedó estandarizado. La tasa de errores de todos los pedidos reales no está medida.'
      }
    ]
  },
  {
    id: 'maria_vahos',
    nombre: 'María Vahos Villa',
    rolOficial: 'Auditora Financiera, Métricas de Gestión y ROI',
    sprint: 'Sprint 4 — Control y Verificación de Datos (Parte B)',
    semana: 'Semana 4 (14-nov)',
    tituloSeccion: 'Evaluación Cuantitativa de Gestión, Retorno de Inversión y Metas',
    investigacion: [
      {
        subtitulo: '1. Alcance de la Responsabilidad en el Sprint 4',
        detalle: 'Junto con Isabel Rey, conforma el equipo de control y verificación de datos. Su enfoque se centra en la auditoría cuantitativa, el impacto financiero de la restricción de presupuesto (0 COP), el cumplimiento de las metas del proyecto y la presentación de los resultados EFI/EFE.'
      },
      {
        subtitulo: '2. Evaluación de la Restricción de Presupuesto (0 COP)',
        detalle: 'Se auditó el costo de alternativas comerciales en el mercado (Shopify básica: 120k COP/mes; Wix eCommerce: 75k COP/mes; más comisiones por pasarelas de pago). El sistema desarrollado para Segaso opera con costo $0 recurrente, permitiendo a la empresa reinvertir sus utilidades en materia prima.'
      },
      {
        subtitulo: '3. Medición de Indicadores Clave de Desempeño (KPIs)',
        detalle: '• Productividad del Fundador: ahorro estimado de más de 3 horas diarias en el teléfono, reasignadas a producción culinaria.\n• Tasa de Precisión en Despacho: en el flujo E2E, los pedidos de prueba se entregaron conforme a la solicitud; no es una medición de todos los pedidos reales.\n• Velocidad de Respuesta: reducción estimada del 95% en los tiempos de espera del consumidor; es una estimación, no una medición.'
      },
      {
        subtitulo: '4. Comprobación del Objetivo General del Proyecto',
        detalle: 'Se certificó el cumplimiento del objetivo formulado: «Establecer un sistema de seguimiento a los clientes mediante una estructura informática, que permita almacenar la información de una manera ágil para la empresa Segaso Chorizo S.A.S.», comprobando su efectividad con datos reales.'
      },
      {
        subtitulo: '5. Conclusión Investigativa Final',
        detalle: 'Se demostró que la asistencia administrativa estratégica genera valor tangible al resolver cuellos de botella con metodologías ágiles e ingenio local, sin depender de endeudamiento o licenciamiento costoso.'
      }
    ]
  }
];

module.exports = {
  RESUMEN_TEMPORADA,
  INTEGRANTES
};
