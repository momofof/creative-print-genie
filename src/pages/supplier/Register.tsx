import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const formSchema = z.object({
  email: z.string().email({ message: "Adresse e-mail invalide" }),
  password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
  confirmPassword: z.string(),
  fullName: z.string().min(2, { message: "Le nom complet doit contenir au moins 2 caractères" }),
  companyName: z.string().min(2, { message: "Le nom de l'entreprise doit contenir au moins 2 caractères" }),
  phone: z.string().min(10, { message: "Numéro de téléphone invalide" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

const Register = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Create supplier account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      
      if (authError) throw authError;
      
      if (authData.user) {
        // Instead of using profiles table which is not defined in types
        // We directly update the user metadata
        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            company_name: data.companyName,
            full_name: data.fullName,
            phone: data.phone
          }
        });
        
        if (updateError) throw updateError;
        
        toast.success("Compte fournisseur créé avec succès!");
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Erreur lors de la création du compte");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid h-screen place-items-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Créer un compte Fournisseur</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Adresse e-mail</Label>
              <Input id="email" type="email" placeholder="exemple@exemple.com" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fullName">Nom complet</Label>
              <Input id="fullName" placeholder="John Doe" {...register("fullName")} />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="companyName">Nom de l'entreprise</Label>
              <Input id="companyName" placeholder="Acme Corp" {...register("companyName")} />
              {errors.companyName && (
                <p className="text-sm text-red-500">{errors.companyName.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Numéro de téléphone</Label>
              <Input id="phone" placeholder="06XXXXXXXX" {...register("phone")} />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
            <Button disabled={isSubmitting} type="submit" className="w-full">
              {isSubmitting ? "Création du compte..." : "Créer le compte"}
            </Button>
          </form>
          <div className="text-sm text-gray-500 text-center">
            Vous avez déjà un compte ?{" "}
            <Link to="/login" className="text-teal-500 hover:underline">
              Se connecter
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
