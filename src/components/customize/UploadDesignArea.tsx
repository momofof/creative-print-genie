
import React, { useState, useRef } from "react";
import { Upload, Info } from "lucide-react";

interface UploadDesignAreaProps {
  onUpload: (file: File) => void;
}

const UploadDesignArea: React.FC<UploadDesignAreaProps> = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    // Vérifier le type de fichier
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp', 'image/bmp'];
    if (!validTypes.includes(file.type)) {
      alert('Format de fichier non supporté. Utilisez PNG, JPG, GIF, SVG, WebP ou BMP.');
      return;
    }

    // Vérifier la taille du fichier (10 Mo max)
    if (file.size > 10 * 1024 * 1024) {
      alert('Le fichier est trop volumineux. La taille maximale est de 10 Mo.');
      return;
    }

    onUpload(file);
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-6 text-center">Choisir des fichiers</h2>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-8 w-full max-w-md flex flex-col items-center justify-center mb-8 ${
          isDragging ? 'border-teal-500 bg-teal-50' : 'border-gray-300 bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex justify-center mb-4">
          <img 
            src="/lovable-uploads/694400ee-4ddd-4bce-8e5e-3941e06b6777.png"
            alt="Upload icon" 
            className="w-24 h-24 object-contain"
          />
        </div>
        <p className="text-center text-gray-700 mb-4">
          Importer, déposer ou copier-coller
        </p>
        <div className="w-full text-center border-t border-b border-gray-200 py-4 my-4">
          <span className="text-gray-500">ou</span>
        </div>
        <button
          className="bg-teal-500 text-white px-4 py-2 rounded-md flex items-center justify-center hover:bg-teal-600 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={20} className="mr-2" />
          Choisir des fichiers
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          className="hidden"
          accept="image/*"
        />
      </div>
      
      <div className="text-sm text-gray-600 space-y-2 w-full max-w-md">
        <div className="flex justify-between">
          <span>Formats de fichier:</span>
          <span>PNG, JPG, BMP, GIF, SVG, AI</span>
        </div>
        <div className="flex justify-between">
          <span>Taille de fichier:</span>
          <span>10 Mo max.</span>
        </div>
        <div className="flex justify-between">
          <span>Bord le plus long:</span>
          <span>4000 pixels max.</span>
        </div>
      </div>
      
      <div className="mt-6 text-sm text-gray-500 w-full max-w-md flex items-start">
        <Info size={16} className="mr-2 mt-1 flex-shrink-0" />
        <p>
          En important un design, vous confirmez ne pas enfreindre les lois en vigueur ni les droits de tiers. 
          <a href="#" className="text-teal-600 hover:underline ml-1">
            Voici comment optimiser votre fichier
          </a>
        </p>
      </div>
    </div>
  );
};

export default UploadDesignArea;
