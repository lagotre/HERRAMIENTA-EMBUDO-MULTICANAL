'use client';

import { funnelStages, stageEmojis, phaseLabels } from '@/data/funnelStages';
import type { StageData } from '@/types/journey';

type FunnelVisualizerProps = {
  currentStageId: string | null;
  stages: Record<string, StageData>;
  /** 'sidebar' = wizard progress panel | 'preview' = all stages fully colored */
  mode?: 'sidebar' | 'preview';
};

// SVG polygon points per stage (viewBox 0 0 200 400, each stage 80px tall)
// Trapezoids get progressively narrower toward the bottom
const POLYGONS = [
  '0,0   200,0   183,80  17,80',        // Conciencia
  '17,80  183,80  164,160 36,160',       // Interés
  '36,160 164,160 143,240 57,240',       // Intención
  '57,240 143,240 128,320 72,320',       // Fidelización
  '72,320 128,320 114,400 86,400',       // Advocacy
];

const STAGE_CENTER_Y = [40, 120, 200, 280, 360]; // midpoint of each 80px band

const COLORS_ACTIVE  = ['#8B5CF6', '#3B82F6', '#10B981', '#F97316', '#F43F5E'];
const COLORS_DONE    = ['#6D28D9', '#1D4ED8', '#047857', '#C2410C', '#BE123C'];
const COLOR_PENDING  = '#E5E7EB';

const PHASE_DOTS = [
  { color: 'bg-violet-400', label: 'Antes de la Compra' },
  { color: 'bg-emerald-500', label: 'Durante la Compra' },
  { color: 'bg-orange-400', label: 'Después de la Compra' },
];

export function FunnelVisualizer({ currentStageId, stages, mode = 'sidebar' }: FunnelVisualizerProps) {
  const currentIndex = funnelStages.findIndex((s) => s.id === currentStageId);
  // In preview mode treat every stage as completed
  const effectiveCurrentIndex = mode === 'preview' ? funnelStages.length : currentIndex;

  return (
    <div className="flex flex-col">
      {mode === 'sidebar' && (
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 text-center">
          Customer Journey
        </p>
      )}

      {/* Funnel SVG + HTML text overlay (hybrid for reliable emoji rendering) */}
      <div className="relative w-full">
        <svg
          viewBox="0 0 200 400"
          className="w-full block"
        >
          {funnelStages.map((stage, i) => {
            const isActive    = stage.id === currentStageId;
            const isCompleted = effectiveCurrentIndex > i;
            const fill =
              isActive    ? COLORS_ACTIVE[i]  :
              isCompleted ? COLORS_DONE[i]    :
                            COLOR_PENDING;
            return (
              <polygon
                key={stage.id}
                points={POLYGONS[i]}
                fill={fill}
                stroke="white"
                strokeWidth="2.5"
                strokeLinejoin="round"
                style={{ transition: 'fill 0.4s ease' }}
              />
            );
          })}
        </svg>

        {/* Text overlay — HTML for crisp emoji + font rendering */}
        <div className="absolute inset-0 pointer-events-none flex flex-col">
          {funnelStages.map((stage, i) => {
            const isActive    = stage.id === currentStageId;
            const isCompleted = effectiveCurrentIndex > i;
            const channelCount = stages[stage.id]?.selectedChannelIds.length ?? 0;
            const textWhite = isActive || isCompleted;

            return (
              <div
                key={stage.id}
                className="flex-1 flex flex-col items-center justify-center text-center gap-0.5"
              >
                <span className="text-sm leading-none">{stageEmojis[stage.id]}</span>
                <span
                  className={`font-bold leading-tight ${
                    mode === 'sidebar' ? 'text-[9px]' : 'text-[10px]'
                  } ${textWhite ? 'text-white' : 'text-gray-400'}`}
                >
                  {stage.name}
                </span>
                {isCompleted && channelCount > 0 && (
                  <span className="text-[8px] text-white opacity-80">
                    ✓ {channelCount} canal{channelCount !== 1 ? 'es' : ''}
                  </span>
                )}
                {isActive && (
                  <span className="text-[8px] text-white opacity-90 animate-pulse">● ahora</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase legend — only in sidebar mode */}
      {mode === 'sidebar' && (
        <div className="mt-4 space-y-1.5">
          {PHASE_DOTS.map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${color}`} />
              <span className="text-[10px] text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Stage-name list below funnel — only in preview mode */}
      {mode === 'preview' && (
        <div className="mt-3 space-y-1">
          {funnelStages.map((stage, i) => (
            <div key={stage.id} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                style={{ backgroundColor: COLORS_DONE[i] }}
              />
              <span className="text-[9px] text-gray-600 font-medium leading-tight">{stage.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
