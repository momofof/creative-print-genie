import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Navigation from "@/components/Navigation";
import CustomizationToolbar from "@/components/customize/CustomizationToolbar";
import ProductCanvas from "@/components/customize/ProductCanvas";
import ProductViews from "@/components/customize/ProductViews";
import ProductInfo from "@/components/customize/ProductInfo";
import CustomizationHeader from "@/components/customize/CustomizationHeader";
import ContactForm from "@/components/customize/ContactForm";
import TextEditor from "@/components/customize/TextEditor";
import DesignSelector from "@/components/customize/DesignSelector";
import UploadDesignArea from "@/components/customize/UploadDesignArea";
import SaveDesignModal from "@/components/customize/SaveDesignModal";
import PromoBanner from "@/components/customize/PromoBanner";
import { CustomizableProduct, CustomizationElement, Color, Product } from "@/types/product";
import { toast } from "sonner";

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

// Sample product for development
const sampleProduct: CustomizableProduct = {
  id: "1",
  name: "T-shirt Personnalisé",
  price: 25,
  originalPrice: 30,
  image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800",
  rating: 4.5,
  reviewCount: 12,
  category: "textile",
  subcategory: "t-shirts",
  views: [
    { id: "front", name: "Devant", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
    { id: "back", name: "Dos", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
    { id: "side", name: "Côté", image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
    { id: "composition", name: "Composition", image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
  ],
  selectedView: "front",
  variants: [] // Adding the required variants property
};

const initialElements: CustomizationElement[] = [];

const Customize = () => {
  const { productId } = useParams();
  const [activeTool, setActiveTool] = useState("text");
  const [selectedColor, setSelectedColor] = useState("charcoal");
  const [activeView, setActiveView] = useState("front");
  const [elements, setElements] = useState<CustomizationElement[]>(initialElements);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const [saveDesignOpen, setSaveDesignOpen] = useState(false);
  const [savedDesignName, setSavedDesignName] = useState<string | undefined>();
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  
  // We'd normally fetch the product based on productId
  const product = sampleProduct;

  // Charger les éléments sauvegardés du localStorage au chargement
  useEffect(() => {
    const savedElements = localStorage.getItem('customizationElements');
    if (savedElements) {
      try {
        setElements(JSON.parse(savedElements));
      } catch (error) {
        console.error('Error parsing saved elements:', error);
      }
    }
  }, []);

  // Sauvegarder les éléments dans localStorage quand ils changent
  useEffect(() => {
    localStorage.setItem('customizationElements', JSON.stringify(elements));
  }, [elements]);
  
  const handlePromoAction = () => {
    toast.success("Code promo appliqué !");
  };

  const addTextElement = () => {
    const newElement: CustomizationElement = {
      id: uuidv4(),
      type: 'text',
      content: 'Votre texte',
      position: { x: 0.3, y: 0.3 },
      size: { width: 0.4, height: 0.2 },
      rotation: 0,
      fontSize: 32,
      fontFamily: 'arial',
      fontStyle: { bold: false, italic: false, alignment: 'center' },
      color: '#FFFFFF',
    };

    setElements([...elements, newElement]);
    setSelectedElementId(newElement.id);
    setActiveTool('text');
  };

  const addDesignElement = (imageUrl: string) => {
    const newElement: CustomizationElement = {
      id: uuidv4(),
      type: 'image',
      content: imageUrl,
      position: { x: 0.3, y: 0.3 },
      size: { width: 0.4, height: 0.4 },
      rotation: 0,
    };

    setElements([...elements, newElement]);
    setSelectedElementId(newElement.id);
  };

  const handleUploadDesign = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    addDesignElement(imageUrl);
    setActiveTool('products');
    toast.success("Image téléchargée avec succès !");
  };

  const updateElement = (updatedElement: CustomizationElement) => {
    setElements(elements.map(el => 
      el.id === updatedElement.id ? updatedElement : el
    ));
  };

  const deleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    setSelectedElementId(null);
  };

  const saveDesign = (name: string) => {
    setSavedDesignName(name);
    toast.success(`Design "${name}" enregistré avec succès !`);
    setSaveDesignOpen(false);
  };

  const handleChooseQuantityAndSize = () => {
    setShowSizeSelector(true);
  };

  const renderToolContent = () => {
    switch (activeTool) {
      case 'text':
        if (selectedElementId) {
          const selectedElement = elements.find(el => el.id === selectedElementId);
          if (selectedElement && selectedElement.type === 'text') {
            return <TextEditor element={selectedElement} onUpdate={updateElement} />;
          }
        }
        return (
          <div className="p-6 flex flex-col items-center justify-center h-full">
            <h2 className="text-xl font-semibold mb-6">Ajouter du texte</h2>
            <button
              className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
              onClick={addTextElement}
            >
              Ajouter du texte
            </button>
            <p className="mt-4 text-sm text-gray-600 text-center">
              Cliquez sur le bouton ci-dessus pour ajouter du texte, puis personnalisez-le.
            </p>
          </div>
        );
      case 'designs':
        return <DesignSelector onSelectDesign={addDesignElement} />;
      case 'import':
        return <UploadDesignArea onUpload={handleUploadDesign} />;
      default:
        return (
          <div className="p-6 flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold mb-4">Choisissez un outil</h2>
            <p className="text-gray-600 text-center">
              Utilisez les outils dans la barre latérale pour personnaliser votre produit.
            </p>
          </div>
        );
    }
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
        <CustomizationHeader 
          onOpenContactForm={() => setContactFormOpen(true)} 
          onSaveDesign={() => setSaveDesignOpen(true)}
        />
        
        <div className="flex flex-1 overflow-hidden">
          <CustomizationToolbar 
            activeTool={activeTool} 
            setActiveTool={setActiveTool} 
            onAddText={addTextElement}
          />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <ProductCanvas 
              product={product as Product} 
              elements={elements} 
              activeView={activeView}
              onElementSelect={setSelectedElementId}
              onElementUpdate={updateElement}
              selectedElementId={selectedElementId}
            />
            
            <ProductViews 
              views={product.views || []} 
              activeView={activeView} 
              setActiveView={setActiveView} 
            />
          </div>
          
          <div className="w-80 border-l border-gray-200 overflow-y-auto">
            {renderToolContent()}
          </div>
          
          <ProductInfo 
            product={product} 
            colors={colors} 
            selectedColor={selectedColor} 
            setSelectedColor={setSelectedColor}
            onChooseQuantityAndSize={handleChooseQuantityAndSize}
          />
        </div>
      </div>
      
      <ContactForm 
        open={contactFormOpen} 
        onClose={() => setContactFormOpen(false)} 
      />
      
      <SaveDesignModal 
        isOpen={saveDesignOpen} 
        onClose={() => setSaveDesignOpen(false)}
        onSave={saveDesign}
        savedDesignName={savedDesignName}
      />
    </div>
  );
};

export default Customize;
