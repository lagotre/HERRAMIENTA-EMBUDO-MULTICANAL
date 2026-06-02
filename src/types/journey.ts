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
  shopperQuestion: string;
  color: string;
  bgColor: string;
  borderColor: string;
};

export type ChannelMapping = {
  objective: string;
  kpi: string;
};

export type StageData = {
  selectedChannelIds: string[];
  mappings: Record<string, ChannelMapping>;
};

export type JourneyState = {
  groupNumber: string;          // grupo del estudiante (reemplaza studentName)
  brandName: string;
  date: string;                 // fecha del ejercicio
  shopperProfile: string;       // buyer persona / perfil del shopper
  customChannelNames: Record<string, string>; // nombres para canales "Otro"
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
