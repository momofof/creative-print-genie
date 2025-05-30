
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from "@/pages/Index";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import AuthLanding from "@/pages/auth/AuthLanding";
import Profile from "@/pages/Profile";
import Dashboard from "@/pages/Dashboard";
import NewDeposit from "@/pages/NewDeposit";
import PaymentSuccess from "@/pages/PaymentSuccess";
import AuthStateWrapper from "@/components/home/AuthStateWrapper";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default is true
      retry: false,
      staleTime: 30000, // 30 seconds
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthStateWrapper>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthLanding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/new-deposit" element={<NewDeposit />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<Index />} />
          </Routes>
        </AuthStateWrapper>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
