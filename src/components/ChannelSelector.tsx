'use client';

import { channels, channelsByCategory } from '@/data/channels';
import type { Channel } from '@/types/journey';
import { Button } from '@/components/ui/button';

type ChannelSelectorProps = {
  selectedChannelIds: string[];
  onToggle: (channelId: string) => void;
  onNext: () => void;
  onBack: () => void;
};

const categoryConfig = {
  pagados: {
    label: 'Canales Pagados',
    description: 'Inversión publicitaria para alcanzar audiencias',
    color: 'bg-blue-600',
    lightBg: 'bg-blue-50',
    border: 'border-blue-200',
    selectedBorder: 'border-blue-500 bg-blue-50',
    checkColor: 'bg-blue-600',
    textColor: 'text-blue-700',
  },
  propios: {
    label: 'Canales Propios',
    description: 'Activos digitales y físicos de la marca',
    color: 'bg-emerald-600',
    lightBg: 'bg-emerald-50',
    border: 'border-emerald-200',
    selectedBorder: 'border-emerald-500 bg-emerald-50',
    checkColor: 'bg-emerald-600',
    textColor: 'text-emerald-700',
  },
  ganados: {
    label: 'Canales Ganados',
    description: 'Visibilidad lograda por mérito propio o de clientes',
    color: 'bg-orange-500',
    lightBg: 'bg-orange-50',
    border: 'border-orange-200',
    selectedBorder: 'border-orange-500 bg-orange-50',
    checkColor: 'bg-orange-500',
    textColor: 'text-orange-700',
  },
} as const;

function ChannelCard({
  channel,
  isSelected,
  onToggle,
  config,
}: {
  channel: Channel;
  isSelected: boolean;
  onToggle: () => void;
  config: (typeof categoryConfig)[keyof typeof categoryConfig];
}) {
  return (
    <button
      onClick={onToggle}
      className={`w-full text-left p-3 rounded-xl border-2 transition-all cursor-pointer group ${
        isSelected ? config.selectedBorder : `border-gray-200 bg-white hover:${config.border}`
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-5 h-5 rounded-md border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
            isSelected ? `${config.checkColor} border-transparent` : 'border-gray-300 bg-white'
          }`}
        >
          {isSelected && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-base">{channel.icon}</span>
            <span className="font-semibold text-sm text-gray-800">{channel.name}</span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5 leading-snug">{channel.description}</p>
        </div>
      </div>
    </button>
  );
}

export function ChannelSelector({ selectedChannelIds, onToggle, onNext, onBack }: ChannelSelectorProps) {
  const canContinue = selectedChannelIds.length >= 1;

  const toggleAll = (category: keyof typeof channelsByCategory) => {
    const categoryChannelIds = channelsByCategory[category].map((c) => c.id);
    const allSelected = categoryChannelIds.every((id) => selectedChannelIds.includes(id));
    if (allSelected) {
      categoryChannelIds.forEach((id) => {
        if (selectedChannelIds.includes(id)) onToggle(id);
      });
    } else {
      categoryChannelIds.forEach((id) => {
        if (!selectedChannelIds.includes(id)) onToggle(id);
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">¿Dónde está tu shopper?</h2>
        <p className="text-gray-500 mt-1 text-sm">
          Selecciona los canales que usa o podría usar tu marca. Puedes elegir tantos como quieras.
        </p>
        <div className="mt-2 inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm">
          <span className="font-semibold">{selectedChannelIds.length}</span>
          <span>canal{selectedChannelIds.length !== 1 ? 'es' : ''} seleccionado{selectedChannelIds.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="space-y-5">
        {(Object.keys(categoryConfig) as Array<keyof typeof categoryConfig>).map((cat) => {
          const config = categoryConfig[cat];
          const catChannels = channelsByCategory[cat];
          const allSelected = catChannels.every((c) => selectedChannelIds.includes(c.id));

          return (
            <div key={cat} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className={`px-5 py-3 ${config.lightBg} border-b ${config.border} flex items-center justify-between`}>
                <div>
                  <span className={`font-bold text-sm ${config.textColor}`}>{config.label}</span>
                  <p className="text-xs text-gray-500">{config.description}</p>
                </div>
                <button
                  onClick={() => toggleAll(cat)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                    allSelected
                      ? `${config.color} text-white border-transparent`
                      : `bg-white text-gray-600 border-gray-200 hover:border-gray-300`
                  }`}
                >
                  {allSelected ? 'Deseleccionar todos' : 'Seleccionar todos'}
                </button>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {catChannels.map((channel) => (
                  <ChannelCard
                    key={channel.id}
                    channel={channel}
                    isSelected={selectedChannelIds.includes(channel.id)}
                    onToggle={() => onToggle(channel.id)}
                    config={config}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 mt-6">
        <Button variant="outline" onClick={onBack} className="px-6 py-2.5 rounded-xl">
          ← Atrás
        </Button>
        <Button
          onClick={onNext}
          disabled={!canContinue}
          className="flex-1 py-2.5 font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 rounded-xl"
        >
          {canContinue
            ? `Continuar con ${selectedChannelIds.length} canal${selectedChannelIds.length !== 1 ? 'es' : ''} →`
            : 'Selecciona al menos un canal'}
        </Button>
      </div>
    </div>
  );
}
