
import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface DashboardSidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const DashboardSidebar = ({ currentTab, onTabChange, isOpen, onClose }: DashboardSidebarProps) => {
  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const navItems = [
    { id: "overview", label: "Vue d'ensemble" },
    { id: "products", label: "Produits" },
    { id: "orders", label: "Commandes" },
    { id: "analytics", label: "Analyses" },
    { id: "settings", label: "Paramètres" }
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200 p-4">
        <div className="text-xl font-bold mb-6">Espace fournisseur</div>
        <nav className="space-y-1 flex-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                currentTab === item.id
                  ? "bg-teal-50 text-teal-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto pt-4 border-t">
          <button className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100">
            Déconnexion
          </button>
        </div>
      </div>

      {/* Mobile sidebar (Sheet) */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Espace fournisseur</SheetTitle>
          </SheetHeader>
          <div className="p-4 pt-2">
            <nav className="space-y-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    currentTab === item.id
                      ? "bg-teal-50 text-teal-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="mt-6 pt-4 border-t">
              <button className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100">
                Déconnexion
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default DashboardSidebar;
