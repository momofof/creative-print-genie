
import React from "react";
import { Link } from "react-router-dom";

const NavigationLogo = () => {
  return (
    <div className="flex items-center gap-1 text-lg font-semibold">
      <img
        src="/lovable-uploads/83279871-e720-4ac6-9c14-23e50fecfa8d.png"
        alt="Logo"
        className="w-8 h-8"
      />
      <span className="hidden md:inline-block">Printify</span>
    </div>
  );
};

export default NavigationLogo;
