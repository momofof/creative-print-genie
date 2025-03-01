
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const PromoBanner = () => {
  const [showBanner, setShowBanner] = useState(true);
  
  if (!showBanner) return null;
  
  return (
    <div className="bg-[#ff3c5a] text-white py-3 px-4 text-center relative">
      <div className="max-w-7xl mx-auto flex justify-center items-center">
        <p className="text-sm font-medium">
          10% de réduction sur tout <Link to="/promo" className="underline font-bold ml-2">Utilisez le code maintenant</Link>
        </p>
        <button 
          onClick={() => setShowBanner(false)}
          className="absolute right-4 text-white hover:text-gray-200"
          aria-label="Close banner"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default PromoBanner;
