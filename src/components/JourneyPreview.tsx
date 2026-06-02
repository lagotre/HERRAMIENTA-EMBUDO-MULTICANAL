'use client';

import { getChannelById } from '@/data/channels';
import { funnelStages, phaseLabels } from '@/data/funnelStages';
import type { JourneyMappings } from '@/types/journey';

type JourneyPreviewProps = {
  brandName: string;
  studentName: string;
  selectedChannelIds: string[];
  mappings: JourneyMappings;
};

const stageGradients = [
  'from-violet-500 to-violet-600',
  'from-blue-500 to-blue-600',
  'from-emerald-500 to-emerald-600',
  'from-orange-500 to-orange-600',
  'from-rose-500 to-rose-600',
];

const stageLightBg = [
  'bg-violet-50 border-violet-200',
  'bg-blue-50 border-blue-200',
  'bg-emerald-50 border-emerald-200',
  'bg-orange-50 border-orange-200',
  'bg-rose-50 border-rose-200',
];

const stageTextColors = [
  'text-violet-700',
  'text-blue-700',
  'text-emerald-700',
  'text-orange-700',
  'text-rose-700',
];

const stageBorderColors = [
  'border-violet-300',
  'border-blue-300',
  'border-emerald-300',
  'border-orange-300',
  'border-rose-300',
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

export function JourneyPreview({ brandName, studentName, selectedChannelIds, mappings }: JourneyPreviewProps) {
  const today = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Group channels by category for ordered display
  const orderedChannelIds = [
    ...selectedChannelIds.filter((id) => getChannelById(id)?.category === 'pagados'),
    ...selectedChannelIds.filter((id) => getChannelById(id)?.category === 'propios'),
    ...selectedChannelIds.filter((id) => getChannelById(id)?.category === 'ganados'),
  ];

  const phases = ['antes', 'durante', 'despues'] as const;

  return (
    <div id="journey-map-preview" className="bg-white font-sans" style={{ minWidth: 900 }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white px-8 py-6 rounded-t-2xl">
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
          <div className="text-right">
            <div className="text-indigo-200 text-xs">{today}</div>
            <div className="mt-2 flex gap-3 text-xs">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-300 inline-block" />
                <span className="text-indigo-200">Pagados</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 inline-block" />
                <span className="text-indigo-200">Propios</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-300 inline-block" />
                <span className="text-indigo-200">Ganados</span>
              </div>
            </div>
          </div>
        </div>

        {/* Phase labels */}
        <div className="grid grid-cols-5 gap-2 mt-6">
          {funnelStages.map((stage, i) => (
            <div
              key={stage.id}
              className={`rounded-xl px-3 py-2 bg-gradient-to-br ${stageGradients[i]} bg-opacity-60 text-center`}
              style={{ background: 'rgba(255,255,255,0.15)' }}
            >
              <div className="text-xs font-semibold text-white opacity-80 uppercase tracking-wide">
                {phaseLabels[stage.phase]}
              </div>
              <div className="text-sm font-bold text-white mt-0.5">{stage.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Journey body */}
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
                  const cell = mappings[stage.id]?.[channelId];
                  const hasData = cell?.objective || cell?.kpi;

                  return (
                    <div key={stage.id} className={`px-3 py-3 ${hasData ? 'bg-white' : 'bg-gray-50/50'}`}>
                      {hasData ? (
                        <div className="space-y-2">
                          {cell?.objective && (
                            <div>
                              <div className={`text-xs font-semibold ${stageTextColors[i]} mb-0.5`}>🎯 Objetivo</div>
                              <p className="text-xs text-gray-700 leading-snug">{cell.objective}</p>
                            </div>
                          )}
                          {cell?.kpi && (
                            <div>
                              <div className={`text-xs font-semibold ${stageTextColors[i]} mb-0.5`}>📊 KPI</div>
                              <p className="text-xs text-gray-700 leading-snug">{cell.kpi}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-300 italic">—</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-6 pb-5 pt-1">
        <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-xs text-gray-400">
          <span>Customer Journey Map · {brandName} · {studentName}</span>
          <span>Embudo Multicanal — Herramienta educativa</span>
        </div>
      </div>
    </div>
  );
}
