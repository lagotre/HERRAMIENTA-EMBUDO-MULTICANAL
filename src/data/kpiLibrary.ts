import type { KpiCategory } from '@/types/journey';

export const kpiCategories: KpiCategory[] = [
  {
    id: 'alcance',
    name: 'Alcance & Adquisición',
    kpis: [
      {
        name: 'Omnichannel Traffic Share',
        description: 'Proporción de visitas por canal sobre el total de tráfico',
        formula: '(Sesiones por canal / Total de sesiones) × 100',
      },
      {
        name: 'Alcance Total (Reach)',
        description: 'Personas únicas impactadas por la campaña en todos los canales',
      },
      {
        name: 'Impresiones',
        description: 'Número de veces que el anuncio o contenido fue mostrado',
      },
      {
        name: 'Share of Voice (SOV)',
        description: 'Participación de la marca en la conversación total del sector',
      },
    ],
  },
  {
    id: 'adquisicion',
    name: 'Costo de Adquisición',
    kpis: [
      {
        name: 'CAC Unificado',
        description: 'Costo total de adquirir un nuevo cliente en todos los canales',
        formula: '(Inversión total en marketing + ventas) / Nuevos clientes',
      },
      {
        name: 'CPM',
        description: 'Costo por cada 1,000 impresiones',
        formula: '(Gasto / Impresiones) × 1,000',
      },
      {
        name: 'CPC',
        description: 'Costo por clic en publicidad pagada',
        formula: 'Gasto total / Total de clics',
      },
      {
        name: 'CPL (Costo por Lead)',
        description: 'Costo de obtener un contacto o prospecto calificado',
        formula: 'Gasto total / Leads generados',
      },
    ],
  },
  {
    id: 'engagement',
    name: 'Engagement & Conversión',
    kpis: [
      {
        name: '% Clientes Multicanal',
        description: 'Clientes que usan 2 o más canales en el mismo proceso de compra',
        formula: '(Clientes multicanal / Total de clientes) × 100',
      },
      {
        name: 'Tasa de Conversión',
        description: 'Porcentaje de visitantes que completan una acción deseada',
        formula: '(Conversiones / Visitantes) × 100',
      },
      {
        name: 'Tasa de Clics (CTR)',
        description: 'Porcentaje de impresiones que generaron un clic',
        formula: '(Clics / Impresiones) × 100',
      },
      {
        name: 'Tasa de Abandono de Carrito',
        description: 'Porcentaje de usuarios que agregaron al carrito pero no compraron',
        formula: '(Carritos abandonados / Carritos iniciados) × 100',
      },
    ],
  },
  {
    id: 'fulfillment',
    name: 'Fulfillment & Operaciones',
    kpis: [
      {
        name: 'BOPIS / Click-&-Collect Rate',
        description: 'Porcentaje de órdenes online recogidas en tienda física',
        formula: '(Órdenes BOPIS / Total de órdenes online) × 100',
      },
      {
        name: 'Tiempo promedio de entrega',
        description: 'Días promedio entre el pedido y la entrega al cliente',
      },
      {
        name: 'Tasa de Devoluciones',
        description: 'Porcentaje de productos devueltos sobre el total vendido',
        formula: '(Devoluciones / Unidades vendidas) × 100',
      },
    ],
  },
  {
    id: 'experiencia',
    name: 'Experiencia del Cliente',
    kpis: [
      {
        name: 'NPS / CSAT Omnicanal',
        description: 'Satisfacción y probabilidad de recomendación promediada entre canales',
        formula: 'NPS = % Promotores (9-10) − % Detractores (0-6)',
      },
      {
        name: 'Tasa de Resolución en Primer Contacto',
        description: 'Problemas resueltos sin necesidad de seguimiento adicional',
        formula: '(Casos resueltos al primer contacto / Total de casos) × 100',
      },
      {
        name: 'Tiempo de Respuesta Promedio',
        description: 'Tiempo promedio para responder a un cliente en cualquier canal',
      },
    ],
  },
  {
    id: 'retencion',
    name: 'Valor & Retención',
    kpis: [
      {
        name: 'CLV Omnicanal',
        description: 'Valor neto proyectado que genera un cliente durante toda su relación con la marca',
        formula: '(Ticket promedio × Margen bruto) × Frecuencia anual × Duración estimada (años) − Costo de servicio',
      },
      {
        name: 'Tasa de Retención',
        description: 'Porcentaje de clientes que siguen comprando en un período',
        formula: '((Clientes al final − Clientes nuevos) / Clientes al inicio) × 100',
      },
      {
        name: 'Frecuencia de Compra',
        description: 'Número promedio de compras por cliente en un período',
        formula: 'Total de pedidos / Clientes únicos',
      },
      {
        name: 'Tasa de Churn',
        description: 'Porcentaje de clientes perdidos en un período',
        formula: '(Clientes perdidos / Clientes al inicio) × 100',
      },
    ],
  },
  {
    id: 'rentabilidad',
    name: 'Rentabilidad Comercial',
    kpis: [
      {
        name: 'ROAS Omnicanal',
        description: 'Ingresos generados por cada peso/dólar invertido en publicidad',
        formula: 'Ingresos atribuidos a la campaña / Gasto en publicidad',
      },
      {
        name: 'ROI de Marketing',
        description: 'Retorno sobre la inversión total en marketing',
        formula: '((Ingresos − Inversión) / Inversión) × 100',
      },
      {
        name: 'Ticket Promedio',
        description: 'Valor promedio de cada transacción o compra',
        formula: 'Ingresos totales / Número de transacciones',
      },
    ],
  },
];

// Lista plana de todos los KPIs para sugerencias rápidas
export const allKpiNames = kpiCategories.flatMap((cat) => cat.kpis.map((k) => k.name));

// Sugerencias de KPI por etapa del funnel
export const kpiSuggestionsByStage: Record<string, string[]> = {
  conciencia: ['Omnichannel Traffic Share', 'Alcance Total (Reach)', 'Impresiones', 'Share of Voice (SOV)', 'CPM'],
  'interes-consideracion': [
    'Tasa de Clics (CTR)',
    'CPL (Costo por Lead)',
    'Tasa de Conversión',
    '% Clientes Multicanal',
    'CPC',
  ],
  'intencion-compra': [
    'Tasa de Conversión',
    'Tasa de Abandono de Carrito',
    'ROAS Omnicanal',
    'BOPIS / Click-&-Collect Rate',
    'Ticket Promedio',
    'CAC Unificado',
  ],
  fidelizacion: [
    'NPS / CSAT Omnicanal',
    'Tasa de Retención',
    'Frecuencia de Compra',
    'CLV Omnicanal',
    'Tasa de Churn',
    'Tasa de Resolución en Primer Contacto',
  ],
  advocacy: [
    'NPS / CSAT Omnicanal',
    'Share of Voice (SOV)',
    'Tasa de Retención',
    'CLV Omnicanal',
    'Frecuencia de Compra',
  ],
};
