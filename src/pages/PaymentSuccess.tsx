
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get("transaction_id");
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const { clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const verifyPayment = async () => {
      if (!transactionId) {
        toast.error("Identifiant de transaction manquant");
        setIsVerifying(false);
        return;
      }

      try {
        // Call the verify-payment edge function
        const { data, error } = await supabase.functions.invoke("verify-payment", {
          body: { transactionId }
        });

        if (error) {
          console.error("Error verifying payment:", error);
          toast.error("Erreur lors de la vérification du paiement");
          setPaymentStatus("failed");
        } else if (data.paymentSuccessful) {
          // Payment was successful
          toast.success("Paiement effectué avec succès!");
          setPaymentStatus("success");
          clearCart(); // Clear the cart after successful payment
        } else {
          // Payment was not successful
          toast.error(`Paiement échoué: ${data.status || 'Statut inconnu'}`);
          setPaymentStatus("failed");
        }
      } catch (error) {
        console.error("Error in payment verification:", error);
        toast.error("Erreur lors de la vérification du paiement");
        setPaymentStatus("failed");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [transactionId, clearCart]);

  return (
    <>
      <Navigation />
      <main className="container mx-auto px-4 py-24 max-w-6xl">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
          {isVerifying ? (
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-accent" />
              <h2 className="text-2xl font-bold mb-2">Vérification du paiement...</h2>
              <p className="text-gray-600">
                Nous vérifions votre paiement. Veuillez patienter.
              </p>
            </div>
          ) : paymentStatus === "success" ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 mx-auto mb-6 text-green-500" />
              <h2 className="text-3xl font-bold mb-4">Paiement réussi!</h2>
              <p className="text-gray-600 mb-8">
                Votre commande a été confirmée et sera traitée dans les plus brefs délais.
              </p>
              <p className="text-sm text-gray-500 mb-2">
                Identifiant de transaction: <span className="font-mono">{transactionId}</span>
              </p>
              <div className="mt-8 space-y-4">
                <Button 
                  onClick={() => navigate("/")} 
                  className="bg-accent hover:bg-accent/90 w-full"
                >
                  Retour à l'accueil
                </Button>
                <Button 
                  onClick={() => navigate("/profile")} 
                  variant="outline" 
                  className="w-full"
                >
                  Voir mes commandes
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="h-16 w-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-4">Paiement échoué</h2>
              <p className="text-gray-600 mb-6">
                Votre paiement n'a pas pu être traité. Veuillez réessayer.
              </p>
              <div className="mt-8 space-y-4">
                <Button 
                  onClick={() => navigate("/cart")} 
                  className="bg-accent hover:bg-accent/90 w-full"
                >
                  Retourner au panier
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PaymentSuccess;
