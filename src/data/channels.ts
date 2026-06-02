import type { Channel } from '@/types/journey';

export const channels: Channel[] = [
  // PAGADOS
  {
    id: 'atl',
    name: 'ATL',
    category: 'pagados',
    icon: '📺',
    description: 'Above The Line — TV, radio, prensa, medios masivos',
  },
  {
    id: 'btl',
    name: 'BTL',
    category: 'pagados',
    icon: '🎪',
    description: 'Below The Line — activaciones, eventos, POP, material en punto de venta',
  },
  {
    id: 'google-ads',
    name: 'Google Ads',
    category: 'pagados',
    icon: '🔍',
    description: 'Búsqueda pagada, Display, YouTube, Shopping',
  },
  {
    id: 'meta-ads',
    name: 'Meta Ads',
    category: 'pagados',
    icon: '📱',
    description: 'Facebook Ads e Instagram Ads',
  },
  {
    id: 'retail-media',
    name: 'Retail Media',
    category: 'pagados',
    icon: '🛒',
    description: 'Publicidad dentro de plataformas de retail (Rappi, Mercado Libre, Éxito, etc.)',
  },
  {
    id: 'programatica',
    name: 'Programática',
    category: 'pagados',
    icon: '🤖',
    description: 'Compra automatizada de espacios publicitarios digitales',
  },

  // PROPIOS
  {
    id: 'ugc',
    name: 'UGC',
    category: 'propios',
    icon: '📸',
    description: 'User Generated Content — contenido creado por los propios usuarios/clientes',
  },
  {
    id: 'redes-sociales',
    name: 'Redes Sociales',
    category: 'propios',
    icon: '💬',
    description: 'Perfiles orgánicos en Instagram, Facebook, TikTok, LinkedIn, X, etc.',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    category: 'propios',
    icon: '💚',
    description: 'Comunicación directa con clientes vía WhatsApp Business',
  },
  {
    id: 'tienda-online',
    name: 'Tienda Online',
    category: 'propios',
    icon: '🌐',
    description: 'Sitio web o e-commerce propio de la marca',
  },
  {
    id: 'marketplace',
    name: 'Storefront Marketplace',
    category: 'propios',
    icon: '🏪',
    description: 'Tienda oficial en marketplaces (Mercado Libre, Rappi, Falabella, etc.)',
  },
  {
    id: 'tienda-fisica',
    name: 'Tienda Física',
    category: 'propios',
    icon: '🏬',
    description: 'Punto de venta físico, sucursal o showroom',
  },
  {
    id: 'email-crm',
    name: 'Email / CRM',
    category: 'propios',
    icon: '📧',
    description: 'Email marketing, newsletters, automatizaciones de CRM',
  },

  // GANADOS
  {
    id: 'seo',
    name: 'SEO',
    category: 'ganados',
    icon: '📈',
    description: 'Posicionamiento orgánico en buscadores',
  },
  {
    id: 'social-media-organico',
    name: 'Social Media Orgánico',
    category: 'ganados',
    icon: '🌱',
    description: 'Alcance orgánico, viralizaciones y menciones espontáneas en redes',
  },
  {
    id: 'pr-medios',
    name: 'PR / Medios',
    category: 'ganados',
    icon: '📰',
    description: 'Relaciones públicas, cobertura editorial, notas de prensa',
  },
  {
    id: 'backlinks',
    name: 'Backlinks',
    category: 'ganados',
    icon: '🔗',
    description: 'Enlaces entrantes desde otros sitios web',
  },
  {
    id: 'voz-a-voz',
    name: 'Voz a Voz',
    category: 'ganados',
    icon: '🗣️',
    description: 'Recomendaciones orgánicas de clientes satisfechos, promotores de la marca',
  },
];

export const channelsByCategory = {
  pagados: channels.filter((c) => c.category === 'pagados'),
  propios: channels.filter((c) => c.category === 'propios'),
  ganados: channels.filter((c) => c.category === 'ganados'),
};

export const getChannelById = (id: string) => channels.find((c) => c.id === id);
