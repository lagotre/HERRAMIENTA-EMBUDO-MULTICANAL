'use client';

import { useState, useCallback } from 'react';
import { funnelStages } from '@/data/funnelStages';
import type { JourneyState, StageData } from '@/types/journey';
import { WelcomeStep } from '@/components/WelcomeStep';
import { FunnelStageStep } from '@/components/FunnelStageStep';
import { FunnelVisualizer } from '@/components/FunnelVisualizer';
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
  groupNumber: '',
  brandName: '',
  date: '',
  shopperProfile: '',
  customChannelNames: {},
  stages: Object.fromEntries(funnelStages.map((s) => [s.id, emptyStageData()])),
};

export default function JourneyPage() {
  const [step, setStep] = useState(0);
  const [journey, setJourney] = useState<JourneyState>(initialState);

  const updateField = useCallback(
    (field: 'groupNumber' | 'brandName' | 'date' | 'shopperProfile', value: string) => {
      setJourney((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

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

  const updateCustomChannelName = useCallback((channelId: string, name: string) => {
    setJourney((prev) => ({
      ...prev,
      customChannelNames: { ...prev.customChannelNames, [channelId]: name },
    }));
  }, []);

  const goNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));
  const restart = () => {
    setJourney(initialState);
    setStep(0);
  };

  const isPreviewStep  = step === TOTAL_STEPS - 1;
  const isFunnelStep   = step >= 1 && step <= funnelStages.length;
  const funnelStageIndex = isFunnelStep ? step - 1 : -1;
  const currentStage   = isFunnelStep ? funnelStages[funnelStageIndex] : null;
  const nextStageName  =
    isFunnelStep && funnelStageIndex < funnelStages.length - 1
      ? funnelStages[funnelStageIndex + 1].name
      : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/20">

      {/* ── Top bar ── */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-100 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-lg">🗺️</span>
            <span className="font-bold text-gray-800 text-sm hidden sm:block">Embudo Multicanal</span>
          </div>
          <div className="flex-1 overflow-x-auto">
            <StepIndicator steps={wizardSteps} currentStep={step} />
          </div>
          {journey.brandName && (
            <div className="hidden sm:block text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
              {journey.groupNumber && <span className="mr-1">{journey.groupNumber} ·</span>}
              {journey.brandName}
            </div>
          )}
        </div>
      </header>

      {/* ── Main ── */}
      <main
        className={`mx-auto px-4 py-8 ${
          isFunnelStep ? 'max-w-6xl' : isPreviewStep ? 'max-w-full' : 'max-w-xl'
        }`}
      >
        {/* Step 0: Welcome */}
        {step === 0 && (
          <WelcomeStep
            groupNumber={journey.groupNumber}
            brandName={journey.brandName}
            date={journey.date}
            shopperProfile={journey.shopperProfile}
            onChange={updateField}
            onNext={goNext}
          />
        )}

        {/* Steps 1-5: Funnel stages — split layout */}
        {isFunnelStep && currentStage && (
          <div className="flex gap-6 items-start">

            {/* ─ Left sidebar: funnel + shopper profile ─ */}
            <aside className="hidden lg:flex flex-col gap-4 w-52 flex-shrink-0 sticky top-24">
              {/* Funnel visualizer */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <FunnelVisualizer
                  currentStageId={currentStage.id}
                  stages={journey.stages}
                  mode="sidebar"
                />
              </div>

              {/* Shopper profile card */}
              {journey.shopperProfile && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
                  <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1.5">
                    👤 Perfil del Shopper
                  </p>
                  <p className="text-xs text-indigo-800 leading-relaxed">
                    {journey.shopperProfile}
                  </p>
                </div>
              )}

              <p className="text-[10px] text-gray-400 text-center leading-relaxed px-2">
                Selecciona los canales activos en esta etapa y define su objetivo y KPI.
              </p>
            </aside>

            {/* ─ Right: stage form ─ */}
            <div className="flex-1 min-w-0">
              {/* Mobile mini-strip */}
              <div className="lg:hidden mb-4 bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-3 overflow-x-auto">
                {funnelStages.map((stage, i) => {
                  const isActive = stage.id === currentStage.id;
                  const isCompleted = funnelStageIndex > i;
                  return (
                    <div
                      key={stage.id}
                      className={`flex-shrink-0 flex flex-col items-center gap-0.5 ${
                        isActive ? 'opacity-100' : isCompleted ? 'opacity-70' : 'opacity-30'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          isActive ? 'ring-2 ring-indigo-500 ring-offset-1 bg-white' : ''
                        }`}
                      >
                        {i + 1}
                      </div>
                      <span className="text-[9px] text-gray-600 whitespace-nowrap">{stage.name}</span>
                    </div>
                  );
                })}
              </div>

              <FunnelStageStep
                stage={currentStage}
                stageIndex={funnelStageIndex}
                totalStages={funnelStages.length}
                nextStageName={nextStageName}
                stageData={journey.stages[currentStage.id] ?? emptyStageData()}
                customChannelNames={journey.customChannelNames}
                onToggleChannel={(channelId) => toggleChannel(currentStage.id, channelId)}
                onUpdateMapping={(channelId, field, value) =>
                  updateMapping(currentStage.id, channelId, field, value)
                }
                onUpdateCustomChannelName={updateCustomChannelName}
                onNext={goNext}
                onBack={goBack}
              />
            </div>
          </div>
        )}

        {/* Step 6: Preview */}
        {isPreviewStep && (
          <div>
            {/* no-print: these controls don't appear in the printed PDF */}
            <div className="no-print text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Tu Customer Journey Map</h2>
              <p className="text-gray-500 text-sm mt-1">
                El recorrido completo del shopper de <strong>{journey.brandName}</strong> a través de todos los canales.
              </p>
            </div>

            <div className="no-print flex items-center justify-between mb-4 gap-3 flex-wrap">
              <Button variant="outline" onClick={goBack} className="rounded-xl px-5">
                ← Editar etapas
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={restart} className="rounded-xl px-5 text-gray-500">
                  Reiniciar
                </Button>
                <PDFExportButton brandName={journey.brandName} groupNumber={journey.groupNumber} />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 overflow-x-auto shadow-lg">
              <JourneyPreview
                brandName={journey.brandName}
                groupNumber={journey.groupNumber}
                date={journey.date}
                shopperProfile={journey.shopperProfile}
                customChannelNames={journey.customChannelNames}
                stages={journey.stages}
              />
            </div>

            <div className="no-print mt-6 flex justify-center">
              <PDFExportButton brandName={journey.brandName} groupNumber={journey.groupNumber} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
