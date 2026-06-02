'use client';

import { useState, useCallback } from 'react';
import { funnelStages } from '@/data/funnelStages';
import type { JourneyState } from '@/types/journey';
import { WelcomeStep } from '@/components/WelcomeStep';
import { ChannelSelector } from '@/components/ChannelSelector';
import { FunnelStageStep } from '@/components/FunnelStageStep';
import { StepIndicator } from '@/components/StepIndicator';
import { JourneyPreview } from '@/components/JourneyPreview';
import { PDFExportButton } from '@/components/PDFExportButton';
import { Button } from '@/components/ui/button';

const TOTAL_STEPS = 2 + funnelStages.length + 1; // welcome + channels + 5 stages + preview

const wizardSteps = [
  { label: 'Inicio' },
  { label: 'Canales' },
  ...funnelStages.map((s) => ({ label: s.name })),
  { label: 'Mi Mapa' },
];

const initialState: JourneyState = {
  studentName: '',
  brandName: '',
  selectedChannelIds: [],
  mappings: {},
};

export default function JourneyPage() {
  const [step, setStep] = useState(0);
  const [journey, setJourney] = useState<JourneyState>(initialState);

  const updateField = useCallback((field: 'studentName' | 'brandName', value: string) => {
    setJourney((prev) => ({ ...prev, [field]: value }));
  }, []);

  const toggleChannel = useCallback((channelId: string) => {
    setJourney((prev) => {
      const isSelected = prev.selectedChannelIds.includes(channelId);
      return {
        ...prev,
        selectedChannelIds: isSelected
          ? prev.selectedChannelIds.filter((id) => id !== channelId)
          : [...prev.selectedChannelIds, channelId],
      };
    });
  }, []);

  const updateMapping = useCallback((stageId: string, channelId: string, field: 'objective' | 'kpi', value: string) => {
    setJourney((prev) => ({
      ...prev,
      mappings: {
        ...prev.mappings,
        [stageId]: {
          ...(prev.mappings[stageId] || {}),
          [channelId]: {
            ...(prev.mappings[stageId]?.[channelId] || { objective: '', kpi: '' }),
            [field]: value,
          },
        },
      },
    }));
  }, []);

  const goNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));
  const restart = () => {
    setJourney(initialState);
    setStep(0);
  };

  // Step index mapping:
  // 0 = welcome
  // 1 = channel selector
  // 2..6 = funnel stages (index 0..4 in funnelStages)
  // 7 = preview

  const isPreviewStep = step === TOTAL_STEPS - 1;
  const isFunnelStep = step >= 2 && step <= 2 + funnelStages.length - 1;
  const funnelStageIndex = isFunnelStep ? step - 2 : -1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/20">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-100 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🗺️</span>
            <span className="font-bold text-gray-800 text-sm hidden sm:block">Embudo Multicanal</span>
          </div>
          <div className="flex-1 overflow-x-auto">
            <StepIndicator steps={wizardSteps} currentStep={step} />
          </div>
          {journey.studentName && (
            <div className="hidden sm:block text-xs text-gray-400 whitespace-nowrap">
              {journey.brandName || journey.studentName}
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {step === 0 && (
          <WelcomeStep
            studentName={journey.studentName}
            brandName={journey.brandName}
            onChange={updateField}
            onNext={goNext}
          />
        )}

        {step === 1 && (
          <ChannelSelector
            selectedChannelIds={journey.selectedChannelIds}
            onToggle={toggleChannel}
            onNext={goNext}
            onBack={goBack}
          />
        )}

        {isFunnelStep && (
          <FunnelStageStep
            stage={funnelStages[funnelStageIndex]}
            stageIndex={funnelStageIndex}
            totalStages={funnelStages.length}
            selectedChannelIds={journey.selectedChannelIds}
            mapping={journey.mappings[funnelStages[funnelStageIndex].id] || {}}
            onUpdate={(channelId, field, value) =>
              updateMapping(funnelStages[funnelStageIndex].id, channelId, field, value)
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
                Revisa el mapa completo de <strong>{journey.brandName}</strong>. Puedes descargarlo en PDF o volver a editarlo.
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
                selectedChannelIds={journey.selectedChannelIds}
                mappings={journey.mappings}
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
