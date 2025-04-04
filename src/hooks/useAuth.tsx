
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  useEffect(() => {
    // Check current session when the component mounts
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const { data } = await supabase.auth.getSession();
        setUser(data.session?.user || null);
      } catch (error) {
        console.error("Error checking auth session:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
    
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setIsLoading(false);
        
        // Only redirect if the user has just signed in and we're not already redirecting
        if (event === 'SIGNED_IN' && session && !isRedirecting) {
          setIsRedirecting(true);
          const redirectPath = localStorage.getItem("redirectAfterLogin");
          
          if (redirectPath) {
            // Clear the redirect path first to prevent multiple redirects
            localStorage.removeItem("redirectAfterLogin");
            
            // Use setTimeout to avoid concurrency issues
            setTimeout(() => {
              window.location.href = redirectPath;
              // Reset redirecting state after a short delay
              setTimeout(() => setIsRedirecting(false), 1000);
            }, 0);
          } else {
            setIsRedirecting(false);
          }
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [isRedirecting]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return {
    isLoading,
    user,
    isLoggedIn: !!user,
    signOut
  };
};
