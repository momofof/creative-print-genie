
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Check, X } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from "sonner";
import { ProductVariant } from "../../hooks/useProductForm";

interface SimpleVariantEditorProps {
  variants: ProductVariant[];
  setVariants: React.Dispatch<React.SetStateAction<ProductVariant[]>>;
}

const SimpleVariantEditor = ({ variants, setVariants }: SimpleVariantEditorProps) => {
  const [attributeName, setAttributeName] = useState("");
  const [attributeValues, setAttributeValues] = useState("");
  const [attributes, setAttributes] = useState<{ name: string; values: string[] }[]>([]);
  const [showAttributeForm, setShowAttributeForm] = useState(false);

  // Génère toutes les combinaisons possibles des attributs
  const generateCombinations = () => {
    if (attributes.length === 0) {
      toast.error("Ajoutez au moins un attribut avec des valeurs");
      return;
    }

    // Fonction pour générer toutes les combinaisons possibles d'attributs
    const generateAllCombinations = (
      attrList: { name: string; values: string[] }[],
      current: Record<string, string> = {},
      index: number = 0,
      result: Record<string, string>[] = []
    ): Record<string, string>[] => {
      if (index === attrList.length) {
        result.push({ ...current });
        return result;
      }

      const currentAttr = attrList[index];
      for (const value of currentAttr.values) {
        current[currentAttr.name] = value;
        generateAllCombinations(attrList, current, index + 1, result);
      }

      return result;
    };

    const combinations = generateAllCombinations(attributes);
    
    // Convertir les combinaisons en variantes de produit
    const newVariants = combinations.map(combo => {
      // Créer un identifiant unique pour chaque variante
      const id = crypto.randomUUID();
      
      // Déterminer la taille et la couleur si elles existent
      let size = "Unique";
      let color = "";
      let colorHex = "#000000";
      
      if (combo["Taille"] || combo["taille"] || combo["TAILLE"]) {
        size = combo["Taille"] || combo["taille"] || combo["TAILLE"];
      }
      
      if (combo["Couleur"] || combo["couleur"] || combo["COULEUR"]) {
        color = combo["Couleur"] || combo["couleur"] || combo["COULEUR"];
      }

      // Créer une variante avec les valeurs par défaut
      const variant: ProductVariant = {
        id,
        size,
        color: color || "Standard",
        hex_color: colorHex,
        stock: 0,
        price_adjustment: 0,
        status: "in_stock",
        isNew: true
      };

      return variant;
    });

    setVariants(newVariants);
    toast.success(`${newVariants.length} variantes générées avec succès`);
  };

  const addAttribute = () => {
    if (!attributeName.trim()) {
      toast.error("Le nom de l'attribut est requis");
      return;
    }
    
    if (!attributeValues.trim()) {
      toast.error("Les valeurs de l'attribut sont requises");
      return;
    }

    // Convertir la chaîne de valeurs en tableau (séparées par virgules ou espaces)
    const values = attributeValues
      .split(/[,\s]+/)
      .map(v => v.trim())
      .filter(v => v !== "");

    if (values.length === 0) {
      toast.error("Ajoutez au moins une valeur valide");
      return;
    }

    const newAttribute = {
      name: attributeName,
      values
    };

    setAttributes([...attributes, newAttribute]);
    setAttributeName("");
    setAttributeValues("");
    setShowAttributeForm(false);
  };

  const removeAttribute = (index: number) => {
    const newAttributes = [...attributes];
    newAttributes.splice(index, 1);
    setAttributes(newAttributes);
  };

  const resetEditor = () => {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser l'éditeur de variantes ?")) {
      setAttributes([]);
      setVariants([]);
    }
  };

  return (
    <Card className="mt-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Définir les variantes simplement</h3>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAttributeForm(true)}
              disabled={showAttributeForm}
            >
              <Plus className="h-4 w-4 mr-1" /> Ajouter attribut
            </Button>
            
            <Button 
              variant="default" 
              size="sm"
              onClick={generateCombinations}
              className="bg-teal-600 hover:bg-teal-700"
              disabled={attributes.length === 0}
            >
              <Check className="h-4 w-4 mr-1" /> Générer les variantes
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetEditor}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-1" /> Réinitialiser
            </Button>
          </div>
        </div>

        {showAttributeForm && (
          <div className="border p-4 rounded-md mb-4 bg-gray-50">
            <h4 className="font-medium mb-2">Nouvel attribut</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Nom de l'attribut (ex: Couleur, Taille)</label>
                <Input
                  value={attributeName}
                  onChange={(e) => setAttributeName(e.target.value)}
                  placeholder="Nom de l'attribut"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Valeurs (séparées par virgules ou espaces)</label>
                <Input
                  value={attributeValues}
                  onChange={(e) => setAttributeValues(e.target.value)}
                  placeholder="Rouge, Bleu, Noir"
                />
              </div>
            </div>
            <div className="flex justify-end mt-3 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAttributeForm(false)}
              >
                <X className="h-4 w-4 mr-1" /> Annuler
              </Button>
              <Button 
                size="sm"
                onClick={addAttribute}
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Plus className="h-4 w-4 mr-1" /> Ajouter
              </Button>
            </div>
          </div>
        )}

        {attributes.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium mb-2">Attributs définis</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Attribut</TableHead>
                  <TableHead>Valeurs</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attributes.map((attr, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{attr.name}</TableCell>
                    <TableCell>{attr.values.join(", ")}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttribute(index)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {variants.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Aperçu des variantes générées ({variants.length})</h4>
            <div className="border rounded-md p-3 bg-gray-50">
              <p className="text-sm text-gray-500 mb-2">
                Les variantes ont été générées. Utilisez l'éditeur de variantes avancé ci-dessous pour ajuster les stocks et prix.
              </p>
            </div>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-500">
          <p>Cette méthode permet de créer facilement des variantes en définissant d'abord les attributs (comme Couleur, Taille) 
          et leurs valeurs possibles (Rouge/Bleu/Noir, S/M/L). Le système génère ensuite automatiquement toutes les combinaisons 
          possibles.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleVariantEditor;
