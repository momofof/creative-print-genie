
import React from "react";
import { AlertTriangle } from "lucide-react";
import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface ClearCartDialogProps {
  onConfirm: () => void;
}

const ClearCartDialog = ({ onConfirm }: ClearCartDialogProps) => {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Vider le panier
        </AlertDialogTitle>
        <AlertDialogDescription>
          Êtes-vous sûr de vouloir vider votre panier ? Tous les articles seront supprimés.
          Cette action ne peut pas être annulée.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Annuler</AlertDialogCancel>
        <AlertDialogAction 
          onClick={onConfirm}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Vider le panier
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default ClearCartDialog;
