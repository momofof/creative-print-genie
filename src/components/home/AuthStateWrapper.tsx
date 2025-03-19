
import { ReactNode, useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthState {
  isLoggedIn: boolean;
  isLoading: boolean;
  userId: string | null;
  profile: any | null;
}

interface AuthContextType extends AuthState {
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthStateWrapper");
  }
  return context;
};

interface AuthStateWrapperProps {
  children: ReactNode;
}

const AuthStateWrapper = ({ children }: AuthStateWrapperProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    isLoading: true,
    userId: null,
    profile: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check user session on load
    const checkUserSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          // Fetch profile data if user is logged in
          try {
            const { data: profileData } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", data.session.user.id)
              .single();

            setAuthState({
              isLoggedIn: true,
              isLoading: false,
              userId: data.session.user.id,
              profile: profileData,
            });
          } catch (error) {
            console.error("Error fetching profile:", error);
            setAuthState({
              isLoggedIn: true,
              isLoading: false,
              userId: data.session.user.id,
              profile: null,
            });
          }
        } else {
          setAuthState({
            isLoggedIn: false,
            isLoading: false,
            userId: null,
            profile: null,
          });
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setAuthState({
          isLoggedIn: false,
          isLoading: false,
          userId: null,
          profile: null,
        });
      }
    };
    
    checkUserSession();
    
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        try {
          // Fetch profile data when auth state changes
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          setAuthState({
            isLoggedIn: true,
            isLoading: false,
            userId: session.user.id,
            profile: profileData,
          });
        } catch (error) {
          console.error("Error fetching profile:", error);
          setAuthState({
            isLoggedIn: true,
            isLoading: false,
            userId: session.user.id,
            profile: null,
          });
        }
      } else {
        setAuthState({
          isLoggedIn: false,
          isLoading: false,
          userId: null,
          profile: null,
        });
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error signing out:", error);
        toast.error("Erreur lors de la déconnexion");
      } else {
        toast.success("Déconnexion réussie");
        navigate("/");
      }
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthStateWrapper;
