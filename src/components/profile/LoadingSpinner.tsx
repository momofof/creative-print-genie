
import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="pt-32 pb-16 px-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
