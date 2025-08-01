import fs from 'fs/promises';
import path from 'path';
import { jsPDF } from 'jspdf';
import puppeteer from 'puppeteer';
import { mcpConfig } from '../config/mcp-config.js';

class PDFService {
  constructor() {
    this.templatePath = mcpConfig.pdfGeneration.templatePath;
    this.outputPath = mcpConfig.pdfGeneration.outputPath;
    this.ensureDirectories();
  }

  async ensureDirectories() {
    try {
      await fs.mkdir(this.templatePath, { recursive: true });
      await fs.mkdir(this.outputPath, { recursive: true });
    } catch (error) {
      console.error('Error creating directories:', error);
    }
  }

  async generateLoanReport(userData, calculations) {
    const reportId = `loan_report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const filename = `${reportId}.pdf`;
    const filepath = path.join(this.outputPath, filename);

    try {
      const htmlContent = await this.generateHTMLContent(userData, calculations);
      
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '1in',
          right: '0.5in',
          bottom: '1in',
          left: '0.5in'
        }
      });
      
      await browser.close();
      
      await fs.writeFile(filepath, pdfBuffer);
      
      return {
        success: true,
        reportId,
        filename,
        filepath,
        size: pdfBuffer.length
      };
    } catch (error) {
      console.error('PDF generation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async generateHTMLContent(userData, calculations) {
    const template = await this.loadTemplate('loan-report-template.html');
    
    const templateData = {
      userName: `${userData.firstName} ${userData.lastName}`,
      specialty: userData.specialty,
      graduationYear: userData.graduationYear,
      totalLoans: this.formatCurrency(userData.totalLoans),
      currentDate: new Date().toLocaleDateString(),
      
      pslf: {
        totalPaid: this.formatCurrency(calculations.pslf.totalPaid),
        forgiveness: this.formatCurrency(calculations.pslf.forgiveness),
        monthlyPayment: this.formatCurrency(calculations.pslf.monthlyPayment),
        yearsToForgiveness: calculations.pslf.yearsToForgiveness || 10
      },
      
      refinancing: {
        totalPaid: this.formatCurrency(calculations.refinancing.totalPaid),
        savings: this.formatCurrency(calculations.refinancing.savings),
        monthlyPayment: this.formatCurrency(calculations.refinancing.monthlyPayment),
        newRate: (calculations.refinancing.newRate * 100).toFixed(2) + '%',
        termYears: calculations.refinancing.termYears || 10
      },
      
      recommendation: calculations.recommendation,
      recommendationReason: calculations.recommendationReason || 'Based on your financial profile and career trajectory.',
      
      projectedSalary: userData.projectedSalary ? this.formatCurrency(userData.projectedSalary) : 'Not available',
      
      charts: {
        pslf: this.generateChartData(calculations.pslf),
        refinancing: this.generateChartData(calculations.refinancing)
      }
    };

    return this.replaceTemplateVariables(template, templateData);
  }

  async loadTemplate(templateName) {
    try {
      const templatePath = path.join(this.templatePath, templateName);
      return await fs.readFile(templatePath, 'utf-8');
    } catch (error) {
      return this.getDefaultTemplate();
    }
  }

  getDefaultTemplate() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Loan Optimization Report</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #2563eb;
            margin: 0;
            font-size: 2.5em;
        }
        .header p {
            color: #666;
            margin: 10px 0;
        }
        .section {
            margin: 30px 0;
            padding: 20px;
            border-left: 4px solid #2563eb;
            background-color: #f8fafc;
        }
        .section h2 {
            color: #1e40af;
            margin-top: 0;
        }
        .comparison {
            display: flex;
            justify-content: space-between;
            margin: 20px 0;
        }
        .option {
            flex: 1;
            margin: 0 10px;
            padding: 20px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            text-align: center;
        }
        .option.recommended {
            border-color: #10b981;
            background-color: #f0fdf4;
        }
        .option h3 {
            margin-top: 0;
            color: #374151;
        }
        .metric {
            margin: 10px 0;
        }
        .metric .label {
            font-weight: bold;
            color: #6b7280;
        }
        .metric .value {
            font-size: 1.2em;
            font-weight: bold;
            color: #111827;
        }
        .recommendation {
            background-color: #ecfdf5;
            border: 2px solid #10b981;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .recommendation h3 {
            color: #047857;
            margin-top: 0;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 0.9em;
        }
        @media print {
            body { margin: 0; }
            .section { break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Personalized Loan Optimization Strategy</h1>
        <p>Prepared for: <strong>{{userName}}</strong></p>
        <p>Specialty: <strong>{{specialty}}</strong> | Generated: {{currentDate}}</p>
    </div>

    <div class="section">
        <h2>Your Current Situation</h2>
        <div class="metric">
            <span class="label">Medical Specialty:</span>
            <span class="value">{{specialty}}</span>
        </div>
        <div class="metric">
            <span class="label">Graduation Year:</span>
            <span class="value">{{graduationYear}}</span>
        </div>
        <div class="metric">
            <span class="label">Total Student Loans:</span>
            <span class="value">{{totalLoans}}</span>
        </div>
        <div class="metric">
            <span class="label">Projected Annual Salary:</span>
            <span class="value">{{projectedSalary}}</span>
        </div>
    </div>

    <div class="section">
        <h2>Strategy Comparison</h2>
        <div class="comparison">
            <div class="option {{#if pslf.recommended}}recommended{{/if}}">
                <h3>PSLF Strategy</h3>
                <div class="metric">
                    <span class="label">Total Paid:</span>
                    <span class="value">{{pslf.totalPaid}}</span>
                </div>
                <div class="metric">
                    <span class="label">Amount Forgiven:</span>
                    <span class="value">{{pslf.forgiveness}}</span>
                </div>
                <div class="metric">
                    <span class="label">Monthly Payment:</span>
                    <span class="value">{{pslf.monthlyPayment}}</span>
                </div>
                <div class="metric">
                    <span class="label">Years to Forgiveness:</span>
                    <span class="value">{{pslf.yearsToForgiveness}}</span>
                </div>
            </div>
            
            <div class="option {{#if refinancing.recommended}}recommended{{/if}}">
                <h3>Refinancing Strategy</h3>
                <div class="metric">
                    <span class="label">Total Paid:</span>
                    <span class="value">{{refinancing.totalPaid}}</span>
                </div>
                <div class="metric">
                    <span class="label">Total Savings:</span>
                    <span class="value">{{refinancing.savings}}</span>
                </div>
                <div class="metric">
                    <span class="label">Monthly Payment:</span>
                    <span class="value">{{refinancing.monthlyPayment}}</span>
                </div>
                <div class="metric">
                    <span class="label">New Interest Rate:</span>
                    <span class="value">{{refinancing.newRate}}</span>
                </div>
            </div>
        </div>
    </div>

    <div class="recommendation">
        <h3>Our Recommendation: {{recommendation}}</h3>
        <p>{{recommendationReason}}</p>
    </div>

    <div class="footer">
        <p>This report was generated by Clinician Loan Optimizer</p>
        <p>Disclaimer: This analysis is for informational purposes only. Please consult with a financial advisor for personalized advice.</p>
    </div>
</body>
</html>`;
  }

