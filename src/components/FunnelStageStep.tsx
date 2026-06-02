'use client';

import { channelsByCategory, suggestedChannelsByStage, getChannelById, getChannelDisplayName } from '@/data/channels';
import { objectiveSuggestions } from '@/data/objectives';
import { kpiSuggestionsByStage } from '@/data/kpiLibrary';
import { stageEmojis, phaseLabels } from '@/data/funnelStages';
import type { FunnelStage, StageData, Channel } from '@/types/journey';
import { Button } from '@/components/ui/button';
import { SuggestionChips } from '@/components/SuggestionChips';

type FunnelStageStepProps = {
  stage: FunnelStage;
  stageIndex: number;
  totalStages: number;
  nextStageName: string;
  stageData: StageData;
  customChannelNames: Record<string, string>;
  onToggleChannel: (channelId: string) => void;
  onUpdateMapping: (channelId: string, field: 'objective' | 'kpi', value: string) => void;
  onUpdateCustomChannelName: (channelId: string, name: string) => void;
  onNext: () => void;
  onBack: () => void;
};

const categoryConfig = {
  pagados: {
    label: 'Canales Pagados',
    selectedBorder: 'border-blue-400 bg-blue-50',
    checkBg: 'bg-blue-500',
    badgeBg: 'bg-blue-100 text-blue-700',
    cardBorder: 'border-l-blue-400',
    textColor: 'text-blue-700',
  },
  propios: {
    label: 'Canales Propios',
    selectedBorder: 'border-emerald-400 bg-emerald-50',
    checkBg: 'bg-emerald-500',
    badgeBg: 'bg-emerald-100 text-emerald-700',
    cardBorder: 'border-l-emerald-400',
    textColor: 'text-emerald-700',
  },
  ganados: {
    label: 'Canales Ganados',
    selectedBorder: 'border-orange-400 bg-orange-50',
    checkBg: 'bg-orange-500',
    badgeBg: 'bg-orange-100 text-orange-700',
    cardBorder: 'border-l-orange-400',
    textColor: 'text-orange-700',
  },
} as const;

const stageGradients: Record<string, string> = {
  conciencia: 'from-violet-600 to-violet-500',
  'interes-consideracion': 'from-blue-600 to-blue-500',
  'intencion-compra': 'from-emerald-600 to-emerald-500',
  fidelizacion: 'from-orange-500 to-orange-400',
  advocacy: 'from-rose-600 to-rose-500',
};

