
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Supplier, SupplierResponse } from '@/types/product';
import LoadingSpinner from '@/components/profile/LoadingSpinner';
import { Building2, Users, ShoppingBag, PlusCircle, ChevronRight } from 'lucide-react';

const Pro = () => {
  const [loading, setLoading] = useState(true);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSupplierStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          navigate('/login');
          return;
        }

        const { data: supplierData, error } = await supabase
          .from('suppliers')
          .select('*')
          .eq('email', session.user.email)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (supplierData) {
          // Convert from SupplierResponse to Supplier
          const mappedSupplier: Supplier = {
            id: supplierData.id,
            companyName: supplierData.company_name,
            contactName: supplierData.contact_name,
            email: supplierData.email,
            phone: supplierData.phone,
            address: supplierData.address,
            createdAt: supplierData.created_at,
            status: supplierData.status as 'active' | 'pending' | 'suspended',
          };
          setSupplier(mappedSupplier);
        }
      } catch (error) {
        console.error('Error checking supplier status:', error);
        toast.error('Erreur lors de la vérification du statut fournisseur');
      } finally {
        setLoading(false);
      }
    };

    checkSupplierStatus();
  }, [navigate]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-[60vh]">
          <LoadingSpinner size="large" />
        </div>
      );
    }

    if (!supplier) {
      return (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">Devenez partenaire</h1>
            <p className="text-lg text-gray-600 mb-8">
              Rejoignez notre communauté de fournisseurs et développez votre activité
            </p>
            <Link to="/supplier/register">
              <Button size="lg" className="px-8">
                Inscrire mon entreprise
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <Card className="p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary bg-opacity-10 mb-4 mx-auto">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Une visibilité garantie</h3>
              <p className="text-gray-600 text-center">
                Exposez vos produits à des milliers de clients potentiels chaque jour
              </p>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary bg-opacity-10 mb-4 mx-auto">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Accompagnement dédié</h3>
              <p className="text-gray-600 text-center">
                Notre équipe vous accompagne à chaque étape pour maximiser vos ventes
              </p>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary bg-opacity-10 mb-4 mx-auto">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Commissions attractives</h3>
              <p className="text-gray-600 text-center">
                Bénéficiez de tarifs compétitifs et d'une gestion simplifiée des paiements
              </p>
            </Card>
          </div>
        </div>
      );
    }

    if (supplier.status === 'pending') {
      return (
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Demande en cours de traitement</h1>
          <p className="text-lg text-gray-600 mb-8">
            Votre demande d'inscription en tant que fournisseur est en cours d'examen. 
            Nous vous contacterons dès que votre compte sera activé.
          </p>
          <Card className="p-6 mb-8">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Entreprise:</span>
                  <span className="font-medium">{supplier.companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{supplier.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Statut:</span>
                  <span className="font-medium text-amber-500">En attente d'approbation</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (supplier.status === 'active') {
      return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Tableau de bord fournisseur</h1>
            <Link to="/supplier/dashboard">
              <Button>
                Gérer mes produits
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="p-6">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Votre entreprise</h2>
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nom:</span>
                    <span className="font-medium">{supplier.companyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contact:</span>
                    <span className="font-medium">{supplier.contactName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{supplier.email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Actions rapides</h2>
                </div>
                <div className="space-y-4">
                  <Link to="/supplier/product/new" className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                    <div className="flex items-center">
                      <PlusCircle className="h-5 w-5 mr-3 text-primary" />
                      <span>Ajouter un nouveau produit</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Link>
                  <Link to="/supplier/dashboard" className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                    <div className="flex items-center">
                      <ShoppingBag className="h-5 w-5 mr-3 text-primary" />
                      <span>Gérer mes produits</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      <Navigation />
      <div className="pt-16 lg:pt-24">
        {renderContent()}
      </div>
    </div>
  );
};

export default Pro;
