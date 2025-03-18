
import React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Product } from "@/types/dashboard";

interface CsvExportButtonProps {
  type: "products" | "variants";
  productId?: string;
  products?: Product[];
}

const CsvExportButton: React.FC<CsvExportButtonProps> = ({ type, productId, products }) => {
  const exportProductsToCsv = async () => {
    try {
      let data;
      
      if (products && products.length > 0) {
        // Utiliser les produits déjà chargés si disponibles
        data = products;
      } else {
        // Sinon, faire une requête pour obtenir les produits
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          toast.error("Vous devez être connecté pour exporter des données");
          return;
        }
        
        const { data: productsData, error } = await supabase
          .from('products')
          .select('*')
          .eq('supplier_id', userData.user.id);
          
        if (error) {
          throw error;
        }
        
        data = productsData;
      }
      
      if (!data || data.length === 0) {
        toast.error("Aucune donnée à exporter");
        return;
      }
      
      // Créer les en-têtes CSV basées sur les clés du premier objet
      const headers = Object.keys(data[0]).join(',');
      
      // Transformer les objets en lignes CSV
      const rows = data.map(item => 
        Object.values(item).map(value => 
          typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value
        ).join(',')
      );
      
      // Combiner les en-têtes et les lignes
      const csvContent = [headers, ...rows].join('\n');
      
      // Créer et télécharger le fichier
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'produits.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Exportation réussie");
    } catch (error) {
      console.error("Erreur lors de l'exportation:", error);
      toast.error("Erreur lors de l'exportation");
    }
  };
  
  const exportVariantsToCsv = async () => {
    try {
      if (!productId) {
        toast.error("ID du produit requis pour exporter les variantes");
        return;
      }
      
      const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', productId);
        
      if (error) {
        throw error;
      }
      
      if (!data || data.length === 0) {
        toast.error("Aucune variante à exporter");
        return;
      }
      
      // Créer les en-têtes CSV basées sur les clés du premier objet
      const headers = Object.keys(data[0]).join(',');
      
      // Transformer les objets en lignes CSV
      const rows = data.map(item => 
        Object.values(item).map(value => 
          typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value
        ).join(',')
      );
      
      // Combiner les en-têtes et les lignes
      const csvContent = [headers, ...rows].join('\n');
      
      // Créer et télécharger le fichier
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'variantes.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Exportation réussie");
    } catch (error) {
      console.error("Erreur lors de l'exportation:", error);
      toast.error("Erreur lors de l'exportation");
    }
  };
  
  const handleExport = () => {
    if (type === "products") {
      exportProductsToCsv();
    } else {
      exportVariantsToCsv();
    }
  };
  
  return (
    <Button
      onClick={handleExport}
      variant="outline"
      size="sm"
      className="flex items-center"
    >
      <Download className="h-4 w-4 mr-2" />
      Exporter en CSV
    </Button>
  );
};

export default CsvExportButton;
