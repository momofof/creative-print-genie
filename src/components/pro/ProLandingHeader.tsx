
import React from "react";
import { Briefcase } from "lucide-react";

const ProLandingHeader = () => {
  return (
    <div className="flex flex-col items-center mb-16 text-center">
      <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-4">
        <Briefcase className="h-8 w-8 text-green-600" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold mb-4">Espace Fournisseur</h1>
    </div>
  );
};

export default ProLandingHeader;
