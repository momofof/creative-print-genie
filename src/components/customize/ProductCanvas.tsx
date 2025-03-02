
import React, { useRef, useEffect, useState } from "react";
import { CustomizableProduct, CustomizationElement } from "@/types/product";

interface ProductCanvasProps {
  product: CustomizableProduct;
  elements: CustomizationElement[];
  activeView: string;
}

const ProductCanvas = ({ product, elements, activeView }: ProductCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  
  const currentView = product.views.find((view) => view.id === activeView) || product.views[0];
  
  useEffect(() => {
    if (canvasRef.current) {
      const updateSize = () => {
        if (canvasRef.current) {
          setCanvasSize({
            width: canvasRef.current.offsetWidth,
            height: canvasRef.current.offsetHeight,
          });
        }
      };
      
      updateSize();
      window.addEventListener('resize', updateSize);
      
      return () => {
        window.removeEventListener('resize', updateSize);
      };
    }
  }, []);

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 p-6">
      <div 
        ref={canvasRef}
        className="relative w-full max-w-[500px] aspect-[3/4] bg-white rounded-lg shadow-md overflow-hidden"
      >
        <img 
          src={currentView.image} 
          alt={currentView.name}
          className="w-full h-full object-contain"
        />
        
        {elements.map((element) => (
          <div 
            key={element.id}
            className="absolute cursor-move"
            style={{
              left: `${element.position.x * 100}%`,
              top: `${element.position.y * 100}%`,
              width: `${element.size.width * canvasSize.width}px`,
              height: `${element.size.height * canvasSize.height}px`,
              transform: `rotate(${element.rotation}deg)`,
            }}
          >
            {element.type === 'text' ? (
              <div className="w-full h-full flex items-center justify-center">
                <p>{element.content}</p>
              </div>
            ) : (
              <img 
                src={element.content} 
                alt="Custom design" 
                className="w-full h-full object-contain"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCanvas;
