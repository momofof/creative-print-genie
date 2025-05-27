
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCheckout } from '@/hooks/useCheckout';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Shield, ArrowLeft, Calculator, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import LoginDialog from '@/components/cart/LoginDialog';

const NewDeposit = () => {
  const { user, isLoading } = useAuth();
  const {
    isProcessingPayment,
    loginDialogOpen,
    setLoginDialogOpen,
    handleDepositCheckout,
    handleLogin
  } = useCheckout();
  
  const [formData, setFormData] = useState({
    sellerUsername: '',
    sellerName: '',
    productName: '',
    productDescription: '',
    productLink: '',
    amount: '',
    orderDate: new Date().toISOString().split('T')[0],
    estimatedDeliveryDate: '',
  });

  const applicationFeeRate = 0.025; // 2.5%
  const amount = parseFloat(formData.amount) || 0;
  const applicationFee = amount * applicationFeeRate;
  const totalAmount = amount + applicationFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Vous devez être connecté pour effectuer un dépôt");
      return;
    }

    if (!formData.sellerUsername || !formData.amount || !formData.productName) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (!formData.estimatedDeliveryDate) {
      toast.error("Veuillez indiquer une date de livraison estimée");
      return;
    }

    if (!formData.productDescription) {
      toast.error("Veuillez ajouter une description détaillée");
      return;
    }

    // Prepare deposit data for CinetPay payment
    const depositData = {
      sellerUsername: formData.sellerUsername,
      sellerName: formData.sellerName || formData.sellerUsername,
      productName: formData.productName,
      productDescription: formData.productDescription,
      productLink: formData.productLink,
      amount: amount,
      estimatedDeliveryDate: formData.estimatedDeliveryDate,
    };

    // Use the existing CinetPay checkout system
    await handleDepositCheckout(depositData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-32 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="h-16 w-16 text-blue-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Accès restreint</h1>
            <p className="text-gray-600 mb-8">Vous devez être connecté pour effectuer un dépôt.</p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link to="/auth">Se connecter</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button asChild variant="ghost" className="mb-4">
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au tableau de bord
              </Link>
            </Button>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Nouveau Dépôt Sécurisé
            </h1>
            <p className="text-gray-600">
              Sécurisez votre achat avec SafePay XOF
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Informations du Dépôt
                  </CardTitle>
                  <CardDescription>
                    Remplissez les détails de votre transaction sécurisée
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Seller Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Informations du Vendeur</h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="sellerUsername">
                            Nom d'utilisateur du Vendeur <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="sellerUsername"
                            name="sellerUsername"
                            value={formData.sellerUsername}
                            onChange={handleInputChange}
                            placeholder="@nom_utilisateur"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="sellerName">Nom du Vendeur</Label>
                          <Input
                            id="sellerName"
                            name="sellerName"
                            value={formData.sellerName}
                            onChange={handleInputChange}
                            placeholder="Nom complet du vendeur"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Product Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Informations du Produit/Service</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="productName">
                          Nom du Produit/Service <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="productName"
                          name="productName"
                          value={formData.productName}
                          onChange={handleInputChange}
                          placeholder="Ex: iPhone 14, Service de design..."
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="productDescription">
                          Description Détaillée <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="productDescription"
                          name="productDescription"
                          value={formData.productDescription}
                          onChange={handleInputChange}
                          placeholder="Décrivez en détail le produit ou service (spécifications, couleur, modèle, etc.)"
                          rows={4}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="productLink">Lien du Produit/Service (optionnel)</Label>
                        <Input
                          id="productLink"
                          name="productLink"
                          type="url"
                          value={formData.productLink}
                          onChange={handleInputChange}
                          placeholder="https://..."
                        />
                      </div>
                    </div>

                    {/* Transaction Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Détails de la Transaction</h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="amount">
                            Montant (XOF) <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="amount"
                            name="amount"
                            type="number"
                            min="0"
                            step="1"
                            value={formData.amount}
                            onChange={handleInputChange}
                            placeholder="50000"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="estimatedDeliveryDate">
                            Date de livraison estimée <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="estimatedDeliveryDate"
                            name="estimatedDeliveryDate"
                            type="date"
                            value={formData.estimatedDeliveryDate}
                            onChange={handleInputChange}
                            min={new Date().toISOString().split('T')[0]}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6">
                      <Button 
                        type="submit" 
                        disabled={isProcessingPayment}
                        className="w-full bg-blue-600 hover:bg-blue-700 h-12"
                      >
                        {isProcessingPayment ? (
                          "Redirection vers CinetPay..."
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-5 w-5" />
                            Valider et Payer ({totalAmount.toLocaleString()} XOF)
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Récapitulatif
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Montant du produit/service:</span>
                      <span className="font-medium">{amount.toLocaleString()} XOF</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Frais SafePay (2.5%):</span>
                      <span className="font-medium">{applicationFee.toLocaleString()} XOF</span>
                    </div>
                    
                    <hr className="my-2" />
                    
                    <div className="flex justify-between font-semibold">
                      <span>Total à payer:</span>
                      <span className="text-blue-600">{totalAmount.toLocaleString()} XOF</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">💡 Comment ça marche ?</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Vos fonds sont sécurisés</li>
                      <li>• Le vendeur est notifié</li>
                      <li>• Livraison du produit/service</li>
                      <li>• Vous confirmez la réception</li>
                      <li>• Les fonds sont libérés</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">✅ Avantages</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Protection acheteur</li>
                      <li>• Sécurité garantie</li>
                      <li>• Paiement sécurisé</li>
                      <li>• Support 24/7</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <LoginDialog 
        open={loginDialogOpen} 
        onOpenChange={setLoginDialogOpen} 
        onLogin={handleLogin} 
      />

      <Footer />
    </div>
  );
};

export default NewDeposit;
