'use client';

import { Button } from '@/components/ui/button';

type PDFExportButtonProps = {
  brandName: string;
  groupNumber: string;
};

export function PDFExportButton({ brandName, groupNumber }: PDFExportButtonProps) {
  const handleExport = () => {
    // Use the browser's native print-to-PDF — reliable across all platforms
    window.print();
  };

  return (
    <div className="flex flex-col items-center gap-1.5">
      <Button
        onClick={handleExport}
        className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md"
      >
        ⬇️ Guardar como PDF
      </Button>
      <p className="text-[10px] text-gray-400 text-center">
        Se abrirá el diálogo de impresión → elige{' '}
        <span className="font-semibold text-gray-500">"Guardar como PDF"</span>
      </p>
    </div>
  );
}
