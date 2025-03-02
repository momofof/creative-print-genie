
import { useState, useRef, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { CircleDollarSign, Download, Image, RotateCw, Type, Upload } from "lucide-react";

const CustomizeTShirt = () => {
  const [bgColor, setBgColor] = useState("#ffffff");
  const [textContent, setTextContent] = useState("");
  const [textSize, setTextSize] = useState(30);
  const [textColor, setTextColor] = useState("#000000");
  const [textRotation, setTextRotation] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageScale, setImageScale] = useState(1);
  const [imageRotation, setImageRotation] = useState(0);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [textPosition, setTextPosition] = useState({ x: 250, y: 250 });
  const [imagePosition, setImagePosition] = useState({ x: 250, y: 250 });
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleTextDragStart = () => {
    setDraggedItem('text');
  };
  
  const handleImageDragStart = () => {
    setDraggedItem('image');
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedItem || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (draggedItem === 'text') {
      setTextPosition({ x, y });
    } else if (draggedItem === 'image') {
      setImagePosition({ x, y });
    }
  };
  
  const handleMouseUp = () => {
    setDraggedItem(null);
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Please upload images under 5MB.");
      return;
    }
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload JPEG, PNG, or SVG files.");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImage(result);
      toast.success("Image uploaded successfully!");
    };
    reader.readAsDataURL(file);
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const downloadDesign = () => {
    // In a real application, this would capture the canvas as an image
    // For this demo, we'll just show a toast
    toast.success("Design saved! In a real app, this would download your design.");
  };
  
  const addToCart = () => {
    toast.success("Product added to cart!");
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-24 px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Personnalisez Votre T-shirt</h1>
          <p className="text-lg text-gray-600 mb-8">
            Créez un design unique qui vous ressemble avec notre outil de personnalisation facile à utiliser.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Preview Area */}
            <div className="md:col-span-2 bg-gray-50 rounded-xl p-4 h-[600px] overflow-hidden relative">
              <div 
                ref={canvasRef}
                className="w-full h-full relative"
                style={{ backgroundColor: bgColor }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* T-shirt outline */}
                <img 
                  src="/lovable-uploads/65ec5eab-d704-46ee-823c-35a148087669.png" 
                  alt="T-shirt outline" 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[90%] opacity-80 pointer-events-none" 
                />
                
                {/* Custom text */}
                {textContent && (
                  <div 
                    className="absolute cursor-move"
                    style={{ 
                      left: `${textPosition.x}px`, 
                      top: `${textPosition.y}px`,
                      color: textColor,
                      fontSize: `${textSize}px`,
                      transform: `translate(-50%, -50%) rotate(${textRotation}deg)`,
                      userSelect: 'none'
                    }}
                    onMouseDown={handleTextDragStart}
                  >
                    {textContent}
                  </div>
                )}
                
                {/* Uploaded image */}
                {uploadedImage && (
                  <div 
                    className="absolute cursor-move"
                    style={{ 
                      left: `${imagePosition.x}px`, 
                      top: `${imagePosition.y}px`,
                      transform: `translate(-50%, -50%) scale(${imageScale}) rotate(${imageRotation}deg)`,
                      userSelect: 'none'
                    }}
                    onMouseDown={handleImageDragStart}
                  >
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded design" 
                      className="max-w-[200px] max-h-[200px] pointer-events-none" 
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Tools Panel */}
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <Image className="w-5 h-5 mr-2 text-accent" />
                    Télécharger une Image
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    Formats acceptés: JPEG, PNG, SVG (max 5MB)
                  </p>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleImageUpload}
                    accept=".jpg,.jpeg,.png,.svg"
                  />
                  <Button 
                    onClick={triggerFileInput} 
                    className="w-full" 
                    variant="outline"
                  >
                    <Upload className="mr-2 h-4 w-4" /> Choisir une Image
                  </Button>
                  
                  {uploadedImage && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="text-sm font-medium flex items-center mb-2">
                          <Image className="w-4 h-4 mr-2" /> Taille de l'image
                        </label>
                        <Slider 
                          defaultValue={[1]} 
                          max={2} 
                          min={0.1} 
                          step={0.1} 
                          onValueChange={([value]) => setImageScale(value)}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium flex items-center mb-2">
                          <RotateCw className="w-4 h-4 mr-2" /> Rotation de l'image
                        </label>
                        <Slider 
                          defaultValue={[0]} 
                          max={360} 
                          min={0} 
                          step={1} 
                          onValueChange={([value]) => setImageRotation(value)}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <Type className="w-5 h-5 mr-2 text-accent" />
                    Ajouter du Texte
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Texte</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-md p-2" 
                        placeholder="Votre texte ici"
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium flex items-center mb-2">
                        Taille du texte
                      </label>
                      <Slider 
                        defaultValue={[30]} 
                        max={60} 
                        min={10} 
                        step={1} 
                        onValueChange={([value]) => setTextSize(value)}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium flex items-center mb-2">
                        Rotation du texte
                      </label>
                      <Slider 
                        defaultValue={[0]} 
                        max={360} 
                        min={0} 
                        step={1} 
                        onValueChange={([value]) => setTextRotation(value)}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Couleur du texte</label>
                      <input 
                        type="color" 
                        className="w-full h-10" 
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-4">Couleur du T-shirt</h3>
                  <div className="flex gap-2 mb-4">
                    {['#ffffff', '#000000', '#ff0000', '#0000ff', '#00ff00'].map(color => (
                      <button 
                        key={color} 
                        className={`w-8 h-8 rounded-full ${bgColor === color ? 'ring-2 ring-offset-2 ring-accent' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setBgColor(color)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex gap-3 mt-6">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={downloadDesign}
                >
                  <Download className="mr-2 h-4 w-4" /> Enregistrer
                </Button>
                <Button 
                  className="flex-1"
                  onClick={addToCart}
                >
                  <CircleDollarSign className="mr-2 h-4 w-4" /> Ajouter au Panier
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-12 p-6 bg-gray-50 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Conseils de Personnalisation</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Positionnement</h3>
                <p className="text-gray-600 text-sm">
                  Faites glisser votre texte et vos images pour les positionner exactement où vous le souhaitez sur votre t-shirt.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Taille</h3>
                <p className="text-gray-600 text-sm">
                  Ajustez la taille de vos éléments pour qu'ils s'intègrent parfaitement à votre design.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Couleurs</h3>
                <p className="text-gray-600 text-sm">
                  Choisissez des couleurs qui contrastent bien avec la couleur de base de votre t-shirt pour une meilleure visibilité.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeTShirt;
