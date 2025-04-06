
import React from "react";
import { LogIn } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: () => void;
}

const LoginDialog = ({ open, onOpenChange, onLogin }: LoginDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <LogIn className="h-5 w-5 text-accent" />
            Connexion requise
          </AlertDialogTitle>
          <AlertDialogDescription>
            Pour finaliser votre commande, vous devez être connecté à votre compte.
            Votre panier sera conservé après la connexion.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onLogin}
            className="bg-accent hover:bg-accent/90 text-white"
          >
            Se connecter
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LoginDialog;
