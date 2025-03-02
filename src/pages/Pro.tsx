
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, ArrowRight, BarChart3, Package, Plus, ShoppingBag, Store, Users } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import LoadingSpinner from "@/components/profile/LoadingSpinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Supplier } from "@/types/product";

export default function Pro() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);

      if (data.session) {
        // Vérifier si l'utilisateur est déjà un fournisseur
        fetchSupplierProfile(data.session.user.id);
      }
    };

    checkSession();

    // Écouter les changements d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        if (newSession) {
          fetchSupplierProfile(newSession.user.id);
        } else {
          setSupplier(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchSupplierProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setSupplier(data as Supplier);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du profil fournisseur:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-24 flex justify-center items-center">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-6">Espace Pro Fournisseurs</h1>
            <p className="text-lg mb-8">
              Connectez-vous ou créez un compte pour accéder à l'espace fournisseur
              et commencer à vendre vos produits imprimables sur notre plateforme.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => navigate("/login")}>
                Se connecter
              </Button>
              <Button variant="outline" onClick={() => navigate("/auth/signup")}>
                Créer un compte
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Devenir Fournisseur</h1>
            <p className="text-lg mb-8 text-center">
              Vous êtes connecté mais vous n'êtes pas encore enregistré comme fournisseur.
              Inscrivez-vous pour commencer à vendre vos produits imprimables.
            </p>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Les avantages de devenir fournisseur</CardTitle>
                <CardDescription>
                  Rejoignez notre plateforme et bénéficiez de nombreux avantages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="mr-3 mt-1 bg-blue-100 p-1 rounded-full">
                      <Store className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <strong>Vitrine en ligne</strong>
                      <p className="text-gray-600">Présentez vos produits à des milliers de clients potentiels sans frais fixes</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-3 mt-1 bg-green-100 p-1 rounded-full">
                      <BarChart3 className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <strong>Statistiques détaillées</strong>
                      <p className="text-gray-600">Suivez vos ventes et analysez les performances de vos produits</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-3 mt-1 bg-purple-100 p-1 rounded-full">
                      <Users className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <strong>Accès à une large clientèle</strong>
                      <p className="text-gray-600">Profitez de notre trafic et de notre marketing pour trouver de nouveaux clients</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => navigate("/supplier/register")}>
                  S'inscrire comme fournisseur
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            
            <Alert className="bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-600">
                L'inscription comme fournisseur est soumise à validation. 
                Nous examinerons votre demande dans les 24 à 48 heures.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  // Si l'utilisateur est un fournisseur en attente
  if (supplier.status === "pending") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-24">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Demande en cours de traitement</CardTitle>
              <CardDescription>
                Votre demande d'inscription en tant que fournisseur est en cours de validation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
                    <AlertCircle className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Demande en attente d'approbation</h3>
                  <p className="text-gray-500 mb-4">
                    Notre équipe examine actuellement votre demande. Ce processus peut prendre jusqu'à 48 heures.
                    Vous recevrez un email dès que votre demande sera validée.
                  </p>
                  <p className="text-sm text-gray-400">
                    Date de demande: {new Date(supplier.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline" onClick={() => navigate("/")}>
                Retour à l'accueil
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // Si l'utilisateur est un fournisseur suspendu
  if (supplier.status === "suspended") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-24">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-red-600">Compte suspendu</CardTitle>
              <CardDescription>
                Votre compte fournisseur a été temporairement suspendu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Accès temporairement restreint</h3>
                  <p className="text-gray-500 mb-4">
                    Votre compte a été suspendu. Veuillez contacter notre service d'assistance pour plus d'informations
                    et résoudre cette situation.
                  </p>
                  <Button onClick={() => navigate("/support/contact")}>
                    Contacter le support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Si l'utilisateur est un fournisseur actif
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tableau de bord fournisseur</h1>
          <Button onClick={() => navigate("/supplier/product/new")}>
            <Plus className="mr-2 h-4 w-4" /> Ajouter un produit
          </Button>
        </div>

        <div className="mb-10">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h2 className="text-xl font-bold">{supplier.companyName}</h2>
                  <p className="text-gray-500">{supplier.email}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Button variant="outline" onClick={() => navigate("/supplier/profile")}>
                    Modifier le profil
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total des produits</p>
                  <h3 className="text-2xl font-bold">0</h3>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Produits publiés</p>
                  <h3 className="text-2xl font-bold">0</h3>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <ShoppingBag className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Brouillons</p>
                  <h3 className="text-2xl font-bold">0</h3>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Package className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Ventes</p>
                  <h3 className="text-2xl font-bold">0 €</h3>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Mes produits</h2>
          <Card>
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Package className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">Aucun produit pour le moment</h3>
              <p className="text-gray-500 mb-6">
                Commencez par ajouter votre premier produit imprimable pour le rendre disponible sur notre plateforme.
              </p>
              <Button onClick={() => navigate("/supplier/product/new")}>
                <Plus className="mr-2 h-4 w-4" /> Ajouter un produit
              </Button>
            </CardContent>
          </Card>
        </div>

        <Alert className="bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-600">
            <strong>Conseil :</strong> Ajoutez des images de haute qualité et des descriptions détaillées pour augmenter les chances de vente de vos produits.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
