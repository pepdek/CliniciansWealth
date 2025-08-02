import express from 'express';
import webSearchService from '../services/webSearchService.js';
import pdfService from '../services/pdfService.js';
import emailService from '../services/emailService.js';
import documentAnalysisService from '../services/documentAnalysisService.js';
import calculationService from '../services/calculationService.js';
import stripeService from '../services/stripeService.js';
import pdfGenerationService from '../services/pdfGenerationService.js';

const router = express.Router();

// Test MCP services connectivity
router.get('/test', async (req, res) => {
  try {
    const results = {
      webSearch: await webSearchService.testConnection(),
      email: await emailService.testConnection(),
      timestamp: new Date().toISOString()
    };

    const allSuccess = Object.values(results).every(result => 
      typeof result === 'object' && result.success !== false
    );

    res.json({
      success: allSuccess,
      services: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Search for salary data
router.post('/search/salary', async (req, res) => {
  try {
    const { specialty, location, year } = req.body;

    if (!specialty) {
      return res.status(400).json({
        success: false,
        error: 'Specialty is required'
      });
    }

    const salaryData = await webSearchService.searchSalaryData(
      specialty, 
      location || 'United States', 
      year || '2025'
    );

    res.json({
      success: true,
      data: salaryData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Search for refinancing rates
router.get('/search/refinancing-rates', async (req, res) => {
  try {
    const { year } = req.query;
    
    const ratesData = await webSearchService.searchRefinancingRates(year || '2025');

    res.json({
      success: true,
      data: ratesData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Search for PSLF updates
router.get('/search/pslf-updates', async (req, res) => {
  try {
    const { year } = req.query;
    
    const pslfUpdates = await webSearchService.searchPSLFUpdates(year || '2025');

    res.json({
      success: true,
      data: pslfUpdates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Generate comprehensive PDF report
router.post('/generate/report', async (req, res) => {
  try {
    const { userData, calculations } = req.body;

    if (!userData || !calculations) {
      return res.status(400).json({
        success: false,
        error: 'userData and calculations are required'
      });
    }

    const report = await pdfService.generateLoanReport(userData, calculations);

    if (report.success) {
      res.json({
        success: true,
        report: {
          reportId: report.reportId,
          filename: report.filename,
          downloadUrl: `/api/mcp/download/${report.reportId}`,
          size: report.size
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: report.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Generate quick summary PDF
router.post('/generate/summary', async (req, res) => {
  try {
    const { userData, calculations } = req.body;

    if (!userData || !calculations) {
      return res.status(400).json({
        success: false,
        error: 'userData and calculations are required'
      });
    }

    const summary = await pdfService.generateQuickSummary(userData, calculations);

    if (summary.success) {
      res.json({
        success: true,
        summary: {
          filename: summary.filename,
          downloadUrl: `/api/mcp/download-summary/${summary.filename}`
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to generate summary'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Send report via email
router.post('/email/send-report', async (req, res) => {
  try {
    const { userEmail, userName, reportData } = req.body;

    if (!userEmail || !userName || !reportData) {
      return res.status(400).json({
        success: false,
        error: 'userEmail, userName, and reportData are required'
      });
    }

    const result = await emailService.sendReportEmail(userEmail, userName, reportData);

    if (result.success) {
      res.json({
        success: true,
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start welcome email sequence
router.post('/email/welcome-sequence', async (req, res) => {
  try {
    const { userEmail, userName, userData } = req.body;

    if (!userEmail || !userName) {
      return res.status(400).json({
        success: false,
        error: 'userEmail and userName are required'
      });
    }

    await emailService.sendWelcomeSequence(userEmail, userName, userData || {});

    res.json({
      success: true,
      message: 'Welcome email sequence initiated'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Download generated report
router.get('/download/:reportId', async (req, res) => {
  try {
    const { reportId } = req.params;
    const filepath = `./generated/${reportId}.pdf`;

    res.download(filepath, `loan-optimization-report-${reportId}.pdf`, (error) => {
      if (error) {
        res.status(404).json({
          success: false,
          error: 'Report not found'
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Download summary report
router.get('/download-summary/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filepath = `./generated/${filename}`;

    res.download(filepath, `loan-summary-${Date.now()}.pdf`, (error) => {
      if (error) {
        res.status(404).json({
          success: false,
          error: 'Summary not found'
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Enhanced search endpoint that combines multiple data sources
router.post('/search/comprehensive', async (req, res) => {
  try {
    const { specialty, location, year } = req.body;

    if (!specialty) {
      return res.status(400).json({
        success: false,
        error: 'Specialty is required'
      });
    }

    const [salaryData, refinancingRates, pslfUpdates] = await Promise.allSettled([
      webSearchService.searchSalaryData(specialty, location, year),
      webSearchService.searchRefinancingRates(year),
      webSearchService.searchPSLFUpdates(year)
    ]);

    const results = {
      salary: salaryData.status === 'fulfilled' ? salaryData.value : null,
      refinancing: refinancingRates.status === 'fulfilled' ? refinancingRates.value : null,
      pslf: pslfUpdates.status === 'fulfilled' ? pslfUpdates.value : null,
      errors: []
    };

    if (salaryData.status === 'rejected') results.errors.push({ type: 'salary', error: salaryData.reason.message });
    if (refinancingRates.status === 'rejected') results.errors.push({ type: 'refinancing', error: refinancingRates.reason.message });
    if (pslfUpdates.status === 'rejected') results.errors.push({ type: 'pslf', error: pslfUpdates.reason.message });

    res.json({
      success: true,
      data: results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Analyze loan documents with AI
router.post('/analyze/documents', async (req, res) => {
  try {
    const { files, userContext } = req.body;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Files are required for analysis'
      });
    }

    const analysisResults = await documentAnalysisService.analyzeDocuments(files, userContext);

    res.json({
      success: true,
      data: analysisResults
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Calculate optimization strategy
router.post('/calculate/optimization', async (req, res) => {
  try {
    const { loanData, userProfile } = req.body;

    if (!loanData || !userProfile) {
      return res.status(400).json({
        success: false,
        error: 'loanData and userProfile are required'
      });
    }

    const strategy = await calculationService.calculateOptimizationStrategy(loanData, userProfile);

    res.json({
      success: true,
      data: strategy
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test document analysis service
router.get('/test/document-analysis', async (req, res) => {
  try {
    const testResult = await documentAnalysisService.testConnection();
    
    res.json({
      success: true,
      service: 'Document Analysis',
      status: testResult
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create checkout session for Stripe Checkout
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { priceId, customerData, includeMonitoring, successUrl, cancelUrl } = req.body;

    if (!customerData || !customerData.email) {
      return res.status(400).json({
        success: false,
        error: 'Customer data with email is required'
      });
    }

    const result = await stripeService.createCheckoutSession({
      priceId,
      customerData,
      includeMonitoring,
      successUrl,
      cancelUrl
    });

    if (result.success) {
      res.json({
        success: true,
        url: result.url,
        sessionId: result.sessionId
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create payment intent
router.post('/payment/create-intent', async (req, res) => {
  try {
    const { amount, customerData, metadata } = req.body;

    if (!amount || !customerData || !customerData.email) {
      return res.status(400).json({
        success: false,
        error: 'Amount and customer data with email are required'
      });
    }

    const result = await stripeService.createPaymentIntent(amount, customerData, metadata);

    if (result.success) {
      res.json({
        success: true,
        paymentIntent: result.paymentIntent
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Confirm payment
router.post('/payment/confirm', async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        error: 'Payment intent ID is required'
      });
    }

    const result = await stripeService.confirmPayment(paymentIntentId);

    if (result.success) {
      // Trigger report generation and email sending
      const customerData = result.payment.metadata;
      
      // Generate PDF report
      const reportData = {
        customerData,
        calculations: {
          potentialSavings: customerData.potential_savings,
          recommendedStrategy: customerData.recommended_strategy
        }
      };

      try {
        // Generate and send report
        await pdfService.generateLoanReport(customerData, reportData.calculations);
        await emailService.sendReportEmail(
          customerData.customer_email,
          customerData.customer_name,
          reportData
        );
        
        // Start welcome sequence
        await emailService.sendWelcomeSequence(
          customerData.customer_email,
          customerData.customer_name,
          customerData
        );
      } catch (emailError) {
        console.error('Post-payment processing failed:', emailError);
        // Payment succeeded but report generation failed - we should handle this gracefully
      }

      res.json({
        success: true,
        payment: result.payment,
        message: 'Payment successful - your report will be emailed shortly'
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get pricing information
router.get('/payment/pricing', async (req, res) => {
  try {
    const pricing = await stripeService.getPricing();
    
    res.json({
      success: true,
      pricing
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Stripe webhook endpoint
router.post('/payment/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'];
    
    if (!signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing stripe signature'
      });
    }

    const result = await stripeService.handleWebhook(req.body, signature);

    if (result.success) {
      res.json({ received: true });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test Stripe service
router.get('/test/stripe', async (req, res) => {
  try {
    const testResult = await stripeService.testConnection();
    
    res.json({
      success: true,
      service: 'Stripe',
      status: testResult
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Generate personalized PDF report with OpenAI analysis
router.post('/generate/personalized-report', async (req, res) => {
  try {
    const { analysisData, calculationResults, userProfile } = req.body;

    if (!calculationResults || !userProfile) {
      return res.status(400).json({
        success: false,
        error: 'calculationResults and userProfile are required'
      });
    }

    const result = await pdfGenerationService.generatePersonalizedReport(
      analysisData || {},
      calculationResults,
      userProfile
    );

    if (result.success) {
      // Set appropriate headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
      res.setHeader('Content-Length', result.pdf.length);
      
      res.send(result.pdf);
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test PDF generation service
router.get('/test/pdf-generation', async (req, res) => {
  try {
    const testResult = await pdfGenerationService.testConnection();
    
    res.json({
      success: true,
      service: 'PDF Generation',
      status: testResult
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;