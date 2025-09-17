'use client';

import { useRef } from 'react';
import Image from 'next/image';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface FormData {
  name: string;
  email: string;
  phone: string;
  position: string;
  description: string;
}

interface PDFPreviewProps {
  data: FormData;
  onBack: () => void;
}

export default function PDFPreview({ data, onBack }: PDFPreviewProps) {
  const pdfRef = useRef<HTMLDivElement>(null);

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // Format based on length
    if (digits.length === 10) {
      // Format as XXX XXX XXXX
      return `+${digits.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')}`;
    } else if (digits.length === 11 && digits.startsWith('1')) {
      // Format as +X XXX XXX XXXX
      return `+${digits.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '$1 $2 $3 $4')}`;
    } else if (digits.length > 10) {
      // For longer numbers, format as +XXX XXX XXX XXXX
      return `+${digits.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, '$1 $2 $3 $4')}`;
    } else {
      // For shorter numbers, just add + prefix
      return `+${digits}`;
    }
  };

  const downloadPDF = async () => {
    if (!pdfRef.current) return;

    try {
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${data.name || 'resume'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {/* Back Button */}
      <div className="w-full max-w-2xl mb-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-black hover:text-gray-600 transition-colors"
        >
          <Image
            src="/assignment_icons/chevron-left.svg"
            alt="Back icon"
            width={24}
            height={24}
          />
          <span>Back</span>
        </button>
      </div>

      {/* PDF Preview */}
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <div ref={pdfRef} className="bg-white p-8" style={{ backgroundColor: '#ffffff' }}>
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2" style={{ color: '#000000' }}>{data.name}</h1>
                <p className="text-lg" style={{ color: '#666666' }}>{data.position}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-semibold" style={{ color: '#333333' }}>Name:</span>
                <span style={{ color: '#000000' }}>{data.name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-semibold" style={{ color: '#333333' }}>Email:</span>
                <span style={{ color: '#000000' }}>{data.email}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-semibold" style={{ color: '#333333' }}>Phone Number:</span>
                <span style={{ color: '#000000' }}>{formatPhoneNumber(data.phone)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-semibold" style={{ color: '#333333' }}>Position:</span>
                <span style={{ color: '#000000' }}>{data.position}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="font-semibold mb-2" style={{ color: '#333333' }}>Description:</span>
                <p style={{ color: '#000000' }} className="whitespace-pre-wrap">{data.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="mt-6">
        <button
          onClick={downloadPDF}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Image
            src="/assignment_icons/Download.svg"
            alt="Download icon"
            width={20}
            height={20}
            className="flex-shrink-0"
          />
          <span>Download PDF</span>
        </button>
      </div>
    </div>
  );
}
