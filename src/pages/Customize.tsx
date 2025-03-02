
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import CustomizationToolbar from "@/components/customize/CustomizationToolbar";
import ProductCanvas from "@/components/customize/ProductCanvas";
import ProductViews from "@/components/customize/ProductViews";
import ProductInfo from "@/components/customize/ProductInfo";
import CustomizationHeader from "@/components/customize/CustomizationHeader";
import ContactForm from "@/components/customize/ContactForm";
import PromoBanner from "@/components/customize/PromoBanner";
import { CustomizableProduct, CustomizationElement, Color } from "@/types/product";

// Sample data
const colors: Color[] = [
  { id: "black", name: "Noir", hex: "#000000", available: true },
  { id: "charcoal", name: "Charbon", hex: "#36454F", available: true },
  { id: "gray", name: "Gris", hex: "#808080", available: true },
  { id: "white", name: "Blanc", hex: "#FFFFFF", available: true },
  { id: "navy", name: "Marine", hex: "#000080", available: true },
  { id: "burgundy", name: "Bordeaux", hex: "#800020", available: true },
  { id: "red", name: "Rouge", hex: "#FF0000", available: true },
];

const sampleProduct: CustomizableProduct = {
  id: "tshirt-premium-homme",
  name: "T-shirt manches longues Premium Homme",
  price: 16.99,
  originalPrice: 19.99,
  image: "/lovable-uploads/a613bb1a-34de-4d67-a4ea-8e2b4c720279.png",
  rating: 4.5,
  reviewCount: 3775,
  category: "textile",
  subcategory: "t-shirts",
  views: [
    { id: "front", name: "Devant", image: "/lovable-uploads/a613bb1a-34de-4d67-a4ea-8e2b4c720279.png" },
    { id: "back", name: "Dos", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
    { id: "right", name: "Droite", image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
    { id: "left", name: "Gauche", image: "https://images.unsplash.com/photo-1503341733017-1901578f9f1e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
    { id: "composition", name: "Composition", image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
  ],
  selectedView: "front",
  customizationElements: [],
};

const initialElements: CustomizationElement[] = [];

const Customize = () => {
  const { productId } = useParams();
  const [activeTool, setActiveTool] = useState("products");
  const [selectedColor, setSelectedColor] = useState("charcoal");
  const [activeView, setActiveView] = useState("front");
  const [elements, setElements] = useState<CustomizationElement[]>(initialElements);
  const [contactFormOpen, setContactFormOpen] = useState(false);
  
  // We'd normally fetch the product based on productId
  const product = sampleProduct;
  
  const handlePromoAction = () => {
    console.log("Promo code action triggered");
    // Implement promo code logic
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PromoBanner 
        message="30% sur tous les vêtements pour femmes et unisexes" 
        actionText="Valider le code"
        onAction={handlePromoAction}
      />
      <Navigation />
      
      <div className="flex flex-col flex-1 pt-16">
        <CustomizationHeader onOpenContactForm={() => setContactFormOpen(true)} />
        
        <div className="flex flex-1 overflow-hidden">
          <CustomizationToolbar activeTool={activeTool} setActiveTool={setActiveTool} />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <ProductCanvas 
              product={product} 
              elements={elements} 
              activeView={activeView}
            />
            
            <ProductViews 
              views={product.views} 
              activeView={activeView} 
              setActiveView={setActiveView} 
            />
          </div>
          
          <ProductInfo 
            product={product} 
            colors={colors} 
            selectedColor={selectedColor} 
            setSelectedColor={setSelectedColor} 
          />
        </div>
      </div>
      
      <ContactForm 
        open={contactFormOpen} 
        onClose={() => setContactFormOpen(false)} 
      />
    </div>
  );
};

export default Customize;
