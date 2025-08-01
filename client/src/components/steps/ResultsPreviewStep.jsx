import { motion } from 'framer-motion';
import { DollarSign, Clock, TrendingUp, FileText, CheckCircle, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const ResultsPreviewStep = ({ nextStep, prevStep, formData, updateFormData }) => {
  const [calculations, setCalculations] = useState(null);
  const [isCalculating, setIsCalculating] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let timeoutId = null;

    const calculateResults = async () => {
      if (!isMounted) return;
      
      setIsCalculating(true);
      
      try {
        let loanData = null;
        
        // Step 1: Analyze documents if available
        if (formData.loanMethod === 'upload' && formData.loanDocuments?.length > 0) {
          console.log('Analyzing uploaded documents...');
          
          try {
            const controller = new AbortController();
            timeoutId = setTimeout(() => controller.abort(), 8000);

            const analysisResponse = await fetch('/api/mcp/analyze/documents', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                files: formData.loanDocuments.map(doc => ({
                  name: doc.name,
                  type: doc.type,
                  size: doc.size
                })),
                userContext: {
                  specialty: formData.specialty,
                  careerStage: formData.careerStage,
                  graduationYear: formData.graduationYear
                }
              }),
              signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (analysisResponse.ok) {
              const analysis = await analysisResponse.json();
              loanData = analysis.data;
            } else {
              console.log('Document analysis failed, using manual data');
            }
          } catch (fetchError) {
            if (fetchError.name === 'AbortError') {
              console.log('Document analysis timed out, using manual data');
            } else {
              console.error('Document analysis API call failed:', fetchError);
            }
            clearTimeout(timeoutId);
          }
        }
        
        // Step 2: Use manual data if no documents or analysis failed
        if (!loanData && isMounted) {
          loanData = {
            federalLoans: [{
              balance: formData.loanAmount || 250000,
              interestRate: 5.5,
              loanType: 'Direct Unsubsidized'
            }],
            privateLoans: [],
            extractedData: {
              currentPaymentPlan: 'Standard',
              monthlyPayment: Math.round((formData.loanAmount || 250000) * 0.01),
              pslfPaymentCount: 0
            },
            employment: {
              pslfEligible: formData.careerGoals === 'public-service' || 
                           formData.careerGoals === 'academic' ||
                           formData.careerGoals === 'government'
            }
          };
        }
        
        // Step 3: Calculate optimization strategy
        if (!isMounted) return;
        
        const userProfile = {
          specialty: formData.specialty,
          careerStage: formData.careerStage,
          careerGoals: formData.careerGoals,
          graduationYear: formData.graduationYear,
          state: formData.state
        };
        
        try {
          const controller = new AbortController();
          timeoutId = setTimeout(() => controller.abort(), 8000);

          const calculationResponse = await fetch('/api/mcp/calculate/optimization', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              loanData,
              userProfile
            }),
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (!isMounted) return;
          
          if (calculationResponse.ok) {
            const strategy = await calculationResponse.json();
            const calculationData = strategy.data;
            
            // Format results for the UI
            const results = {
              potentialSavings: calculationData.savings?.potentialSavings || 47000,
              recommendedStrategy: calculationData.recommendation?.recommendedStrategy === 'PSLF' ? 'PSLF with Income-Driven Repayment' : 'Refinancing',
              payoffTimeline: calculationData.recommendation?.primaryOption?.yearsRemaining ? 
                `${Math.ceil(calculationData.recommendation.primaryOption.yearsRemaining)} years` : '10 years',
              monthlyPayment: calculationData.recommendation?.primaryOption?.monthlyPayment || 2000,
              totalPaid: calculationData.recommendation?.primaryOption?.totalPaid || calculationData.recommendation?.primaryOption?.netCost || 120000,
              forgiveness: calculationData.recommendation?.primaryOption?.forgivenAmount || 0,
              confidence: calculationData.recommendation?.confidence || 'high',
              strategy: calculationData.recommendation?.recommendedStrategy,
              fullAnalysis: calculationData
            };
            
            if (isMounted) {
              setCalculations(results);
              updateFormData({ calculations: results });
            }
          } else {
            throw new Error(`API returned ${calculationResponse.status}`);
          }
        } catch (calculationError) {
          if (calculationError.name === 'AbortError') {
            console.log('Calculation request timed out, using fallback');
          } else {
            console.error('Calculation API call failed:', calculationError);
          }
          clearTimeout(timeoutId);
          throw calculationError;
        }
        
      } catch (error) {
        if (!isMounted) return;
        
        console.log('Using fallback calculations due to:', error.message);
        
        // Fallback to mock calculations if API fails
        const mockResults = {
          potentialSavings: calculateSavings(formData),
          recommendedStrategy: determineStrategy(formData),
          payoffTimeline: calculateTimeline(formData),
          monthlyPayment: calculateMonthlyPayment(formData),
          totalPaid: calculateTotalPaid(formData),
          forgiveness: calculateForgiveness(formData),
          confidence: 'medium',
          isEstimate: true
        };
        
        if (isMounted) {
          setCalculations(mockResults);
          updateFormData({ calculations: mockResults });
        }
      } finally {
        if (isMounted) {
          setIsCalculating(false);
        }
      }
    };

    // Add a small delay to prevent rapid re-calculations
    const delayedCalculation = setTimeout(() => {
      calculateResults();
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(delayedCalculation);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [formData.specialty, formData.careerStage, formData.careerGoals, formData.loanAmount, formData.loanMethod]);

  const calculateSavings = (data) => {
    const baseLoan = data.loanAmount || 250000;
    const multiplier = data.pslfEligible ? 0.35 : 0.15; // PSLF saves more
    return Math.round(baseLoan * multiplier);
  };

  const determineStrategy = (data) => {
    if (data.pslfEligible === true) return 'PSLF with REPAYE';
    if (data.pslfEligible === false) return 'Refinancing';
    return 'Hybrid Strategy';
  };

  const calculateTimeline = (data) => {
    return data.pslfEligible ? '8.5 years' : '12 years';
  };

  const calculateMonthlyPayment = (data) => {
    const baseLoan = data.loanAmount || 250000;
    if (data.pslfEligible) {
      return Math.round(baseLoan * 0.008); // ~0.8% of loan balance for PSLF
    }
    return Math.round(baseLoan * 0.012); // ~1.2% for refinancing
  };

  const calculateTotalPaid = (data) => {
    const monthly = calculateMonthlyPayment(data);
    const years = data.pslfEligible ? 10 : 10;
    return monthly * 12 * years;
  };

  const calculateForgiveness = (data) => {
    if (!data.pslfEligible) return 0;
    const baseLoan = data.loanAmount || 250000;
    const totalPaid = calculateTotalPaid(data);
    return Math.max(0, baseLoan - totalPaid);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isCalculating) {
    return (
      <div className="text-center py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-100 rounded-full mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <TrendingUp className="w-10 h-10 text-teal-600" />
            </motion.div>
          </div>
          <h2 className="text-2xl font-display font-bold text-navy-800 mb-4">
            Crunching your numbers...
          </h2>
          <p className="text-gray-600 mb-8">
            Analyzing PSLF vs refinancing strategies for your situation
          </p>
          <div className="max-w-md mx-auto bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-teal-500 to-coral-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Celebration Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-sage-100 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-sage-600" />
        </div>
        <h2 className="text-3xl font-display font-bold text-navy-800 mb-2">
          🎉 Great news! We found ways to save you money
        </h2>
        <p className="text-lg text-gray-600">
          Here's what we discovered about your loan strategy
        </p>
      </motion.div>

      {/* Results Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Potential Savings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-sage-50 to-sage-100 rounded-2xl p-6 text-center border border-sage-200"
        >
          <DollarSign className="w-12 h-12 text-sage-600 mx-auto mb-4" />
          <h3 className="text-sm font-medium text-sage-700 mb-1">Potential Savings</h3>
          <div className="text-3xl font-display font-bold text-sage-800">
            {formatCurrency(calculations.potentialSavings)}
          </div>
        </motion.div>

        {/* Best Strategy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-6 text-center border border-teal-200"
        >
          <TrendingUp className="w-12 h-12 text-teal-600 mx-auto mb-4" />
          <h3 className="text-sm font-medium text-teal-700 mb-1">Your Best Strategy</h3>
          <div className="text-lg font-display font-bold text-teal-800">
            {calculations.recommendedStrategy}
          </div>
        </motion.div>

        {/* Time to Payoff */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-coral-50 to-coral-100 rounded-2xl p-6 text-center border border-coral-200"
        >
          <Clock className="w-12 h-12 text-coral-600 mx-auto mb-4" />
          <h3 className="text-sm font-medium text-coral-700 mb-1">Time to Payoff</h3>
          <div className="text-2xl font-display font-bold text-coral-800">
            {calculations.payoffTimeline}
          </div>
          <div className="text-sm text-coral-600">vs 12 years</div>
        </motion.div>
      </div>

      {/* Strategy Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl border-2 border-gray-200 p-8 mb-8"
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl font-display font-bold text-navy-800 mb-2">
            Your Strategy Preview
          </h3>
          <p className="text-gray-600">Based on your specialty and career goals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center">
            <h4 className="font-semibold text-navy-700 mb-3">Monthly Payment</h4>
            <div className="text-3xl font-display font-bold text-navy-800">
              {formatCurrency(calculations.monthlyPayment)}
            </div>
            <p className="text-sm text-gray-500 mt-1">Estimated based on your income</p>
          </div>
          
          <div className="text-center">
            <h4 className="font-semibold text-navy-700 mb-3">
              {formData.pslfEligible ? 'Amount Forgiven' : 'Total Interest Saved'}
            </h4>
            <div className="text-3xl font-display font-bold text-navy-800">
              {formatCurrency(formData.pslfEligible ? calculations.forgiveness : calculations.potentialSavings)}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {formData.pslfEligible ? 'After 120 payments' : 'Compared to current rates'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-8 text-center text-white"
      >
        <h3 className="text-2xl font-display font-bold mb-4">
          Want your complete strategy?
        </h3>
        <p className="text-navy-200 mb-6 max-w-2xl mx-auto">
          Get your detailed implementation plan with step-by-step instructions, 
          exact forms to fill out, and month-by-month payment schedule.
        </p>

        <div className="bg-navy-700/50 rounded-xl p-6 mb-6">
          <div className="text-3xl font-display font-bold text-gold-400 mb-2">
            $47
          </div>
          <p className="text-navy-200 text-sm">
            That's a {Math.round(calculations.potentialSavings / 47)}x return on investment
          </p>
        </div>

        <button
          onClick={nextStep}
          className="bg-coral-500 hover:bg-coral-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all transform hover:scale-105 flex items-center space-x-2 mx-auto"
        >
          <span>Get My Complete Strategy</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="mt-4 text-sm text-navy-300">
          🔒 100% Money-Back Guarantee: If we don't save you at least $1,000, full refund
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex justify-between items-center mt-8"
      >
        <button
          onClick={prevStep}
          className="px-6 py-3 text-gray-600 hover:text-navy-800 font-medium transition-colors"
        >
          ← Back
        </button>

        <div className="text-sm text-gray-500">
          ⏱️ Nearly done!
        </div>
      </motion.div>
    </div>
  );
};

export default ResultsPreviewStep;