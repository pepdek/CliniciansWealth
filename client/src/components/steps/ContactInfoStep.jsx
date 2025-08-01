import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { useState, useEffect } from 'react';

const ContactInfoStep = ({ nextStep, prevStep, updateFormData }) => {
  const { register, watch, formState: { errors }, setValue } = useFormContext();
  const [isValid, setIsValid] = useState(false);
  
  const email = watch('email');
  const phone = watch('phone');
  const state = watch('state');

  // US States for dropdown
  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
  ];

  const handleNext = () => {
    if (email && state) {
      updateFormData({ email, phone, state });
      nextStep();
    }
  };

  // Check if form is valid
  useEffect(() => {
    setIsValid(email && state && !errors.email);
  }, [email, state, errors.email]);

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-display font-bold text-navy-800 mb-4">
          How can we reach you?
        </h2>
        <p className="text-lg text-gray-600">
          We'll send your personalized loan strategy here
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Email Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-medium text-navy-700 mb-2">
            <Mail className="inline w-4 h-4 mr-2" />
            Where should we send your results? *
          </label>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
              }
            })}
            type="email"
            placeholder="your.email@hospital.com"
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
              errors.email ? 'border-red-300' : 'border-gray-200 focus:border-teal-300'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </motion.div>

        {/* Phone Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-navy-700 mb-2">
            <Phone className="inline w-4 h-4 mr-2" />
            Text me when it's ready (optional)
          </label>
          <input
            {...register('phone')}
            type="tel"
            placeholder="(555) 123-4567"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-300 transition-colors"
          />
        </motion.div>

        {/* State Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-sm font-medium text-navy-700 mb-2">
            <MapPin className="inline w-4 h-4 mr-2" />
            Where do you live/work? *
          </label>
          <select
            {...register('state', { required: 'Please select your state' })}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
              errors.state ? 'border-red-300' : 'border-gray-200 focus:border-teal-300'
            }`}
          >
            <option value="">Select your state...</option>
            {states.map(stateName => (
              <option key={stateName} value={stateName}>
                {stateName}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
          )}
        </motion.div>
      </div>

      {/* Navigation Buttons */}
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
        transition={{ delay: 0.6 }}
        className="text-center mt-6"
      >
        <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span>We'll never spam you or share your information</span>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactInfoStep;