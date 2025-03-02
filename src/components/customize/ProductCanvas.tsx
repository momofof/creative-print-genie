
import React, { useRef, useEffect, useState } from "react";
import { CustomizableProduct, CustomizationElement } from "@/types/product";

interface ProductCanvasProps {
  product: CustomizableProduct;
  elements: CustomizationElement[];
  activeView: string;
  onElementSelect: (id: string | null) => void;
  onElementUpdate: (element: CustomizationElement) => void;
  selectedElementId: string | null;
}

const ProductCanvas = ({ 
  product, 
  elements, 
  activeView, 
  onElementSelect,
  onElementUpdate,
  selectedElementId
}: ProductCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
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

  const handleElementMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    elementId: string
  ) => {
    e.stopPropagation();
    const element = elements.find((el) => el.id === elementId);
    if (!element) return;

    onElementSelect(elementId);
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    
    setDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging || !selectedElementId) return;
    
    const element = elements.find((el) => el.id === selectedElementId);
    if (!element) return;
    
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;
    
    // Calculate new position
    const x = (e.clientX - canvasRect.left - dragOffset.x) / canvasRect.width;
    const y = (e.clientY - canvasRect.top - dragOffset.y) / canvasRect.height;
    
    // Ensure the element stays within bounds
    const boundedX = Math.max(0, Math.min(x, 1 - (element.size.width * canvasSize.width) / canvasRect.width));
    const boundedY = Math.max(0, Math.min(y, 1 - (element.size.height * canvasSize.height) / canvasRect.height));
    
    onElementUpdate({
      ...element,
      position: { x: boundedX, y: boundedY },
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleCanvasClick = () => {
    onElementSelect(null);
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 p-6">
      <div 
        ref={canvasRef}
        className="relative w-full max-w-[500px] aspect-[3/4] bg-white rounded-lg shadow-md overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
      >
        <img 
          src={currentView.image} 
          alt={currentView.name}
          className="w-full h-full object-contain"
        />
        
        {elements.map((element) => {
          const isSelected = element.id === selectedElementId;
          
          return (
            <div 
              key={element.id}
              className={`absolute cursor-move ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
              style={{
                left: `${element.position.x * 100}%`,
                top: `${element.position.y * 100}%`,
                width: `${element.size.width * canvasSize.width}px`,
                height: `${element.size.height * canvasSize.height}px`,
                transform: `rotate(${element.rotation}deg)`,
                zIndex: isSelected ? 10 : 1,
              }}
              onMouseDown={(e) => handleElementMouseDown(e, element.id)}
            >
              {element.type === 'text' ? (
                <div 
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    fontFamily: element.fontFamily || 'Arial',
                    fontSize: `${element.fontSize || 20}px`,
                    fontWeight: element.fontStyle?.bold ? 'bold' : 'normal',
                    fontStyle: element.fontStyle?.italic ? 'italic' : 'normal',
                    textAlign: element.fontStyle?.alignment || 'center',
                    color: element.color || 'white',
                  }}
                >
                  {element.content}
                </div>
              ) : (
                <img 
                  src={element.content} 
                  alt="Custom design" 
                  className="w-full h-full object-contain"
                />
              )}
              
              {isSelected && (
                <>
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-white rounded-full border border-blue-500 flex items-center justify-center cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"></path>
                    </svg>
                  </div>
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-white rounded-full border border-blue-500 flex items-center justify-center cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-white rounded-full border border-blue-500 flex items-center justify-center cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 8v8"></path>
                      <path d="M8 12h8"></path>
                    </svg>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-white rounded-full border border-blue-500 flex items-center justify-center cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 17a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z"></path>
                      <path d="M11 9a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z"></path>
                      <path d="M11 5a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z"></path>
                      <path d="M11 13a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z"></path>
                      <path d="M11 21a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z"></path>
                    </svg>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductCanvas;
