export type ChannelCategory = 'pagados' | 'propios' | 'ganados';

export type Channel = {
  id: string;
  name: string;
  category: ChannelCategory;
  icon: string;
  description: string;
};

export type FunnelStage = {
  id: string;
  name: string;
  phase: 'antes' | 'durante' | 'despues';
  description: string;
  shopperQuestion: string; // "¿Cómo me descubre el shopper?"
  color: string;
  bgColor: string;
  borderColor: string;
};

export type ChannelMapping = {
  objective: string;
  kpi: string;
};

// Per-stage state: which channels are active + their objective/KPI
export type StageData = {
  selectedChannelIds: string[];
  mappings: Record<string, ChannelMapping>;
};

export type JourneyState = {
  studentName: string;
  brandName: string;
  stages: Record<string, StageData>;
};

export type KpiCategory = {
  id: string;
  name: string;
  kpis: Kpi[];
};

export type Kpi = {
  name: string;
  description: string;
  formula?: string;
};
