
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Wand2 } from "lucide-react";

interface CustomizeProductButtonProps {
  productId: string;
}

const CustomizeProductButton = ({ productId }: CustomizeProductButtonProps) => {
  return (
    <Link to={`/customize/${productId || ''}`}>
      <Button 
        className="w-full py-6 text-base font-medium bg-teal-600 hover:bg-teal-700 flex items-center justify-center gap-2"
      >
        <Wand2 className="w-5 h-5" />
        Personnaliser
      </Button>
    </Link>
  );
};

export default CustomizeProductButton;
