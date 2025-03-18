
import React from "react";
import { Link } from "react-router-dom";
import { Store } from "lucide-react";

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
}

const DashboardHeader = ({ 
  title = "Tableau de bord", 
  subtitle = "Bienvenue dans votre espace fournisseur" 
}: DashboardHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  );
};

export default DashboardHeader;
