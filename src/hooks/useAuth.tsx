
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  isLoggedIn: boolean;
  isSupplier: boolean;
  userId: string | null;
  checkingAuth: boolean;
  signOut: () => Promise<void>;
}

const defaultContext: AuthContextType = {
  isLoggedIn: false,
  isSupplier: false,
  userId: null,
  checkingAuth: true,
  signOut: async () => {}
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSupplier, setIsSupplier] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data.session;
        
        setIsLoggedIn(!!session);
        
        if (session) {
          setUserId(session.user.id);
          
          // Check if user is a supplier
          const { data: supplierData } = await supabase
            .from('suppliers')
            .select('id')
            .eq('id', session.user.id)
            .single();
          
          setIsSupplier(!!supplierData);
        } else {
          setUserId(null);
          setIsSupplier(false);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setCheckingAuth(false);
      }
    };
    
    checkUserSession();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsLoggedIn(!!session);
      
      if (session) {
        setUserId(session.user.id);
        
        try {
          // Check if user is a supplier
          const { data: supplierData } = await supabase
            .from('suppliers')
            .select('id')
            .eq('id', session.user.id)
            .single();
          
          setIsSupplier(!!supplierData);
        } catch (error) {
          console.error("Error checking supplier status:", error);
          setIsSupplier(false);
        }
      } else {
        setUserId(null);
        setIsSupplier(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isSupplier, userId, checkingAuth, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
