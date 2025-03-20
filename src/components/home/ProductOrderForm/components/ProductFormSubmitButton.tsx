
import { cn } from "@/lib/utils";

interface ProductFormSubmitButtonProps {
  isSubmitting: boolean;
  disabled: boolean;
  editMode?: boolean;
}

const ProductFormSubmitButton = ({
  isSubmitting,
  disabled,
  editMode = false
}: ProductFormSubmitButtonProps) => {
  return (
    <button
      type="submit"
      disabled={disabled || isSubmitting}
      className={cn(
        "w-full bg-accent text-white py-3 px-6 rounded-md font-medium transition-colors",
        (disabled || isSubmitting) ? 
          "opacity-50 cursor-not-allowed" : 
          "hover:bg-accent/90"
      )}
    >
      {isSubmitting ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Traitement en cours...
        </span>
      ) : (
        editMode ? "Mettre à jour" : "Commander"
      )}
    </button>
  );
};

export default ProductFormSubmitButton;
