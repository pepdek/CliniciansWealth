import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, FormProvider } from 'react-hook-form';

// Step Components
import QuickStartStep from './steps/QuickStartStep';
import ContactInfoStep from './steps/ContactInfoStep';
import SpecialtyStep from './steps/SpecialtyStep';
import LoanSnapshotStep from './steps/LoanSnapshotStep';
import CareerGoalsStep from './steps/CareerGoalsStep';
import ResultsPreviewStep from './steps/ResultsPreviewStep';
import PaymentStep from './steps/PaymentStep';

// Progress Component
const ProgressBar = ({ currentStep, totalSteps }) => {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
      <motion.div 
        className="bg-gradient-to-r from-teal-500 to-coral-500 h-2 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
};

const LoanOptimizer = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      careerStage: '',
      email: '',
      phone: '',
      state: '',
      specialty: '',
      specialtyCategory: '',
      loanAmount: 0,
      loanDocuments: [],
      careerGoals: '',
      contactMethod: 'email'
    }
  });

  const totalSteps = 7;

  const stepTitles = {
    1: "What's your situation?",
    2: "How can we reach you?",
    3: "What's your specialty?",
    4: "Tell us about your loans",
    5: "Where do you see yourself?",
    6: "Your personalized strategy",
    7: "Get your complete plan"
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const renderStep = () => {
    const stepProps = {
      nextStep,
      prevStep,
      formData,
      updateFormData,
      currentStep
    };

    switch (currentStep) {
      case 1:
        return <QuickStartStep {...stepProps} />;
      case 2:
        return <ContactInfoStep {...stepProps} />;
      case 3:
        return <SpecialtyStep {...stepProps} />;
      case 4:
        return <LoanSnapshotStep {...stepProps} />;
      case 5:
        return <CareerGoalsStep {...stepProps} />;
      case 6:
        return <ResultsPreviewStep {...stepProps} />;
      case 7:
        return <PaymentStep {...stepProps} />;
      default:
        return <QuickStartStep {...stepProps} />;
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-coral-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-display font-bold text-navy-800 mb-2">
              Clinician Loan Optimizer
            </h1>
            <p className="text-lg text-gray-600">
              Stop guessing. Start saving.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-teal-600">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm text-gray-500">
                {stepTitles[currentStep]}
              </span>
            </div>
            <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
          </div>

          {/* Form Content */}
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-xl p-8"
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-gray-500">
            <p>🔒 Your information is secure and confidential</p>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default LoanOptimizer;