import type { FunnelStage } from '@/types/journey';

export const funnelStages: FunnelStage[] = [
  {
    id: 'conciencia',
    name: 'Conciencia',
    phase: 'antes',
    description:
      'El shopper tiene una necesidad pero aún no conoce tu marca ni tu producto. Aquí ocurre el primer contacto.',
    shopperQuestion:
      '¿En qué canales puede descubrir el shopper que tu marca o producto existe?',
    color: 'text-violet-700',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-300',
  },
  {
    id: 'interes-consideracion',
    name: 'Interés y Consideración',
    phase: 'antes',
    description:
      'El shopper ya conoce la marca y empieza a evaluarla. Compara opciones, busca información y se educa.',
    shopperQuestion:
      '¿Dónde busca información el shopper para evaluar si tu marca es la mejor opción?',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
  },
  {
    id: 'intencion-compra',
    name: 'Intención y Compra',
    phase: 'durante',
    description:
      'El shopper está listo para comprar. El objetivo es que la transacción ocurra con la menor fricción posible.',
    shopperQuestion:
      '¿En qué canal o punto de venta concreta el shopper su decisión de compra?',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
  },
  {
    id: 'fidelizacion',
    name: 'Fidelización',
    phase: 'despues',
    description:
      'El cliente ya compró. Ahora el objetivo es retenerlo, acompañarlo en el posventa y motivar la recompra.',
    shopperQuestion:
      '¿A través de qué canales mantienes la relación con el cliente después de la compra?',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300',
  },
  {
    id: 'advocacy',
    name: 'Advocacy',
    phase: 'despues',
    description:
      'El cliente satisfecho se convierte en promotor espontáneo de la marca, generando recomendaciones y contenido.',
    shopperQuestion:
      '¿En qué canales el cliente comparte su experiencia y recomienda tu marca?',
    color: 'text-rose-700',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-300',
  },
];

export const phaseLabels: Record<string, string> = {
  antes: 'Antes de la Compra',
  durante: 'Durante la Compra',
  despues: 'Después de la Compra',
};

export const stageEmojis: Record<string, string> = {
  conciencia: '👁️',
  'interes-consideracion': '🤔',
  'intencion-compra': '🛍️',
  fidelizacion: '💛',
  advocacy: '📣',
};
