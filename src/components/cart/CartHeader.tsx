
import React from "react";
import { Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CartHeaderProps {
  cartItemsCount: number;
  selectAll: boolean;
  handleSelectAll: (checked: boolean) => void;
  handleDeleteSelected: () => void;
  clearCartDialogOpen: boolean;
  setClearCartDialogOpen: (open: boolean) => void;
  anyItemSelected: boolean;
}

const CartHeader = ({
  cartItemsCount,
  selectAll,
  handleSelectAll,
  handleDeleteSelected,
  clearCartDialogOpen,
  setClearCartDialogOpen,
  anyItemSelected,
}: CartHeaderProps) => {
  return (
    <div className="p-4 border-b">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Checkbox 
            id="select-all"
            checked={selectAll} 
            onCheckedChange={(checked) => handleSelectAll(!!checked)} 
          />
          <label htmlFor="select-all" className="text-sm cursor-pointer">
            Tout sélectionner
          </label>
          <h2 className="text-lg font-medium ml-2">Articles ({cartItemsCount})</h2>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteSelected}
            className="text-red-600 border-red-600 hover:bg-red-50"
            disabled={!anyItemSelected}
          >
            <Trash2 size={16} className="mr-1" />
            Supprimer sélection
          </Button>
          
          <AlertDialog open={clearCartDialogOpen} onOpenChange={setClearCartDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} className="mr-1" />
                <span>Vider le panier</span>
              </Button>
            </AlertDialogTrigger>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default CartHeader;
