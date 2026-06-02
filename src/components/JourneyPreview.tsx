'use client';

import { getChannelById } from '@/data/channels';
import { funnelStages, phaseLabels, stageEmojis } from '@/data/funnelStages';
import type { StageData } from '@/types/journey';

type JourneyPreviewProps = {
  brandName: string;
  studentName: string;
  stages: Record<string, StageData>;
};

const stageGradients = [
  'from-violet-500 to-violet-600',
  'from-blue-500 to-blue-600',
  'from-emerald-500 to-emerald-600',
  'from-orange-500 to-orange-600',
  'from-rose-500 to-rose-600',
];

const stageTextColors = [
  'text-violet-700',
  'text-blue-700',
  'text-emerald-700',
  'text-orange-700',
  'text-rose-700',
];

const stageLightBg = [
  'bg-violet-50',
  'bg-blue-50',
  'bg-emerald-50',
  'bg-orange-50',
  'bg-rose-50',
];

const categoryBorderColors: Record<string, string> = {
  pagados: 'border-l-blue-400',
  propios: 'border-l-emerald-400',
  ganados: 'border-l-orange-400',
};

const categoryBadgeColors: Record<string, string> = {
  pagados: 'bg-blue-100 text-blue-700',
  propios: 'bg-emerald-100 text-emerald-700',
  ganados: 'bg-orange-100 text-orange-700',
};

export function JourneyPreview({ brandName, studentName, stages }: JourneyPreviewProps) {
  const today = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Collect all unique channels used across all stages, ordered by category
  const allChannelIds = new Set<string>();
  funnelStages.forEach((stage) => {
    (stages[stage.id]?.selectedChannelIds ?? []).forEach((id) => allChannelIds.add(id));
  });

  const orderedChannelIds = [
    ...Array.from(allChannelIds).filter((id) => getChannelById(id)?.category === 'pagados'),
    ...Array.from(allChannelIds).filter((id) => getChannelById(id)?.category === 'propios'),
    ...Array.from(allChannelIds).filter((id) => getChannelById(id)?.category === 'ganados'),
  ];

  const hasAnyData = orderedChannelIds.length > 0;

  return (
    <div id="journey-map-preview" className="bg-white font-sans" style={{ minWidth: 860 }}>
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 text-white px-8 py-6 rounded-t-2xl">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-indigo-200 text-xs font-semibold uppercase tracking-widest mb-1">
              Customer Journey Map · Embudo Multicanal
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">{brandName}</h1>
            <p className="text-indigo-200 text-sm mt-1">
              Elaborado por: <span className="text-white font-semibold">{studentName}</span>
            </p>
          </div>
          <div className="text-right text-xs">
            <div className="text-indigo-300">{today}</div>
            <div className="mt-3 space-y-1">
              {[
                { color: 'bg-blue-300', label: 'Pagados' },
                { color: 'bg-emerald-300', label: 'Propios' },
                { color: 'bg-orange-300', label: 'Ganados' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5 justify-end">
                  <span className={`w-2.5 h-2.5 rounded-full ${color} inline-block`} />
                  <span className="text-indigo-200">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Funnel stage headers */}
        <div className="grid grid-cols-5 gap-2 mt-6">
          {funnelStages.map((stage, i) => (
            <div
              key={stage.id}
              className="rounded-xl px-3 py-2.5 text-center"
              style={{ background: 'rgba(255,255,255,0.15)' }}
            >
              <div className="text-lg mb-0.5">{stageEmojis[stage.id]}</div>
              <div className="text-xs font-semibold text-white opacity-75 uppercase tracking-wide">
                {phaseLabels[stage.phase]}
              </div>
              <div className="text-sm font-bold text-white mt-0.5">{stage.name}</div>
              <div className="text-xs text-indigo-200 mt-1">
                {stages[stage.id]?.selectedChannelIds.length ?? 0} canal(es)
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Body: one row per unique channel ── */}
      {hasAnyData ? (
        <div className="px-6 py-5 space-y-3">
          {orderedChannelIds.map((channelId) => {
            const channel = getChannelById(channelId);
            if (!channel) return null;

            return (
              <div
                key={channelId}
                className={`border border-gray-100 rounded-xl border-l-4 ${categoryBorderColors[channel.category]} overflow-hidden shadow-sm`}
              >
                {/* Channel row header */}
                <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                  <span className="text-lg">{channel.icon}</span>
                  <span className="font-bold text-gray-800 text-sm">{channel.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryBadgeColors[channel.category]}`}>
                    {channel.category}
                  </span>
                </div>

                {/* Stage cells */}
                <div className="grid grid-cols-5 divide-x divide-gray-100">
                  {funnelStages.map((stage, i) => {
                    const stageData = stages[stage.id];
                    const isActiveInStage = stageData?.selectedChannelIds.includes(channelId);
                    const cell = stageData?.mappings[channelId];
                    const hasData = isActiveInStage && (cell?.objective || cell?.kpi);
                    const isSelected = isActiveInStage;

                    return (
                      <div
                        key={stage.id}
                        className={`px-3 py-3 min-h-[70px] ${hasData ? 'bg-white' : isSelected ? stageLightBg[i] + ' bg-opacity-50' : 'bg-gray-50/30'}`}
                      >
                        {hasData ? (
                          <div className="space-y-2">
                            {cell?.objective && (
                              <div>
                                <div className={`text-[10px] font-bold ${stageTextColors[i]} mb-0.5 uppercase tracking-wide`}>
                                  🎯 Objetivo
                                </div>
                                <p className="text-xs text-gray-700 leading-snug">{cell.objective}</p>
                              </div>
                            )}
                            {cell?.kpi && (
                              <div>
                                <div className={`text-[10px] font-bold ${stageTextColors[i]} mb-0.5 uppercase tracking-wide`}>
                                  📊 KPI
                                </div>
                                <p className="text-xs text-gray-700 leading-snug">{cell.kpi}</p>
                              </div>
                            )}
                          </div>
                        ) : isSelected ? (
                          <div className="text-xs text-gray-300 italic">Canal activo</div>
                        ) : (
                          <div className="text-xs text-gray-200">—</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="px-8 py-12 text-center text-gray-400">
          <p className="text-4xl mb-3">🗺️</p>
          <p className="text-sm">No seleccionaste canales en ninguna etapa del funnel.</p>
        </div>
      )}

      {/* ── Footer ── */}
      <div className="px-6 pb-5 pt-1">
        <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-xs text-gray-400">
          <span>
            {brandName} · {studentName}
          </span>
          <span>Embudo Multicanal — Herramienta educativa</span>
        </div>
      </div>
    </div>
  );
}
