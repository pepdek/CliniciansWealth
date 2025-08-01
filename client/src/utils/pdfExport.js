import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

class PDFExportService {
  constructor() {
    this.options = {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: 1200,
      height: null
    };
  }

  async exportReportToPDF(reportElement, filename = 'loan-strategy-report.pdf', userProfile = {}) {
    try {
      // Show loading state
      this.showLoadingState();

      // Create a clone of the element for PDF export
      const clonedElement = await this.prepareElementForPDF(reportElement, userProfile);
      
      // Generate canvas from HTML
      const canvas = await html2canvas(clonedElement, this.options);
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      // Calculate dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 0.95),
        'JPEG',
        0,
        position,
        imgWidth,
        imgHeight,
        undefined,
        'FAST'
      );

      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(
          canvas.toDataURL('image/jpeg', 0.95),
          'JPEG',
          0,
          position,
          imgWidth,
          imgHeight,
          undefined,
          'FAST'
        );
        heightLeft -= pageHeight;
      }

      // Remove cloned element
      document.body.removeChild(clonedElement);
      
      // Hide loading state
      this.hideLoadingState();

      // Save PDF
      pdf.save(filename);

      return { success: true, message: 'PDF generated successfully' };
    } catch (error) {
      console.error('PDF generation failed:', error);
      this.hideLoadingState();
      return { success: false, error: error.message };
    }
  }

  async prepareElementForPDF(element, userProfile) {
    // Clone the element
    const cloned = element.cloneNode(true);
    
    // Style for PDF export
    cloned.style.position = 'absolute';
    cloned.style.top = '-9999px';
    cloned.style.left = '-9999px';
    cloned.style.width = '1200px';
    cloned.style.backgroundColor = '#ffffff';
    cloned.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, sans-serif';
    
    // Remove interactive elements that don't work in PDF
    const interactiveElements = cloned.querySelectorAll('button, input, select, textarea');
    interactiveElements.forEach(el => {
      if (el.tagName === 'BUTTON' && el.textContent.includes('Export PDF')) {
        el.style.display = 'none';
      }
    });

    // Remove hover states and animations
    const animatedElements = cloned.querySelectorAll('[style*="transform"], .hover\\:');
    animatedElements.forEach(el => {
      el.style.transform = 'none';
      el.style.transition = 'none';
    });

    // Fix chart canvas elements
    const charts = element.querySelectorAll('canvas');
    const clonedCharts = cloned.querySelectorAll('canvas');
    
    charts.forEach((originalCanvas, index) => {
      if (clonedCharts[index]) {
        const ctx = clonedCharts[index].getContext('2d');
        clonedCharts[index].width = originalCanvas.width;
        clonedCharts[index].height = originalCanvas.height;
        ctx.drawImage(originalCanvas, 0, 0);
      }
    });

    // Add PDF-specific header
    const header = this.createPDFHeader(userProfile);
    cloned.insertBefore(header, cloned.firstChild);

    // Add PDF-specific footer
    const footer = this.createPDFFooter();
    cloned.appendChild(footer);

    // Append to document for rendering
    document.body.appendChild(cloned);

    // Wait for fonts and images to load
    await this.waitForLoad(cloned);

    return cloned;
  }

  createPDFHeader(userProfile) {
    const header = document.createElement('div');
    header.style.cssText = `
      background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%);
      color: white;
      padding: 30px;
      margin-bottom: 30px;
      text-align: center;
      border-radius: 0;
    `;
    
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    header.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center;">
          <div style="width: 40px; height: 40px; background: rgba(255,255,255,0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; font-size: 18px;">
            CW
          </div>
          <div>
            <div style="font-size: 24px; font-weight: bold;">Clinicians Wealth</div>
            <div style="font-size: 14px; opacity: 0.9;">.dot phrases for your wealth</div>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 18px; font-weight: bold;">Loan Strategy Report</div>
          <div style="font-size: 14px; opacity: 0.9;">Generated ${currentDate}</div>
        </div>
      </div>
    `;
    
    return header;
  }

  createPDFFooter() {
    const footer = document.createElement('div');
    footer.style.cssText = `
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      padding: 20px 30px;
      margin-top: 30px;
      text-align: center;
      font-size: 12px;
      color: #64748b;
    `;
    
    footer.innerHTML = `
      <div style="margin-bottom: 10px;">
        <strong>Clinicians Wealth</strong> • Personalized Financial Strategies for Medical Professionals
      </div>
      <div>
        This report is based on information provided and current market conditions. 
        Consult with financial advisors for personalized advice.
      </div>
      <div style="margin-top: 10px;">
        © ${new Date().getFullYear()} Clinicians Wealth. All rights reserved.
      </div>
    `;
    
    return footer;
  }

  async waitForLoad(element) {
    // Wait for images to load
    const images = element.querySelectorAll('img');
    const imagePromises = Array.from(images).map(img => {
      return new Promise((resolve) => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = resolve;
          img.onerror = resolve;
        }
      });
    });

    // Wait for fonts to load
    if (document.fonts) {
      await document.fonts.ready;
    }

    await Promise.all(imagePromises);
    
    // Additional wait for rendering
    return new Promise(resolve => setTimeout(resolve, 1000));
  }

  showLoadingState() {
    // Create loading overlay
    const overlay = document.createElement('div');
    overlay.id = 'pdf-loading-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      color: white;
      font-family: Inter, sans-serif;
    `;
    
    overlay.innerHTML = `
      <div style="text-align: center; background: white; color: #1f2937; padding: 30px; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.2);">
        <div style="width: 40px; height: 40px; border: 4px solid #0f766e; border-top: 4px solid transparent; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Generating PDF Report</div>
        <div style="font-size: 14px; color: #6b7280;">This may take a few moments...</div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
    
    document.body.appendChild(overlay);
  }

  hideLoadingState() {
    const overlay = document.getElementById('pdf-loading-overlay');
    if (overlay) {
      document.body.removeChild(overlay);
    }
  }

  // Alternative simple export using browser print
  async exportUsingPrint() {
    // Hide non-printable elements
    const nonPrintable = document.querySelectorAll('button, nav, .no-print');
    nonPrintable.forEach(el => {
      el.style.display = 'none';
    });

    // Add print styles
    const printStyles = document.createElement('style');
    printStyles.innerHTML = `
      @media print {
        body { 
          background: white !important; 
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        .bg-gradient-to-br { background: white !important; }
        .shadow-lg, .shadow-xl { box-shadow: none !important; }
        .border { border: 1px solid #e5e7eb !important; }
      }
    `;
    document.head.appendChild(printStyles);

    // Trigger print
    window.print();

    // Restore elements after print
    setTimeout(() => {
      nonPrintable.forEach(el => {
        el.style.display = '';
      });
      document.head.removeChild(printStyles);
    }, 1000);
  }
}

export default new PDFExportService();