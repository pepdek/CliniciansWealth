import OpenAI from 'openai';
import { mcpConfig } from '../config/mcp-config.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class DocumentAnalysisService {
  constructor() {
    this.enabled = !!process.env.OPENAI_API_KEY;
  }

  async analyzeDocuments(files, userContext = {}) {
    if (!this.enabled) {
      throw new Error('OpenAI service not configured');
    }

    const analysisResults = {
      federalLoans: [],
      privateLoans: [],
      employment: {},
      income: {},
      confidence: 'medium',
      extractedData: {},
      recommendations: []
    };

    for (const file of files) {
      try {
        const analysis = await this.analyzeDocument(file, userContext);
        this.mergeAnalysisResults(analysisResults, analysis);
      } catch (error) {
        console.error(`Failed to analyze ${file.name}:`, error);
        analysisResults.recommendations.push({
          type: 'error',
          message: `Could not analyze ${file.name}. Please verify it's a clear image or PDF.`
        });
      }
    }

    // Validate and enhance extracted data
    this.validateExtractedData(analysisResults);
    this.fillMissingData(analysisResults, userContext);

    return analysisResults;
  }

  async analyzeDocument(file, userContext) {
    const base64Content = await this.convertToBase64(file);
    const isImage = file.type.startsWith('image/');

    const prompt = this.buildAnalysisPrompt(userContext);

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Latest vision model
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: isImage ? `data:${file.type};base64,${base64Content}` : `data:application/pdf;base64,${base64Content}`,
                detail: "high" // High detail for better document analysis
              }
            }
          ]
        }
      ],
      max_tokens: 2000,
      temperature: 0.1
    });

    const analysisText = response.choices[0].message.content;
    return this.parseAnalysisResponse(analysisText);
  }

  buildAnalysisPrompt(userContext) {
    return `Analyze this student loan document and extract the following data in JSON format:

FEDERAL LOAN DATA:
- Individual loan balances and interest rates
- Loan types (Direct vs FFEL)
- Current payment plan
- Monthly payment amount
- PSLF qualifying payments made
- Loan servicer information

EMPLOYMENT DATA (if visible):
- Employer name and type
- Annual salary
- PSLF eligibility

PRIVATE LOAN DATA (if applicable):
- Private loan balances
- Interest rates
- Monthly payments

USER CONTEXT: 
- Specialty: ${userContext.specialty || 'Unknown'}
- Career Stage: ${userContext.careerStage || 'Unknown'}
- Expected graduation: ${userContext.graduationYear || 'Unknown'}

VALIDATION RULES:
- Total loans typically: $50K-500K
- Interest rates typically: 3.0%-8.5%
- Resident salary: $45K-70K
- Attending salary: $180K-800K

Return ONLY valid JSON in this exact format:
{
  "federalLoans": [
    {
      "balance": number,
      "interestRate": number,
      "loanType": "Direct Unsubsidized" | "Direct Subsidized" | "FFEL",
      "disbursementDate": "YYYY-MM-DD",
      "servicer": "string"
    }
  ],
  "privateLoans": [
    {
      "balance": number,
      "interestRate": number,
      "lender": "string",
      "monthlyPayment": number
    }
  ],
  "currentPaymentPlan": "Standard" | "REPAYE" | "IBR" | "PAYE" | "Extended",
  "monthlyPayment": number,
  "pslfPaymentCount": number,
  "employment": {
    "employer": "string",
    "employerType": "501c3_nonprofit" | "government" | "private" | "academic",
    "pslfEligible": boolean,
    "annualSalary": number
  },
  "confidence": "high" | "medium" | "low",
  "notes": "string"
}`;
  }

  parseAnalysisResponse(responseText) {
    try {
      // Extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const jsonStr = jsonMatch[0];
      const parsed = JSON.parse(jsonStr);
      
      return {
        ...parsed,
        confidence: parsed.confidence || 'medium',
        rawResponse: responseText
      };
    } catch (error) {
      console.error('Failed to parse OpenAI response:', error);
      return {
        federalLoans: [],
        privateLoans: [],
        confidence: 'low',
        error: 'Failed to parse document',
        rawResponse: responseText
      };
    }
  }

  mergeAnalysisResults(mainResults, newAnalysis) {
    // Merge federal loans
    if (newAnalysis.federalLoans) {
      mainResults.federalLoans.push(...newAnalysis.federalLoans);
    }

    // Merge private loans
    if (newAnalysis.privateLoans) {
      mainResults.privateLoans.push(...newAnalysis.privateLoans);
    }

    // Update employment data (prefer the most complete data)
    if (newAnalysis.employment && Object.keys(newAnalysis.employment).length > 0) {
      mainResults.employment = { ...mainResults.employment, ...newAnalysis.employment };
    }

    // Update payment information
    if (newAnalysis.currentPaymentPlan) {
      mainResults.extractedData.currentPaymentPlan = newAnalysis.currentPaymentPlan;
    }
    if (newAnalysis.monthlyPayment) {
      mainResults.extractedData.monthlyPayment = newAnalysis.monthlyPayment;
    }
    if (newAnalysis.pslfPaymentCount !== undefined) {
      mainResults.extractedData.pslfPaymentCount = newAnalysis.pslfPaymentCount;
    }

    // Update confidence (use lowest confidence across all documents)
    const confidenceMap = { high: 3, medium: 2, low: 1 };
    const currentConfidence = confidenceMap[mainResults.confidence] || 2;
    const newConfidence = confidenceMap[newAnalysis.confidence] || 2;
    
    if (newConfidence < currentConfidence) {
      mainResults.confidence = newAnalysis.confidence;
    }
  }

  validateExtractedData(results) {
    const validationRules = {
      totalLoans: { min: 10000, max: 600000 },
      interestRate: { min: 2.0, max: 12.0 },
      residentSalary: { min: 35000, max: 80000 },
      attendingSalary: { min: 150000, max: 1000000 }
    };

    // Validate loan amounts
    const totalFederal = results.federalLoans.reduce((sum, loan) => sum + (loan.balance || 0), 0);
    const totalPrivate = results.privateLoans.reduce((sum, loan) => sum + (loan.balance || 0), 0);
    const totalLoans = totalFederal + totalPrivate;

    if (totalLoans < validationRules.totalLoans.min || totalLoans > validationRules.totalLoans.max) {
      results.recommendations.push({
        type: 'warning',
        message: `Total loan amount (${this.formatCurrency(totalLoans)}) seems unusual. Please verify.`
      });
      results.confidence = 'low';
    }

    // Validate interest rates
    const allLoans = [...results.federalLoans, ...results.privateLoans];
    allLoans.forEach(loan => {
      if (loan.interestRate && (loan.interestRate < validationRules.interestRate.min || loan.interestRate > validationRules.interestRate.max)) {
        results.recommendations.push({
          type: 'warning',
          message: `Interest rate ${loan.interestRate}% seems unusual. Please verify.`
        });
      }
    });

    // Validate salary if provided
    if (results.employment.annualSalary) {
      const salary = results.employment.annualSalary;
      if (salary < validationRules.residentSalary.min || salary > validationRules.attendingSalary.max) {
        results.recommendations.push({
          type: 'info',
          message: `Salary ${this.formatCurrency(salary)} will be used for calculations.`
        });
      }
    }
  }

  fillMissingData(results, userContext) {
    // Fill missing interest rates with typical values
    results.federalLoans.forEach(loan => {
      if (!loan.interestRate) {
        loan.interestRate = this.getTypicalFederalRate(loan.disbursementDate);
        results.recommendations.push({
          type: 'info',
          message: `Using typical rate ${loan.interestRate}% for federal loan (rate not found in document)`
        });
      }
    });

    // Fill missing salary based on specialty and stage
    if (!results.employment.annualSalary && userContext.specialty && userContext.careerStage) {
      const estimatedSalary = this.getTypicalSalary(userContext.specialty, userContext.careerStage);
      results.employment.annualSalary = estimatedSalary;
      results.recommendations.push({
        type: 'info',
        message: `Using typical ${userContext.careerStage} salary ${this.formatCurrency(estimatedSalary)} for ${userContext.specialty}`
      });
    }

    // Determine PSLF eligibility if missing
    if (results.employment.pslfEligible === undefined && results.employment.employerType) {
      results.employment.pslfEligible = ['501c3_nonprofit', 'government', 'academic'].includes(results.employment.employerType);
    }
  }

  getTypicalFederalRate(disbursementDate) {
    // Return typical federal loan rates based on disbursement year
    const year = disbursementDate ? new Date(disbursementDate).getFullYear() : new Date().getFullYear();
    
    const ratesByYear = {
      2023: 5.5, 2022: 4.99, 2021: 3.73, 2020: 4.30,
      2019: 5.05, 2018: 5.05, 2017: 4.45, 2016: 3.76
    };
    
    return ratesByYear[year] || 5.5;
  }

  getTypicalSalary(specialty, careerStage) {
    const salaryData = {
      'medical-student': 0,
      'resident-fellow': 60000,
      'new-attending': {
        'primary-care': 250000,
        'surgery': 450000,
        'hospital-based': 380000,
        'specialty-medicine': 420000,
        'anesthesiology': 380000,
        'emergency-medicine': 350000,
        'internal-medicine': 250000,
        'family-medicine': 240000
      },
      'experienced-physician': {
        'primary-care': 280000,
        'surgery': 550000,
        'hospital-based': 450000,
        'specialty-medicine': 500000,
        'anesthesiology': 450000,
        'emergency-medicine': 400000,
        'internal-medicine': 280000,
        'family-medicine': 270000
      }
    };

    if (careerStage === 'medical-student' || careerStage === 'resident-fellow') {
      return salaryData[careerStage];
    }

    const stageData = salaryData[careerStage] || salaryData['new-attending'];
    return stageData[specialty] || stageData['primary-care'];
  }

  async convertToBase64(file) {
    if (file.buffer) {
      // If file has buffer (from multer), convert directly
      return file.buffer.toString('base64');
    }
    
    if (file.path) {
      // If file has path, read from filesystem
      const fs = await import('fs/promises');
      const fileBuffer = await fs.readFile(file.path);
      return fileBuffer.toString('base64');
    }
    
    // Fallback for mock data
    return Buffer.from('mock-file-content').toString('base64');
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  async testConnection() {
    if (!this.enabled) {
      return { success: false, error: 'OpenAI API key not configured' };
    }

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Test connection" }],
        max_tokens: 5
      });

      return { 
        success: true, 
        message: 'OpenAI service connected successfully',
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

export default new DocumentAnalysisService();