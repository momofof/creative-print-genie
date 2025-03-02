
import React from "react";
import { Link } from "react-router-dom";
import { PhoneCall, Save, Share, Maximize } from "lucide-react";

interface CustomizationHeaderProps {
  onOpenContactForm: () => void;
}

const CustomizationHeader = ({ onOpenContactForm }: CustomizationHeaderProps) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 p-4 bg-white">
      <div className="flex-1"></div>
      
      <div className="flex space-x-4">
        <button 
          className="flex flex-col items-center text-gray-600 hover:text-accent"
          onClick={onOpenContactForm}
        >
          <PhoneCall className="w-5 h-5 mb-1" />
          <span className="text-xs">Assistance</span>
        </button>
        
        <button className="flex flex-col items-center text-gray-600 hover:text-accent">
          <Save className="w-5 h-5 mb-1" />
          <span className="text-xs">Enregistrer</span>
        </button>
        
        <button className="flex flex-col items-center text-gray-600 hover:text-accent">
          <Share className="w-5 h-5 mb-1" />
          <span className="text-xs">Partager</span>
        </button>
        
        <button className="flex flex-col items-center text-gray-600 hover:text-accent">
          <Maximize className="w-5 h-5 mb-1" />
          <span className="text-xs">Plein écran</span>
        </button>
      </div>
    </div>
  );
};

export default CustomizationHeader;
