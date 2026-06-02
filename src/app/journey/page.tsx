'use client';

import { useState, useCallback } from 'react';
import { funnelStages } from '@/data/funnelStages';
import type { JourneyState, StageData } from '@/types/journey';
import { WelcomeStep } from '@/components/WelcomeStep';
import { FunnelStageStep } from '@/components/FunnelStageStep';
import { StepIndicator } from '@/components/StepIndicator';
import { JourneyPreview } from '@/components/JourneyPreview';
import { PDFExportButton } from '@/components/PDFExportButton';
import { Button } from '@/components/ui/button';

// Steps: 0=welcome, 1..5=funnel stages, 6=preview
const TOTAL_STEPS = 1 + funnelStages.length + 1;

const wizardSteps = [
  { label: 'Inicio' },
  ...funnelStages.map((s) => ({ label: s.name })),
  { label: 'Mi Mapa' },
];

const emptyStageData = (): StageData => ({ selectedChannelIds: [], mappings: {} });

const initialState: JourneyState = {
  studentName: '',
  brandName: '',
  stages: Object.fromEntries(funnelStages.map((s) => [s.id, emptyStageData()])),
};

export default function JourneyPage() {
  const [step, setStep] = useState(0);
  const [journey, setJourney] = useState<JourneyState>(initialState);

  const updateField = useCallback((field: 'studentName' | 'brandName', value: string) => {
    setJourney((prev) => ({ ...prev, [field]: value }));
  }, []);

  const toggleChannel = useCallback((stageId: string, channelId: string) => {
    setJourney((prev) => {
      const stageData = prev.stages[stageId] ?? emptyStageData();
      const isSelected = stageData.selectedChannelIds.includes(channelId);
      return {
        ...prev,
        stages: {
          ...prev.stages,
          [stageId]: {
            ...stageData,
            selectedChannelIds: isSelected
              ? stageData.selectedChannelIds.filter((id) => id !== channelId)
              : [...stageData.selectedChannelIds, channelId],
          },
        },
      };
    });
  }, []);

  const updateMapping = useCallback(
    (stageId: string, channelId: string, field: 'objective' | 'kpi', value: string) => {
      setJourney((prev) => {
        const stageData = prev.stages[stageId] ?? emptyStageData();
        return {
          ...prev,
          stages: {
            ...prev.stages,
            [stageId]: {
              ...stageData,
              mappings: {
                ...stageData.mappings,
                [channelId]: {
                  ...(stageData.mappings[channelId] ?? { objective: '', kpi: '' }),
                  [field]: value,
                },
              },
            },
          },
        };
      });
    },
    []
  );

  const goNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));
  const restart = () => {
    setJourney(initialState);
    setStep(0);
  };

  const isPreviewStep = step === TOTAL_STEPS - 1;
  const isFunnelStep = step >= 1 && step <= funnelStages.length;
  const funnelStageIndex = isFunnelStep ? step - 1 : -1;
  const currentStage = isFunnelStep ? funnelStages[funnelStageIndex] : null;

  // Next stage name for the button label
  const nextStageName =
    isFunnelStep && funnelStageIndex < funnelStages.length - 1
      ? funnelStages[funnelStageIndex + 1].name
      : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/20">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-100 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-lg">🗺️</span>
            <span className="font-bold text-gray-800 text-sm hidden sm:block">Embudo Multicanal</span>
          </div>
          <div className="flex-1 overflow-x-auto">
            <StepIndicator steps={wizardSteps} currentStep={step} />
          </div>
          {journey.brandName && (
            <div className="hidden sm:block text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
              {journey.brandName}
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {step === 0 && (
          <WelcomeStep
            studentName={journey.studentName}
            brandName={journey.brandName}
            onChange={updateField}
            onNext={goNext}
          />
        )}

        {isFunnelStep && currentStage && (
          <FunnelStageStep
            stage={currentStage}
            stageIndex={funnelStageIndex}
            totalStages={funnelStages.length}
            nextStageName={nextStageName}
            stageData={journey.stages[currentStage.id] ?? emptyStageData()}
            onToggleChannel={(channelId) => toggleChannel(currentStage.id, channelId)}
            onUpdateMapping={(channelId, field, value) =>
              updateMapping(currentStage.id, channelId, field, value)
            }
            onNext={goNext}
            onBack={goBack}
          />
        )}

        {isPreviewStep && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Tu Customer Journey Map</h2>
              <p className="text-gray-500 text-sm mt-1">
                El recorrido completo del shopper de <strong>{journey.brandName}</strong> a través de todos los canales.
              </p>
            </div>

            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
              <Button variant="outline" onClick={goBack} className="rounded-xl px-5">
                ← Editar etapas
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={restart} className="rounded-xl px-5 text-gray-500">
                  Reiniciar
                </Button>
                <PDFExportButton brandName={journey.brandName} studentName={journey.studentName} />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
              <JourneyPreview
                brandName={journey.brandName}
                studentName={journey.studentName}
                stages={journey.stages}
              />
            </div>

            <div className="mt-6 flex justify-center">
              <PDFExportButton brandName={journey.brandName} studentName={journey.studentName} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
