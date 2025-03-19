
import { ReactNode } from "react";
import { AuthProvider } from "@/hooks/useAuth";

interface AuthStateWrapperProps {
  children: ReactNode;
}

const AuthStateWrapper = ({ children }: AuthStateWrapperProps) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AuthStateWrapper;
