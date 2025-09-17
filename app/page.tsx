'use client';

import { useState } from 'react';
import Form from './components/Form';
import PDFPreview from './components/PDFPreview';

interface FormData {
  name: string;
  email: string;
  phone: string;
  position: string;
  description: string;
}

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<'form' | 'preview'>('form');
  const [formData, setFormData] = useState<FormData | null>(null);

  const handleFormSubmit = (data: FormData) => {
    setFormData(data);
    // Generate and download PDF directly
    generateAndDownloadPDF(data);
  };

  const handleViewPDF = (data: FormData) => {
    setFormData(data);
    setCurrentScreen('preview');
  };

  const handleBackToForm = () => {
    setCurrentScreen('form');
  };

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

  const generateAndDownloadPDF = async (data: FormData) => {
    // Create a temporary element to render the PDF content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; background-color: #ffffff;">
        <div style="margin-bottom: 30px;">
          <h1 style="font-size: 32px; font-weight: bold; color: #000000; margin-bottom: 10px;">${data.name}</h1>
          <p style="font-size: 18px; color: #666666; margin: 0;">${data.position}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding: 8px 0; border-bottom: 1px solid #eeeeee;">
            <span style="font-weight: 600; color: #333333;">Name:</span>
            <span style="color: #000000;">${data.name}</span>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding: 8px 0; border-bottom: 1px solid #eeeeee;">
            <span style="font-weight: 600; color: #333333;">Email:</span>
            <span style="color: #000000;">${data.email}</span>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding: 8px 0; border-bottom: 1px solid #eeeeee;">
            <span style="font-weight: 600; color: #333333;">Phone Number:</span>
            <span style="color: #000000;">${formatPhoneNumber(data.phone)}</span>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding: 8px 0; border-bottom: 1px solid #eeeeee;">
            <span style="font-weight: 600; color: #333333;">Position:</span>
            <span style="color: #000000;">${data.position}</span>
          </div>
          
          <div style="margin-top: 20px;">
            <div style="font-weight: 600; color: #333333; margin-bottom: 10px;">Description:</div>
            <div style="color: #000000; line-height: 1.6; white-space: pre-wrap;">${data.description}</div>
          </div>
        </div>
      </div>
    `;
    
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    tempDiv.style.backgroundColor = '#ffffff';
    tempDiv.style.width = '800px';
    tempDiv.style.height = 'auto';
    document.body.appendChild(tempDiv);

    try {
      const { default: html2canvas } = await import('html2canvas');
      const { default: jsPDF } = await import('jspdf');
      
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 800,
        height: tempDiv.scrollHeight
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
    } finally {
      if (document.body.contains(tempDiv)) {
        document.body.removeChild(tempDiv);
      }
    }
  };

  return (
    <div className="min-h-screen">
      {currentScreen === 'form' ? (
        <Form 
          onSubmit={handleFormSubmit} 
          onViewPDF={handleViewPDF} 
          initialData={formData || undefined}
        />
      ) : (
        formData && <PDFPreview data={formData} onBack={handleBackToForm} />
      )}
    </div>
  );
}
