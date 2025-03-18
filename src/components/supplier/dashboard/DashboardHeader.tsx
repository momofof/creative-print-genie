
import React from "react";
import { Link } from "react-router-dom";
import { Store } from "lucide-react";

const DashboardHeader = () => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
      <p className="text-gray-600">Bienvenue dans votre espace fournisseur</p>
    </div>
  );
};

export default DashboardHeader;
