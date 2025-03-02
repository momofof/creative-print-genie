
import React, { useState } from "react";
import { ChevronDown, ChevronUp, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SizeGuideItem {
  size: string;
  size2?: string;
  a: string;
  b: string;
  c: string;
}

interface Review {
  id: number;
  author: string;
  date: string;
  rating: number;
  content: string;
}

interface ProductExpandableSectionsProps {
  sizeGuide: SizeGuideItem[];
  reviews: Review[];
  ratingCounts: Record<string, number>;
  totalReviews: number;
  averageRating: number;
}

const ProductExpandableSections = ({ 
  sizeGuide, 
  reviews, 
  ratingCounts, 
  totalReviews, 
  averageRating 
}: ProductExpandableSectionsProps) => {
  const [expanded, setExpanded] = useState({
    details: true,
    sizes: false,
    reviews: false,
    printing: false,
  });

  const toggleSection = (section: keyof typeof expanded) => {
    setExpanded({ ...expanded, [section]: !expanded[section] });
  };

  return (
    <>
      <div className="border-t pt-4">
        <button 
          className="flex items-center justify-between w-full py-2"
          onClick={() => toggleSection('details')}
        >
          <span className="font-medium text-lg">Détails du produit</span>
          {expanded.details ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        
        {expanded.details && (
          <div className="py-4 text-gray-700 space-y-4">
            <p>
              Le t-shirt à manches longues en coton bio offre une qualité et un style exceptionnels. Il est fabriqué avec des matériaux de première qualité, garantissant durabilité et confort. Idéal pour toutes les saisons, ce t-shirt polyvalent peut être porté seul ou superposé pour un look tendance et décontracté.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>100% coton bio peigné et filé à anneaux</li>
              <li>Coupe classique, encolure ronde, manches longues</li>
              <li>Grammage : 180 g/m²</li>
              <li>Entretien : Lavable en machine à 30°C</li>
            </ul>
          </div>
        )}
      </div>
      
      <div className="border-t pt-4">
        <button 
          className="flex items-center justify-between w-full py-2"
          onClick={() => toggleSection('sizes')}
        >
          <span className="font-medium text-lg">Tableau des tailles</span>
          {expanded.sizes ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        
        {expanded.sizes && (
          <div className="py-4" id="size-guide">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 text-left">Taille</th>
                    <th className="py-2 px-4 text-left">A (cm)</th>
                    <th className="py-2 px-4 text-left">B (cm)</th>
                    <th className="py-2 px-4 text-left">C (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeGuide.map((item) => (
                    <tr key={item.size} className="border-b">
                      <td className="py-2 px-4 font-medium">{item.size}</td>
                      <td className="py-2 px-4">{item.a}</td>
                      <td className="py-2 px-4">{item.b}</td>
                      <td className="py-2 px-4">{item.c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                alt="Guide des tailles" 
                className="max-w-xs"
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="border-t pt-4">
        <button 
          className="flex items-center justify-between w-full py-2"
          onClick={() => toggleSection('reviews')}
        >
          <span className="font-medium text-lg">Avis clients</span>
          {expanded.reviews ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        
        {expanded.reviews && (
          <div className="py-4">
            <div className="flex flex-wrap gap-8 mb-6">
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold mb-1">{averageRating.toFixed(1)}</div>
                <div className="flex mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} 
                      className={`w-4 h-4 ${i < Math.round(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-500">{totalReviews} avis</div>
              </div>
              
              <div className="flex-1 min-w-[200px]">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center mb-1">
                    <div className="text-sm text-gray-600 w-10">{rating} étoiles</div>
                    <div className="flex-1 h-4 bg-gray-100 rounded-full mx-2">
                      <div 
                        className="h-4 bg-yellow-400 rounded-full" 
                        style={{ width: `${(ratingCounts[rating] / totalReviews) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600 w-10 text-right">{ratingCounts[rating]}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium">{review.author}</div>
                      <div className="text-sm text-gray-500">{review.date}</div>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} 
                          className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.content}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-center">
              <Button variant="outline">Voir tous les avis</Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="border-t pt-4">
        <button 
          className="flex items-center justify-between w-full py-2"
          onClick={() => toggleSection('printing')}
        >
          <span className="font-medium text-lg">Procédés d'impression</span>
          {expanded.printing ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        
        {expanded.printing && (
          <div className="py-4 text-gray-700 space-y-4">
            <p>
              Plusieurs techniques d'impression sont disponibles pour personnaliser votre t-shirt :
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="font-medium">Sérigraphie</span> : Idéale pour les designs avec peu de couleurs et des tirages importants.</li>
              <li><span className="font-medium">Impression numérique</span> : Parfaite pour les designs complexes et multicolores.</li>
              <li><span className="font-medium">Broderie</span> : Donne un aspect premium et durable, idéale pour les logos.</li>
              <li><span className="font-medium">Flex & Floc</span> : Permet des finitions mates ou brillantes avec un toucher spécifique.</li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductExpandableSections;
