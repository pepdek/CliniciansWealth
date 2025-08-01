import { motion } from 'framer-motion';
import { Building2, Home, GraduationCap, HelpCircle, ArrowRight } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

const CareerGoalsStep = ({ nextStep, prevStep, updateFormData }) => {
  const { setValue, watch } = useFormContext();
  const selectedGoal = watch('careerGoals');

  const careerOptions = [
    {
      id: 'hospital-employee',
      title: 'Hospital/Health System',
      subtitle: 'Employee doctor',
      icon: Building2,
      description: 'Work as an employed physician',
      pslfEligible: true,
      gradient: 'from-blue-500 to-blue-600',
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'private-practice',
      title: 'Private Practice',
      subtitle: 'Own my practice someday',
      icon: Home,
      description: 'Start or join a private practice',
      pslfEligible: false,
      gradient: 'from-green-500 to-green-600',
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'academic-medicine',
      title: 'Academic Medicine',
      subtitle: 'Teaching hospital',
      icon: GraduationCap,
      description: 'Research and teaching focus',
      pslfEligible: true,
      gradient: 'from-purple-500 to-purple-600',
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 'not-sure',
      title: 'Not Sure Yet',
      subtitle: 'Still figuring it out',
      icon: HelpCircle,
      description: 'Exploring different options',
      pslfEligible: null,
      gradient: 'from-gray-500 to-gray-600',
      iconColor: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    }
  ];

  const handleGoalSelect = (goalId) => {
    setValue('careerGoals', goalId);
    const selectedOption = careerOptions.find(opt => opt.id === goalId);
    
    updateFormData({ 
      careerGoals: goalId,
      pslfEligible: selectedOption?.pslfEligible
    });
    
    // Auto-advance after selection
    setTimeout(() => {
      nextStep();
    }, 500);
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
          Where do you see yourself working?
        </h2>
        <p className="text-lg text-gray-600">
          This helps us determine your PSLF eligibility
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {careerOptions.map((option, index) => {
          const IconComponent = option.icon;
          const isSelected = selectedGoal === option.id;
          
          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleGoalSelect(option.id)}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden ${
                isSelected
                  ? `border-teal-500 ${option.bgColor} shadow-lg`
                  : `${option.borderColor} bg-white hover:border-teal-300 hover:shadow-md`
              }`}
            >
              <div className="relative z-10">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                  isSelected ? 'bg-teal-100' : option.bgColor
                }`}>
                  <IconComponent className={`w-8 h-8 ${
                    isSelected ? 'text-teal-600' : option.iconColor
                  }`} />
                </div>

                {/* Content */}
                <div className="mb-4">
                  <h3 className="text-xl font-display font-semibold text-navy-800 mb-1">
                    {option.title}
                  </h3>
                  <p className="text-teal-600 font-medium mb-2">
                    {option.subtitle}
                  </p>
                  <p className="text-gray-600 text-sm mb-3">
                    {option.description}
                  </p>
                </div>

                {/* PSLF Eligibility Badge */}
                <div className="flex items-center space-x-2">
                  {option.pslfEligible === true && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-sage-100 text-sage-800">
                      ✓ PSLF Eligible
                    </span>
                  )}
                  {option.pslfEligible === false && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-coral-100 text-coral-800">
                      Not PSLF Eligible
                    </span>
                  )}
                  {option.pslfEligible === null && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      We'll help you decide
                    </span>
                  )}
                </div>

                {/* Selection indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* PSLF Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8"
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">About PSLF (Public Service Loan Forgiveness)</h4>
            <p className="text-sm text-blue-700">
              If you work for a qualifying employer (hospitals, health systems, academic medical centers), 
              you may be eligible to have your remaining federal loan balance forgiven after 120 qualifying payments.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-between items-center"
      >
        <button
          onClick={prevStep}
          className="px-6 py-3 text-gray-600 hover:text-navy-800 font-medium transition-colors"
        >
          ← Back
        </button>

        <div className="text-sm text-gray-500">
          ⏱️ Just 20 seconds
        </div>
      </motion.div>
    </div>
  );
};

export default CareerGoalsStep;