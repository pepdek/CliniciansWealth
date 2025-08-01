import { motion } from 'framer-motion';
import { Heart, Scissors, Activity, Brain, Building2, ArrowRight } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { useState } from 'react';

const SpecialtyStep = ({ nextStep, prevStep, updateFormData }) => {
  const { setValue, watch } = useFormContext();
  const selectedSpecialty = watch('specialtyCategory');
  const customSpecialty = watch('customSpecialty');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const specialtyCategories = [
    {
      id: 'primary-care',
      title: 'Primary Care',
      subtitle: 'Family Med, Internal Med, Peds',
      icon: Heart,
      salaryRange: '$250K-300K',
      gradient: 'from-red-500 to-pink-500',
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      id: 'surgery',
      title: 'Surgery',
      subtitle: 'All surgical specialties',
      icon: Scissors,
      salaryRange: '$400K-600K',
      gradient: 'from-blue-500 to-indigo-500',
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'hospital-based',
      title: 'Hospital-Based',
      subtitle: 'ER, Anesthesia, Radiology',
      icon: Activity,
      salaryRange: '$350K-450K',
      gradient: 'from-teal-500 to-cyan-500',
      iconColor: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200'
    },
    {
      id: 'specialty-medicine',
      title: 'Specialty Medicine',
      subtitle: 'Cardiology, GI, Neurology',
      icon: Brain,
      salaryRange: '$400K-550K',
      gradient: 'from-purple-500 to-violet-500',
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 'other',
      title: 'Other',
      subtitle: 'Let me specify',
      icon: Building2,
      salaryRange: 'Varies',
      gradient: 'from-gray-500 to-slate-500',
      iconColor: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    }
  ];

  const handleSpecialtySelect = (specialtyId) => {
    setValue('specialtyCategory', specialtyId);
    if (specialtyId === 'other') {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
      setValue('customSpecialty', '');
    }
  };

  const handleNext = () => {
    const specialty = selectedSpecialty === 'other' ? customSpecialty : selectedSpecialty;
    if (specialty) {
      updateFormData({ 
        specialtyCategory: selectedSpecialty,
        specialty: specialty 
      });
      nextStep();
    }
  };

  const isValid = selectedSpecialty && (selectedSpecialty !== 'other' || customSpecialty);

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-display font-bold text-navy-800 mb-4">
          What's your specialty?
        </h2>
        <p className="text-lg text-gray-600">
          This helps us provide accurate salary projections
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {specialtyCategories.map((specialty, index) => {
          const IconComponent = specialty.icon;
          const isSelected = selectedSpecialty === specialty.id;
          
          return (
            <motion.button
              key={specialty.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSpecialtySelect(specialty.id)}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden ${
                isSelected
                  ? `border-teal-500 ${specialty.bgColor} shadow-lg`
                  : `${specialty.borderColor} bg-white hover:border-teal-300 hover:shadow-md`
              }`}
            >
              <div className="relative z-10">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                  isSelected ? 'bg-teal-100' : specialty.bgColor
                }`}>
                  <IconComponent className={`w-8 h-8 ${
                    isSelected ? 'text-teal-600' : specialty.iconColor
                  }`} />
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xl font-display font-semibold text-navy-800 mb-1">
                    {specialty.title}
                  </h3>
                  <p className="text-teal-600 font-medium mb-2 text-sm">
                    {specialty.subtitle}
                  </p>
                  <div className="inline-block">
                    <span className="text-xs font-semibold bg-gold-100 text-gold-800 px-2 py-1 rounded-full">
                      Typical: {specialty.salaryRange}
                    </span>
                  </div>
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

      {/* Custom Specialty Input */}
      {showCustomInput && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="max-w-md mx-auto">
            <label className="block text-sm font-medium text-navy-700 mb-2">
              Please specify your specialty:
            </label>
            <input
              {...useFormContext().register('customSpecialty')}
              type="text"
              placeholder="e.g., Dermatology, Psychiatry, Pathology"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-300 transition-colors"
            />
          </div>
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex justify-between items-center"
      >
        <button
          onClick={prevStep}
          className="px-6 py-3 text-gray-600 hover:text-navy-800 font-medium transition-colors"
        >
          ← Back
        </button>

        <button
          onClick={handleNext}
          disabled={!isValid}
          className={`px-8 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all ${
            isValid
              ? 'bg-coral-500 hover:bg-coral-600 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center mt-6 text-sm text-gray-500"
      >
        <p>⏱️ Just 15 seconds • We use this for accurate salary projections</p>
      </motion.div>
    </div>
  );
};

export default SpecialtyStep;