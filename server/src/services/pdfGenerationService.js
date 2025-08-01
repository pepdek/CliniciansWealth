import puppeteer from 'puppeteer';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class PDFGenerationService {
  constructor() {
    this.enabled = !!process.env.OPENAI_API_KEY;
  }

  async generatePersonalizedReport(analysisData, calculationResults, userProfile) {
    if (!this.enabled) {
      throw new Error('PDF generation service not configured');
    }

    try {
      // Step 1: Generate personalized content using OpenAI
      const reportContent = await this.generateReportContent(analysisData, calculationResults, userProfile);
      
      // Step 2: Create HTML template with the content
      const htmlContent = this.createHTMLTemplate(reportContent, calculationResults, userProfile);
      
      // Step 3: Generate PDF using Puppeteer
      const pdfBuffer = await this.convertHTMLToPDF(htmlContent);
      
      return {
        success: true,
        pdf: pdfBuffer,
        filename: `loan-strategy-${userProfile.specialty}-${Date.now()}.pdf`
      };
      
    } catch (error) {
      console.error('PDF generation error:', error);
      throw new Error('Failed to generate personalized report');
    }
  }

  async generateReportContent(analysisData, calculationResults, userProfile) {
    const prompt = `Create a comprehensive, personalized loan optimization report for a clinician. This should be professional, actionable, and specific to their situation.

USER PROFILE:
- Specialty: ${userProfile.specialty}
- Career Stage: ${userProfile.careerStage}
- Career Goals: ${userProfile.careerGoals}
- State: ${userProfile.state || 'Not specified'}

LOAN DATA:
- Total Federal Loans: $${analysisData.loanSummary?.totalFederalBalance || 250000}
- Total Private Loans: $${analysisData.loanSummary?.totalPrivateBalance || 0}
- Current Payment Plan: ${analysisData.loanSummary?.currentPaymentPlan || 'Standard'}
- PSLF Payments Made: ${analysisData.loanSummary?.pslfPaymentsMade || 0}

RECOMMENDED STRATEGY:
- Strategy: ${calculationResults.recommendation?.recommendedStrategy || 'Refinancing'}
- Potential Savings: $${calculationResults.savings?.potentialSavings || 47000}
- Monthly Payment: $${calculationResults.recommendation?.primaryOption?.monthlyPayment || 2000}
- Payoff Timeline: ${calculationResults.recommendation?.primaryOption?.yearsRemaining || 10} years

Generate EXACTLY 4 sections for a 4-page report:

SECTION 1: EXECUTIVE SUMMARY
- Brief overview of their situation
- Key recommendation in 2-3 sentences
- Top 3 action items
- Expected savings and timeline

SECTION 2: DETAILED STRATEGY ANALYSIS
- Why this strategy is optimal for their specialty/career stage
- Comparison with alternatives (PSLF vs refinancing)
- Risk analysis and considerations
- Specialty-specific insights

SECTION 3: IMPLEMENTATION ROADMAP
- Step-by-step action plan with timelines
- Required forms and applications
- Important deadlines and milestones
- Potential obstacles and solutions

SECTION 4: LONG-TERM FINANCIAL PLANNING
- 5-10 year projection
- Tax implications and planning strategies
- Wealth building opportunities after loan payoff
- Specialty-specific financial advice

Format as JSON with sections: executive_summary, strategy_analysis, implementation_roadmap, financial_planning
Each section should be 300-400 words, professional, and highly specific to their situation.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 3000,
      temperature: 0.3
    });

    try {
      const content = JSON.parse(response.choices[0].message.content);
      return content;
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      return this.getFallbackContent(userProfile, calculationResults);
    }
  }

  getFallbackContent(userProfile, calculationResults) {
    const strategy = calculationResults.recommendation?.recommendedStrategy || 'Refinancing';
    const savings = calculationResults.savings?.potentialSavings || 47000;
    
    return {
      executive_summary: `Based on your profile as a ${userProfile.specialty} in ${userProfile.careerStage} stage, we recommend ${strategy.toLowerCase()} as your optimal loan strategy. This approach could save you approximately $${savings.toLocaleString()} over the life of your loans. Your current loan portfolio and career trajectory make this the most financially advantageous path forward. Key immediate actions include reviewing your current payment plan, gathering necessary documentation, and initiating the recommended strategy within the next 30 days.`,
      
      strategy_analysis: `The ${strategy.toLowerCase()} strategy is particularly suited for ${userProfile.specialty} professionals in your career stage. Unlike generic advice, this recommendation considers the unique income progression typical in ${userProfile.specialty}, where earnings often increase significantly after residency. This strategy optimizes for both current affordability and long-term savings. Compared to maintaining your current payment plan, this approach reduces total interest paid while providing payment flexibility during lower-income periods of training.`,
      
      implementation_roadmap: `Your implementation should begin immediately with these prioritized steps: 1) Gather all current loan documentation and statements, 2) Research and apply to 3-5 recommended lenders within 2 weeks, 3) Complete applications simultaneously to compare offers, 4) Review and select the best terms within 30 days. Critical deadlines include submitting applications before any rate increases and ensuring continuous loan payments during the transition period. Potential obstacles include credit score requirements and income verification - we provide specific solutions for each.`,
      
      financial_planning: `Looking beyond loan optimization, your ${userProfile.specialty} career offers substantial wealth-building opportunities. With an estimated $${savings.toLocaleString()} in loan savings, you can redirect these funds toward retirement accounts, real estate investment, or practice ownership. Tax implications of your chosen strategy include potential deductions and optimal timing for major financial decisions. We recommend establishing a high-yield emergency fund, maximizing employer retirement contributions, and considering disability insurance specific to medical professionals.`
    };
  }

  createHTMLTemplate(content, calculationResults, userProfile) {
    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Personalized Loan Strategy Report</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: white;
        }
        
        .page {
            width: 8.5in;
            min-height: 11in;
            padding: 1in;
            margin: 0 auto;
            background: white;
            page-break-after: always;
        }
        
        .page:last-child {
            page-break-after: avoid;
        }
        
        .header {
            border-bottom: 3px solid #0f766e;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .logo {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .logo-icon {
            width: 40px;
            height: 40px;
            background: #0f766e;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            color: white;
            font-weight: bold;
            font-size: 18px;
        }
        
        .company-name {
            font-size: 24px;
            font-weight: 700;
            color: #1f2937;
        }
        
        .tagline {
            font-size: 14px;
            color: #0f766e;
            font-weight: 500;
        }
        
        .report-title {
            font-size: 28px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 10px;
        }
        
        .report-subtitle {
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 5px;
        }
        
        .report-date {
            font-size: 14px;
            color: #9ca3af;
        }
        
        .section-title {
            font-size: 22px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e5e7eb;
        }
        
        .content {
            font-size: 14px;
            line-height: 1.8;
            color: #374151;
            margin-bottom: 25px;
        }
        
        .highlight-box {
            background: linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 100%);
            border: 1px solid #a7f3d0;
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
        }
        
        .highlight-title {
            font-size: 18px;
            font-weight: 600;
            color: #047857;
            margin-bottom: 15px;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin: 25px 0;
        }
        
        .stat-item {
            text-align: center;
            padding: 20px;
            background: #f9fafb;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
        }
        
        .stat-value {
            font-size: 24px;
            font-weight: 700;
            color: #059669;
            margin-bottom: 5px;
        }
        
        .stat-label {
            font-size: 12px;
            color: #6b7280;
            font-weight: 500;
        }
        
        .action-list {
            background: #fefce8;
            border: 1px solid #fde047;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        
        .action-list h4 {
            color: #a16207;
            font-weight: 600;
            margin-bottom: 15px;
        }
        
        .action-list ol {
            padding-left: 20px;
        }
        
        .action-list li {
            margin-bottom: 8px;
            color: #92400e;
        }
        
        .footer {
            position: absolute;
            bottom: 1in;
            left: 1in;
            right: 1in;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
            padding-top: 15px;
        }
        
        @media print {
            .page {
                margin: 0;
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <!-- Page 1: Executive Summary -->
    <div class="page">
        <div class="header">
            <div class="logo">
                <div class="logo-icon">CW</div>
                <div>
                    <div class="company-name">Clinicians Wealth</div>
                    <div class="tagline">.dot phrases for your wealth</div>
                </div>
            </div>
            <div class="report-title">Personalized Loan Strategy Report</div>
            <div class="report-subtitle">Optimized for ${userProfile.specialty} • ${userProfile.careerStage}</div>
            <div class="report-date">Generated on ${currentDate}</div>
        </div>
        
        <div class="highlight-box">
            <div class="highlight-title">🎯 Your Optimal Strategy: ${calculationResults.recommendation?.recommendedStrategy || 'Refinancing'}</div>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-value">$${(calculationResults.savings?.potentialSavings || 47000).toLocaleString()}</div>
                    <div class="stat-label">Potential Savings</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">$${(calculationResults.recommendation?.primaryOption?.monthlyPayment || 2000).toLocaleString()}</div>
                    <div class="stat-label">New Monthly Payment</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${calculationResults.recommendation?.primaryOption?.yearsRemaining || 10} years</div>
                    <div class="stat-label">Payoff Timeline</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${calculationResults.recommendation?.confidence || 'High'}</div>
                    <div class="stat-label">Confidence Level</div>
                </div>
            </div>
        </div>
        
        <div class="section-title">Executive Summary</div>
        <div class="content">${content.executive_summary}</div>
        
        <div class="action-list">
            <h4>🚀 Immediate Action Items (Next 30 Days)</h4>
            <ol>
                <li>Gather all current loan statements and documentation</li>
                <li>Research and contact 3-5 recommended lenders</li>
                <li>Begin application processes simultaneously</li>
                <li>Schedule follow-up review in 45 days</li>
            </ol>
        </div>
    </div>
    
    <!-- Page 2: Strategy Analysis -->
    <div class="page">
        <div class="section-title">Detailed Strategy Analysis</div>
        <div class="content">${content.strategy_analysis}</div>
        
        <div class="highlight-box">
            <div class="highlight-title">🔍 Why This Strategy Works for ${userProfile.specialty}</div>
            <div class="content">
                This recommendation is specifically tailored to the unique financial trajectory of ${userProfile.specialty} professionals. 
                Unlike generic financial advice, we've analyzed typical salary progressions, specialty-specific employment patterns, 
                and career milestone timing to optimize your loan strategy for maximum long-term benefit.
            </div>
        </div>
        
        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-value">${calculationResults.recommendation?.primaryOption?.completionAge || 42}</div>
                <div class="stat-label">Age at Loan Completion</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">$${((calculationResults.savings?.potentialSavings || 47000) / (calculationResults.recommendation?.primaryOption?.yearsRemaining || 10) / 12).toFixed(0)}</div>
                <div class="stat-label">Monthly Savings vs Current</div>
            </div>
        </div>
    </div>
    
    <!-- Page 3: Implementation Roadmap -->
    <div class="page">
        <div class="section-title">Implementation Roadmap</div>
        <div class="content">${content.implementation_roadmap}</div>
        
        <div class="action-list">
            <h4>📋 90-Day Implementation Timeline</h4>
            <ol>
                <li><strong>Days 1-7:</strong> Document gathering and credit report review</li>
                <li><strong>Days 8-21:</strong> Lender research and initial applications</li>
                <li><strong>Days 22-35:</strong> Application completion and offer comparison</li>
                <li><strong>Days 36-60:</strong> Final selection and loan processing</li>
                <li><strong>Days 61-90:</strong> Transition completion and payment setup</li>
            </ol>
        </div>
        
        <div class="highlight-box">
            <div class="highlight-title">⚠️ Critical Success Factors</div>
            <div class="content">
                <strong>Credit Score:</strong> Maintain current score during process<br>
                <strong>Income Documentation:</strong> Have 2 years of tax returns ready<br>
                <strong>Employment Verification:</strong> Secure current employer letter<br>
                <strong>Timing:</strong> Complete before any major life changes
            </div>
        </div>
    </div>
    
    <!-- Page 4: Long-term Financial Planning -->
    <div class="page">
        <div class="section-title">Long-Term Financial Planning</div>
        <div class="content">${content.financial_planning}</div>
        
        <div class="highlight-box">
            <div class="highlight-title">💰 Wealth Building Opportunities</div>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-value">$${((calculationResults.savings?.potentialSavings || 47000) * 1.5).toLocaleString()}</div>
                    <div class="stat-label">10-Year Investment Potential</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${new Date().getFullYear() + (calculationResults.recommendation?.primaryOption?.yearsRemaining || 10)}</div>
                    <div class="stat-label">Debt-Free Target Year</div>
                </div>
            </div>
        </div>
        
        <div class="action-list">
            <h4>🎯 Next Steps for Wealth Building</h4>
            <ol>
                <li>Establish high-yield emergency fund (6 months expenses)</li>
                <li>Maximize retirement contributions (401k, IRA)</li>
                <li>Consider disability insurance for medical professionals</li>
                <li>Explore real estate investment opportunities</li>
                <li>Plan for practice ownership or partnership</li>
            </ol>
        </div>
        
        <div class="footer">
            <p><strong>Clinicians Wealth</strong> • Personalized Financial Strategies for Medical Professionals Under 40</p>
            <p>This report is based on information provided and current market conditions. Consult with financial advisors for personalized advice.</p>
            <p>© ${new Date().getFullYear()} Clinicians Wealth. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
  }

  async convertHTMLToPDF(htmlContent) {
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: { top: '1in', right: '1in', bottom: '1in', left: '1in' },
        printBackground: true,
        preferCSSPageSize: true
      });
      
      return pdfBuffer;
      
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  async testConnection() {
    if (!this.enabled) {
      return { success: false, error: 'OpenAI API key not configured' };
    }

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: "Test connection" }],
        max_tokens: 5
      });

      return { 
        success: true, 
        message: 'PDF generation service connected successfully',
        model: response.model
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
  }
}

export default new PDFGenerationService();