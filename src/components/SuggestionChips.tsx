'use client';

type SuggestionChipsProps = {
  suggestions: string[];
  onSelect: (value: string) => void;
  currentValue: string;
  label: string;
};

export function SuggestionChips({ suggestions, onSelect, currentValue, label }: SuggestionChipsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="mt-2">
      <p className="text-xs text-gray-400 mb-1.5">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((suggestion) => {
          const isActive = currentValue === suggestion;
          return (
            <button
              key={suggestion}
              onClick={() => onSelect(isActive ? '' : suggestion)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {suggestion}
            </button>
          );
        })}
      </div>
    </div>
  );
}
