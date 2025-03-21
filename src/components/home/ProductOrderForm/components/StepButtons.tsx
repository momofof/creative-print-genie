
import React from "react";

interface StepButtonsProps {
  currentStep: number;
  goToPreviousStep: () => void;
  goToNextStep: () => void;
  disableNext: boolean;
}

const StepButtons = ({
  currentStep,
  goToPreviousStep,
  goToNextStep,
  disableNext
}: StepButtonsProps) => {
  return (
    <div className="flex justify-between mt-6">
      {currentStep > 0 && (
        <button
          type="button"
          onClick={goToPreviousStep}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Précédent
        </button>
      )}
      
      {currentStep < 2 && (
        <button
          type="button"
          onClick={goToNextStep}
          className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 ml-auto"
          disabled={disableNext}
        >
          Suivant
        </button>
      )}
    </div>
  );
};

export default StepButtons;
