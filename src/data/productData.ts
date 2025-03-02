
export const productCategories = [{
  id: "textile",
  title: "Textile",
  image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80",
  subcategories: ["T-shirts", "Sweats", "Casquettes", "Accessoires textiles"]
}, {
  id: "papier",
  title: "Papier",
  image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
  subcategories: ["Cartes de visite", "Flyers", "Affiches", "Catalogues"]
}, {
  id: "vinyl",
  title: "Vinyl",
  image: "https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?auto=format&fit=crop&w=800&q=80",
  subcategories: ["Autocollants", "Vinyles adhésifs", "Bâches"]
}, {
  id: "accessoires",
  title: "Accessoires",
  image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=800&q=80",
  subcategories: ["Mugs", "Coques téléphone", "Badges", "Porte-clés"]
}, {
  id: "panneaux",
  title: "Panneaux publicitaires",
  image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800&q=80",
  subcategories: ["Panneaux extérieurs", "Supports rigides", "PLV"]
}, {
  id: "enseignes",
  title: "Enseignes publicitaires",
  image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
  subcategories: ["Enseignes lumineuses", "Totems", "Lettres découpées"]
}, {
  id: "vehicules",
  title: "Véhicules",
  image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=800&q=80",
  subcategories: ["Covering", "Lettrage", "Stickers", "Magnétiques"]
}, {
  id: "ustensiles",
  title: "Ustensiles",
  image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
  subcategories: ["Ustensiles de cuisine", "Plateaux", "Dessous de verre", "Sets de table"]
}, {
  id: "bijoux",
  title: "Bijoux",
  image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
  subcategories: ["Colliers", "Bracelets", "Boucles d'oreilles", "Pendentifs"]
}, {
  id: "emballage",
  title: "Emballage",
  image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=800&q=80",
  subcategories: ["Boîtes personnalisées", "Papier cadeau", "Étiquettes", "Rubans"]
}];

export const featuredProducts = [{
  id: 1,
  title: "T-shirts",
  image: "/lovable-uploads/65ec5eab-d704-46ee-823c-35a148087669.png"
}, {
  id: 2,
  title: "Sweats",
  image: "/lovable-uploads/5c3e6357-3bff-4033-85a4-fc23513fc793.png"
}];

export const categoryPills = [
  "T-shirts", 
  "Sweats & Hoodies", 
  "Broderie", 
  "Accessoires", 
  "Articles pour Bébé", 
  "Mugs", 
  "Casquettes"
];

