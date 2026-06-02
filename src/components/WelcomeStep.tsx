'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

type WelcomeStepProps = {
  groupNumber: string;
  brandName: string;
  date: string;
  shopperProfile: string;
  onChange: (field: 'groupNumber' | 'brandName' | 'date' | 'shopperProfile', value: string) => void;
  onNext: () => void;
};

type TouchedFields = {
  groupNumber: boolean;
  brandName: boolean;
  date: boolean;
  shopperProfile: boolean;
};

export function WelcomeStep({ groupNumber, brandName, date, shopperProfile, onChange, onNext }: WelcomeStepProps) {
  const [touched, setTouched] = useState<TouchedFields>({
    groupNumber: false,
    brandName: false,
    date: false,
    shopperProfile: false,
  });

  const touch = (field: keyof TouchedFields) =>
    setTouched((t) => ({ ...t, [field]: true }));

  const canContinue =
    groupNumber.trim().length > 0 &&
    brandName.trim().length > 1 &&
    shopperProfile.trim().length > 5;

  const inputClass = (field: keyof TouchedFields, invalid: boolean) =>
    `w-full px-4 py-3 rounded-xl border text-gray-900 placeholder-gray-400 text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 ${
      touched[field] && invalid ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
    }`;

  return (
    <div className="max-w-xl mx-auto">
      {/* Title */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 mb-4">
          <span className="text-3xl">🗺️</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Journey Map</h1>
        <p className="text-gray-500 text-base">
          Construye el mapa del recorrido de compra de tu marca a través de múltiples canales.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-5">

        {/* Row: Grupo Número + Fecha */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Grupo Número <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={groupNumber}
              placeholder="Ej. Grupo 3"
              onChange={(e) => onChange('groupNumber', e.target.value)}
              onBlur={() => touch('groupNumber')}
              className={inputClass('groupNumber', groupNumber.trim().length === 0)}
            />
            {touched.groupNumber && groupNumber.trim().length === 0 && (
              <p className="mt-1 text-xs text-red-500">Ingresa el número de grupo</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Fecha
            </label>
            <input
              type="text"
              value={date}
              placeholder="Ej. Junio 2026"
              onChange={(e) => onChange('date', e.target.value)}
              onBlur={() => touch('date')}
              className={inputClass('date', false)}
            />
          </div>
        </div>

        {/* Nombre de la marca */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Nombre de la marca o negocio <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={brandName}
            placeholder="Ej. Nike Colombia, Café Juan Valdez, Mi Startup..."
            onChange={(e) => onChange('brandName', e.target.value)}
            onBlur={() => touch('brandName')}
            className={inputClass('brandName', brandName.trim().length < 2)}
          />
          {touched.brandName && brandName.trim().length < 2 && (
            <p className="mt-1 text-xs text-red-500">Ingresa el nombre de la marca</p>
          )}
        </div>

        {/* Perfil del Shopper */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Perfil del Shopper <span className="text-red-400">*</span>
          </label>
          <p className="text-xs text-gray-400 mb-2">
            Describe el buyer persona: quién es, qué necesita, cómo toma decisiones de compra.
            Este perfil te guiará durante todo el ejercicio.
          </p>
          <textarea
            value={shopperProfile}
            placeholder="Ej. Mujer de 28-40 años, profesional, vive en ciudad, busca ropa de moda con buena relación calidad-precio. Investiga en redes sociales antes de comprar, valora las reseñas de otras clientas y compra principalmente los fines de semana..."
            rows={4}
            onChange={(e) => onChange('shopperProfile', e.target.value)}
            onBlur={() => touch('shopperProfile')}
            className={`w-full px-4 py-3 rounded-xl border text-gray-900 placeholder-gray-400 text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 resize-none ${
              touched.shopperProfile && shopperProfile.trim().length <= 5
                ? 'border-red-300 bg-red-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          />
          {touched.shopperProfile && shopperProfile.trim().length <= 5 && (
            <p className="mt-1 text-xs text-red-500">Describe brevemente el perfil de tu shopper</p>
          )}
        </div>

        {/* How it works */}
        <div className="bg-indigo-50 rounded-xl p-4 text-sm text-indigo-700 leading-relaxed">
          <strong>¿Cómo funciona este ejercicio?</strong>
          <ol className="mt-2 space-y-1 list-decimal list-inside text-indigo-600 text-xs">
            <li>En cada etapa del funnel, selecciona los canales donde tu shopper interactúa</li>
            <li>Define el objetivo de la marca y el KPI de medición para cada canal</li>
            <li>Al finalizar, descarga tu Customer Journey Map en PDF</li>
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
