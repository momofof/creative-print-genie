
import React, { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SaveDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  savedDesignName?: string;
}

const SaveDesignModal: React.FC<SaveDesignModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  savedDesignName
}) => {
  const [designName, setDesignName] = useState(savedDesignName || "");
  const [isSaved, setIsSaved] = useState(!!savedDesignName);

  if (!isOpen) return null;

  const handleSave = () => {
    if (designName.trim()) {
      onSave(designName);
      setIsSaved(true);
    }
  };

  const handleShare = () => {
    // Implémentation future pour le partage
    console.log("Partager le design:", designName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-center border-b pb-4 mb-4">
            {isSaved ? `"${savedDesignName}" Enregistré !` : "Enregistrer l'idée"}
          </h2>

          {isSaved ? (
            <div className="flex flex-col items-center py-4">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <Check className="text-teal-600" size={24} />
              </div>
              <div className="flex gap-6 mt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setIsSaved(false);
                    setDesignName("");
                  }}
                >
                  Voir mes idées
                </Button>
                <Button className="flex-1 bg-teal-600 hover:bg-teal-700" onClick={onClose}>
                  Continuer
                </Button>
              </div>
              <button 
                className="flex items-center text-teal-600 mt-4 hover:underline"
                onClick={handleShare}
              >
                <Share2 size={16} className="mr-1" />
                <span>Partager l'idée</span>
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center mb-4">
                <img 
                  src="/lovable-uploads/9850efb4-ef57-4de7-8707-ef1e82277265.png" 
                  alt="Design preview" 
                  className="w-36 h-36 object-contain border rounded"
                />
                <div className="ml-4 flex-1">
                  <h3 className="font-medium mb-4">Enregistrer l'idée</h3>
                  <div className="mb-1">
                    <label htmlFor="designName" className="block text-sm font-medium text-gray-700">
                      Nom
                    </label>
                    <Input
                      id="designName"
                      type="text"
                      value={designName}
                      onChange={(e) => setDesignName(e.target.value)}
                      placeholder="Donnez un nom à votre design"
                      maxLength={30}
                      className="w-full"
                    />
                    <div className="text-right text-xs text-gray-500 mt-1">
                      {designName.length}/30
                    </div>
                  </div>
                </div>
              </div>
              <Button 
                className="w-full py-2 bg-teal-100 text-teal-700 hover:bg-teal-200 mt-2"
                onClick={handleSave}
                disabled={!designName.trim()}
              >
                Se connecter et enregistrer
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SaveDesignModal;
