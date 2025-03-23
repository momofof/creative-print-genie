
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { initializeBicycleVariantImage } from "@/utils/productVariantImageHelper";

const InitializeVariantImages = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleInitialize = async () => {
    setIsInitializing(true);
    try {
      await initializeBicycleVariantImage();
      setIsComplete(true);
      toast.success("L'image de variante du vélo a été initialisée avec succès");
    } catch (error) {
      console.error("Error initializing variant image:", error);
      toast.error("Erreur lors de l'initialisation de l'image de variante");
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Initialiser les images de variantes</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Image de variante du vélo</h2>
        <p className="mb-4">
          Cliquez sur le bouton ci-dessous pour initialiser l'image de la variante rouge du vélo 
          avec l'URL suivante :
        </p>
        <div className="bg-gray-50 p-4 rounded mb-4 break-all">
          <code>https://zzcgtdjsmjpfppglcgsm.supabase.co/storage/v1/object/public/product-images/8ece699f7c5e047649377f5db32d587d/rouge.jpg</code>
        </div>
        
        {!isComplete ? (
          <Button 
            onClick={handleInitialize} 
            disabled={isInitializing}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            {isInitializing ? 'Initialisation...' : 'Initialiser l\'image de variante'}
          </Button>
        ) : (
          <div className="bg-green-50 text-green-800 p-4 rounded">
            L'image de variante a été initialisée avec succès.
          </div>
        )}
      </div>
    </div>
  );
};

export default InitializeVariantImages;
