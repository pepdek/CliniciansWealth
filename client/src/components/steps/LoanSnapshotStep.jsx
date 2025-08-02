import { motion } from 'framer-motion';
import { Upload, Calculator, FileText, ArrowRight, X } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const LoanSnapshotStep = ({ nextStep, prevStep, updateFormData }) => {
  const { setValue, watch } = useFormContext();
  const [selectedOption, setSelectedOption] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loanAmount, setLoanAmount] = useState(250000);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPaymentPlan, setCurrentPaymentPlan] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [hasPrivateLoans, setHasPrivateLoans] = useState('');

  const onDrop = useCallback(async (acceptedFiles) => {
    setIsProcessing(true);
    const newFiles = acceptedFiles.map(file => ({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
    setValue('loanDocuments', [...uploadedFiles, ...newFiles]);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false);
      // Auto-advance after successful upload
      setTimeout(() => {
        updateFormData({ 
          loanMethod: 'upload',
          loanDocuments: [...uploadedFiles, ...newFiles]
        });
        nextStep();
      }, 1000);
    }, 2000);
  }, [uploadedFiles, setValue, updateFormData, nextStep]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: true
  });

  const removeFile = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    setValue('loanDocuments', newFiles);
  };

  const handleQuickNumbers = () => {
    updateFormData({ 
      loanMethod: 'manual',
      loanAmount: loanAmount,
      currentPaymentPlan: currentPaymentPlan,
      monthlyPayment: monthlyPayment,
      hasPrivateLoans: hasPrivateLoans
    });
    nextStep();
  };

  const canContinue = loanAmount > 0 && currentPaymentPlan && hasPrivateLoans;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-display font-bold text-navy-800 mb-4">
          Tell us about your loans
        </h2>
        <p className="text-lg text-gray-600">
          Choose the easiest way for you to share your loan information
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Option A: Upload & Done */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <div className="bg-teal-50 border-2 border-teal-200 rounded-2xl p-6 relative">
            <div className="absolute -top-3 left-6 bg-teal-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
              Recommended
            </div>
            
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-2xl mb-4">
                <Upload className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-2xl font-display font-bold text-navy-800 mb-2">
                Upload & Done
              </h3>
              <p className="text-gray-600">
                We'll read it for you - just drag and drop
              </p>
            </div>

            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                isDragActive 
                  ? 'border-teal-400 bg-teal-50' 
                  : 'border-gray-300 hover:border-teal-400'
              }`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <div className="text-teal-600">
                  <Upload className="w-12 h-12 mx-auto mb-4" />
                  <p className="font-semibold">Drop your files here...</p>
                </div>
              ) : (
                <div className="text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4" />
                  <p className="font-semibold mb-3">Upload your loan documents</p>
                  <div className="text-sm space-y-2 mb-4">
                    <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg">
                      📄 <strong>Required:</strong> Federal loan statement (PDF/screenshot)
                    </div>
                    <div className="bg-green-50 text-green-700 px-3 py-2 rounded-lg">
                      🏥 <strong>Helpful:</strong> Pay stub or employment letter
                    </div>
                    <div className="bg-purple-50 text-purple-700 px-3 py-2 rounded-lg">
                      💰 <strong>If applicable:</strong> Private loan statements
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    💡 Most people screenshot their loan info from email
                  </p>
                </div>
              )}
            </div>

            {/* Processing State */}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-center"
              >
                <div className="inline-flex items-center space-x-2 text-teal-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600"></div>
                  <span className="font-medium">Analyzing your documents...</span>
                </div>
              </motion.div>
            )}

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 space-y-2"
              >
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3 border">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-teal-600" />
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}

            <div className="mt-6 text-xs text-gray-500 text-center">
              <p>🔒 Your documents are encrypted and secure</p>
            </div>
          </div>
        </motion.div>

        {/* Option B: Quick Numbers */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 h-full">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4">
                <Calculator className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-2xl font-display font-bold text-navy-800 mb-2">
                Quick Numbers
              </h3>
              <p className="text-gray-600">
                If you don't have documents handy
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-4">
                  About how much do you owe in student loans?
                </label>
                
                {/* Slider */}
                <div className="px-4">
                  <input
                    type="range"
                    min="0"
                    max="500000"
                    step="5000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$0</span>
                    <span>$500K+</span>
                  </div>
                </div>

                {/* Amount Display */}
                <div className="text-center mt-6">
                  <div className="text-3xl font-display font-bold text-navy-800">
                    {formatCurrency(loanAmount)}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Don't worry about being exact
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 text-center">
                  💡 <strong>Tip:</strong> Most physicians owe $200K-350K in student loans
                </p>
              </div>

              {/* Additional Questions */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-2">
                    What federal payment plan are you currently on?
                  </label>
                  <select
                    value={currentPaymentPlan}
                    onChange={(e) => setCurrentPaymentPlan(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Select your current plan</option>
                    <option value="standard">Standard 10-year</option>
                    <option value="graduated">Graduated</option>
                    <option value="extended">Extended</option>
                    <option value="idr">Income-driven (IBR/PAYE/REPAYE/SAVE)</option>
                    <option value="unsure">Not sure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-2">
                    About how much do you pay monthly? (Optional)
                  </label>
                  <input
                    type="text"
                    value={monthlyPayment}
                    onChange={(e) => setMonthlyPayment(e.target.value)}
                    placeholder="e.g., $1,200"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-2">
                    Do you have any private loans?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setHasPrivateLoans('yes')}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        hasPrivateLoans === 'yes'
                          ? 'border-teal-500 bg-teal-50 text-teal-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasPrivateLoans('no')}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        hasPrivateLoans === 'no'
                          ? 'border-teal-500 bg-teal-50 text-teal-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleQuickNumbers}
                disabled={!canContinue}
                className={`w-full font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2 ${
                  canContinue
                    ? 'bg-coral-500 hover:bg-coral-600 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span>Continue with {formatCurrency(loanAmount)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-between items-center mt-8"
      >
        <button
          onClick={prevStep}
          className="px-6 py-3 text-gray-600 hover:text-navy-800 font-medium transition-colors"
        >
          ← Back
        </button>

        <div className="text-sm text-gray-500">
          ⏱️ Takes about 60 seconds
        </div>
      </motion.div>

      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #FF6B6B;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #FF6B6B;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default LoanSnapshotStep;