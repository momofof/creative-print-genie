
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Star } from "lucide-react";
import ProductGallery from "@/components/products/ProductGallery";
import ColorSelector from "@/components/products/ColorSelector";
import SizeSelector from "@/components/products/SizeSelector";
import QuantitySelector from "@/components/products/QuantitySelector";
import ProductActions from "@/components/products/ProductActions";
import ProductBenefits from "@/components/products/ProductBenefits";
import ProductExpandableSections from "@/components/products/ProductExpandableSections";
import RelatedProducts from "@/components/products/RelatedProducts";
import NewArrivalsSection from "@/components/products/NewArrivalsSection";
import PromotionalBanner from "@/components/products/PromotionalBanner";
import DesignServiceBanner from "@/components/products/DesignServiceBanner";
import RecentlyViewedSection from "@/components/products/RecentlyViewedSection";
import { Color, SizeGuideItem, Review, RelatedProduct } from "@/types/product";

// Product data
const colors: Color[] = [
  { id: "black", name: "Noir", hex: "#000000", available: true },
  { id: "white", name: "Blanc", hex: "#FFFFFF", available: true },
  { id: "gray", name: "Gris", hex: "#808080", available: true },
  { id: "red", name: "Rouge", hex: "#FF0000", available: true },
  { id: "navy", name: "Marine", hex: "#000080", available: true },
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

const reviews: Review[] = [
  { id: 1, author: "Marie L.", date: "12 mars 2023", rating: 5, content: "Très beau produit, qualité impeccable. La matière est douce et l'impression est parfaite. Je recommande!" },
  { id: 2, author: "Thomas B.", date: "28 février 2023", rating: 4, content: "Bonne qualité, taille parfaite. J'aurais aimé un peu plus d'options de personnalisation." },
  { id: 3, author: "Julie S.", date: "15 janvier 2023", rating: 5, content: "J'adore! La personnalisation a été faite exactement comme je le souhaitais. Parfait pour notre événement d'entreprise." },
  { id: 4, author: "Pierre M.", date: "3 décembre 2022", rating: 3, content: "Bon produit mais le délai de livraison était un peu plus long que prévu." },
  { id: 5, author: "Camille D.", date: "17 novembre 2022", rating: 5, content: "Superbe qualité et service client très réactif!" },
];

const sizeGuide: SizeGuideItem[] = [
  { size: "XS", a: "65.5", b: "47.5", c: "62.5" },
  { size: "S", size2: "1", a: "68.0", b: "50.0", c: "64.0" },
  { size: "M", size2: "2", a: "70.5", b: "52.5", c: "65.5" },
  { size: "L", size2: "3", a: "73.0", b: "55.0", c: "67.0" },
  { size: "XL", size2: "4", a: "75.5", b: "57.5", c: "68.5" },
  { size: "XXL", size2: "5", a: "78.0", b: "60.0", c: "70.0" },
];

const relatedProducts: RelatedProduct[] = [
  { id: 1, name: "Sweatshirt Premium Bio Unisexe", price: "29.99", image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
  { id: 2, name: "T-shirt Manches Longues Col Rond", price: "24.99", image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
  { id: 3, name: "Pull à Capuche Heavy Blend", price: "34.99", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
  { id: 4, name: "T-shirt Manches Longues Col V", price: "26.99", image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
];

const thumbnailImages = [
  "/lovable-uploads/a613bb1a-34de-4d67-a4ea-8e2b4c720279.png",
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1503341733017-1901578f9f1e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
];

const ProductDetail = () => {
  const { productId } = useParams();
  const [selectedColor, setSelectedColor] = useState("black");
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);

  // Rating distribution calculation
  const ratingCounts = { 5: 35, 4: 25, 3: 8, 2: 5, 1: 2 };
  const totalReviews = Object.values(ratingCounts).reduce((a, b) => a + b, 0);
  const averageRating = Object.entries(ratingCounts).reduce(
    (acc, [rating, count]) => acc + Number(rating) * count,
    0
  ) / totalReviews;

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-24 pb-16 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm breadcrumbs text-gray-500">
            <ul className="flex space-x-2">
              <li>
                <Link to="/" className="hover:text-accent">Accueil</Link>
              </li>
              <span>/</span>
              <li>
                <Link to="/products" className="hover:text-accent">Produits</Link>
              </li>
              <span>/</span>
              <li>
                <Link to="/products/textile" className="hover:text-accent">T-shirts manches longues</Link>
              </li>
              <span>/</span>
              <li className="text-gray-800">T-shirt manches longues Premium Homme</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <ProductGallery thumbnailImages={thumbnailImages} />

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold mb-2">T-shirt manches longues Premium Homme</h1>
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} 
                      className={`w-4 h-4 ${i < Math.round(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">({totalReviews} avis)</span>
              </div>

              <div className="flex items-baseline mb-6">
                <span className="text-2xl font-bold text-gray-900">16,99 €</span>
                <span className="ml-2 text-sm text-gray-500 line-through">19,99 €</span>
                <span className="ml-2 text-sm font-medium text-green-600">-15%</span>
              </div>

              <ColorSelector 
                colors={colors} 
                selectedColor={selectedColor} 
                setSelectedColor={setSelectedColor} 
              />

              <SizeSelector 
                sizes={sizes} 
                selectedSize={selectedSize} 
                setSelectedSize={setSelectedSize} 
              />

              <QuantitySelector 
                quantity={quantity} 
                setQuantity={setQuantity} 
              />

              <ProductActions />
              
              <ProductBenefits />
              
              <ProductExpandableSections 
                sizeGuide={sizeGuide}
                reviews={reviews}
                ratingCounts={ratingCounts}
                totalReviews={totalReviews}
                averageRating={averageRating}
              />
            </div>
          </div>

          {/* Related Products */}
          <RelatedProducts products={relatedProducts} />
          
          {/* Sections promotionnelles ajoutées après les produits connexes */}
          <NewArrivalsSection categoryTitle="T-shirts manches longues" />
          <PromotionalBanner />
          <DesignServiceBanner />
          <RecentlyViewedSection categoryTitle="T-shirts manches longues" />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
