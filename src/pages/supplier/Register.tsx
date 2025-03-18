
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";

const SupplierRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    contactName: "",
    phone: "",
    address: ""
  });
  const [emailExists, setEmailExists] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Reset email exists error when email changes
    if (name === 'email') {
      setEmailExists(false);
    }
  };

  useEffect(() => {
    // Check for user session on mount
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // If user is already logged in, sign them out before registration
        await supabase.auth.signOut();
      }
    };
    
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Register user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        if (authError.message === "User already registered") {
          setEmailExists(true);
          throw new Error("Un compte avec cet email existe déjà");
        }
        throw authError;
      }
      
      if (!authData.user) {
        throw new Error("Erreur lors de la création du compte");
      }

      // 2. Create supplier record with pending status
      const { error: supplierError } = await supabase
        .from("suppliers")
        .insert({
          id: authData.user.id,
          company_name: formData.companyName,
          contact_name: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          status: "pending"
        });

      if (supplierError) throw supplierError;

      toast.success("Inscription réussie ! Votre compte est en cours de validation.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      console.error("Error registering supplier:", error);
      toast.error(error.message || "Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <Store className="h-8 w-8 mr-2 text-teal-600" />
            <h1 className="text-3xl font-bold text-center">Devenir fournisseur</h1>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Informations de l'entreprise</h2>
                
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    Nom de l'entreprise *
                  </label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">
                    Nom du contact
                  </label>
                  <Input
                    id="contactName"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Téléphone
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Adresse
                  </label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Informations d'identification</h2>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1 block w-full ${emailExists ? 'border-red-500' : ''}`}
                    required
                  />
                  {emailExists && (
                    <p className="text-red-500 text-sm mt-1">
                      Un compte avec cet email existe déjà. Veuillez vous connecter ou utiliser un autre email.
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Mot de passe *
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                    required
                    minLength={6}
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirmer le mot de passe *
                  </label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                    required
                    minLength={6}
                  />
                </div>
              </div>
              
              <div>
                <Button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-md"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Inscription en cours...
                    </span>
                  ) : (
                    "S'inscrire comme fournisseur"
                  )}
                </Button>
              </div>
              
              <p className="mt-4 text-center text-sm text-gray-600">
                Déjà inscrit ?{" "}
                <Link to="/login" className="text-teal-600 hover:underline">
                  Se connecter
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierRegister;
