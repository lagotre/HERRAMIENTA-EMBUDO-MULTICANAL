'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

type WelcomeStepProps = {
  studentName: string;
  brandName: string;
  onChange: (field: 'studentName' | 'brandName', value: string) => void;
  onNext: () => void;
};

export function WelcomeStep({ studentName, brandName, onChange, onNext }: WelcomeStepProps) {
  const [touched, setTouched] = useState({ studentName: false, brandName: false });

  const canContinue = studentName.trim().length > 1 && brandName.trim().length > 1;

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 mb-4">
          <span className="text-3xl">🗺️</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Journey Map</h1>
        <p className="text-gray-500 text-base">
          Construye el mapa del recorrido de compra de tu marca a través de múltiples canales.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Tu nombre <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={studentName}
            placeholder="Ej. María García"
            onChange={(e) => onChange('studentName', e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, studentName: true }))}
            className={`w-full px-4 py-3 rounded-xl border text-gray-900 placeholder-gray-400 text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 ${
              touched.studentName && studentName.trim().length < 2
                ? 'border-red-300 bg-red-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          />
          {touched.studentName && studentName.trim().length < 2 && (
            <p className="mt-1 text-xs text-red-500">Ingresa tu nombre completo</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Nombre de la marca o negocio <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={brandName}
            placeholder="Ej. Nike Colombia, Café Juan Valdez, Mi Startup..."
            onChange={(e) => onChange('brandName', e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, brandName: true }))}
            className={`w-full px-4 py-3 rounded-xl border text-gray-900 placeholder-gray-400 text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 ${
              touched.brandName && brandName.trim().length < 2
                ? 'border-red-300 bg-red-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          />
          {touched.brandName && brandName.trim().length < 2 && (
            <p className="mt-1 text-xs text-red-500">Ingresa el nombre de la marca</p>
          )}
        </div>

        <div className="bg-indigo-50 rounded-xl p-4 text-sm text-indigo-700 leading-relaxed">
          <strong>¿Cómo funciona este ejercicio?</strong>
          <ol className="mt-2 space-y-1 list-decimal list-inside text-indigo-600">
            <li>Selecciona los canales que usa tu marca</li>
            <li>Para cada etapa del funnel, define el objetivo y el KPI de cada canal</li>
            <li>Descarga tu Customer Journey Map en PDF</li>
          </ol>
        </div>

        <Button
          onClick={onNext}
          disabled={!canContinue}
          className="w-full py-3 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl"
        >
          Comenzar ejercicio →
        </Button>
      </div>
    </div>
  );
}
