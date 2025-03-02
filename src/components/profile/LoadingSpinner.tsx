
import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = "medium", 
  className = "" 
}) => {
  const sizeClasses = {
    small: "w-4 h-4 border-2",
    medium: "w-8 h-8 border-4",
    large: "w-12 h-12 border-4"
  };

  return (
    <div className={`${sizeClasses[size]} ${className} border-t-accent border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin`}></div>
  );
};

export default LoadingSpinner;
