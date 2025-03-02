
import { useState } from "react";

interface ProductGalleryProps {
  thumbnailImages: string[];
}

const ProductGallery = ({ thumbnailImages }: ProductGalleryProps) => {
  const [mainImage, setMainImage] = useState(thumbnailImages[0]);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex flex-row md:flex-col gap-2 md:w-24">
        {thumbnailImages.map((img, index) => (
          <div 
            key={index} 
            className={`border rounded cursor-pointer h-16 w-16 overflow-hidden ${mainImage === img ? 'border-accent' : 'border-gray-200'}`}
            onClick={() => setMainImage(img)}
          >
            <img 
              src={img} 
              alt={`Thumbnail ${index + 1}`} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      <div className="flex-1 bg-gray-50 rounded-lg overflow-hidden">
        <img 
          src={mainImage} 
          alt="Product image" 
          className="w-full h-auto object-contain aspect-square" 
        />
      </div>
    </div>
  );
};

export default ProductGallery;
