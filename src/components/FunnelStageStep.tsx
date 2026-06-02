'use client';

import { getChannelById } from '@/data/channels';
import { objectiveSuggestions } from '@/data/objectives';
import { kpiSuggestionsByStage } from '@/data/kpiLibrary';
import type { FunnelStage, StageMapping } from '@/types/journey';
import { Button } from '@/components/ui/button';
import { SuggestionChips } from '@/components/SuggestionChips';

type FunnelStageStepProps = {
  stage: FunnelStage;
  stageIndex: number;
  totalStages: number;
  selectedChannelIds: string[];
  mapping: StageMapping;
  onUpdate: (channelId: string, field: 'objective' | 'kpi', value: string) => void;
  onNext: () => void;
  onBack: () => void;
};

const phaseColors = {
  antes: 'from-violet-500 to-blue-500',
  durante: 'from-blue-500 to-emerald-500',
  despues: 'from-emerald-500 to-rose-500',
};

const phaseLabels = {
  antes: 'Antes de la Compra',
  durante: 'Durante la Compra',
  despues: 'Después de la Compra',
};

export function FunnelStageStep({
  stage,
  stageIndex,
  totalStages,
  selectedChannelIds,
  mapping,
  onUpdate,
  onNext,
  onBack,
}: FunnelStageStepProps) {
  const objectiveSuggs = objectiveSuggestions[stage.id] || [];
  const kpiSuggs = kpiSuggestionsByStage[stage.id] || [];

  const filledCount = selectedChannelIds.filter(
    (id) => (mapping[id]?.objective?.trim() || '') || (mapping[id]?.kpi?.trim() || '')
  ).length;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Stage header */}
      <div className={`rounded-2xl p-5 mb-6 bg-gradient-to-r ${phaseColors[stage.phase]} text-white shadow-md`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-medium opacity-80 uppercase tracking-wider mb-1">
              {phaseLabels[stage.phase]} · Etapa {stageIndex + 1} de {totalStages}
            </div>
            <h2 className="text-2xl font-bold">{stage.name}</h2>
            <p className="text-sm opacity-90 mt-1.5 leading-relaxed">{stage.description}</p>
          </div>
          <div className="text-4xl flex-shrink-0">{stageIndex === 0 ? '👁️' : stageIndex === 1 ? '🤔' : stageIndex === 2 ? '🛍️' : stageIndex === 3 ? '💛' : '📣'}</div>
        </div>
      </div>

      {/* Progress hint */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-4 px-1">
        <span>{selectedChannelIds.length} canal{selectedChannelIds.length !== 1 ? 'es' : ''} a mapear</span>
        <span className="text-indigo-600 font-medium">{filledCount} completado{filledCount !== 1 ? 's' : ''}</span>
      </div>

      {/* Channel cards */}
      <div className="space-y-4">
        {selectedChannelIds.map((channelId) => {
          const channel = getChannelById(channelId);
          if (!channel) return null;
          const channelMapping = mapping[channelId] || { objective: '', kpi: '' };

          const categoryColors = {
            pagados: 'border-l-blue-400',
            propios: 'border-l-emerald-400',
            ganados: 'border-l-orange-400',
          };

          return (
            <div
              key={channelId}
              className={`bg-white rounded-xl border border-gray-200 border-l-4 ${categoryColors[channel.category]} p-5 shadow-sm`}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">{channel.icon}</span>
                <span className="font-bold text-gray-800">{channel.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 capitalize">
                  {channel.category}
                </span>
              </div>

              <div className="space-y-4">
                {/* Objective */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    🎯 Objetivo en esta etapa
                  </label>
                  <textarea
                    value={channelMapping.objective}
                    onChange={(e) => onUpdate(channelId, 'objective', e.target.value)}
                    placeholder="¿Qué quieres lograr con este canal en esta etapa?"
                    rows={2}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 resize-none outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
                  />
                  <SuggestionChips
                    suggestions={objectiveSuggs}
                    onSelect={(val) => onUpdate(channelId, 'objective', val)}
                    currentValue={channelMapping.objective}
                    label="Sugerencias de objetivo:"
                  />
                </div>

                {/* KPI */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    📊 KPI clave
                  </label>
                  <textarea
                    value={channelMapping.kpi}
                    onChange={(e) => onUpdate(channelId, 'kpi', e.target.value)}
                    placeholder="¿Cómo medirás el éxito? Ej: CTR, CAC, NPS, Tasa de conversión..."
                    rows={2}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 resize-none outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
                  />
                  <SuggestionChips
                    suggestions={kpiSuggs}
                    onSelect={(val) => onUpdate(channelId, 'kpi', val)}
                    currentValue={channelMapping.kpi}
                    label="KPIs sugeridos para esta etapa:"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-6">
        <Button variant="outline" onClick={onBack} className="px-6 py-2.5 rounded-xl">
          ← Atrás
        </Button>
        <Button
          onClick={onNext}
          className="flex-1 py-2.5 font-semibold bg-indigo-600 hover:bg-indigo-700 rounded-xl"
        >
          {stageIndex < totalStages - 1 ? `Siguiente etapa →` : 'Ver mi Journey Map →'}
        </Button>
      </div>
    </div>
  );
}
