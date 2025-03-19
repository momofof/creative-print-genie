
import React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileHeaderProps {
  onOpenSidebar: () => void;
}

const MobileHeader = ({ onOpenSidebar }: MobileHeaderProps) => {
  return (
    <header className="md:hidden flex items-center justify-between p-4 border-b bg-white">
      <Button variant="outline" size="icon" onClick={onOpenSidebar}>
        <Menu className="h-5 w-5" />
      </Button>
      <div className="text-lg font-bold">Espace fournisseur</div>
      <div className="w-9"></div> {/* Spacer for alignment */}
    </header>
  );
};

export default MobileHeader;