function ChannelPill({
  channel,
  isSelected,
  isSuggested,
  customName,
  onToggle,
  onCustomNameChange,
}: {
  channel: Channel;
  isSelected: boolean;
  isSuggested: boolean;
  customName: string;
  onToggle: () => void;
  onCustomNameChange: (name: string) => void;
}) {
  const config = categoryConfig[channel.category];
  const isOtro = channel.id.startsWith('otro-');
  const displayLabel = isOtro && customName ? customName : channel.name;

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={onToggle}
        title={channel.description}
        className={`relative flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-left transition-all cursor-pointer ${
          isSelected
            ? config.selectedBorder + ' shadow-sm'
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
      >
        {/* "típico" badge */}
        {isSuggested && !isSelected && (
          <span className="absolute -top-2 -right-1 text-[10px] bg-amber-400 text-amber-900 font-bold px-1.5 py-0.5 rounded-full leading-none">
            ✦ típico
          </span>
        )}

        {/* Checkbox */}
        <div
          className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${
            isSelected ? `${config.checkBg} border-transparent` : 'border-gray-300 bg-white'
          }`}
        >
          {isSelected && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

        <span className="text-base leading-none">{channel.icon}</span>
        <span className="text-sm font-medium text-gray-800 whitespace-nowrap">
          {displayLabel}
        </span>
      </button>

      {/* Inline name input — only for "otro" channels when selected */}
      {isOtro && isSelected && (
        <input
          type="text"
          value={customName}
          placeholder="¿Cuál canal? Ej: TikTok Ads"
          onChange={(e) => onCustomNameChange(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
        />
      )}
    </div>
  );
}

export function FunnelStageStep({
  stage,
  stageIndex,
  totalStages,
  nextStageName,
  stageData,
  customChannelNames,
  onToggleChannel,
  onUpdateMapping,
  onUpdateCustomChannelName,
  onNext,
  onBack,
}: FunnelStageStepProps) {
  const suggested = suggestedChannelsByStage[stage.id] || [];
  const objectiveSuggs = objectiveSuggestions[stage.id] || [];
  const kpiSuggs = kpiSuggestionsByStage[stage.id] || [];
  const selectedIds = stageData.selectedChannelIds;

  const orderedSelectedIds = [
    ...selectedIds.filter((id) => getChannelById(id)?.category === 'pagados'),
    ...selectedIds.filter((id) => getChannelById(id)?.category === 'propios'),
    ...selectedIds.filter((id) => getChannelById(id)?.category === 'ganados'),
  ];

  const filledCount = selectedIds.filter(
    (id) => stageData.mappings[id]?.objective?.trim() || stageData.mappings[id]?.kpi?.trim()
  ).length;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Stage header — compact, sidebar provides context */}
      <div className={`rounded-2xl px-5 py-4 mb-5 bg-gradient-to-r ${stageGradients[stage.id]} text-white shadow-md`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl flex-shrink-0">{stageEmojis[stage.id]}</span>
          <div>
            <div className="text-[10px] font-semibold opacity-70 uppercase tracking-widest">
              {phaseLabels[stage.phase]} · Etapa {stageIndex + 1} de {totalStages}
            </div>
            <h2 className="text-xl font-bold leading-tight">{stage.name}</h2>
            <p className="text-xs opacity-85 mt-0.5 leading-snug">{stage.description}</p>
          </div>
        </div>
      </div>

      {/* ── SECTION 1: Channel picker ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-5 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-800 text-sm">¿En qué canales encuentra tu shopper la marca?</h3>
          <p className="text-xs text-gray-500 mt-0.5">{stage.shopperQuestion}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-gray-400">
              {selectedIds.length > 0
                ? `${selectedIds.length} canal${selectedIds.length !== 1 ? 'es' : ''} seleccionado${selectedIds.length !== 1 ? 's' : ''}`
                : 'Selecciona los canales que aplican a esta etapa'}
            </span>
            <span className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
              ✦ típico = canal frecuente en esta etapa
            </span>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {(Object.keys(categoryConfig) as Array<keyof typeof categoryConfig>).map((cat) => {
            const config = categoryConfig[cat];
            const catChannels = channelsByCategory[cat];
            return (
              <div key={cat}>
                <div className={`text-xs font-bold uppercase tracking-wide mb-2 ${config.textColor}`}>
                  {config.label}
                </div>
                <div className="flex flex-wrap gap-2">
                  {catChannels.map((channel) => (
                    <ChannelPill
                      key={channel.id}
                      channel={channel}
                      isSelected={selectedIds.includes(channel.id)}
                      isSuggested={suggested.includes(channel.id)}
                      customName={customChannelNames[channel.id] ?? ''}
                      onToggle={() => onToggleChannel(channel.id)}
                      onCustomNameChange={(name) => onUpdateCustomChannelName(channel.id, name)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 2: Objective + KPI per selected channel ── */}
      {selectedIds.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800 text-sm">
              Define el objetivo y KPI de cada canal seleccionado
            </h3>
            {selectedIds.length > 1 && (
              <span className="text-xs text-gray-400">
                {filledCount}/{selectedIds.length} completados
              </span>
            )}
          </div>

          {orderedSelectedIds.map((channelId) => {
            const channel = getChannelById(channelId);
            if (!channel) return null;
            const config = categoryConfig[channel.category];
            const mapping = stageData.mappings[channelId] || { objective: '', kpi: '' };
            const displayName = getChannelDisplayName(channelId, customChannelNames);

            return (
              <div
                key={channelId}
                className={`bg-white rounded-xl border border-gray-200 border-l-4 ${config.cardBorder} p-5 shadow-sm`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">{channel.icon}</span>
                  <span className="font-bold text-gray-800">{displayName}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.badgeBg}`}>
                    {config.label.replace('Canales ', '')}
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Objective */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                      🎯 Objetivo en {stage.name}
                    </label>
                    <textarea
                      value={mapping.objective}
                      onChange={(e) => onUpdateMapping(channelId, 'objective', e.target.value)}
                      placeholder={`¿Qué quieres lograr con ${displayName} en esta etapa?`}
                      rows={2}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 resize-none outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
                    />
                    <SuggestionChips
                      suggestions={objectiveSuggs}
                      onSelect={(val) => onUpdateMapping(channelId, 'objective', val)}
                      currentValue={mapping.objective}
                      label="Sugerencias de objetivo:"
                    />
                  </div>

                  {/* KPI */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                      📊 KPI principal para medir el éxito
                    </label>
                    <textarea
                      value={mapping.kpi}
                      onChange={(e) => onUpdateMapping(channelId, 'kpi', e.target.value)}
                      placeholder="Ej: CTR, CAC, NPS, Tasa de conversión, Alcance..."
                      rows={2}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 resize-none outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
                    />
                    <SuggestionChips
                      suggestions={kpiSuggs}
                      onSelect={(val) => onUpdateMapping(channelId, 'kpi', val)}
                      currentValue={mapping.kpi}
                      label="KPIs sugeridos para esta etapa:"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {selectedIds.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center text-sm text-amber-700">
          👆 Selecciona al menos un canal para definir el objetivo y KPI de esta etapa.
          <br />
          <span className="text-xs text-amber-600 mt-1 block">
            Si en esta etapa tu marca no usa ningún canal, puedes avanzar igual.
          </span>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 mt-6">
        <Button variant="outline" onClick={onBack} className="px-6 py-2.5 rounded-xl">
          ← Atrás
        </Button>
        <Button
          onClick={onNext}
          className="flex-1 py-2.5 font-semibold bg-indigo-600 hover:bg-indigo-700 rounded-xl"
        >
          {stageIndex < totalStages - 1
            ? `Siguiente etapa: ${nextStageName} →`
            : 'Ver mi Customer Journey Map →'}
        </Button>
      </div>
    </div>
  );
}
