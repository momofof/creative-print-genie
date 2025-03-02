
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Heart, Share2, Truck, RotateCw, ShieldCheck, Star, ChevronDown, ChevronUp } from "lucide-react";

const colors = [
  { id: "black", name: "Noir", hex: "#000000", available: true },
  { id: "white", name: "Blanc", hex: "#FFFFFF", available: true },
  { id: "gray", name: "Gris", hex: "#808080", available: true },
  { id: "red", name: "Rouge", hex: "#FF0000", available: true },
  { id: "navy", name: "Marine", hex: "#000080", available: true },
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

const reviews = [
  { id: 1, author: "Marie L.", date: "12 mars 2023", rating: 5, content: "Très beau produit, qualité impeccable. La matière est douce et l'impression est parfaite. Je recommande!" },
  { id: 2, author: "Thomas B.", date: "28 février 2023", rating: 4, content: "Bonne qualité, taille parfaite. J'aurais aimé un peu plus d'options de personnalisation." },
  { id: 3, author: "Julie S.", date: "15 janvier 2023", rating: 5, content: "J'adore! La personnalisation a été faite exactement comme je le souhaitais. Parfait pour notre événement d'entreprise." },
  { id: 4, author: "Pierre M.", date: "3 décembre 2022", rating: 3, content: "Bon produit mais le délai de livraison était un peu plus long que prévu." },
  { id: 5, author: "Camille D.", date: "17 novembre 2022", rating: 5, content: "Superbe qualité et service client très réactif!" },
];

const sizeGuide = [
  { size: "XS", a: "65.5", b: "47.5", c: "62.5" },
  { size: "S", size2: "1", a: "68.0", b: "50.0", c: "64.0" },
  { size: "M", size2: "2", a: "70.5", b: "52.5", c: "65.5" },
  { size: "L", size2: "3", a: "73.0", b: "55.0", c: "67.0" },
  { size: "XL", size2: "4", a: "75.5", b: "57.5", c: "68.5" },
  { size: "XXL", size2: "5", a: "78.0", b: "60.0", c: "70.0" },
];

const relatedProducts = [
  { id: 1, name: "Sweatshirt Premium Bio Unisexe", price: "29.99", image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
  { id: 2, name: "T-shirt Manches Longues Col Rond", price: "24.99", image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
  { id: 3, name: "Pull à Capuche Heavy Blend", price: "34.99", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
  { id: 4, name: "T-shirt Manches Longues Col V", price: "26.99", image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
];

const ProductDetail = () => {
  const { productId } = useParams();
  const [selectedColor, setSelectedColor] = useState("black");
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");
  const [expanded, setExpanded] = useState({
    details: true,
    sizes: false,
    reviews: false,
    printing: false,
  });

  // Rating distribution calculation
  const ratingCounts = { 5: 35, 4: 25, 3: 8, 2: 5, 1: 2 };
  const totalReviews = Object.values(ratingCounts).reduce((a, b) => a + b, 0);
  const averageRating = Object.entries(ratingCounts).reduce(
    (acc, [rating, count]) => acc + Number(rating) * count,
    0
  ) / totalReviews;

  const toggleSection = (section) => {
    setExpanded({ ...expanded, [section]: !expanded[section] });
  };

  const thumbnailImages = [
    "/lovable-uploads/a613bb1a-34de-4d67-a4ea-8e2b4c720279.png",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1503341733017-1901578f9f1e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  ];

  const [mainImage, setMainImage] = useState(thumbnailImages[0]);

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
                  alt="T-shirt manches longues Premium Homme" 
                  className="w-full h-auto object-contain aspect-square" 
                />
              </div>
            </div>

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

              <div className="mb-6">
                <div className="mb-2 font-medium">Couleur : {colors.find(c => c.id === selectedColor)?.name}</div>
                <div className="flex space-x-2">
                  {colors.map((color) => (
                    <button
                      key={color.id}
                      className={`w-8 h-8 rounded-full focus:outline-none ring-offset-2 ${
                        selectedColor === color.id ? "ring-2 ring-accent" : ""
                      }`}
                      style={{ backgroundColor: color.hex, border: color.id === 'white' ? '1px solid #e5e7eb' : 'none' }}
                      onClick={() => setSelectedColor(color.id)}
                      disabled={!color.available}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="mb-2 font-medium">Taille</div>
                <div className="grid grid-cols-6 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      className={`border py-2 text-center font-medium rounded focus:outline-none transition-colors ${
                        selectedSize === size
                          ? "bg-accent text-primary border-accent"
                          : "border-gray-300 hover:border-accent"
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <Link to="#size-guide" className="underline hover:text-accent">
                    Guide des tailles
                  </Link>
                </div>
              </div>

              <div className="mb-6">
                <div className="mb-2 font-medium">Quantité</div>
                <div className="flex h-10 w-32">
                  <button 
                    className="w-10 h-10 border border-r-0 rounded-l flex items-center justify-center text-gray-600 hover:bg-gray-50"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <div className="w-12 h-10 border flex items-center justify-center font-medium">
                    {quantity}
                  </div>
                  <button 
                    className="w-10 h-10 border border-l-0 rounded-r flex items-center justify-center text-gray-600 hover:bg-gray-50"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col space-y-3 mb-6">
                <Button className="w-full py-6 text-base font-medium flex items-center gap-2 bg-accent hover:bg-accent/90">
                  <ShoppingCart className="w-5 h-5" />
                  Ajouter au panier
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full py-6 text-base font-medium flex items-center justify-center gap-2"
                >
                  <Heart className="w-5 h-5" />
                  Ajouter aux favoris
                </Button>
                
                <Link to="/customize">
                  <Button 
                    className="w-full py-6 text-base font-medium bg-teal-600 hover:bg-teal-700"
                  >
                    Personnaliser
                  </Button>
                </Link>
              </div>

              <div className="space-y-4 mb-6 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Livraison gratuite</p>
                    <p>Pour les commandes supérieures à 50€</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <RotateCw className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Retours sous 30 jours</p>
                    <p>Retours sans frais dans les 30 jours</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Qualité garantie</p>
                    <p>Satisfaction garantie ou remboursement</p>
                  </div>
                </div>
              </div>
              
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
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Vous pourriez aussi aimer</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((product) => (
                <Link key={product.id} to={`/products/${product.id}`} className="group">
                  <div className="bg-gray-50 rounded-lg overflow-hidden aspect-square mb-3">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <h3 className="font-medium text-gray-900 group-hover:text-accent transition-colors">{product.name}</h3>
                  <p className="text-accent">{product.price} €</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
