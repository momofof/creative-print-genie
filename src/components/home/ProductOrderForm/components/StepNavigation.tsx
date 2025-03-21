
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StepNavigationProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  disableNextSteps?: boolean;
}

const StepNavigation = ({ currentStep, onStepChange, disableNextSteps = false }: StepNavigationProps) => {
  const steps = [
    { id: 0, label: "Produit" },
    { id: 1, label: "Options" },
    { id: 2, label: "Validation" }
  ];

  return (
    <div className="mb-6">
      <Tabs value={currentStep.toString()} className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-2">
          {steps.map((step) => (
            <TabsTrigger
              key={step.id}
              value={step.id.toString()}
              onClick={() => {
                // Only allow going back or staying at current step if next steps are disabled
                if (!disableNextSteps || step.id <= currentStep) {
                  onStepChange(step.id);
                }
              }}
              className={`${
                step.id < currentStep ? "text-teal-600" : ""
              } ${
                disableNextSteps && step.id > currentStep ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={disableNextSteps && step.id > currentStep}
            >
              <span className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-2 text-sm">
                  {step.id + 1}
                </span>
                {step.label}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
        <div 
          className="bg-teal-600 h-full transition-all duration-300 ease-in-out" 
          style={{ width: `${(currentStep + 1) * 33.33}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StepNavigation;
