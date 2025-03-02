
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Info } from "lucide-react";

interface ContactFormProps {
  open: boolean;
  onClose: () => void;
}

const ContactForm = ({ open, onClose }: ContactFormProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Formulaire de contact</DialogTitle>
          <DialogDescription>
            Posez-nous vos questions ou contactez notre service client.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-blue-50 text-blue-800 p-4 rounded-md flex items-start mb-4">
          <Info className="w-5 h-5 mr-2 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-medium mb-1">Achat en gros</h3>
            <p className="text-sm">À partir de 100 articles</p>
            <button className="text-teal-600 text-sm font-medium mt-1 hover:underline">
              Plus d'infos
            </button>
          </div>
        </div>
        
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nom
            </label>
            <Input id="name" placeholder="Votre nom" />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <Input id="email" type="email" placeholder="Votre email" />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              Message
            </label>
            <Textarea
              id="message"
              placeholder="Comment pouvons-nous vous aider?"
              rows={4}
            />
          </div>
          
          <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
            Envoyer
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactForm;
