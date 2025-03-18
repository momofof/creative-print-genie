
import React from "react";
import { Store } from "lucide-react";

const MobileHeader = () => {
  return (
    <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 z-10">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800 flex items-center">
          <Store className="mr-2 h-5 w-5" />
          Espace Fournisseur
        </h2>
        <button className="text-gray-500">
          <span className="sr-only">Open menu</span>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MobileHeader;
