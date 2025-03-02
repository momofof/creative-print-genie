
import React from "react";

interface PromoBannerProps {
  message: string;
  actionText: string;
  onAction: () => void;
}

const PromoBanner = ({ message, actionText, onAction }: PromoBannerProps) => {
  return (
    <div className="bg-red-500 text-white py-3 px-4 text-center">
      <div className="container mx-auto flex items-center justify-center">
        <p className="font-medium">{message}</p>
        <button
          className="ml-4 px-3 py-1 bg-transparent border border-white rounded-md text-sm font-medium hover:bg-white hover:text-red-500 transition-colors"
          onClick={onAction}
        >
          {actionText}
        </button>
      </div>
    </div>
  );
};

export default PromoBanner;