// Expanded product catalog with items for all categories
export const allProducts = [
  // Textile products
  {
    id: "tshirt-coton-bio",
    name: "T-shirt manches longues Premium Homme",
    price: 16.99,
    originalPrice: 19.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.5,
    reviewCount: 75,
    category: "textile",
    subcategory: "t-shirts"
  },
  {
    id: "sweatshirt-premium",
    name: "Sweatshirt Premium Bio Unisexe",
    price: 29.99,
    originalPrice: 34.99,
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.8,
    reviewCount: 43,
    category: "textile",
    subcategory: "sweats"
  },
  {
    id: "pull-capuche",
    name: "Pull à Capuche Heavy Blend",
    price: 34.99,
    originalPrice: 39.99,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.6,
    reviewCount: 28,
    category: "textile",
    subcategory: "sweats"
  },
  {
    id: "casquette-baseball",
    name: "Casquette Baseball Premium",
    price: 14.99,
    originalPrice: 17.99,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.3,
    reviewCount: 36,
    category: "textile",
    subcategory: "casquettes"
  },
  
  // Papier products
  {
    id: "affiche-a3",
    name: "Affiche A3 Haute Qualité",
    price: 9.99,
    originalPrice: 12.99,
    image: "https://images.unsplash.com/photo-1561839561-b13bcfe95249?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.3,
    reviewCount: 52,
    category: "papier",
    subcategory: "affiches"
  },
  {
    id: "flyer-a5",
    name: "Flyers A5 Recto/Verso",
    price: 7.99,
    originalPrice: 9.99,
    image: "https://images.unsplash.com/photo-1524321091096-90ce089fe010?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.2,
    reviewCount: 37,
    category: "papier",
    subcategory: "flyers"
  },
  {
    id: "carte-visite",
    name: "Cartes de Visite Premium",
    price: 14.99,
    originalPrice: 17.99,
    image: "https://images.unsplash.com/photo-1634898253857-618fd2a5b5eb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.7,
    reviewCount: 68,
    category: "papier",
    subcategory: "cartes-de-visite"
  },
  {
    id: "catalogue-produits",
    name: "Catalogue Produit A4",
    price: 24.99,
    originalPrice: 29.99,
    image: "https://images.unsplash.com/photo-1544239261-2bb95aa36ca3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.8,
    reviewCount: 41,
    category: "papier",
    subcategory: "catalogues"
  },
  
  // Vinyl products
  {
    id: "autocollant-premium",
    name: "Autocollants Premium Résistants",
    price: 8.99,
    originalPrice: 11.99,
    image: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.5,
    reviewCount: 59,
    category: "vinyl",
    subcategory: "autocollants"
  },
  {
    id: "vinyle-adhesif",
    name: "Vinyle Adhésif Qualité Pro",
    price: 19.99,
    originalPrice: 24.99,
    image: "https://images.unsplash.com/photo-1623280414099-4768dcd956f3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.6,
    reviewCount: 32,
    category: "vinyl",
    subcategory: "vinyles adhésifs"
  },
  {
    id: "bache-exterieur",
    name: "Bâche PVC Extérieur",
    price: 39.99,
    originalPrice: 49.99,
    image: "https://images.unsplash.com/photo-1618761979767-14157b293a67?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.4,
    reviewCount: 25,
    category: "vinyl",
    subcategory: "bâches"
  },
  
  // Accessoires products
  {
    id: "mug-personnalise",
    name: "Mug Céramique Personnalisé",
    price: 12.99,
    originalPrice: 15.99,
    image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.7,
    reviewCount: 85,
    category: "accessoires",
    subcategory: "mugs"
  },
  {
    id: "coque-iphone",
    name: "Coque iPhone Personnalisable",
    price: 16.99,
    originalPrice: 19.99,
    image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.4,
    reviewCount: 72,
    category: "accessoires",
    subcategory: "coques téléphone"
  },
  {
    id: "badges-personnalises",
    name: "Badges Métalliques Personnalisés",
    price: 5.99,
    originalPrice: 7.99,
    image: "https://images.unsplash.com/photo-1626209731723-c6c840c1d3b7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.3,
    reviewCount: 48,
    category: "accessoires",
    subcategory: "badges"
  },
  {
    id: "porte-cles-metal",
    name: "Porte-clés Métal Gravé",
    price: 8.99,
    originalPrice: 10.99,
    image: "https://images.unsplash.com/photo-1594549181132-9045fed330ce?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.5,
    reviewCount: 63,
    category: "accessoires",
    subcategory: "porte-clés"
  },
  
  // Panneaux products
  {
    id: "panneau-exterieur-alu",
    name: "Panneau Extérieur Aluminium",
    price: 89.99,
    originalPrice: 109.99,
    image: "https://images.unsplash.com/photo-1586621388375-11347b4fdf50?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.8,
    reviewCount: 27,
    category: "panneaux",
    subcategory: "panneaux extérieurs"
  },
  {
    id: "support-rigide-dibond",
    name: "Support Rigide Dibond 3mm",
    price: 69.99,
    originalPrice: 79.99,
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.6,
    reviewCount: 21,
    category: "panneaux",
    subcategory: "supports rigides"
  },
  {
    id: "display-plv",
    name: "Display PLV Carton",
    price: 49.99,
    originalPrice: 59.99,
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.4,
    reviewCount: 34,
    category: "panneaux",
    subcategory: "plv"
  },
  
  // Enseignes products
  {
    id: "enseigne-led",
    name: "Enseigne Lumineuse LED",
    price: 199.99,
    originalPrice: 249.99,
    image: "https://images.unsplash.com/photo-1575844264771-892081089af5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.9,
    reviewCount: 31,
    category: "enseignes",
    subcategory: "enseignes lumineuses"
  },
  {
    id: "totem-publicitaire",
    name: "Totem Publicitaire Double Face",
    price: 349.99,
    originalPrice: 399.99,
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.7,
    reviewCount: 18,
    category: "enseignes",
    subcategory: "totems"
  },
  {
    id: "lettres-decoupees-3d",
    name: "Lettres Découpées 3D",
    price: 129.99,
    originalPrice: 159.99,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.8,
    reviewCount: 24,
    category: "enseignes",
    subcategory: "lettres découpées"
  },
  
  // Véhicules products
  {
    id: "covering-voiture",
    name: "Covering Intégral Voiture",
    price: 1299.99,
    originalPrice: 1499.99,
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.9,
    reviewCount: 42,
    category: "vehicules",
    subcategory: "covering"
  },
  {
    id: "lettrage-vehicule",
    name: "Lettrage Professionnel Véhicule",
    price: 199.99,
    originalPrice: 249.99,
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.7,
    reviewCount: 36,
    category: "vehicules",
    subcategory: "lettrage"
  },
  {
    id: "stickers-voiture",
    name: "Stickers Personnalisés Auto",
    price: 49.99,
    originalPrice: 59.99,
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.5,
    reviewCount: 53,
    category: "vehicules",
    subcategory: "stickers"
  },
  {
    id: "magnetiques-vehicule",
    name: "Magnétiques Pro Pour Véhicule",
    price: 39.99,
    originalPrice: 49.99,
    image: "https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.3,
    reviewCount: 28,
    category: "vehicules",
    subcategory: "magnétiques"
  },
  
  // Ustensiles products
  {
    id: "ustensiles-bambou",
    name: "Set Ustensiles Bambou Gravés",
    price: 24.99,
    originalPrice: 29.99,
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.6,
    reviewCount: 47,
    category: "ustensiles",
    subcategory: "ustensiles de cuisine"
  },
  {
    id: "plateau-bambou",
    name: "Plateau Petit-Déjeuner Personnalisable",
    price: 29.99,
    originalPrice: 34.99,
    image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.7,
    reviewCount: 36,
    category: "ustensiles",
    subcategory: "plateaux"
  },
  {
    id: "dessous-verre-liege",
    name: "Dessous de Verre Liège Premium",
    price: 14.99,
    originalPrice: 17.99,
    image: "https://images.unsplash.com/photo-1605001008744-5ae1b5d72a78?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.8,
    reviewCount: 58,
    category: "ustensiles",
    subcategory: "dessous de verre"
  },
  {
    id: "set-table-tissu",
    name: "Set de Table Tissu Imprimé",
    price: 19.99,
    originalPrice: 24.99,
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.5,
    reviewCount: 43,
    category: "ustensiles",
    subcategory: "sets de table"
  },
  
  // Bijoux products
  {
    id: "collier-plaque-argent",
    name: "Collier Plaqué Argent Gravé",
    price: 39.99,
    originalPrice: 49.99,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.9,
    reviewCount: 67,
    category: "bijoux",
    subcategory: "colliers"
  },
  {
    id: "bracelet-cuir-grave",
    name: "Bracelet Cuir Gravé Personnalisé",
    price: 29.99,
    originalPrice: 34.99,
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.7,
    reviewCount: 51,
    category: "bijoux",
    subcategory: "bracelets"
  },
  {
    id: "boucles-oreilles-bois",
    name: "Boucles d'Oreilles Bois",
    price: 19.99,
    originalPrice: 24.99,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.6,
    reviewCount: 38,
    category: "bijoux",
    subcategory: "boucles d'oreilles"
  },
  {
    id: "pendentif-grave",
    name: "Pendentif Personnalisé Acier",
    price: 24.99,
    originalPrice: 29.99,
    image: "https://images.unsplash.com/photo-1618403088890-3d9ff6f4c8b1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.8,
    reviewCount: 45,
    category: "bijoux",
    subcategory: "pendentifs"
  },
  
  // Emballage products - focus for the current page
  {
    id: "boite-cadeau-perso",
    name: "Boîte Cadeau Personnalisée Premium",
    price: 12.99,
    originalPrice: 15.99,
    image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.9,
    reviewCount: 72,
    category: "emballage",
    subcategory: "boîtes personnalisées"
  },
  {
    id: "papier-cadeau-custom",
    name: "Papier Cadeau Personnalisé 5m",
    price: 8.99,
    originalPrice: 10.99,
    image: "https://images.unsplash.com/photo-1511270488548-ed06a59b88a9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.7,
    reviewCount: 63,
    category: "emballage",
    subcategory: "papier cadeau"
  },
  {
    id: "etiquettes-cadeaux",
    name: "Étiquettes Cadeaux Personnalisées",
    price: 6.99,
    originalPrice: 8.99,
    image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.8,
    reviewCount: 57,
    category: "emballage",
    subcategory: "étiquettes"
  },
  {
    id: "rubans-personnalises",
    name: "Rubans Personnalisés Satin 10m",
    price: 9.99,
    originalPrice: 12.99,
    image: "https://images.unsplash.com/photo-1526309844975-25c08a95519a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    rating: 4.6,
    reviewCount: 49,
    category: "emballage",
    subcategory: "rubans"
  }
];

