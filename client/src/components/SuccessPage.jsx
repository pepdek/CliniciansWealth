import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Mail, Calendar, ArrowRight } from 'lucide-react';

const SuccessPage = () => {
  const [sessionId] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('session_id');
  });
  const [isGeneratingReport, setIsGeneratingReport] = useState(true);

  useEffect(() => {
    // Simulate report generation process
    const timer = setTimeout(() => {
      setIsGeneratingReport(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleViewReport = () => {
    // Navigate to the interactive report by updating URL and triggering app state change
    window.location.href = '/?view=report';
  };

  const handleBackHome = () => {
    window.location.href = '/';
  };

  if (isGeneratingReport) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-coral-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-100 rounded-full mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <CheckCircle className="w-10 h-10 text-teal-600" />
            </motion.div>
          </div>
          <h2 className="text-2xl font-display font-bold text-navy-800 mb-4">
            Payment Successful! 
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Generating your personalized strategy report...
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-coral-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-sage-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-sage-600" />
          </div>
          
          <h1 className="text-4xl font-display font-bold text-navy-800 mb-4">
            🎉 You're All Set!
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your personalized loan optimization strategy is ready! Access your complete interactive report and export to PDF with one click.
          </p>

          {/* Success Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-teal-100"
            >
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-display font-bold text-navy-800 mb-2">Interactive Report</h3>
              <p className="text-sm text-gray-600">View charts, compare strategies, and export to PDF</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-coral-100"
            >
              <div className="w-12 h-12 bg-coral-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-coral-600" />
              </div>
              <h3 className="font-display font-bold text-navy-800 mb-2">Email Delivery</h3>
              <p className="text-sm text-gray-600">Report sent to your email for easy access</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-amber-100"
            >
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-display font-bold text-navy-800 mb-2">90-Day Plan</h3>
              <p className="text-sm text-gray-600">Step-by-step implementation timeline</p>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={handleViewReport}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto"
            >
              <span>📊 View Interactive Report</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              onClick={handleBackHome}
              className="text-gray-600 hover:text-navy-800 font-medium transition-colors"
            >
              ← Back to Home
            </motion.button>
          </div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12 bg-gradient-to-br from-teal-50 to-coral-50 rounded-2xl p-8"
          >
            <h3 className="text-xl font-display font-bold text-navy-800 mb-4">
              What's Next?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-sage-600 mt-0.5" />
                <span className="text-sm text-gray-700">Review your personalized strategy in detail</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-sage-600 mt-0.5" />
                <span className="text-sm text-gray-700">Download and save your PDF report</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-sage-600 mt-0.5" />
                <span className="text-sm text-gray-700">Follow the 90-day implementation timeline</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-sage-600 mt-0.5" />
                <span className="text-sm text-gray-700">Watch for monitoring alerts (if subscribed)</span>
              </div>
            </div>
          </motion.div>

          {/* Session ID for debugging */}
          {sessionId && (
            <div className="mt-8 text-xs text-gray-500">
              Session ID: {sessionId}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SuccessPage;