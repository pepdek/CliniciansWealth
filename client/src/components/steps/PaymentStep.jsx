import { motion } from 'framer-motion';
import { CreditCard, Shield, Download, Mail, CheckCircle, Clock, Star, Bell, TrendingUp, AlertCircle } from 'lucide-react';
import { useState } from 'react';

// Simplified checkout component that redirects to Stripe
const CheckoutForm = ({ formData, onPaymentRedirect, isProcessing, setIsProcessing, includeMonitoring, setIncludeMonitoring }) => {
  const basePrice = 47;
  const monitoringPrice = 5;
  const totalPrice = includeMonitoring ? basePrice + monitoringPrice : basePrice;

  const handleCheckout = async () => {
    setIsProcessing(true);
    
    try {
      // Create Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: includeMonitoring ? 'price_strategy_plus_monitoring' : 'price_strategy_only',
          customerData: {
            email: formData.email,
            name: `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || 'Physician',
            specialty: formData.specialty,
            careerStage: formData.careerStage,
            loanAmount: formData.loanAmount,
            potentialSavings: formData.calculations?.potentialSavings
          },
          includeMonitoring,
          successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: window.location.href
        }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      // Fallback: redirect to Stripe payment page
      const stripeUrl = `https://buy.stripe.com/test_your_payment_link_here?prefilled_email=${encodeURIComponent(formData.email || '')}`;
      window.open(stripeUrl, '_blank');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Monitoring Upsell */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="monitoring"
            checked={includeMonitoring}
            onChange={(e) => setIncludeMonitoring(e.target.checked)}
            className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 border-amber-300 rounded"
          />
          <div className="flex-1">
            <label htmlFor="monitoring" className="cursor-pointer">
              <div className="flex items-center space-x-2 mb-2">
                <Bell className="w-5 h-5 text-amber-600" />
                <span className="font-semibold text-amber-800">Add Monthly Monitoring - $5/month</span>
                <span className="bg-amber-200 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">RECOMMENDED</span>
              </div>
              <p className="text-sm text-amber-700 mb-3">
                Get alerts when rates drop for refinancing, federal program changes (forbearance, deferred payments, loan forgiveness updates), and personalized strategy adjustments.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-amber-600">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-3 h-3" />
                  <span>Rate drop alerts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-3 h-3" />
                  <span>Federal program updates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Bell className="w-3 h-3" />
                  <span>Strategy adjustments</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-3 h-3" />
                  <span>Monthly newsletters</span>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Price Summary */}
      <div className="bg-navy-700/30 rounded-xl p-4 text-white">
        <div className="flex justify-between items-center mb-2">
          <span>Strategy Report</span>
          <span>${basePrice}</span>
        </div>
        {includeMonitoring && (
          <div className="flex justify-between items-center mb-2 text-amber-300">
            <span>Monthly Monitoring</span>
            <span>${monitoringPrice}/mo</span>
          </div>
        )}
        <div className="border-t border-navy-600 pt-2 mt-2">
          <div className="flex justify-between items-center font-bold text-lg">
            <span>Total Today</span>
            <span>${totalPrice}</span>
          </div>
        </div>
      </div>
      
      <button
        onClick={handleCheckout}
        disabled={isProcessing}
        className={`w-full py-4 px-6 rounded-xl text-lg font-bold flex items-center justify-center space-x-2 transition-all transform hover:scale-105 ${
          isProcessing
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
            : 'bg-coral-500 hover:bg-coral-600 text-white'
        }`}
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Redirecting to checkout...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            <span>Secure Checkout - ${totalPrice}</span>
          </>
        )}
      </button>
    </div>
  );
};

const PaymentStep = ({ prevStep, formData, onShowReport }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [includeMonitoring, setIncludeMonitoring] = useState(true); // Default to recommended option
  const [paymentComplete, setPaymentComplete] = useState(false); // Add missing state

  const handlePaymentRedirect = () => {
    // Payment will be handled by Stripe Checkout
    // After successful payment, user will be redirected to success page
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
            Your personalized loan optimization strategy has been generated! 
            Access your complete interactive report and export to PDF with one click.
          </p>

          <div className="bg-gradient-to-br from-teal-50 to-coral-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-display font-bold text-navy-800 mb-4">
              Your Complete Strategy Report Includes:
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
                { icon: CreditCard, text: 'Personalized strategy report (exportable to PDF)' },
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
              onPaymentRedirect={handlePaymentRedirect}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
              includeMonitoring={includeMonitoring}
              setIncludeMonitoring={setIncludeMonitoring}
            />

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

export default PaymentStep;