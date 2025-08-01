import puppeteer from 'puppeteer';
import { jsPDF } from 'jspdf';
import fs from 'fs/promises';
import path from 'path';

class FallbackServices {
  constructor() {
    this.salaryDataSources = [
      'https://www.medscape.com/slideshow/2023-compensation-report-6016483',
      'https://www.glassdoor.com/Salaries/physician-salary-SRCH_KO0,9.htm'
    ];
  }

  async scrapeSalaryData(specialty, location = 'United States') {
    console.log('🔄 Using fallback web scraping for salary data...');
    
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
      
      const results = [];
      
      for (const url of this.salaryDataSources) {
        try {
          console.log(`Scraping ${url}...`);
          await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
          
          const content = await page.evaluate(() => {
            return {
              title: document.title,
              text: document.body.innerText
            };
          });
          
          const salaryMatches = this.extractSalaryFromText(content.text, specialty);
          if (salaryMatches.length > 0) {
            results.push({
              source: url,
              title: content.title,
              salaries: salaryMatches
            });
          }
        } catch (error) {
          console.error(`Failed to scrape ${url}:`, error.message);
        }
      }
      
      return this.processFallbackSalaryData(results, specialty);
    } catch (error) {
      console.error('Fallback salary scraping failed:', error);
      return this.getEstimatedSalaryData(specialty);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  extractSalaryFromText(text, specialty) {
    const salaryRegex = /\$[\d,]+(?:,\d{3})*(?:\.\d{2})?/g;
    const specialtyRegex = new RegExp(specialty.toLowerCase(), 'i');
    
    const lines = text.split('\n');
    const relevantLines = lines.filter(line => 
      specialtyRegex.test(line) || line.toLowerCase().includes('salary') || line.toLowerCase().includes('income')
    );
    
    const salaries = [];
    relevantLines.forEach(line => {
      const matches = line.match(salaryRegex);
      if (matches) {
        matches.forEach(match => {
          const amount = parseInt(match.replace(/[$,]/g, ''));
          if (amount >= 50000 && amount <= 1000000) {
            salaries.push(amount);
          }
        });
      }
    });
    
    return salaries;
  }

  processFallbackSalaryData(results, specialty) {
    const allSalaries = results.flatMap(result => result.salaries);
    
    if (allSalaries.length === 0) {
      return this.getEstimatedSalaryData(specialty);
    }
    
    allSalaries.sort((a, b) => a - b);
    const median = allSalaries[Math.floor(allSalaries.length / 2)];
    
    return {
      specialty,
      estimatedSalary: median,
      salaryRange: {
        min: Math.min(...allSalaries),
        max: Math.max(...allSalaries)
      },
      sources: results.map(result => ({
        url: result.source,
        title: result.title,
        dataPoints: result.salaries.length
      })),
      confidence: allSalaries.length >= 5 ? 'medium' : 'low',
      method: 'web-scraping-fallback',
      lastUpdated: new Date().toISOString()
    };
  }

  getEstimatedSalaryData(specialty) {
    console.log('🔄 Using hardcoded salary estimates as final fallback...');
    
    const salaryEstimates = {
      'anesthesiology': { base: 380000, range: [320000, 450000] },
      'cardiology': { base: 440000, range: [380000, 520000] },
      'dermatology': { base: 420000, range: [350000, 500000] },
      'emergency medicine': { base: 350000, range: [300000, 400000] },
      'family medicine': { base: 240000, range: [200000, 280000] },
      'internal medicine': { base: 250000, range: [210000, 290000] },
      'neurology': { base: 310000, range: [260000, 370000] },
      'obstetrics and gynecology': { base: 320000, range: [280000, 370000] },
      'ophthalmology': { base: 380000, range: [320000, 450000] },
      'orthopedic surgery': { base: 520000, range: [450000, 600000] },
      'pathology': { base: 310000, range: [260000, 370000] },
      'pediatrics': { base: 240000, range: [200000, 280000] },
      'psychiatry': { base: 280000, range: [240000, 330000] },
      'radiology': { base: 420000, range: [360000, 490000] },
      'surgery': { base: 450000, range: [380000, 550000] },
      'urology': { base: 410000, range: [350000, 480000] }
    };
    
    const normalizedSpecialty = specialty.toLowerCase();
    const estimate = salaryEstimates[normalizedSpecialty] || salaryEstimates['internal medicine'];
    
    return {
      specialty,
      estimatedSalary: estimate.base,
      salaryRange: {
        min: estimate.range[0],
        max: estimate.range[1]
      },
      sources: [{
        title: 'Industry Estimates',
        description: 'Based on historical medical compensation data',
        type: 'fallback-estimate'
      }],
      confidence: 'low',
      method: 'hardcoded-estimates',
      lastUpdated: new Date().toISOString(),
      note: 'This is a fallback estimate. For more accurate data, configure web search API.'
    };
  }

  async generateFallbackPDF(userData, calculations) {
    console.log('🔄 Using jsPDF fallback for PDF generation...');
    
    try {
      const pdf = new jsPDF();
      
      pdf.setFontSize(20);
      pdf.text('Loan Optimization Report', 20, 30);
      
      pdf.setFontSize(12);
      pdf.text(`Generated for: ${userData.firstName} ${userData.lastName}`, 20, 50);
      pdf.text(`Specialty: ${userData.specialty}`, 20, 60);
      pdf.text(`Report Date: ${new Date().toLocaleDateString()}`, 20, 70);
      
      pdf.text('LOAN SUMMARY', 20, 90);
      pdf.text(`Total Student Loans: ${this.formatCurrency(userData.totalLoans)}`, 25, 100);
      pdf.text(`Graduation Year: ${userData.graduationYear}`, 25, 110);
      
      pdf.text('PSLF STRATEGY', 20, 130);
      pdf.text(`Total Amount Paid: ${this.formatCurrency(calculations.pslf.totalPaid)}`, 25, 140);
      pdf.text(`Amount Forgiven: ${this.formatCurrency(calculations.pslf.forgiveness)}`, 25, 150);
      pdf.text(`Monthly Payment: ${this.formatCurrency(calculations.pslf.monthlyPayment)}`, 25, 160);
      
      pdf.text('REFINANCING STRATEGY', 20, 180);
      pdf.text(`Total Amount Paid: ${this.formatCurrency(calculations.refinancing.totalPaid)}`, 25, 190);
      pdf.text(`Total Savings: ${this.formatCurrency(calculations.refinancing.savings)}`, 25, 200);
      pdf.text(`Monthly Payment: ${this.formatCurrency(calculations.refinancing.monthlyPayment)}`, 25, 210);
      pdf.text(`New Interest Rate: ${(calculations.refinancing.newRate * 100).toFixed(2)}%`, 25, 220);
      
      pdf.setFontSize(14);
      pdf.text(`RECOMMENDATION: ${calculations.recommendation.toUpperCase()}`, 20, 240);
      
      pdf.setFontSize(10);
      pdf.text('Generated by Clinician Loan Optimizer - Fallback PDF Generator', 20, 270);
      pdf.text('For professional reports with charts, configure Puppeteer service.', 20, 280);
      
      const filename = `fallback_report_${Date.now()}.pdf`;
      const filepath = path.join('./generated', filename);
      
      await fs.writeFile(filepath, pdf.output('arraybuffer'));
      
      return {
        success: true,
        filename,
        filepath,
        method: 'jspdf-fallback'
      };
    } catch (error) {
      console.error('Fallback PDF generation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async sendFallbackEmail(userEmail, userName, reportData) {
    console.log('🔄 Email service not configured - logging email content...');
    
    const emailContent = {
      to: userEmail,
      subject: 'Your Loan Optimization Report is Ready',
      message: `
Hello ${userName},

Your personalized loan optimization report has been generated!

Key Findings:
- Recommended Strategy: ${reportData.recommendation}
- Potential Savings: ${reportData.potentialSavings || 'See full report'}
- Monthly Payment: ${reportData.monthlyPayment || 'See full report'}

Your report includes detailed analysis of PSLF vs refinancing strategies.

To receive reports via email, please configure SMTP settings in your environment variables.

Best regards,
Clinician Loan Optimizer Team
      `
    };
    
    console.log('📧 EMAIL CONTENT (Fallback):');
    console.log('To:', emailContent.to);
    console.log('Subject:', emailContent.subject);
    console.log('Message:', emailContent.message);
    
    return {
      success: true,
      method: 'console-log-fallback',
      messageId: `fallback_${Date.now()}`
    };
  }

  async getRefinancingRatesFallback() {
    console.log('🔄 Using fallback refinancing rates...');
    
    const currentRates = {
      averageRate: 5.5,
      rateRange: { min: 4.5, max: 7.0 },
      lenders: [
        { name: 'CommonBond', rate: 4.5 },
        { name: 'SoFi', rate: 5.0 },
        { name: 'Earnest', rate: 5.2 },
        { name: 'Laurel Road', rate: 5.5 },
        { name: 'ELFI', rate: 5.8 }
      ],
      sources: [{
        title: 'Historical Rate Data',
        description: 'Based on typical medical school loan refinancing rates',
        type: 'fallback-estimate'
      }],
      method: 'fallback-estimates',
      lastUpdated: new Date().toISOString(),
      note: 'These are estimated rates. For current rates, configure web search API.'
    };
    
    return currentRates;
  }

  formatCurrency(amount) {
    if (typeof amount !== 'number') return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
}

export default new FallbackServices();