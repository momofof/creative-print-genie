
import React from "react";
import { Link } from "react-router-dom";
import { 
  Store, 
  Layers, 
  PlusCircle, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut 
} from "lucide-react";

interface DashboardSidebarProps {
  onSignOut: () => Promise<void>;
}

const DashboardSidebar = ({ onSignOut }: DashboardSidebarProps) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 hidden md:block">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <Store className="mr-2 h-6 w-6" />
          Espace Fournisseur
        </h2>
      </div>
      
      <nav className="space-y-1">
        <Link to="/supplier/dashboard" className="flex items-center px-3 py-2 text-sm font-medium text-teal-700 bg-teal-50 rounded-md">
          <Layers className="mr-3 h-5 w-5" />
          Tableau de bord
        </Link>
        <Link to="/supplier/product/new" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md">
          <PlusCircle className="mr-3 h-5 w-5" />
          Ajouter un produit
        </Link>
        <Link to="/supplier/products" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md">
          <Package className="mr-3 h-5 w-5" />
          Mes produits
        </Link>
        <Link to="/supplier/orders" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md">
          <ShoppingBag className="mr-3 h-5 w-5" />
          Commandes
        </Link>
        <Link to="/supplier/customers" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md">
          <Users className="mr-3 h-5 w-5" />
          Clients
        </Link>
        <Link to="/supplier/settings" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md">
          <Settings className="mr-3 h-5 w-5" />
          Paramètres
        </Link>
        <button 
          onClick={onSignOut}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Déconnexion
        </button>
      </nav>
    </div>
  );
};

export default DashboardSidebar;
