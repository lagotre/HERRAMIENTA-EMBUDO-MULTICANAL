'use client';

import { getChannelById } from '@/data/channels';
import { funnelStages, phaseLabels } from '@/data/funnelStages';
import { FunnelVisualizer } from '@/components/FunnelVisualizer';
import type { StageData } from '@/types/journey';

type JourneyPreviewProps = {
  brandName: string;
  studentName: string;
  stages: Record<string, StageData>;
};

// Per-stage visual tokens
const STAGE_HEADER_BG  = [
  'bg-violet-600',
  'bg-blue-600',
  'bg-emerald-600',
  'bg-orange-500',
  'bg-rose-600',
];
const STAGE_ACCENT_BG = [
  'bg-violet-50',
  'bg-blue-50',
  'bg-emerald-50',
  'bg-orange-50',
  'bg-rose-50',
];
const STAGE_ACCENT_BORDER = [
  'border-violet-200',
  'border-blue-200',
  'border-emerald-200',
  'border-orange-200',
  'border-rose-200',
];
const STAGE_LABEL_COLOR = [
  'text-violet-600',
  'text-blue-600',
  'text-emerald-600',
  'text-orange-600',
  'text-rose-600',
];

const CATEGORY_BORDER: Record<string, string> = {
  pagados: 'border-l-blue-400',
  propios: 'border-l-emerald-400',
  ganados: 'border-l-orange-400',
};
const CATEGORY_BADGE: Record<string, string> = {
  pagados: 'bg-blue-100 text-blue-700',
  propios: 'bg-emerald-100 text-emerald-700',
  ganados: 'bg-orange-100 text-orange-700',
};

// Group funnel stages into phases for the phase banner
const PHASES = [
  { label: 'Antes de la Compra',   stageIds: ['conciencia', 'interes-consideracion'], cols: 2 },
  { label: 'Durante la Compra',    stageIds: ['intencion-compra'],                     cols: 1 },
  { label: 'Después de la Compra', stageIds: ['fidelizacion', 'advocacy'],             cols: 2 },
];

