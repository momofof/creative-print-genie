
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, Store } from "lucide-react";
import Navigation from "@/components/Navigation";
import LoadingSpinner from "@/components/profile/LoadingSpinner";

// Schéma de validation du formulaire d'inscription fournisseur
const supplierSchema = z.object({
  companyName: z.string().min(2, "Le nom de l'entreprise doit comporter au moins 2 caractères"),
  contactName: z.string().min(2, "Le nom du contact doit comporter au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().min(10, "Numéro de téléphone invalide").optional(),
  address: z.string().min(5, "L'adresse doit comporter au moins 5 caractères").optional(),
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

export default function SupplierRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Initialiser le formulaire
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  // Vérifier si l'utilisateur est connecté
  React.useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        setUserId(data.session.user.id);
        // Pré-remplir l'email avec celui de l'utilisateur connecté
        form.setValue("email", data.session.user.email || "");
        
        // Vérifier si l'utilisateur est déjà un fournisseur
        const { data: supplierData, error } = await supabase
          .from("suppliers")
          .select("*")
          .eq("id", data.session.user.id)
          .maybeSingle();
        
        if (supplierData) {
          // Rediriger vers le tableau de bord s'il est déjà fournisseur
          navigate("/pro");
          toast.info("Vous êtes déjà enregistré en tant que fournisseur");
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [navigate, form]);

  // Soumettre le formulaire
  const onSubmit = async (data: SupplierFormValues) => {
    if (!userId) {
      toast.error("Vous devez être connecté pour devenir fournisseur");
      navigate("/login");
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Enregistrer le fournisseur dans la base de données
      const { error } = await supabase
        .from("suppliers")
        .insert([
          {
            id: userId,
            company_name: data.companyName,
            contact_name: data.contactName,
            email: data.email,
            phone: data.phone,
            address: data.address,
            status: "pending"
          }
        ]);
      
      if (error) throw error;
      
      toast.success("Votre demande a été soumise avec succès");
      navigate("/pro");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du fournisseur:", error);
      toast.error("Une erreur est survenue lors de l'enregistrement");
    } finally {
      setSubmitting(false);
    }
  };

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-24 flex justify-center">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  if (!userId && !loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-24">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Connexion requise</CardTitle>
              <CardDescription>
                Vous devez être connecté pour vous inscrire en tant que fournisseur
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Veuillez vous connecter ou créer un compte pour continuer votre inscription en tant que fournisseur.
              </p>
              <div className="flex gap-4">
                <Button onClick={() => navigate("/login")}>
                  Se connecter
                </Button>
                <Button variant="outline" onClick={() => navigate("/auth/signup")}>
                  Créer un compte
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-24">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/pro")} 
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold">Devenir fournisseur</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Pourquoi devenir fournisseur ?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="mr-3 mt-1 bg-blue-100 p-1 rounded-full">
                      <Store className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Élargissez votre clientèle</h3>
                      <p className="text-sm text-gray-500">
                        Accédez à des milliers de clients potentiels à la recherche de produits imprimables de qualité.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-3 mt-1 bg-green-100 p-1 rounded-full">
                      <Store className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Gestion simplifiée</h3>
                      <p className="text-sm text-gray-500">
                        Gérez facilement vos produits, stocks et commandes via notre tableau de bord intuitif.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-3 mt-1 bg-purple-100 p-1 rounded-full">
                      <Store className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Paiements sécurisés</h3>
                      <p className="text-sm text-gray-500">
                        Recevez vos paiements de manière sécurisée et régulière, sans complications.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Alert className="mt-6 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-600">
                Votre demande sera examinée par notre équipe dans un délai de 24 à 48 heures ouvrables.
              </AlertDescription>
            </Alert>
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Informations fournisseur</CardTitle>
                <CardDescription>
                  Remplissez ce formulaire pour soumettre votre demande d'inscription
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom de l'entreprise*</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre entreprise" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="contactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom du contact*</FormLabel>
                          <FormControl>
                            <Input placeholder="Prénom et nom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email professionnel*</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="email@entreprise.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone</FormLabel>
                          <FormControl>
                            <Input placeholder="06 12 34 56 78" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adresse</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Adresse complète"
                              rows={3}
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-4">
                      <Button type="submit" className="w-full" disabled={submitting}>
                        {submitting ? (
                          <>
                            <LoadingSpinner size="small" className="mr-2" />
                            Envoi en cours...
                          </>
                        ) : (
                          "Soumettre ma demande"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="text-sm text-gray-500 flex justify-center">
                Les champs marqués d'un * sont obligatoires
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
