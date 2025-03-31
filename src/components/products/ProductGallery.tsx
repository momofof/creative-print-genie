
import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { getVariantImage } from "@/components/home/ProductOrderForm/utils";

interface ProductGalleryProps {
  thumbnailImages: string[];
  product?: Product;
  selectedVariant?: { type: string, value: string } | null;
}

const ProductGallery = ({ 
  thumbnailImages, 
  product, 
  selectedVariant 
}: ProductGalleryProps) => {
  const [mainImage, setMainImage] = useState(thumbnailImages[0]);
  const [allImages, setAllImages] = useState<string[]>(thumbnailImages);

  useEffect(() => {
    // If we have a selected variant and it has an image, add it to our images
    if (product && selectedVariant && selectedVariant.type === 'color') {
      const variantImage = getVariantImage(product, selectedVariant.type, selectedVariant.value);
      
      if (variantImage) {
        // Add the variant image if it's not already in the list
        if (!allImages.includes(variantImage)) {
          setAllImages(prev => [variantImage, ...prev]);
          setMainImage(variantImage);
        }
      } else {
        // Reset to original thumbnail images if no variant image
        setAllImages(thumbnailImages);
        setMainImage(thumbnailImages[0]);
      }
    } else {
      // Reset to original thumbnail images if no selected variant
      setAllImages(thumbnailImages);
      setMainImage(thumbnailImages[0]);
    }
  }, [product, selectedVariant, thumbnailImages]);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex flex-row md:flex-col gap-2 md:w-24">
        {allImages.map((img, index) => (
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
