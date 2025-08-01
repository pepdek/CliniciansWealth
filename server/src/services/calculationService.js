class CalculationService {
  constructor() {
    this.currentYear = new Date().getFullYear();
    this.pslfPaymentRequirement = 120; // 10 years of qualifying payments
  }

  async calculateOptimizationStrategy(loanData, userProfile) {
    try {
      const results = {
        userProfile,
        loanSummary: this.calculateLoanSummary(loanData),
        pslfAnalysis: null,
        refinancingAnalysis: null,
        recommendation: null,
        savings: null,
        detailedProjections: null,
        taxImplications: null,
        implementationSteps: []
      };

      // Calculate PSLF scenario if eligible
      if (this.isPSLFEligible(userProfile, loanData)) {
        results.pslfAnalysis = this.calculatePSLFScenario(loanData, userProfile);
      }

      // Calculate refinancing scenarios
      results.refinancingAnalysis = this.calculateRefinancingScenarios(loanData, userProfile);

      // Determine optimal strategy
      results.recommendation = this.determineOptimalStrategy(results.pslfAnalysis, results.refinancingAnalysis, userProfile);
      
      // Calculate potential savings
      results.savings = this.calculateSavings(results.pslfAnalysis, results.refinancingAnalysis, results.recommendation);

      // Generate detailed projections
      results.detailedProjections = this.generateDetailedProjections(results.recommendation, loanData, userProfile);

      // Calculate tax implications
      results.taxImplications = this.calculateTaxImplications(results.recommendation, userProfile);

      // Generate implementation steps
      results.implementationSteps = this.generateImplementationSteps(results.recommendation, userProfile);

      return results;
    } catch (error) {
      console.error('Calculation error:', error);
      throw new Error('Failed to calculate optimization strategy');
    }
  }

  calculateLoanSummary(loanData) {
    const federalLoans = loanData.federalLoans || [];
    const privateLoans = loanData.privateLoans || [];
    
    const totalFederalBalance = federalLoans.reduce((sum, loan) => sum + (loan.balance || 0), 0);
    const totalPrivateBalance = privateLoans.reduce((sum, loan) => sum + (loan.balance || 0), 0);
    const totalBalance = totalFederalBalance + totalPrivateBalance;
    
    const weightedFederalRate = federalLoans.length > 0 
      ? federalLoans.reduce((sum, loan) => sum + (loan.balance || 0) * (loan.interestRate || 0), 0) / totalFederalBalance
      : 0;
    
    const weightedPrivateRate = privateLoans.length > 0
      ? privateLoans.reduce((sum, loan) => sum + (loan.balance || 0) * (loan.interestRate || 0), 0) / totalPrivateBalance
      : 0;

    return {
      totalBalance,
      totalFederalBalance,
      totalPrivateBalance,
      weightedFederalRate,
      weightedPrivateRate,
      federalLoanCount: federalLoans.length,
      privateLoanCount: privateLoans.length,
      currentMonthlyPayment: loanData.extractedData?.monthlyPayment || 0,
      currentPaymentPlan: loanData.extractedData?.currentPaymentPlan || 'Standard',
      pslfPaymentsMade: loanData.extractedData?.pslfPaymentCount || 0
    };
  }

  isPSLFEligible(userProfile, loanData) {
    // Check if user works for qualifying employer
    const qualifyingEmployerTypes = ['501c3_nonprofit', 'government', 'academic'];
    const hasQualifyingEmployer = loanData.employment?.pslfEligible || 
      qualifyingEmployerTypes.includes(loanData.employment?.employerType);
    
    // Check if they have qualifying federal loans
    const hasDirectLoans = (loanData.federalLoans || []).some(loan => 
      loan.loanType && loan.loanType.includes('Direct')
    );
    
    // Consider career goals
    const plansPSLFCareer = userProfile.careerGoals === 'public-service' || 
      userProfile.careerGoals === 'academic' ||
      userProfile.careerGoals === 'government';

    return hasQualifyingEmployer && hasDirectLoans && plansPSLFCareer;
  }

  calculatePSLFScenario(loanData, userProfile) {
    const loanSummary = this.calculateLoanSummary(loanData);
    const projectedSalary = this.getProjectedSalary(userProfile);
    const currentAge = this.getCurrentAge(userProfile);
    
    // Calculate income-driven payments (using REPAYE as most common)
    const idrPayments = this.calculateIDRPayments(loanSummary.totalFederalBalance, projectedSalary, userProfile);
    
    // Calculate remaining payments needed for PSLF
    const paymentsMade = loanSummary.pslfPaymentsMade;
    const paymentsRemaining = Math.max(0, this.pslfPaymentRequirement - paymentsMade);
    const yearsRemaining = paymentsRemaining / 12;
    
    // Project salary growth over remaining period
    const projectedPayments = this.projectIDRPayments(projectedSalary, yearsRemaining, userProfile);
    
    // Calculate total paid and forgiven amount
    const totalPaid = paymentsMade * (idrPayments.monthlyPayment || 0) + projectedPayments.totalPaid;
    const balanceAtForgiveness = this.calculateBalanceAtForgiveness(loanSummary, projectedPayments, yearsRemaining);
    const forgivenAmount = Math.max(0, balanceAtForgiveness);
    
    // Calculate tax implications of forgiveness
    const taxOnForgiveness = this.calculateTaxOnForgiveness(forgivenAmount, projectedSalary, userProfile);

    return {
      strategy: 'PSLF',
      eligibilityConfirmed: true,
      paymentsMade,
      paymentsRemaining,
      yearsRemaining,
      monthlyPayment: idrPayments.monthlyPayment,
      totalPaid,
      forgivenAmount,
      taxOnForgiveness,
      netCost: totalPaid + taxOnForgiveness,
      completionAge: currentAge + yearsRemaining,
      paymentPlan: 'REPAYE',
      requirements: this.getPSLFRequirements(userProfile)
    };
  }

  calculateRefinancingScenarios(loanData, userProfile) {
    const loanSummary = this.calculateLoanSummary(loanData);
    const projectedSalary = this.getProjectedSalary(userProfile);
    const currentAge = this.getCurrentAge(userProfile);
    
    const scenarios = [];
    const refinanceRates = [3.5, 4.0, 4.5, 5.0, 5.5, 6.0]; // Common refi rates
    const terms = [5, 7, 10, 15, 20]; // Different term options
    
    for (const rate of refinanceRates) {
      for (const termYears of terms) {
        const monthlyPayment = this.calculateMonthlyPayment(
          loanSummary.totalBalance, 
          rate / 100, 
          termYears * 12
        );
        
        const totalPaid = monthlyPayment * termYears * 12;
        const totalInterest = totalPaid - loanSummary.totalBalance;
        
        // Check affordability based on salary
        const monthlyIncome = projectedSalary / 12;
        const debtToIncomeRatio = monthlyPayment / monthlyIncome;
        const isAffordable = debtToIncomeRatio <= 0.15; // 15% max recommended DTI for physicians
        
        scenarios.push({
          rate,
          termYears,
          monthlyPayment,
          totalPaid,
          totalInterest,
          debtToIncomeRatio,
          isAffordable,
          completionAge: currentAge + termYears,
          eligibility: this.assessRefinanceEligibility(projectedSalary, loanSummary.totalBalance, userProfile)
        });
      }
    }
    
    // Sort by total cost and filter to reasonable options
    scenarios.sort((a, b) => a.totalPaid - b.totalPaid);
    
    return {
      strategy: 'Refinancing',
      availableScenarios: scenarios,
      recommendedScenario: scenarios.find(s => s.isAffordable) || scenarios[0],
      bestRate: Math.min(...refinanceRates),
      estimatedApprovalOdds: this.calculateApprovalOdds(projectedSalary, loanSummary.totalBalance, userProfile)
    };
  }

  determineOptimalStrategy(pslfAnalysis, refinancingAnalysis, userProfile) {
    if (!pslfAnalysis) {
      return {
        recommendedStrategy: 'Refinancing',
        reason: 'Not eligible for PSLF - refinancing offers better terms',
        confidence: 'high',
        primaryOption: refinancingAnalysis.recommendedScenario,
        alternativeOption: null
      };
    }
    
    const pslfNetCost = pslfAnalysis.netCost;
    const refinanceNetCost = refinancingAnalysis.recommendedScenario.totalPaid;
    const savings = Math.abs(pslfNetCost - refinanceNetCost);
    
    if (pslfNetCost < refinanceNetCost * 0.8) { // PSLF saves at least 20%
      return {
        recommendedStrategy: 'PSLF',
        reason: `PSLF saves $${this.formatCurrency(savings)} over refinancing`,
        confidence: 'high',
        primaryOption: pslfAnalysis,
        alternativeOption: refinancingAnalysis.recommendedScenario
      };
    } else if (refinanceNetCost < pslfNetCost * 0.9) { // Refinancing saves at least 10%
      return {
        recommendedStrategy: 'Refinancing',
        reason: `Refinancing saves $${this.formatCurrency(savings)} and provides certainty`,
        confidence: 'high',
        primaryOption: refinancingAnalysis.recommendedScenario,
        alternativeOption: pslfAnalysis
      };
    } else { // Close call
      return {
        recommendedStrategy: 'PSLF',
        reason: 'Marginal difference - PSLF provides more forgiveness upside',
        confidence: 'medium',
        primaryOption: pslfAnalysis,
        alternativeOption: refinancingAnalysis.recommendedScenario,
        note: 'Consider personal preference for certainty vs. forgiveness risk'
      };
    }
  }

  calculateSavings(pslfAnalysis, refinancingAnalysis, recommendation) {
    if (!pslfAnalysis || !refinancingAnalysis) {
      return { potentialSavings: 47000, comparisonBased: false }; // Default estimate
    }
    
    const pslfCost = pslfAnalysis.netCost;
    const refinanceCost = refinancingAnalysis.recommendedScenario.totalPaid;
    const standardPaymentCost = this.calculateStandardPaymentCost(pslfAnalysis, refinancingAnalysis);
    
    let potentialSavings;
    if (recommendation.recommendedStrategy === 'PSLF') {
      potentialSavings = Math.max(refinanceCost - pslfCost, standardPaymentCost - pslfCost);
    } else {
      potentialSavings = Math.max(pslfCost - refinanceCost, standardPaymentCost - refinanceCost);
    }
    
    return {
      potentialSavings: Math.round(potentialSavings),
      vsStandardPayments: Math.round(standardPaymentCost - Math.min(pslfCost, refinanceCost)),
      vsAlternativeStrategy: Math.round(Math.abs(pslfCost - refinanceCost)),
      comparisonBased: true
    };
  }

  calculateIDRPayments(loanBalance, salary, userProfile) {
    // REPAYE calculation: 10% of discretionary income
    const povertyGuideline = 13590; // 2023 federal poverty guideline
    const discretionaryIncome = Math.max(0, salary - povertyGuideline * 1.5); // 150% of poverty guideline
    const annualPayment = discretionaryIncome * 0.10; // 10% under REPAYE
    const monthlyPayment = annualPayment / 12;
    
    return {
      monthlyPayment: Math.round(monthlyPayment),
      annualPayment: Math.round(annualPayment),
      discretionaryIncome: Math.round(discretionaryIncome),
      paymentPlan: 'REPAYE'
    };
  }

  projectIDRPayments(startingSalary, years, userProfile) {
    const salaryGrowthRate = this.getSalaryGrowthRate(userProfile);
    let totalPaid = 0;
    let currentSalary = startingSalary;
    
    for (let year = 0; year < years; year++) {
      const idrPayment = this.calculateIDRPayments(0, currentSalary, userProfile);
      totalPaid += idrPayment.annualPayment;
      currentSalary *= (1 + salaryGrowthRate);
    }
    
    return {
      totalPaid: Math.round(totalPaid),
      finalSalary: Math.round(currentSalary),
      averageMonthlyPayment: Math.round(totalPaid / (years * 12))
    };
  }

  calculateBalanceAtForgiveness(loanSummary, projectedPayments, yearsRemaining) {
    const principal = loanSummary.totalFederalBalance;
    const annualRate = loanSummary.weightedFederalRate / 100;
    const monthlyRate = annualRate / 12;
    const months = yearsRemaining * 12;
    const avgMonthlyPayment = projectedPayments.averageMonthlyPayment;
    
    // Calculate balance after making IDR payments
    let balance = principal;
    for (let month = 0; month < months; month++) {
      const interestCharge = balance * monthlyRate;
      balance = balance + interestCharge - avgMonthlyPayment;
      if (balance < 0) balance = 0;
    }
    
    return Math.round(balance);
  }

  calculateMonthlyPayment(principal, annualRate, months) {
    const monthlyRate = annualRate / 12;
    if (monthlyRate === 0) return principal / months;
    
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
      (Math.pow(1 + monthlyRate, months) - 1);
    
    return Math.round(payment);
  }

  getProjectedSalary(userProfile) {
    const specialty = userProfile.specialty;
    const careerStage = userProfile.careerStage;
    
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

  getCurrentAge(userProfile) {
    // Estimate age based on career stage
    const ageEstimates = {
      'medical-student': 25,
      'resident-fellow': 28,
      'new-attending': 32,
      'experienced-physician': 40
    };
    
    return ageEstimates[userProfile.careerStage] || 30;
  }

  getSalaryGrowthRate(userProfile) {
    // Conservative salary growth rates by career stage
    const growthRates = {
      'medical-student': 0.03,
      'resident-fellow': 0.15, // Big jump to attending
      'new-attending': 0.05,
      'experienced-physician': 0.03
    };
    
    return growthRates[userProfile.careerStage] || 0.03;
  }

  calculateTaxOnForgiveness(forgivenAmount, salary, userProfile) {
    // Estimate marginal tax rate based on salary
    let marginalRate = 0.22; // Default 22% bracket
    
    if (salary > 400000) marginalRate = 0.35;
    else if (salary > 200000) marginalRate = 0.32;
    else if (salary > 100000) marginalRate = 0.24;
    
    // Add state tax estimate (average ~5%)
    const stateRate = 0.05;
    const totalRate = marginalRate + stateRate;
    
    return Math.round(forgivenAmount * totalRate);
  }

  calculateStandardPaymentCost(pslfAnalysis, refinancingAnalysis) {
    // Estimate 10-year standard payment cost
    const loanBalance = pslfAnalysis ? pslfAnalysis.netCost : refinancingAnalysis.recommendedScenario.totalPaid;
    const estimatedRate = 0.055; // Average federal rate
    const monthlyPayment = this.calculateMonthlyPayment(loanBalance, estimatedRate, 120);
    
    return monthlyPayment * 120;
  }

  assessRefinanceEligibility(salary, loanBalance, userProfile) {
    const debtToIncomeRatio = loanBalance / salary;
    
    if (salary >= 200000 && debtToIncomeRatio <= 3.0) return 'excellent';
    if (salary >= 150000 && debtToIncomeRatio <= 4.0) return 'good';
    if (salary >= 100000 && debtToIncomeRatio <= 5.0) return 'fair';
    return 'challenging';
  }

  calculateApprovalOdds(salary, loanBalance, userProfile) {
    const eligibility = this.assessRefinanceEligibility(salary, loanBalance, userProfile);
    
    const odds = {
      'excellent': 95,
      'good': 85,
      'fair': 70,
      'challenging': 40
    };
    
    return odds[eligibility] || 50;
  }

  getPSLFRequirements(userProfile) {
    return [
      'Work full-time for qualifying employer (government, 501c3 nonprofit, etc.)',
      'Make 120 qualifying payments under income-driven repayment plan',
      'Only Direct Loans are eligible (consolidate FFEL loans if needed)',
      'Submit Employment Certification Form annually',
      'Submit PSLF application after 120th payment'
    ];
  }

  generateDetailedProjections(recommendation, loanData, userProfile) {
    const strategy = recommendation.primaryOption;
    const projections = {
      monthlyPayments: [],
      annualSummary: [],
      milestones: []
    };
    
    if (recommendation.recommendedStrategy === 'PSLF') {
      return this.generatePSLFProjections(strategy, userProfile);
    } else {
      return this.generateRefinanceProjections(strategy, userProfile);
    }
  }

  generatePSLFProjections(pslfAnalysis, userProfile) {
    const projections = {
      monthlyPayments: [],
      annualSummary: [],
      milestones: []
    };
    
    let currentSalary = this.getProjectedSalary(userProfile);
    const growthRate = this.getSalaryGrowthRate(userProfile);
    const yearsRemaining = pslfAnalysis.yearsRemaining;
    
    for (let year = 1; year <= yearsRemaining; year++) {
      const idrPayment = this.calculateIDRPayments(0, currentSalary, userProfile);
      
      projections.annualSummary.push({
        year,
        salary: Math.round(currentSalary),
        monthlyPayment: idrPayment.monthlyPayment,
        annualPayment: idrPayment.annualPayment,
        paymentsRemaining: Math.max(0, pslfAnalysis.paymentsRemaining - (year * 12))
      });
      
      currentSalary *= (1 + growthRate);
    }
    
    // Add milestones
    projections.milestones = [
      { year: 1, event: 'Submit Employment Certification Form', action: 'required' },
      { year: Math.ceil(yearsRemaining / 2), event: 'Mid-point check-in', action: 'recommended' },
      { year: Math.ceil(yearsRemaining), event: 'PSLF Application Due', action: 'required' }
    ];
    
    return projections;
  }

  generateRefinanceProjections(refinanceScenario, userProfile) {
    const projections = {
      monthlyPayments: [],
      annualSummary: [],
      milestones: []
    };
    
    const monthlyPayment = refinanceScenario.monthlyPayment;
    const termYears = refinanceScenario.termYears;
    
    for (let year = 1; year <= termYears; year++) {
      projections.annualSummary.push({
        year,
        monthlyPayment,
        annualPayment: monthlyPayment * 12,
        remainingTerm: termYears - year
      });
    }
    
    // Add milestones
    projections.milestones = [
      { year: 1, event: 'First year review', action: 'recommended' },
      { year: Math.ceil(termYears / 2), event: 'Consider additional refinancing', action: 'optional' },
      { year: termYears, event: 'Loans paid off!', action: 'celebration' }
    ];
    
    return projections;
  }

  calculateTaxImplications(recommendation, userProfile) {
    const implications = {
      currentYear: [],
      futureYears: [],
      strategies: []
    };
    
    if (recommendation.recommendedStrategy === 'PSLF') {
      implications.futureYears.push({
        event: 'PSLF Forgiveness',
        year: new Date().getFullYear() + Math.ceil(recommendation.primaryOption.yearsRemaining),
        taxImpact: recommendation.primaryOption.taxOnForgiveness,
        description: 'Federal tax due on forgiven amount'
      });
      
      implications.strategies.push({
        strategy: 'Tax Planning for Forgiveness',
        description: 'Set aside funds annually to pay tax on forgiven amount',
        suggestedAction: `Save $${Math.round(recommendation.primaryOption.taxOnForgiveness / recommendation.primaryOption.yearsRemaining)} annually`
      });
    }
    
    // Student loan interest deduction
    implications.currentYear.push({
      benefit: 'Student Loan Interest Deduction',
      maxBenefit: 2500,
      description: 'Deduct up to $2,500 in student loan interest paid',
      incomeLimit: 'Phases out between $70K-$85K (single) or $140K-$170K (married)'
    });
    
    return implications;
  }

  generateImplementationSteps(recommendation, userProfile) {
    const steps = [];
    
    if (recommendation.recommendedStrategy === 'PSLF') {
      steps.push(
        {
          step: 1,
          title: 'Verify Employment Eligibility',
          description: 'Confirm your employer qualifies for PSLF',
          timeline: 'Within 1 week',
          priority: 'critical',
          resources: ['PSLF Help Tool on StudentAid.gov']
        },
        {
          step: 2,
          title: 'Consolidate Non-Direct Loans',
          description: 'Consolidate any FFEL loans into Direct Loans',
          timeline: '2-4 weeks',
          priority: 'critical',
          resources: ['Direct Consolidation Application']
        },
        {
          step: 3,
          title: 'Switch to Income-Driven Repayment',
          description: 'Enroll in REPAYE or PAYE plan',
          timeline: '2-3 weeks',
          priority: 'critical',
          resources: ['Income-Driven Repayment Request form']
        },
        {
          step: 4,
          title: 'Submit Employment Certification',
          description: 'File annual certification to track qualifying payments',
          timeline: '1-2 weeks',
          priority: 'critical',
          resources: ['PSLF Employment Certification Form']
        }
      );
    } else {
      steps.push(
        {
          step: 1,
          title: 'Compare Refinancing Offers',
          description: 'Get quotes from 3-5 lenders for best rates',
          timeline: '1-2 weeks',
          priority: 'critical',
          resources: ['Credible', 'SoFi', 'CommonBond', 'Earnest']
        },
        {
          step: 2,
          title: 'Gather Required Documents',
          description: 'Collect proof of income, employment, and loan details',
          timeline: '3-5 days',
          priority: 'critical',
          resources: ['Pay stubs', 'Tax returns', 'Current loan statements']
        },
        {
          step: 3,
          title: 'Submit Applications',
          description: 'Apply with top 2-3 lenders simultaneously',
          timeline: '1 week',
          priority: 'critical',
          resources: ['Online applications']
        },
        {
          step: 4,
          title: 'Review and Accept Best Offer',
          description: 'Compare final terms and select optimal loan',
          timeline: '3-5 days',
          priority: 'critical',
          resources: ['Loan comparison spreadsheet']
        }
      );
    }
    
    return steps;
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
}

export default new CalculationService();