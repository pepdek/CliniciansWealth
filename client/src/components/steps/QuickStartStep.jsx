import { motion } from 'framer-motion';
import { GraduationCap, Stethoscope, UserCheck, Briefcase } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

const QuickStartStep = ({ nextStep, updateFormData }) => {
  const { setValue, watch } = useFormContext();
  const selectedStage = watch('careerStage');

  const careerStages = [
    {
      id: 'medical-student',
      title: 'Medical Student',
      subtitle: 'Still in school',
      icon: GraduationCap,
      description: 'Currently in medical school',
      gradient: 'from-blue-500 to-blue-600',
      iconColor: 'text-blue-600'
    },
    {
      id: 'resident-fellow',
      title: 'Resident/Fellow',
      subtitle: 'In training',
      icon: Stethoscope,
      description: 'Currently in residency or fellowship',
      gradient: 'from-teal-500 to-teal-600',
      iconColor: 'text-teal-600'
    },
    {
      id: 'new-attending',
      title: 'New Attending',
      subtitle: 'Just finished training',
      icon: UserCheck,
      description: 'Recently completed training',
      gradient: 'from-coral-500 to-coral-600',
      iconColor: 'text-coral-600'
    },
    {
      id: 'experienced-physician',
      title: 'Experienced Physician',
      subtitle: 'Been practicing a while',
      icon: Briefcase,
      description: 'Established in practice',
      gradient: 'from-navy-500 to-navy-600',
      iconColor: 'text-navy-600'
    }
  ];

  const handleStageSelect = (stageId) => {
    setValue('careerStage', stageId);
    updateFormData({ careerStage: stageId });
    
    // Auto-advance after selection
    setTimeout(() => {
      nextStep();
    }, 500);
  };

  return (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-display font-bold text-navy-800 mb-4">
          What's your situation?
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Help us understand where you are in your medical career
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {careerStages.map((stage, index) => {
          const IconComponent = stage.icon;
          const isSelected = selectedStage === stage.id;
          
          return (
            <motion.button
              key={stage.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleStageSelect(stage.id)}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden ${
                isSelected
                  ? 'border-teal-500 bg-teal-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-teal-300 hover:shadow-md'
              }`}
            >
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stage.gradient} opacity-0 transition-opacity duration-300 ${
                isSelected ? 'opacity-5' : 'group-hover:opacity-5'
              }`} />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                  isSelected ? 'bg-teal-100' : 'bg-gray-100'
                }`}>
                  <IconComponent className={`w-8 h-8 ${
                    isSelected ? 'text-teal-600' : stage.iconColor
                  }`} />
                </div>

                {/* Content */}
                <div className="text-left">
                  <h3 className="text-xl font-display font-semibold text-navy-800 mb-1">
                    {stage.title}
                  </h3>
                  <p className="text-teal-600 font-medium mb-2">
                    {stage.subtitle}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {stage.description}
                  </p>
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-sm text-gray-500"
      >
        <p>⏱️ This takes just 30 seconds</p>
      </motion.div>
    </div>
  );
};

export default QuickStartStep;