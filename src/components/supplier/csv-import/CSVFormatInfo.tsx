
import React from "react";
import { FileSpreadsheet, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CSVFormatInfoProps {
  onBack: () => void;
}

const CSVFormatInfo = ({ onBack }: CSVFormatInfoProps) => {
  return (
    <div className="space-y-4 py-4">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-2">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Retour
      </Button>
      
      <div className="flex items-center border rounded-md p-4 bg-gray-50">
        <FileSpreadsheet className="h-8 w-8 text-teal-600 mr-3" />
        <div>
          <p className="text-sm font-medium">Format du fichier CSV</p>
          <p className="text-xs text-gray-500">
            Votre fichier CSV doit respecter le format suivant :
          </p>
        </div>
      </div>
      
      <div className="border rounded-md p-4 text-sm">
        <h3 className="font-medium mb-2">Structure du fichier :</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-600 mb-4">
          <li>Première ligne : en-têtes des colonnes</li>
          <li>Chaque ligne suivante : un produit ou une variante</li>
          <li>Les lignes avec la première colonne vide sont considérées comme des variantes du produit précédent</li>
        </ul>
        
        <h3 className="font-medium mb-2">Colonnes requises :</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-600 mb-4">
          <li><span className="font-mono text-teal-600">name</span> : Nom du produit</li>
          <li><span className="font-mono text-teal-600">price</span> : Prix du produit (nombre)</li>
          <li><span className="font-mono text-teal-600">category</span> : Catégorie du produit</li>
        </ul>
        
        <h3 className="font-medium mb-2">Colonnes optionnelles :</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-600 mb-4">
          <li><span className="font-mono text-teal-600">subcategory</span> : Sous-catégorie</li>
          <li><span className="font-mono text-teal-600">description</span> : Description du produit</li>
          <li><span className="font-mono text-teal-600">original_price</span> : Prix original (nombre)</li>
          <li><span className="font-mono text-teal-600">status</span> : État du produit (draft, published, archived)</li>
          <li><span className="font-mono text-teal-600">is_customizable</span> : Produit personnalisable (true, false)</li>
          <li><span className="font-mono text-teal-600">image</span> : URL de l'image du produit</li>
        </ul>
        
        <h3 className="font-medium mb-2">Colonnes pour les variantes :</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-600">
          <li><span className="font-mono text-teal-600">size</span> : Taille de la variante</li>
          <li><span className="font-mono text-teal-600">color</span> : Couleur de la variante</li>
          <li><span className="font-mono text-teal-600">hex_color</span> : Code hexadécimal de la couleur</li>
          <li><span className="font-mono text-teal-600">stock</span> : Stock disponible (nombre)</li>
          <li><span className="font-mono text-teal-600">price_adjustment</span> : Ajustement de prix (nombre)</li>
          <li><span className="font-mono text-teal-600">variant_status</span> : État de la variante (in_stock, low_stock, out_of_stock)</li>
        </ul>
      </div>
      
      <div className="border rounded-md p-4 text-sm">
        <h3 className="font-medium mb-2">Exemple :</h3>
        <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-x-auto">
          {`name,price,original_price,category,subcategory,description,status,is_customizable,image
T-shirt Premium,29.99,39.99,vêtements,t-shirts,T-shirt en coton bio de haute qualité,draft,true,https://example.com/images/tshirt.jpg
,M,Noir,#000000,15,0,in_stock
,L,Noir,#000000,10,0,in_stock
,M,Blanc,#FFFFFF,12,0,in_stock
,L,Blanc,#FFFFFF,8,0,in_stock
Casquette Classique,19.99,24.99,accessoires,casquettes,Casquette ajustable en coton,published,false,https://example.com/images/cap.jpg
,Unique,Noir,#000000,20,0,in_stock
,Unique,Bleu Navy,#000080,15,0,in_stock`}
        </pre>
      </div>
      
      <Button variant="outline" onClick={onBack} className="w-full">
        Retour à l'importation
      </Button>
    </div>
  );
};

export default CSVFormatInfo;
