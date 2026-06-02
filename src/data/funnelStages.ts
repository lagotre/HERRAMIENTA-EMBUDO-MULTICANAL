import type { FunnelStage } from '@/types/journey';

export const funnelStages: FunnelStage[] = [
  {
    id: 'conciencia',
    name: 'Conciencia',
    phase: 'antes',
    description:
      'El consumidor descubre la marca o el producto. El objetivo es generar visibilidad y reconocimiento a través de campañas y contenido multicanal.',
    color: 'text-violet-700',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-300',
  },
  {
    id: 'interes-consideracion',
    name: 'Interés y Consideración',
    phase: 'antes',
    description:
      'El consumidor evalúa la marca y la compara con alternativas. El objetivo es educar, generar interacción y acompañar la evaluación de necesidades en cualquier canal.',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
  },
  {
    id: 'intencion-compra',
    name: 'Intención y Compra',
    phase: 'durante',
    description:
      'El consumidor toma la decisión de compra. El objetivo es facilitar la conversión a través de experiencias fluidas en los puntos de venta físicos y digitales integrados.',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
  },
  {
    id: 'fidelizacion',
    name: 'Fidelización',
    phase: 'despues',
    description:
      'El cliente ya compró. El objetivo es retenerlo, generar recompra y brindar una experiencia posventa que supere sus expectativas.',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300',
  },
  {
    id: 'advocacy',
    name: 'Advocacy',
    phase: 'despues',
    description:
      'El cliente satisfecho se convierte en promotor de la marca. El objetivo es generar recomendaciones espontáneas (boca a boca), reseñas positivas y contenido generado por el usuario.',
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