export function JourneyPreview({ brandName, studentName, stages }: JourneyPreviewProps) {
  const today = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const totalChannels = new Set(
    funnelStages.flatMap((s) => stages[s.id]?.selectedChannelIds ?? [])
  ).size;

  return (
    <div
      id="journey-map-preview"
      className="bg-white font-sans"
      style={{ minWidth: 1060 }}
    >
      {/* ══ HEADER ══ */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 text-white px-8 py-5">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-1">
              Customer Journey Map · Embudo Multicanal
            </p>
            <h1 className="text-2xl font-extrabold tracking-tight">{brandName}</h1>
            <p className="text-indigo-200 text-xs mt-0.5">
              Elaborado por:{' '}
              <span className="text-white font-semibold">{studentName}</span>
            </p>
          </div>
          <div className="text-right text-xs flex-shrink-0">
            <p className="text-indigo-300 mb-2">{today}</p>
            <div className="space-y-1">
              {[
                { c: 'bg-blue-300',    l: 'Canales Pagados' },
                { c: 'bg-emerald-300', l: 'Canales Propios' },
                { c: 'bg-orange-300',  l: 'Canales Ganados' },
              ].map(({ c, l }) => (
                <div key={l} className="flex items-center gap-1.5 justify-end">
                  <span className={`w-2 h-2 rounded-full ${c}`} />
                  <span className="text-indigo-200">{l}</span>
                </div>
              ))}
            </div>
            <p className="text-indigo-300 mt-2 text-[10px]">
              {totalChannels} canal{totalChannels !== 1 ? 'es' : ''} mapeados
            </p>
          </div>
        </div>
      </div>

      {/* ══ BODY: funnel left + 5 stage columns ══ */}
      <div className="flex">

        {/* ─ Left column: Funnel visual ─ */}
        <div
          className="flex-shrink-0 bg-gray-50 border-r border-gray-200 flex flex-col"
          style={{ width: 150 }}
        >
          {/* Phase banner placeholder (aligns with the banner on the right) */}
          <div className="h-8 border-b border-gray-200 bg-gray-100 flex items-center justify-center">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">Etapas</span>
          </div>

          {/* Funnel fills remaining height */}
          <div className="flex-1 p-3 flex flex-col justify-center">
            <FunnelVisualizer
              currentStageId={null}
              stages={stages}
              mode="preview"
            />
          </div>
        </div>

        {/* ─ Right: 5 stage columns ─ */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Phase banner row */}
          <div className="flex h-8 border-b border-gray-200">
            {PHASES.map(({ label, stageIds, cols }) => {
              const phaseColors: Record<string, string> = {
                'Antes de la Compra':   'bg-violet-100 text-violet-700',
                'Durante la Compra':    'bg-emerald-100 text-emerald-700',
                'Después de la Compra': 'bg-orange-100 text-orange-700',
              };
              return (
                <div
                  key={label}
                  className={`flex items-center justify-center border-r border-gray-200 last:border-r-0 text-[10px] font-bold uppercase tracking-wide ${phaseColors[label]}`}
                  style={{ flex: cols }}
                >
                  {label}
                </div>
              );
            })}
          </div>

          {/* Stage columns */}
          <div className="flex flex-1 divide-x divide-gray-150">
            {funnelStages.map((stage, i) => {
              const stageData = stages[stage.id];
              const channelIds = stageData?.selectedChannelIds ?? [];

              return (
                <div key={stage.id} className="flex-1 flex flex-col min-w-0">
                  {/* Stage header */}
                  <div className={`${STAGE_HEADER_BG[i]} px-3 py-2 text-white`}>
                    <p className="text-[10px] font-bold uppercase tracking-wide opacity-80">
                      Etapa {i + 1}
                    </p>
                    <p className="text-xs font-extrabold leading-tight">{stage.name}</p>
                    <p className="text-[9px] opacity-75 mt-0.5">
                      {channelIds.length} canal{channelIds.length !== 1 ? 'es' : ''}
                    </p>
                  </div>

                  {/* Channel cards */}
                  <div className="flex-1 p-2 space-y-2 bg-white">
                    {channelIds.length === 0 ? (
                      <div className="flex items-center justify-center h-16">
                        <span className="text-xs text-gray-300 italic">Sin canales</span>
                      </div>
                    ) : (
                      channelIds.map((channelId) => {
                        const channel = getChannelById(channelId);
                        if (!channel) return null;
                        const mapping = stageData?.mappings[channelId];
                        const hasObjective = !!mapping?.objective?.trim();
                        const hasKpi = !!mapping?.kpi?.trim();

                        return (
                          <div
                            key={channelId}
                            className={`rounded-lg border border-l-4 ${CATEGORY_BORDER[channel.category]} ${STAGE_ACCENT_BG[i]} ${STAGE_ACCENT_BORDER[i]} p-2`}
                          >
                            {/* Channel name */}
                            <div className="flex items-center gap-1 mb-1.5">
                              <span className="text-sm leading-none">{channel.icon}</span>
                              <span className="text-[10px] font-bold text-gray-800 leading-tight">
                                {channel.name}
                              </span>
                              <span
                                className={`ml-auto text-[8px] px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0 ${CATEGORY_BADGE[channel.category]}`}
                              >
                                {channel.category}
                              </span>
                            </div>

                            {/* Objective */}
                            {hasObjective ? (
                              <div className="mb-1">
                                <p className={`text-[9px] font-bold uppercase tracking-wide mb-0.5 ${STAGE_LABEL_COLOR[i]}`}>
                                  🎯 Objetivo
                                </p>
                                <p className="text-[10px] text-gray-700 leading-snug">
                                  {mapping?.objective}
                                </p>
                              </div>
                            ) : (
                              <p className="text-[9px] text-gray-300 italic mb-1">Sin objetivo definido</p>
                            )}

                            {/* KPI */}
                            {hasKpi ? (
                              <div>
                                <p className={`text-[9px] font-bold uppercase tracking-wide mb-0.5 ${STAGE_LABEL_COLOR[i]}`}>
                                  📊 KPI
                                </p>
                                <p className="text-[10px] text-gray-700 leading-snug">
                                  {mapping?.kpi}
                                </p>
                              </div>
                            ) : (
                              <p className="text-[9px] text-gray-300 italic">Sin KPI definido</p>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══ FOOTER ══ */}
      <div className="border-t border-gray-100 px-6 py-3 flex items-center justify-between bg-gray-50">
        <span className="text-[10px] text-gray-400">
          {brandName} · {studentName}
        </span>
        <span className="text-[10px] text-gray-400">
          Embudo Multicanal — Herramienta Educativa
        </span>
      </div>
    </div>
  );
}
