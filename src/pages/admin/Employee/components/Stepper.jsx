import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  { number: 1, title: "Información Personal", icon: "👤" },
  { number: 2, title: "Información de Contacto", icon: "📞" },
  { number: 3, title: "Información de Residencia", icon: "🏠" },
  { number: 4, title: "Información Laboral", icon: "💼" },
];

const Stepper = ({ currentStep, onNext, onBack, setCurrentStep }) => {
  const handleStepClick = (stepNumber) => {
    setCurrentStep(stepNumber);
  };

  return (
    <div className="w-full mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: currentStep >= step.number ? 1 : 0.8, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl cursor-pointer
                ${currentStep >= step.number
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-gray-50 text-gray-400'
                } shadow-sm border-2 ${currentStep >= step.number ? 'border-blue-200' : 'border-gray-300'}`}
              onClick={() => handleStepClick(step.number)}
            >
              {step.icon}
            </motion.div>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-4 text-sm font-medium text-center text-gray-600 cursor-pointer"
              onClick={() => handleStepClick(step.number)}
            >
              {step.title}
            </motion.div>
            {step.number < steps.length && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: currentStep > step.number ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="absolute top-8 left-full w-full h-0.5 bg-blue-200 transform origin-left"
              />
            )}
          </div>
        ))}
      </div>
      <motion.div
        key={currentStep}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center text-2xl font-bold mb-8 text-gray-700"
      >
        Paso {currentStep}: {steps[currentStep - 1].title}
      </motion.div>
      <div className="flex justify-between mt-12">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="px-6 py-2 bg-gray-50 text-gray-600 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
        >
          Anterior
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="px-6 py-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
        >
          Siguiente
        </motion.button>
      </div>
    </div>
  );
};

export default Stepper;
