
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const checkAuthentication = async (): Promise<boolean> => {
  const { data } = await supabase.auth.getSession();
  
  if (!data.session) {
    toast.error("Vous devez être connecté pour accéder à cette page");
    return false;
  }
  
  return true;
};

export const getCurrentUser = async () => {
  const { data: userData, error } = await supabase.auth.getUser();
  
  if (error || !userData.user) {
    throw new Error("Utilisateur non authentifié");
  }
  
  return userData.user;
};
