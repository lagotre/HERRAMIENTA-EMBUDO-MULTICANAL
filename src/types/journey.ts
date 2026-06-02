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
  color: string;
  bgColor: string;
  borderColor: string;
};

export type ChannelMapping = {
  objective: string;
  kpi: string;
};

export type StageMapping = Record<string, ChannelMapping>;

export type JourneyMappings = Record<string, StageMapping>;

export type JourneyState = {
  studentName: string;
  brandName: string;
  selectedChannelIds: string[];
  mappings: JourneyMappings;
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
