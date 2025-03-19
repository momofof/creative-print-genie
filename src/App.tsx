
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from "@/pages/Index";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import AuthLanding from "@/pages/auth/AuthLanding";
import Profile from "@/pages/Profile";
import AuthStateWrapper from "@/components/home/AuthStateWrapper";

function App() {
  return (
    <Router>
      <AuthStateWrapper>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthLanding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Index />} />
        </Routes>
      </AuthStateWrapper>
    </Router>
  );
}

export default App;
