import { motion } from 'framer-motion';
import { CreditCard, Shield, Download, Mail, CheckCircle, Clock, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_publishable_key_here');

// Payment form component that uses Stripe Elements
const CheckoutForm = ({ formData, onPaymentComplete, onPaymentError, isProcessing, setIsProcessing }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntent, setPaymentIntent] = useState(null);

  useEffect(() => {
    // Create payment intent when component mounts
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/mcp/payment/create-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: 47, // $47
            customerData: {
              email: formData.email,
              name: `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || 'Physician',
              phone: formData.phone,
              specialty: formData.specialty,
              careerStage: formData.careerStage,
              loanAmount: formData.loanAmount || formData.calculations?.loanAmount,
              recommendedStrategy: formData.calculations?.recommendedStrategy,
              potentialSavings: formData.calculations?.potentialSavings
            },
            metadata: {
              source: 'clinician-loan-optimizer',
              timestamp: new Date().toISOString()
            }
          }),
        });

        const data = await response.json();
        if (data.success) {
          setClientSecret(data.paymentIntent.client_secret);
          setPaymentIntent(data.paymentIntent);
        } else {
          console.error('Failed to create payment intent:', data.error);
          onPaymentError(data.error);
        }
      } catch (error) {
        console.error('Payment intent creation failed:', error);
        onPaymentError(error.message);
      }
    };

    createPaymentIntent();
  }, [formData, onPaymentError]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || 'Physician',
          email: formData.email,
          phone: formData.phone,
        },
      },
    });

    setIsProcessing(false);

    if (error) {
      console.error('Payment failed:', error);
      onPaymentError(error.message);
    } else if (paymentIntent.status === 'succeeded') {
      console.log('Payment succeeded:', paymentIntent);
      onPaymentComplete(paymentIntent);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#1e293b',
        '::placeholder': {
          color: '#64748b',
        },
      },
      invalid: {
        color: '#ef4444',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
        <CardElement options={cardElementOptions} />
      </div>
      
      <button
        type="submit"
        disabled={!stripe || isProcessing || !clientSecret}
        className={`w-full py-4 px-6 rounded-xl text-lg font-bold flex items-center justify-center space-x-2 transition-all transform hover:scale-105 ${
          !stripe || isProcessing || !clientSecret
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
            : 'bg-coral-500 hover:bg-coral-600 text-white'
        }`}
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Processing payment...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            <span>Secure Checkout - $47</span>
          </>
        )}
      </button>
    </form>
  );
};

const PaymentStep = ({ prevStep, formData, onShowReport }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const handlePaymentComplete = async (paymentIntent) => {
    setPaymentComplete(true);
    
    // Confirm payment on backend
    try {
      const response = await fetch('/api/mcp/payment/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('Payment confirmed');
        
        // Generate and download the personalized report
        try {
          const reportResponse = await fetch('/api/mcp/generate/personalized-report', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              analysisData: {
                loanSummary: {
                  totalFederalBalance: formData.loanAmount || 250000,
                  totalPrivateBalance: 0,
                  currentPaymentPlan: 'Standard',
                  pslfPaymentsMade: 0
                }
              },
              calculationResults: formData.calculations,
              userProfile: {
                specialty: formData.specialty,
                careerStage: formData.careerStage,
                careerGoals: formData.careerGoals,
                state: formData.state
              }
            })
          });

          if (reportResponse.ok) {
            // Download the PDF directly
            const blob = await reportResponse.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `loan-strategy-${formData.specialty}-${Date.now()}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            console.log('Personalized PDF report downloaded successfully');
          } else {
            console.error('Failed to generate personalized report');
          }
        } catch (reportError) {
          console.error('Report generation failed:', reportError);
          // Don't fail the payment - just log the error
        }
      } else {
        console.error('Payment confirmation failed:', data.error);
      }
    } catch (error) {
      console.error('Payment confirmation failed:', error);
    }
  };

  const handlePaymentError = (error) => {
    setPaymentError(error);
    setIsProcessing(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (paymentComplete) {
    return (
      <div className="text-center py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-sage-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-sage-600" />
          </div>
          <h2 className="text-3xl font-display font-bold text-navy-800 mb-4">
            🎉 You're all set!
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Your personalized loan optimization strategy has been generated and downloaded! 
            Check your Downloads folder for your comprehensive 4-page PDF report.
          </p>

          <div className="bg-gradient-to-br from-teal-50 to-coral-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-display font-bold text-navy-800 mb-4">
              Your 4-Page Premium Report Includes:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-sage-600 mt-0.5" />
                <span className="text-sm text-gray-700">Executive Summary & Key Metrics</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-sage-600 mt-0.5" />
                <span className="text-sm text-gray-700">Detailed Strategy Analysis</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-sage-600 mt-0.5" />
                <span className="text-sm text-gray-700">90-Day Implementation Roadmap</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-sage-600 mt-0.5" />
                <span className="text-sm text-gray-700">Long-Term Financial Planning</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-sage-600 mt-0.5" />
                <span className="text-sm text-gray-700">Specialty-Specific Projections</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-sage-600 mt-0.5" />
                <span className="text-sm text-gray-700">Tax & Wealth Building Strategies</span>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <button
              onClick={() => onShowReport && onShowReport(formData)}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              📊 View Interactive Report
            </button>
            
            <div className="text-sm text-gray-500 text-center">
              <p>📧 Report sent to: {formData.email}</p>
              <p className="mt-2">Questions? Reply to any of our emails for support.</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-display font-bold text-navy-800 mb-4">
          Get Your ${formatCurrency(formData.calculations?.potentialSavings || 47000).replace('$', '')} Savings Plan for Just $47
        </h2>
        <p className="text-lg text-gray-600">
          That's a {Math.round((formData.calculations?.potentialSavings || 47000) / 47)}x return on investment
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: What's Included */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border-2 border-gray-200 p-8"
          >
            <h3 className="text-2xl font-display font-bold text-navy-800 mb-6">
              What's Included in Your Complete Strategy
            </h3>

            <div className="space-y-4">
              {[
                { icon: Download, text: 'Detailed payment schedule month-by-month' },
                { icon: CheckCircle, text: 'Step-by-step implementation guide' },
                { icon: CreditCard, text: 'Professional PDF report (25+ pages)' },
                { icon: Star, text: 'Specialty salary projections for your career' },
                { icon: CheckCircle, text: 'Tax implications breakdown' },
                { icon: Mail, text: 'Exact forms and applications you need' },
                { icon: Mail, text: 'Email follow-up sequence with reminders' }
              ].map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center">
                      <IconComponent className="w-4 h-4 text-sage-600" />
                    </div>
                    <span className="text-gray-700">{item.text}</span>
                  </motion.div>
                );
              })}
            </div>

            {/* Testimonial */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                    <span className="text-blue-700 font-bold text-lg">DR</span>
                  </div>
                </div>
                <div>
                  <p className="text-blue-800 italic mb-2">
                    "This analysis saved me $73,000. The implementation guide made it so easy - 
                    I wish I had found this sooner in my career."
                  </p>
                  <p className="text-blue-600 text-sm font-medium">
                    - Dr. Sarah M., Anesthesiologist
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Right: Payment Form */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-8 text-white sticky top-8"
          >
            <div className="text-center mb-6">
              <div className="text-4xl font-display font-bold text-gold-400 mb-2">
                $47
              </div>
              <p className="text-navy-200 text-sm line-through">Regular price: $97</p>
              <p className="text-coral-400 font-semibold">Limited time offer</p>
            </div>

            {/* Urgency Elements */}
            <div className="bg-navy-700/50 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-2 text-gold-400 mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-semibold">Limited Time</span>
              </div>
              <p className="text-navy-200 text-sm">
                First 100 physicians get lifetime updates included
              </p>
            </div>

            {/* Payment Form */}
            <CheckoutForm
              formData={formData}
              onPaymentComplete={handlePaymentComplete}
              onPaymentError={handlePaymentError}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
            />

            {/* Display payment errors */}
            {paymentError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                <strong>Payment Error:</strong> {paymentError}
              </div>
            )}

            {/* Security & Guarantee */}
            <div className="space-y-3 text-center">
              <div className="flex items-center justify-center space-x-2 text-navy-300 text-sm">
                <Shield className="w-4 h-4" />
                <span>256-bit SSL encryption</span>
              </div>
              
              <div className="bg-sage-100 text-sage-800 rounded-lg p-3 text-sm">
                <div className="font-semibold mb-1">💰 Money-Back Guarantee</div>
                <div>If we don't save you at least $1,000, full refund</div>
              </div>

              <p className="text-navy-300 text-xs">
                Based on your loans, waiting costs you ${Math.round((formData.calculations?.potentialSavings || 47000) / 12)}/month
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="flex justify-between items-center mt-8"
      >
        <button
          onClick={prevStep}
          className="px-6 py-3 text-gray-600 hover:text-navy-800 font-medium transition-colors"
        >
          ← Back to Results
        </button>

        <div className="text-sm text-gray-500">
          🔒 Secure payment powered by Stripe
        </div>
      </motion.div>
    </div>
  );
};

// Main PaymentStep component wrapped with Stripe Elements
const PaymentStepWithStripe = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentStep {...props} />
    </Elements>
  );
};

export default PaymentStepWithStripe;