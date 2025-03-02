
import React, { useState, useEffect } from "react";
import { 
  Bold, Italic, AlignLeft, AlignCenter, AlignRight, 
  ChevronUp, ChevronDown, ChevronRight, CircleDashed 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomizationElement } from "@/types/product";

interface TextEditorProps {
  element: CustomizationElement;
  onUpdate: (updatedElement: CustomizationElement) => void;
}

const fonts = [
  { id: "arial", name: "Arial" },
  { id: "american-typewriter", name: "American Typewriter" },
  { id: "archive", name: "Archive" },
  { id: "arvo", name: "Arvo" },
  { id: "aspirin", name: "Aspirin" },
  { id: "hermatic", name: "Hermatic" },
];

const TextEditor: React.FC<TextEditorProps> = ({ element, onUpdate }) => {
  const [text, setText] = useState(element.content);
  const [fontSize, setFontSize] = useState(element.fontSize || 116);
  const [selectedFont, setSelectedFont] = useState(element.fontFamily || "arial");
  const [showFontSelector, setShowFontSelector] = useState(false);
  const [textCurve, setTextCurve] = useState(0);
  
  const fontStyles = element.fontStyle || { bold: false, italic: false, alignment: "center" };
  const [isBold, setIsBold] = useState(fontStyles.bold || false);
  const [isItalic, setIsItalic] = useState(fontStyles.italic || false);
  const [alignment, setAlignment] = useState<"left" | "center" | "right">(fontStyles.alignment || "center");

  useEffect(() => {
    const updatedStyles = {
      ...element.fontStyle,
      bold: isBold,
      italic: isItalic,
      alignment: alignment,
    };

    onUpdate({
      ...element,
      content: text,
      fontSize,
      fontFamily: selectedFont,
      fontStyle: updatedStyles
    });
  }, [text, fontSize, selectedFont, isBold, isItalic, alignment]);

  const handleFontSizeChange = (direction: "increase" | "decrease") => {
    setFontSize(prev => {
      const newSize = direction === "increase" ? prev + 1 : prev - 1;
      return Math.max(8, Math.min(200, newSize));
    });
  };

  const handleFontSelect = (fontId: string) => {
    setSelectedFont(fontId);
    setShowFontSelector(false);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const selectedFontName = fonts.find(f => f.id === selectedFont)?.name || "Arial";

  return (
    <div className="p-4 border-t border-gray-200">
      <div className="space-y-4">
        <Input
          type="text"
          value={text}
          onChange={handleTextChange}
          placeholder="Votre texte"
          className="w-full border rounded p-2"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={`p-2 ${isBold ? 'bg-gray-200' : ''}`}
              onClick={() => setIsBold(!isBold)}
            >
              <Bold size={18} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`p-2 ${isItalic ? 'bg-gray-200' : ''}`}
              onClick={() => setIsItalic(!isItalic)}
            >
              <Italic size={18} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`p-2 ${alignment === 'left' ? 'bg-gray-200' : ''}`}
              onClick={() => setAlignment("left")}
            >
              <AlignLeft size={18} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`p-2 ${alignment === 'center' ? 'bg-gray-200' : ''}`}
              onClick={() => setAlignment("center")}
            >
              <AlignCenter size={18} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`p-2 ${alignment === 'right' ? 'bg-gray-200' : ''}`}
              onClick={() => setAlignment("right")}
            >
              <AlignRight size={18} />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <CircleDashed size={18} />
            </Button>
          </div>
          
          <div 
            className="flex items-center border rounded px-3 py-1 text-sm cursor-pointer relative"
            onClick={() => setShowFontSelector(!showFontSelector)}
          >
            <span className="mr-2">{selectedFontName}</span>
            <ChevronRight size={16} className={`transform transition-transform ${showFontSelector ? 'rotate-90' : ''}`} />
            
            {showFontSelector && (
              <div className="absolute top-full left-0 right-0 mt-1 border rounded bg-white shadow-md max-h-60 overflow-y-auto z-10">
                {fonts.map(font => (
                  <div 
                    key={font.id}
                    className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${selectedFont === font.id ? 'bg-teal-100' : ''}`}
                    onClick={() => handleFontSelect(font.id)}
                  >
                    {font.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Taille de la police</div>
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8"
              onClick={() => handleFontSizeChange("decrease")}
            >
              -
            </Button>
            <div className="px-3 text-center w-16">{fontSize}</div>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8"
              onClick={() => handleFontSizeChange("increase")}
            >
              +
            </Button>
          </div>
        </div>

        <div>
          <div className="text-sm font-medium mb-1">Courber le texte</div>
          <div className="flex items-center">
            <input
              type="range"
              min="-50"
              max="50"
              value={textCurve}
              onChange={(e) => setTextCurve(parseInt(e.target.value))}
              className="flex-1 mr-2"
            />
            <div className="w-10 text-center border rounded py-1">{textCurve}</div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 pt-4">
          <div className="flex flex-col items-center text-xs text-gray-600">
            <div className="w-6 h-6 border rounded flex items-center justify-center mb-1">
              <ChevronUp size={14} />
            </div>
            <span>À l'avant</span>
          </div>
          <div className="flex flex-col items-center text-xs text-gray-600">
            <div className="w-6 h-6 border rounded flex items-center justify-center mb-1">
              <ChevronDown size={14} />
            </div>
            <span>À l'arrière</span>
          </div>
          <div className="flex flex-col items-center text-xs text-gray-600">
            <div className="w-6 h-6 border rounded flex items-center justify-center mb-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="6" width="12" height="12" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <span>Zone d'impres.</span>
          </div>
          <div className="flex flex-col items-center text-xs text-gray-600">
            <div className="w-6 h-6 border rounded flex items-center justify-center mb-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="4" width="8" height="8" stroke="currentColor" strokeWidth="2" />
                <rect x="12" y="12" width="8" height="8" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <span>Dupliquer</span>
          </div>
          <div className="flex flex-col items-center text-xs text-gray-600">
            <div className="w-6 h-6 border rounded flex items-center justify-center mb-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4L20 20M4 20L20 4" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <span>Supprimer</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
