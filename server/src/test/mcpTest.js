import webSearchService from '../services/webSearchService.js';
import pdfService from '../services/pdfService.js';
import emailService from '../services/emailService.js';
import fallbackServices from '../services/fallbackServices.js';

async function testMCPServices() {
  console.log('🧪 Testing MCP Services Integration...\n');

  // Test data
  const testUserData = {
    firstName: 'Dr. Sarah',
    lastName: 'Johnson',
    specialty: 'anesthesiology',
    graduationYear: 2020,
    totalLoans: 350000,
    projectedSalary: 380000
  };

  const testCalculations = {
    pslf: {
      totalPaid: 120000,
      forgiveness: 230000,
      monthlyPayment: 1000,
      yearsToForgiveness: 10
    },
    refinancing: {
      totalPaid: 280000,
      savings: 70000,
      monthlyPayment: 2333,
      newRate: 0.045,
      termYears: 10
    },
    recommendation: 'PSLF',
    recommendationReason: 'Based on your specialty and loan amount, PSLF provides significant savings.'
  };

  const results = {
    webSearch: { success: false, error: null },
    pdf: { success: false, error: null },
    email: { success: false, error: null },
    fallback: { success: false, error: null }
  };

  // Test 1: Web Search Service
  console.log('1️⃣ Testing Web Search Service...');
  try {
    const searchTest = await webSearchService.testConnection();
    if (searchTest.success) {
      console.log('✅ Web search service connected');
      
      try {
        const salaryData = await webSearchService.searchSalaryData('anesthesiology', 'United States', '2025');
        console.log('✅ Salary search successful:', {
          specialty: salaryData.specialty,
          estimatedSalary: salaryData.estimatedSalary,
          confidence: salaryData.confidence
        });
        results.webSearch.success = true;
      } catch (error) {
        console.log('⚠️ Salary search failed, will use fallback:', error.message);
        results.webSearch.error = error.message;
      }
    } else {
      console.log('⚠️ Web search service not configured:', searchTest.error);
      results.webSearch.error = searchTest.error;
    }
  } catch (error) {
    console.log('❌ Web search test failed:', error.message);
    results.webSearch.error = error.message;
  }

  // Test 2: PDF Generation Service
  console.log('\n2️⃣ Testing PDF Generation Service...');
  try {
    const pdfResult = await pdfService.generateLoanReport(testUserData, testCalculations);
    if (pdfResult.success) {
      console.log('✅ PDF generation successful:', {
        reportId: pdfResult.reportId,
        filename: pdfResult.filename,
        size: pdfResult.size
      });
      results.pdf.success = true;
    } else {
      console.log('❌ PDF generation failed:', pdfResult.error);
      results.pdf.error = pdfResult.error;
    }
  } catch (error) {
    console.log('❌ PDF test failed:', error.message);
    results.pdf.error = error.message;
  }

  // Test 3: Email Service
  console.log('\n3️⃣ Testing Email Service...');
  try {
    const emailTest = await emailService.testConnection();
    if (emailTest.success) {
      console.log('✅ Email service connected');
      results.email.success = true;
    } else {
      console.log('⚠️ Email service not configured:', emailTest.error);
      results.email.error = emailTest.error;
    }
  } catch (error) {
    console.log('❌ Email test failed:', error.message);
    results.email.error = error.message;
  }

  // Test 4: Fallback Services
  console.log('\n4️⃣ Testing Fallback Services...');
  try {
    // Test fallback salary data
    const fallbackSalary = await fallbackServices.getEstimatedSalaryData('anesthesiology');
    console.log('✅ Fallback salary data:', {
      specialty: fallbackSalary.specialty,
      estimatedSalary: fallbackSalary.estimatedSalary,
      method: fallbackSalary.method
    });

    // Test fallback PDF
    const fallbackPDF = await fallbackServices.generateFallbackPDF(testUserData, testCalculations);
    if (fallbackPDF.success) {
      console.log('✅ Fallback PDF generation successful:', fallbackPDF.filename);
    }

    // Test fallback email
    const fallbackEmail = await fallbackServices.sendFallbackEmail(
      'test@example.com', 
      'Dr. Test', 
      { recommendation: 'PSLF', potentialSavings: '$70,000' }
    );
    console.log('✅ Fallback email logged successfully');

    results.fallback.success = true;
  } catch (error) {
    console.log('❌ Fallback test failed:', error.message);
    results.fallback.error = error.message;
  }

  // Summary
  console.log('\n📊 MCP Services Test Summary:');
  console.log('================================');
  console.log(`Web Search: ${results.webSearch.success ? '✅ Working' : '❌ Failed'}`);
  console.log(`PDF Generation: ${results.pdf.success ? '✅ Working' : '❌ Failed'}`);
  console.log(`Email Service: ${results.email.success ? '✅ Working' : '❌ Failed'}`);
  console.log(`Fallback Services: ${results.fallback.success ? '✅ Working' : '❌ Failed'}`);

  const workingServices = Object.values(results).filter(r => r.success).length;
  console.log(`\n${workingServices}/4 services operational`);

  if (workingServices < 4) {
    console.log('\n🔧 To enable all services:');
    if (!results.webSearch.success) {
      console.log('• Set BRAVE_API_KEY in your .env file for web search');
    }
    if (!results.email.success) {
      console.log('• Configure SMTP settings in your .env file for email');
    }
    if (!results.pdf.success) {
      console.log('• Ensure sufficient disk space and permissions for PDF generation');
    }
  }

  return results;
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testMCPServices().catch(console.error);
}

export default testMCPServices;