  replaceTemplateVariables(template, data) {
    let result = template;
    
    const replacements = this.flattenObject(data);
    
    for (const [key, value] of Object.entries(replacements)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value || 'N/A');
    }
    
    return result;
  }

  flattenObject(obj, prefix = '') {
    const flattened = {};
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          Object.assign(flattened, this.flattenObject(value, newKey));
        } else {
          flattened[newKey] = value;
        }
      }
    }
    
    return flattened;
  }

  generateChartData(strategyData) {
    return {
      labels: ['Year 1', 'Year 5', 'Year 10', 'Year 15', 'Year 20'],
      values: [100, 80, 60, 40, 20]
    };
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

  async generateQuickSummary(userData, calculations) {
    const pdf = new jsPDF();
    
    pdf.setFontSize(20);
    pdf.text('Loan Optimization Summary', 20, 30);
    
    pdf.setFontSize(12);
    pdf.text(`Name: ${userData.firstName} ${userData.lastName}`, 20, 50);
    pdf.text(`Specialty: ${userData.specialty}`, 20, 60);
    pdf.text(`Total Loans: ${this.formatCurrency(userData.totalLoans)}`, 20, 70);
    
    pdf.text('PSLF Strategy:', 20, 90);
    pdf.text(`  Total Paid: ${this.formatCurrency(calculations.pslf.totalPaid)}`, 25, 100);
    pdf.text(`  Amount Forgiven: ${this.formatCurrency(calculations.pslf.forgiveness)}`, 25, 110);
    
    pdf.text('Refinancing Strategy:', 20, 130);
    pdf.text(`  Total Paid: ${this.formatCurrency(calculations.refinancing.totalPaid)}`, 25, 140);
    pdf.text(`  Total Savings: ${this.formatCurrency(calculations.refinancing.savings)}`, 25, 150);
    
    pdf.setFontSize(14);
    pdf.text(`Recommendation: ${calculations.recommendation}`, 20, 170);
    
    const filename = `summary_${Date.now()}.pdf`;
    const filepath = path.join(this.outputPath, filename);
    
    await fs.writeFile(filepath, pdf.output('arraybuffer'));
    
    return {
      success: true,
      filename,
      filepath
    };
  }
}

export default new PDFService();