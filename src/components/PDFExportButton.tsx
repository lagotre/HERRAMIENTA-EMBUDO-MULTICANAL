'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

type PDFExportButtonProps = {
  brandName: string;
  studentName: string;
};

export function PDFExportButton({ brandName, studentName }: PDFExportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExport = async () => {
    setIsGenerating(true);
    try {
      const element = document.getElementById('journey-map-preview');
      if (!element) return;

      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Landscape A4: 297mm x 210mm
      const pdfWidth = 297;
      const pdfHeight = 210;
      const margin = 5;

      const availableWidth = pdfWidth - margin * 2;
      const availableHeight = pdfHeight - margin * 2;

      const ratio = imgWidth / imgHeight;
      let drawWidth = availableWidth;
      let drawHeight = drawWidth / ratio;

      if (drawHeight > availableHeight) {
        drawHeight = availableHeight;
        drawWidth = drawHeight * ratio;
      }

      const xOffset = margin + (availableWidth - drawWidth) / 2;

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      // If the content is very tall, split across pages
      const pixelsPerMm = imgWidth / drawWidth;
      const pageHeightInPixels = availableHeight * pixelsPerMm;

      if (imgHeight <= pageHeightInPixels * 1.2) {
        // Single page
        pdf.addImage(imgData, 'PNG', xOffset, margin, drawWidth, drawHeight);
      } else {
        // Multi-page
        let yPosition = 0;
        let pageNumber = 0;

        while (yPosition < imgHeight) {
          if (pageNumber > 0) pdf.addPage();

          const sliceCanvas = document.createElement('canvas');
          sliceCanvas.width = imgWidth;
          sliceCanvas.height = Math.min(pageHeightInPixels, imgHeight - yPosition);

          const ctx = sliceCanvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(canvas, 0, -yPosition, imgWidth, imgHeight);
          }

          const sliceData = sliceCanvas.toDataURL('image/png');
          const sliceDrawHeight = (sliceCanvas.height / pixelsPerMm);
          pdf.addImage(sliceData, 'PNG', xOffset, margin, drawWidth, sliceDrawHeight);

          yPosition += pageHeightInPixels;
          pageNumber++;
        }
      }

      const fileName = `journey-map-${brandName.replace(/\s+/g, '-').toLowerCase()}-${studentName.split(' ')[0].toLowerCase()}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Hubo un error generando el PDF. Por favor intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isGenerating}
      className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md disabled:opacity-60"
    >
      {isGenerating ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Generando PDF...
        </span>
      ) : (
        '⬇️ Descargar PDF'
      )}
    </Button>
  );
}
