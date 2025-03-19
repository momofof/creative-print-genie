
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Index from "@/pages/Index";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import Profile from "@/pages/Profile";
import AuthStateWrapper from "@/components/home/AuthStateWrapper";

// Protected route component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Check if user is logged in from localStorage or session
  const checkAuth = () => {
    const storedSession = localStorage.getItem('supabase.auth.token');
    return !!storedSession;
  };

  const isAuthenticated = checkAuth();

  if (!isAuthenticated) {
    // Save the intended destination for redirect after login
    localStorage.setItem('redirectAfterLogin', window.location.pathname);
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <AuthStateWrapper>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthStateWrapper>
    </Router>
  );
}

export default App;
